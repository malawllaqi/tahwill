"use client";
import { createContext, type ReactNode, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { FileInput, FormatType } from "@/lib/types";

type FileContextType = {
  files: FileInput[];
  setFiles: React.Dispatch<React.SetStateAction<FileInput[]>>;
  addFile: (file: File) => void;
  updateFile: (id: string, format: FormatType | null) => void;
  deleteFile: (id: string) => void;
  updateConverted: (id: string, converted: boolean) => void;
};
export const FileContext = createContext<FileContextType>({
  files: [],
  setFiles: () => {},
  addFile: () => {},
  updateFile: () => {},
  deleteFile: () => {},
  updateConverted: () => {},
});

export function FilesProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileInput[]>([]);

  function addFile(file: File) {
    setFiles((prevFiles) => [
      ...prevFiles,
      { file: file, id: uuidv4(), format: null, resize: null },
    ]);
  }

  function updateFile(id: string, format: FormatType | null) {
    setFiles((prevFiles) =>
      prevFiles.map((prevFile) =>
        prevFile.id === id ? { ...prevFile, format } : prevFile,
      ),
    );
  }

  function deleteFile(id: string) {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  }

  function updateConverted(id: string, converted: boolean) {
    setFiles((prevFiles) =>
      prevFiles.map((prevFile) =>
        prevFile.id === id ? { ...prevFile, converted } : prevFile,
      ),
    );
  }
  return (
    <FileContext.Provider
      value={{
        files,
        setFiles,
        addFile,
        updateFile,
        deleteFile,
        updateConverted,
      }}
    >
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
