import { useEffect, useRef } from 'react';

export default function usePrevious<T>(state: T): T | undefined {
  const ref = useRef<T>();
  
  //每次 render 时，都会更新 ref.current 的值，但是获取的 state 值是上一次的，因为 这里捕获的是特定声明周期的 state
  useEffect(() => {
    ref.current = state;
  });

  return ref.current;
}
