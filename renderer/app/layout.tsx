import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
    title: 'TodoList',
    description: 'This is TodoList',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className="h-screen w-screen overflow-y-hidden overscroll-y-none">
                {children}
            </body>
        </html>
    )
}
