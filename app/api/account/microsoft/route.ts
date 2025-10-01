import { fetchMutation } from "convex/nextjs";
import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import { getSession } from "@/lib/session";
import { microsoftLogin } from "@/trigger/account/microsoft";

/**
 * This will create a new outlook calendar config for the user
 * and then run the microsoftLogin task to get the token and the refresh token
 */
export async function POST(request: Request) {
  const { code } = await request.json();

  if (!code) {
    return new NextResponse("Code is required", { status: 400 });
  }

  const jwtToken = await getSession();

  if (!jwtToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { id } = await fetchMutation(
    api.functions.calendar.config.outlook.createOutlookCalendarConfig,
    {},
    {
      token: jwtToken,
    }
  );

  // const handle = await tasks.trigger<typeof microsoftLogin>("microsoft-login", {
  //   code,
  //   jwtToken,
  //   outlookConfigId: id,
  // });

  const handle = await microsoftLogin.trigger(
    {
      code,
      jwtToken,
      outlookConfigId: id,
    },
    {
      maxAttempts: 1,
    }
  );

  console.log("Microsoft login task triggered", { id, handle });

  return new NextResponse("OK", { status: 200 });
}
