import { SignUpModalProps } from "../../../interfaces/props";
import { FaGoogle, FaLinkedinIn } from "react-icons/fa";

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-8">
        <div className="relative">
          <h2 className="text-2xl font-semibold text-center text-[#143E6F] font-serif mb-6">
            Sign Up
          </h2>
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="name">
              Enter Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" htmlFor="email">
              Enter Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              htmlFor="password"
            >
              Choose Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#143E6F] text-white py-2 rounded-md font-medium mb-6"
          >
            Sign Up
          </button>
        </form>

        {/* Google Sign Up */}
        <button className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 mb-4">
          <FaGoogle className="mr-2 text-lg text-red-500" />
          <span className="text-sm font-medium">Sign Up with Google</span>
        </button>

        {/* LinkedIn Sign Up */}
        <button className="w-full flex items-center justify-center border border-gray-300 rounded-md py-2">
          <FaLinkedinIn className="mr-2 text-lg text-blue-700" />
          <span className="text-sm font-medium">Sign Up with LinkedIn</span>
        </button>

        {/* Login Redirect */}
        <div className="text-center mt-6 text-sm">
          Already Have An Account?{" "}
          <button className="text-gray-400 hover:text-gray-600 underline">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
