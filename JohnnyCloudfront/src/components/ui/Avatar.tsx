import { useState } from 'react';

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Avatar({ name, imageUrl, size = 'md', className = '' }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  const initials = name
    .split(' ')
    .map(s => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-12 w-12 text-sm',
    lg: 'h-16 w-16 text-base'
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className={`relative shrink-0 ${className}`}>
      {imageUrl && !imageError ? (
        <img
          src={imageUrl}
          alt={`Headshot of ${name}`}
          className={`${sizeClasses[size]} rounded-full object-cover border border-white/20`}
          onError={handleImageError}
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full grid place-items-center border border-white/20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20`}>
          <span className="text-white font-medium">{initials}</span>
        </div>
      )}
    </div>
  );
}



