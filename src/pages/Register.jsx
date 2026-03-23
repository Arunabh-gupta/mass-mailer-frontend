import { SignUp } from '@clerk/clerk-react';

export default function Register() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <SignUp
            routing="path"
            path="/register"
            signInUrl="/login"
            fallbackRedirectUrl="/"
          />
        </div>
      </div>
    </div>
  );
}
