# 05. RGB LED

빨강 · 초록 · 파랑을 섞어 원하는 색을 만들어 냅니다.

---

## 실습 목표

빛의 삼원색 세기를 0~255로 정해 PWM 밝기로 바꿔 보내서, LED 하나로 여러 색을 만든다.

---

## 준비물

- ESP32 메인보드 1개
- RGB LED 1개 (다리 4개)
- 220Ω 저항 3개
- 브레드보드 1개
- 점퍼선 여러 가닥
- Micro USB 케이블 1개

---

## 회로 연결표

| 연결 목적 | 출발(부품/핀) | 도착(부품/핀) | 설명 |
|---|---|---|---|
| 빨강(R) | ESP32 IO27 | 220Ω → RGB LED R | 빨강 밝기 조절 |
| 초록(G) | ESP32 IO25 | 220Ω → RGB LED G | 초록 밝기 조절 |
| 파랑(B) | ESP32 IO26 | 220Ω → RGB LED B | 파랑 밝기 조절 |
| 공통 음극 | RGB LED 가장 긴 다리 | ESP32 GND | 세 색이 함께 쓰는 (−) |

### 연결 체크 포인트

- **가장 긴 다리**가 GND에 꽂혔나요?
- 나머지 세 다리에 220Ω 저항을 **각각** 달았나요?
- 다리 순서는 사진처럼 놓았을 때 왼쪽부터 **빨강 · GND · 초록 · 파랑** 입니다.

---

## 코드 흐름

1. 세 핀을 모두 PWM으로 만들고 `freq(1000)` 설정
2. `interval_mapping()` 으로 0~255 를 0~1023 으로 바꾸기
3. `set_color(r, g, b)` 로 세 색을 한꺼번에 정하기
4. `while True` 안에서 색을 차례로 바꾸기

---

## 코드 파일 목록

| 파일 | 내용 |
|---|---|
| [`step1_rgb_colors.py`](code/step1_rgb_colors.py) | 일곱 가지 색 바꾸기 |
| [`mission_orange.py`](code/mission_orange.py) | 주황색 만들기 (미션 정답) |
| [`extra1_my_colors.py`](code/extra1_my_colors.py) | 내가 좋아하는 색 3가지 |
| [`extra2_rainbow.py`](code/extra2_rainbow.py) | 무지개 7색 |

> 파일을 열어 **코드를 복사**한 뒤, PyCharm의 `main.py` 에 붙여 넣고 실행하세요.

---

## 미션

### 미션 · 주황색을 만들어 보세요

빨강과 노랑 사이의 주황색을 만들어 보세요. 초록 값을 중간쯤으로 줄여 보세요.

정답 → [`mission_orange.py`](code/mission_orange.py)

### 추가 미션 1 · 내가 좋아하는 색 3가지

그림판 색 편집에서 R·G·B 값을 찾아 세 가지 색을 1초씩 보여 주세요.

정답 → [`extra1_my_colors.py`](code/extra1_my_colors.py)

### 추가 미션 2 · 무지개 7색

무지개 일곱 색을 0.5초씩 순서대로 보여 주세요.

정답 → [`extra2_rainbow.py`](code/extra2_rainbow.py)

---

## 알아 두기

`set_color(255, 0, 0)` 의 숫자 세 개는 차례대로 **빨강 · 초록 · 파랑**의 밝기(0~255)입니다.

**여기서 배운 RGB LED는 08장에서 다시 씁니다** — 출입문이 열릴 때마다 랜덤 색으로 빛나게 만듭니다 → [08장 추가 미션 3](../08_출입통제/README.md#추가-미션-3--문이-열릴-때마다-랜덤-색으로-빛나기)

---

출처: Keyestudio KS5020 MicroPython Tutorial · docs.keyestudio.com
