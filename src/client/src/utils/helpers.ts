export const isGreaterThanZero = (num: number) => num > 0;

export const validateDateString = (date: string) =>
    date === '' ? undefined : date;
