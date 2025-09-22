// src/components/Reveal.tsx
import { useEffect, useRef } from "react";

export default function Reveal({
  children,
  delay = 0,
}: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const tm = setTimeout(() => el.classList.add("show"), delay);
    return () => clearTimeout(tm);
  }, [delay]);
  return (
    <div ref={ref} className="reveal">
      {children}
    </div>
  );
}



