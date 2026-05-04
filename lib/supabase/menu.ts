import { supabase } from "./client";

export async function getMenuCategories() {
  const { data, error } = await supabase
    .from("menu_items")
    .select(`
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
      category:menu_categories(name),
      prices:menu_item_prices(quantity_label, price, display_order),
      media:menu_item_media(media_type, url, display_order)
    `)
    .eq("is_available", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch menu items:", error);
    return [];
  }

  const badgeKeywords = [
    "Best Seller",
    "Bestseller",
    "New Launch",
    "Highly Recommended",
    "Highly Reordered",
    "Seasonal",
    "Signature",
    "Customer Favourite",
  ];

  const normalise = (value: string) => value.trim().toLowerCase();

  const products = data.map((item: any) => {
    const images =
      item.media
        ?.filter((m: any) => m.media_type === "image")
        ?.sort((a: any, b: any) => a.display_order - b.display_order)
        ?.map((m: any) => m.url) || [];

    const video =
      item.media?.find((m: any) => m.media_type === "video")?.url || "";

    const prices =
      item.prices?.sort((a: any, b: any) => a.display_order - b.display_order) ||
      [];

    const keywordTags = item.keywords || [];
    const ingredientTags = item.ingredient_tags || [];

    const keywordBadges = keywordTags.filter((tag: string) =>
      badgeKeywords.some((badge) => normalise(badge) === normalise(tag))
    );

    const tasteNotes = keywordTags.filter(
      (tag: string) =>
        !badgeKeywords.some((badge) => normalise(badge) === normalise(tag))
    );

    const badgeTags = [
      item.is_new_launch ? "New Launch" : null,
      item.is_bestseller ? "Best Seller" : null,
      ...keywordBadges,
    ].filter(Boolean);

    return {
      id: item.id,
      name: item.name,
      description: item.description || "",
      type: item.food_type || "veg",

      keywords: [...new Set(tasteNotes)],
      ingredient_tags: [...new Set(ingredientTags)],
      shelf_life: item.shelf_life || "",

      image: images[0] || "/cakes/chocolate-cake-1.jpg",
      images,
      video,

      price: prices[0]?.price || 0,
      prices,

      badges: [...new Set(badgeTags)],

      category: item.category?.name || "Others",
    };
  });

  const grouped = products.reduce((acc: any[], product: any) => {
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