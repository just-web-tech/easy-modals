import { ComponentType, JSX, MemoExoticComponent } from 'react';
import { uniqueId } from './utils';
import { getTypedModalsStore, DataParams, UpdateDataParams } from './modals-store';
import { define } from './define';
import { ModalStore, useModalState } from './use-modal-state';
import { register } from './register';

export type ModalInstance<T = never> = {
  id: string;
  open: (...data: DataParams<T>) => void;
  close: () => void;
  update: (...data: UpdateDataParams<T>) => void;
  remove: () => void;
  define: (Component: ComponentType) => MemoExoticComponent<() => JSX.Element | null>;
  useState: () => ModalStore<T>;
  register: (Component: ComponentType) => () => void;
};

export const create = <T = never>(): ModalInstance<T> => {
  const id = uniqueId();
  const store = getTypedModalsStore<T>();

  return {
    id,
    open: (...data) => store.open(id, ...data),
    close: () => store.close(id),
    update: (...data) => store.update(id, ...data),
    remove: () => store.remove(id),
    define: (Component) => define(id, Component),
    useState: () => useModalState<T>(id),
    register: (Component) => register(id, Component),
  };
};
