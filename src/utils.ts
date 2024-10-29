import { ComponentType, useReducer } from 'react';

export type AnyRecord = Record<string, unknown>;

export type UpdateFn<T> = (prev: T) => T;

export const isUpdateFn = <T>(data?: unknown): data is UpdateFn<T> => {
  return typeof data === 'function';
};

export type Subscriber<T> = (state: T) => void;

export type Store<T> = {
  getState: () => T;
  setState: (draft: T) => void;
  subscribe: (cb: Subscriber<T>) => () => void;
};

export const createStore = <T>(defaultState: T): Store<T> => {
  let state = defaultState;
  const subscribers = new Set<Subscriber<T>>();

  return {
    getState: () => state,
    setState: (draft: T) => {
      state = draft;
      subscribers.forEach((cb) => cb(state));
    },
    subscribe: (cb: Subscriber<T>) => {
      subscribers.add(cb);
      return () => subscribers.delete(cb);
    },
  };
};

let _uniqueId = 0;
export const uniqueId = () => `easy-modals::${(_uniqueId++).toString(16)}`;

export const omit = <T extends AnyRecord, K extends keyof T>(obj: T, key: K) => {
  const { [key]: _, ...other } = obj;
  return other as T;
};

export const useForceUpdate = () => useReducer((prev) => !prev, false)[1];

export const getDisplayName = (Component: ComponentType) => {
  return Component.displayName ?? Component.name;
};
