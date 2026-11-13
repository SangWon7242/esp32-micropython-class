# 3단계 · 키패드와 리모컨이 같이 동작하는지 확인하기
# 둘을 번갈아 눌러 보세요. 둘 다 찍혀야 다음 단계로 갈 수 있습니다.

from keypad import KeyPad
from irrecvdata import irGetCMD
import time

keyPad = KeyPad(26, 25, 17, 16, 27, 14, 12, 13)
ir = irGetCMD(5)

print("키패드와 리모컨을 번갈아 눌러 보세요.")

while True:
    k = keyPad.scan()                      # 키패드 먼저 보고
    if k is not None:
        print("키패드 :", k)
        time.sleep_ms(300)

    v = ir.ir_read()                       # 리모컨도 보고
    if v:
        print("리모컨 :", v)

    time.sleep_ms(20)                      # 둘을 번갈아 계속 확인
