import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const tenantId = "a6c41dba-22ed-4c7b-8df6-f56ce64deb71";
  const clientId = "e7f0e4a8-abbe-4c39-b12a-c5cce1fedc20";
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;

  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const formData = new FormData();
  formData.append("client_id", clientId);
  formData.append("scope", "offline_access%20openid%20profile%20User.Read%20Calendars.ReadWrite");
  formData.append("code", code);
  formData.append("grant_type", "authorization_code");
  formData.append("redirect_uri", "http://localhost:3000/account/microsoft");
  formData.append("client_secret", clientSecret as string);

  console.log("getting token for code", code);

  const req = await fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
    method: "POST",
    body: formData,
  });

  const data = await req.json();
  console.log("token data", data);
}
