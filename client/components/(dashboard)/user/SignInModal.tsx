import { SignInModalProps } from "../../../interfaces/props";
import { useState } from "react";
import { FaGoogle, FaLinkedinIn } from "react-icons/fa";

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Perform login logic here
    console.log("Email:", email);
    console.log("Password:", password);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="relative mb-6">
          <h2 className="text-2xl font-semibold text-center text-[#143E6F] font-serif">
            Login
          </h2>
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Enter Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-2"
            >
              Enter Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="text-sm mb-6">
            <button
              type="button"
              className="text-[#143E6F] hover:underline"
              onClick={() => {
                /* handle forgot password */
              }}
            >
              Forgot Password
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#143E6F] text-white py-2 rounded-md font-medium mb-6"
          >
            Login
          </button>
        </form>

        {/* Social Buttons */}
        <button className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 mb-4">
          <FaGoogle className="mr-2 text-lg text-red-500" />
          <span className="text-sm font-medium">Sign Up with Google</span>
        </button>

        <button className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2">
          <FaLinkedinIn className="mr-2 text-lg text-blue-700" />
          <span className="text-sm font-medium">Sign Up with LinkedIn</span>
        </button>

        {/* Footer */}
        <div className="text-center mt-6 text-sm">
          Don’t Have An Account?{" "}
          <button
            onClick={() => {
              /* switch to Sign Up modal */
            }}
            className="text-gray-400 hover:text-gray-600 underline"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
