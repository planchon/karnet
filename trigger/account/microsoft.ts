import { logger, retry, task } from "@trigger.dev/sdk";
import { ConvexClient } from "convex/browser";
import z from "zod";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const microsoftTokenResSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_in: z.number(),
  scope: z.string(),
  token_type: z.string(),
});

/**
 * Login to Microsoft, get the token and the refresh token from the user
 * @param payload - the code returned after the user has logged in and authorized the app
 */
export const microsoftLogin = task({
  id: "microsoft-login",
  run: async (payload: { code: string; jwtToken: string; outlookConfigId: Id<"outlook_calendar_config"> }) => {
    // set the auth token for the convex client
    const convex = new ConvexClient(process.env.CONVEX_URL as string);
    convex.setAuth(() => Promise.resolve(payload.jwtToken));

    const tenantId = "a6c41dba-22ed-4c7b-8df6-f56ce64deb71";
    const clientId = "e7f0e4a8-abbe-4c39-b12a-c5cce1fedc20";
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;

    const formData = new FormData();
    formData.append("client_id", clientId);
    formData.append("scope", "https://graph.microsoft.com/.default offline_access");
    formData.append("code", payload.code);
    formData.append("grant_type", "authorization_code");
    formData.append("redirect_uri", "http://localhost:3000/account/microsoft");
    formData.append("client_secret", clientSecret as string);

    const data = await logger.trace("microsoft-auth-token", async () => {
      const res = await retry.fetch(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, {
        method: "POST",
        body: formData,
      });

      const jsonData = await res.json();
      console.log("Microsoft login data", { jsonData });
      return microsoftTokenResSchema.parse(jsonData);
    });

    // update the frontend that the sync is complete
    await convex.mutation(api.functions.calendar.config.outlook.updateOutlookCalendarConfig, {
      id: payload.outlookConfigId,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + data.expires_in * 1000,
    });
  },
});
