const STORAGE_KEY = "recent_view_ids";
const MAX_RECENT = 6;

export const addToRecentView = (productId: string) => {
  if (typeof window === "undefined") return;

  const existing: string[] = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
  );

  // Remove duplicate
  const filtered = existing.filter((id) => id !== productId);

  // Add to beginning
  const updated = [productId, ...filtered].slice(0, MAX_RECENT);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getRecentViewedIds = (): string[] => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};
