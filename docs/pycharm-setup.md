# PyCharm 설정 안내

ESP32에 코드를 올리려면 PyCharm에 플러그인을 하나 설치해야 합니다.

---

## 1. 플러그인 설치

| 순서 | 할 일 |
|---|---|
| 1 | **PyCharm 2024.3 이상** 준비 (무료 Community 버전으로 충분) |
| 2 | `Settings → Plugins → Marketplace` 에서 **MicroPython Tools** 검색 후 Install |
| 3 | `Settings → Languages & Frameworks → MicroPython Tools` 에서 **Enable MicroPython support** 체크 |
| 4 | 같은 화면에서 통신 방식 **Serial**, 포트는 **Auto-Detect Port** |

> ⚠️ JetBrains가 만든 예전 **MicroPython** 플러그인은 2026년 2월에 지원이 끝났습니다.
> 반드시 **MicroPython Tools** 를 쓰세요.

같은 설정 화면에서 **stub 패키지**를 함께 고르면 `machine`, `time` 같은 모듈이 자동완성됩니다.

---

## 2. 코드를 보드에 올리기

### Upload 실행 구성 만들기

1. `Run → Edit Configurations → + → MicroPython Tools → Upload`
2. **Source Mappings** 에서 `+` 를 눌러 항목을 추가
3. **Local Path** 는 **프로젝트 폴더** (※ `main.py` 파일이 아니라 폴더!)
4. **Device Path** 는 `/`
5. **Exclusions** 에 `.venv` 추가
6. `Apply → OK` 후 **Run**

> ### ⚠️ 가장 많이 하는 실수
> **Local Path 에 `main.py` 파일 하나를 지정하면 그 파일만 올라갑니다.**
> 게다가 동기화가 켜져 있으면 **먼저 올려 둔 라이브러리가 보드에서 지워집니다.**
> 반드시 **폴더**를 지정하세요.

### 파일 하나만 급히 올릴 때

아래 **File System** 탭을 열고, 프로젝트 트리에서 파일을 끌어다 놓으면 됩니다.
이 방식은 다른 파일을 지우지 않습니다.

---

## 3. 실행하기 · 멈추기

| 하고 싶은 것 | 방법 |
|---|---|
| 실행 | 파일에서 오른쪽 클릭 → **Execute File in REPL** |
| 자동 실행 | 파일 이름을 `main.py` 로 하면 보드가 켜질 때 저절로 실행 |
| 멈추기 | **REPL** 탭의 **Interrupt** 버튼 (= `Ctrl+C`) |
| 다시 시작 | REPL 탭의 **Hard reset** |

> 테스트할 때는 `main.py` 말고 다른 이름으로 두고 **Execute File in REPL** 로 실행하는 편이 좋습니다.
> `main.py` 는 보드가 켜질 때 자동 실행돼서, REPL 탭을 열기 전에 앞부분 출력이 지나가 버립니다.

---

## 4. 처음 한 번만 — 펌웨어 굽기

보드에 MicroPython이 아직 없다면, 설정 화면의 **펌웨어 플래시(Flash firmware)** 에서 ESP32를 골라 먼저 구워야 합니다.
보드마다 한 번만 하면 됩니다.

---

## 5. 보드 안을 확인하는 법

REPL 탭에서:

```python
import os
print(os.listdir())
```

올린 파일들이 목록에 보이면 성공입니다.
