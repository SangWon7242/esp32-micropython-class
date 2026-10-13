import {parseMicroPython} from './parser.mjs';
import {getMicroMission} from './micro-missions.mjs';
// Compare the supported AST, never claim to simulate hardware or run student code.
const normalized=nodes=>nodes.map(node=>({type:node.type,fields:Object.fromEntries(Object.entries(node.fields||{}).sort(([a],[b])=>a.localeCompare(b))),children:normalized(node.children||[])}));
export function validateMicroMission(source,chapterId,stageId,options={}) {
  const mission=getMicroMission(chapterId,stageId);
  if(!mission)return {ok:false,reason:'존재하지 않는 미션입니다.'};
  if(mission.mode==='python'&&!options.editedWithText)return {ok:false,reason:'MicroPython 편집기에서 코드를 직접 수정해야 합니다.'};
  let actual,expected;
  try{actual=parseMicroPython(source);expected=parseMicroPython(mission.solutionCode)}
  catch(error){return {ok:false,reason:'지원 문법 검사: '+error.message}}
  if(JSON.stringify(normalized(actual))!==JSON.stringify(normalized(expected)))
    return {ok:false,reason:'코드 구조가 미션 목표와 다릅니다. 핀, 블록 순서, 시간, 반복 위치를 확인하세요.'};
  const needed=['from machine import Pin'];
  if(mission.solutionCode.includes('time.sleep_ms('))needed.push('import time');
  if(mission.solutionCode.includes('dht.DHT11('))needed.push('import dht');
  if(mission.solutionCode.includes('neopixel.NeoPixel('))needed.push('import neopixel');
  const lines=source.split(/\r?\n/).map(x=>x.trim());
  if(!needed.every(n=>lines.some(line=>line===n||(n==='from machine import Pin'&&/^from machine import Pin(?:,|$)/.test(line)))))
    return {ok:false,reason:'필요한 import 문을 다시 확인하세요.'};
  return {ok:true,reason:'코드 구조 검사 통과. 실제 보드 동작은 별도로 확인해야 합니다.'};
}
