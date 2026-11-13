# 추가 미션 1 정답 · 버튼으로 단계 돌려 가며 바꾸기
# 누를 때마다 0 → 1 → 2 → 3 → 0 으로 돌아갑니다.
# 11장 버튼 코드(눌리는 순간 잡기)를 그대로 씁니다.

from machine import Pin, PWM, SoftI2C
from irrecvdata import irGetCMD
import ssd1306
import time

motor1a = PWM(Pin(13), 1000)
motor1b = Pin(12, Pin.OUT)
motor1b.value(0)
button = Pin(14, Pin.IN, Pin.PULL_UP)      # 11장 버튼
ir = irGetCMD(5)
i2c = SoftI2C(scl=Pin(22), sda=Pin(21))
oled = ssd1306.SSD1306_I2C(128, 64, i2c)

LEVELS = [(0, "OFF"), (400, "LOW"), (700, "MID"), (1023, "HIGH")]
KEYS = {"0xff4ab5": 0, "0xff6897": 1,
        "0xff9867": 2, "0xffb04f": 3}

level = 0
last = 1


def apply(n):
    speed, name = LEVELS[n]
    motor1a.duty(speed)
    oled.fill(0)
    oled.text("FAN", 0, 8)
    oled.text(name, 0, 30)
    oled.text(str(n) + " / 3", 0, 50)
    oled.show()


apply(level)

while True:
    now = button.value()                   # ★ 버튼 확인
    if last == 1 and now == 0:             # 눌리는 순간
        level = level + 1
        if level > 3:                      # 끝까지 갔으면
            level = 0                      # 처음으로 돌아가기
        apply(level)
    last = now

    v = ir.ir_read()                       # 리모컨도 그대로
    if v:
        v = str(v).lower()
        if v in KEYS:
            level = KEYS[v]
            apply(level)
        time.sleep_ms(300)

    time.sleep_ms(20)
