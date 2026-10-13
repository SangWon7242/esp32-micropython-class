export const PROGRESS_KEY='esp32-block-studio:progress:v2';
export function readProgress() {
  if(typeof window==='undefined') return {done:{},notes:{},deviceChecks:{}};
  try {const s=JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}');return {done:s.done||{},notes:s.notes||{},deviceChecks:s.deviceChecks||{}};} catch {return {done:{},notes:{},deviceChecks:{}};}
}
export function saveProgress(progress) {
  if(typeof window==='undefined')return;
  localStorage.setItem(PROGRESS_KEY,JSON.stringify(progress));
  window.dispatchEvent(new Event('esp32-progress'));
}
