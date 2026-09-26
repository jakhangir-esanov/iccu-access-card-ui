import { useCallback, useEffect, useRef } from 'react';

export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delayMs: number,
): (...args: TArgs) => void {
  const latest = useRef(callback);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    latest.current = callback;
  }, [callback]);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
    },
    [],
  );

  return useCallback(
    (...args: TArgs) => {
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        latest.current(...args);
      }, delayMs);
    },
    [delayMs],
  );
}
