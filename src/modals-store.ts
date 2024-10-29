import { AnyRecord, createStore, isUpdateFn, omit, Store, UpdateFn } from './utils';

export type ModalState<D = unknown> = {
  id: string;
  visible: boolean;
  data: D;
};

// prettier-ignore
export type DataParams<T = never> = [T] extends [never]
  ? [] : [Extract<T, undefined>] extends [never]
    ? [T] : [Exclude<T, undefined>] | [];

// prettier-ignore
export type UpdateDataParams<T = never> = [T] extends [never]
  ? [] : [Extract<T, undefined>] extends [never]
    ? [T | UpdateFn<T>] : [Exclude<T, undefined> | UpdateFn<Exclude<T, undefined>>] | [];

export type Modals<T extends AnyRecord = AnyRecord> = {
  [K in keyof T]?: ModalState<T[K]>;
};

export type ModalsStore<T extends AnyRecord> = Store<Modals<T>> & {
  open: <K extends keyof T>(id: K, ...data: DataParams<T[K]>) => void;
  close: <K extends keyof T>(id?: K) => void;
  remove: <K extends keyof T>(id: K) => void;
  update: <K extends keyof T>(id: K, ...data: UpdateDataParams<T[K]>) => void;
  closeLatest: () => void;
  anyVisible: () => boolean;
  clear: () => void;
  visibleIds: () => Set<keyof T>;
  setVisibleOnMountIfNeeded: <K extends keyof T>(id: K) => void;
};

const createModalsStore = <T extends AnyRecord>() => {
  const visibleIds = new Set<keyof T>();
  const waitMountIds = new Set<keyof T>();

  const modals = createStore<Modals<T>>({});

  const store: ModalsStore<T> = {
    ...modals,
    open: (id, ...[data]) => {
      if (visibleIds.has(id)) return;
      if (waitMountIds.has(id)) return;
      const state = modals.getState();

      const isDefined = state[id] !== undefined;
      modals.setState({ ...state, [id]: { id, data, visible: isDefined } });

      if (isDefined) visibleIds.add(id);
      else waitMountIds.add(id);
    },
    close: (id) => {
      const state = modals.getState();

      if (id === undefined) {
        if (!visibleIds.size) return;
        const draft: Modals<T> = {};

        for (const id in state) {
          const modal = state[id]!;
          draft[id] = modal.visible ? { ...modal, visible: false } : modal;
        }

        modals.setState(draft);
        visibleIds.clear();
        return;
      }

      if (!state[id]?.visible) return;

      modals.setState({ ...state, [id]: { ...state[id], visible: false } });
      visibleIds.delete(id);
    },
    remove: (id) => {
      const state = modals.getState();
      if (!state[id]) return;

      modals.setState(omit(state, id));
      visibleIds.delete(id);
    },
    update: (id, ...[data]) => {
      const state = modals.getState();
      if (!state[id]) return;

      const nextData = isUpdateFn(data) ? data(state[id].data) : data;
      if (Object.is(nextData, state[id].data)) return;

      modals.setState({ ...state, [id]: { ...state[id], data: nextData } });
    },
    clear: () => {
      modals.setState({});
      waitMountIds.clear();
      visibleIds.clear();
    },
    closeLatest: () => {
      const lastId = Array.from(visibleIds).pop();
      if (lastId !== undefined) store.close(lastId);
    },
    setVisibleOnMountIfNeeded: (id) => {
      if (!waitMountIds.has(id)) return;
      const state = modals.getState();

      if (!state[id]) return;
      if (state[id].visible) return;

      modals.setState({ ...state, [id]: { ...state[id], visible: true } });
      waitMountIds.delete(id);
      visibleIds.add(id);
    },
    visibleIds: () => visibleIds,
    anyVisible: () => visibleIds.size > 0,
  };

  return store;
};

export const modalsStore = createModalsStore();

export const getTypedModalsStore = <T = never>() => modalsStore as ModalsStore<Record<string, T>>;
