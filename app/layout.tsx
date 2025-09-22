"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Root } from "@/router/root";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
                {/* rest of your scripts go under */}
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                {typeof window === "undefined" ? null : <Root>{children}</Root>}
            </body>
        </html>
    );
}
