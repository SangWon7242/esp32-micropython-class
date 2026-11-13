# 1단계 · 키패드가 어떤 값을 주는지 확인하기
# 숫자 · A B C D · * · # 를 하나씩 눌러 보고, 창에 찍히는 값을 적어 두세요.

from keypad import KeyPad                  # 키패드 설명서 펼치기
import time

# 키패드 띠선 1~8번을 꽂은 핀 번호 (순서가 코드와 같아야 합니다)
keyPad = KeyPad(26, 25, 33, 32, 27, 14, 16, 17)

print("키를 눌러 보세요.")

while True:
    k = keyPad.scan()                      # 눌린 키 읽기
    if k is not None:                      # 뭔가 눌렸으면
        print("누른 키:", k)                # 창에 찍기
        time.sleep_ms(300)                 # 한 번만 세도록 잠깐 쉬기
    time.sleep_ms(20)
