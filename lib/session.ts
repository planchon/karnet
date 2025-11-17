import { auth, clerkClient } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { getRedis } from "./cache";

const SESSION_EXPIRATION = 1800;

export const getSession = () =>
    Sentry.startSpan(
        {
            name: "getToken",
        },
        async () => {
            const redis = await getRedis();

            const session = await auth();

            if (!session.sessionId) {
                throw new Error("No session id");
            }

            const jwt = await redis.get(`session:${session.sessionId}`);

            if (!jwt) {
                const tokenRes = await (await clerkClient()).sessions.getToken(
                    session.sessionId,
                    "convex",
                    SESSION_EXPIRATION
                );

                if (!tokenRes) {
                    throw new Error("No token");
                }

                return { jwt: tokenRes.jwt, session };
            }

            return { jwt, session };
        }
    );
