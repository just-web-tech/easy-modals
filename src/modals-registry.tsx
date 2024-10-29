import { ComponentType, Fragment, useSyncExternalStore } from 'react';
import { registryStore } from './registry-store';

export const ModalsRegistry = () => {
  const registry = useSyncExternalStore(registryStore.subscribe, registryStore.getState);
  const entries = Object.entries(registry) as [string, ComponentType][];

  return (
    <Fragment>
      {entries.map(([id, Component]) => (
        <Component key={id} />
      ))}
    </Fragment>
  );
};
