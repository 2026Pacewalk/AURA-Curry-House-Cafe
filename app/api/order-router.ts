import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { orders, menuItems } from "@db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import { notifyNewOrder } from "./lib/notifications";

const GST_RATE = 0.1;

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
      customerName: z.string().min(1).max(200),
      customerMobile: z.string().min(1).max(40),
      customerAddress: z.string().max(500).optional(),
      deliveryType: z.enum(["delivery", "pickup", "dineIn"]).default("pickup"),
      notes: z.string().max(1000).optional(),
      items: z.array(z.object({
        id: z.number().int().positive(),
        quantity: z.number().int().min(1).max(99),
      })).min(1),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();

      // Never trust client-side prices: look the items up and price the
      // order from the database.
      const ids = [...new Set(input.items.map(i => i.id))];
      const dbItems = await db.select().from(menuItems)
        .where(inArray(menuItems.id, ids));
      const byId = new Map(dbItems.map(i => [i.id, i]));

      const priced = input.items.map(({ id, quantity }) => {
        const item = byId.get(id);
        if (!item || !item.isAvailable) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Item ${item?.name ?? `#${id}`} is no longer available`,
          });
        }
        return { id, name: item.name, price: Number(item.price), quantity, isVeg: item.isVeg };
      });

      const subtotal = priced.reduce((sum, i) => sum + i.price * i.quantity, 0);
      const tax = subtotal * GST_RATE;
      const total = subtotal + tax;

      const result = await db.insert(orders).values({
        customerName: input.customerName,
        customerMobile: input.customerMobile,
        customerAddress: input.customerAddress,
        deliveryType: input.deliveryType,
        notes: input.notes,
        items: priced,
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
      });
      const orderId = Number(result[0].insertId);

      // Notify the owner (fire-and-forget — never block/break the order).
      void notifyNewOrder({
        id: orderId,
        customerName: input.customerName,
        customerMobile: input.customerMobile,
        customerAddress: input.customerAddress,
        deliveryType: input.deliveryType,
        notes: input.notes,
        items: priced.map((p) => ({ name: p.name, price: p.price, quantity: p.quantity })),
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
      }).catch(() => {});

      return { id: orderId };
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
