import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'default' | 'outline'
}

export function Button({ 
  children, 
  onClick, 
  disabled = false, 
  className = '',
  type = 'button',
  variant = 'default'
}: ButtonProps) {
  const baseClass = variant === 'outline' ? 'jc-btn-outline' : 'jc-btn';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  )
}
