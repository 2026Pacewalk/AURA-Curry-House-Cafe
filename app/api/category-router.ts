import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { categories } from "@db/schema";
import { eq } from "drizzle-orm";

export const categoryRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(categories).orderBy(categories.sortOrder);
  }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db.select().from(categories).where(eq(categories.slug, input.slug)).limit(1);
      return rows[0] ?? null;
    }),

  create: adminQuery
    .input(z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      image: z.string().optional(),
      sortOrder: z.number().default(0),
      active: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(categories).values(input);
      return { id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      slug: z.string().min(1).optional(),
      description: z.string().optional(),
      image: z.string().optional(),
      sortOrder: z.number().optional(),
      active: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(categories).set(data).where(eq(categories.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),
});
