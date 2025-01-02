import React from 'react';

export const Table = ({ children }: { children: React.ReactNode }) => (
  <table className="min-w-full">{children}</table>
);

export const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody>{children}</tbody>
);

export const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="px-4 py-2 border">{children}</td>
);

export const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th className="px-4 py-2 border text-left">{children}</th>
);

export const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-gray-100">{children}</thead>
);

export const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr>{children}</tr>
);
