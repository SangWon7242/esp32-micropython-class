import { LESSONS, KEYESTUDIO_URL } from './lessons';

export { KEYESTUDIO_URL };
export const STAGES = [
  { id: 'concept', title: '원리 이해', short: '개념', icon: '01', description: '핵심 개념을 알아보고 생각해요.' },
  { id: 'wiring', title: '회로 연결', short: '배선', icon: '02', description: '부품을 안전하게 연결해요.' },
  { id: 'build', title: '블록 따라하기', short: '연습', icon: '03', description: '예제를 블록과 Python으로 관찰해요.' },
  { id: 'challenge', title: '나만의 도전', short: '도전', icon: '04', description: '빈 화면에서 미션을 해결해요.' },
  { id: 'reflect', title: '생각 정리', short: '정리', icon: '05', description: '무엇을 바꾸고 배웠는지 기록해요.' },
];
export const COURSES = [
  { id: 'foundation', title: 'ESP32 처음 시작하기', eyebrow: 'COURSE 01', subtitle: 'LED·신호등·버튼을 제어하며 순서와 조건을 배워요.', color: '#4d7ce8', badge: '기초 제어', lessons: ['blink','traffic','button'] },
  { id: 'sensors', title: '센서와 메이커 실험실', eyebrow: 'COURSE 02', subtitle: '센서의 숫자를 읽고 빛과 환경을 제어해요.', color: '#29a99b', badge: '센서 응용', lessons: ['adc','pwm','dht','neopixel'] },
];
export const getChapter = id => LESSONS.find(item => item.id === id);
export const getCourse = id => COURSES.find(item => item.id === id);
export const getCourseOfChapter = id => COURSES.find(item => item.lessons.includes(id));
export const allStages = COURSES.flatMap(course => course.lessons.flatMap(id => STAGES.map(stage => `${id}:${stage.id}`)));
export function nextStage(chapterId, stageId) {
  const chapter = getChapter(chapterId), course = getCourseOfChapter(chapterId);
  if (!chapter || !course) return null;
  const ix = STAGES.findIndex(s=>s.id===stageId);
  if(ix<STAGES.length-1) return {chapterId, stageId: STAGES[ix+1].id};
  const chapters = COURSES.flatMap(c=>c.lessons);
  const nextId = chapters[chapters.indexOf(chapterId)+1];
  return nextId ? {chapterId:nextId, stageId:'concept'} : null;
}
export function previousStage(chapterId, stageId) {
  const ix=STAGES.findIndex(s=>s.id===stageId);
  if(ix>0) return {chapterId,stageId:STAGES[ix-1].id};
  const chapters=COURSES.flatMap(c=>c.lessons);
  const prev=chapters[chapters.indexOf(chapterId)-1];
  return prev ? {chapterId:prev,stageId:'reflect'} : null;
}
export function isUnlocked(chapterId, stageId, done) {
  const key = `${chapterId}:${stageId}`;
  const index=allStages.indexOf(key);
  return index===0 || (index>0 && !!done[allStages[index-1]]) || !!done[key];
}
export function courseProgress(course, done) {
  const keys=course.lessons.flatMap(id=>STAGES.map(s=>`${id}:${s.id}`));
  return {finished: keys.filter(k=>done[k]).length, total:keys.length};
}
export const QUESTION_OPTIONS = {
  blink: {options:['LED가 스스로 켜졌다 꺼진다','켜고 끄는 명령 사이에 시간이 필요하다','GPIO 번호는 상관없다'], answer:1,why:'순서·반복만으로는 시간이 흐르지 않아요. 대기 시간을 넣어 깜박임을 관찰합니다.'},
  traffic: {options:['LED를 순서 없이 켜도 된다','세 LED의 켜짐·꺼짐 상태와 시간을 설계한다','저항은 연결하지 않는다'],answer:1,why:'여러 출력 장치의 상태와 순서를 정확히 제어하는 것이 신호등의 핵심입니다.'},
  button: {options:['PULL_UP에서는 누르면 0','PULL_UP에서는 누르면 5','버튼은 항상 1만 읽는다'],answer:0,why:'내부 풀업 버튼은 누르지 않을 때 1, GND로 연결되어 눌렸을 때 0을 읽습니다.'},
  adc: {options:['0과 1만 읽는다','연속적으로 변하는 전압을 숫자로 읽는다','항상 똑같은 온도를 보여준다'],answer:1,why:'ADC는 아날로그 전압을 디지털 숫자로 바꿉니다.'},
  pwm: {options:['신호의 켜진 시간 비율','USB 케이블 색상','코드의 들여쓰기'],answer:0,why:'PWM 듀티 비율을 바꾸면 평균 전력 및 밝기를 바꿀 수 있습니다.'},
  dht: {options:['빠르게 계속 읽으면 정확하다','약 2초 간격으로 읽는다','GPIO를 5V 출력으로 바꾼다'],answer:1,why:'DHT11은 측정 간격을 두어야 안정적으로 읽을 수 있습니다.'},
  neopixel: {options:['RGB 색상 값을 조절한다','전압을 무한정 올린다','GND를 연결하지 않는다'],answer:0,why:'R·G·B 밝기를 조합하여 색을 표현하며, 전원과 GND 연결이 중요합니다.'},
};
export const CHALLENGES = {
  blink: { title:'0.2초마다 깜박이는 LED', help:'계속 반복 안에 켜기·끄기와 200ms 기다리기를 배치하세요.', required:['esp_forever','esp_output','esp_wait'], special:'blink' },
  traffic: {title:'3색 신호등 만들기',help:'GPIO13·14·17을 모두 출력으로 사용하고 기다리기 블록으로 시간차를 주세요.',required:['esp_forever','esp_output','esp_wait'],special:'traffic'},
  button: {title:'버튼을 누를 때 LED 켜기',help:'조건 블록 안에 GPIO2 켜기 블록을 넣어 보세요.',required:['esp_forever','esp_button_if','esp_output'],special:'button'},
  adc: {title:'0.5초마다 빛 센서값 출력',help:'GPIO34의 아날로그값을 읽고 500ms 간격으로 출력하세요.',required:['esp_forever','esp_adc','esp_wait'],special:'adc'},
  pwm: {title:'LED를 밝기 절반으로 조절',help:'GPIO18에 PWM 1000Hz, 듀티 32768을 넣어 보세요.',required:['esp_pwm'],special:'pwm'},
  dht: {title:'2초 간격으로 교실 온도 확인',help:'GPIO4 DHT11을 반복해서 읽고 2000ms 기다리세요.',required:['esp_forever','esp_dht','esp_wait'],special:'dht'},
  neopixel: {title:'8개 네오픽셀을 파란색으로',help:'GPIO5에 연결된 네오픽셀 8개를 파랑으로 설정하세요.',required:['esp_neopixel'],special:'neopixel'},
};
