import { ComponentType } from 'react';
import { AnyRecord, createStore, omit, Store } from './utils';

type Registry<T extends AnyRecord> = {
  [K in keyof T]?: ComponentType;
};

type RegistryStore<T extends AnyRecord> = Store<Registry<T>> & {
  add: <K extends keyof T>(id: K, Component: ComponentType) => void;
  remove: <K extends keyof T>(id: K) => void;
  clear: () => void;
};

const createRegistryStore = <T extends AnyRecord>() => {
  const registry = createStore<Registry<T>>({});

  const store: RegistryStore<T> = {
    ...registry,
    add: (id, Component) => {
      const state = registry.getState();
      if (state[id]) return;
      registry.setState({ ...state, [id]: Component });
    },
    remove: (id) => {
      const state = registry.getState();
      if (!state[id]) return;
      registry.setState(omit(state, id));
    },
    clear: () => {
      registry.setState({});
    },
  };

  return store;
};

export const registryStore = createRegistryStore();
