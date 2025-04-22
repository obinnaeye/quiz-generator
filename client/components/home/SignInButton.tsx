import React, { useState } from "react";
import SignInModal from "../(dashboard)/user/SignInModal";

const SignInButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-base font-semibold text-[#0F2654] border border-[#0F2654] bg-white rounded-2xl px-6 py-2 hover:bg-gray-100 transition"
      >
        Sign In
      </button>
      <SignInModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default SignInButton;
