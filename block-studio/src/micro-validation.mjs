import {parseMicroPython} from './parser.mjs';
import {getMicroMission} from './micro-missions.mjs';

const normalized = nodes => nodes.map(node => ({
  type:node.type,
  fields:Object.fromEntries(Object.entries(node.fields || {}).sort(([a],[b])=>a.localeCompare(b))),
  children:normalized(node.children || []),
}));

/** Checks supported AST structure, NOT actual ESP32 state or electrical safety. */
export function validateMicroMission(source, chapterId, stageId, options={}) {
  const mission=getMicroMission(chapterId,stageId);
  if(!mission) return {ok:false,reason:'존재하지 않는 미션입니다.'};
  if(mission.mode==='python' && !options.editedWithText)
    return {ok:false,reason:'이 미션은 MicroPython 편집기에서 직접 코드를 수정해야 해요.'};
  let actual,expected;
  try {
    actual=parseMicroPython(source);
    expected=parseMicroPython(mission.solutionCode);
  } catch(error) { return {ok:false,reason:`코드 확인: ${error.message}`}; }
  if(JSON.stringify(normalized(actual))!==JSON.stringify(normalized(expected))) {
    return {ok:false,reason:'아직 미션 조건과 순서가 달라요. 블록의 종류·핀 번호·시간·반복 위치를 확인하세요.'};
  }
  const needed=['from machine import Pin'];
  if(mission.solutionCode.includes('time.sleep_ms('))needed.push('import time');
  if(mission.solutionCode.includes('dht.DHT11('))needed.push('import dht');
  if(mission.solutionCode.includes('neopixel.NeoPixel('))needed.push('import neopixel');
  // MicroPython needs the same imports that the Blockly code generator produces.
  if(!needed.every(im => source.split(/\r?\n/).some(line=>line.trim()===im || (im==='from machine import Pin'&&/^from machine import Pin(?:,|$)/.test(line.trim())))))
    return {ok:false,reason:'코드 맨 위의 import 문을 확인하세요.'};
  return {ok:true,reason:'코드 구조 검사를 통과했어요. 실제 LED/센서 동작은 ESP32에서 직접 확인하세요.'};
}
