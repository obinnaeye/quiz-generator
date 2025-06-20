import React from "react";
import SidebarButton from "./SidebarButton";
import { showComingSoonToast } from "../../ui/ComingSoonToast";

const SavedQuizzesButton = () => {
  return (
    <SidebarButton
      label="Saved Quizzes"
      icon="💾"
      onClick={showComingSoonToast}
    />
  );
};

export default SavedQuizzesButton;
