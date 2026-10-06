# 09. OLED 출입 화면

08 챕터의 출입문에 작은 화면을 달아, 출입 결과를 글자로 보여 줍니다.

---

## 실습 목표

OLED 화면에 글자와 도형을 그리고, 센서 판단 결과를 화면으로 알려 준다.

---

## 준비물

- ESP32 메인보드 1개
- OLED 화면 1개
- RFID RC522 모듈 1개
- IC 카드 또는 열쇠고리 1개
- 서보모터 1개
- F-F 듀폰선 여러 가닥
- Micro USB 케이블 1개

---

## 회로 연결표

| 연결 목적 | 출발(부품/핀) | 도착(부품/핀) | 설명 |
|---|---|---|---|
| I2C 신호 | ESP32 IO22 | OLED SCL **와** RFID SCL | 두 부품이 같은 선을 나눠 씁니다 |
| I2C 데이터 | ESP32 IO21 | OLED SDA **와** RFID SDA | 두 부품이 같은 선을 나눠 씁니다 |
| 서보 신호 | ESP32 IO4 | 서보 주황색 선 | 08 챕터와 같음 |
| 전원 | ESP32 5V | OLED VCC · RFID V · 서보 빨강 | 셋 다 5V |
| 접지 | ESP32 GND | OLED GND · RFID G · 서보 갈색 | 셋 다 GND |

### 연결 체크 포인트

- OLED와 RFID의 **SCL은 둘 다 IO22**, **SDA는 둘 다 IO21** 에 함께 연결합니다.
- I2C는 여러 장치를 같은 선에 붙일 수 있습니다. **주소가 달라서** 구분됩니다 (RFID `0x28`, OLED `0x3C`).
- 화면이 안 켜지면 먼저 **전원(VCC · GND)** 부터 확인하세요.
- ⚠️ 라이브러리 **5개** 필요 — RFID 3개 + `ssd1306.py` + `gfx.py`

---

## 코드 흐름

1. `SoftI2C(scl=Pin(22), sda=Pin(21))` 로 화면이 쓸 선 정하기
2. `SSD1306_I2C(128, 64, i2c)` 로 128×64 화면 준비
3. `oled.text()` 로 적어 두고 `oled.show()` 로 화면에 띄우기
4. 08 챕터 코드에 `show()` 함수만 더해 결과를 화면에 표시

---

## 코드 파일 목록

| 파일 | 내용 |
|---|---|
| [`step1_oled_text.py`](code/step1_oled_text.py) | ① 화면에 글자 띄우기 |
| [`step2_oled_shapes.py`](code/step2_oled_shapes.py) | ② 선 · 네모 · 동그라미 그리기 |
| [`step3_access_display.py`](code/step3_access_display.py) | ③ 출입 결과를 화면에 표시 |
| [`mission_countdown.py`](code/mission_countdown.py) | 닫히기까지 카운트다운 (미션 정답) |
| [`extra1_count.py`](code/extra1_count.py) | 출입 횟수 세기 |
| [`extra2_names.py`](code/extra2_names.py) | 카드마다 다른 인사 |

> 파일을 열어 **코드를 복사**한 뒤, PyCharm의 `main.py` 에 붙여 넣고 실행하세요.

---

## 미션

### 미션 · 닫히기까지 남은 시간 보여 주기

문이 열려 있는 3초 동안 화면에 3 · 2 · 1 카운트다운을 보여 주세요.
`time.sleep(3)` 한 줄을 `for` 반복문으로 바꾸면 됩니다.

정답 → [`mission_countdown.py`](code/mission_countdown.py)

### 추가 미션 1 · 출입 횟수 세기

문이 열린 횟수를 세어 화면에 함께 보여 주세요.

정답 → [`extra1_count.py`](code/extra1_count.py)

### 추가 미션 2 · 카드마다 다른 인사

카드마다 주인 이름을 정해 두고 그 이름으로 인사하게 하세요.

정답 → [`extra2_names.py`](code/extra2_names.py)

---

## 알아 두기

**화면에는 영어와 숫자만** — 기본 글꼴에 한글이 없어서 한글을 넣으면 깨져 보입니다.

**좌표** — 왼쪽 위가 `(0, 0)` 입니다. 오른쪽으로 갈수록 x가, 아래로 갈수록 y가 커집니다. 가로 128칸, 세로 64칸.

**`show()` 를 꼭 부르세요** — `oled.text()` 는 '적어 두기'일 뿐입니다.

---

출처: Keyestudio KS5020 MicroPython Tutorial · docs.keyestudio.com
