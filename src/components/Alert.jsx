import PropTypes from 'prop-types';

export default function Alert({ message, onClose }) {
  if (!message) {
    return null;
  }

  return (
    <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-xs font-semibold text-red-700 hover:text-red-900"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

Alert.propTypes = {
  message: PropTypes.string,
  onClose: PropTypes.func,
};
