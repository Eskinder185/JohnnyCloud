import React from "react";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div className={`min-h-screen py-8 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        {children}
      </div>
    </div>
  );
}
