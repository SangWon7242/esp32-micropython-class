# 03. 신호등

빨강 · 노랑 · 초록 LED 세 개로 진짜 신호등처럼 순서대로 불이 바뀝니다.

---

## 실습 목표

LED 세 개에 각각 이름을 붙여 순서와 시간을 정하고, 반복되는 부분을 `for` 반복문으로 묶어 짧게 만든다.

---

## 준비물

- ESP32 메인보드 1개
- 빨강 · 노랑 · 초록 LED 각 1개
- 220Ω 저항 3개
- 브레드보드 1개
- 점퍼선 몇 가닥
- Micro USB 케이블 1개

---

## 회로 연결표

| 연결 목적 | 출발(부품/핀) | 도착(부품/핀) | 설명 |
|---|---|---|---|
| 빨간불 | ESP32 IO13 | 220Ω → 빨강 LED(+) | led_red 라고 부릅니다 |
| 노란불 | ESP32 IO14 | 220Ω → 노랑 LED(+) | led_yellow 라고 부릅니다 |
| 초록불 | ESP32 IO16 | 220Ω → 초록 LED(+) | led_green 이라고 부릅니다 |
| 되돌아오기 | LED 3개의 짧은 다리(−) | ESP32 GND | 셋 다 같은 GND 줄로 |

### 연결 체크 포인트

- LED 세 개의 **짧은 다리가 모두 GND 줄**에 있나요?
- 저항을 **LED마다 하나씩** 달았나요? (총 3개)
- 핀 번호(13 · 14 · 16)와 색이 맞나요?

---

## 코드 흐름

1. LED 세 개를 각각 다른 이름으로 준비
2. 빨간불 5초 → 끄기
3. 노란불 0.5초 간격으로 깜빡
4. 초록불 5초 → 끄기, 그리고 반복

---

## 코드 파일 목록

| 파일 | 내용 |
|---|---|
| [`step1_traffic_light.py`](code/step1_traffic_light.py) | 신호등 기본 |
| [`mission_yellow_5times.py`](code/mission_yellow_5times.py) | 노란불 5번 깜빡 (미션 정답) |
| [`extra1_change_time.py`](code/extra1_change_time.py) | 빨강 3초 · 초록 7초 |
| [`extra2_change_order.py`](code/extra2_change_order.py) | 초록 → 노랑 → 빨강 순서로 |

> 파일을 열어 **코드를 복사**한 뒤, PyCharm의 `main.py` 에 붙여 넣고 실행하세요.

---

## 미션

### 미션 · 노란불을 다섯 번 깜빡이게

노란불이 세 번이 아니라 다섯 번 깜빡이게 하세요.
같은 줄을 더 붙여 쓰지 말고, `for` 반복문으로 묶어 보세요.

정답 → [`mission_yellow_5times.py`](code/mission_yellow_5times.py)

### 추가 미션 1 · 신호 시간 바꾸기

빨간불 3초, 초록불 7초로 바꿔 보세요.

정답 → [`extra1_change_time.py`](code/extra1_change_time.py)

### 추가 미션 2 · 실제 신호등 순서로

초록 → 노랑 → 빨강 순서로 바꿔 보세요.

정답 → [`extra2_change_order.py`](code/extra2_change_order.py)

---

## 알아 두기

`for i in range(5):` 아래 줄은 **한 칸 더 들여쓰기** 해야 합니다. 들여쓰기가 곧 '반복할 범위'입니다.

---

출처: Keyestudio KS5020 MicroPython Tutorial · docs.keyestudio.com
