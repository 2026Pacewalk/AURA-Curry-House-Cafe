import { eq } from "drizzle-orm";
import { createRequire } from "module";
import { getDb } from "../api/queries/connection";
import { categories, menuItems, settings } from "./schema";

const require = createRequire(import.meta.url);

async function seed() {
  const db = getDb();

  // Seed categories
  const cats = await db.insert(categories).values([
    { name: "Quick Snacks", slug: "quick-snacks", description: "Street-style Indian snacks and chaat", image: "/images/cat-street-food.jpg", sortOrder: 1, active: true },
    { name: "South Indian", slug: "south-indian", description: "Dosa, Idli, Vada & More", image: "/images/cat-south-indian.jpg", sortOrder: 2, active: true },
    { name: "North Indian", slug: "north-indian", description: "Curries & Breads", image: "/images/cat-north-indian.jpg", sortOrder: 3, active: true },
    { name: "Indo Chinese", slug: "indo-chinese", description: "Noodles & Manchurian", image: "/images/cat-indo-chinese.jpg", sortOrder: 4, active: true },
    { name: "Biryani", slug: "biryani", description: "Aromatic rice dishes", image: "/images/cat-biryani.jpg", sortOrder: 5, active: true },
    { name: "Desserts", slug: "desserts", description: "Sweet Delights", image: "/images/cat-desserts.jpg", sortOrder: 6, active: true },
    { name: "Beverages", slug: "beverages", description: "Shakes, Lassi & More", image: "/images/cat-beverages.jpg", sortOrder: 7, active: true },
  ]);

  console.log("Categories seeded:", cats);

  // Seed menu items (Quick Snacks - category 1)
  await db.insert(menuItems).values([
    { name: "Samosa (2 Pcs)", categoryId: 1, description: "Crispy golden pastry filled with spiced potatoes and peas", price: "8.00", isVeg: true, spiceLevel: 1, isAvailable: true, isFeatured: false, isBestSeller: true, sortOrder: 1 },
    { name: "Pani Puri", categoryId: 1, description: "Crispy hollow puris filled with spiced potatoes and chickpeas", price: "12.00", isVeg: true, spiceLevel: 2, isAvailable: true, isFeatured: true, isBestSeller: false, sortOrder: 2 },
    { name: "Pav Bhaji", categoryId: 1, description: "Mixed vegetable curry served with buttered bread rolls", price: "15.50", isVeg: true, spiceLevel: 1, isAvailable: true, isFeatured: false, isBestSeller: true, sortOrder: 3 },
    { name: "Chole Bhature", categoryId: 1, description: "Spicy chickpea curry with fluffy deep-fried bread", price: "15.50", isVeg: true, spiceLevel: 2, isAvailable: true, isFeatured: false, isBestSeller: false, sortOrder: 4 },
    { name: "Vada Pav", categoryId: 1, description: "Spicy potato fritter in a soft bun with chutneys", price: "11.50", isVeg: true, spiceLevel: 2, isAvailable: true, isFeatured: false, isBestSeller: true, sortOrder: 5 },
    { name: "Aloo Tikki Chaat", categoryId: 1, description: "Crispy potato patties with chickpea curry and chutneys", price: "12.00", isVeg: true, spiceLevel: 1, isAvailable: true, isFeatured: true, isBestSeller: false, sortOrder: 6 },
    { name: "Masala Dosa", categoryId: 2, description: "Crispy rice crepe with spiced potato filling", price: "14.50", isVeg: true, spiceLevel: 1, isAvailable: true, isFeatured: true, isBestSeller: true, sortOrder: 7 },
    { name: "Paneer Masala Dosa", categoryId: 2, description: "Crispy dosa stuffed with cottage cheese masala", price: "16.50", isVeg: true, spiceLevel: 1, isAvailable: true, isFeatured: false, isBestSeller: false, sortOrder: 8 },
    { name: "Mysore Masala Dosa", categoryId: 2, description: "Crispy dosa with spicy red chutney and potato filling", price: "15.50", isVeg: true, spiceLevel: 2, isAvailable: true, isFeatured: true, isBestSeller: false, sortOrder: 9 },
    { name: "Idli (2 Pcs)", categoryId: 2, description: "Soft steamed rice cakes with sambar and chutney", price: "8.50", isVeg: true, spiceLevel: 0, isAvailable: true, isFeatured: false, isBestSeller: false, sortOrder: 10 },
    { name: "Medu Vada (2 Pcs)", categoryId: 2, description: "Crispy lentil doughnuts with sambar and chutney", price: "8.50", isVeg: true, spiceLevel: 0, isAvailable: true, isFeatured: false, isBestSeller: false, sortOrder: 11 },
    { name: "Butter Chicken", categoryId: 3, description: "Rich and creamy tomato-based chicken curry", price: "21.50", isVeg: false, spiceLevel: 1, isAvailable: true, isFeatured: true, isBestSeller: true, sortOrder: 12 },
    { name: "Kadai Paneer", categoryId: 3, description: "Cottage cheese with onion and capsicum in kadai spices", price: "19.50", isVeg: true, spiceLevel: 2, isAvailable: true, isFeatured: true, isBestSeller: true, sortOrder: 13 },
    { name: "Palak Paneer", categoryId: 3, description: "Creamy spinach with cottage cheese cubes", price: "19.50", isVeg: true, spiceLevel: 1, isAvailable: true, isFeatured: false, isBestSeller: false, sortOrder: 14 },
    { name: "Chicken Tikka Masala", categoryId: 3, description: "Grilled chicken tikka in creamy tomato gravy", price: "21.50", isVeg: false, spiceLevel: 2, isAvailable: true, isFeatured: false, isBestSeller: true, sortOrder: 15 },
    { name: "Dal Makhani", categoryId: 3, description: "Black lentils slow-cooked with cream and butter", price: "17.50", isVeg: true, spiceLevel: 1, isAvailable: true, isFeatured: false, isBestSeller: false, sortOrder: 16 },
    { name: "Garlic Naan", categoryId: 3, description: "Tandoor-baked bread topped with fresh garlic", price: "4.50", isVeg: true, spiceLevel: 0, isAvailable: true, isFeatured: true, isBestSeller: false, sortOrder: 17 },
    { name: "Butter Naan", categoryId: 3, description: "Soft tandoori naan brushed with butter", price: "4.50", isVeg: true, spiceLevel: 0, isAvailable: true, isFeatured: false, isBestSeller: false, sortOrder: 18 },
    { name: "Veg Manchurian", categoryId: 4, description: "Crispy vegetable balls in tangy Manchurian sauce", price: "18.50", isVeg: true, spiceLevel: 2, isAvailable: true, isFeatured: true, isBestSeller: false, sortOrder: 19 },
    { name: "Hakka Noodles", categoryId: 4, description: "Stir-fried noodles with vegetables and sauces", price: "16.50", isVeg: true, spiceLevel: 1, isAvailable: true, isFeatured: true, isBestSeller: true, sortOrder: 20 },
    { name: "Chilli Chicken", categoryId: 4, description: "Crispy chicken tossed in spicy chilli sauce", price: "20.50", isVeg: false, spiceLevel: 3, isAvailable: true, isFeatured: false, isBestSeller: true, sortOrder: 21 },
    { name: "Fried Rice", categoryId: 4, description: "Wok-tossed rice with vegetables and soy sauce", price: "16.50", isVeg: true, spiceLevel: 0, isAvailable: true, isFeatured: false, isBestSeller: false, sortOrder: 22 },
    { name: "Chicken Biryani", categoryId: 5, description: "Aromatic basmati rice with spiced chicken", price: "18.50", isVeg: false, spiceLevel: 2, isAvailable: true, isFeatured: true, isBestSeller: true, sortOrder: 23 },
    { name: "Subz Biryani", categoryId: 5, description: "Fragrant rice with mixed vegetables", price: "16.00", isVeg: true, spiceLevel: 1, isAvailable: true, isFeatured: false, isBestSeller: false, sortOrder: 24 },
    { name: "Gulab Jamun", categoryId: 6, description: "Soft milk dumplings soaked in rose sugar syrup", price: "7.90", isVeg: true, spiceLevel: 0, isAvailable: true, isFeatured: true, isBestSeller: true, sortOrder: 25 },
    { name: "Gajar Ka Halwa", categoryId: 6, description: "Slow-cooked carrot dessert with milk and nuts", price: "8.50", isVeg: true, spiceLevel: 0, isAvailable: true, isFeatured: false, isBestSeller: false, sortOrder: 26 },
    { name: "Mango Lassi", categoryId: 7, description: "Refreshing yogurt drink with mango", price: "6.00", isVeg: true, spiceLevel: 0, isAvailable: true, isFeatured: true, isBestSeller: true, sortOrder: 27 },
    { name: "Masala Chai", categoryId: 7, description: "Traditional Indian spiced tea", price: "5.00", isVeg: true, spiceLevel: 0, isAvailable: true, isFeatured: true, isBestSeller: false, sortOrder: 28 },
    { name: "Jaljeera", categoryId: 7, description: "Refreshing cumin-flavored drink", price: "6.50", isVeg: true, spiceLevel: 1, isAvailable: true, isFeatured: false, isBestSeller: false, sortOrder: 29 },
  ]);

  console.log("Menu items seeded");

  // Seed settings
  await db.insert(settings).values([
    { key: "phone", value: "(07) 2140 1757" },
    { key: "whatsapp", value: "61412345678" },
    { key: "email", value: "info@auracurryhousecafe.com" },
    { key: "address", value: "3/16 Bryants Rd, Shailer Park QLD 4128" },
    { key: "hours", value: "Mon – Sun: 10:00 AM – 09:30 PM" },
    { key: "facebook", value: "" },
    { key: "instagram", value: "" },
    { key: "tiktok", value: "" },
    { key: "taxRate", value: "0" },
  ]);

  console.log("Settings seeded");

  // Attach dish photos (sourced separately into scripts/dish-image-map.json).
  try {
    const imageMap: Record<string, string> = require("../scripts/dish-image-map.json");
    let n = 0;
    for (const [id, image] of Object.entries(imageMap)) {
      await db.update(menuItems).set({ image }).where(eq(menuItems.id, Number(id)));
      n++;
    }
    console.log(`Dish images applied: ${n}`);
  } catch {
    console.log("No dish-image-map.json found; skipping image attach");
  }

  console.log("Seed complete!");
}

seed().catch(console.error);
