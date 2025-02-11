import React from 'react';
import { CheckButtonProps } from '../../../interfaces/props';

export default function CheckButton({ onClick }: CheckButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-green-500 text-white font-bold px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
    >
      Check Quiz
    </button>
  );
}
