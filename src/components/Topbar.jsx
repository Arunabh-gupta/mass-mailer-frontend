import { SignedIn, UserButton } from '@clerk/clerk-react';

export default function Topbar() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-end">
        <SignedIn>
          <UserButton afterSignOutUrl="/login" />
        </SignedIn>
      </div>
    </header>
  );
}
