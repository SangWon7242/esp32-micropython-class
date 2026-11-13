# 2단계 · 버튼이 '눌리는 순간'만 잡아내기
# 그냥 value() 를 보면 누르고 있는 동안 수십 번 세어집니다.
# 1 에서 0 으로 바뀌는 순간만 세어야 한 번으로 셉니다.

from machine import Pin
import time

button = Pin(14, Pin.IN, Pin.PULL_UP)

last = 1                                   # 바로 전 버튼 상태
count = 0                                  # 누른 횟수

print("버튼을 눌러 보세요.")

while True:
    now = button.value()                   # 지금 상태
    if last == 1 and now == 0:             # 안 눌림 → 눌림 으로 바뀐 순간
        count = count + 1
        print("눌린 횟수:", count)
    last = now                             # 지금 상태를 기억해 두기
    time.sleep_ms(20)
