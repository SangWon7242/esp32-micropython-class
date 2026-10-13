'use client';
import {createContext,useCallback,useContext,useEffect,useState} from 'react';
import {readProgress,saveProgress} from '../src/progress';
const Context=createContext(null);
export function ProgressProvider({children}) {
  const [progress,setProgress]=useState({done:{},notes:{}});
  useEffect(()=>{setProgress(readProgress());},[]);
  const finish=useCallback((key, note, meta)=>setProgress(prev=>{
    const next={done:{...prev.done,[key]:Date.now()},notes:{...prev.notes,...(typeof note==='string'?{[key]:note}:{})},deviceChecks:{...(prev.deviceChecks||{}),...(meta?{[key]:{hardwareChecked:!!meta.hardwareChecked,source:'student-self-report'}}:{})}};
    saveProgress(next);return next;
  }),[]);
  return <Context.Provider value={{progress,finish}}>{children}</Context.Provider>;
}
export function useProgress(){return useContext(Context);}
