import { ComponentType } from 'react';
import { define } from './define';
import { registryStore } from './registry-store';

export const register = (id: string, Component: ComponentType) => {
  registryStore.add(id, define(id, Component));
  return () => registryStore.remove(id);
};
