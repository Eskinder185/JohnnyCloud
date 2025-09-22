import { useEffect, useRef, useState } from "react";

type Signal = {
  costLevel: "none" | "low" | "high";
  securityLevel: "none" | "low" | "high";
};

function pickColor(sig: Signal, time: number) {
  // Professional security/cloud developer theme
  // Base colors: Deep navy and electric blue for professional cloud feel
  let c1 = [15, 23, 42];     // slate-900 - deep professional navy
  let c2 = [30, 64, 175];    // blue-700 - electric cloud blue
  
  // Add subtle pulsing effect
  const pulse = 0.08 * Math.sin(time * 0.008);
  
  // Security-focused color scheme
  if (sig.costLevel === "high") {
    c2 = [34, 197, 94];      // emerald-500 - success green for cost optimization
    c2 = c2.map(c => Math.min(255, c + pulse * 15));
  } else if (sig.costLevel === "low") {
    c2 = [59, 130, 246];     // blue-500 - informational blue
    c2 = c2.map(c => Math.min(255, c + pulse * 8));
  }

  if (sig.securityLevel === "high") {
    c1 = [220, 38, 127];     // rose-600 - security alert red
    c1 = c1.map(c => Math.min(255, c + pulse * 12));
  } else if (sig.securityLevel === "low") {
    c1 = [245, 158, 11];     // amber-500 - warning amber
    c1 = c1.map(c => Math.min(255, c + pulse * 6));
  }

  return { c1, c2 };
}

export default function BackgroundManager({ signal }: { signal: Signal }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dpr, setDpr] = useState<number>(Math.min(window.devicePixelRatio || 1, 2));

  // Debug logging for security/cloud background
  useEffect(() => {
    console.log('🔒 Security/Cloud Background signal updated:', signal);
    console.log('☁️ Background canvas ref:', canvasRef.current);
  }, [signal]);

  // Temporary visual test - force a signal to confirm canvas renders
  // Remove this after confirming the background works
  useEffect(() => {
    const testSignal = { costLevel: "high" as const, securityLevel: "low" as const };
    console.log('🔒 Testing security/cloud background with signal:', testSignal);
    // Temporarily force a test signal to ensure background is visible
    // setSignal(testSignal);
  }, []);

  useEffect(() => {
    const cnv = canvasRef.current;
    if (!cnv) return;
    
    const ctx = cnv.getContext("2d", { alpha: true });
    if (!ctx) return;
    
    let raf = 0;
    let isVisible = true;

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      // Set canvas internal resolution
      cnv.width = Math.floor(w * dpr);
      cnv.height = Math.floor(h * dpr);
      // Set canvas display size
      cnv.style.width = `${w}px`;
      cnv.style.height = `${h}px`;
      // Scale context for high DPI
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      console.log('🌊 Canvas resized:', { 
        viewport: { w, h }, 
        canvas: { width: cnv.width, height: cnv.height },
        style: { width: cnv.style.width, height: cnv.style.height }
      });
    };

    resize();
    window.addEventListener("resize", resize);
    
    // Handle visibility change for performance
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Force resize after a short delay to ensure proper sizing
    const forceResize = setTimeout(() => {
      resize();
    }, 100);

    // animated aurora + grid
    let t = 0;
    const draw = () => {
      const w = cnv.width / dpr, h = cnv.height / dpr;
      const { c1, c2 } = pickColor(signal, t);

      // Professional dark background
      ctx.fillStyle = "rgba(15, 23, 42, 0.4)";
      ctx.fillRect(0, 0, w, h);

      // Security/Cloud developer grid pattern
      ctx.save();
      const grid = 50; // Slightly larger grid for professional look
      const gridOffset = (t * 0.15) % grid; // Slower movement
      
      // Main grid lines - subtle and professional
      ctx.globalAlpha = 0.06;
      ctx.strokeStyle = "#475569"; // slate-600 - professional gray
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      for (let x = -gridOffset; x <= w + grid; x += grid) { 
        ctx.moveTo(x, 0); 
        ctx.lineTo(x, h); 
      }
      for (let y = -gridOffset; y <= h + grid; y += grid) { 
        ctx.moveTo(0, y); 
        ctx.lineTo(w, y); 
      }
      ctx.stroke();
      
      // Security-focused highlight lines
      ctx.globalAlpha = 0.12;
      ctx.strokeStyle = "#3b82f6"; // blue-500 - cloud blue
      ctx.lineWidth = 1;
      ctx.beginPath();
      const highlightOffset = (t * 0.3) % (grid * 3);
      for (let x = highlightOffset; x <= w; x += grid * 3) { 
        ctx.moveTo(x, 0); 
        ctx.lineTo(x, h); 
      }
      for (let y = highlightOffset; y <= h; y += grid * 3) { 
        ctx.moveTo(0, y); 
        ctx.lineTo(w, y); 
      }
      ctx.stroke();
      
      // Add subtle security scan lines
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = "#10b981"; // emerald-500 - security green
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      const scanOffset = (t * 0.4) % (grid * 6);
      for (let x = scanOffset; x <= w; x += grid * 6) { 
        ctx.moveTo(x, 0); 
        ctx.lineTo(x, h); 
      }
      ctx.stroke();
      ctx.restore();

      // Enhanced aurora waves with multiple layers
      const wave = (yOff: number, amp: number, speed: number, color: number[], opacity: number = 1) => {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const y = h * 0.55 + Math.sin((x + t * speed) * 0.008) * amp
                    + Math.sin((x * 0.012 + t * speed * 0.6)) * (amp * 0.6)
                    + Math.sin((x * 0.005 + t * speed * 0.3)) * (amp * 0.3)
                    + yOff;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        const g = ctx.createLinearGradient(0, h * 0.2, 0, h);
        const [r, gC, b] = color;
        g.addColorStop(0, `rgba(${r},${gC},${b},${0.15 * opacity})`);
        g.addColorStop(0.5, `rgba(${r},${gC},${b},${0.08 * opacity})`);
        g.addColorStop(1, `rgba(${r},${gC},${b},0.00)`);
        ctx.strokeStyle = `rgba(${r},${gC},${b},${0.4 * opacity})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = g;
        ctx.fill();
      };

      // Professional security/cloud wave layers
      wave(0, 20, 0.7, c1, 0.8);    // Primary security layer
      wave(-25, 28, 0.9, c2, 0.6);  // Cloud infrastructure layer
      wave(-45, 15, 0.5, c1, 0.4);  // Subtle security monitoring
      wave(15, 22, 1.1, c2, 0.5);   // Data flow layer

      // Professional security/cloud data points
      ctx.save();
      ctx.globalAlpha = 0.4;
      for (let i = 0; i < 12; i++) {
        const x = (i * 156.78 + t * 0.3) % w;
        const y = (i * 89.12 + t * 0.2) % h;
        const size = 0.8 + Math.sin(t * 0.08 + i) * 0.3;
        const [r, gC, b] = i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : [100, 116, 139]; // slate-500 for neutral points
        ctx.fillStyle = `rgba(${r},${gC},${b},0.7)`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add subtle glow for security monitoring points
        if (i % 4 === 0) {
          ctx.shadowColor = `rgba(${r},${gC},${b},0.3)`;
          ctx.shadowBlur = 4;
          ctx.beginPath();
          ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      ctx.restore();

      t += isVisible ? 1.2 : 0.3; // Slow down animation when tab is hidden
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(forceResize);
    };
  }, [signal, dpr]);

  useEffect(() => {
    const onDpr = () => setDpr(Math.min(window.devicePixelRatio || 1, 2));
    window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`).addEventListener?.("change", onDpr);
    return () => window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`).removeEventListener?.("change", onDpr);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="global-bg--animated"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        background: "radial-gradient(1400px 700px at 75% 10%, rgba(15,23,42,0.7), transparent 65%), radial-gradient(1000px 600px at 15% 85%, rgba(30,64,175,0.4), transparent 60%), linear-gradient(135deg, rgba(15,23,42,0.3) 0%, rgba(30,64,175,0.1) 100%)"
      }}
      aria-hidden="true"
    />
  );
}
