import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import Sidebar from '@/_components/layout/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'todotasks',
  description: 'write down your todolist',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="container min-w-96 z-0 flex h-screen px-[21px] py-[22px]">
          <Sidebar />
          {children}
        </div>
      </body>
    </html>
  )
}
