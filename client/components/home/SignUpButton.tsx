import React, { useState } from "react";
import SignUpModal from "../(dashboard)/user/SignUpModal";

const SignUpButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-base font-semibold text-white bg-[#0F2654] rounded-2xl px-6 py-2 hover:bg-[#0c2145] transition"
      >
        Sign Up
      </button>
      <SignUpModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default SignUpButton;
