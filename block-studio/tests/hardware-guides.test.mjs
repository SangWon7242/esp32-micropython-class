import test from 'node:test';
import assert from 'node:assert/strict';
import {MICRO_MISSIONS} from '../src/micro-missions.mjs';
import {HARDWARE_GUIDES,hardwareGuideFor} from '../src/hardware-guides.mjs';
test('every curriculum chapter has custom wiring and teacher cards',()=>{
 for(const key of Object.keys(MICRO_MISSIONS)){
  const guide=hardwareGuideFor(key);assert.ok(guide,key);
  assert.ok(guide.parts.length>=3);
  assert.ok(guide.wires.length>=2);
  assert.ok(guide.pitfalls.length>=2);
  for(const row of guide.wires)assert.equal(row.length,3);
 }
});
test('Keyestudio LED uses GPIO26 with series 220Ω resistor',()=>{
 const rows=HARDWARE_GUIDES.blink.wires;
 assert.ok(rows.some(([from,via,to])=>from==='GPIO26'&&via.includes('220Ω')&&to.includes('LED')));
 assert.ok(rows.some(([from,to])=>from.includes('LED')&&to==='GND'));
});
