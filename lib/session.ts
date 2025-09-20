import { auth, clerkClient } from '@clerk/nextjs/server';
import { after } from 'next/server';
import { getRedis } from './cache';

let userToken: string | null = null;

export const getSession = async () => {
    if (userToken) {
        console.log('[Session] returning cached token');
        return userToken;
    }

    console.log('[Session] not using cached token');

    const redis = await getRedis();

    const { sessionId } = await auth();

    if (!sessionId) {
        throw new Error('No session id');
    }

    const jwt = await redis.get(`session:${sessionId}`);

    if (!jwt) {
        const tokenRes = await (await clerkClient()).sessions.getToken(sessionId, 'convex', 3600);

        if (!tokenRes) {
            throw new Error('No token');
        }

        // set the session in redis after the request is complete
        after(async () => {
            await redis.set(`session:${sessionId}`, tokenRes.jwt, {
                expiration: {
                    value: 3600,
                    type: 'EX',
                },
            });
        });

        userToken = tokenRes.jwt;
        return tokenRes.jwt;
    }

    userToken = jwt;
    return jwt;
};
