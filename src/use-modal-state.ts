import { useEffect, useRef, useState } from "react";
import { getTypedModalsStore, UpdateDataParams } from "./modals-store";

export type ModalStore<T = never> = {
  id: string;
  visible: boolean;
  data: T;
  close: () => void;
  remove: () => void;
  update: (...data: UpdateDataParams<T>) => void;
};

export const useModalState = <T = never>(id: string): ModalStore<T> => {
  const store = getTypedModalsStore<T>();

  const [state, setState] = useState(() => store.getState()[id]);
  const stateRef = useRef(state);

  useEffect(() => {
    return store.subscribe((nextState) => {
      if (Object.is(stateRef.current, nextState[id])) return;
      stateRef.current = nextState[id];
      setState(stateRef.current);
    });
  }, [id]);

  if (!state) {
    throw new Error(`Modal "${id.toString()}" not found`);
  }

  return {
    id,
    visible: state.visible,
    data: state.data,
    close: () => store.close(id),
    remove: () => store.remove(id),
    update: (...data: UpdateDataParams<T>) => store.update(id, ...data),
  };
};
