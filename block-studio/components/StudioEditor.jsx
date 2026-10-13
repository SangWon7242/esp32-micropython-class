'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {parseMicroPython} from '../src/parser.mjs';
import {Esp32Serial} from '../src/serial';

export default function StudioEditor({initialCode,onChange,mode='hybrid',allowedBlocks=null}) {
  const host=useRef(null), active=useRef(null), serial=useRef(null),onChangeRef=useRef(onChange),delay=useRef(null),lock=useRef(false);
  const [code,setCode]=useState(initialCode),[status,setStatus]=useState('편집기 준비 중…'),[terminal,setTerminal]=useState('[ESP32] 블록과 Python을 양방향으로 연결합니다.\n'),[connected,setConnected]=useState(false),[busy,setBusy]=useState(false),[deviceState,setDeviceState]=useState('disconnected');
  onChangeRef.current=onChange;
  const append=useCallback(message=>setTerminal(old=>(old+message).slice(-18000)),[]);
  useEffect(()=>{
    if(mode==='python'){setStatus('Python 전용 미션: 코드를 직접 수정하세요. 블록 편집기는 숨겨져 있습니다.');return;}
    let disposed=false;
    (async()=>{
      try {
        const [Blockly,py,defs]=await Promise.all([import('blockly/core'),import('blockly/python'),import('blockly/blocks')]);
        if(disposed||!host.current)return;
        const {setupBlockly,toolboxFor,rebuildBlocks,toMicroPython}=await import('../src/blockly');
        setupBlockly(Blockly,py.pythonGenerator);
        const workspace=Blockly.inject(host.current,{toolbox:toolboxFor(allowedBlocks),trashcan:true,grid:{spacing:22,length:3,colour:'#e2e8f1',snap:true},zoom:{controls:true,wheel:true,startScale:0.92,maxScale:1.7,minScale:0.45},move:{scrollbars:true,drag:true,wheel:true}});
        active.current={Blockly,workspace,pythonGenerator:py.pythonGenerator,rebuildBlocks,toMicroPython};
        lock.current=true;
        try{rebuildBlocks(workspace,Blockly,parseMicroPython(initialCode));}catch(err){setStatus(`초기 코드 변환 경고: ${err.message}`);}
        lock.current=false;
        workspace.addChangeListener(event=>{
          if(lock.current || event.isUiEvent || event.type===Blockly.Events.FINISHED_LOADING)return;
          const next=toMicroPython(workspace,py.pythonGenerator);
          setCode(next);onChangeRef.current(next,'blocks');setStatus('블록 → MicroPython 자동 동기화');
        });
        Blockly.svgResize(workspace);setStatus('블록을 조립하거나 Python 코드를 수정해 보세요.');
      } catch(err) {if(!disposed)setStatus(`Blockly 로드 실패: ${err.message}`);}
    })();
    const resizer=new ResizeObserver(()=>{if(active.current)active.current.Blockly.svgResize(active.current.workspace);});
    if(host.current)resizer.observe(host.current);
    return ()=>{disposed=true;resizer.disconnect();clearTimeout(delay.current);if(active.current){active.current.workspace.dispose();active.current=null;}void serial.current?.disconnect();};
  },[initialCode,mode,allowedBlocks]);
  const textEdited=value=>{
    setCode(value);onChangeRef.current(value,'python');
    clearTimeout(delay.current);
    delay.current=setTimeout(()=>{
      if(!active.current)return;
      try {
        const nodes=parseMicroPython(value);
        lock.current=true;
        active.current.rebuildBlocks(active.current.workspace,active.current.Blockly,nodes);
        lock.current=false;
        setStatus('MicroPython → 블록 동기화 완료');
      }catch(err){lock.current=false;setStatus(`역변환 보류: ${err.message} (기존 블록 유지)`);}
    },500);
  };
  const connect=async()=>{
    try {const instance=new Esp32Serial(append,state=>{setDeviceState(state);if(state==='disconnected'){setConnected(false);if(!instance.closing)void instance.disconnect().catch(()=>{});}});await instance.connect();serial.current=instance;setConnected(true);}
    catch(err){append(`[USB] ${err.message}\n`);}
  };
  const run=async()=>{
    if(!serial.current)return;
    setBusy(true);
    try {
      parseMicroPython(code); // fail closed: never send unrecognized code
      append('\n[실행] MicroPython raw-paste 전송 시작. 장치 회로를 확인하세요.\n');
      await serial.current.run(code);
      append('[실행] 장치가 코드 수신을 확인했습니다. 실제 센서의 움직임은 직접 관찰하세요.\n');
    }catch(err){append(`[실행 실패] ${err.message}\n`);}finally{setBusy(false);}
  };
  const stop=async()=>{try{await serial.current?.stop();append('[중지] Ctrl-C 명령 전송.\n');}catch(err){append(`[중지 오류] ${err.message}\n`);}};
  const disconnect=async()=>{try{await serial.current?.disconnect();}finally{serial.current=null;setConnected(false);append('[USB] 연결 해제\n');}};
  return <div className={`studio-shell ${mode==='python'?'python-only':''}`}>
    {mode!=='python'&&<div className="editor-pane">
      <div className="pane-title"><span className="pane-led blue"/> 블록코딩 <span className="pane-sub">블록을 끌어 연결하세요</span></div>
      <div ref={host} className="blockly-host" aria-label="Blockly 블록 편집기"/>
    </div>}
    <div className="code-pane">
      <div className="pane-title"><span className="pane-led mint"/> MicroPython <span className="pane-sub">{mode==='python'?'Python 직접 작성':mode==='blocks'?'블록에서 자동 변환 · 읽기 전용':'양방향 변환'}</span></div>
      <textarea className="python-code" spellCheck="false" readOnly={mode==='blocks'} aria-label="MicroPython 코드" value={code} onChange={e=>textEdited(e.target.value)}/>
      <p className="editor-status">{status}</p>
      <div className="terminal-bar"><span>시리얼 모니터</span><button className="small-button" onClick={()=>setTerminal('')}>지우기</button></div>
      <pre className="terminal" aria-live="polite">{terminal}</pre><div className="device-state" role="status">ESP32 연결 상태: {deviceState==='disconnected'?'연결 안 됨':deviceState==='connected'?'USB 연결됨':deviceState==='uploading'?'코드 전송 중':deviceState==='running'?'장치 코드 수신 확인 · 관찰 필요':deviceState}</div>
      <div className="device-controls">
        {!connected ? <button className="action subtle" onClick={connect}>USB 연결 (Chrome/Edge)</button> : <button className="action subtle" onClick={disconnect}>연결 해제</button>}
        <button className="action primary" onClick={run} disabled={!connected||busy}>▶ 실행</button>
        <button className="action subtle" onClick={stop} disabled={!connected}>■ 중지 / 복구</button>
      </div>
      <p className="hardware-note">MicroPython raw-paste 지원 펌웨어 필요 · PC Chrome/Edge HTTPS 또는 localhost 전용 · 업로드 완료와 실제 LED/센서 동작은 다릅니다. 전송 전에 배선과 3.3V 정격을 확인하세요.</p>
    </div>
  </div>;
}
