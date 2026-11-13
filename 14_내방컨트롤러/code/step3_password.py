# 3단계 · 누른 숫자를 모아 비밀번호와 비교하기 (아직 문은 없습니다)
# 숫자를 누르고 # 을 누르면 확인, * 을 누르면 지우기

from keypad import KeyPad
import time

keyPad = KeyPad(26, 25, 33, 32, 27, 14, 16, 17)

PASSWORD = "1234"                          # ★ 내 비밀번호로 바꾸세요
typed = ""                                 # 지금까지 누른 숫자를 모아 둘 곳

print("비밀번호를 누르고 # 을 누르세요.")

while True:
    k = keyPad.scan()
    if k is not None:
        key = str(k)                       # 글자로 맞춰 두기

        if key == "*":                     # 지우기
            typed = ""
            print("지웠습니다.")
        elif key == "#":                   # 확인
            if typed == PASSWORD:
                print("맞았습니다!")
            else:
                print("틀렸습니다 :", typed)
            typed = ""                     # 확인했으면 비우기
        else:                              # 숫자나 문자면
            typed = typed + key            # 뒤에 이어 붙이기
            print("지금까지 :", typed)

        time.sleep_ms(300)
    time.sleep_ms(20)
