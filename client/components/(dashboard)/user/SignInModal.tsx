import { SignInModalProps } from "../../../interfaces/props";
import { useState } from "react";

const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Perform login logic here
    console.log("Username/Email:", usernameOrEmail);
    console.log("Password:", password);
    // Close modal after submit
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-md shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Username or Email</label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter username or email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Sign In
          </button>
        </form>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-500 text-white p-2 rounded w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SignInModal;
