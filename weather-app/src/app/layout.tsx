import type { Metadata } from 'next'
import { Inter, Teko } from 'next/font/google'
import './globals.css'

const teko = Teko({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Travel Buddy Finder',
  description: 'Created by noelr',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={teko.className}>{children}</body>
    </html>
  )
}
