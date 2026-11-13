# 3단계 · 버튼으로 선풍기 켜고 끄기
# 누르면 켜지고, 다시 누르면 꺼집니다.
# 모터 배선은 7장과 똑같습니다.

from machine import Pin
import time

motor1a = Pin(13, Pin.OUT)                 # IN+ (7장 그대로)
motor1b = Pin(12, Pin.OUT)                 # IN- (7장 그대로)
button = Pin(14, Pin.IN, Pin.PULL_UP)      # 버튼

on = False                                 # 지금 켜져 있나
last = 1                                   # 바로 전 버튼 상태


def fan_on():                              # 선풍기 켜기
    motor1a.value(1)
    motor1b.value(0)


def fan_off():                             # 선풍기 끄기
    motor1a.value(0)
    motor1b.value(0)


fan_off()                                  # 시작할 때는 꺼 두기
print("버튼을 눌러 보세요.")

while True:
    now = button.value()
    if last == 1 and now == 0:             # 눌리는 순간
        on = not on                        # 켜짐/꺼짐을 뒤집기
        if on:
            fan_on()
            print("선풍기 켜짐")
        else:
            fan_off()
            print("선풍기 꺼짐")
    last = now
    time.sleep_ms(20)
