import test from 'node:test';
import assert from 'node:assert/strict';
import {Esp32Serial} from '../src/serial.js';

function mockSerial({rawPaste=true,window=32}={}){
 const rx=[],readers=[],writes=[];let closed=false;let collected=[];
 const push=bytes=>{const packet=Uint8Array.from(typeof bytes==='string'?new TextEncoder().encode(bytes):bytes);const wake=readers.shift();if(wake)wake({value:packet,done:false});else rx.push(packet);};
 const port={
   readable:{getReader(){return {read(){if(rx.length)return Promise.resolve({value:rx.shift(),done:false});return new Promise(resolve=>readers.push(resolve));},cancel(){const wake=readers.shift();if(wake)wake({done:true});return Promise.resolve();},releaseLock(){}};}},
   writable:{getWriter(){return {async write(data){const a=Array.from(data);writes.push(a);if(a.length===1&&a[0]===1){push('\r\nraw REPL; CTRL-B to exit\r\n>');return;}
       if(a.join(',')==='5,65,1'){push(rawPaste?[82,1,window&255,window>>8,1]:[82,0]);return;}
       if(a.length===1&&a[0]===4){push([4]);push('hello student\r\n');push([4,4,62]);return;}
       if(a[0]!==3&&a[0]!==2){collected.push(...a);if(collected.length%window===0)push([1]);}
     },releaseLock(){}};}},
   async open(o){assert.equal(o.baudRate,115200);},async close(){closed=true;}
 };
 return {api:{async requestPort(){return port;}},writes,content:()=>new TextDecoder().decode(Uint8Array.from(collected)),isClosed:()=>closed};
}

test('raw-paste handshake, multi-window payload, start and stop',async()=>{
 const device=mockSerial(),texts=[],states=[];
 const serial=new Esp32Serial(msg=>texts.push(msg),state=>states.push(state),{serialApi:device.api});
 await serial.connect();
 const code='from machine import Pin\n'+'print("hello student")\n'.repeat(8);
 assert.deepEqual(await serial.run(code),{uploaded:true,execution:'started-or-running'});
 assert.equal(device.content(),code);
 assert.ok(states.includes('uploading'));
 assert.ok(states.includes('running'));
 assert.ok(texts.join('').includes('hello student'));
 await serial.stop();assert.equal(serial.state,'connected');
 await serial.disconnect();assert.ok(device.isClosed());assert.equal(serial.state,'disconnected');
});

test('unsupported raw-paste firmware fails closed with recovery',async()=>{
 const device=mockSerial({rawPaste:false}),serial=new Esp32Serial(()=>{},()=>{},{serialApi:device.api});
 await serial.connect();
 await assert.rejects(serial.run('print(1)'),/지원하지 않습니다/);
 assert.equal(serial.state,'connected');
 assert.ok(device.writes.some(a=>a.join(',')==='3,3,2'));
 await serial.disconnect();
});

test('USB connection rejects unsupported context',async()=>{
 const serial=new Esp32Serial(()=>{},()=>{},{serialApi:{}});
 await assert.rejects(serial.connect(),/Web Serial/);
});
