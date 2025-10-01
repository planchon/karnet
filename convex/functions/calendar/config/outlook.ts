import { ConvexError, v } from "convex/values";
import type { Id } from "@/convex/_generated/dataModel";
import { mutation } from "@/convex/_generated/server";

export const createOutlookCalendarConfig = mutation({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        uniqueId: "OUTLOOK_CONFIG_2a87ba233f4",
        httpStatusCode: 401,
        message: "User not authenticated",
      });
    }

    const configId = await ctx.db.insert("outlook_calendar_config", {
      ...args,
      subject: identity.subject,
      sync_status: "not_setup" as const,
      connection_status: "connecting" as const,
    });

    return {
      id: configId,
    };
  },
});

export const updateOutlookCalendarConfig = mutation({
  args: {
    id: v.id("outlook_calendar_config"),
    access_token: v.string(),
    refresh_token: v.string(),
    expires_at: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({
        uniqueId: "OUTLOOK_CONFIG_2a87ba233f4",
        httpStatusCode: 401,
        message: "User not authenticated",
      });
    }

    const config = await ctx.db
      .query("outlook_calendar_config")
      .withIndex("by_subject", (q) => q.eq("subject", identity.subject))
      .first();

    if (!config) {
      throw new ConvexError({
        uniqueId: "OUTLOOK_CONFIG_32adbc7dae78",
        httpStatusCode: 400,
        message: "Outlook calendar config not found",
      });
    }

    await ctx.db.patch(config._id as Id<"outlook_calendar_config">, {
      connection_status: "connected" as const,
      sync_status: "queued" as const,
      access_token: args.access_token,
      refresh_token: args.refresh_token,
      expires_at: args.expires_at,
    });
  },
});
