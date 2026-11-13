# 5단계 · 내 방 컨트롤러 완성
# 키패드 비밀번호로 문을 열고, 리모컨 0 1 2 3 으로 선풍기 세기를 바꿉니다.

from machine import Pin, PWM, SoftI2C
from keypad import KeyPad
from irrecvdata import irGetCMD
import ssd1306
import time

keyPad = KeyPad(26, 25, 33, 32, 27, 14, 16, 17)
ir = irGetCMD(5)

i2c = SoftI2C(scl=Pin(22), sda=Pin(21))
oled = ssd1306.SSD1306_I2C(128, 64, i2c)

door = PWM(Pin(4))                         # 문
door.freq(50)
door.duty_u16(1638)

motor1a = PWM(Pin(13), 1000)               # 선풍기 (13장 그대로)
motor1b = Pin(12, Pin.OUT)
motor1b.value(0)

LEVELS = [(0, "OFF"), (400, "LOW"), (700, "MID"), (1023, "HIGH")]
KEYS = {"0xff4ab5": 0, "0xff6897": 1, "0xff9867": 2, "0xffb04f": 3}

PASSWORD = "1234"
typed = ""
opened = False                             # 문이 열려 있는지
level = 0                                  # 바람 세기 단계


def show():                                # 문 상태와 바람 세기를 함께
    oled.fill(0)
    if opened:
        oled.text("UNLOCKED", 0, 6)
    else:
        oled.text("LOCKED", 0, 6)
        oled.text("*" * len(typed), 0, 26)
    oled.text("FAN " + LEVELS[level][1], 0, 48)
    oled.show()


show()

while True:
    k = keyPad.scan()                      # ① 키패드 보기
    if k is not None:
        key = str(k)

        if key == "*":
            typed = ""
        elif key == "#":
            if typed == PASSWORD:
                opened = True
                door.duty_u16(8100)
            else:
                opened = False
                door.duty_u16(1638)
            typed = ""
        else:
            typed = typed + key

        show()
        time.sleep_ms(300)

    v = ir.ir_read()                       # ② 리모컨 보기
    if v:
        v = str(v).lower()
        if v in KEYS:
            level = KEYS[v]
            motor1a.duty(LEVELS[level][0])
            show()
        time.sleep_ms(300)

    time.sleep_ms(20)
