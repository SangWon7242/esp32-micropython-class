# 미션 정답 · 리모컨 ▲ ▼ 로 한 단계씩 올리고 내리기
# 숫자 버튼은 그대로 두고, ▲ ▼ 가지를 더합니다.

from machine import Pin, PWM, SoftI2C
from irrecvdata import irGetCMD
import ssd1306
import time

motor1a = PWM(Pin(13), 1000)
motor1b = Pin(12, Pin.OUT)
motor1b.value(0)
ir = irGetCMD(5)
i2c = SoftI2C(scl=Pin(22), sda=Pin(21))
oled = ssd1306.SSD1306_I2C(128, 64, i2c)

LEVELS = [(0, "OFF"), (400, "LOW"), (700, "MID"), (1023, "HIGH")]
KEYS = {"0xff4ab5": 0, "0xff6897": 1,
        "0xff9867": 2, "0xffb04f": 3}
UP = "0xff629d"                            # ▲
DOWN = "0xffa857"                          # ▼

level = 0


def apply(n):
    speed, name = LEVELS[n]
    motor1a.duty(speed)
    oled.fill(0)
    oled.text("FAN", 0, 8)
    oled.text(name, 0, 30)
    oled.text(str(n) + " / 3", 0, 50)
    oled.show()
    print(n, name)


apply(level)

while True:
    v = ir.ir_read()
    if v:
        v = str(v).lower()
        if v in KEYS:
            level = KEYS[v]
            apply(level)
        elif v == UP:                      # ★ 한 단계 올리기
            level = level + 1
            if level > 3:                  # 3 을 넘지 않게
                level = 3
            apply(level)
        elif v == DOWN:                    # ★ 한 단계 내리기
            level = level - 1
            if level < 0:                  # 0 아래로 가지 않게
                level = 0
            apply(level)
        time.sleep_ms(300)
    time.sleep_ms(20)
