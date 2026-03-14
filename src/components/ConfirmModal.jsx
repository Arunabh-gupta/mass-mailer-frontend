import PropTypes from 'prop-types';

export default function ConfirmModal({
  open,
  title,
  message,
  errorMessage = '',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmTone = 'danger',
  busy = false,
  onConfirm,
  onCancel,
}) {
  if (!open) {
    return null;
  }

  const confirmClassName =
    confirmTone === 'danger'
      ? 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300'
      : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
        {errorMessage ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${confirmClassName}`}
          >
            {busy ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  confirmTone: PropTypes.oneOf(['danger', 'primary']),
  busy: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
