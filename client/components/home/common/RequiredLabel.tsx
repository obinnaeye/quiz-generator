import React from "react";

interface RequiredLabelProps {
  text: string;
  required?: boolean;
}

export default function RequiredLabel({
  text,
  required = false,
}: RequiredLabelProps) {
  return (
    <label className="block text-sm font-semibold text-[#2C3E50] mb-1">
      {text}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  );
}
