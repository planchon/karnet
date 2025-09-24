export function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const mode = searchParams.get("hub.mode");
    const challenge = searchParams.get("hub.challenge");
    const verifyToken = searchParams.get("hub.verify_token");

    if (mode === "subscribe" && verifyToken === process.env.INSTAGRAM_VERIFY_TOKEN) {
        console.log("Instagram subscription verified");
        return new Response(challenge, { status: 200 });
    }

    console.log("Instagram subscription failed", { mode, challenge, verifyToken });
    return new Response("Invalid request", { status: 400 });
}

export async function POST(req: Request) {
    const body = await req.json();
    console.log(JSON.stringify(body, null, 2));
    return new Response("OK", { status: 200 });
}
