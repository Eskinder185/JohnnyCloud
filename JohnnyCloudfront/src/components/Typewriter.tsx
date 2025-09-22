// src/components/Typewriter.tsx
import { useEffect, useState } from "react";

export default function Typewriter({
  text,
  speed = 22,
  className = "",
}: { text: string; speed?: number; className?: string }) {
  const [out, setOut] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <span className={className}>
      {out}
      <span className="caret" aria-hidden />
    </span>
  );
}



