import { auth, clerkClient } from "@clerk/nextjs/server";

export const getSession = async () => {
    const { sessionId } = await auth();

    if (!sessionId) {
        throw new Error("No session id");
    }

    const tokenRes = await (await clerkClient()).sessions.getToken(sessionId, "convex");

    console.log("[Session] tokenRes", tokenRes);

    return tokenRes.jwt;

    // const redis = await getRedis();

    // const { sessionId } = await auth();

    // if (!sessionId) {
    //     throw new Error("No session id");
    // }

    // const jwt = await redis.get(`session:${sessionId}`);

    // if (!jwt) {
    //     const tokenRes = await (await clerkClient()).sessions.getToken(sessionId, "convex", 120);

    //     if (!tokenRes) {
    //         throw new Error("No token");
    //     }

    //     // set the session in redis after the request is complete
    //     after(async () => {
    //         await redis.set(`session:${sessionId}`, tokenRes.jwt, {
    //             expiration: {
    //                 value: 120,
    //                 type: "EX",
    //             },
    //         });
    //     });

    //     return tokenRes.jwt;
    // }

    // return jwt;
};
