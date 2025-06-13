"use client";

import React from "react";
import { useRouter } from "next/router";
import SidebarButton from "./SidebarButton";

const UpgradePlanButton: React.FC = () => {
  const router = useRouter();

  return (
    <SidebarButton
      label="Upgrade Plan"
      icon="🚀"
      onClick={() => {
        // Navigate to homepage and scroll to Pricing
        router.push("/#pricing");
      }}
    />
  );
};

export default UpgradePlanButton;
