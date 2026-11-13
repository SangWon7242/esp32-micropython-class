# 미션 정답 · 10초가 지나면 저절로 다시 잠기기
# step5_room.py 에서 바뀐 곳만 ★ 로 표시했습니다.
# (윗부분 준비 코드는 step5_room.py 와 같습니다)

from machine import Pin, PWM, SoftI2C
from keypad import KeyPad
from irrecvdata import irGetCMD
import ssd1306
import time

keyPad = KeyPad(26, 25, 17, 16, 27, 14, 12, 13)
ir = irGetCMD(5)
i2c = SoftI2C(scl=Pin(22), sda=Pin(21))
oled = ssd1306.SSD1306_I2C(128, 64, i2c)
door = PWM(Pin(4))
door.freq(50)
door.duty_u16(1638)
red = PWM(Pin(18))
green = PWM(Pin(19))
blue = PWM(Pin(23))
red.freq(1000)
green.freq(1000)
blue.freq(1000)
buzzer = PWM(Pin(32))
buzzer.duty(0)

PASSWORD = "1234"
typed = ""
unlocked = False
bright = 100
cur = (0, 0, 0)
name = "OFF"
opened_at = 0                              # ★ 언제 열렸는지 기록할 자리
HOLD = 10000                               # ★ 10초 = 10000 밀리초

COLORS = {
    "0xff6897": ("RED", (255, 0, 0)),
    "0xff9867": ("ORANGE", (255, 110, 0)),
    "0xffb04f": ("YELLOW", (255, 255, 0)),
    "0xff30cf": ("GREEN", (0, 255, 0)),
    "0xff18e7": ("SKY", (0, 180, 255)),
    "0xff7a85": ("PURPLE", (150, 0, 255)),
    "0xff10ef": ("WHITE", (255, 255, 255)),
    "0xff4ab5": ("OFF", (0, 0, 0)),
}
UP = "0xff629d"
DOWN = "0xffa857"


def set_color(c):
    r, g, b = c
    red.duty(r * 1023 // 255 * bright // 100)
    green.duty(g * 1023 // 255 * bright // 100)
    blue.duty(b * 1023 // 255 * bright // 100)


def beep(f=1500, ms=80):
    buzzer.freq(f)
    buzzer.duty(300)
    time.sleep_ms(ms)
    buzzer.duty(0)


def show(a, b):
    oled.fill(0)
    oled.text(a, 0, 20)
    oled.text(b, 0, 38)
    oled.show()


def lock():                                # ★ 잠그는 일을 함수로 묶기
    door.duty_u16(1638)
    set_color((0, 0, 0))
    show("LOCKED", "enter code")


set_color((0, 0, 0))
show("LOCKED", "enter code")

while True:
    k = keyPad.scan()
    if k is not None:
        key = str(k)
        beep(2000, 50)
        if key == "*":
            typed = ""
            show("LOCKED", "cleared")
        elif key == "#":
            if typed == PASSWORD:
                unlocked = True
                opened_at = time.ticks_ms()   # ★ 열린 시각 기록
                door.duty_u16(8100)
                beep(2500, 250)
                show("UNLOCKED", "welcome!")
            else:
                beep(400, 400)
                show("DENIED", "try again")
            typed = ""
        elif key == "D":
            unlocked = False
            name = "OFF"
            lock()
        elif not unlocked:
            typed = typed + key
            show("LOCKED", "*" * len(typed))
        time.sleep_ms(300)

    v = ir.ir_read()
    if v and unlocked:
        v = str(v).lower()
        opened_at = time.ticks_ms()        # ★ 리모컨을 쓰면 시간 다시 세기
        if v in COLORS:
            name, cur = COLORS[v]
            set_color(cur)
            show("UNLOCKED", "light " + name)
        elif v == UP:
            bright = bright + 20
            if bright > 100:
                bright = 100
            set_color(cur)
            show("UNLOCKED", "bright " + str(bright))
        elif v == DOWN:
            bright = bright - 20
            if bright < 0:
                bright = 0
            set_color(cur)
            show("UNLOCKED", "bright " + str(bright))

    # ★ 열린 지 10초가 지났으면 저절로 잠그기
    if unlocked and time.ticks_diff(time.ticks_ms(), opened_at) > HOLD:
        unlocked = False
        name = "OFF"
        beep(800, 150)
        lock()

    time.sleep_ms(20)
