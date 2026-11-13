# 3단계 · 버튼으로도 리모컨으로도 켜고 끄기
# 11장 버튼 코드에 리모컨 부분을 이어 붙인 것입니다.

from machine import Pin
from irrecvdata import irGetCMD
import time

motor1a = Pin(13, Pin.OUT)
motor1b = Pin(12, Pin.OUT)
button = Pin(14, Pin.IN, Pin.PULL_UP)      # 11장 버튼 그대로
ir = irGetCMD(5)                           # 12장에서 더한 수신기

ON = "0xff6897"                            # 리모컨 1 번
OFF = "0xff4ab5"                           # 리모컨 0 번

on = False                                 # 지금 켜져 있나
last = 1                                   # 바로 전 버튼 상태


def fan_on():
    motor1a.value(1)
    motor1b.value(0)


def fan_off():
    motor1a.value(0)
    motor1b.value(0)


def set_fan(state):                        # 한 군데서만 모터를 건드립니다
    if state:
        fan_on()
        print("켜짐")
    else:
        fan_off()
        print("꺼짐")


set_fan(False)

while True:
    now = button.value()                   # ① 버튼 확인
    if last == 1 and now == 0:             # 눌리는 순간
        on = not on                        # 뒤집기
        set_fan(on)
    last = now

    v = ir.ir_read()                       # ② 리모컨 확인
    if v:
        v = str(v).lower()
        if v == ON:
            on = True                      # 무조건 켜짐으로
            set_fan(on)
        elif v == OFF:
            on = False                     # 무조건 꺼짐으로
            set_fan(on)
        time.sleep_ms(300)

    time.sleep_ms(20)                      # ③ 다시 처음으로
