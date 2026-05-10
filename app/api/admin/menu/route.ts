import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase/admin-client";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const { data, error } = await adminSupabase
      .from("menu_items")
      .select("*, prices:menu_item_prices(*), media:menu_item_media(*), category:menu_categories!inner(name)")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  }

  const { data, error } = await adminSupabase
    .from("menu_items")
    .select("*, prices:menu_item_prices(*), media:menu_item_media(*), category:menu_categories!inner(name)")
    .order("display_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { prices, image_urls, ...fields } = body;

    const slug = slugify(fields.name);

    const { data: item, error: insertError } = await adminSupabase
      .from("menu_items")
      .insert({
        category_id: fields.category_id || null,
        name: fields.name,
        slug,
        description: fields.description || null,
        food_type: fields.food_type || "veg",
        keywords: fields.keywords || [],
        ingredient_tags: fields.ingredient_tags || [],
        shelf_life: fields.shelf_life || null,
        is_bestseller: fields.is_bestseller || false,
        is_new_launch: fields.is_new_launch || false,
        is_available: fields.is_available ?? true,
        display_order: fields.display_order || 0,
        courier_supported: fields.courier_supported ?? true,
        courier_weight_grams: fields.courier_weight_grams || null,
        courier_fragile: fields.courier_fragile || false,
        courier_category: fields.courier_category || null,
      })
      .select()
      .single();

    if (insertError || !item) {
      return NextResponse.json({ error: insertError?.message || "Insert failed" }, { status: 500 });
    }

    // Insert prices
    if (prices && Array.isArray(prices) && prices.length > 0) {
      const { error: pricesError } = await adminSupabase
        .from("menu_item_prices")
        .insert(
          prices.map((p: { quantity_label: string; price: number; display_order: number }, i: number) => ({
            menu_item_id: item.id,
            quantity_label: p.quantity_label,
            price: p.price,
            display_order: p.display_order ?? i,
          }))
        );

      if (pricesError) {
        console.error("Failed to insert prices:", pricesError);
      }
    }

    // Insert media (images)
    if (image_urls && Array.isArray(image_urls) && image_urls.length > 0) {
      const { error: mediaError } = await adminSupabase
        .from("menu_item_media")
        .insert(
          image_urls.map((url: string, i: number) => ({
            menu_item_id: item.id,
            media_type: "image",
            url,
            display_order: i,
          }))
        );

      if (mediaError) {
        console.error("Failed to insert media:", mediaError);
      }
    }

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, prices, image_urls, media_to_remove, ...fields } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // Only update menu_item fields if any were provided
    if (Object.keys(fields).length > 0) {
      const slug = slugify(fields.name);
      const { error: updateError } = await adminSupabase
        .from("menu_items")
        .update({
          ...(fields.name !== undefined && { name: fields.name, slug }),
          ...(fields.category_id !== undefined && { category_id: fields.category_id || null }),
          ...(fields.description !== undefined && { description: fields.description || null }),
          ...(fields.food_type !== undefined && { food_type: fields.food_type || "veg" }),
          ...(fields.keywords !== undefined && { keywords: fields.keywords || [] }),
          ...(fields.ingredient_tags !== undefined && { ingredient_tags: fields.ingredient_tags || [] }),
          ...(fields.shelf_life !== undefined && { shelf_life: fields.shelf_life || null }),
          ...(fields.is_bestseller !== undefined && { is_bestseller: fields.is_bestseller || false }),
          ...(fields.is_new_launch !== undefined && { is_new_launch: fields.is_new_launch || false }),
          ...(fields.is_available !== undefined && { is_available: fields.is_available ?? true }),
          ...(fields.display_order !== undefined && { display_order: fields.display_order || 0 }),
          ...(fields.courier_supported !== undefined && { courier_supported: fields.courier_supported ?? true }),
          ...(fields.courier_weight_grams !== undefined && { courier_weight_grams: fields.courier_weight_grams || null }),
          ...(fields.courier_fragile !== undefined && { courier_fragile: fields.courier_fragile || false }),
          ...(fields.courier_category !== undefined && { courier_category: fields.courier_category || null }),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }
    }

    // Replace prices only if prices field was explicitly provided
    if (prices !== undefined) {
      await adminSupabase.from("menu_item_prices").delete().eq("menu_item_id", id);

      if (Array.isArray(prices) && prices.length > 0) {
        const { error: pricesError } = await adminSupabase
          .from("menu_item_prices")
          .insert(
            prices.map((p: { quantity_label: string; price: number; display_order: number }, i: number) => ({
              menu_item_id: id,
              quantity_label: p.quantity_label,
              price: p.price,
              display_order: p.display_order ?? i,
            }))
          );

        if (pricesError) {
          console.error("Failed to insert prices:", pricesError);
        }
      }
    }

    // Remove deleted media
    if (media_to_remove && Array.isArray(media_to_remove) && media_to_remove.length > 0) {
      await adminSupabase.from("menu_item_media").delete().in("id", media_to_remove);
    }

    // Add new media
    if (image_urls && Array.isArray(image_urls) && image_urls.length > 0) {
      const { error: mediaError } = await adminSupabase
        .from("menu_item_media")
        .insert(
          image_urls.map((url: string, i: number) => ({
            menu_item_id: id,
            media_type: "image",
            url,
            display_order: i,
          }))
        );

      if (mediaError) {
        console.error("Failed to insert media:", mediaError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const { error } = await adminSupabase.from("menu_items").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
