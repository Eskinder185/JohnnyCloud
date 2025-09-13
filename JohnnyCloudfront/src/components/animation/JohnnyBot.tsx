import React from "react";
import { motion } from "framer-motion";

export default function JohnnyBot({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -inset-6 rounded-3xl" style={{
        background: "radial-gradient(200px 140px at 50% 60%, rgba(0,230,255,.18), transparent 60%)"
      }} />
      <motion.svg width="220" height="220" viewBox="0 0 220 220" className="relative z-10"
        initial={{ y: 0 }} animate={{ y: [-2, 2, -2] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
        <defs>
          <linearGradient id="gradBody" x1="0" x2="1">
            <stop offset="0%" stopColor="#00E6FF"/>
            <stop offset="100%" stopColor="#7CFFB2"/>
          </linearGradient>
        </defs>
        <rect x="40" y="70" rx="18" ry="18" width="140" height="100" fill="url(#gradBody)" opacity="0.2" stroke="#00E6FF" strokeOpacity="0.35" />
        <motion.rect x="70" y="30" width="80" height="50" rx="12" fill="#0B1220" stroke="#00E6FF" strokeOpacity=".6"
          animate={{ rotate: [-2,2,-2] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
        <line x1="110" y1="20" x2="110" y2="30" stroke="#EC5DFE" strokeWidth="3" />
        <motion.circle cx="110" cy="18" r="5" fill="#EC5DFE" animate={{ scale: [1,1.25,1] }} transition={{ duration: 1.6, repeat: Infinity }} />
        <motion.circle cx="92" cy="52" r="6" fill="#A6F7FF" animate={{ opacity: [1,0.2,1] }} transition={{ duration: 2.2, repeat: Infinity }} />
        <motion.circle cx="128" cy="52" r="6" fill="#A6F7FF" animate={{ opacity: [1,0.2,1] }} transition={{ delay: .4, duration: 2.2, repeat: Infinity }} />
        <path d="M90 60 Q110 72 130 60" stroke="#7CFFB2" strokeWidth="2" fill="none" />
        <motion.circle cx="85" cy="170" r="12" fill="#0B1220" stroke="#7CFFB2" strokeOpacity=".6"
          animate={{ rotate: [0,360] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
        <motion.circle cx="135" cy="170" r="12" fill="#0B1220" stroke="#7CFFB2" strokeOpacity=".6"
          animate={{ rotate: [0,360] }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
      </motion.svg>
    </div>
  );
}