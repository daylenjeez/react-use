import { useEffect, useState } from 'react';
// 防抖、节流
import { throttle } from 'throttle-debounce';
// 事件解绑和监听函数
import { off, on } from './misc/util';

const defaultEvents = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel'];

const oneMinute = 60e3;

const useIdle = (
  ms: number = oneMinute,
  initialState: boolean = false,
  events: string[] = defaultEvents
):boolean=>{
  const [state,setState] = useState(initialState);

  useEffect(()=>{
    let mounted = true;
    let timeout:any;
    let localState = state;

    const set = (newState:boolean)=>{
      if(mounted){//避免内存泄漏
        localState = newState;
        setState(newState);
      }
    }

    const onEvent = throttle(50,()=>{
      if(localState){
        set(false);
      }
      clearTimeout(timeout);
      timeout = setTimeout(() => set(true), ms);
    });

    const onVisibility = ()=>{
      if(!document.hidden){
        onEvent();
      }
    }

    for(let i = 0; i < events.length; i++){
      on(document, events[i], onEvent);
    }

    on(document,'visibilitychange',onVisibility);

    timeout = setTimeout(() => set(true), ms);

    return () => {
      mounted = false;

      for (let i = 0; i < events.length; i++) {
        off(window, events[i], onEvent);
      }
      off(document, 'visibilitychange', onVisibility);
    }
  },[]);
}
