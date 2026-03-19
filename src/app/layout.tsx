import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GeoIntel Dashboard | Intelligence & Analysis',
  description: 'Real-time geopolitical intelligence and military news dashboard',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%230a0a0c" width="100" height="100"/><circle cx="50" cy="50" r="35" stroke="%232563eb" stroke-width="3" fill="none"/><circle cx="50" cy="50" r="25" stroke="%23dc2626" stroke-width="2" fill="none"/><circle cx="50" cy="50" r="5" fill="%23e8e8ed"/></svg>',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
