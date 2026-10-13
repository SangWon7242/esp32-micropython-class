import Link from 'next/link';
import {getChapter,getStagesForChapter} from '../../../src/curriculum';
import {hardwareGuideFor} from '../../../src/hardware-guides.mjs';
import WiringGuide from '../../../components/WiringGuide';
export default async function TeacherPage({params}){
 const {chapterId}=await params;const chapter=getChapter(chapterId),guide=hardwareGuideFor(chapterId);
 if(!chapter||!guide)return <main className="site-body"><p>없는 지도안입니다.</p><Link href="/">홈으로</Link></main>;
 return <main className="site-body teacher-sheet"><div className="teacher-top"><Link href={`/learn/${chapterId}/wiring`}>← 학생 미션 돌아가기</Link><span>교사용 지도안 · 인쇄 가능</span></div>
 <h1>{chapter.week} · {chapter.name}</h1><p>Keyestudio KS5020 주제를 참고해 교육 현장용으로 재구성한 교사용 지도안입니다. 실제 연결을 확인하지 않고 USB 코드를 실행하지 않습니다.</p>
 <h2>학습 목표</h2><p>{chapter.concept} · 학생이 출력 결과를 예측하고 오류를 스스로 찾을 수 있게 지도합니다.</p>
 <h2>학습 단계</h2><ol className="teacher-list">{getStagesForChapter(chapterId).map(stage=><li key={stage.id}><strong>{stage.title}</strong> — {stage.description}</li>)}</ol>
 <h2>준비물과 배선</h2><WiringGuide chapterId={chapterId}/>
 <h2>수업 질문</h2><p>{guide.prediction}</p><p>{guide.teacher}</p>
 <h2>자주 발생하는 문제</h2><ul className="teacher-list">{guide.pitfalls.map((p,i)=><li key={i}>{p}</li>)}</ul>
 <h2>실물 점검 기준</h2><p>코드 자동 검사 통과와 실물 동작 성공은 다른 기록입니다. 실행 전 저항/접지/전원 확인 → USB 포트 선택 → 코드 실행 → 실제 작동 관찰 → 학생 설명 순서로 체크합니다.</p>
 <p className="teacher-source">참고: <a href="https://docs.keyestudio.com/projects/KS5020/en/latest/docs/2.%20MicroPython_Tutorial.html" target="_blank" rel="noreferrer">Keyestudio KS5020 공식 MicroPython Tutorial ↗</a> · {guide.source}</p>
 </main>;
}
