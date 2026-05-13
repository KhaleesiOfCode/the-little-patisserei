import { adminSupabase } from "./admin-client";

const BUCKET = "menu-images";

export function extractStoragePath(publicUrl: string): string | null {
  const marker = `/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}

export async function deleteStorageFile(publicUrl: string): Promise<boolean> {
  const path = extractStoragePath(publicUrl);
  if (!path) return false;
  const { error } = await adminSupabase.storage.from(BUCKET).remove([path]);
  if (error) {
    console.error("Storage delete error:", error);
    return false;
  }
  return true;
}

export async function deleteStorageFiles(urls: string[]): Promise<void> {
  for (const url of urls) {
    await deleteStorageFile(url);
  }
}
