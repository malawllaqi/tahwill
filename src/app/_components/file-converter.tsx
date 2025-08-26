"use client";
import { Upload, X } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { useFiles } from "@/components/providers/files-provider";
import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FILES_CONFIG } from "@/config/files-config";
import { isFileExists } from "@/lib/utils";
import { AddUrl } from "./add-url";
import { ConverterType } from "./converter-type";

export function FileConverter() {
  const { files, setFiles, addFile } = useFiles();
  const onFileValidate = useCallback(
    (file: File): string | null => {
      // Validate max files
      if (files.length >= FILES_CONFIG.maxFiles) {
        return "You can only upload up to 2 files";
      }

      // Validate file type (only images)
      if (!file.type.startsWith("image/")) {
        return "Only image files are allowed";
      }

      // Validate file size (max 2MB)
      if (file.size > FILES_CONFIG.maxSize) {
        return `File size must be less than ${FILES_CONFIG.maxSize / (1024 * 1024)}MB`;
      }

      return null;
    },
    [files],
  );

  const onFileReject = useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <FileUpload
        maxFiles={FILES_CONFIG.maxFiles}
        maxSize={FILES_CONFIG.maxSize}
        value={files.map((file) => file.file)}
        onAccept={(acceptedFiles) => {
          // Add each accepted file
          acceptedFiles.forEach((file) => {
            return isFileExists(files, file)
              ? toast.error(`"${file.name}" has already been uploaded`)
              : addFile(file);
          });
        }}
        onFileValidate={onFileValidate}
        onFileReject={onFileReject}
        accept="image/*"
        className="w-full"
        multiple
      >
        <FileUploadDropzone>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center rounded-full border p-2.5">
              <Upload className="size-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm">Drag & drop files here</p>
            <p className="text-muted-foreground text-xs">
              Or click to browse (max 2 files)
            </p>
          </div>
          <FileUploadTrigger asChild>
            <Button variant="outline" size="sm" className="mt-2 w-fit">
              Browse files
            </Button>
          </FileUploadTrigger>
        </FileUploadDropzone>
        <AddUrl />
        <ScrollArea className="max-h-[300px] overflow-y-auto">
          <FileUploadList>
            {files.map((file) => {
              return (
                <FileUploadItem key={file.id} value={file.file}>
                  <FileUploadItemPreview />
                  <FileUploadItemMetadata />
                  <ConverterType file={file} />
                  <FileUploadItemDelete asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() =>
                        setFiles(files.filter((f) => f.id !== file.id))
                      }
                    >
                      <X />
                    </Button>
                  </FileUploadItemDelete>
                </FileUploadItem>
              );
            })}
          </FileUploadList>
        </ScrollArea>
      </FileUpload>
    </div>
  );
}
