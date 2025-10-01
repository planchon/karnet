import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
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
  // @ts-expect-error
  rewrites() {
    return {
      beforeFiles: [
        // {
        //   source: "/api/account/:path*",
        //   destination: "/api/account/:path*",
        // },
        {
          source: "/api/:path*",
          destination: "/api/:path*",
        },
      ],
      afterFiles: [
        {
          source: "/login(.*)",
          destination: "/login",
        },
        {
          source: "/((?!api).*)",
          destination: "/",
        },
      ],
    };
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
