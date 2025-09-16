import { useState } from "react";
import { motion } from "framer-motion";

export default function JohnnyBot({ className = "" }: { className?: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={`relative ${className}`}>
      {/* Animated background glow with pulsing effect */}
      <motion.div 
        className="absolute -inset-8 rounded-3xl"
        animate={{
          background: [
            "radial-gradient(200px 140px at 50% 60%, rgba(0,230,255,.18), transparent 60%)",
            "radial-gradient(250px 160px at 50% 60%, rgba(0,230,255,.25), transparent 60%)",
            "radial-gradient(200px 140px at 50% 60%, rgba(0,230,255,.18), transparent 60%)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Floating particles around the robot */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-60"
          style={{
            left: `${20 + (i * 15)}%`,
            top: `${30 + (i % 3) * 20}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            x: [-5, 5, -5],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
        />
      ))}
      
      {/* Main Robot Container */}
      <motion.div 
        className="relative z-10 w-48 h-48 mx-auto cursor-pointer"
        initial={{ y: 0, scale: 1 }} 
        animate={{ 
          y: [-3, 3, -3],
          rotate: isHovered ? [0, 2, -2, 0] : 0,
          scale: isHovered ? 1.05 : 1
        }} 
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: "easeInOut",
          rotate: { duration: 0.5 }
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Cartoon Johnny-5 Robot SVG */}
        <motion.div
          className="w-full h-full flex items-center justify-center"
          animate={{
            filter: [
              'brightness(1) saturate(1)',
              'brightness(1.05) saturate(1.1)',
              'brightness(1) saturate(1)'
            ]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.svg
            width="180"
            height="180"
            viewBox="0 0 180 180"
            className="drop-shadow-2xl"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <defs>
              <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00E6FF" />
                <stop offset="50%" stopColor="#0EA5E9" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E293B" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
              <linearGradient id="eyeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7CFFB2" />
                <stop offset="100%" stopColor="#00E6FF" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Main Body */}
            <motion.rect
              x="30"
              y="80"
              width="120"
              height="80"
              rx="15"
              ry="15"
              fill="url(#bodyGradient)"
              stroke="#00E6FF"
              strokeWidth="2"
              filter="url(#glow)"
              animate={{ 
                fill: [
                  "url(#bodyGradient)",
                  "#00E6FF",
                  "url(#bodyGradient)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Head */}
            <motion.rect
              x="50"
              y="20"
              width="80"
              height="60"
              rx="12"
              ry="12"
              fill="url(#headGradient)"
              stroke="#00E6FF"
              strokeWidth="2"
              animate={{ 
                rotate: [-1, 1, -1],
                y: [20, 18, 20]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            
            {/* Antenna */}
            <motion.line
              x1="90"
              y1="20"
              x2="90"
              y2="10"
              stroke="#EC5DFE"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <motion.circle
              cx="90"
              cy="8"
              r="4"
              fill="#EC5DFE"
              animate={{ 
                scale: [1, 1.3, 1],
                opacity: [1, 0.7, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            
            {/* Eyes */}
            <motion.ellipse
              cx="65"
              cy="45"
              rx="8"
              ry="12"
              fill="url(#eyeGradient)"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <motion.ellipse
              cx="115"
              cy="45"
              rx="8"
              ry="12"
              fill="url(#eyeGradient)"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            
            {/* Eye highlights */}
            <circle cx="67" cy="42" r="3" fill="#FFFFFF" opacity="0.8" />
            <circle cx="117" cy="42" r="3" fill="#FFFFFF" opacity="0.8" />
            
            {/* Mouth */}
            <motion.path
              d="M75 60 Q90 68 105 60"
              stroke="#7CFFB2"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              animate={{ 
                strokeWidth: [3, 4, 3]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            
            {/* Arms */}
            <motion.rect
              x="15"
              y="90"
              width="20"
              height="50"
              rx="10"
              ry="10"
              fill="url(#bodyGradient)"
              stroke="#00E6FF"
              strokeWidth="2"
              animate={{ 
                rotate: [-5, 5, -5],
                x: [15, 17, 15]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <motion.rect
              x="145"
              y="90"
              width="20"
              height="50"
              rx="10"
              ry="10"
              fill="url(#bodyGradient)"
              stroke="#00E6FF"
              strokeWidth="2"
              animate={{ 
                rotate: [5, -5, 5],
                x: [145, 143, 145]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 2
              }}
            />
            
            {/* Hands */}
            <motion.ellipse
              cx="25"
              cy="135"
              rx="8"
              ry="12"
              fill="url(#headGradient)"
              stroke="#00E6FF"
              strokeWidth="2"
              animate={{ 
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            <motion.ellipse
              cx="155"
              cy="135"
              rx="8"
              ry="12"
              fill="url(#headGradient)"
              stroke="#00E6FF"
              strokeWidth="2"
              animate={{ 
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1
              }}
            />
            
            {/* Treads */}
            <motion.rect
              x="20"
              y="155"
              width="140"
              height="20"
              rx="10"
              ry="10"
              fill="#1E293B"
              stroke="#00E6FF"
              strokeWidth="2"
              animate={{ 
                y: [155, 153, 155]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
            
            {/* Tread details */}
            <rect x="25" y="158" width="8" height="14" rx="2" fill="#00E6FF" opacity="0.6" />
            <rect x="40" y="158" width="8" height="14" rx="2" fill="#00E6FF" opacity="0.6" />
            <rect x="55" y="158" width="8" height="14" rx="2" fill="#00E6FF" opacity="0.6" />
            <rect x="70" y="158" width="8" height="14" rx="2" fill="#00E6FF" opacity="0.6" />
            <rect x="85" y="158" width="8" height="14" rx="2" fill="#00E6FF" opacity="0.6" />
            <rect x="100" y="158" width="8" height="14" rx="2" fill="#00E6FF" opacity="0.6" />
            <rect x="115" y="158" width="8" height="14" rx="2" fill="#00E6FF" opacity="0.6" />
            <rect x="130" y="158" width="8" height="14" rx="2" fill="#00E6FF" opacity="0.6" />
            <rect x="145" y="158" width="8" height="14" rx="2" fill="#00E6FF" opacity="0.6" />
            
            {/* Body panels */}
            <rect x="45" y="90" width="15" height="20" rx="2" fill="#00E6FF" opacity="0.3" />
            <rect x="65" y="90" width="15" height="20" rx="2" fill="#00E6FF" opacity="0.3" />
            <rect x="100" y="90" width="15" height="20" rx="2" fill="#00E6FF" opacity="0.3" />
            <rect x="120" y="90" width="15" height="20" rx="2" fill="#00E6FF" opacity="0.3" />
            
            {/* Chest panel */}
            <rect x="70" y="105" width="40" height="25" rx="3" fill="#00E6FF" opacity="0.2" stroke="#00E6FF" strokeWidth="1" />
            <circle cx="90" cy="117" r="3" fill="#00E6FF" opacity="0.6" />
          </motion.svg>
        </motion.div>
        
        {/* Animated status indicator with enhanced effects */}
        <motion.div 
          className="absolute -top-3 -right-3 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-lg"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [1, 0.6, 1],
            boxShadow: [
              '0 0 10px rgba(34, 197, 94, 0.5)',
              '0 0 20px rgba(34, 197, 94, 0.8)',
              '0 0 10px rgba(34, 197, 94, 0.5)'
            ]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        
        {/* Pulsing ring around status indicator */}
        <motion.div
          className="absolute -top-3 -right-3 w-5 h-5 border-2 border-green-400 rounded-full"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.8, 0, 0.8]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
        
        {/* Enhanced scan line effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent rounded-2xl"
          animate={{ 
            y: ['-100%', '100%'],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "linear",
            repeatDelay: 3
          }}
        />
        
        {/* Secondary scan line */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/15 to-transparent rounded-2xl"
          animate={{ 
            y: ['-100%', '100%'],
            opacity: [0, 0.8, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "linear",
            repeatDelay: 1,
            delay: 2
          }}
        />
        
        {/* Rotating energy rings */}
        <motion.div
          className="absolute inset-0 border-2 border-cyan-400/30 rounded-2xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        
        <motion.div
          className="absolute inset-2 border border-green-400/20 rounded-xl"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Hover effect overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-cyan-400/10 to-green-400/5 rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Thinking animation dots */}
        {isHovered && (
          <motion.div 
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-cyan-400 rounded-full"
                animate={{
                  y: [0, -8, 0],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>
      
      {/* Ambient light effects */}
      <motion.div
        className="absolute -inset-4 bg-gradient-radial from-cyan-400/5 via-transparent to-transparent rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}