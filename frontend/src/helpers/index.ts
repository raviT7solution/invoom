import { useCallback, useState } from "react";

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const randomId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const selectLabelFilterSort = (
  a: {
    label: string;
    value: string;
  },
  b: {
    label: string;
    value: string;
  },
) => a.label.toLowerCase().localeCompare(b.label.toLowerCase());

export const initials = (name: string) =>
  name.split(" ").map((i) => i.charAt(0).toUpperCase());

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
