# 07. 작은 선풍기

130 모터에 팬을 끼워, 앞뒤로 도는 작은 선풍기를 만듭니다.

---

## 실습 목표

두 핀의 값 조합으로 모터의 **앞으로 · 뒤로 · 정지**를 정하고, 자주 쓰는 동작에 이름(함수)을 붙인다.

---

## 준비물

- ESP32 메인보드 1개
- 130 모터 모듈 1개
- 팬 날개 1개
- 배터리 홀더 1개
- AA 건전지 6개 (따로 준비)
- M-F 듀폰선 몇 가닥
- Micro USB 케이블 1개

---

## 회로 연결표

| 연결 목적 | 출발(부품/핀) | 도착(부품/핀) | 설명 |
|---|---|---|---|
| 방향 제어 1 | ESP32 IO13 | 모터 모듈 IN+ | motor1a 라고 부릅니다 |
| 방향 제어 2 | ESP32 IO12 | 모터 모듈 IN- | motor1b 라고 부릅니다 |
| 모터 전원 | ESP32 5V | 모터 모듈 V | 모터가 쓰는 전원 |
| 접지 | ESP32 GND | 모터 모듈 G | 기준점 공유 |
| 외부 전원 | 배터리 홀더(AA 6개) | ESP32 외부 전원 단자 | USB만으로는 전류가 모자랍니다 |

### 연결 체크 포인트

- **팬 날개는 배선을 모두 끝낸 뒤에** 끼우세요. 배선 중에 돌면 다칩니다.
- 팬이 도는 자리에 손이나 머리카락이 닿지 않나요?
- AA 6개를 넣은 배터리 홀더를 외부 전원 단자에 꽂았나요?
- G · V · IN+ · IN- 가 각각 GND · 5V · IO13 · IO12 에 맞게 갔나요?

---

## 코드 흐름

1. 두 핀을 출력으로 준비
2. `forward()` · `backward()` · `stop()` 세 함수 만들기
3. `test()` 로 앞으로 → 정지 → 뒤로 → 정지 한 묶음 만들기
4. `for i in range(5)` 로 5번 반복

---

## 코드 파일 목록

| 파일 | 내용 |
|---|---|
| [`step1_direction.py`](code/step1_direction.py) | 방향을 정하는 함수 3개 |
| [`step2_sequence.py`](code/step2_sequence.py) | 순서를 정하고 반복하기 |
| [`mission_forever.py`](code/mission_forever.py) | 끝나지 않는 선풍기 (미션 정답) |
| [`extra1_one_way.py`](code/extra1_one_way.py) | 한 방향으로만 돌기 |
| [`extra2_pwm_speed.py`](code/extra2_pwm_speed.py) | PWM으로 바람 세기 바꾸기 |

> 파일을 열어 **코드를 복사**한 뒤, PyCharm의 `main.py` 에 붙여 넣고 실행하세요.

---

## 미션

### 미션 · 끝나지 않는 선풍기

5번 만에 끝나지 않고, 멈출 때까지 계속 돌게 만들어 보세요.

정답 → [`mission_forever.py`](code/mission_forever.py)

### 추가 미션 1 · 한 방향으로만

진짜 선풍기처럼 한 방향으로만 돌게 하세요.

정답 → [`extra1_one_way.py`](code/extra1_one_way.py)

### 추가 미션 2 · 바람 세기 바꾸기

02 챕터의 PWM을 떠올려 보세요. IN+를 PWM으로 만들면 속도를 조절할 수 있습니다.

정답 → [`extra2_pwm_speed.py`](code/extra2_pwm_speed.py)

---

## 알아 두기

**왜 건전지를 따로 쓰나요?** LED 하나는 10mA면 되지만 130 모터는 200mA까지 씁니다. USB에서만 끌어 쓰면 전압이 떨어져 보드가 저절로 다시 시작될 수 있습니다.

---

출처: Keyestudio KS5020 MicroPython Tutorial · docs.keyestudio.com
