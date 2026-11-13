# 추가 미션 2 정답 · 화면에 막대그래프로 세기 보여 주기
# apply() 안의 화면 그리는 부분만 바꾸면 됩니다.

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

level = 0


def apply(n):
    speed, name = LEVELS[n]
    motor1a.duty(speed)
    oled.fill(0)
    oled.text("FAN  " + name, 0, 6)        # 제목과 이름을 한 줄에
    oled.rect(0, 26, 128, 20, 1)           # ★ 막대 테두리
    w = n * 42                             # ★ 단계만큼 채울 너비
    if w > 126:
        w = 126
    if w > 0:
        oled.fill_rect(1, 27, w, 18, 1)    # ★ 안을 채우기
    oled.text(str(n) + " / 3", 0, 52)
    oled.show()


apply(level)

while True:
    v = ir.ir_read()
    if v:
        v = str(v).lower()
        if v in KEYS:
            level = KEYS[v]
            apply(level)
        time.sleep_ms(300)
    time.sleep_ms(20)

# rect(x, y, 너비, 높이, 1) 은 테두리만 그리고
# fill_rect(x, y, 너비, 높이, 1) 은 속을 채웁니다.
