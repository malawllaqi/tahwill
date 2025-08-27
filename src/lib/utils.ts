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

export function downloadFile({
  blob,
  fileName,
}: {
  blob: Blob;
  fileName: string;
}) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
