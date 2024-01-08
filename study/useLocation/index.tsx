import { useEffect, useState } from 'react';
// 判断浏览器
import { isBrowser, off, on } from './misc/util';

//浏览器不会监听的方法
const patchHistoryMethod = (method) => {
  const history = window.history;
  const original = history[method];

  history[method] = function (state) {
    // 原先函数
    const result = original.apply(this, arguments);
    // 自定义事件 new Event 、 dispatchEvent
    const event = new Event(method.toLowerCase());

    (event as any).state = state;

    window.dispatchEvent(event);

    return result;
  };
};

if (isBrowser) {
  //pushState、replaceState 不会触发 popstate 事件
  patchHistoryMethod('pushState');
  patchHistoryMethod('replaceState');
}
// 省略 LocationSensorState 类型

const useLocationServer = (): LocationSensorState => ({
  trigger: 'load',
  length: 1,
});

const buildState = (trigger: string) => {
  const { state, length } = window.history;

  const { hash, host, hostname, href, origin, pathname, port, protocol, search } = window.location;

  return {
    trigger,
    state,
    length,
    hash,
    host,
    hostname,
    href,
    origin,
    pathname,
    port,
    protocol,
    search,
  };
};

const useLocationBrowser = (): LocationSensorState => {
  const [state, setState] = useState(buildState('load'));

  useEffect(() => {
    const onPopstate = () => setState(buildState('popstate'));
    const onPushstate = () => setState(buildState('pushstate'));
    const onReplacestate = () => setState(buildState('replacestate'));

    on(window, 'popstate', onPopstate);
    on(window, 'pushstate', onPushstate);
    on(window, 'replacestate', onReplacestate);

    return () => {
      off(window, 'popstate', onPopstate);
      off(window, 'pushstate', onPushstate);
      off(window, 'replacestate', onReplacestate);
    };
  }, []);

  return state;
};

const hasEventConstructor = typeof Event === 'function';

export default isBrowser && hasEventConstructor ? useLocationBrowser : useLocationServer;
