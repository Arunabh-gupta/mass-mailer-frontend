const clerkJwtTemplate = import.meta.env.VITE_CLERK_JWT_TEMPLATE;

let accessTokenGetter = async () => null;

export const getClerkTokenOptions = () => (
  clerkJwtTemplate
    ? { template: clerkJwtTemplate }
    : undefined
);

export const setAccessTokenGetter = (getter) => {
  accessTokenGetter = getter ?? (async () => null);
};

export const getAccessToken = async () => accessTokenGetter();
