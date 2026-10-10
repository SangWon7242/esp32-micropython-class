# 추가 미션 3 · 문이 열릴 때마다 랜덤 색으로 빛나기 (05장 RGB LED 활용)
# 배선: IO27 → 220Ω → R / IO25 → 220Ω → G / IO26 → 220Ω → B
#       RGB LED 가장 긴 다리 → GND
# ※ 추가 미션 1의 빨강 LED(IO26)는 빼세요. RGB 파랑과 핀이 겹칩니다.

from machine import Pin, PWM, SoftI2C
import ssd1306
import random                             # ★ 랜덤(아무거나 고르기) 기능
import time

trig = Pin(13, Pin.OUT)                   # 초음파 쏘는 핀
echo = Pin(12, Pin.IN)                    # 메아리 받는 핀

servo = PWM(Pin(4))                       # 문이 될 서보
servo.freq(50)
servo.duty_u16(1638)                      # 처음엔 문 닫기

red = PWM(Pin(27))                        # ★ 05장과 똑같은 세 핀
green = PWM(Pin(25))
blue = PWM(Pin(26))
red.freq(1000)                            # RGB는 1초에 1000번
green.freq(1000)
blue.freq(1000)

i2c = SoftI2C(scl=Pin(22), sda=Pin(21))   # 화면이 쓸 두 선
oled = ssd1306.SSD1306_I2C(128, 64, i2c)  # 128x64 화면 준비

colors = [(255, 0, 0), (255, 128, 0),     # ★ 빨강, 주황
          (255, 255, 0), (0, 255, 0),     #    노랑, 초록
          (0, 255, 255), (0, 0, 255),     #    하늘, 파랑
          (255, 0, 255), (255, 255, 255)]  #    분홍, 하양


def interval_mapping(x, in_min, in_max, out_min, out_max):
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min


def color_to_duty(rgb_value):             # 0~255 를 0~1023 으로 (05장과 같음)
    return int(interval_mapping(rgb_value, 0, 255, 0, 1023))


def set_color(r, g, b):                   # 세 색을 한꺼번에 정하기
    red.duty(color_to_duty(r))
    green.duty(color_to_duty(g))
    blue.duty(color_to_duty(b))


def get_distance():                       # 거리를 재는 함수
    trig.value(1)                         # 초음파 쏘기
    time.sleep_us(10)                     # 10마이크로초만
    trig.value(0)                         # 그만 쏘기
    while not echo.value():               # 신호 시작까지 기다리기
        pass
    start = time.ticks_us()               # 시작 시간
    while echo.value():                   # 메아리 올 때까지
        pass
    stop = time.ticks_us()                # 돌아온 시간
    t = time.ticks_diff(stop, start) // 2  # 가는 시간만
    return int(340 * t // 10000)          # cm 로 바꿔 알려 주기


def show(a, b):                           # 두 줄을 화면에 띄우는 함수
    oled.fill(0)                          # 화면 지우기
    oled.text(a, 0, 20)                   # 첫 줄 적어 두기
    oled.text(b, 0, 36)                   # 둘째 줄 적어 두기
    oled.show()                           # 화면에 나타내기


time.sleep(2)                             # 센서 준비 2초
set_color(0, 0, 0)                        # 처음엔 불 꺼 두기
show("AUTO DOOR", "Come closer")          # 대기 화면

while True:
    d = get_distance()                    # 거리 재기
    if d < 15:                            # 15cm 안으로 들어오면
        c = random.choice(colors)         # ★ 목록에서 색 하나 아무거나!
        set_color(c[0], c[1], c[2])       # ★ 그 색으로 불 켜기
        show("DOOR OPEN", "Welcome")      # 열렸다고 화면에 알리고
        servo.duty_u16(8100)              # 문 열기
        time.sleep(3)                     # 3초 열어 두기
        show("DOOR CLOSE", "Bye~")        # 닫힌다고 화면에 알리고
        servo.duty_u16(1638)              # 문 닫기
        set_color(0, 0, 0)                # ★ 불 끄기
        time.sleep(1)                     # 1초 쉬고
        show("AUTO DOOR", "Come closer")  # 다시 대기 화면
    time.sleep_ms(300)                    # 0.3초마다 다시 재기
