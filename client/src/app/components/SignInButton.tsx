// src/app/components/SignInButton.tsx

import { useState } from "react";
import SignInModal from "./SignInModal";

export default function SignInButton() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const openSignInModal = () => setIsSignInModalOpen(true);
  const closeSignInModal = () => setIsSignInModalOpen(false);

  return (
    <>
      <button
        onClick={openSignInModal}
        className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 ml-4"
      >
        Sign In
      </button>
      <SignInModal isOpen={isSignInModalOpen} onClose={closeSignInModal} />
    </>
  );
}
