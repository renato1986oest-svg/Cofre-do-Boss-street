import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BOSS Of The Boyz Records — Cofre de Beats',
  description: 'Plataforma de armazenamento e composição exclusiva.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className="dark">
      <body suppressHydrationWarning className="bg-[#050505] text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
