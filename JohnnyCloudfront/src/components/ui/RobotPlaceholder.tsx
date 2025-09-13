import React from "react";
import { Card } from "@/components/ui/Card";

export function RobotPlaceholder({
  title = "Drop Johnny-5 render here",
  subtitle = "Robot character placeholder",
  imageSrc,
}: { 
  title?: string; 
  subtitle?: string;
  imageSrc?: string;
}) {
  return (
    <Card className="p-10 grid place-items-center min-h-[260px] border border-dashed border-[rgba(255,255,255,.18)]">
      <div className="text-jc-dim text-center">
        {imageSrc ? (
          <div className="mb-4">
            <img 
              src={imageSrc} 
              alt="Johnny-5 Robot" 
              className="w-24 h-24 mx-auto rounded-lg shadow-lg animate-floaty"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(0,230,255,0.5))',
                border: '2px solid rgba(0,230,255,0.3)'
              }}
            />
          </div>
        ) : (
          <div className="text-6xl mb-2 animate-floaty">🤖</div>
        )}
        <div className="font-semibold text-white mb-1">{title}</div>
        <div className="text-sm">{subtitle}</div>
      </div>
    </Card>
  );
}
