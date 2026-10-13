import { DEFAULT_CODE } from './parser.mjs';

export const KEYESTUDIO_URL = 'https://docs.keyestudio.com/projects/KS5020/en/latest/docs/2.%20MicroPython_Tutorial.html';

// Keyestudio KS5020의 실습 주제와 교수학습 흐름을 참고해 신규 작성한 교안.
// Keyestudio 원문 설명, 사진, 코드의 무단 복제 없이 별도 학습 질문과 예제를 제공.
export const LESSONS = [
  {
    id: 'blink', week: '01', level: '기초', name: '반짝반짝 LED', device: 'LED + 저항',
    reference: 'KS5020 2-3-01 · Hello, LED!', concept: '디지털 출력 · 반복 · 시간',
    question: '왜 LED에 기다리기 블록을 넣어야 깜박일까요?',
    mission: '0.5초 간격으로 깜박이게 만든 다음, 0.2초로 바꿔 변화를 관찰하세요.',
    wiring: ['외부 LED 양극(+) → 220~330Ω 저항 → GPIO2', 'LED 음극(-) → GND'],
    warning: '일부 보드는 GPIO2에 내장 LED가 없습니다. 외부 LED로 실습하세요.',
    code: DEFAULT_CODE,
  },
  {
    id: 'traffic', week: '02', level: '기초', name: '우리 동네 신호등', device: 'LED 3개 + 저항 3개',
    reference: 'KS5020 2-3-03 · Traffic Lights', concept: '순차 실행 · 상태 표현',
    question: '빨간불이 켜져 있을 때 다른 불은 어떻게 되어야 할까요?',
    mission: '빨강 → 초록 → 노랑 순서로 신호를 만들고 노란불을 두 번 깜박이게 해보세요.',
    wiring: ['빨강 LED → GPIO13 / 노랑 LED → GPIO14 / 초록 LED → GPIO17', '각 LED에 저항을 직렬로 연결하고 음극은 GND'],
    warning: 'GPIO 번호는 학원에서 실제 조립한 회로에 맞춰 변경하세요.',
    code: `from machine import Pin\nimport time\n\nwhile True:\n    Pin(13, Pin.OUT).value(1)\n    Pin(14, Pin.OUT).value(0)\n    Pin(17, Pin.OUT).value(0)\n    time.sleep_ms(1500)\n    Pin(13, Pin.OUT).value(0)\n    Pin(17, Pin.OUT).value(1)\n    time.sleep_ms(1500)\n    Pin(17, Pin.OUT).value(0)\n    Pin(14, Pin.OUT).value(1)\n    time.sleep_ms(500)\n    Pin(14, Pin.OUT).value(0)\n    time.sleep_ms(500)\n`,
  },
  {
    id: 'button', week: '03', level: '기초', name: '버튼으로 불 켜기', device: '버튼 + LED',
    reference: 'KS5020 버튼·디지털 입력 실습', concept: '디지털 입력 · 조건',
    question: '버튼을 누르지 않았을 때 왜 입력값이 1일까요?',
    mission: '버튼을 누르는 동안만 LED를 켜고, 누를 때마다 다른 반응을 만들어보세요.',
    wiring: ['버튼의 한쪽 → GPIO18 / 반대쪽 → GND', 'LED 양극(+) → 저항 → GPIO2 / 음극(-) → GND'],
    warning: '내부 풀업(PULL_UP) 사용: 누르면 0, 떼면 1입니다.',
    code: `from machine import Pin\nimport time\n\nwhile True:\n    Pin(2, Pin.OUT).value(0)\n    if Pin(18, Pin.IN, Pin.PULL_UP).value() == 0:\n        Pin(2, Pin.OUT).value(1)\n    time.sleep_ms(100)\n`,
  },
  {
    id: 'adc', week: '04', level: '응용', name: '빛을 숫자로 읽기', device: '조도 센서 / 가변저항',
    reference: 'KS5020 2-3-17 · Potentiometer', concept: 'ADC · 센서값 관찰',
    question: '밝기가 연속적으로 달라질 때 0과 1만으로 구분할 수 있을까요?',
    mission: '센서를 가리거나 다이얼을 돌리며 시리얼 모니터의 값을 기록해 보세요.',
    wiring: ['아날로그 출력(S) → GPIO34', '센서 GND → GND / VCC → 3.3V (모듈 사양 확인)'],
    warning: 'ESP32 GPIO에는 3.3V를 초과하는 신호를 직접 입력하지 마세요.',
    code: `from machine import Pin, ADC\nimport time\n\nwhile True:\n    print(ADC(Pin(34)).read_u16())\n    time.sleep_ms(500)\n`,
  },
  {
    id: 'pwm', week: '05', level: '응용', name: 'LED 밝기 조절', device: 'LED + 저항',
    reference: 'KS5020 PWM / Breathing LED 실습', concept: 'PWM · 듀티 사이클',
    question: '전원을 빠르게 켰다 껐다 하면 왜 밝기가 달라 보일까요?',
    mission: '듀티를 10000, 32768, 55000으로 바꾸며 밝기를 비교하세요.',
    wiring: ['LED 양극(+) → 저항 → GPIO18', 'LED 음극(-) → GND'],
    warning: '모터는 ESP32 GPIO에 직접 연결하지 말고 전용 모터드라이버를 사용하세요.',
    code: `from machine import Pin, PWM\n\nPWM(Pin(18), freq=1000, duty_u16=32768)\n`,
  },
  {
    id: 'dht', week: '06', level: '응용', name: '교실 온도 관찰', device: 'DHT11 모듈',
    reference: 'KS5020 2-3-24 · Temperature and Humidity Detection', concept: '온도 센서 · 데이터 읽기',
    question: '측정값이 예상과 다를 때 센서와 코드를 어떻게 검증할까요?',
    mission: '2초마다 온도를 읽고 장소를 바꿔 비교해 보세요.',
    wiring: ['DHT11 DATA → GPIO4', '모듈 VCC → 3.3V / GND → GND (모듈 정격 확인)'],
    warning: 'DHT11은 자주 읽으면 오류가 날 수 있습니다. 최소 약 2초 간격을 권장합니다.',
    code: `from machine import Pin\nimport time\nimport dht\n\nwhile True:\n    sensor = dht.DHT11(Pin(4))\n    sensor.measure()\n    print(sensor.temperature())\n    time.sleep_ms(2000)\n`,
  },
  {
    id: 'neopixel', week: '07', level: '응용', name: '컬러 무드등', device: '네오픽셀 LED 8개',
    reference: 'KS5020 RGB LED / 조명 응용', concept: 'RGB · 데이터 전송',
    question: '빛의 빨강·초록·파랑을 섞으면 어떤 색을 만들 수 있을까요?',
    mission: '빨강·초록·파랑을 차례로 표현한 뒤 나만의 색을 생각해 보세요.',
    wiring: ['DIN → GPIO5, GND → 공통 GND', 'VCC → LED 제품 정격 전원 (전류 용량 확인)'],
    warning: 'LED 수량이 많다면 별도 전원이 필요하며, ESP32와 GND를 공유해야 합니다.',
    code: `from machine import Pin\nimport neopixel\n\nnp = neopixel.NeoPixel(Pin(5), 8)\nnp.fill((255, 0, 0))\nnp.write()\n`,
  },
];
