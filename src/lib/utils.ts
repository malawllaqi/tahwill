import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FileInput } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLastPathSegment(url: string) {
  return url.split("/").pop() || "";
}

export function isFileExists(files: FileInput[], file: File) {
  return files.some((f) => f.file.name === file.name);
}
