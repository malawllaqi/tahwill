"use client";
import { createContext, type ReactNode, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { FileInput, FormatType } from "@/lib/types";

type FileContextType = {
  files: FileInput[];
  setFiles: React.Dispatch<React.SetStateAction<FileInput[]>>;
  addFile: (file: File) => void;
  updateFile: (id: string, format: FormatType) => void;
};
export const FileContext = createContext<FileContextType>({
  files: [],
  setFiles: () => {},
  addFile: () => {},
  updateFile: () => {},
});

export function FilesProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileInput[]>([]);
  function addFile(file: File) {
    setFiles((prevFiles) => [
      ...prevFiles,
      { file: file, id: uuidv4(), format: null, resize: null },
    ]);
  }

  function updateFile(id: string, format: FormatType) {
    setFiles((prevFiles) =>
      prevFiles.map((prevFile) =>
        prevFile.id === id ? { ...prevFile, format } : prevFile,
      ),
    );
  }
  return (
    <FileContext.Provider value={{ files, setFiles, addFile, updateFile }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFiles() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFiles must be used within a FilesProvider");
  }
  return context;
}
