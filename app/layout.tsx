'use client';

import { ClerkProvider, SignedIn, SignedOut } from '@clerk/react-router';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { BrowserRouter } from 'react-router';
import { GeneralAppRouter } from '@/router/router';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {typeof window === 'undefined' ? null : (
                    <BrowserRouter>
                        <ClerkProvider publishableKey={'pk_test_Y2FyaW5nLWVhZ2xlLTU1LmNsZXJrLmFjY291bnRzLmRldiQ'}>
                            <SignedIn>
                                <GeneralAppRouter />
                            </SignedIn>
                            <SignedOut>{children}</SignedOut>
                        </ClerkProvider>
                    </BrowserRouter>
                )}
            </body>
        </html>
    );
}
