# 라이브러리 안내

ESP32는 RFID나 OLED 같은 부품과 **말하는 법을 모릅니다.**
그 방법이 적힌 파일(= 라이브러리)을 보드에 함께 올려 줘야 합니다.

> 이 폴더에는 파일을 직접 두지 않았습니다.
> Keyestudio가 배포하는 원본을 **직접 내려받아** 쓰세요.

---

## 1. 내려받기

Keyestudio 자료실에서 `Library.zip` 을 받습니다.

```bash
curl -L -o Library.zip "https://docs.keyestudio.com/projects/KS5020/en/latest/_downloads/aa55cec3f54bf29d6d697256c354e3bd/Library.zip"
```

압축을 풀면 `Library/MicroPython_Library/` 안에 파일들이 있습니다.

---

## 2. 챕터별로 필요한 파일

| 챕터 | 필요한 파일 |
|---|---|
| 08 출입통제 | `mfrc522_i2c.py` · `mfrc522_config.py` · `soft_iic.py` |
| 09 OLED 출입화면 | 위 3개 + `ssd1306.py` · `gfx.py` |

### ⚠️ RFID는 파일 3개가 한 세트입니다

`mfrc522_i2c.py` 는 혼자 돌지 못합니다. 파일 안에서 나머지 둘을 불러 씁니다.

```python
from mfrc522_config import mfrc522Config
from soft_iic import softIIC
```

하나라도 빠지면 실행하자마자 `ImportError` 가 납니다.

---

## 3. 보드에 올리기

받은 `.py` 파일들을 **프로젝트 폴더에 넣고**, Upload 구성으로 한꺼번에 올립니다.
자세한 방법은 [docs/pycharm-setup.md](../docs/pycharm-setup.md) 를 보세요.

제대로 올라갔는지 확인:

```python
import os
print(os.listdir())
```
