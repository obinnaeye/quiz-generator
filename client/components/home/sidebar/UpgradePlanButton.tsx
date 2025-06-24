"use client";

import React from "react";
import { useRouter } from "next/navigation";
import SidebarButton from "./SidebarButton";

const UpgradePlanButton = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/#pricing");
  };

  return <SidebarButton label="Upgrade Plan" icon="🚀" onClick={handleClick} />;
};

export default UpgradePlanButton;
