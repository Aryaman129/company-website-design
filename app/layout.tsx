"use client"

import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '../src/contexts/AuthContext'
import { Toaster } from 'react-hot-toast'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1f2937",
                color: "#fff",
                border: "1px solid #D4AF37",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
