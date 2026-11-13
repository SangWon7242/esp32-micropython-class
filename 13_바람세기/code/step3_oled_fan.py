# 3단계 · 화면에 지금 세기를 표시하기
# 리모컨으로 고른 단계가 OLED 에 글자로 나옵니다.

from machine import Pin, PWM, SoftI2C
from irrecvdata import irGetCMD
import ssd1306
import time

motor1a = PWM(Pin(13), 1000)
motor1b = Pin(12, Pin.OUT)
motor1b.value(0)
ir = irGetCMD(5)

i2c = SoftI2C(scl=Pin(22), sda=Pin(21))    # 화면이 쓸 두 선
oled = ssd1306.SSD1306_I2C(128, 64, i2c)   # 128x64 화면

LEVELS = [(0, "OFF"), (400, "LOW"), (700, "MID"), (1023, "HIGH")]
KEYS = {"0xff4ab5": 0, "0xff6897": 1,
        "0xff9867": 2, "0xffb04f": 3}

level = 0


def apply(n):                              # 단계 하나를 실제로 적용하는 함수
    speed, name = LEVELS[n]                # 속도와 이름 꺼내기
    motor1a.duty(speed)                    # 모터에 주고
    oled.fill(0)                           # 화면 지우고
    oled.text("FAN", 0, 8)                 # 제목
    oled.text(name, 0, 30)                 # 지금 세기 이름
    oled.text(str(n) + " / 3", 0, 50)      # 몇 단계인지
    oled.show()                            # 화면에 나타내기
    print(n, name)


apply(level)

while True:
    v = ir.ir_read()
    if v:
        v = str(v).lower()
        if v in KEYS:
            level = KEYS[v]
            apply(level)                   # 모터와 화면을 한 번에
        time.sleep_ms(300)
    time.sleep_ms(20)
