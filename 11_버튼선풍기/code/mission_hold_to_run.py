# 미션 정답 · 누르고 있는 동안만 돌기
# 토글보다 훨씬 짧습니다. '기억'할 필요가 없기 때문입니다.

from machine import Pin
import time

motor1a = Pin(13, Pin.OUT)
motor1b = Pin(12, Pin.OUT)
button = Pin(14, Pin.IN, Pin.PULL_UP)


def fan_on():
    motor1a.value(1)
    motor1b.value(0)


def fan_off():
    motor1a.value(0)
    motor1b.value(0)


while True:
    if button.value() == 0:                # 눌려 있으면
        fan_on()                           # 돌리고
    else:                                  # 떼면
        fan_off()                          # 멈춘다
    time.sleep_ms(20)

# 왜 짧아졌을까요?
#  토글은 '지금 켜져 있나'를 기억해야 해서 on 과 last 가 필요했습니다.
#  이건 버튼 상태를 그대로 따라가기만 하면 되니 기억할 게 없습니다.
