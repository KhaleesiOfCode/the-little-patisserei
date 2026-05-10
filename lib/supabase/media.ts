import { supabase } from "./client";

export interface MenuItemMediaRow {
  id: string
  menu_item_id: string
  media_type: "image" | "video"
  url: string
  alt_text: string | null
  display_order: number
}

interface DbMediaItem {
  id: string;
  name: string;
  media: MenuItemMediaRow[];
}

export async function getMenuItemsWithMedia(): Promise<
  { id: string; name: string; media: MenuItemMediaRow[] }[]
> {
  const { data, error } = await supabase
    .from("menu_items")
    .select(`
      id,
      name,
      media:menu_item_media(id, menu_item_id, media_type, url, alt_text, display_order)
    `)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch menu items with media:", error);
    return [];
  }

  return (data as DbMediaItem[]).map((item) => ({
    id: item.id,
    name: item.name,
    media: (item.media ?? []).sort(
      (a, b) => a.display_order - b.display_order
    ),
  }));
}

export async function addMedia(
  menuItemId: string,
  url: string,
  displayOrder: number
): Promise<MenuItemMediaRow | null> {
  const { data, error } = await supabase
    .from("menu_item_media")
    .insert({
      menu_item_id: menuItemId,
      media_type: "image",
      url,
      display_order: displayOrder,
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to add media:", error);
    return null;
  }

  return data as unknown as MenuItemMediaRow;
}

export async function removeMedia(mediaId: string): Promise<boolean> {
  const { error } = await supabase
    .from("menu_item_media")
    .delete()
    .eq("id", mediaId);

  if (error) {
    console.error("Failed to remove media:", error);
    return false;
  }

  return true;
}

export async function updateMediaOrder(
  mediaId: string,
  displayOrder: number
): Promise<boolean> {
  const { error } = await supabase
    .from("menu_item_media")
    .update({ display_order: displayOrder })
    .eq("id", mediaId);

  if (error) {
    console.error("Failed to update media order:", error);
    return false;
  }

  return true;
}

export async function uploadImage(
  file: File,
  menuItemId: string
): Promise<string | null> {
  const ext = file.name.split(".").pop() || "jpg";
  const filePath = `${menuItemId}/${Date.now()}.${ext}`;

  const { data, error } = await supabase.storage
    .from("menu-images")
    .upload(filePath, file);

  if (error) {
    console.error("Failed to upload image:", error);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from("menu-images")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function getNextDisplayOrder(
  menuItemId: string
): Promise<number> {
  const { data, error } = await supabase
    .from("menu_item_media")
    .select("display_order")
    .eq("menu_item_id", menuItemId)
    .order("display_order", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) return 0;

  return data[0].display_order + 1;
}
