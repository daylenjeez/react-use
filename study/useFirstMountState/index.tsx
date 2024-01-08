import { useRef } from 'react';

export function useFirstMountState(): boolean {
  const isFirst = useRef(true);

  if(isFirst.current) {
    //闭包导致获取的是上一次的值
    isFirst.current = false;
    return true;
  }

  return isFirst.current;
}


const Demo = ()=>{
  const [count, setCount] = useState(0);

  useEffct(()=>{
    console.log(count)
  })

  return <button onClick={()=>setCount(count+1)}>count</button>
}
