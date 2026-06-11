import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { settings } from "@db/schema";
import { eq } from "drizzle-orm";

export const settingRouter = createRouter({
  get: publicQuery
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db.select().from(settings).where(eq(settings.key, input.key)).limit(1);
      return rows[0] ?? null;
    }),

  getAll: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(settings);
  }),

  getMap: publicQuery.query(async () => {
    const db = getDb();
    const all = await db.select().from(settings);
    const map: Record<string, string> = {};
    for (const s of all) {
      map[s.key] = s.value ?? "";
    }
    return map;
  }),

  set: adminQuery
    .input(z.object({
      key: z.string(),
      value: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db.select().from(settings).where(eq(settings.key, input.key)).limit(1);
      if (existing.length > 0) {
        await db.update(settings).set({ value: input.value }).where(eq(settings.key, input.key));
      } else {
        await db.insert(settings).values(input);
      }
      return { success: true };
    }),

  bulkSet: adminQuery
    .input(z.record(z.string(), z.string()))
    .mutation(async ({ input }) => {
      const db = getDb();
      for (const [key, value] of Object.entries(input)) {
        const existing = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
        if (existing.length > 0) {
          await db.update(settings).set({ value }).where(eq(settings.key, key));
        } else {
          await db.insert(settings).values({ key, value });
        }
      }
      return { success: true };
    }),
});
