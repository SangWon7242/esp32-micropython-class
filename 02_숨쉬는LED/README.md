# 02. 숨쉬는 LED

LED가 서서히 밝아졌다 어두워지기를 되풀이합니다.

---

## 실습 목표

`PWM` 의 `duty` 값을 `for` 반복문으로 조금씩 바꿔, LED 밝기를 0부터 1023까지 서서히 조절한다.

---

## 준비물

- ESP32 메인보드 1개
- 빨강 LED 1개
- 220Ω 저항 1개
- 브레드보드 1개
- 점퍼선 몇 가닥
- Micro USB 케이블 1개

---

## 회로 연결표

| 연결 목적 | 출발(부품/핀) | 도착(부품/핀) | 설명 |
|---|---|---|---|
| PWM 신호 | ESP32 IO26 | 220Ω 저항 | 0과 1이 아니라 PWM 신호가 나갑니다 |
| 전류 제한 | 220Ω 저항 | LED 긴 다리(+) | LED 보호 |
| 되돌아오기 | LED 짧은 다리(−) | ESP32 GND | 전기가 돌아오는 길 |

### 연결 체크 포인트

- 배선은 **01 챕터와 똑같습니다.** 달라지는 것은 코드뿐입니다.
- LED의 긴 다리가 저항 쪽인가요?

---

## 코드 흐름

1. `PWM(Pin(26, Pin.OUT), 10000)` 으로 1초에 10000번 깜빡이게 준비
2. `for` 로 duty를 0 → 1023 까지 올려 점점 밝게
3. 다시 `for` 로 1023 → 0 까지 내려 점점 어둡게
4. `except` 에서 `pwm.deinit()` 으로 정리

---

## 코드 파일 목록

| 파일 | 내용 |
|---|---|
| [`step1_breathing.py`](code/step1_breathing.py) | 숨쉬는 LED 기본 |
| [`mission_slower.py`](code/mission_slower.py) | 더 천천히 숨쉬기 (미션 정답) |
| [`extra1_hold_at_bright.py`](code/extra1_hold_at_bright.py) | 가장 밝을 때 1초 멈추기 |
| [`extra2_half_brightness.py`](code/extra2_half_brightness.py) | 절반 밝기로 고정 |

> 파일을 열어 **코드를 복사**한 뒤, PyCharm의 `main.py` 에 붙여 넣고 실행하세요.

---

## 미션

### 미션 · 더 천천히 숨쉬게

LED가 더 느리게 숨쉬도록 만들어 보세요. 숫자만 바꾸면 됩니다.

정답 → [`mission_slower.py`](code/mission_slower.py)

### 추가 미션 1 · 가장 밝을 때 잠깐 멈추기

가장 밝아진 뒤 1초 머물렀다가 어두워지게 하세요.

정답 → [`extra1_hold_at_bright.py`](code/extra1_hold_at_bright.py)

### 추가 미션 2 · 절반 밝기로 고정

밝기가 변하지 않고 딱 절반 밝기로 켜져 있게 하세요.

정답 → [`extra2_half_brightness.py`](code/extra2_half_brightness.py)

---

## 알아 두기

`duty` 는 **0 ~ 1023** 입니다. 0은 꺼짐, 512는 절반, 1023은 가장 밝음입니다.

---

출처: Keyestudio KS5020 MicroPython Tutorial · docs.keyestudio.com
