"use client";
import { createContext, type ReactNode, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { FileInput } from "@/lib/types";

type FileContextType = {
  files: FileInput[];
  setFiles: React.Dispatch<React.SetStateAction<FileInput[]>>;
  addFile: (file: File) => void;
};
export const FileContext = createContext<FileContextType>({
  files: [],
  setFiles: () => {},
  addFile: () => {},
});

export function FilesProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileInput[]>([]);
  function addFile(file: File) {
    setFiles([
      ...files,
      { file: file, id: uuidv4(), format: null, resize: null },
    ]);
  }

  return (
    <FileContext.Provider value={{ files, setFiles, addFile }}>
      {children}
    </FileContext.Provider>
  );
}
