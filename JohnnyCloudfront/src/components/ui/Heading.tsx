import React from 'react'

interface HeadingProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export function Heading({ children, className = '', style }: HeadingProps) {
  return (
    <h1 className={`jc-title-gradient ${className}`} style={style}>
      {children}
    </h1>
  )
}
