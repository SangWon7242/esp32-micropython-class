# 04. 흐르는 물빛

LED 다섯 개가 물이 흐르듯 차례로 켜졌다 꺼집니다.

---

## 실습 목표

핀 번호를 **목록(리스트)** 에 담고 `for` 반복문으로 하나씩 꺼내 써서, 같은 코드를 다섯 번 쓰지 않는다.

---

## 준비물

- ESP32 메인보드 1개
- 빨강 LED 5개
- 220Ω 저항 5개
- 브레드보드 1개
- 점퍼선 여러 가닥
- Micro USB 케이블 1개

---

## 회로 연결표

| 연결 목적 | 출발(부품/핀) | 도착(부품/핀) | 설명 |
|---|---|---|---|
| 1번 LED | ESP32 IO18 | 220Ω → LED(+) | 목록의 첫째 |
| 2번 LED | ESP32 IO5 | 220Ω → LED(+) | 목록의 둘째 |
| 3번 LED | ESP32 IO14 | 220Ω → LED(+) | 목록의 셋째 |
| 4번 LED | ESP32 IO17 | 220Ω → LED(+) | 목록의 넷째 |
| 5번 LED | ESP32 IO26 | 220Ω → LED(+) | 목록의 다섯째 |
| 되돌아오기 | LED 5개의 짧은 다리(−) | ESP32 GND | 모두 같은 GND 줄로 |

### 연결 체크 포인트

- 왼쪽부터 **18 · 5 · 14 · 17 · 26** 순서로 꽂았나요? 순서가 뒤바뀌면 물결처럼 안 보입니다.
- 저항을 LED마다 하나씩 달았나요? (총 5개)
- LED 5개의 짧은 다리가 모두 GND 줄에 있나요?

---

## 코드 흐름

1. `pins = [18, 5, 14, 17, 26]` 로 핀 번호를 한 줄에 모으기
2. `for pin in pins:` 로 왼쪽부터 하나씩 꺼내 켜고 끄기
3. `for pin in reversed(pins):` 로 거꾸로 읽어 되돌아오기
4. `while True` 안에서 `showLed()` 를 계속 부르기

---

## 코드 파일 목록

| 파일 | 내용 |
|---|---|
| [`step1_flowing.py`](code/step1_flowing.py) | 흐르는 물빛 기본 |
| [`mission_faster.py`](code/mission_faster.py) | 두 배 빠르게 (미션 정답) |
| [`extra1_one_way.py`](code/extra1_one_way.py) | 한 방향으로만 흐르기 |
| [`extra2_all_on_then_off.py`](code/extra2_all_on_then_off.py) | 하나씩 켜서 모두 켠 뒤 한꺼번에 끄기 |

> 파일을 열어 **코드를 복사**한 뒤, PyCharm의 `main.py` 에 붙여 넣고 실행하세요.

---

## 미션

### 미션 · 두 배 빠르게 흐르게

흐르는 속도를 두 배 빠르게 만들어 보세요. `time.sleep_ms()` 가 네 곳에 나옵니다.

정답 → [`mission_faster.py`](code/mission_faster.py)

### 추가 미션 1 · 한 방향으로만

되돌아오지 않고 한 방향으로만 흐르게 하세요.

정답 → [`extra1_one_way.py`](code/extra1_one_way.py)

### 추가 미션 2 · 모두 켰다가 한꺼번에 끄기

하나씩 켜지되 꺼지지 않고, 다섯 개가 다 켜지면 1초 뒤 한꺼번에 꺼지게 하세요.

정답 → [`extra2_all_on_then_off.py`](code/extra2_all_on_then_off.py)

---

## 알아 두기

`reversed(pins)` 는 목록을 **뒤에서부터** 읽어 줍니다. 26 → 17 → 14 → 5 → 18 순서가 됩니다.

---

출처: Keyestudio KS5020 MicroPython Tutorial · docs.keyestudio.com
