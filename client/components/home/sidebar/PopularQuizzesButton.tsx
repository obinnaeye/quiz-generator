import React from "react";
import SidebarButton from "./SidebarButton";
import { showComingSoonToast } from "../../ui/ComingSoonToast";

const PopularQuizzesButton = () => {
  return (
    <SidebarButton
      label="Popular Quizzes"
      icon="🌟"
      onClick={showComingSoonToast}
    />
  );
};

export default PopularQuizzesButton;
