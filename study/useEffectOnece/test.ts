import { renderHook } from '@testing-library/react-hooks';
import { useEffectOnce } from '../src';

//mock
const mockEffectCleanup = jest.fn();
const mockEffectCallback = jest.fn().mockReturnValue(mockEffectCleanup);

it('should run provided effect only once', () => {
  const { rerender } = renderHook(() => useEffectOnce(mockEffectCallback));
  //只调用一次
  expect(mockEffectCallback).toHaveBeenCalledTimes(1);

  rerender();
  //重新渲染 调用一次
  expect(mockEffectCallback).toHaveBeenCalledTimes(1);
});

it('should run clean-up provided on unmount', () => {
  const { unmount } = renderHook(() => useEffectOnce(mockEffectCallback));
  //期望没有调用
  expect(mockEffectCleanup).not.toHaveBeenCalled();

  unmount();
  //卸载 调用一次
  expect(mockEffectCleanup).toHaveBeenCalledTimes(1);
});
