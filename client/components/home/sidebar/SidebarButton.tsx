import React from "react";

interface SidebarButtonProps {
  icon: React.ReactNode;
  label: string;
}

export default function SidebarButton({ icon, label }: SidebarButtonProps) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-2 bg-[#E4E4E4] border border-[#C9C9C9] rounded-md hover:bg-[#d3d3d3] text-left font-medium text-sm text-[#1A1A1A] shadow-sm">
      <span className="text-xl">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}
