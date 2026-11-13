# 추가 미션 2 정답 · 10초 뒤 저절로 꺼지기
# 리모컨을 다시 누르면 시간을 처음부터 다시 셉니다.

from machine import Pin
from irrecvdata import irGetCMD
import time

motor1a = Pin(13, Pin.OUT)
motor1b = Pin(12, Pin.OUT)
ir = irGetCMD(5)

ON = "0xff6897"
OFF = "0xff4ab5"
HOLD = 10000                               # 10초

on = False
started = 0                                # 켠 시각


def set_fan(state):
    if state:
        motor1a.value(1)
        motor1b.value(0)
    else:
        motor1a.value(0)
        motor1b.value(0)


set_fan(False)

while True:
    v = ir.ir_read()
    if v:
        v = str(v).lower()
        if v == ON:
            on = True
            started = time.ticks_ms()      # ★ 시각 기록 (다시 누르면 또 기록)
            set_fan(True)
            print("켜짐 — 10초 뒤 자동 정지")
        elif v == OFF:
            on = False
            set_fan(False)
            print("꺼짐")
        time.sleep_ms(300)

    # 켜진 채로 10초가 지났으면
    if on and time.ticks_diff(time.ticks_ms(), started) > HOLD:
        on = False
        set_fan(False)
        print("10초가 지나 저절로 꺼짐")

    time.sleep_ms(20)
