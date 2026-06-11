import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { menuItems } from "@db/schema";
import { eq, and, asc } from "drizzle-orm";

export const menuRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(menuItems).orderBy(asc(menuItems.sortOrder));
  }),

  listAvailable: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(menuItems)
      .where(eq(menuItems.isAvailable, true))
      .orderBy(asc(menuItems.sortOrder));
  }),

  listByCategory: publicQuery
    .input(z.object({ categoryId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(menuItems)
        .where(and(eq(menuItems.categoryId, input.categoryId), eq(menuItems.isAvailable, true)))
        .orderBy(asc(menuItems.sortOrder));
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db.select().from(menuItems).where(eq(menuItems.id, input.id)).limit(1);
      return rows[0] ?? null;
    }),

  featured: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(menuItems)
      .where(and(eq(menuItems.isFeatured, true), eq(menuItems.isAvailable, true)))
      .orderBy(asc(menuItems.sortOrder));
  }),

  bestSellers: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(menuItems)
      .where(and(eq(menuItems.isBestSeller, true), eq(menuItems.isAvailable, true)))
      .orderBy(asc(menuItems.sortOrder));
  }),

  create: adminQuery
    .input(z.object({
      name: z.string().min(1),
      categoryId: z.number(),
      description: z.string().optional(),
      price: z.string().min(1),
      image: z.string().optional(),
      isVeg: z.boolean().default(true),
      spiceLevel: z.number().min(0).max(3).default(0),
      isAvailable: z.boolean().default(true),
      isFeatured: z.boolean().default(false),
      isBestSeller: z.boolean().default(false),
      sortOrder: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(menuItems).values(input);
      return { id: Number(result[0].insertId) };
    }),

  update: adminQuery
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).optional(),
      categoryId: z.number().optional(),
      description: z.string().optional(),
      price: z.string().optional(),
      image: z.string().optional(),
      isVeg: z.boolean().optional(),
      spiceLevel: z.number().min(0).max(3).optional(),
      isAvailable: z.boolean().optional(),
      isFeatured: z.boolean().optional(),
      isBestSeller: z.boolean().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(menuItems).set(data).where(eq(menuItems.id, id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(menuItems).where(eq(menuItems.id, input.id));
      return { success: true };
    }),
});
