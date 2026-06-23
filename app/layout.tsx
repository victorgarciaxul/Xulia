import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'XULIA — Plataforma Corporativa de IA',
  description: 'Plataforma corporativa de inteligencia artificial',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className={`${inter.className} h-full bg-[#0f0f13] text-slate-200 antialiased`}>
        {children}
      </body>
    </html>
  )
}
