import test from 'node:test';
import assert from 'node:assert/strict';
import {MICRO_MISSIONS} from '../src/micro-missions.mjs';
import {validateMicroMission} from '../src/micro-validation.mjs';
import {COURSES,getStagesForChapter,isUnlocked,courseProgress,nextStage,previousStage,allStages} from '../src/curriculum.js';

const chapters=Object.keys(MICRO_MISSIONS);
const missions=Object.values(MICRO_MISSIONS).flat();

test('Seven chapters have genuine, distinct multi-step missions',()=>{
  assert.equal(chapters.length,7);
  assert.equal(missions.length,26);
  assert.equal(MICRO_MISSIONS.blink.length,7);
  for(const id of chapters){
    assert.ok(MICRO_MISSIONS[id].length >= 3);
    assert.equal(new Set(MICRO_MISSIONS[id].map(x=>x.id)).size,MICRO_MISSIONS[id].length);
    assert.deepEqual(getStagesForChapter(id).map(x=>x.id),['concept','wiring',...MICRO_MISSIONS[id].map(x=>x.id),'reflect']);
  }
});

for(const [chapterId,stages] of Object.entries(MICRO_MISSIONS)) for(const m of stages) {
  test(`${chapterId}/${m.id}: solution accepted, starter rejected`,()=>{
    assert.equal(validateMicroMission(m.solutionCode,chapterId,m.id,{editedWithText:true}).ok,true);
    assert.equal(validateMicroMission(m.starterCode,chapterId,m.id,{editedWithText:true}).ok,false);
  });
}

test('Cannot pass Python-only stage without editing Python',()=>{
  const m=MICRO_MISSIONS.blink.at(-1);
  assert.equal(m.mode,'python');
  assert.equal(validateMicroMission(m.solutionCode,'blink',m.id,{editedWithText:false}).ok,false);
  assert.equal(validateMicroMission(m.solutionCode,'blink',m.id,{editedWithText:true}).ok,true);
});

test('Reject wrong pin, incorrect nesting, wrong wait and missing imports',()=>{
  const m=MICRO_MISSIONS.blink[3];
  for(const wrong of [
    m.solutionCode.replace('Pin(26','Pin(2'),
    m.solutionCode.replace('range(3)','range(5)'),
    m.solutionCode.replace('time.sleep_ms(500)','time.sleep_ms(200)'),
    m.solutionCode.replace('import time',''),
    m.solutionCode.replace('for _ in range(3):','while True:'),
    m.solutionCode+'\nprint("extra")\n',
  ]) assert.equal(validateMicroMission(wrong,'blink',m.id).ok,false,wrong);
});

test('Course completion and next/previous graph include expanded steps',()=>{
  const total=COURSES.reduce((sum,c)=>sum+courseProgress(c,{}).total,0);
  assert.equal(total,allStages.length);
  assert.equal(total,26+7*3);
  const a=nextStage('blink','wiring');
  assert.deepEqual(a,{chapterId:'blink',stageId:'led-on'});
  assert.deepEqual(previousStage('blink','led-on'),{chapterId:'blink',stageId:'wiring'});
  assert.equal(isUnlocked('blink','led-on',{}),false);
  assert.equal(isUnlocked('blink','led-on',{'blink:wiring':123}),true);
  assert.equal(isUnlocked('blink','led-off',{'blink:wiring':123}),false);
  assert.equal(isUnlocked('blink','led-off',{'blink:led-on':123}),true);
});

test('Preserve legacy v0.3 routes and progress entries',()=>{
  assert.deepEqual(nextStage('blink','build'),{chapterId:'blink',stageId:'challenge'});
  assert.equal(isUnlocked('blink','challenge',{'blink:build':123}),true);
  assert.equal(isUnlocked('blink','reflect',{'blink:challenge':123}),true);
});
