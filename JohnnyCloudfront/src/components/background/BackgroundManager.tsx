import { useRef, useEffect, useCallback } from "react";
import "./BackgroundManager.css";

interface RadarPulse {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  color: string;
  isAnomaly: boolean;
  speed: number;
}

interface DetectionBlip {
  id: number;
  x: number;
  y: number;
  opacity: number;
  maxOpacity: number;
  color: string;
  isAnomaly: boolean;
  age: number;
  maxAge: number;
  size: number;
}

export default function BackgroundManager() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const pulsesRef = useRef<RadarPulse[]>([]);
  const blipsRef = useRef<DetectionBlip[]>([]);
  // const lastPulseTimeRef = useRef<number>(0); // Unused
  const lastBlipTimeRef = useRef<number>(0);
  const pulseIdRef = useRef<number>(0);
  const blipIdRef = useRef<number>(0);
  const sweepAngleRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  // Enhanced color palette for radar theme - much more vibrant and visible
  const normalColors = [
    'rgba(6, 182, 212, 1.0)',    // Bright Teal - full opacity
    'rgba(59, 130, 246, 1.0)',   // Bright Blue - full opacity
    'rgba(16, 185, 129, 1.0)',   // Bright Green - full opacity
  ];

  const anomalyColors = [
    'rgba(239, 68, 68, 1.0)',    // Bright Red - full opacity
    'rgba(245, 158, 11, 1.0)',   // Bright Orange - full opacity
  ];

  // const healthyColors = [
  //   'rgba(34, 197, 94, 1.0)',    // Bright Green - full opacity
  // ]; // Unused

  const createPulse = useCallback((x: number, y: number, isAnomaly: boolean = false): RadarPulse => {
    const colors = isAnomaly ? anomalyColors : normalColors;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
        return {
          id: pulseIdRef.current++,
          x,
          y,
          radius: 0,
          maxRadius: Math.random() * 150 + 200, // 200-350px max radius
          opacity: isAnomaly ? 1.0 : 0.9, // Even higher opacity for better visibility
          color,
          isAnomaly,
          speed: isAnomaly ? 0.8 : 0.5, // Anomalies move slightly faster
        };
  }, []);

  const createBlip = useCallback((x: number, y: number, isAnomaly: boolean = false): DetectionBlip => {
    const colors = isAnomaly ? anomalyColors : normalColors;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
        return {
          id: blipIdRef.current++,
          x,
          y,
          opacity: 0,
          maxOpacity: 1.0, // Full opacity for all blips
          color,
          isAnomaly,
          age: 0,
          maxAge: 2000, // 2 seconds
          size: isAnomaly ? 12 : 10, // Even larger blips for better visibility
        };
  }, []);

  const drawPulse = useCallback((ctx: CanvasRenderingContext2D, pulse: RadarPulse) => {
    const progress = pulse.radius / pulse.maxRadius;
    const currentOpacity = pulse.opacity * (1 - progress);
    
    if (currentOpacity <= 0) return;

    ctx.save();
    ctx.globalAlpha = currentOpacity;
    
    // Draw main ring
    ctx.strokeStyle = pulse.color;
    ctx.lineWidth = pulse.isAnomaly ? 3 : 2;
    ctx.beginPath();
    ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
    ctx.stroke();

    // Add inner glow for anomalies
    if (pulse.isAnomaly) {
      ctx.globalAlpha = currentOpacity * 0.3;
      ctx.strokeStyle = pulse.color;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Add subtle inner ring
    ctx.globalAlpha = currentOpacity * 0.4;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(pulse.x, pulse.y, pulse.radius * 0.7, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }, []);

  const drawBlip = useCallback((ctx: CanvasRenderingContext2D, blip: DetectionBlip) => {
    const progress = blip.age / blip.maxAge;
    const currentOpacity = blip.opacity * (1 - progress);
    
    if (currentOpacity <= 0) return;

    ctx.save();
    ctx.globalAlpha = currentOpacity;
    
    // Draw main blip with glow
    ctx.shadowColor = blip.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = blip.color;
    ctx.beginPath();
    ctx.arc(blip.x, blip.y, blip.size, 0, Math.PI * 2);
    ctx.fill();

        // Add stronger glow for anomalies
        if (blip.isAnomaly) {
          ctx.shadowBlur = 30;
          ctx.globalAlpha = currentOpacity * 0.8;
          ctx.fillStyle = blip.color;
          ctx.beginPath();
          ctx.arc(blip.x, blip.y, blip.size * 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Add stronger glow for normal blips
          ctx.shadowBlur = 25;
          ctx.globalAlpha = currentOpacity * 0.6;
          ctx.fillStyle = blip.color;
          ctx.beginPath();
          ctx.arc(blip.x, blip.y, blip.size * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }

    ctx.restore();
  }, []);

  const drawRadarSweep = useCallback((ctx: CanvasRenderingContext2D, centerX: number, centerY: number, maxRadius: number) => {
    ctx.save();
    
        // Create gradient for sweep - much more visible
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
        gradient.addColorStop(0, 'rgba(6, 182, 212, 0.8)');
        gradient.addColorStop(0.2, 'rgba(6, 182, 212, 0.6)');
        gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.4)');
        gradient.addColorStop(1, 'rgba(6, 182, 212, 0.2)');
    
    // Draw sweep arc
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, maxRadius, sweepAngleRef.current - 0.2, sweepAngleRef.current + 0.2);
    ctx.closePath();
    ctx.fill();
    
        // Draw sweep line with stronger glow
        ctx.strokeStyle = 'rgba(6, 182, 212, 1.0)';
        ctx.lineWidth = 5;
        ctx.shadowColor = 'rgba(6, 182, 212, 1.0)';
        ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.cos(sweepAngleRef.current) * maxRadius,
      centerY + Math.sin(sweepAngleRef.current) * maxRadius
    );
    ctx.stroke();
    
        // Draw center dot - more visible
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(6, 182, 212, 1.0)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
        ctx.fill();
    
    ctx.restore();
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2;
    
    // Clear canvas with deep navy background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
    gradient.addColorStop(0, 'rgba(15, 23, 42, 0.2)');
    gradient.addColorStop(1, 'rgba(8, 12, 20, 0.4)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

        // Draw radar grid - much more visible
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
        ctx.lineWidth = 2;
        
        // Concentric circles
        for (let r = 50; r < maxRadius; r += 50) {
          ctx.beginPath();
          ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        // Grid lines - much more visible
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
        ctx.lineWidth = 1.5;
    
    for (let x = 0; x < width; x += 100) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y < height; y += 100) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Update radar sweep (one rotation every 12 seconds)
    const elapsed = Date.now() - startTimeRef.current;
    sweepAngleRef.current = (elapsed / 12000) * Math.PI * 2;

    // Draw radar sweep
    drawRadarSweep(ctx, centerX, centerY, maxRadius);

    const currentTime = Date.now();

    // Create new blips (every 3-6 seconds for more activity)
    if (currentTime - lastBlipTimeRef.current > (Math.random() * 3000 + 3000)) {
      const isAnomaly = Math.random() < 0.25; // 25% chance of anomaly
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * (maxRadius * 0.8);
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      const blip = createBlip(x, y, isAnomaly);
      blipsRef.current.push(blip);
      
      // Create pulse ring from blip location
      pulsesRef.current.push(createPulse(x, y, isAnomaly));
      
      lastBlipTimeRef.current = currentTime;
    }

    // Update and draw blips
    blipsRef.current = blipsRef.current.filter(blip => {
      blip.age += 16; // ~60fps
      blip.opacity = blip.maxOpacity * (1 - blip.age / blip.maxAge);
      drawBlip(ctx, blip);
      return blip.age < blip.maxAge;
    });

    // Update and draw pulses
    pulsesRef.current = pulsesRef.current.filter(pulse => {
      pulse.radius += pulse.speed;
      drawPulse(ctx, pulse);
      return pulse.radius < pulse.maxRadius;
    });

    animationRef.current = requestAnimationFrame(animate);
  }, [createPulse, createBlip, drawPulse, drawBlip, drawRadarSweep]);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }, []);

  useEffect(() => {
    resizeCanvas();
    animate();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, resizeCanvas]);

  return (
    <div className="cost-radar-container">
      <canvas
        ref={canvasRef}
        className="cost-radar-canvas"
        aria-hidden="true"
      />
    </div>
  );
}
