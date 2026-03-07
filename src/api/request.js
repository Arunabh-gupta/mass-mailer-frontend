import { useUiStore } from '../store/uiStore';

const extractErrorMessage = (error, fallbackMessage) =>
  error?.response?.data?.detail || error?.message || fallbackMessage;

export const apiRequest = async (requestFn, fallbackMessage) => {
  const { startLoading, stopLoading, setError, clearError } = useUiStore.getState();
  startLoading();

  try {
    const data = await requestFn();
    clearError();
    return { data, error: null };
  } catch (error) {
    const message = extractErrorMessage(error, fallbackMessage);
    setError(typeof message === 'string' ? message : JSON.stringify(message));
    return { data: null, error: message };
  } finally {
    stopLoading();
  }
};
