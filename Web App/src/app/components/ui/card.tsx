// src/components/ui/card.tsx
import React from 'react'

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-lg shadow-md p-4 bg-white ${className}`}>{children}</div>
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="mb-2">{children}</div>
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-lg font-bold ${className}`}>{children}</h3>
}

export function CardDescription({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-600">{children}</p>
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
