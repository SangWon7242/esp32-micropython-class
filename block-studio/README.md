# ESP32 Block Studio (Next.js MVP)

Code.org처럼 **과정 → 챕터 → 5개 단계(원리·회로·따라하기·도전·생각 정리)** 를 거치며, Blockly 블록과 MicroPython 코드를 양방향으로 살펴보는 교육용 웹 시제품입니다.

## 빠른 시작

```bash
cd block-studio
npm install
npm run dev
# http://localhost:3000
```

Node.js 20.9+ 필요. 데스크톱 Chrome/Edge 권장. `npm test`는 MicroPython 역변환과 미션 검사를 검증합니다. `npm run build`로 프로덕션 빌드를 생성합니다.

## 수업 구조

- COURSE 01 (기초 제어): LED, 신호등, 버튼 — 3개 챕터
- COURSE 02 (센서·메이커): ADC, PWM, DHT11, 네오픽셀 — 4개 챕터
- 각 챕터 5단계: **원리 이해 → 회로 연결 → 블록 따라하기 → 도전 과제 → 생각 정리**
- 총 7개 챕터 / 35개 학습 단계
- 이전 단계를 완료하면 다음 단계가 열립니다. 브라우저 `localStorage`에 임시 진도와 도전 코드가 저장됩니다.
- 퀴즈 답안, 회로 안전 확인, 블록 문법 검사, 도전 과제 구조 검사, 회고 기록을 통과해야 완료됩니다.

## Blockly ↔ MicroPython

수업에서 지정된 **지원 문법만** 양방향으로 변환합니다. 역변환할 수 없는 Python 문법은 기존 블록을 보존하고 경고를 띄웁니다. 임의의 Python 코드 전체를 역변환한다고 주장하지 않습니다.

## 하드웨어 주의사항

Web Serial은 PC Chrome/Edge에서 **HTTPS 또는 localhost**로 열었을 때 사용합니다. ESP32에 사전 설치된 MicroPython 펌웨어가 필요합니다. 현재 브라우저 REPL 코드는 **실험적**으로 구현된 것이므로 제품용 플래싱/대용량 전송/ACK·raw-paste·오류 복구는 별도 구현 및 실제 보드 테스트가 필요합니다.

전압은 ESP32 GPIO 3.3V 기준. LED 저항, 모터 별도 드라이버, 공통 GND, 보드/모듈별 핀맵 확인이 필수입니다. 구조 검사 통과는 실제 보드 동작 인증이 아닙니다.

## 교안 출처

- [Keyestudio KS5020 MicroPython 공식 튜토리얼](https://docs.keyestudio.com/projects/KS5020/en/latest/docs/2.%20MicroPython_Tutorial.html)
- [기존 ESP32 MicroPython 수업자료](https://github.com/SangWon7242/esp32-micropython-class)
- [Blockly](https://github.com/google/blockly) (Apache-2.0)

Keyestudio의 **교수학습 흐름과 하드웨어 주제**를 참고하되, 실습 질문·미션·설명은 별도로 작성했습니다. Keyestudio 원문 이미지·코드·교안 전체를 복제하거나 재배포하지 않습니다. 본 앱은 Keyestudio와 공식 제휴 관계가 아닙니다.

## 다음 개발 단계

- 블록 지원: 서보, 초음파, 7세그먼트/74HC595, OLED/LCD, RFID, 모터드라이버
- MicroPython AST 기반 역변환 범위 확대와 문법 오류의 위치 강조
- Web Serial REPL raw-paste ACK/흐름제어/보드 테스트 및 안전한 중단·파일 전송
- 교사용 대시보드, 학생 계정/진도 서버 저장, 교사용 미션 저작 UI

## 개발 상태

MVP이며 상용 학습 서비스가 아닙니다. 실행 화면 / 수업 흐름과 각 단계 자동 검사는 실물 연결 전 반드시 수동 QA 하십시오.
