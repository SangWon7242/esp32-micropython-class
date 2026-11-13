# 추가 미션 1 정답 · 리모컨 1 · 2 · 3 으로 약 · 중 · 강
# 0 을 누르면 정지합니다.

from machine import Pin, PWM
from irrecvdata import irGetCMD
import time

motor1a = PWM(Pin(13), 1000)               # 속도 조절용 PWM
motor1b = Pin(12, Pin.OUT)
motor1b.value(0)                           # 한 방향 고정
ir = irGetCMD(5)

SPEEDS = {                                 # 리모컨 값 → 속도
    "0xff4ab5": (0, "정지"),                  # 0
    "0xff6897": (400, "약한 바람"),            # 1
    "0xff9867": (700, "보통 바람"),            # 2
    "0xffb04f": (1023, "센 바람"),             # 3
}

motor1a.duty(0)
print("리모컨 0 1 2 3 을 눌러 보세요.")

while True:
    v = ir.ir_read()
    if v:
        v = str(v).lower()
        if v in SPEEDS:                    # 표에 있는 값이면
            speed, name = SPEEDS[v]
            motor1a.duty(speed)            # 그 속도로 바꾸기
            print(name)
        time.sleep_ms(300)
    time.sleep_ms(20)
