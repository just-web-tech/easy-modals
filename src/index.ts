import { create, ModalInstance } from './create';
import { ModalsRegistry } from './modals-registry';
import { modalsStore } from './modals-store';
import { registryStore } from './registry-store';
import { ModalStore } from './use-modal-state';

const cleanup = () => {
  modalsStore.clear();
  registryStore.clear();
};

const modals = {
  create,
  anyVisible: modalsStore.anyVisible,
  closeLatest: modalsStore.closeLatest,
  // Make a copy to avoid mutations
  visibleIds: (): ReadonlySet<string> => new Set(modalsStore.visibleIds()),
  close: () => modalsStore.close(),
  cleanup,
};

export { modals, ModalsRegistry };
export type { ModalInstance, ModalStore };
