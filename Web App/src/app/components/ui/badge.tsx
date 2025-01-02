import React from 'react';

export const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-block px-3 py-1 rounded-md text-sm ${className}`}>{children}</span>
);
