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
