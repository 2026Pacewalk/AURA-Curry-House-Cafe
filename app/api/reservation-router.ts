import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { reservations } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const reservationRouter = createRouter({
  list: adminQuery.query(async () => {
    const db = getDb();
    return db.select().from(reservations).orderBy(desc(reservations.createdAt));
  }),

  listByStatus: adminQuery
    .input(z.object({ status: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(reservations)
        .where(eq(reservations.status, input.status as "pending" | "confirmed" | "cancelled" | "completed"))
        .orderBy(desc(reservations.createdAt));
    }),

  create: publicQuery
    .input(z.object({
      name: z.string().min(1),
      phone: z.string().min(1),
      date: z.string().min(1),
      time: z.string().min(1),
      guests: z.number().min(1),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(reservations).values(input);
      return { id: Number(result[0].insertId) };
    }),

  updateStatus: adminQuery
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(reservations).set({ status: input.status }).where(eq(reservations.id, input.id));
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(reservations).where(eq(reservations.id, input.id));
      return { success: true };
    }),
});
