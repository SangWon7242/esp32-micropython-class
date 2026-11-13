# 2단계 · 리모컨 숫자로 바람 세기 고르기
# 0 = 정지, 1 = 약, 2 = 중, 3 = 강

from machine import Pin, PWM
from irrecvdata import irGetCMD
import time

motor1a = PWM(Pin(13), 1000)
motor1b = Pin(12, Pin.OUT)
motor1b.value(0)
ir = irGetCMD(5)

LEVELS = [(0, "OFF"), (400, "LOW"), (700, "MID"), (1023, "HIGH")]
KEYS = {                                   # 리모컨 값 → 몇 단계
    "0xff4ab5": 0,                         # 0 번
    "0xff6897": 1,                         # 1 번
    "0xff9867": 2,                         # 2 번
    "0xffb04f": 3,                         # 3 번
}

level = 0                                  # 지금 몇 단계
motor1a.duty(LEVELS[level][0])
print("리모컨 0 1 2 3 을 눌러 보세요.")

while True:
    v = ir.ir_read()
    if v:
        v = str(v).lower()
        if v in KEYS:                      # 표에 있는 값이면
            level = KEYS[v]                # 몇 단계인지 꺼내고
            speed, name = LEVELS[level]    # 속도와 이름을 꺼내서
            motor1a.duty(speed)            # 모터에 주기
            print(level, name)
        time.sleep_ms(300)
    time.sleep_ms(20)
