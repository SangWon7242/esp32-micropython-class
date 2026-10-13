import { parseMicroPython } from './parser.mjs';
export function flatten(nodes) {return nodes.flatMap(node=>[node,...flatten(node.children||[])]);}
export function validateChallenge(code,id) {
  let ast;
  try {ast=parseMicroPython(code);} catch(e){return {ok:false,reason:`지원 문법을 확인하세요: ${e.message}`};}
  const nodes=flatten(ast);
  const has=(type,test=()=>true)=>nodes.some(n=>n.type===type&&test(n.fields||{}));
  const every=(type,pins)=>pins.every(pin=>has(type,f=>f.PIN===String(pin)));
  const cases={
    blink: () => has('esp_forever')&&has('esp_output',f=>f.PIN==='2'&&f.VALUE==='1')&&has('esp_output',f=>f.PIN==='2'&&f.VALUE==='0')&&nodes.filter(n=>n.type==='esp_wait'&&n.fields.MS==='200').length>=2,
    traffic:()=> has('esp_forever')&&every('esp_output',[13,14,17])&&has('esp_wait'),
    button:()=>has('esp_forever')&&has('esp_button_if',f=>f.PIN==='18')&&nodes.some(n=>n.type==='esp_button_if'&&(n.children||[]).some(x=>x.type==='esp_output'&&x.fields.PIN==='2'&&x.fields.VALUE==='1')),
    adc:()=>has('esp_forever')&&has('esp_adc',f=>f.PIN==='34')&&has('esp_wait',f=>f.MS==='500'),
    pwm:()=>has('esp_pwm',f=>f.PIN==='18'&&f.FREQ==='1000'&&f.DUTY==='32768'),
    dht:()=>has('esp_forever')&&has('esp_dht',f=>f.PIN==='4')&&has('esp_wait',f=>f.MS==='2000'),
    neopixel:()=>has('esp_neopixel',f=>f.PIN==='5'&&f.COUNT==='8'&&f.COLOR==='BLUE'),
  };
  if(!cases[id]) return {ok:false,reason:'이 챕터의 자동 검사가 아직 준비되지 않았습니다.'};
  if(!cases[id]()) return {ok:false,reason:'블록 구조가 미션 조건과 다릅니다. 힌트를 참고해 다시 배치하세요.'};
  return {ok:true,reason:'블록과 코드의 구성 조건을 통과했습니다. 실제 센서의 동작은 보드에서 별도로 확인하세요.'};
}
