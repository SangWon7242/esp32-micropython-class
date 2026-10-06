# 08. 스마트 출입 통제 시스템

RFID 카드로 신분을 확인하고, 서보모터가 문을 여는 출입 통제 장치를 만듭니다.

---

## 실습 목표

RFID로 읽은 카드 번호를 등록 목록과 `if` 로 비교해, 그 결과에 따라 서보와 LED를 제어한다.

---

## 준비물

- ESP32 메인보드 1개
- RFID RC522 모듈 1개
- IC 카드 또는 열쇠고리 1개
- 서보모터 1개
- F-F 듀폰선 여러 가닥
- Micro USB 케이블 1개
- (추가 미션용) 빨강 LED 1개 · 220Ω 저항 1개

---

## 회로 연결표

| 연결 목적 | 출발(부품/핀) | 도착(부품/핀) | 설명 |
|---|---|---|---|
| 서보 신호 | ESP32 IO4 | 서보 주황색 선 | 각도를 정하는 PWM 신호 |
| RFID 신호 | ESP32 IO22 | RFID SCL | I2C 신호선 |
| RFID 데이터 | ESP32 IO21 | RFID SDA | I2C 데이터선 |
| 전원 | ESP32 5V | 서보 빨강 · RFID V | 두 부품 모두 5V |
| 접지 | ESP32 GND | 서보 갈색 · RFID G | 두 부품 모두 GND |
| (추가) LED | ESP32 IO26 | 220Ω → LED(+) → GND | 문이 열리면 켜지는 불 |

### 연결 체크 포인트

- 서보의 **주황색 신호선**이 IO4에 꽂혔나요?
- RFID의 SCL은 **IO22**, SDA는 **IO21** 인가요?
- 서보 혼(날개)이 문을 막는 방향으로 끼워졌나요?
- ⚠️ **라이브러리 파일 3개**를 보드에 올렸나요? → [lib/README.md](../lib/README.md)

---

## 코드 흐름

1. **1단계** — RFID 코드만 돌려서 내 카드 번호를 읽어 적어 두기
2. **2단계** — 서보 코드만 돌려서 닫힌 자리와 열린 자리 확인하기
3. **3단계** — 둘을 합쳐서, 번호가 맞을 때만 서보를 돌리기
4. 읽은 번호를 `allowed` 목록과 `in` 으로 비교

---

## 코드 파일 목록

| 파일 | 내용 |
|---|---|
| [`step1_read_uid.py`](code/step1_read_uid.py) | ① 내 카드 번호 읽기 |
| [`step2_servo_test.py`](code/step2_servo_test.py) | ② 서보 움직여 보기 |
| [`step3_access_control.py`](code/step3_access_control.py) | ③ 출입 통제 완성 |
| [`mission_allowed_list.py`](code/mission_allowed_list.py) | 목록과 in 으로 바꾸기 (미션 정답) |
| [`mission_led.py`](code/mission_led.py) | 문이 열리면 불도 켜지게 |
| [`extra1_auto_close.py`](code/extra1_auto_close.py) | 3초 뒤 저절로 닫히기 |
| [`extra2_toggle.py`](code/extra2_toggle.py) | 댈 때마다 열고 닫기 |

> 파일을 열어 **코드를 복사**한 뒤, PyCharm의 `main.py` 에 붙여 넣고 실행하세요.

---

## 미션

### 먼저 할 일 · 내 카드 번호 알아내기

`step1_read_uid.py` 를 실행하고 카드를 대면 숫자 네 개가 찍힙니다.
그 숫자를 **꼭 적어 두고**, 아래 코드들의 `uid1` 을 내 번호로 바꾸세요.

### 미션 · 카드가 늘어나도 괜찮게

지금은 카드가 한 장이지만, 나중에 친구 카드를 더하려면 어떻게 해야 할까요?
`or` 로 이어 붙이는 대신 **목록과 `in`** 을 써 보세요.

정답 → [`mission_allowed_list.py`](code/mission_allowed_list.py)

> 💡 **카드가 한 장이어도 시험할 수 있어요.** 목록의 숫자 하나를 일부러 틀리게 바꿔 보세요. 같은 카드를 대도 문이 안 열리면 `else` 가 잘 돈 것입니다.

### 조립 + 코드 미션 · 문이 열리면 불도 켜지게

LED를 하나 더 달아, 문이 열려 있는 동안 불이 켜지게 만드세요.
배선은 **IO26 → 220Ω → LED 긴 다리 → GND** (01 챕터와 같습니다).

정답 → [`mission_led.py`](code/mission_led.py)

### 추가 미션 1 · 3초 뒤 저절로 닫히기

문이 열린 뒤 3초가 지나면 저절로 닫히게 하세요.

정답 → [`extra1_auto_close.py`](code/extra1_auto_close.py)

### 추가 미션 2 · 댈 때마다 열고 닫기

같은 카드를 다시 대면 문이 닫히게 하세요. 상태를 기억할 이름이 하나 필요합니다.

정답 → [`extra2_toggle.py`](code/extra2_toggle.py)

---

## 알아 두기

**카드가 한 번만 읽히는 이유** — 이 라이브러리에는 `PICC_HaltA` 가 없어서, 한 번 읽힌 카드는 다시 읽히지 않습니다. **카드를 떼었다가 다시 대야** 합니다.

**서보 각도** — `duty_u16(1638)` 이 닫힌 자리, `duty_u16(8100)` 이 열린 자리입니다.

---

출처: Keyestudio KS5020 MicroPython Tutorial · docs.keyestudio.com
