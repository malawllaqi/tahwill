import type { FormatEnum } from "sharp";

type FileConfig = {
  maxFiles: number;
  maxSize: number;
  formatCategories: Record<string, (keyof FormatEnum)[]>;
};
export const FILES_CONFIG: FileConfig = {
  maxFiles: 10,
  maxSize: 5 * 1024 * 1024, // 5MB
  formatCategories: {
    image: [
      "avif",
      "gif",
      "heif",
      "jpeg",
      "jpg",
      "jp2",
      "jxl",
      "png",
      "svg",
      "tiff",
      "tif",
      "webp",
    ],
    other: ["dz", "magick", "pdf", "v", "input"],
  },
};
