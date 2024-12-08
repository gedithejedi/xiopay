import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import dynamic from 'next/dynamic'
import { Toaster } from 'react-hot-toast'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'XioPay - easy cryto donations',
  description: 'XioPay is a platform for easy crypto donations',
}

const DynamicContextProvider = dynamic(
  () =>
    import('@/components/authentication').then(
      (mod) => mod.AuthContextProvider
    ),
  { ssr: true }
)

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster
          position="top-center"
          toastOptions={{
            style: { maxWidth: 425, zIndex: 9999 },
          }}
        />
        <DynamicContextProvider>{children}</DynamicContextProvider>
      </body>
    </html>
  )
}
