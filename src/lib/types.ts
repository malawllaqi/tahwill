import type { FormatEnum, ResizeOptions } from "sharp";

export type FormatType = keyof FormatEnum;

export type FileInput = {
  id: string;
  file: File;
  format: FormatType | null;
  resize: ResizeOptions | null;
  converted?: boolean;
};
