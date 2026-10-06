# ESP32 MicroPython 수업 자료

ESP32와 MicroPython으로 LED·모터·센서·화면을 직접 제어해 보는 **수업용 코드 저장소**입니다.

학생들이 코드를 처음부터 다 타이핑하지 않고, **여기서 기초 코드를 복사해 붙여 넣고 바꿔 보는 데**에 목적이 있습니다.

- 보드: ESP32 (Keyestudio ESP32 PLUS)
- 키트: Keyestudio KS5020 ESP32 IoT 학습 키트
- 개발 도구: **PyCharm + MicroPython Tools 플러그인**

---

## 어떻게 쓰나요?

1. 챕터 폴더를 엽니다 (예: `01_LED켜기`)
2. `README.md` 를 보고 **배선**을 먼저 합니다
3. `code/` 안의 파일을 열어 **코드를 복사**합니다
4. PyCharm의 `main.py` 에 붙여 넣고 보드로 올린 뒤 실행합니다

> 처음이라면 **[PyCharm 설정 안내](docs/pycharm-setup.md)** 를 먼저 읽어 주세요.
> 잘 안 될 때는 **[문제 해결](docs/troubleshooting.md)** 을 보세요.

---

## 챕터 목차

| 챕터 | 주제 | 코딩 목표 |
|---|---|---|
| [01](01_LED켜기) | LED 켜기 | 디지털 핀을 켜고 끄고, `time.sleep` 과 `while True` 로 깜빡이게 한다 |
| [02](02_숨쉬는LED) | 숨쉬는 LED | `PWM` 의 `duty` 를 `for` 로 바꿔 밝기를 서서히 조절한다 |
| [03](03_신호등) | 신호등 | LED 세 개에 이름을 붙여 순서·시간을 정하고 `for` 로 묶는다 |
| [04](04_흐르는물빛) | 흐르는 물빛 | 핀 번호를 **목록**에 담고 `for` 로 하나씩 꺼내 쓴다 |
| [05](05_RGB_LED) | RGB LED | 빛의 삼원색을 섞어 원하는 색을 만든다 |
| [06](06_7세그먼트) | 7세그먼트 | 74HC595로 핀 3개를 써서 LED 8개를 제어한다 |
| [07](07_작은선풍기) | 작은 선풍기 | 두 핀의 조합으로 모터의 방향과 정지를 정한다 |
| [08](08_출입통제) | 스마트 출입 통제 | RFID로 읽은 번호를 `if` 로 비교해 서보와 LED를 제어한다 |
| [09](09_OLED출입화면) | OLED 출입 화면 | 센서 결과를 화면에 글자로 보여 준다 |

---

## 폴더 구조

```text
챕터 폴더/
├─ README.md     # 실습 목표, 준비물, 회로 연결표, 코드 흐름
└─ code/         # 복사해서 쓰는 MicroPython 코드
```

```text
lib/             # 보드에 함께 올려야 하는 라이브러리 안내
docs/            # PyCharm 설정, 문제 해결
```

---

## 라이브러리

RFID·OLED 챕터는 **별도 라이브러리 파일**을 보드에 올려야 합니다.
어떤 파일이 왜 필요한지는 **[lib/README.md](lib/README.md)** 를 보세요.

---

## 출처

코드와 배선은 **Keyestudio KS5020 MicroPython Tutorial** 을 기준으로 하고,
수업에 맞게 주석과 단계를 다시 구성했습니다.

<https://docs.keyestudio.com/projects/KS5020/en/latest/docs/2.%20MicroPython_Tutorial.html>
