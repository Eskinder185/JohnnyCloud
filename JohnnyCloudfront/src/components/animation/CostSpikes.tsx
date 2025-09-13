import React from "react";
export default function CostSpikes({ className = "" }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const animRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const cvs = canvasRef.current!; const ctx = cvs.getContext("2d")!;
    let w = (cvs.width = cvs.offsetWidth * devicePixelRatio);
    let h = (cvs.height = cvs.offsetHeight * devicePixelRatio);
    const onResize = () => { w = cvs.width = cvs.offsetWidth * devicePixelRatio; h = cvs.height = cvs.offsetHeight * devicePixelRatio; };

    const bars = new Array(48).fill(0).map(() => Math.random());
    function frame(){
      animRef.current = requestAnimationFrame(frame);
      for (let i=0;i<bars.length;i++){
        let v = bars[i] + (Math.random()-0.5)*0.04;
        if (Math.random()<0.02) v += Math.random()*0.9; // anomaly spike
        bars[i] = Math.max(0, Math.min(1.4, v*0.96));
      }
      ctx.clearRect(0,0,w,h);
      const bw = w / bars.length;
      for (let i=0;i<bars.length;i++){
        const v = bars[i]; const bh = v*h*0.8; const x = i*bw; const y = h - bh;
        const grd = ctx.createLinearGradient(0,y,0,h);
        grd.addColorStop(0, "rgba(227,255,91,0.9)");
        grd.addColorStop(1, "rgba(0,230,255,0.2)");
        ctx.fillStyle = grd;
        ctx.fillRect(x+bw*0.15, y, bw*0.7, bh);
        if (v>1){ ctx.fillStyle = "rgba(236,93,254,0.7)"; ctx.fillRect(x+bw*0.3, y-6*devicePixelRatio, bw*0.4, 6*devicePixelRatio); }
      }
    }
    animRef.current = requestAnimationFrame(frame);
    window.addEventListener("resize", onResize);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />;
}
