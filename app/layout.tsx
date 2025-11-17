"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono, Mozilla_Headline } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const mozillaHeadline = Mozilla_Headline({
    variable: "--font-mozilla-headline",
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
                {process.env.NODE_ENV === "development" && (
                    <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
                )}
                <title>Karnet - your magical notebook</title>
                <meta content="Karnet is your magical notebook" name="description" />
                <meta content="width=device-width, initial-scale=1" name="viewport" />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} ${mozillaHeadline.variable} antialiased`}>
                {children}
                <SpeedInsights />
                <Analytics />
            </body>
        </html>
    );
}
