# 추가 미션 1 정답 · 키패드 A · B 로도 바람 세기 바꾸기
# 단계를 적용하는 일을 set_level() 함수로 묶어, 리모컨과 키패드가 함께 씁니다.

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


def show():
    oled.fill(0)
    if opened:
        oled.text("UNLOCKED", 0, 6)
    else:
        oled.text("LOCKED", 0, 6)
        oled.text("*" * len(typed), 0, 26)
    oled.text("FAN " + LEVELS[level][1], 0, 48)
    oled.show()


def set_level(n):                          # ★ 단계를 적용하는 함수
    global level
    if n > 3:                              # 3 을 넘지 않게
        n = 3
    if n < 0:                              # 0 아래로 안 가게
        n = 0
    level = n
    motor1a.duty(LEVELS[level][0])
    show()


show()

while True:
    k = keyPad.scan()
    if k is not None:
        key = str(k)

        if key == "A":                     # ★ 세게
            set_level(level + 1)
        elif key == "B":                   # ★ 약하게
            set_level(level - 1)
        elif key == "*":
            typed = ""
            show()
        elif key == "#":
            if typed == PASSWORD:
                opened = True
                door.duty_u16(8100)
            else:
                opened = False
                door.duty_u16(1638)
            typed = ""
            show()
        else:
            typed = typed + key
            show()

        time.sleep_ms(300)

    v = ir.ir_read()
    if v:
        v = str(v).lower()
        if v in KEYS:
            set_level(KEYS[v])             # ★ 리모컨도 같은 함수를 씁니다
        time.sleep_ms(300)

    time.sleep_ms(20)
