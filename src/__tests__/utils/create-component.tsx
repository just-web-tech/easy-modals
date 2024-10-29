import { ModalInstance } from '../..';
import { Modal } from './modal';

export type CreateComponentOptions = {
  keepMounted?: boolean;
};

export const createComponent = (modal: ModalInstance<any>, options: CreateComponentOptions = {}) => {
  const renders = { current: 0 };
  const { keepMounted = false } = options;

  const Component = () => {
    const state = modal.useState();
    renders.current += 1;

    return (
      <Modal
        visible={state.visible}
        onClose={state.close}
        afterClose={() => {
          if (keepMounted) return;
          state.remove();
        }}
      >
        {state.data}
      </Modal>
    );
  };

  return { Component, renders };
};
