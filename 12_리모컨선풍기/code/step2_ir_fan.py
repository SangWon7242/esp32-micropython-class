# 2단계 · 리모컨으로 선풍기 켜고 끄기
# 리모컨 1 번을 누르면 켜지고, 0 번을 누르면 꺼집니다.
# 모터 배선은 07장 · 11장과 똑같습니다.

from machine import Pin
from irrecvdata import irGetCMD
import time

motor1a = Pin(13, Pin.OUT)                 # IN+ (그대로)
motor1b = Pin(12, Pin.OUT)                 # IN- (그대로)
ir = irGetCMD(5)                           # 수신기

ON = "0xff6897"                            # 리모컨 1 번
OFF = "0xff4ab5"                           # 리모컨 0 번


def fan_on():
    motor1a.value(1)
    motor1b.value(0)


def fan_off():
    motor1a.value(0)
    motor1b.value(0)


fan_off()
print("리모컨 1 = 켜기,  0 = 끄기")

while True:
    v = ir.ir_read()
    if v:
        v = str(v).lower()                 # 글자로 맞춰 두기
        if v == ON:
            fan_on()
            print("켜짐")
        elif v == OFF:
            fan_off()
            print("꺼짐")
        time.sleep_ms(300)                 # 같은 신호가 또 오는 것 막기
    time.sleep_ms(20)
