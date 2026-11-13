# 추가 미션 2 정답 · 세 번 틀리면 10초 동안 입력을 막기
# 틀린 횟수를 세어 두고, 세 번째가 되면 10초 동안 아무것도 받지 않습니다.

from machine import Pin, PWM, SoftI2C
from keypad import KeyPad
from irrecvdata import irGetCMD
import ssd1306
import time

keyPad = KeyPad(26, 25, 33, 32, 27, 14, 16, 17)
ir = irGetCMD(5)

i2c = SoftI2C(scl=Pin(22), sda=Pin(21))
oled = ssd1306.SSD1306_I2C(128, 64, i2c)

door = PWM(Pin(4))
door.freq(50)
door.duty_u16(1638)

motor1a = PWM(Pin(13), 1000)
motor1b = Pin(12, Pin.OUT)
motor1b.value(0)

LEVELS = [(0, "OFF"), (400, "LOW"), (700, "MID"), (1023, "HIGH")]
KEYS = {"0xff4ab5": 0, "0xff6897": 1, "0xff9867": 2, "0xffb04f": 3}

PASSWORD = "1234"
typed = ""
opened = False
level = 0
wrong = 0                                  # ★ 틀린 횟수
blocked_at = 0                             # ★ 묶인 시각


def show():
    oled.fill(0)
    if opened:
        oled.text("UNLOCKED", 0, 6)
    else:
        oled.text("LOCKED", 0, 6)
        oled.text("*" * len(typed), 0, 26)
        oled.text("left " + str(3 - wrong), 70, 26)   # 남은 횟수
    oled.text("FAN " + LEVELS[level][1], 0, 48)
    oled.show()


show()

while True:
    if wrong >= 3:                         # ★ 묶여 있으면 입력을 받지 않기
        if time.ticks_diff(time.ticks_ms(), blocked_at) > 10000:
            wrong = 0                      # 10초가 지나면 풀어 주기
            show()
        else:
            time.sleep_ms(100)
            continue

    k = keyPad.scan()
    if k is not None:
        key = str(k)

        if key == "*":
            typed = ""
        elif key == "#":
            if typed == PASSWORD:
                opened = True
                door.duty_u16(8100)
                wrong = 0                  # ★ 맞혔으면 0 으로 되돌리기
            else:
                opened = False
                door.duty_u16(1638)
                wrong = wrong + 1          # ★ 틀린 횟수 세기
                if wrong >= 3:
                    blocked_at = time.ticks_ms()
                    oled.fill(0)
                    oled.text("BLOCKED", 0, 16)
                    oled.text("wait 10s", 0, 36)
                    oled.show()
            typed = ""

        if wrong < 3:
            show()
        time.sleep_ms(300)

    v = ir.ir_read()
    if v:
        v = str(v).lower()
        if v in KEYS:
            level = KEYS[v]
            motor1a.duty(LEVELS[level][0])
            show()
        time.sleep_ms(300)

    time.sleep_ms(20)
