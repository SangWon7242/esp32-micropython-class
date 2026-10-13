/**
 * Web Serial transport for a MicroPython ESP32, using raw-paste flow control.
 * Protocol: https://docs.micropython.org/en/v1.27.0/reference/repl.html
 * Only explicit, user-clicked operations write to the board. No firmware flashing.
 * A transport ACK is not proof that the external LED/sensor worked.
 */
const CTRL = Object.freeze({C:3, B:2, A:1, D:4});
const encoder = new TextEncoder();
const decoder = () => new TextDecoder();
const sleep = ms => new Promise(resolve => setTimeout(resolve,ms));

export class SerialTimeoutError extends Error {constructor(message){super(message);this.name='SerialTimeoutError';}}

export class Esp32Serial {
  constructor(onText=()=>{}, onState=()=>{}, {serialApi=null, timeoutMs=3500}={}) {
    this.onText=onText;this.onState=onState;this.api=serialApi;this.timeoutMs=timeoutMs;
    this.port=null;this.reader=null;this.writer=null;this.readTask=null;this.closing=false;
    this.connected=false;this.state='disconnected';this.bytes=[];this.waiter=null;
    this.capture=false;this.inFlight=false;this.decoder=decoder();
  }
  stateChange(state){this.state=state;this.onState(state);}
  getSerialApi(){return this.api||(typeof navigator!=='undefined'?navigator.serial:null);}
  async connect() {
    if(this.connected)throw new Error('이미 연결된 장치가 있습니다.');
    const api=this.getSerialApi();
    if(!api||typeof api.requestPort!=='function')throw new Error('PC Chrome/Edge, HTTPS 또는 localhost에서 Web Serial을 사용하세요.');
    const port=await api.requestPort(); // MUST be called from click handler, before awaiting anything else.
    try {
      await port.open({baudRate:115200,bufferSize:8192});
      this.port=port;this.reader=port.readable.getReader();this.writer=port.writable.getWriter();
      this.closing=false;this.connected=true;this.stateChange('connected');
      this.readTask=this.readLoop();
      this.onText('[USB] 연결되었습니다. MicroPython 펌웨어와 센서 배선을 확인하세요.\n');
    }catch(error){
      try{await port.close();}catch{}
      this.stateChange('disconnected');throw error;
    }
  }
  async readLoop() {
    try {
      while(!this.closing){
        const {done,value}=await this.reader.read();
        if(done)break;
        if(!value)continue;
        if(this.capture){
          for(const b of value){this.bytes.push(b);}
          // Handshake receives small buffers; never retain unbounded sensor output.
          if(this.bytes.length>32768)this.bytes.splice(0,this.bytes.length-32768);
          if(this.waiter){const wake=this.waiter;this.waiter=null;wake();}
        }
        // Framing/control bytes must not appear as gibberish in the student console.
        const readable=Uint8Array.from(value.filter(v=>v===10||v===13||v===9||(v>=32&&v!==127)));
        if(readable.length)this.onText(this.decoder.decode(readable,{stream:true}));
      }
    }catch(error){if(!this.closing)this.onText(`[USB 읽기 오류] ${error.message}\n`);}
    finally {
      try{this.reader?.releaseLock();}catch{}
      this.reader=null;
      if(!this.closing){
        this.connected=false;this.stateChange('disconnected');
        if(this.waiter){const wake=this.waiter;this.waiter=null;wake();}
        this.onText('[USB] 장치가 분리되었거나 읽기가 종료되었습니다.\n');
      }
    }
  }
  captureStart(){this.capture=true;this.bytes=[];}
  captureStop(){this.capture=false;this.bytes=[];}
  async receiveByte(timeout=this.timeoutMs) {
    const limit=Date.now()+timeout;
    while(!this.bytes.length){
      if(!this.connected||this.closing)throw new Error('USB 연결이 끊어졌습니다.');
      const remaining=limit-Date.now();
      if(remaining<=0)throw new SerialTimeoutError('ESP32 응답이 없습니다. 다른 시리얼 모니터를 종료하고 펌웨어 및 포트를 확인하세요.');
      await new Promise(resolve=>{
        const timer=setTimeout(()=>{if(this.waiter===wake)this.waiter=null;resolve();},remaining);
        const wake=()=>{clearTimeout(timer);resolve();};
        this.waiter=wake;
        if(this.bytes.length)wake();
      });
    }
    return this.bytes.shift();
  }
  async expectBytes(expected, timeout=this.timeoutMs){
    const limit=Date.now()+timeout;
    for(const byte of expected){
      if(await this.receiveByte(Math.max(1,limit-Date.now()))!==byte)throw new Error('예상하지 못한 MicroPython REPL 응답입니다. Ctrl-C로 복구한 뒤 재시도하세요.');
    }
  }
  async receiveUntil(bytes, timeout=this.timeoutMs) {
    const limit=Date.now()+timeout;let match=0;
    while(Date.now()<limit){
      const value=await this.receiveByte(Math.max(1,limit-Date.now()));
      match=value===bytes[match]?match+1:(value===bytes[0]?1:0);
      if(match===bytes.length)return;
    }
    throw new SerialTimeoutError('MicroPython REPL 프롬프트를 찾지 못했습니다.');
  }
  async write(bytes){
    if(!this.connected||!this.writer)throw new Error('먼저 ESP32 USB를 연결하세요.');
    await this.writer.write(typeof bytes==='string'?encoder.encode(bytes):Uint8Array.from(bytes));
  }
  async run(code) {
    if(this.inFlight)throw new Error('전송 중입니다. 완료 후 재시도하세요.');
    if(!this.connected)throw new Error('USB가 연결되지 않았습니다.');
    if(typeof code!=='string'||!code.trim())throw new Error('전송할 코드가 없습니다.');
    const program=encoder.encode(code.endsWith('\n')?code:code+'\n');
    if(program.length>32768)throw new Error('교육용 편집기에서 32KB 이하 코드만 전송할 수 있습니다.');
    this.inFlight=true;this.stateChange('uploading');this.captureStart();
    try {
      // Interrupt previous code; CTRL-B restores friendly prompt, CTRL-A enters raw REPL.
      await this.write([CTRL.C,CTRL.C,CTRL.B]);
      await sleep(100);
      this.bytes=[];
      await this.write([CTRL.A]);
      await this.receiveUntil(encoder.encode('raw REPL; CTRL-B to exit\r\n>'),2500);
      await this.write([5,65,1]); // Ctrl-E, 'A', Ctrl-A: negotiate raw-paste.
      const first=await this.receiveByte(),second=await this.receiveByte();
      if(first!==82||second!==1){
        throw new Error('이 MicroPython 펌웨어는 raw-paste 모드를 지원하지 않습니다. 펌웨어를 확인하세요. 불안정한 일반 전송으로 자동 전환하지 않습니다.');
      }
      const low=await this.receiveByte(),high=await this.receiveByte();
      const window=low|(high<<8);
      if(window<1||window>8192)throw new Error('raw-paste 전송 창 크기가 유효하지 않습니다.');
      let available=window,pos=0;
      while(pos<program.length){
        if(available===0){
          const credit=await this.receiveByte();
          if(credit===1){available+=window;continue;}
          if(credit===4)throw new Error('장치가 전송을 거부했습니다. 메모리 또는 펌웨어 상태를 확인하세요.');
          throw new Error('raw-paste 흐름 제어 오류');
        }
        const size=Math.min(available,program.length-pos,window);
        await this.write(program.slice(pos,pos+size));pos+=size;available-=size;
      }
      await this.write([CTRL.D]);
      // The first 0x04 means the code was received/compiled. The program may run forever.
      await this.receiveUntil([CTRL.D],this.timeoutMs);
      this.stateChange('running');
      this.onText('\n[ESP32] 코드 수신 확인. 실제 센서/LED 동작은 직접 관찰하세요.\n');
      return {uploaded:true,execution:'started-or-running'};
    }catch(error){
      this.onText(`[USB 전송 실패] ${error.message}\n`);
      await this.recover();
      throw error;
    }finally{this.captureStop();this.inFlight=false;if(this.connected&&this.state==='uploading')this.stateChange('connected');}
  }
  async recover(){
    if(!this.connected)return;
    try{await this.write([CTRL.C,CTRL.C,CTRL.B]);}catch{}
    if(this.connected)this.stateChange('connected');
  }
  async stop(){
    if(!this.connected)return;
    await this.write([CTRL.C,CTRL.C]);
    await sleep(75);
    await this.write([CTRL.B]);
    this.onText('\n[ESP32] 중지 신호를 보냈습니다. LED가 켜진 상태로 남으면 전원을 분리한 뒤 배선을 확인하세요.\n');
    this.stateChange('connected');
  }
  async disconnect(){
    if(!this.port)return;
    this.closing=true;this.connected=false;
    try{await this.reader?.cancel();}catch{}
    try{await this.readTask;}catch{}
    try{this.writer?.releaseLock();}catch{}
    try{await this.port.close();}catch{}
    this.writer=null;this.reader=null;this.port=null;this.captureStop();this.inFlight=false;
    this.stateChange('disconnected');
  }
}
