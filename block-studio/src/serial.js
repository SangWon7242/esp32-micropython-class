// Experimental Web Serial REPL transport for ESP32 with MicroPython firmware.
// Raw REPL flow-control/ACK handling must be added before production classroom use.
const encoder = new TextEncoder();
const sleep = ms => new Promise(resolve=>setTimeout(resolve,ms));

export class Esp32Serial {
  constructor(onText) { this.port=null;this.reader=null;this.writer=null;this.onText=onText;this.cancelRead=false; }
  async connect() {
    if (typeof navigator==='undefined'||!('serial' in navigator)) throw new Error('PC Chrome/Edge의 HTTPS 또는 localhost에서 Web Serial을 사용하세요.');
    this.port=await navigator.serial.requestPort();
    await this.port.open({baudRate:115200});
    this.writer=this.port.writable.getWriter();
    this.reader=this.port.readable.getReader();
    this.cancelRead=false;
    void this.readLoop();
  }
  async readLoop() {
    const decoder = new TextDecoder();
    try {
      while(!this.cancelRead&&this.reader) {
        const {value,done}=await this.reader.read();
        if(done)break;
        if(value)this.onText(decoder.decode(value,{stream:true}));
      }
    } catch(error) {if(!this.cancelRead)this.onText(`\n[시리얼 오류] ${error.message}\n`);}
  }
  async write(bytes) {
    if (!this.writer)throw new Error('먼저 USB 연결을 완료하세요.');
    await this.writer.write(typeof bytes==='string'?encoder.encode(bytes):bytes);
  }
  async run(code) {
    // Conservative low-speed raw REPL sender; some firmware revisions need ACK protocol.
    await this.write(new Uint8Array([3,3,2]));
    await sleep(150);
    await this.write(new Uint8Array([1]));
    await sleep(200);
    const bytes=encoder.encode(code);
    for(let i=0;i<bytes.length;i+=16){await this.write(bytes.slice(i,i+16));await sleep(16);}
    await this.write(new Uint8Array([4]));
  }
  async stop() { await this.write(new Uint8Array([3,3,2])); }
  async disconnect() {
    this.cancelRead=true;
    try{await this.reader?.cancel();}catch{}
    try{this.reader?.releaseLock();}catch{}
    try{this.writer?.releaseLock();}catch{}
    try{await this.port?.close();}catch{}
    this.reader=null;this.writer=null;this.port=null;
  }
}
