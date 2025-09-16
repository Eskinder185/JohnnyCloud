import React from "react";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "robot" | "none";
}

export default function PageShell({ children, className = "", variant: _variant = "default" }: PageShellProps) {
  // variant is available for future use
  return (
    <div className={`min-h-screen py-8 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        {children}
      </div>
    </div>
  );
}
