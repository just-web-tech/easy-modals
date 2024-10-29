import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { modals, ModalInstance, ModalsRegistry } from '..';
import { createComponent } from './utils/create-component';
import { CLOSE_DELAY } from './utils/modal';

const getDialog = () => screen.queryByRole('dialog');

describe('modals', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    modals.cleanup();
  });

  it('Init correctly with "register"', () => {
    render(<ModalsRegistry />);

    const modal = modals.create();

    act(() => modal.register(createComponent(modal).Component));
    expect(getDialog()).not.toBeInTheDocument();

    act(() => modal.open());
    expect(getDialog()).toBeInTheDocument();
  });

  it('Modal will not render if "ModalsRegistry" is not declared when using "register"', () => {
    const modal = modals.create();
    act(() => modal.register(createComponent(modal).Component));

    act(() => modal.open());
    expect(getDialog()).not.toBeInTheDocument();
  });

  it('Init correctly with "define"', () => {
    const modal = modals.create();
    const Component = modal.define(createComponent(modal).Component);

    render(<Component />);
    expect(getDialog()).not.toBeInTheDocument();

    act(() => modal.open());
    expect(getDialog()).toBeInTheDocument();
  });

  it('Modal will not render if component is not declared using "define"', () => {
    const modal = modals.create();
    modal.define(createComponent(modal).Component);

    act(() => modal.open());
    expect(getDialog()).not.toBeInTheDocument();
  });

  it('Renders the modal twice when first opened', () => {
    render(<ModalsRegistry />);

    const modal = modals.create();
    const { Component, renders } = createComponent(modal);

    act(() => modal.register(Component));
    expect(renders.current).toBe(0);

    act(() => modal.open());
    expect(renders.current).toBe(2);
  });

  it('Deletion is called only after complete closing', () => {
    render(<ModalsRegistry />);

    const modal = modals.create();
    act(() => modal.register(createComponent(modal).Component));

    act(() => modal.open());
    expect(getDialog()).toBeInTheDocument();

    act(() => modal.close());
    act(() => vi.advanceTimersByTime(CLOSE_DELAY / 2));
    expect(getDialog()).toBeInTheDocument();

    act(() => vi.advanceTimersByTime(CLOSE_DELAY / 2));
    expect(getDialog()).not.toBeInTheDocument();
  });

  it('"update" changes the state of the modal', () => {
    render(<ModalsRegistry />);

    const modal = modals.create<string>();
    const { Component, renders } = createComponent(modal);

    act(() => modal.register(Component));

    const [curr, updated] = ['idle', 'updated'];

    act(() => modal.open(curr));
    expect(screen.getByText(curr)).toBeInTheDocument();
    expect(renders.current).toBe(2);

    act(() => modal.update(updated));
    expect(screen.getByText(updated)).toBeInTheDocument();
    expect(renders.current).toBe(3);
  });

  it('Updating one modal does not re-render another', () => {
    render(<ModalsRegistry />);

    const m1 = modals.create<string>();
    const { Component: Component1, renders: renders1 } = createComponent(m1);
    act(() => m1.register(Component1));

    act(() => m1.open('m1'));
    expect(renders1.current).toBe(2);

    const m2 = modals.create<string>();
    const { Component: Component2, renders: renders2 } = createComponent(m2);
    act(() => m2.register(Component2));

    act(() => m2.open('m2'));

    expect(renders1.current).toBe(2);
    expect(renders2.current).toBe(2);

    act(() => m2.update('m2: updated'));

    expect(renders1.current).toBe(2);
    expect(renders2.current).toBe(3);
  });

  // "register" method uses "define" under the hood
  it('Rendering a modal throws an error if it is not wrapped in a "define"', () => {
    const modal = modals.create<string>();
    const { Component } = createComponent(modal);

    expect(() => render(<Component />)).toThrow(`Modal "${modal.id}" not found`);
  });

  it('"closeLatest" closes the last visible modal', () => {
    render(<ModalsRegistry />);

    const COUNT_MODALS = 5;
    const entries: ModalInstance[] = [];

    for (let i = 0; i < COUNT_MODALS; i++) {
      const modal = modals.create();

      act(() => modal.register(createComponent(modal).Component));
      act(() => modal.open());

      entries.push(modal);
    }

    expect(modals.visibleIds().size).toBe(COUNT_MODALS);

    for (let i = COUNT_MODALS - 1; i >= 0; i--) {
      act(() => modals.closeLatest());

      const id = entries[i].id;
      expect(modals.visibleIds().has(id)).toBe(false);
    }

    expect(modals.visibleIds().size).toBe(0);
  });

  it('"close" closes all visible modals', () => {
    render(<ModalsRegistry />);

    const COUNT_MODALS = 5;

    for (let i = 0; i < COUNT_MODALS; i++) {
      const modal = modals.create();
      act(() => modal.register(createComponent(modal).Component));
      act(() => modal.open());
    }

    expect(modals.visibleIds().size).toBe(COUNT_MODALS);

    act(() => modals.close());

    expect(modals.visibleIds().size).toBe(0);
  });

  it('"anyVisible" returns true if at least one modal is open', () => {
    render(<ModalsRegistry />);

    const modal = modals.create();
    act(() => modal.register(createComponent(modal).Component));

    act(() => modal.open());
    expect(modals.anyVisible()).toBe(true);

    act(() => modal.close());
    expect(modals.anyVisible()).toBe(false);
  });
});
