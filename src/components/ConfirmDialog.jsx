import React from 'react';
import Modal from './Modal';

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel }) {
  return (
    <Modal title={title} testId="confirm-dialog" onClose={onCancel}>
      <div className="p-lg flex flex-col gap-md">
        <p className="font-body-md text-body-md text-on-surface">
          {message}
        </p>
        <div className="flex justify-end gap-sm mt-sm">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 font-label-md text-label-md text-on-surface hover:bg-surface-container rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            autoFocus
            onClick={onConfirm}
            className="px-4 py-2 font-label-md text-label-md bg-error text-on-error hover:bg-error-container hover:text-on-error-container rounded-lg transition-colors"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
