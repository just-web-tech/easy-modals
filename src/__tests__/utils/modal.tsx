import { ReactNode, useEffect, useRef } from 'react';

export type ModalProps = {
  visible: boolean;
  onClose?: () => void;
  afterClose?: () => void;
  children: ReactNode;
};

export const CLOSE_DELAY = 300;

export const Modal = ({ children, visible, onClose, afterClose }: ModalProps) => {
  const visibleRef = useRef(visible);
  const isLastVisible = visibleRef.current;

  useEffect(() => {
    if (!visible && isLastVisible && afterClose) {
      setTimeout(afterClose, CLOSE_DELAY);
    }
  }, [visible, afterClose, isLastVisible]);

  visibleRef.current = visible;

  return (
    <div role="dialog">
      {children}
      <button onClick={onClose} aria-label="Close">
        Close
      </button>
    </div>
  );
};
