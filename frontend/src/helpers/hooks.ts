import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const useLatest = <T>(value: T): { readonly current: T } => {
  const ref = useRef(value);
  ref.current = value;

  return ref;
};

export const useSteps = (length: number) => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => c + 1);

  const prev = () => setCurrent((c) => c - 1);

  const reset = useCallback(() => setCurrent(0), []);

  return {
    current,
    length,
    next,
    prev,
    reset,
    showNext: current < length - 1,
    showPrev: current > 0,
    showSubmit: current === length - 1,
  };
};

export const useRerender = (timeout: number) => {
  const [, setTime] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setTime(Date.now()), timeout);

    return () => clearInterval(id);
  }, [timeout]);
};

export const useLongPress = (callback: () => void, threshold: number) => {
  const isLongPressActive = useRef(false);
  const isPressed = useRef(false);
  const timerId = useRef<number>();

  return useMemo(() => {
    const start = () => {
      isPressed.current = true;

      timerId.current = setTimeout(() => {
        callback();
        isLongPressActive.current = true;
      }, threshold);
    };

    const cancel = () => {
      isLongPressActive.current = false;
      isPressed.current = false;

      if (timerId.current) {
        clearTimeout(timerId.current);
      }
    };

    return {
      onMouseDown: start,
      onMouseUp: cancel,
      onMouseLeave: cancel,
      onTouchStart: start,
      onTouchEnd: cancel,
    };
  }, [callback, threshold]);
};

export const useDoubleClick = (callback: () => void, timeout: number) => {
  const cb = useLatest(callback);
  const [click, setClick] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => {
      setClick(0);
    }, timeout);

    if (click === 2) {
      cb.current();
    }

    return () => clearTimeout(id);
  }, [cb, click, timeout]);

  return () => setClick((prev) => prev + 1);
};
