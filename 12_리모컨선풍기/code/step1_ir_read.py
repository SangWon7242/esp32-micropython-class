# 1단계 · 리모컨 버튼이 어떤 값을 주는지 확인하기
# 쓸 버튼의 값을 공책에 적어 두세요.

from irrecvdata import irGetCMD            # 리모컨 설명서 펼치기
import time

ir = irGetCMD(5)                           # 수신기 S 핀은 5번

print("리모컨 버튼을 눌러 보세요.")
print("처음이라면 리모컨 뒤 투명 비닐을 빼야 합니다.")

while True:
    v = ir.ir_read()                       # 받은 값 읽기
    if v:                                  # 뭔가 받았으면
        print("받은 값:", v)
    time.sleep_ms(20)
