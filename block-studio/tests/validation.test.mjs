import test from 'node:test';
import assert from 'node:assert/strict';
import {validateChallenge} from '../src/validation.mjs';
const ok={
  blink:'from machine import Pin\nimport time\nwhile True:\n    Pin(2, Pin.OUT).value(1)\n    time.sleep_ms(200)\n    Pin(2, Pin.OUT).value(0)\n    time.sleep_ms(200)',
  traffic:'from machine import Pin\nimport time\nwhile True:\n    Pin(13, Pin.OUT).value(1)\n    Pin(14, Pin.OUT).value(0)\n    Pin(17, Pin.OUT).value(1)\n    time.sleep_ms(500)',
  button:'from machine import Pin\nwhile True:\n    if Pin(18, Pin.IN, Pin.PULL_UP).value() == 0:\n        Pin(2, Pin.OUT).value(1)',
  adc:'from machine import Pin, ADC\nimport time\nwhile True:\n    print(ADC(Pin(34)).read_u16())\n    time.sleep_ms(500)',
  pwm:'from machine import Pin, PWM\nPWM(Pin(18), freq=1000, duty_u16=32768)',
  dht:'from machine import Pin\nimport time\nimport dht\nwhile True:\n    sensor = dht.DHT11(Pin(4))\n    sensor.measure()\n    print(sensor.temperature())\n    time.sleep_ms(2000)',
  neopixel:'from machine import Pin\nimport neopixel\nnp = neopixel.NeoPixel(Pin(5), 8)\nnp.fill((0, 0, 255))\nnp.write()',
};
for (const [id,code] of Object.entries(ok))test(`${id} valid challenge`,()=>assert.equal(validateChallenge(code,id).ok,true));
test('reject missing waits',()=>assert.equal(validateChallenge('Pin(2, Pin.OUT).value(1)','blink').ok,false));
test('reject unsupported Python',()=>assert.equal(validateChallenge('exec("print(1)")','blink').ok,false));
