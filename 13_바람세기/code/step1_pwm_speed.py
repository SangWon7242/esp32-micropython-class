# 1단계 · PWM 으로 바람 세기 바꿔 보기
# 리모컨 없이, 코드만으로 네 단계를 차례로 돌려 봅니다.

from machine import Pin, PWM
import time

motor1a = PWM(Pin(13), 1000)               # IN+ 를 PWM 으로 (속도 조절)
motor1b = Pin(12, Pin.OUT)                 # IN- 는 그대로
motor1b.value(0)                           # 한 방향으로 고정

print("정지 → 약 → 중 → 강 을 되풀이합니다.")

while True:
    for s in [0, 400, 700, 1023]:          # 네 단계를 차례로
        print("속도", s)
        motor1a.duty(s)                    # 0 ~ 1023
        time.sleep(2)
