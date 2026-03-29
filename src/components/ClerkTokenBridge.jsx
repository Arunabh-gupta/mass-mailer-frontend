import { useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { getClerkTokenOptions, setAccessTokenGetter } from '../api/authToken';

function ClerkTokenBridge() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setAccessTokenGetter(null);
      return undefined;
    }

    setAccessTokenGetter(() => getToken(getClerkTokenOptions()));

    return () => {
      setAccessTokenGetter(null);
    };
  }, [getToken, isLoaded, isSignedIn]);

  return null;
}

export default ClerkTokenBridge;
