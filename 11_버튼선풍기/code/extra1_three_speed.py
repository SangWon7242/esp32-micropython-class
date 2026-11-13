# 추가 미션 1 정답 · 누를 때마다 정지 → 약 → 강 → 정지
# 켜짐/꺼짐 두 가지가 아니라 세 단계를 돌아가며 바꿉니다.

from machine import Pin, PWM
import time

motor1a = PWM(Pin(13), 1000)               # IN+ 를 PWM 으로 (속도 조절)
motor1b = Pin(12, Pin.OUT)                 # IN- 는 그대로
motor1b.value(0)                           # 한 방향으로 고정
button = Pin(14, Pin.IN, Pin.PULL_UP)

SPEEDS = [0, 500, 1023]                    # 정지 · 약 · 강
NAMES = ["정지", "약한 바람", "센 바람"]
step = 0                                   # 지금 몇 번째 단계인가
last = 1

motor1a.duty(SPEEDS[step])
print("버튼을 눌러 보세요.")

while True:
    now = button.value()
    if last == 1 and now == 0:             # 눌리는 순간
        step = step + 1                    # 다음 단계로
        if step > 2:                       # 끝까지 갔으면
            step = 0                       # 처음으로
        motor1a.duty(SPEEDS[step])         # 그 속도로 바꾸기
        print(NAMES[step])
    last = now
    time.sleep_ms(20)
