# 5단계 · 내 방 컨트롤러 완성
# 키패드 비밀번호로 잠금 해제 → 리모컨으로 무드등 색과 밝기 조절
# D 를 누르면 다시 잠깁니다.

from machine import Pin, PWM, SoftI2C
from keypad import KeyPad
from irrecvdata import irGetCMD
import ssd1306
import time

keyPad = KeyPad(26, 25, 17, 16, 27, 14, 12, 13)   # 키패드 8핀
ir = irGetCMD(5)                                  # 리모컨 수신기

i2c = SoftI2C(scl=Pin(22), sda=Pin(21))
oled = ssd1306.SSD1306_I2C(128, 64, i2c)

door = PWM(Pin(4))                         # 문
door.freq(50)
door.duty_u16(1638)

red = PWM(Pin(18))                         # 무드등 세 색
green = PWM(Pin(19))
blue = PWM(Pin(23))
red.freq(1000)
green.freq(1000)
blue.freq(1000)

buzzer = PWM(Pin(32))                      # 소리
buzzer.duty(0)

PASSWORD = "1234"                          # ★ 내 비밀번호로
typed = ""                                 # 지금까지 누른 숫자
unlocked = False                           # 잠금 해제됐나
bright = 100                               # 밝기 0 ~ 100 %
cur = (0, 0, 0)                            # 지금 색
name = "OFF"                               # 색 이름

COLORS = {                                 # 리모컨 값 → 색
    "0xff6897": ("RED", (255, 0, 0)),         # 1
    "0xff9867": ("ORANGE", (255, 110, 0)),    # 2
    "0xffb04f": ("YELLOW", (255, 255, 0)),    # 3
    "0xff30cf": ("GREEN", (0, 255, 0)),       # 4
    "0xff18e7": ("SKY", (0, 180, 255)),       # 5
    "0xff7a85": ("PURPLE", (150, 0, 255)),    # 6
    "0xff10ef": ("WHITE", (255, 255, 255)),   # 7
    "0xff4ab5": ("OFF", (0, 0, 0)),           # 0
}
UP = "0xff629d"                            # ▲ 밝게
DOWN = "0xffa857"                          # ▼ 어둡게


def set_color(c):                          # 색과 밝기를 한꺼번에 적용
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


set_color((0, 0, 0))                       # 처음엔 불 꺼 두기
show("LOCKED", "enter code")

while True:
    # ── 키패드 ──
    k = keyPad.scan()
    if k is not None:
        key = str(k)
        beep(2000, 50)

        if key == "*":                     # 지우기
            typed = ""
            show("LOCKED", "cleared")
        elif key == "#":                   # 확인
            if typed == PASSWORD:
                unlocked = True            # 잠금 해제
                door.duty_u16(8100)
                beep(2500, 250)
                show("UNLOCKED", "welcome!")
            else:
                beep(400, 400)
                show("DENIED", "try again")
            typed = ""
        elif key == "D":                   # 다시 잠그기
            unlocked = False
            door.duty_u16(1638)
            set_color((0, 0, 0))
            name = "OFF"
            show("LOCKED", "enter code")
        elif not unlocked:                 # 잠겨 있을 때만 번호 입력
            typed = typed + key
            show("LOCKED", "*" * len(typed))

        time.sleep_ms(300)

    # ── 리모컨 ──
    v = ir.ir_read()
    if v and unlocked:                     # 잠겨 있으면 리모컨 무시
        v = str(v).lower()
        if v in COLORS:                    # 색 바꾸기
            name, cur = COLORS[v]
            set_color(cur)
            show("UNLOCKED", "light " + name)
        elif v == UP:                      # 밝게
            bright = bright + 20
            if bright > 100:
                bright = 100
            set_color(cur)
            show("UNLOCKED", "bright " + str(bright))
        elif v == DOWN:                    # 어둡게
            bright = bright - 20
            if bright < 0:
                bright = 0
            set_color(cur)
            show("UNLOCKED", "bright " + str(bright))

    time.sleep_ms(20)
