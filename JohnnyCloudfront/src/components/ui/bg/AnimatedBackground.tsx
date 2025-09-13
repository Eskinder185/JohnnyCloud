import React from "react";

export function AnimatedBackground({ variant = "robot" }: { variant?: "finops" | "secops" | "robot" }) {
  return <div className={`animated-bg ${variant}`} />;
}