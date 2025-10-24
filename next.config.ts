import { withSentryConfig } from "@sentry/nextjs";
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
                // {
                //     source: "/((?!api).*)",
                //     destination: "/",
                // },
                {
                    source: "/ingest/static/:path*",
                    destination: "https://eu-assets.i.posthog.com/static/:path*",
                },
                {
                    source: "/ingest/:path*",
                    destination: "https://eu.i.posthog.com/:path*",
                },
            ]);
        });
    },
    // This is required to support PostHog trailing slash API requests
    skipTrailingSlashRedirect: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "vercel.com",
                port: "",
                pathname: "/api/www/avatar/**",
            },
        ],
        localPatterns: [
            {
                pathname: "/**",
                search: "",
            },
        ],
        dangerouslyAllowSVG: true,
        contentDispositionType: "attachment",
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
};

export default withSentryConfig(nextConfig, {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: "p6n",

    project: "karnet",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: false,
});
