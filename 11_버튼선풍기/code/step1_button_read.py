# 1단계 · 버튼이 어떤 값을 주는지 확인하기
# 눌렀을 때와 안 눌렀을 때 값이 어떻게 다른지 눈으로 봅니다.

from machine import Pin
import time

# PULL_UP = 아무것도 안 누르면 1 이 되도록 안에서 당겨 주는 것
button = Pin(14, Pin.IN, Pin.PULL_UP)

print("버튼을 눌렀다 떼었다 해 보세요.")

while True:
    if button.value() == 0:                # 누르면 0
        print("0  눌림")
    else:                                  # 떼면 1
        print("1  안 눌림")
    time.sleep_ms(200)
