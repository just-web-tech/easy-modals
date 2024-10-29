import { ComponentType, Fragment, memo, useEffect, useState } from 'react';
import { getDisplayName } from './utils';
import { modalsStore } from './modals-store';

export const define = (id: string, Component: ComponentType) => {
  const MountWatcher = memo(() => {
    useEffect(() => {
      modalsStore.setVisibleOnMountIfNeeded(id);
    }, []);

    return null;
  });

  const WithDefine = memo(() => {
    const [shouldRender, setShouldRender] = useState(() => {
      return modalsStore.getState().hasOwnProperty(id);
    });

    useEffect(() => {
      return modalsStore.subscribe((nextState) => {
        setShouldRender(nextState.hasOwnProperty(id));
      });
    }, [id]);

    if (!shouldRender) {
      return null;
    }

    return (
      <Fragment>
        <Component />
        <MountWatcher />
      </Fragment>
    );
  });

  WithDefine.displayName = `define(${getDisplayName(Component)})`;
  return WithDefine;
};
