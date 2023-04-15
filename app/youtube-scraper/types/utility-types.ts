export type Nullable<T> = T | null;
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type Obj<T = unknown> = Record<string, T>