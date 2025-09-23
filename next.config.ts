import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.md/,
            type: "asset/source",
        });
        return config;
    },
    turbopack: {
        rules: {
            "*.md": {
                loaders: ["raw-loader"],
                as: "*.js",
            },
        },
    },
    experimental: {
        turbopackScopeHoisting: false,
    },
    rewrites() {
        return new Promise((resolve) => {
            resolve([
                {
                    source: "/login(.*)",
                    destination: "/login",
                },
                {
                    source: "/api/:path*",
                    destination: "/api/:path*",
                },
                {
                    source: "/((?!api).*)",
                    destination: "/",
                },
            ]);
        });
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "vercel.com",
                port: "",
                pathname: "/api/www/avatar/**",
            },
        ],
        dangerouslyAllowSVG: true,
        contentDispositionType: "attachment",
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
};

export default nextConfig;
