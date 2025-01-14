import { useState } from "react";
import SignUpModal from "./SignUpModel";

export default function SignUpButton() {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  const openSignUpModal = () => setIsSignUpModalOpen(true);
  const closeSignUpModal = () => setIsSignUpModalOpen(false);

  return (
    <>
      <button
        onClick={openSignUpModal}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      >
        Sign Up
      </button>
      <SignUpModal isOpen={isSignUpModalOpen} onClose={closeSignUpModal} />
    </>
  );
}
