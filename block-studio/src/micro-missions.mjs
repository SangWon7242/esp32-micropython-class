// Independently authored Code.org-style small-step ESP32 curricula; KS5020 wiring reference.
export const MICRO_MISSIONS = {
  "blink": [
    {
      "id": "led-on",
      "title": "LED를 켜 보세요",
      "short": "켜기",
      "goal": "GPIO26의 LED를 켜세요.",
      "starterCode": "from machine import Pin\n\n\n",
      "solutionCode": "from machine import Pin\n\nPin(26, Pin.OUT).value(1)\n",
      "hint": "출력 블록의 GPIO를 26, 값을 1로 지정하세요.",
      "concept": "디지털 출력 1은 HIGH입니다.",
      "hardware": "Keyestudio KS5020: GPIO26 → 220Ω 저항 → LED 긴 다리, 짧은 다리 → GND",
      "mode": "blocks",
      "allowedBlocks": [
        "esp_output"
      ]
    },
    {
      "id": "led-off",
      "title": "LED를 꺼 보세요",
      "short": "끄기",
      "goal": "GPIO26의 LED를 끄세요.",
      "starterCode": "from machine import Pin\n\nPin(26, Pin.OUT).value(1)\n",
      "solutionCode": "from machine import Pin\n\nPin(26, Pin.OUT).value(0)\n",
      "hint": "출력값을 1에서 0으로 바꾸세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "blocks",
      "allowedBlocks": [
        "esp_output"
      ]
    },
    {
      "id": "led-after-1s",
      "title": "1초 후 끄기",
      "short": "시간",
      "goal": "LED 켜기 → 1000ms → 끄기를 만드세요.",
      "starterCode": "from machine import Pin\nimport time\n\nPin(26, Pin.OUT).value(1)\ntime.sleep_ms(500)\nPin(26, Pin.OUT).value(0)\n",
      "solutionCode": "from machine import Pin\nimport time\n\nPin(26, Pin.OUT).value(1)\ntime.sleep_ms(1000)\nPin(26, Pin.OUT).value(0)\n",
      "hint": "기다리기 숫자를 1000으로 바꾸세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "blocks",
      "allowedBlocks": [
        "esp_output",
        "esp_wait"
      ]
    },
    {
      "id": "led-three",
      "title": "정확히 세 번 깜박이기",
      "short": "3번",
      "goal": "500ms씩 켜고 끄는 일을 3회 반복하세요.",
      "starterCode": "from machine import Pin\nimport time\n\nPin(26, Pin.OUT).value(1)\ntime.sleep_ms(1000)\nPin(26, Pin.OUT).value(0)\n",
      "solutionCode": "from machine import Pin\nimport time\n\nfor _ in range(3):\n    Pin(26, Pin.OUT).value(1)\n    time.sleep_ms(500)\n    Pin(26, Pin.OUT).value(0)\n    time.sleep_ms(500)\n",
      "hint": "3번 반복 안에 켜기 → 기다리기 → 끄기 → 기다리기를 넣으세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "blocks",
      "allowedBlocks": [
        "esp_repeat",
        "esp_output",
        "esp_wait"
      ]
    },
    {
      "id": "led-forever",
      "title": "계속 깜박이기",
      "short": "계속",
      "goal": "500ms 간격으로 LED가 계속 깜박이게 하세요.",
      "starterCode": "from machine import Pin\nimport time\n\nfor _ in range(3):\n    Pin(26, Pin.OUT).value(1)\n    time.sleep_ms(500)\n    Pin(26, Pin.OUT).value(0)\n    time.sleep_ms(500)\n",
      "solutionCode": "from machine import Pin\nimport time\n\nwhile True:\n    Pin(26, Pin.OUT).value(1)\n    time.sleep_ms(500)\n    Pin(26, Pin.OUT).value(0)\n    time.sleep_ms(500)\n",
      "hint": "횟수 반복 대신 계속 반복(while True)을 사용하세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "hybrid",
      "allowedBlocks": [
        "esp_repeat",
        "esp_forever",
        "esp_output",
        "esp_wait"
      ]
    },
    {
      "id": "led-faster",
      "title": "0.2초 간격으로",
      "short": "0.2초",
      "goal": "LED ON/OFF 시간을 각각 200ms로 바꾸세요.",
      "starterCode": "from machine import Pin\nimport time\n\nwhile True:\n    Pin(26, Pin.OUT).value(1)\n    time.sleep_ms(500)\n    Pin(26, Pin.OUT).value(0)\n    time.sleep_ms(500)\n",
      "solutionCode": "from machine import Pin\nimport time\n\nwhile True:\n    Pin(26, Pin.OUT).value(1)\n    time.sleep_ms(200)\n    Pin(26, Pin.OUT).value(0)\n    time.sleep_ms(200)\n",
      "hint": "기다리기 두 곳을 200으로 고치세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "hybrid",
      "allowedBlocks": [
        "esp_forever",
        "esp_output",
        "esp_wait"
      ]
    },
    {
      "id": "led-python",
      "title": "Python으로 직접 수정",
      "short": "Python",
      "goal": "블록 없이 시간 두 곳을 100ms로 직접 수정하세요.",
      "starterCode": "from machine import Pin\nimport time\n\nwhile True:\n    Pin(26, Pin.OUT).value(1)\n    time.sleep_ms(200)\n    Pin(26, Pin.OUT).value(0)\n    time.sleep_ms(200)\n",
      "solutionCode": "from machine import Pin\nimport time\n\nwhile True:\n    Pin(26, Pin.OUT).value(1)\n    time.sleep_ms(100)\n    Pin(26, Pin.OUT).value(0)\n    time.sleep_ms(100)\n",
      "hint": "time.sleep_ms(200)을 100으로 두 곳 모두 수정하세요.",
      "concept": "들여쓰기 공백 4칸을 유지하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "python",
      "allowedBlocks": null
    }
  ],
  "traffic": [
    {
      "id": "red",
      "title": "빨간불 켜기",
      "short": "빨간불 켜기",
      "goal": "GPIO13의 빨간 LED를 켜세요.",
      "starterCode": "from machine import Pin\n\n\n",
      "solutionCode": "from machine import Pin\n\nPin(13, Pin.OUT).value(1)\n",
      "hint": "블록의 종류, 순서, GPIO 번호와 숫자를 다시 확인해 보세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "blocks",
      "allowedBlocks": [
        "esp_output"
      ]
    },
    {
      "id": "green",
      "title": "초록불 연결",
      "short": "초록불 연결",
      "goal": "빨강을 1000ms 후 끄고 GPIO17 초록을 켜세요.",
      "starterCode": "from machine import Pin\n\nPin(13, Pin.OUT).value(1)\n",
      "solutionCode": "from machine import Pin\nimport time\n\nPin(13, Pin.OUT).value(1)\ntime.sleep_ms(1000)\nPin(13, Pin.OUT).value(0)\nPin(17, Pin.OUT).value(1)\n",
      "hint": "블록의 종류, 순서, GPIO 번호와 숫자를 다시 확인해 보세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "blocks",
      "allowedBlocks": [
        "esp_output",
        "esp_wait"
      ]
    },
    {
      "id": "yellow",
      "title": "노란불 추가",
      "short": "노란불 추가",
      "goal": "초록을 1000ms 켰다가 끄고 GPIO14 노랑을 500ms 켜세요.",
      "starterCode": "from machine import Pin\nimport time\n\nPin(17, Pin.OUT).value(1)\ntime.sleep_ms(1000)\n",
      "solutionCode": "from machine import Pin\nimport time\n\nPin(17, Pin.OUT).value(1)\ntime.sleep_ms(1000)\nPin(17, Pin.OUT).value(0)\nPin(14, Pin.OUT).value(1)\ntime.sleep_ms(500)\nPin(14, Pin.OUT).value(0)\n",
      "hint": "블록의 종류, 순서, GPIO 번호와 숫자를 다시 확인해 보세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "blocks",
      "allowedBlocks": [
        "esp_output",
        "esp_wait"
      ]
    },
    {
      "id": "traffic-loop",
      "title": "신호등 반복",
      "short": "신호등 반복",
      "goal": "빨강→초록→노랑 신호를 계속 반복하세요.",
      "starterCode": "from machine import Pin\nimport time\n\nPin(13, Pin.OUT).value(1)\ntime.sleep_ms(1000)\n",
      "solutionCode": "from machine import Pin\nimport time\n\nwhile True:\n    Pin(13, Pin.OUT).value(1)\n    time.sleep_ms(1000)\n    Pin(13, Pin.OUT).value(0)\n    Pin(17, Pin.OUT).value(1)\n    time.sleep_ms(1000)\n    Pin(17, Pin.OUT).value(0)\n    Pin(14, Pin.OUT).value(1)\n    time.sleep_ms(500)\n    Pin(14, Pin.OUT).value(0)\n",
      "hint": "블록의 종류, 순서, GPIO 번호와 숫자를 다시 확인해 보세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "hybrid",
      "allowedBlocks": [
        "esp_output",
        "esp_wait",
        "esp_forever"
      ]
    }
  ],
  "button": [
    {
      "id": "button-input",
      "title": "버튼값 읽기",
      "short": "버튼값 읽기",
      "goal": "GPIO18 버튼의 입력값을 출력하세요.",
      "starterCode": "from machine import Pin\n\n\n",
      "solutionCode": "from machine import Pin\n\nprint(Pin(18, Pin.IN).value())\n",
      "hint": "블록의 종류, 순서, GPIO 번호와 숫자를 다시 확인해 보세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "blocks",
      "allowedBlocks": [
        "esp_input"
      ]
    },
    {
      "id": "button-action",
      "title": "버튼을 눌러 켜기",
      "short": "버튼을 눌러 켜기",
      "goal": "GPIO18 버튼을 누르면 GPIO2 LED를 켜세요.",
      "starterCode": "from machine import Pin\n\nprint(Pin(18, Pin.IN).value())\n",
      "solutionCode": "from machine import Pin\n\nif Pin(18, Pin.IN, Pin.PULL_UP).value() == 0:\n    Pin(2, Pin.OUT).value(1)\n",
      "hint": "블록의 종류, 순서, GPIO 번호와 숫자를 다시 확인해 보세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "blocks",
      "allowedBlocks": [
        "esp_button_if",
        "esp_output"
      ]
    },
    {
      "id": "button-repeat",
      "title": "눌렀을 때만 켜기",
      "short": "눌렀을 때만 켜기",
      "goal": "반복 안에서 LED를 끄고, 버튼을 누를 때만 켜세요.",
      "starterCode": "from machine import Pin\n\nif Pin(18, Pin.IN, Pin.PULL_UP).value() == 0:\n    Pin(2, Pin.OUT).value(1)\n",
      "solutionCode": "from machine import Pin\nimport time\n\nwhile True:\n    Pin(2, Pin.OUT).value(0)\n    if Pin(18, Pin.IN, Pin.PULL_UP).value() == 0:\n        Pin(2, Pin.OUT).value(1)\n    time.sleep_ms(100)\n",
      "hint": "블록의 종류, 순서, GPIO 번호와 숫자를 다시 확인해 보세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "hybrid",
      "allowedBlocks": [
        "esp_forever",
        "esp_button_if",
        "esp_output",
        "esp_wait"
      ]
    }
  ],
  "adc": [
    {
      "id": "adc-read",
      "title": "센서값 읽기",
      "short": "센서값 읽기",
      "goal": "GPIO34 아날로그 값을 출력하세요.",
      "starterCode": "from machine import Pin\n\n\n",
      "solutionCode": "from machine import Pin, ADC\n\nprint(ADC(Pin(34)).read_u16())\n",
      "hint": "블록의 종류, 순서, GPIO 번호와 숫자를 다시 확인해 보세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "blocks",
      "allowedBlocks": [
        "esp_adc"
      ]
    },
    {
      "id": "adc-loop",
      "title": "0.5초마다 센서값",
      "short": "0.5초마다 센서값",
      "goal": "500ms마다 GPIO34 센서값을 출력하세요.",
      "starterCode": "from machine import Pin, ADC\n\nprint(ADC(Pin(34)).read_u16())\n",
      "solutionCode": "from machine import Pin, ADC\nimport time\n\nwhile True:\n    print(ADC(Pin(34)).read_u16())\n    time.sleep_ms(500)\n",
      "hint": "블록의 종류, 순서, GPIO 번호와 숫자를 다시 확인해 보세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "blocks",
      "allowedBlocks": [
        "esp_adc",
        "esp_wait",
        "esp_forever"
      ]
    },
    {
      "id": "adc-fast",
      "title": "0.25초마다 센서값",
      "short": "0.25초마다 센서값",
      "goal": "센서 측정 간격을 250ms로 바꾸세요.",
      "starterCode": "from machine import Pin, ADC\nimport time\n\nwhile True:\n    print(ADC(Pin(34)).read_u16())\n    time.sleep_ms(500)\n",
      "solutionCode": "from machine import Pin, ADC\nimport time\n\nwhile True:\n    print(ADC(Pin(34)).read_u16())\n    time.sleep_ms(250)\n",
      "hint": "블록의 종류, 순서, GPIO 번호와 숫자를 다시 확인해 보세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "hybrid",
      "allowedBlocks": [
        "esp_adc",
        "esp_wait",
        "esp_forever"
      ]
    }
  ],
  "pwm": [
    {
      "id": "pwm-dim",
      "title": "어둡게 켜기",
      "short": "어둡게 켜기",
      "goal": "GPIO18 PWM 1000Hz, 듀티 10000으로 하세요.",
      "starterCode": "from machine import Pin\n\n\n",
      "solutionCode": "from machine import Pin, PWM\n\nPWM(Pin(18), freq=1000, duty_u16=10000)\n",
      "hint": "블록의 종류, 순서, GPIO 번호와 숫자를 다시 확인해 보세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "blocks",
      "allowedBlocks": [
        "esp_pwm"
      ]
    },
    {
      "id": "pwm-mid",
      "title": "절반 밝기로",
      "short": "절반 밝기로",
      "goal": "PWM 듀티를 32768로 바꾸세요.",
      "starterCode": "from machine import Pin, PWM\n\nPWM(Pin(18), freq=1000, duty_u16=10000)\n",
      "solutionCode": "from machine import Pin, PWM\n\nPWM(Pin(18), freq=1000, duty_u16=32768)\n",
      "hint": "블록의 종류, 순서, GPIO 번호와 숫자를 다시 확인해 보세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "blocks",
      "allowedBlocks": [
        "esp_pwm"
      ]
    },
    {
      "id": "pwm-bright",
      "title": "더 밝게",
      "short": "더 밝게",
      "goal": "PWM 듀티를 55000으로 바꾸세요.",
      "starterCode": "from machine import Pin, PWM\n\nPWM(Pin(18), freq=1000, duty_u16=32768)\n",
      "solutionCode": "from machine import Pin, PWM\n\nPWM(Pin(18), freq=1000, duty_u16=55000)\n",
      "hint": "블록의 종류, 순서, GPIO 번호와 숫자를 다시 확인해 보세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "hybrid",
      "allowedBlocks": [
        "esp_pwm"
      ]
    }
  ],
  "dht": [
    {
      "id": "dht-measure",
      "title": "온도 읽기",
      "short": "온도 읽기",
      "goal": "GPIO4의 DHT11 센서 온도를 출력하세요.",
      "starterCode": "from machine import Pin\n\n\n",
      "solutionCode": "from machine import Pin\nimport dht\n\nsensor = dht.DHT11(Pin(4))\nsensor.measure()\nprint(sensor.temperature())\n",
      "hint": "블록의 종류, 순서, GPIO 번호와 숫자를 다시 확인해 보세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "blocks",
      "allowedBlocks": [
        "esp_dht"
      ]
    },
    {
      "id": "dht-loop",
      "title": "2초마다 온도",
      "short": "2초마다 온도",
      "goal": "2000ms 간격으로 온도를 반복 출력하세요.",
      "starterCode": "from machine import Pin\nimport dht\n\nsensor = dht.DHT11(Pin(4))\nsensor.measure()\nprint(sensor.temperature())\n",
      "solutionCode": "from machine import Pin\nimport time\nimport dht\n\nwhile True:\n    sensor = dht.DHT11(Pin(4))\n    sensor.measure()\n    print(sensor.temperature())\n    time.sleep_ms(2000)\n",
      "hint": "블록의 종류, 순서, GPIO 번호와 숫자를 다시 확인해 보세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "blocks",
      "allowedBlocks": [
        "esp_dht",
        "esp_wait",
        "esp_forever"
      ]
    },
    {
      "id": "dht-text",
      "title": "Python에서 간격 조절",
      "short": "Python에서 간격 조절",
      "goal": "블록 없이 대기 시간을 3000ms로 수정하세요.",
      "starterCode": "from machine import Pin\nimport time\nimport dht\n\nwhile True:\n    sensor = dht.DHT11(Pin(4))\n    sensor.measure()\n    print(sensor.temperature())\n    time.sleep_ms(2000)\n",
      "solutionCode": "from machine import Pin\nimport time\nimport dht\n\nwhile True:\n    sensor = dht.DHT11(Pin(4))\n    sensor.measure()\n    print(sensor.temperature())\n    time.sleep_ms(3000)\n",
      "hint": "블록의 종류, 순서, GPIO 번호와 숫자를 다시 확인해 보세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "python",
      "allowedBlocks": null
    }
  ],
  "neopixel": [
    {
      "id": "np-red",
      "title": "빨간 무드등",
      "short": "빨간 무드등",
      "goal": "GPIO5의 네오픽셀 8개를 빨강으로 하세요.",
      "starterCode": "from machine import Pin\n\n\n",
      "solutionCode": "from machine import Pin\nimport neopixel\n\nnp = neopixel.NeoPixel(Pin(5), 8)\nnp.fill((255, 0, 0))\nnp.write()\n",
      "hint": "블록의 종류, 순서, GPIO 번호와 숫자를 다시 확인해 보세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "blocks",
      "allowedBlocks": [
        "esp_neopixel"
      ]
    },
    {
      "id": "np-green",
      "title": "초록 무드등",
      "short": "초록 무드등",
      "goal": "초록색으로 바꾸세요.",
      "starterCode": "from machine import Pin\nimport neopixel\n\nnp = neopixel.NeoPixel(Pin(5), 8)\nnp.fill((255, 0, 0))\nnp.write()\n",
      "solutionCode": "from machine import Pin\nimport neopixel\n\nnp = neopixel.NeoPixel(Pin(5), 8)\nnp.fill((0, 255, 0))\nnp.write()\n",
      "hint": "블록의 종류, 순서, GPIO 번호와 숫자를 다시 확인해 보세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "blocks",
      "allowedBlocks": [
        "esp_neopixel"
      ]
    },
    {
      "id": "np-blue",
      "title": "파란 무드등",
      "short": "파란 무드등",
      "goal": "파란색으로 바꾸세요.",
      "starterCode": "from machine import Pin\nimport neopixel\n\nnp = neopixel.NeoPixel(Pin(5), 8)\nnp.fill((0, 255, 0))\nnp.write()\n",
      "solutionCode": "from machine import Pin\nimport neopixel\n\nnp = neopixel.NeoPixel(Pin(5), 8)\nnp.fill((0, 0, 255))\nnp.write()\n",
      "hint": "블록의 종류, 순서, GPIO 번호와 숫자를 다시 확인해 보세요.",
      "concept": "명령의 순서와 결과를 예측하세요.",
      "hardware": "연결된 ESP32에서 예상 동작을 직접 확인해 보세요.",
      "mode": "blocks",
      "allowedBlocks": [
        "esp_neopixel"
      ]
    }
  ]
};
export const getMicroMissions = chapterId => MICRO_MISSIONS[chapterId] || [];
export const getMicroMission = (chapterId, stageId) => getMicroMissions(chapterId).find(m => m.id === stageId);
