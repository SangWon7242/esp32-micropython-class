# 추가 미션 1 정답 · 세 번 틀리면 경고음과 함께 10초 잠기기
# step5_room.py 의 '#' 처리 부분만 아래처럼 바꾸면 됩니다.

# ── 맨 위에 변수 하나 추가 ──
# wrong = 0                                # 틀린 횟수

# ── '#' 을 눌렀을 때 ──
#         elif key == "#":
#             if typed == PASSWORD:
#                 wrong = 0                # 맞으면 틀린 횟수 초기화
#                 unlocked = True
#                 door.duty_u16(8100)
#                 beep(2500, 250)
#                 show("UNLOCKED", "welcome!")
#             else:
#                 wrong = wrong + 1        # 틀렸으면 하나 늘리기
#                 if wrong >= 3:           # 세 번째라면
#                     show("BLOCKED", "wait 10s")
#                     for i in range(5):   # 경고음 다섯 번
#                         beep(300, 200)
#                         time.sleep_ms(150)
#                     time.sleep(10)       # 10초 동안 멈추기
#                     wrong = 0
#                     show("LOCKED", "enter code")
#                 else:
#                     beep(400, 400)
#                     left = 3 - wrong     # 남은 횟수 알려 주기
#                     show("DENIED", str(left) + " left")
#             typed = ""

# 아래는 바로 돌려 볼 수 있는 전체 코드입니다.

from machine import Pin, PWM, SoftI2C
from keypad import KeyPad
import ssd1306
import time

keyPad = KeyPad(26, 25, 17, 16, 27, 14, 12, 13)
i2c = SoftI2C(scl=Pin(22), sda=Pin(21))
oled = ssd1306.SSD1306_I2C(128, 64, i2c)
door = PWM(Pin(4))
door.freq(50)
door.duty_u16(1638)
buzzer = PWM(Pin(32))
buzzer.duty(0)

PASSWORD = "1234"
typed = ""
wrong = 0                                  # ★ 틀린 횟수


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
                wrong = 0                  # ★ 맞으면 초기화
                show("UNLOCKED", "welcome!")
                door.duty_u16(8100)
                beep(2500, 250)
                time.sleep(3)
                door.duty_u16(1638)
                show("LOCKED", "enter code")
            else:
                wrong = wrong + 1          # ★ 틀린 횟수 세기
                if wrong >= 3:             # ★ 세 번째면 묶어 두기
                    show("BLOCKED", "wait 10s")
                    for i in range(5):
                        beep(300, 200)
                        time.sleep_ms(150)
                    time.sleep(10)
                    wrong = 0
                    show("LOCKED", "enter code")
                else:
                    beep(400, 400)
                    show("DENIED", str(3 - wrong) + " left")
            typed = ""
        else:
            typed = typed + key
            show("LOCKED", "*" * len(typed))
        time.sleep_ms(300)
    time.sleep_ms(20)
