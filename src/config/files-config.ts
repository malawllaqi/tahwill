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
    standard: [
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

    specialized: ["dcraw", "exr", "fits", "ppm", "rad", "raw", "openslide"],

    other: ["dz", "magick", "pdf", "v", "input"],
  },
};
