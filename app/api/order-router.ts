import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const orderRouter = createRouter({
  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }),

  listByStatus: adminQuery
    .input(z.object({ status: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(orders)
        .where(eq(orders.status, input.status as "new" | "accepted" | "preparing" | "ready" | "completed" | "cancelled"))
        .orderBy(desc(orders.createdAt));
    }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const rows = await db.select().from(orders).where(eq(orders.id, input.id)).limit(1);
      return rows[0] ?? null;
    }),

  create: publicQuery
    .input(z.object({
      customerName: z.string().min(1),
      customerMobile: z.string().min(1),
      customerAddress: z.string().optional(),
      deliveryType: z.enum(["delivery", "pickup", "dineIn"]).default("pickup"),
      notes: z.string().optional(),
      items: z.array(z.object({
        id: z.number(),
        name: z.string(),
        price: z.number(),
        quantity: z.number(),
        isVeg: z.boolean(),
      })),
      subtotal: z.string(),
      tax: z.string().default("0"),
      total: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(orders).values({
        customerName: input.customerName,
        customerMobile: input.customerMobile,
        customerAddress: input.customerAddress,
        deliveryType: input.deliveryType,
        notes: input.notes,
        items: input.items,
        subtotal: input.subtotal,
        tax: input.tax,
        total: input.total,
      });
      return { id: Number(result[0].insertId) };
    }),

  updateStatus: adminQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["new", "accepted", "preparing", "ready", "completed", "cancelled"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(orders).set({ status: input.status }).where(eq(orders.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(orders).where(eq(orders.id, input.id));
      return { success: true };
    }),
});
