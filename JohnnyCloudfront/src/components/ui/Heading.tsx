import React from 'react'

interface HeadingProps {
  children: React.ReactNode
  className?: string
}

export function Heading({ children, className = '' }: HeadingProps) {
  return (
    <h1 className={`jc-title-gradient ${className}`}>
      {children}
    </h1>
  )
}
