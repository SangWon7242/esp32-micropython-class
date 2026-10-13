import {hardwareGuideFor} from '../src/hardware-guides.mjs';
export default function WiringGuide({chapterId}){
 const guide=hardwareGuideFor(chapterId);if(!guide)return null;
 return <div className="wiring-card" aria-label="학습용 회로 연결도">
   <div className="wiring-card-head"><b>회로 연결 한눈에 보기</b><small>전원 제거 후 연결 · GPIO 번호는 보드 실크 인쇄 확인</small></div>
   <div className="wiring-diagram">{guide.wires.map(([from,middle,to],i)=><div className="wire-row" key={i}><span className="wire-terminal">{from}</span><span className="wire-path"><span className="wire-line"/><span className="wire-part">{middle}</span><span className="wire-line"/></span><span className="wire-terminal target">{to}</span></div>)}</div>
   <div className="wiring-caption">예시 배선도 · 전압/극성/핀은 실제 보드와 부품 사양에 따라 교사 확인이 필요합니다.<br/>{guide.source}</div>
   <details className="parts-details"><summary>준비물 {guide.parts.length}종 보기</summary><p>{guide.parts.join(' · ')}</p></details>
 </div>;
}
