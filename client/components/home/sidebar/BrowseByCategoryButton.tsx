import React from "react";
import SidebarButton from "./SidebarButton";
import { showComingSoonToast } from "../../ui/ComingSoonToast";

const BrowseByCategoryButton = () => {
  return (
    <SidebarButton
      label="Browse by Category"
      icon="📚"
      onClick={showComingSoonToast}
    />
  );
};

export default BrowseByCategoryButton;
