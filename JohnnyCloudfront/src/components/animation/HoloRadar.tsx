import React from "react";
export default function HoloRadar({ className = "" }: { className?: string }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const animRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const cvs = canvasRef.current!;
    const ctx = cvs.getContext("2d")!;
    let w = (cvs.width = cvs.offsetWidth * devicePixelRatio);
    let h = (cvs.height = cvs.offsetHeight * devicePixelRatio);

    const onResize = () => {
      w = cvs.width = cvs.offsetWidth * devicePixelRatio;
      h = cvs.height = cvs.offsetHeight * devicePixelRatio;
    };
    const pings: { x: number; y: number; r: number; life: number }[] = [];
    let ang = 0, last = 0;

    function spawnPing(){
      const rr = Math.min(w, h) * 0.42;
      const a = Math.random() * Math.PI * 2;
      const r = rr * Math.sqrt(Math.random());
      const cx = w/2 + Math.cos(a)*r;
      const cy = h*0.6 + Math.sin(a)*r;
      pings.push({ x: cx, y: cy, r: 6 * devicePixelRatio, life: 1 });
    }

    function frame(ts: number){
      animRef.current = requestAnimationFrame(frame);
      const dt = (ts - last) / 1000; last = ts;
      ang += dt * 0.6;
      if (Math.random() < 0.05) spawnPing();

      ctx.clearRect(0,0,w,h);
      // grid
      ctx.fillStyle = "rgba(0,230,255,0.05)";
      for(let x=0; x<w; x+= 24*devicePixelRatio) ctx.fillRect(x,0,1*devicePixelRatio,h);
      for(let y=0; y<h; y+= 24*devicePixelRatio) ctx.fillRect(0,y,w,1*devicePixelRatio);

      // rings
      const cx = w/2, cy = h*0.6, maxR = Math.min(w,h)*0.42;
      for(let r=maxR; r>maxR*0.2; r-= maxR/6){
        ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
        ctx.strokeStyle = "rgba(0,230,255,0.12)"; ctx.lineWidth = 2*devicePixelRatio; ctx.stroke();
      }

      // sweep
      const grad = ctx.createConicGradient(ang, cx, cy);
      grad.addColorStop(0,   "rgba(0,230,255,0.24)");
      grad.addColorStop(0.35,"rgba(0,230,255,0)");
      grad.addColorStop(1,   "rgba(0,230,255,0)");
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.moveTo(cx,cy);
      ctx.arc(cx,cy,maxR, ang, ang + Math.PI*0.6);
      ctx.closePath(); ctx.fill();

      // pings
      for(let i=pings.length-1;i>=0;i--){
        const p = pings[i];
        p.life -= dt * 0.3;
        if (p.life <= 0) { pings.splice(i,1); continue; }
        const a = Math.max(p.life,0);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r*(1.2 - p.life*0.2), 0, Math.PI*2);
        ctx.strokeStyle = `rgba(0,230,255,${0.6*a})`; ctx.lineWidth = 2*devicePixelRatio; ctx.stroke();
        ctx.fillStyle = `rgba(124,255,178,${0.25*a})`;
        ctx.beginPath(); ctx.arc(p.x,p.y,2*devicePixelRatio,0,Math.PI*2); ctx.fill();
      }
    }
    animRef.current = requestAnimationFrame(frame);
    window.addEventListener("resize", onResize);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasRef} className={`w-full h-full ${className}`} />;
}
