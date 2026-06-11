import { getDb } from "../api/queries/connection";
import { sql } from "drizzle-orm";

async function main() {
  const db = getDb();
  await db.execute(sql`ALTER TABLE orders MODIFY COLUMN deliveryType ENUM('delivery','pickup','dineIn') DEFAULT 'pickup' NOT NULL`);
  console.log("OK: dineIn added to deliveryType enum");
}

main().catch(console.error);
