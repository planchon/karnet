import { ClerkProvider, SignedIn, SignedOut } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import { GeneralOutlet } from '@/router/outlet/general.outlet';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Karnet',
    description: 'Organize your life with AI',
};

export const revalidate = 3600;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider>
            <html lang="en">
                <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                    <SignedIn>
                        <GeneralOutlet>{children}</GeneralOutlet>
                    </SignedIn>
                    <SignedOut>{children}</SignedOut>
                </body>
            </html>
        </ClerkProvider>
    );
}
