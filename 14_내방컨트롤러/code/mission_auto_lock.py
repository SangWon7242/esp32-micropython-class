# 미션 정답 · 문이 열린 뒤 5초가 지나면 저절로 잠기게
# step5_room.py 에 '열린 시각'을 적어 두고 지난 시간을 재는 부분을 더했습니다.

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
opened_at = 0                              # ★ 문이 열린 시각


def show():
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
    k = keyPad.scan()
    if k is not None:
        key = str(k)

        if key == "*":
            typed = ""
        elif key == "#":
            if typed == PASSWORD:
                opened = True
                door.duty_u16(8100)
                opened_at = time.ticks_ms()   # ★ 열린 시각을 적어 두기
            else:
                opened = False
                door.duty_u16(1638)
            typed = ""
        else:
            typed = typed + key

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

    if opened:                             # ★ 열려 있을 때만 시간을 재기
        passed = time.ticks_diff(time.ticks_ms(), opened_at)
        if passed > 5000:                  # 5초가 지났으면
            opened = False
            door.duty_u16(1638)            # 스스로 잠그기
            show()

    time.sleep_ms(20)
