import { supabase } from "./client";
import type { MenuCategory, MenuItem } from "../../types/menu";
import { BADGE_KEYWORDS } from "../../types/menu";
import { categories as fallbackCategories } from "../../data/products";

interface DbMediaRow {
  media_type: string;
  url: string;
  display_order: number;
}

interface DbPriceRow {
  quantity_label: string;
  price: number;
  display_order: number;
}

interface DbMenuItemRow {
  id: string;
  name: string;
  description: string | null;
  food_type: string | null;
  keywords: string[] | null;
  ingredient_tags: string[] | null;
  shelf_life: string | null;
  is_bestseller: boolean | null;
  is_new_launch: boolean | null;
  is_available: boolean | null;
  display_order: number | null;
  category: { name: string } | null;
  prices: DbPriceRow[] | null;
  media: DbMediaRow[] | null;
  courier_supported: boolean | null;
  courier_weight_grams: number | null;
  courier_fragile: boolean | null;
  courier_category: string | null;
}

const fallbackImages: Record<string, string[]> = {}
for (const cat of fallbackCategories) {
  for (const item of cat.items) {
    if (item.images?.length) {
      fallbackImages[item.name.toLowerCase().trim()] = item.images
    }
  }
}

function dedupeByName(items: MenuItem[]): MenuItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.name.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function transformRow(item: DbMenuItemRow): MenuItem {
  const mediaImages =
    item.media
      ?.filter((m) => m.media_type === "image")
      ?.sort((a, b) => a.display_order - b.display_order)
      ?.map((m) => m.url) ?? [];

  const staticFallback = fallbackImages[item.name?.toLowerCase().trim()] ?? [];

  const images = mediaImages.length > 0 ? mediaImages : staticFallback;

  const video =
    item.media?.find((m) => m.media_type === "video")?.url ?? "";

  const prices =
    (item.prices
      ?.sort((a, b) => a.display_order - b.display_order)
      .map((p) => ({
        quantity_label: p.quantity_label,
        price: Number(p.price),
        display_order: p.display_order,
      })) ?? []);

  const keywordTags: string[] = item.keywords ?? [];
  const ingredientTags: string[] = item.ingredient_tags ?? [];

  const normalise = (value: string) => value.trim().toLowerCase();

  const keywordBadges = keywordTags.filter((tag) =>
    BADGE_KEYWORDS.some((badge) => normalise(badge) === normalise(tag))
  );

  const tasteNotes = keywordTags.filter(
    (tag) =>
      !BADGE_KEYWORDS.some((badge) => normalise(badge) === normalise(tag))
  );

  const badgeTags = [
    item.is_new_launch ? "New Launch" : null,
    item.is_bestseller ? "Best Seller" : null,
    ...keywordBadges,
  ].filter(Boolean);

  return {
    id: item.id,
    name: item.name,
    description: item.description ?? "",
    type: (item.food_type as "veg" | "nonveg") ?? "veg",
    keywords: [...new Set(tasteNotes)],
    ingredient_tags: [...new Set(ingredientTags)],
    shelf_life: item.shelf_life ?? "",
    image: images[0] ?? "/cakes/chocolate-cake-1.jpg",
    images,
    video,
    price: prices[0]?.price ?? 0,
    prices,
    badges: [...new Set(badgeTags as string[])],
    category: item.category?.name ?? "Others",
    courier_supported: item.courier_supported ?? false,
    courier_weight_grams: item.courier_weight_grams ?? null,
    courier_fragile: item.courier_fragile ?? false,
    courier_category: item.courier_category ?? null,
  };
}

const MENU_SELECT = `
  id,
  name,
  description,
  food_type,
  keywords,
  ingredient_tags,
  shelf_life,
  is_bestseller,
  is_new_launch,
  is_available,
  display_order,
  courier_supported,
  courier_weight_grams,
  courier_fragile,
  courier_category,
  category:menu_categories(name),
  prices:menu_item_prices(quantity_label, price, display_order),
  media:menu_item_media(media_type, url, display_order)
`;

export async function getNewLaunches(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select(MENU_SELECT)
    .eq("is_available", true)
    .eq("is_new_launch", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch new launches:", error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  return dedupeByName((data as unknown as DbMenuItemRow[]).map(transformRow));
}

export async function getMenuCategories(): Promise<MenuCategory[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select(MENU_SELECT)
    .eq("is_available", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch menu items:", error);
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  const products: MenuItem[] = dedupeByName((data as unknown as DbMenuItemRow[]).map(transformRow));

  const grouped = products.reduce<MenuCategory[]>((acc, product) => {
    const existing = acc.find((cat) => cat.name === product.category);

    if (existing) {
      existing.items.push(product);
    } else {
      acc.push({
        name: product.category,
        items: [product],
      });
    }

    return acc;
  }, []);

  return grouped;
}
