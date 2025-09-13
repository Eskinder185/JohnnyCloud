import React from 'react';

interface RetroRobotProps {
  className?: string;
}

export default function RetroRobot({ className = "" }: RetroRobotProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Robot SVG - Retro-futuristic design with binocular eyes and workshop aesthetic */}
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Robot Base/Treads */}
        <rect x="40" y="160" width="120" height="25" rx="12" fill="#2a2a2a" stroke="#444" strokeWidth="1"/>
        <rect x="45" y="165" width="110" height="15" rx="7" fill="#1a1a1a"/>
        
        {/* Tread segments */}
        <rect x="50" y="168" width="8" height="9" fill="#333"/>
        <rect x="62" y="168" width="8" height="9" fill="#333"/>
        <rect x="74" y="168" width="8" height="9" fill="#333"/>
        <rect x="86" y="168" width="8" height="9" fill="#333"/>
        <rect x="98" y="168" width="8" height="9" fill="#333"/>
        <rect x="110" y="168" width="8" height="9" fill="#333"/>
        <rect x="122" y="168" width="8" height="9" fill="#333"/>
        <rect x="134" y="168" width="8" height="9" fill="#333"/>
        
        {/* Robot Torso */}
        <rect x="60" y="100" width="80" height="60" rx="8" fill="#3a3a3a" stroke="#555" strokeWidth="1"/>
        
        {/* Exposed chest panel */}
        <rect x="70" y="110" width="60" height="40" rx="4" fill="#1a1a1a" stroke="#666" strokeWidth="1"/>
        
        {/* Internal wiring and components */}
        <rect x="75" y="115" width="50" height="3" fill="#ff4444"/>
        <rect x="75" y="120" width="45" height="2" fill="#ff4444"/>
        <rect x="75" y="125" width="40" height="2" fill="#ff4444"/>
        <rect x="75" y="130" width="35" height="2" fill="#ff4444"/>
        
        {/* Circuit board */}
        <rect x="80" y="135" width="30" height="10" fill="#2a2a2a" stroke="#444" strokeWidth="1"/>
        <circle cx="85" cy="140" r="1" fill="#00ff00"/>
        <circle cx="90" cy="140" r="1" fill="#00ff00"/>
        <circle cx="95" cy="140" r="1" fill="#00ff00"/>
        <circle cx="100" cy="140" r="1" fill="#00ff00"/>
        
        {/* Warning symbol */}
        <polygon points="90,145 95,150 85,150" fill="#ffaa00"/>
        <text x="90" y="148" textAnchor="middle" fontSize="4" fill="#000" fontWeight="bold">!</text>
        
        {/* Robot Head */}
        <rect x="70" y="60" width="60" height="40" rx="6" fill="#4a4a4a" stroke="#666" strokeWidth="1"/>
        
        {/* Binocular Eyes */}
        <circle cx="85" cy="80" r="12" fill="#1a1a1a" stroke="#888" strokeWidth="2"/>
        <circle cx="115" cy="80" r="12" fill="#1a1a1a" stroke="#888" strokeWidth="2"/>
        
        {/* Eye lenses with concentric rings */}
        <circle cx="85" cy="80" r="8" fill="#2a2a2a" stroke="#aaa" strokeWidth="1"/>
        <circle cx="115" cy="80" r="8" fill="#2a2a2a" stroke="#aaa" strokeWidth="1"/>
        <circle cx="85" cy="80" r="5" fill="#1a1a1a"/>
        <circle cx="115" cy="80" r="5" fill="#1a1a1a"/>
        <circle cx="85" cy="80" r="2" fill="#00aaff"/>
        <circle cx="115" cy="80" r="2" fill="#00aaff"/>
        
        {/* Eye highlights */}
        <circle cx="87" cy="78" r="1" fill="#ffffff" opacity="0.8"/>
        <circle cx="117" cy="78" r="1" fill="#ffffff" opacity="0.8"/>
        
        {/* Head plate */}
        <rect x="75" y="65" width="50" height="8" rx="2" fill="#555"/>
        
        {/* Neck joint */}
        <rect x="95" y="100" width="10" height="8" rx="2" fill="#ff6600"/>
        
        {/* Arms */}
        <rect x="50" y="110" width="15" height="40" rx="7" fill="#3a3a3a" stroke="#555" strokeWidth="1"/>
        <rect x="135" y="110" width="15" height="40" rx="7" fill="#3a3a3a" stroke="#555" strokeWidth="1"/>
        
        {/* Arm joints */}
        <circle cx="57" cy="120" r="3" fill="#666"/>
        <circle cx="143" cy="120" r="3" fill="#666"/>
        <circle cx="57" cy="135" r="3" fill="#666"/>
        <circle cx="143" cy="135" r="3" fill="#666"/>
        
        {/* Hands/Claws */}
        <g transform="translate(45, 145)">
          <rect x="0" y="0" width="10" height="8" rx="2" fill="#4a4a4a"/>
          <rect x="2" y="2" width="2" height="6" fill="#666"/>
          <rect x="4" y="2" width="2" height="6" fill="#666"/>
          <rect x="6" y="2" width="2" height="6" fill="#666"/>
        </g>
        
        <g transform="translate(145, 145)">
          <rect x="0" y="0" width="10" height="8" rx="2" fill="#4a4a4a"/>
          <rect x="2" y="2" width="2" height="6" fill="#666"/>
          <rect x="4" y="2" width="2" height="6" fill="#666"/>
          <rect x="6" y="2" width="2" height="6" fill="#666"/>
        </g>
        
        {/* Workshop lighting effect */}
        <defs>
          <radialGradient id="workshopLight" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffaa44" stopOpacity="0.3"/>
            <stop offset="70%" stopColor="#ff6600" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <ellipse cx="100" cy="100" rx="80" ry="60" fill="url(#workshopLight)"/>
      </svg>
    </div>
  );
}
