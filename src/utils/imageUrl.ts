
import { API_BASE_URL } from "../services/api";

export const getImageUrl = (image?: string | null): string => {
  if (!image) return "/images/placeholder.png";

  // Image déjà hébergée sur un serveur
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // Image uploadée par une vendeuse
  if (image.startsWith("/uploads/")) {
    return `${API_BASE_URL}${image}`;
  }

  // Image locale du frontend
  if (image.startsWith("/")) {
    return image;
  }

  return `/images/${image}`;
};
