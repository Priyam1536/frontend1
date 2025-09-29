import React from 'react';

const Logo = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16', 
    large: 'w-24 h-24'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>
        
        {/* Main crystal/ore shape */}
        <path 
          d="M20 30 L50 10 L80 30 L85 50 L80 70 L50 90 L20 70 L15 50 Z" 
          fill="url(#bgGradient)"
          opacity="0.9"
        />
        
        {/* Inner facets for 3D effect */}
        <path 
          d="M50 10 L80 30 L50 45 Z" 
          fill="#ffffff" 
          opacity="0.3"
        />
        <path 
          d="M20 30 L50 10 L50 45 Z" 
          fill="#ffffff" 
          opacity="0.2"
        />
        <path 
          d="M15 50 L20 70 L50 55 Z" 
          fill="#000000" 
          opacity="0.2"
        />
        
        {/* Leaf elements representing environmental aspect */}
        <path 
          d="M35 25 Q40 20 45 25 Q40 30 35 25" 
          fill="url(#leafGradient)"
        />
        <path 
          d="M55 65 Q60 60 65 65 Q60 70 55 65" 
          fill="url(#leafGradient)"
        />
        
        {/* Network nodes representing AI/connectivity */}
        <circle cx="30" cy="40" r="2" fill="url(#networkGradient)" />
        <circle cx="45" cy="35" r="2" fill="url(#networkGradient)" />
        <circle cx="60" cy="45" r="2" fill="url(#networkGradient)" />
        <circle cx="40" cy="55" r="2" fill="url(#networkGradient)" />
        <circle cx="65" cy="60" r="2" fill="url(#networkGradient)" />
        
        {/* Connection lines */}
        <line x1="30" y1="40" x2="45" y2="35" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.6" />
        <line x1="45" y1="35" x2="60" y2="45" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.6" />
        <line x1="60" y1="45" x2="65" y2="60" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.6" />
        <line x1="40" y1="55" x2="60" y2="45" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.6" />
        <line x1="30" y1="40" x2="40" y2="55" stroke="url(#networkGradient)" strokeWidth="1" opacity="0.6" />
        
        {/* Highlight for premium look */}
        <ellipse cx="45" cy="25" rx="8" ry="4" fill="#ffffff" opacity="0.4" />
      </svg>
    </div>
  );
};

export default Logo;