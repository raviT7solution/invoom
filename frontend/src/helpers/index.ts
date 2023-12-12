export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

export const randomId = () => {
  return Math.random().toString(36).substr(2, 9);
};
