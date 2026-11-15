import React, { useEffect, useId } from 'react';

// Dialog shell. Closes on Escape and on the close button.
export default function Modal({ title, testId, onClose, children }) {
  const titleId = useId();

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1c30]/50 backdrop-blur-sm p-md">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-md overflow-hidden"
      >
        <div className="px-lg py-md border-b border-outline-variant/30 flex justify-between items-center">
          <h2 id={titleId} className="font-headline-sm text-headline-sm text-on-surface">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-on-surface-variant hover:text-error transition-colors"
          >
            <span className="material-symbols-outlined" aria-hidden="true">close</span>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
