import { authRouter } from "./auth-router";
import { categoryRouter } from "./category-router";
import { menuRouter } from "./menu-router";
import { orderRouter } from "./order-router";
import { reservationRouter } from "./reservation-router";
import { settingRouter } from "./setting-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  category: categoryRouter,
  menu: menuRouter,
  order: orderRouter,
  reservation: reservationRouter,
  setting: settingRouter,
});

export type AppRouter = typeof appRouter;
