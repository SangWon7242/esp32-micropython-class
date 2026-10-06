# 안 될 때 보는 법

증상마다 원인이 다릅니다. **REPL 창에 무엇이 뜨는지**부터 보세요.

---

## 증상별 원인과 해결

| 증상 | 원인 | 해결 |
|---|---|---|
| `ImportError: no module named 'mfrc522_i2c'` | 라이브러리가 보드에 없음 | Upload 구성의 **Local Path 를 폴더로** 바꾸고 다시 올리기 → [lib/README.md](../lib/README.md) |
| `IIC slave device not ack` 가 계속 반복 | 모듈이 대답하지 않음 (배선·전원) | `SCL=IO22` · `SDA=IO21` · `V=5V` · `G=GND` 확인 |
| 아무것도 안 뜬다 | 코드가 실행 안 됐거나, `main.py` 자동 실행으로 앞부분을 놓침 | 파일 이름을 바꾸고 **Execute File in REPL** 로 실행 |
| 업로드하면 다른 파일이 사라진다 | Upload 구성이 **파일 하나**만 가리키는데 동기화가 켜져 있음 | Local Path 를 **폴더**로 |
| 포트가 안 보인다 | 충전 전용 USB 케이블 / 드라이버 없음 | 데이터용 케이블 사용, CP210x 또는 CH340 드라이버 설치 |

---

## 배선만 1분 만에 확인하기

I2C로 연결하는 부품(RFID, OLED)은 이 코드로 바로 확인할 수 있습니다.

```python
from machine import Pin, SoftI2C
print(SoftI2C(scl=Pin(22), sda=Pin(21)).scan())
```

| 결과 | 뜻 |
|---|---|
| `[40]` | RFID(0x28)를 찾음 — 배선 정상 |
| `[40, 60]` | RFID(0x28) + OLED(0x3C) 둘 다 찾음 |
| `[]` | 아무것도 못 찾음 — 배선이나 전원 문제 |

---

## 보드 안에 어떤 파일이 있는지

```python
import os
print(os.listdir())
```

---

## RFID 카드가 한 번만 읽히는 이유

이 키트의 RFID 라이브러리에는 `PICC_HaltA` 가 없습니다.
한 번 읽힌 카드는 **ACTIVE 상태로 남아** 다시 읽히지 않습니다.

👉 **카드를 완전히 떼었다가 다시 대야** 다음 읽기가 됩니다.

코드로 해결하려면, 읽은 뒤 전파를 잠깐 껐다 켜면 됩니다.

```python
rc522.PCD_AntennaOff()
time.sleep_ms(300)
rc522.PCD_AntennaOn()
```
