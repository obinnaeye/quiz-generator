// components/sidebar/FoldersButton.tsx
import React from "react";
import { useRouter } from "next/navigation";
import SidebarButton from "./SidebarButton";

const FoldersButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/folders");
  };

  return <SidebarButton label="Folders" icon="📁" onClick={handleClick} />;
};

export default FoldersButton;
