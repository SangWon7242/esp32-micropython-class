# 01. LED 켜기

디지털 핀으로 LED를 켜고 끄고, 원하는 리듬으로 깜빡이게 만듭니다.

---

## 실습 목표

디지털 핀을 `value(1)` / `value(0)` 으로 켜고 끄고, `time.sleep` 과 `while True` 로 LED를 원하는 리듬으로 깜빡이게 한다.

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
| 신호 보내기 | ESP32 IO26 | 220Ω 저항 | LED를 켤 신호가 나가는 핀 |
| 전류 제한 | 220Ω 저항 | LED 긴 다리(+) | 저항이 없으면 LED가 망가집니다 |
| 되돌아오기 | LED 짧은 다리(−) | ESP32 GND | 전기가 돌아오는 길 |

### 연결 체크 포인트

- LED의 **긴 다리**가 저항 쪽인가요?
- 짧은 다리가 **GND** 로 가나요?
- 저항 색띠가 빨강·빨강·검정·검정·갈색(220Ω)인가요?
- 배선을 바꿀 때는 **USB를 먼저 뽑으세요.**

---

## 코드 흐름

1. `Pin(26, Pin.OUT)` 으로 26번 핀을 출력으로 준비
2. `led.value(1)` 로 켜고 `led.value(0)` 으로 끄기
3. `time.sleep()` 으로 켜진 시간을 조절
4. `while True` 로 켜고 끄기를 끝없이 반복

---

## 코드 파일 목록

| 파일 | 내용 |
|---|---|
| [`step1_led_on.py`](code/step1_led_on.py) | LED 켜기 |
| [`step2_led_off.py`](code/step2_led_off.py) | LED 끄기 (미션 정답) |
| [`step3_blink_once.py`](code/step3_blink_once.py) | 1초 켰다가 끄기 |
| [`step4_blink_loop.py`](code/step4_blink_loop.py) | 계속 깜빡이기 |
| [`mission1_slow_blink.py`](code/mission1_slow_blink.py) | 2초 켜고 1초 끄기 |
| [`mission2_fast_blink.py`](code/mission2_fast_blink.py) | 0.2초씩 빠르게 |
| [`mission3_sos.py`](code/mission3_sos.py) | SOS 신호 보내기 |

> 파일을 열어 **코드를 복사**한 뒤, PyCharm의 `main.py` 에 붙여 넣고 실행하세요.

---

## 미션

### 미션 · LED를 꺼 보세요

방금 켠 LED를 코드로 꺼 보세요. 한 글자만 바꾸면 됩니다.

정답 → [`step2_led_off.py`](code/step2_led_off.py)

### 추가 미션 1 · 2초 켜고 1초 끄기

켜진 시간과 꺼진 시간을 다르게 만들어 보세요.

정답 → [`mission1_slow_blink.py`](code/mission1_slow_blink.py)

### 추가 미션 2 · 빠르게 깜빡이기

0.2초씩 깜빡이게 해 보세요. 더 줄이면 어떻게 될까요?

정답 → [`mission2_fast_blink.py`](code/mission2_fast_blink.py)

### 추가 미션 3 · SOS 신호

짧게 3번, 길게 3번, 짧게 3번을 반복해 보세요.

정답 → [`mission3_sos.py`](code/mission3_sos.py)

---

## 알아 두기

`time.sleep(1)` 은 **초** 단위, `time.sleep_ms(100)` 은 **밀리초** 단위입니다.

---

출처: Keyestudio KS5020 MicroPython Tutorial · docs.keyestudio.com
