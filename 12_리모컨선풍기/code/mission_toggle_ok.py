# 미션 정답 · OK 버튼 하나로 켜고 끄기
# 버튼이 하던 토글을 리모컨 OK 가 그대로 합니다.

from machine import Pin
from irrecvdata import irGetCMD
import time

motor1a = Pin(13, Pin.OUT)
motor1b = Pin(12, Pin.OUT)
button = Pin(14, Pin.IN, Pin.PULL_UP)
ir = irGetCMD(5)

OK = "0xff02fd"                            # 리모컨 OK 버튼

on = False
last = 1


def set_fan(state):
    if state:
        motor1a.value(1)
        motor1b.value(0)
        print("켜짐")
    else:
        motor1a.value(0)
        motor1b.value(0)
        print("꺼짐")


set_fan(False)

while True:
    now = button.value()
    if last == 1 and now == 0:
        on = not on
        set_fan(on)
    last = now

    v = ir.ir_read()
    if v:
        v = str(v).lower()
        if v == OK:                        # ★ 버튼과 똑같이 뒤집기
            on = not on
            set_fan(on)
        time.sleep_ms(300)                 # ★ 같은 신호 반복 막기

    time.sleep_ms(20)

# 왜 sleep_ms(300) 이 필요할까요?
#  리모컨 버튼을 꾹 누르고 있으면 같은 신호가 여러 번 옵니다.
#  그대로 두면 한 번 눌렀는데 켜짐·꺼짐이 여러 번 뒤집힙니다.
#  11장에서 버튼의 '눌리는 순간'만 잡았던 것과 같은 이유입니다.
