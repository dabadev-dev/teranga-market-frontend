const API_URL = "http://localhost:3000";

export function getProductImageUrl(image?: string): string {
  if (!image) return "/images/placeholder.png";

  if (image.startsWith("http")) return image;

  if (image.startsWith("/uploads/")) {
    return `${API_URL}${image}`;
  }

  return image;
}