import React from "react";
import SidebarButton from "./SidebarButton";
import { showComingSoonToast } from "../../ui/ComingSoonToast";

const FoldersButton = () => {
  return (
    <SidebarButton label="Folders" icon="📁" onClick={showComingSoonToast} />
  );
};

export default FoldersButton;
