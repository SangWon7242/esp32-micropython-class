# 4단계 · 비밀번호가 맞으면 서보가 문을 열게 하기 (화면에도 표시)

from machine import Pin, PWM, SoftI2C
from keypad import KeyPad
import ssd1306
import time

keyPad = KeyPad(26, 25, 33, 32, 27, 14, 16, 17)

i2c = SoftI2C(scl=Pin(22), sda=Pin(21))    # 화면이 쓸 두 선 (13장 그대로)
oled = ssd1306.SSD1306_I2C(128, 64, i2c)

door = PWM(Pin(4))                         # 문 역할 서보 (08장과 같은 핀)
door.freq(50)
door.duty_u16(1638)                        # 처음엔 잠금

PASSWORD = "1234"
typed = ""


def show(a, b):                            # 두 줄 띄우는 함수
    oled.fill(0)
    oled.text(a, 0, 20)
    oled.text(b, 0, 40)
    oled.show()


show("LOCKED", "enter code")

while True:
    k = keyPad.scan()
    if k is not None:
        key = str(k)

        if key == "*":
            typed = ""
            show("LOCKED", "cleared")
        elif key == "#":
            if typed == PASSWORD:
                door.duty_u16(8100)        # 문 열기
                show("UNLOCKED", "welcome!")
                time.sleep(3)              # 3초 열어 두기
                door.duty_u16(1638)        # 다시 잠금
                show("LOCKED", "enter code")
            else:
                show("DENIED", "try again")
                time.sleep(1)
                show("LOCKED", "enter code")
            typed = ""
        else:
            typed = typed + key
            show("LOCKED", "*" * len(typed))   # 누른 개수만 보여 주기

        time.sleep_ms(300)
    time.sleep_ms(20)
