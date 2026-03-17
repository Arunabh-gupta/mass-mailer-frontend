import { useUiStore } from '../store/uiStore';

const extractErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.detail || error?.message || fallbackMessage;

export const apiRequest = async (requestFn, fallbackMessage, options = {}) => {
  const { startLoading, stopLoading, setError, clearError } = useUiStore.getState();
  const { suppressGlobalError = false, suppressGlobalLoading = false } = options;

  if (!suppressGlobalLoading) {
    startLoading();
  }

  try {
    const data = await requestFn();
    clearError();
    return { data, error: null };
  } catch (error) {
    const message = extractErrorMessage(error, fallbackMessage);
    if (!suppressGlobalError) {
      setError(typeof message === 'string' ? message : JSON.stringify(message));
    }
    return { data: null, error: message };
  } finally {
    if (!suppressGlobalLoading) {
      stopLoading();
    }
  }
};
