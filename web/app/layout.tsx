import Layout from "@/components/Layout"
import TanstackProvider from "@/providers/TanStackQuery"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "CineFriends | Discover & ShareAmazing Films",
  description:
    "Join our community of movie lovers. Share your favorite films, discover hidden gems, and connect with people who share your taste in cinema.",
}

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
        <TanstackProvider>
          <Layout>{children}</Layout>
        </TanstackProvider>
      </body>
    </html>
  )
}
