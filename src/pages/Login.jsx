import { SignIn } from '@clerk/clerk-react';

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <SignIn
            routing="path"
            path="/login"
            signUpUrl="/register"
            fallbackRedirectUrl="/"
          />
        </div>
      </div>
    </div>
  );
}
