import { auth, clerkClient } from "@clerk/nextjs/server";
import { after } from "next/server";
import { getRedis } from "./cache";

const SESSION_EXPIRATION = 1800;

export const getSession = async () => {
    const redis = await getRedis();

    const { sessionId } = await auth();

    if (!sessionId) {
        throw new Error("No session id");
    }

    const jwt = await redis.get(`session:${sessionId}`);

    if (!jwt) {
        const tokenRes = await (await clerkClient()).sessions.getToken(sessionId, "convex", SESSION_EXPIRATION);

        if (!tokenRes) {
            throw new Error("No token");
        }

        // set the session in redis after the request is complete
        after(async () => {
            await redis.set(`session:${sessionId}`, tokenRes.jwt, {
                expiration: {
                    value: SESSION_EXPIRATION,
                    type: "EX",
                },
            });
        });

        return tokenRes.jwt;
    }

    return jwt;
};
