/**
 * Original small-step exercises inspired by Keyestudio KS5020's topic progression.
 * Solutions describe the subset supported by our conservative MicroPython parser.
 * Never execute student code in the browser or treat structure checks as hardware proof.
 */
const importsFor = body => {
  const machine = 'from machine import Pin' + (body.includes('ADC(') ? ', ADC' : '') + (body.includes('PWM(') ? ', PWM' : '');
  return [machine, ...(body.includes('time.sleep_ms(') ? ['import time'] : []), ...(body.includes('dht.DHT11(') ? ['import dht'] : []), ...(body.includes('neopixel.NeoPixel(') ? ['import neopixel'] : [])].join('\n');
};
const program = body => `${importsFor(body)}\n\n${body.trim()}\n`;
const led = (pin, on) => `Pin(${pin}, Pin.OUT).value(${on ? 1 : 0})`;
const wait = ms => `time.sleep_ms(${ms})`;
const indent = (value, n=4) => value.split('\n').map(line => ' '.repeat(n)+line).join('\n');
const sequence = (...parts) => parts.join('\n');
const loop = body => `while True:\n${indent(body)}`;
const repeat = (n,body) => `for _ in range(${n}):\n${indent(body)}`;
const blink = (pin,ms) => sequence(led(pin,true),wait(ms),led(pin,false),wait(ms));
const button = body => `if Pin(18, Pin.IN, Pin.PULL_UP).value() == 0:\n${indent(body)}`;
const np = color => `np = neopixel.NeoPixel(Pin(5), 8)\nnp.fill((${color}))\nnp.write()`;
const dht = 'sensor = dht.DHT11(Pin(4))\nsensor.measure()\nprint(sensor.temperature())';
const pwm = duty => `PWM(Pin(18), freq=1000, duty_u16=${duty})`;
const out = pin => `print(Pin(${pin}, Pin.IN).value())`;
const adc = pin => `print(ADC(Pin(${pin})).read_u16())`;
const empty = '';
function mission(id,title,goal,starterBody,answerBody,opts={}) {
  return {
    id, title, short:opts.short || title, goal,
    starterCode:program(starterBody), solutionCode:program(answerBody),
    hint:opts.hint || '필요한 블록을 찾은 뒤 순서와 숫자를 다시 확인해 보세요.',
    concept:opts.concept || '명령의 순서와 값을 관찰해 보세요.',
    reflection:opts.reflection || '어떤 블록을 바꿨을 때 어떤 결과를 예상할 수 있나요?',
    mode:opts.mode || 'blocks',
    allowedBlocks:opts.allowedBlocks || null,
    hardware:opts.hardware || '실행 전 연결 상태를 교사와 확인한 다음 예상 결과를 실제 보드와 비교해 보세요.',
  };
}
export const MICRO_MISSIONS = {
  blink: [
    mission('led-on','LED를 켜 보세요','GPIO26에 연결된 LED를 켜세요.',empty,led(26,true),{short:'불 켜기',concept:'디지털 출력 1은 높은 전압을 내보냅니다.',hint:'LED · 출력에서 GPIO 디지털 출력 블록을 꺼내 GPIO26, 켜기(1)를 선택하세요.',allowedBlocks:['esp_output'],hardware:'긴 다리 → 220Ω 저항 → GPIO26, 짧은 다리 → GND. LED가 계속 켜져 있어야 합니다.'}),
    mission('led-off','LED를 꺼 보세요','방금 켜 둔 GPIO26 LED를 끄세요.',led(26,true),led(26,false),{short:'불 끄기',concept:'디지털 출력 0은 낮은 전압을 내보냅니다.',hint:'같은 블록의 켜기(1)를 끄기(0)로 바꾸세요.',allowedBlocks:['esp_output'],hardware:'실행하면 LED가 꺼진 상태를 유지해야 합니다.'}),
    mission('led-after-1s','1초 후에 끄기','GPIO26 LED를 켠 뒤 1000ms를 기다렸다가 끄세요.',sequence(led(26,true),wait(500),led(26,false)),sequence(led(26,true),wait(1000),led(26,false)),{short:'1초 기다리기',concept:'1000밀리초(ms)는 1초입니다.',hint:'켜기와 끄기 사이의 기다리기 블록 숫자를 1000으로 변경하세요.',allowedBlocks:['esp_output','esp_wait'],hardware:'켜진 뒤 1초가 지나면 LED가 꺼져야 합니다.'}),
    mission('led-three','정확히 세 번 깜박이기','500ms씩 켜고 끄는 동작을 정확히 3번 반복하세요.',sequence(led(26,true),wait(1000),led(26,false)),repeat(3,blink(26,500)),{short:'3회 반복',concept:'횟수가 정해진 반복에는 for/range를 사용합니다.',hint:'3번 반복 블록 안에 켜기 → 500ms → 끄기 → 500ms 순서로 넣으세요.',allowedBlocks:['esp_repeat','esp_output','esp_wait'],hardware:'LED가 딱 세 번 깜빡이고 멈춰야 합니다.'}),
    mission('led-forever','계속 깜박이기','3번 반복을 끝없이 반복하도록 바꾸세요. 각 상태는 500ms입니다.',repeat(3,blink(26,500)),loop(blink(26,500)),{short:'무한 반복',mode:'hybrid',concept:'while True는 중지 명령 전까지 반복합니다.',hint:'3번 반복 블록 대신 계속 반복 블록을 사용하세요.',allowedBlocks:['esp_repeat','esp_forever','esp_output','esp_wait'],hardware:'LED가 계속 깜박이므로 테스트를 마치면 ■ 중지하세요.'}),
    mission('led-faster','0.2초 간격으로 바꾸기','켜져 있는 시간과 꺼져 있는 시간을 각각 200ms로 줄이세요.',loop(blink(26,500)),loop(blink(26,200)),{short:'속도 바꾸기',mode:'hybrid',concept:'0.2초 = 200ms. 대기 시간이 짧아지면 깜박이는 속도가 빨라집니다.',hint:'두 개의 기다리기 블록을 모두 500에서 200으로 변경하세요.',allowedBlocks:['esp_forever','esp_output','esp_wait'],hardware:'500ms일 때보다 더 빠르게 깜박이는지 비교하세요.'}),
    mission('led-python','MicroPython으로 직접 수정','이제 블록 없이 Python에서 200ms를 100ms로 두 군데 모두 수정해 보세요.',loop(blink(26,200)),loop(blink(26,100)),{short:'Python 도전',mode:'python',concept:'블록과 코드는 같은 동작을 설명합니다. 들여쓰기 4칸을 유지하세요.',hint:'오른쪽 편집기의 time.sleep_ms(200) 두 곳을 모두 time.sleep_ms(100)으로 고치세요.',hardware:'0.1초 간격으로 더 빨라졌다면 성공입니다. 작성한 Python 코드를 직접 설명해 보세요.'}),
  ],
  traffic: [
    mission('red','빨간불부터 켜기','GPIO13의 빨간 LED만 켜 보세요.',empty,led(13,true),{allowedBlocks:['esp_output'],concept:'신호등의 첫 상태를 만듭니다.'}),
    mission('green','빨강에서 초록으로','빨강을 끄고 초록(GPIO17)을 켜세요.',led(13,true),sequence(led(13,true),wait(1000),led(13,false),led(17,true)),{allowedBlocks:['esp_output','esp_wait'],hint:'빨강 켜기 → 1000ms 기다리기 → 빨강 끄기 → 초록 켜기'}),
    mission('yellow','노란불 이어 켜기','초록을 끄고 노랑(GPIO14)을 500ms 동안 켜세요.',sequence(led(17,true),wait(1000)),sequence(led(17,true),wait(1000),led(17,false),led(14,true),wait(500),led(14,false)),{allowedBlocks:['esp_output','esp_wait']}),
    mission('traffic-loop','신호등 반복하기','빨강 → 초록 → 노랑 순서를 계속 반복하세요.',sequence(led(13,true),wait(1000)),loop(sequence(led(13,true),wait(1000),led(13,false),led(17,true),wait(1000),led(17,false),led(14,true),wait(500),led(14,false))),{mode:'hybrid',allowedBlocks:['esp_output','esp_wait','esp_forever'],hardware:'세 LED의 순서가 빨강→초록→노랑인지 관찰하고 중지하세요.'}),
  ],
  button: [
    mission('button-input','버튼값 읽기','GPIO18 버튼 입력값을 출력하세요.',empty,out(18),{allowedBlocks:['esp_input'],concept:'풀업 회로의 버튼은 누를 때 0을 읽습니다.'}),
    mission('button-action','버튼을 누르면 켜기','GPIO18 버튼이 눌렸을 때 GPIO2 LED를 켜세요.',out(18),button(led(2,true)),{allowedBlocks:['esp_button_if','esp_output'],hint:'조건 블록 안에 LED 켜기 블록을 넣으세요.'}),
    mission('button-repeat','누를 때만 켜지도록','반복 안에서 LED를 끄고, 버튼을 누르면 다시 켜도록 만드세요.',button(led(2,true)),loop(sequence(led(2,false),button(led(2,true)),wait(100))),{allowedBlocks:['esp_forever','esp_button_if','esp_output','esp_wait'],hardware:'버튼을 누르고 있을 때 LED가 켜지고 손을 떼면 꺼지는지 확인하세요.'}),
  ],
  adc: [
    mission('adc-read','센서값 출력','GPIO34에서 아날로그 값을 읽어 출력하세요.',empty,adc(34),{allowedBlocks:['esp_adc'],concept:'ADC는 연속적인 전압을 디지털 숫자로 바꿉니다.'}),
    mission('adc-loop','센서값 반복 관찰','500ms마다 GPIO34 센서값을 출력하세요.',adc(34),loop(sequence(adc(34),wait(500))),{allowedBlocks:['esp_adc','esp_wait','esp_forever'],hardware:'센서 밝기를 바꿨을 때 출력값이 달라지는지 기록하세요.'}),
    mission('adc-fast','더 자주 측정하기','간격을 250ms로 줄여 변화를 확인하세요.',loop(sequence(adc(34),wait(500))),loop(sequence(adc(34),wait(250))),{allowedBlocks:['esp_adc','esp_wait','esp_forever']}),
  ],
  pwm: [
    mission('pwm-dim','어둡게 켜기','GPIO18 PWM 주파수 1000Hz, 듀티 10000으로 설정하세요.',empty,pwm(10000),{allowedBlocks:['esp_pwm'],concept:'PWM은 ON 시간 비율로 밝기를 조절합니다.'}),
    mission('pwm-mid','밝기 절반','듀티를 32768로 수정하세요.',pwm(10000),pwm(32768),{allowedBlocks:['esp_pwm']}),
    mission('pwm-bright','더 밝게','듀티를 55000으로 수정하세요.',pwm(32768),pwm(55000),{allowedBlocks:['esp_pwm']}),
  ],
  dht: [
    mission('dht-measure','온도 한 번 읽기','GPIO4의 DHT11 온도를 한 번 출력하세요.',empty,dht,{allowedBlocks:['esp_dht'],concept:'센서의 값을 측정한 후 출력합니다.'}),
    mission('dht-loop','2초마다 관찰','2000ms 간격으로 반복 측정하세요.',dht,loop(sequence(dht,wait(2000))),{allowedBlocks:['esp_dht','esp_wait','esp_forever'],hardware:'센서 측정 간격 2초를 지키고 손으로 센서를 가볍게 감싸 변화를 관찰하세요.'}),
    mission('dht-text','Python에서 코드 바꾸기','2초마다 측정하는 코드를 직접 읽고 3000ms로 바꾸세요.',loop(sequence(dht,wait(2000))),loop(sequence(dht,wait(3000))),{mode:'python',concept:'측정 간격은 센서 안정성을 위해 너무 짧게 줄이지 않습니다.'}),
  ],
  neopixel: [
    mission('np-red','빨간 무드등','GPIO5에 네오픽셀 8개를 빨강으로 켜세요.',empty,np('255, 0, 0'),{allowedBlocks:['esp_neopixel'],concept:'RGB(255,0,0)은 빨강입니다.'}),
    mission('np-green','초록 무드등','같은 네오픽셀을 초록으로 변경하세요.',np('255, 0, 0'),np('0, 255, 0'),{allowedBlocks:['esp_neopixel']}),
    mission('np-blue','파란 무드등','색상값을 파랑으로 바꾸세요.',np('0, 255, 0'),np('0, 0, 255'),{allowedBlocks:['esp_neopixel']}),
  ],
};
export const getMicroMissions = chapterId => MICRO_MISSIONS[chapterId] || [];
export const getMicroMission = (chapterId, stageId) => getMicroMissions(chapterId).find(item => item.id === stageId);
