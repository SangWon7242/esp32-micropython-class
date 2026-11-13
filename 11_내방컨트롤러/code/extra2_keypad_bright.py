# 추가 미션 2 정답 · 키패드 A · B 로도 밝기 조절하기
# step5_room.py 의 키패드 처리에 두 줄기를 더합니다.

#         elif key == "A" and unlocked:    # A = 밝게
#             bright = bright + 20
#             if bright > 100:
#                 bright = 100
#             set_color(cur)
#             show("UNLOCKED", "bright " + str(bright))
#         elif key == "B" and unlocked:    # B = 어둡게
#             bright = bright - 20
#             if bright < 0:
#                 bright = 0
#             set_color(cur)
#             show("UNLOCKED", "bright " + str(bright))

# 리모컨 ▲▼ 와 똑같은 일을 하는 가지를 키패드 쪽에도 만든 것입니다.
# 같은 일을 두 번 쓰게 되니, 함수로 묶으면 더 깔끔해집니다.


def change_bright(step, bright, cur, set_color, show):
    """밝기를 step 만큼 바꾸고 화면에 보여 주는 함수"""
    bright = bright + step                 # 더하거나 빼고
    if bright > 100:                       # 100을 넘지 않게
        bright = 100
    if bright < 0:                         # 0 아래로 가지 않게
        bright = 0
    set_color(cur)                         # 새 밝기로 다시 켜기
    show("UNLOCKED", "bright " + str(bright))
    return bright                          # 바뀐 값을 돌려주기


# 쓰는 법
#   bright = change_bright(20, bright, cur, set_color, show)    # 밝게
#   bright = change_bright(-20, bright, cur, set_color, show)   # 어둡게
