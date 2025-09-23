import { useEffect, useState } from "react";
import { Mic } from "lucide-react";

interface WakeWordNotificationProps {
  show: boolean;
  onClose: () => void;
  detectedText?: string;
}

export default function WakeWordNotification({ 
  show, 
  onClose, 
  detectedText 
}: WakeWordNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !isVisible) return null;

  return (
    <div className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
    }`}>
      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
            <Mic className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-green-300 font-medium text-sm">
              Wake word detected!
            </div>
            {detectedText && (
              <div className="text-green-200 text-xs mt-1">
                "{detectedText}"
              </div>
            )}
            <div className="text-green-400 text-xs mt-1">
              Activating Johnny-5...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

