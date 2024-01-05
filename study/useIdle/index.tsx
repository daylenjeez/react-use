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

    // const onEvent = throttle(ms,()=>{
    //   if(localState){
    //     set(false);
    //   }
    //   clearTimeout(timeout);
    //   timeout = setTimeout(() => set(true), ms);
    // });

    return () => {
      mounted = false;
    }
  },[]);
}
