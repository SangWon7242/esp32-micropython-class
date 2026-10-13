'use client';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import {useParams,useRouter} from 'next/navigation';
import {useState} from 'react';
import {CHALLENGES,getChapter,getCourseOfChapter,STAGES,getStagesForChapter,getMicroMission,QUESTION_OPTIONS,isUnlocked,nextStage,previousStage,KEYESTUDIO_URL} from '../../../../src/curriculum';
import {useProgress} from '../../../../components/ProgressProvider';
import {validateChallenge,flatten} from '../../../../src/validation.mjs';
import {validateMicroMission} from '../../../../src/micro-validation.mjs';
import {parseMicroPython} from '../../../../src/parser.mjs';
const StudioEditor=dynamic(()=>import('../../../../components/StudioEditor'),{ssr:false,loading:()=> <div className="editor-placeholder">블록 편집기를 불러오는 중…</div>});
const makeKey=(chapterId,stageId)=>`${chapterId}:${stageId}`;
function Classroom(){const {chapterId,stageId}=useParams(),router=useRouter();const {progress,finish}=useProgress();const chapter=getChapter(chapterId), course=getCourseOfChapter(chapterId),mission=getMicroMission(chapterId,stageId),steps=getStagesForChapter(chapterId),stage=steps.find(s=>s.id===stageId)||STAGES.find(s=>s.id===stageId);
 const [answer,setAnswer]=useState(null),[wired,setWired]=useState(false),[verified,setVerified]=useState(false),[reflection,setReflection]=useState(''),[feedback,setFeedback]=useState(''),[hintLevel,setHintLevel]=useState(0),[lastEdit,setLastEdit]=useState(null);
 const storageKey=`esp32-block-studio:draft:${chapterId}:${stageId}`;
 const [initialCode]=useState(()=>typeof window!=='undefined' ? localStorage.getItem(storageKey)|| (mission?mission.starterCode:stageId==='build'&&chapter?chapter.code:'from machine import Pin\n') : (mission?mission.starterCode:stageId==='build'&&chapter?chapter.code:'from machine import Pin\n'));
 const [code,setCode]=useState(initialCode);
 if(!chapter||!course||!stage)return <main className="site-body">해당 학습 단계를 찾을 수 없습니다. <Link href="/">홈으로</Link></main>;
 if(!isUnlocked(chapterId,stageId,progress.done))return <main className="site-body"><div className="lock-panel"><h2>아직 잠긴 미션입니다</h2><p>이전 미션을 완료하면 열 수 있습니다.</p><Link className="action primary" href={`/course/${course.id}`}>챕터 지도로 돌아가기</Link></div></main>;
 const quiz=QUESTION_OPTIONS[chapterId], challenge=CHALLENGES[chapterId],idx=steps.findIndex(s=>s.id===stageId),isDone=!!progress.done[makeKey(chapterId,stageId)];
 const prev=previousStage(chapterId,stageId),next=nextStage(chapterId,stageId);
 const onCodeChange=(value,origin)=>{setCode(value);if(origin)setLastEdit(origin);try{localStorage.setItem(storageKey,value)}catch{}};
 const complete=()=>{setFeedback('');
   if(mission){
     const result=validateMicroMission(code,chapterId,stageId,{editedWithText:lastEdit==='python'});
     if(!result.ok){setFeedback(result.reason);return;}
     finish(makeKey(chapterId,stageId),null,{hardwareChecked:verified});
     setFeedback(verified?'미션 완료! 코드 검사 통과 · 실물 확인은 학생 직접 체크로 기록했습니다.':'미션 완료! 코드 구조 검사 통과 · 실물 동작은 미확인입니다.');
     return;
   }
   if(stageId==='concept'&&answer!==quiz.answer){setFeedback('다시 생각해 보세요. 정답을 고르면 다음 단계로 진행할 수 있어요.');return;}
   if(stageId==='wiring'&&!wired){setFeedback('회로 연결과 안전 주의사항을 확인한 후 체크해 주세요.');return;}
   if(stageId==='build'){
     try{const ast=parseMicroPython(code);if(flatten(ast).length<1)throw new Error('하나 이상의 블록이 필요합니다.');}catch(err){setFeedback(err.message);return;}
   }
   if(stageId==='challenge'){
     const result=validateChallenge(code,chapterId);
     if(!result.ok){setFeedback(result.reason);return;}
     if(!verified){setFeedback('자동 검사는 코드 구조만 확인합니다. 실물 장치에서 동작을 확인했다면 확인란을 선택하세요.');return;}
   }
   if(stageId==='reflect'&&reflection.trim().length<10){setFeedback('생각을 10자 이상 적어주세요.');return;}
   finish(makeKey(chapterId,stageId),stageId==='reflect'?reflection:null);
   setFeedback('미션 완료! 다음 단계가 열렸습니다.');
 };
 const nav=(target)=>`/learn/${target.chapterId}/${target.stageId}`;
 return <main className="learn-page"><div className="learn-top"><Link className="back-link" href={`/course/${course.id}`}>← 챕터 지도</Link><div className="learn-heading"><span className="overline">{course.badge} / {chapter.name}</span><h1>{stage.title}</h1></div><div className="lesson-pager">{idx<0?'이전 버전':`${idx+1} / ${steps.length}`}</div></div>
 <div className="learning-progress">{steps.map((item,i)=><Link key={item.id} href={isUnlocked(chapterId,item.id,progress.done)?`/learn/${chapterId}/${item.id}`:'#'} className={`mini-step ${item.id===stageId?'current':''} ${progress.done[makeKey(chapterId,item.id)]?'complete':''} ${!isUnlocked(chapterId,item.id,progress.done)?'unavailable':''}`} title={item.title}>{progress.done[makeKey(chapterId,item.id)]?'✓':i+1}<span>{item.short}</span></Link>)}</div>
 <div className="learning-layout"><aside className="instruction-panel"><div className="instruction-top"><span className="eyebrow">MISSION {idx+1}</span><h2>{stage.title}</h2><p>{stage.description}</p></div>
 {mission&&<><div className="challenge-label">STEP {String(idx+1).padStart(2,'0')} · 작은 미션</div><h3>이 단계에서 해낼 일</h3><p className="question">{mission.goal}</p><div className="callout"><strong>배우는 개념</strong><p>{mission.concept}</p></div><h3>힌트가 필요하나요?</h3><p className="secondary-text">해답을 바로 보여주지 않고 스스로 탐색하도록 돕습니다.</p><button type="button" className="action subtle hint-button" onClick={()=>setHintLevel(h=>Math.min(h+1,2))}>{hintLevel===0?'힌트 1 열기':hintLevel===1?'추가 힌트 보기':'힌트 모두 열림'}</button>{hintLevel>0&&<p className="hint-message">{hintLevel===1?mission.concept:mission.hint}</p>}<h3>실제 장치 확인</h3><p className="secondary-text">{mission.hardware}</p><label className="check-line"><input type="checkbox" checked={verified} onChange={e=>setVerified(e.target.checked)}/>ESP32에서 동작을 직접 봤어요 (자기 확인)</label><p className="secondary-text">이 체크는 실기 시험이 아니며, 자동 검사는 코드 구조만 확인합니다. 체크하지 않아도 코딩 단계는 완료할 수 있습니다.</p>{mission.mode==='python'&&<div className="warning"><strong>텍스트 코딩 단계</strong><p>이번 미션에서는 블록을 숨겼습니다. MicroPython 코드를 직접 편집해야 통과해요.</p></div>}</>}
 {stageId==='concept'&&<><h3>생각해 보기</h3><p className="question">{chapter.question}</p><div className="callout"><strong>배울 개념</strong><p>{chapter.concept}</p></div><h3>퀴즈: 올바른 설명을 선택하세요</h3><div className="answer-options">{quiz.options.map((opt,i)=><button key={i} className={`answer ${answer===i?'selected':''}`} onClick={()=>setAnswer(i)}>{String.fromCharCode(65+i)}. {opt}</button>)}</div>{answer===quiz.answer&&<p className="success-text">✓ {quiz.why}</p>}</>}
 {stageId==='wiring'&&<><h3>준비물</h3><p>{chapter.device}, ESP32 보드, USB 케이블, 브레드보드, 점퍼선</p><h3>배선 가이드</h3><ol className="wiring-list">{chapter.wiring.map((line,i)=><li key={i}>{line}</li>)}</ol><div className="warning"><strong>안전 체크</strong><p>{chapter.warning}</p></div><label className="check-line"><input type="checkbox" checked={wired} onChange={e=>setWired(e.target.checked)}/>전원을 분리하고 배선을 확인했어요.</label><p className="secondary-text">핀맵은 사용하는 실제 Keyestudio 보드와 센서 모듈에 맞춰 교사가 최종 확인해야 합니다.</p></>}
 {stageId==='build'&&<><h3>따라하기</h3><p>{chapter.mission}</p><div className="callout"><strong>오늘의 관찰 질문</strong><p>{chapter.question}</p></div><h3>활동 순서</h3><ol className="wiring-list"><li>오른쪽에 준비된 블록과 코드를 비교합니다.</li><li>블록의 숫자 또는 핀을 바꾸며 코드 변화를 관찰합니다.</li><li>변경한 코드를 ESP32에 실행해 봅니다.</li></ol></>}
 {stageId==='challenge'&&<><div className="challenge-label">CHALLENGE</div><h3>{challenge.title}</h3><p>{challenge.help}</p><div className="callout"><strong>기억하세요</strong><p>빈 블록 화면에서 직접 조립해 보세요. 힌트는 마음껏 확인할 수 있어요.</p></div><label className="check-line"><input type="checkbox" checked={verified} onChange={e=>setVerified(e.target.checked)}/>실제 ESP32 연결과 동작을 직접 확인했어요.</label><p className="secondary-text">자동 채점은 코드의 구조만 검사합니다. 센서 연결과 실제 동작은 사람이 확인해야 합니다.</p></>}
 {stageId==='reflect'&&<><h3>마지막 질문</h3><p className="question">{chapter.question}</p><p>미션에서 바꾼 숫자 또는 명령과, 그렇게 했을 때 달라진 결과를 설명해 보세요.</p><textarea className="reflection" placeholder="예: 기다리기 시간을 500에서 200으로 바꾸니 LED가 더 빨리 깜박였어요." value={reflection} onChange={e=>setReflection(e.target.value)}/><div className="callout"><strong>다음 수업 준비</strong><p>다음 프로젝트에서 이 센서를 어디에 활용하면 좋을지 생각해 보세요.</p></div></>}
 <div className="source-foot"><a href={KEYESTUDIO_URL} target="_blank" rel="noreferrer">공식 Keyestudio MicroPython 교안 ↗</a><small>{chapter.reference}</small></div></aside>
 <section className="work-panel">{(mission||['build','challenge'].includes(stageId))? <StudioEditor key={`${chapterId}:${stageId}`} initialCode={initialCode} onChange={onCodeChange} mode={mission?.mode||'hybrid'} allowedBlocks={mission?.allowedBlocks}/>:<div className="concept-display"><div className="visual-label">{stageId==='concept'?'오늘의 탐구':stageId==='wiring'?'하드웨어 준비':'나만의 실험 노트'}</div><div className="visual-icon">{stageId==='concept'?'◎':stageId==='wiring'?'⌁':'✎'}</div><h2>{chapter.name}</h2><p>{stageId==='wiring'?'왼쪽 배선 가이드를 확인한 뒤 ESP32를 연결해 보세요.':stageId==='concept'?chapter.concept:'기록을 완성하면 다음 챕터로 이동할 수 있어요.'}</p><div className="concept-flow"><span>생각</span><b>→</b><span>설계</span><b>→</b><span>실험</span><b>→</b><span>개선</span></div></div>}
 <div className="lesson-bottom"><div className="lesson-result">{isDone?<span className="success-text">✓ 코드 미션 완료{mission?' · 하드웨어 확인은 별도':''}</span>:feedback?<span className={feedback.includes('완료')?'success-text':'error-text'}>{feedback}</span>:<span>스스로 풀어 본 뒤 완료 버튼을 누르세요.</span>}</div><div className="lesson-actions">{prev&&<Link className="action subtle" href={nav(prev)}>← 이전</Link>}<button className="action primary" onClick={complete}>{isDone?'다시 검사하기':mission?'코드 검사 · 단계 완료':'미션 확인 및 완료'}</button>{next&&isDone&&<Link className="action dark" href={nav(next)}>다음 미션 →</Link>}{!next&&isDone&&<Link className="action dark" href="/">전체 과정 완료 ↗</Link>}</div></div></section></div>
 </main>
}
export default function LearnPage(){const {chapterId,stageId}=useParams();return <Classroom key={`${chapterId}:${stageId}`}/>}
