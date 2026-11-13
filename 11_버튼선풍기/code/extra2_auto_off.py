# 추가 미션 2 정답 · 켜고 10초가 지나면 저절로 꺼지기
# 켠 '시각'을 기억해 두었다가, 10초가 지났는지 계속 확인합니다.

from machine import Pin
import time

motor1a = Pin(13, Pin.OUT)
motor1b = Pin(12, Pin.OUT)
button = Pin(14, Pin.IN, Pin.PULL_UP)

on = False
last = 1
started = 0                                # 켠 시각
HOLD = 10000                               # 10초 = 10000 밀리초


def fan_on():
    motor1a.value(1)
    motor1b.value(0)


def fan_off():
    motor1a.value(0)
    motor1b.value(0)


fan_off()

while True:
    now = button.value()
    if last == 1 and now == 0:
        on = not on
        if on:
            fan_on()
            started = time.ticks_ms()      # 켠 시각 기록
            print("선풍기 켜짐")
        else:
            fan_off()
            print("선풍기 꺼짐")
    last = now

    # 켜진 채로 10초가 지났으면 저절로 끄기
    if on and time.ticks_diff(time.ticks_ms(), started) > HOLD:
        on = False
        fan_off()
        print("10초가 지나 저절로 꺼짐")

    time.sleep_ms(20)
