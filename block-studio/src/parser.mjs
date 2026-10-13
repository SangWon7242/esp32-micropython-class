// ESP32 Block Studio: conservative MicroPython -> block statement parser.
// Only documented, reversible subset; never guesses at arbitrary Python.
export const DEFAULT_CODE = `from machine import Pin\nimport time\n\nwhile True:\n    Pin(26, Pin.OUT).value(1)\n    time.sleep_ms(500)\n    Pin(26, Pin.OUT).value(0)\n    time.sleep_ms(500)\n`;

function fail(line, reason) { throw new Error(`${line}행: ${reason}`); }
function nrange(value, min, max, line, label) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min || n > max) fail(line, `${label} 범위는 ${min}~${max}입니다.`);
  return String(n);
}
function validatePin(pin, line, mode) {
  const allowed = mode === 'adc' ? [32,33,34,35,36,39] : mode === 'input' ? [4,5,13,14,18,19,21,22,23,25,26,27,32,33,34,35,36,39] : [2,4,5,13,14,16,17,18,19,21,22,23,25,26,27,32,33];
  const p = Number(pin);
  if (!allowed.includes(p)) fail(line, `GPIO ${pin}은 현재 ${mode} 블록에서 지원하지 않습니다. 보드 핀맵을 확인하세요.`);
  return String(p);
}
const IMPORTS = new Set(['from machine import Pin','from machine import Pin, ADC','from machine import Pin, PWM','from machine import Pin, ADC, PWM','from machine import Pin, PWM, ADC','import time','import dht','import neopixel','import machine']);
export function parseMicroPython(source) {
  const cleaned = source.replace(/\r\n?/g,'\n').replace(/\t/g,'    ');
  const lines = cleaned.split('\n');
  let pos = 0;
  function nextNonempty() {
    while(pos < lines.length && (!lines[pos].trim() || /^\s*#/.test(lines[pos]))) pos++;
  }
  function walk(indent, depth) {
    if(depth>14) fail(pos+1,'중첩이 너무 깊습니다.');
    const nodes=[];
    while(true) {
      nextNonempty();
      if(pos >= lines.length) break;
      const raw=lines[pos];
      const space=(raw.match(/^ */)||[''])[0].length;
      if(space<indent) break;
      if(space>indent) fail(pos+1, '들여쓰기 수준이 올바르지 않습니다. 공백 4칸을 사용하세요.');
      let s=raw.trim().replace(/\s+#.*$/, '');
      const lineNo=pos+1;
      pos++;
      if(indent===0 && IMPORTS.has(s)) continue;
      if(s==='pass') continue;
      let m;
      if((m=/^while\s+True\s*:\s*$/.exec(s))) {
        nodes.push({type:'esp_forever', fields:{}, children: walk(indent+4, depth+1)}); continue;
      }
      if((m=/^for\s+_\s+in\s+range\(\s*(\d+)\s*\)\s*:\s*$/.exec(s))) {
        nodes.push({type:'esp_repeat', fields:{COUNT:nrange(m[1],1,1000,lineNo,'반복 횟수')},children: walk(indent+4,depth+1)}); continue;
      }
      if((m=/^if\s+Pin\((\d+),\s*Pin\.IN,\s*Pin\.PULL_UP\)\.value\(\)\s*==\s*0\s*:\s*$/.exec(s))) {
        nodes.push({type:'esp_button_if',fields:{PIN:validatePin(m[1],lineNo,'input')}, children: walk(indent+4,depth+1)}); continue;
      }
      if((m=/^Pin\((\d+),\s*Pin\.OUT\)\.value\(([01])\)$/.exec(s))) {
        nodes.push({type:'esp_output',fields:{PIN:validatePin(m[1],lineNo,'output'),VALUE:m[2]}}); continue;
      }
      if((m=/^time\.sleep_ms\((\d+)\)$/.exec(s))) {
        nodes.push({type:'esp_wait',fields:{MS:nrange(m[1],1,60000,lineNo,'대기 시간')}}); continue;
      }
      if((m=/^print\(Pin\((\d+),\s*Pin\.IN\)\.value\(\)\)$/.exec(s))) {
        nodes.push({type:'esp_input',fields:{PIN:validatePin(m[1],lineNo,'input')}}); continue;
      }
      if((m=/^print\(ADC\(Pin\((\d+)\)\)\.read_u16\(\)\)$/.exec(s))) {
        nodes.push({type:'esp_adc',fields:{PIN:validatePin(m[1],lineNo,'adc')}}); continue;
      }
      if((m=/^PWM\(Pin\((\d+)\),\s*freq=(\d+),\s*duty_u16=(\d+)\)$/.exec(s))) {
        nodes.push({type:'esp_pwm',fields:{PIN:validatePin(m[1],lineNo,'output'),FREQ:nrange(m[2],1,20000,lineNo,'PWM 주파수'),DUTY:nrange(m[3],0,65535,lineNo,'PWM 듀티')}}); continue;
      }
      if((m=/^sensor\s*=\s*dht\.DHT11\(Pin\((\d+)\)\)$/.exec(s))) {
        const pin=validatePin(m[1],lineNo,'input');
        if(lines[pos]?.trim()!=='sensor.measure()' || lines[pos+1]?.trim()!=='print(sensor.temperature())' || (lines[pos].match(/^ */)||[''])[0].length!==indent || (lines[pos+1].match(/^ */)||[''])[0].length!==indent) fail(lineNo,'DHT11 블록에는 sensor.measure()와 print(sensor.temperature())가 연달아 있어야 합니다.');
        pos+=2; nodes.push({type:'esp_dht',fields:{PIN:pin}}); continue;
      }
      if((m=/^np\s*=\s*neopixel\.NeoPixel\(Pin\((\d+)\),\s*(\d+)\)$/.exec(s))) {
        const pin=validatePin(m[1],lineNo,'output'),count=nrange(m[2],1,60,lineNo,'LED 개수');
        const second=lines[pos]?.trim(),third=lines[pos+1]?.trim();
        const cm=/^np\.fill\(\((255, 0, 0|0, 255, 0|0, 0, 255|0, 0, 0)\)\)$/.exec(second||'');
        if(!cm || third!=='np.write()' || (lines[pos].match(/^ */)||[''])[0].length!==indent || (lines[pos+1].match(/^ */)||[''])[0].length!==indent) fail(lineNo,'네오픽셀 블록은 지원되는 RGB 색상과 np.write()를 사용해야 합니다.');
        pos+=2;
        const color={'255, 0, 0':'RED','0, 255, 0':'GREEN','0, 0, 255':'BLUE','0, 0, 0':'OFF'}[cm[1]];
        nodes.push({type:'esp_neopixel',fields:{PIN:pin,COUNT:count,COLOR:color}});continue;
      }
      if((m=/^print\(("(?:[^"\\]|\\.)*")\)$/.exec(s))) {
        let value; try {value=JSON.parse(m[1]);} catch {fail(lineNo,'문자열 형식을 확인하세요.');}
        nodes.push({type:'esp_print',fields:{TEXT:String(value)}});continue;
      }
      fail(lineNo,`현재 양방향 변환에서 지원하지 않는 문법: ${s.slice(0,65)}`);
    }
    return nodes;
  }
  const result=walk(0,0);
  nextNonempty();
  if(pos<lines.length) fail(pos+1,'변환되지 않은 코드가 있습니다.');
  if(result.length>300) fail(1,'한 번에 최대 300개의 최상위 블록만 변환할 수 있습니다.');
  return result;
}
