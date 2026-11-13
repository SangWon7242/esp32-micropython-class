# 4단계 · 비밀번호로 문 열기 (키패드 + 서보 + 화면 + 부저)
# 숫자를 누르고 # 을 누르면 확인, * 을 누르면 지우기

from machine import Pin, PWM, SoftI2C
from keypad import KeyPad
import ssd1306
import time

keyPad = KeyPad(26, 25, 17, 16, 27, 14, 12, 13)

i2c = SoftI2C(scl=Pin(22), sda=Pin(21))    # 화면이 쓸 두 선
oled = ssd1306.SSD1306_I2C(128, 64, i2c)   # 128x64 화면

door = PWM(Pin(4))                         # 문 역할 서보
door.freq(50)
door.duty_u16(1638)                        # 처음엔 잠금

buzzer = PWM(Pin(32))                      # 소리
buzzer.duty(0)

PASSWORD = "1234"                          # ★ 내 비밀번호로 바꾸세요
typed = ""                                 # 지금까지 누른 숫자


def beep(f=1500, ms=80):                   # 소리 한 번 내는 함수
    buzzer.freq(f)                         # 음 높이
    buzzer.duty(300)                       # 소리 켜기
    time.sleep_ms(ms)                      # 잠깐 유지
    buzzer.duty(0)                         # 소리 끄기


def show(a, b):                            # 두 줄 띄우는 함수
    oled.fill(0)                           # 화면 지우기
    oled.text(a, 0, 20)                    # 첫 줄
    oled.text(b, 0, 38)                    # 둘째 줄
    oled.show()                            # 화면에 나타내기


show("LOCKED", "enter code")               # 첫 화면

while True:
    k = keyPad.scan()
    if k is not None:
        key = str(k)                       # 글자로 맞춰 두기
        beep(2000, 50)                     # 눌렸다는 신호음

        if key == "*":                     # 지우기
            typed = ""
            show("LOCKED", "cleared")
        elif key == "#":                   # 확인
            if typed == PASSWORD:          # 비밀번호가 맞으면
                show("UNLOCKED", "welcome!")
                door.duty_u16(8100)        # 문 열기
                beep(2500, 250)            # 성공음
                time.sleep(3)              # 3초 열어 두기
                door.duty_u16(1638)        # 다시 잠금
                show("LOCKED", "enter code")
            else:                          # 틀리면
                show("DENIED", "try again")
                beep(400, 400)             # 낮은 경고음
                time.sleep(1)
                show("LOCKED", "enter code")
            typed = ""                     # 입력 지우기
        else:                              # 숫자나 문자면
            typed = typed + key            # 뒤에 붙이기
            show("LOCKED", "*" * len(typed))  # 누른 개수만 보여 주기

        time.sleep_ms(300)
    time.sleep_ms(20)
