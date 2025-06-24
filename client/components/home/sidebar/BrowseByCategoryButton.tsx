// components/sidebar/BrowseByCategoryButton.tsx
import React from "react";
import { useRouter } from "next/navigation";
import SidebarButton from "./SidebarButton";

const BrowseByCategoryButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/categories");
  };

  return <SidebarButton label="Browse by Category" icon="📚" onClick={handleClick} />;
};

export default BrowseByCategoryButton;
