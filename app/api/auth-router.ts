import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as cookie from "cookie";
import { Session } from "@contracts/constants";
import { getSessionCookieOptions } from "./lib/cookies";
import { createRouter, publicQuery, authedQuery } from "./middleware";
import { env } from "./lib/env";
import { signSessionToken } from "./kimi/session";
import { upsertUser } from "./queries/users";

const OWNER_UNION_ID = "owner-admin";

export const authRouter = createRouter({
  me: authedQuery.query((opts) => opts.ctx.user),

  // Simple owner password login for the admin dashboard (replaces the
  // unavailable Kimi OAuth flow). Issues the same session cookie that
  // the rest of the auth machinery expects, for an admin-role user.
  adminLogin: publicQuery
    .input(z.object({ password: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      if (!env.adminPassword) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Admin login is not configured." });
      }
      if (input.password !== env.adminPassword) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Incorrect password." });
      }

      await upsertUser({ unionId: OWNER_UNION_ID, name: "Owner", role: "admin" });
      const token = await signSessionToken({ unionId: OWNER_UNION_ID, clientId: env.appId });

      const opts = getSessionCookieOptions(ctx.req.headers);
      ctx.resHeaders.append(
        "set-cookie",
        cookie.serialize(Session.cookieName, token, {
          httpOnly: opts.httpOnly,
          path: opts.path,
          sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
          secure: opts.secure,
          maxAge: Session.maxAgeMs / 1000,
        }),
      );
      return { success: true };
    }),
  logout: authedQuery.mutation(async ({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req.headers);
    ctx.resHeaders.append(
      "set-cookie",
      cookie.serialize(Session.cookieName, "", {
        httpOnly: opts.httpOnly,
        path: opts.path,
        sameSite: opts.sameSite?.toLowerCase() as "lax" | "none",
        secure: opts.secure,
        maxAge: 0,
      }),
    );
    return { success: true };
  }),
});
