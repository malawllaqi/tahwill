"use client";
import { useMutation } from "@tanstack/react-query";
import JSZip from "jszip";
import { Download, Loader2, Play, Upload, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FILES_CONFIG } from "@/config/files-config";
import { useDownload } from "@/hooks/use-download";
import { orpc } from "@/lib/orpc";
import type { FileInput } from "@/lib/types";
import { isFileExists } from "@/lib/utils";
import { AddUrl } from "./add-url";
import { ConverterType } from "./converter-type";

export function FileConverter() {
  const {
    files,
    addFile,
    updateConverted,
    filesToDownload,
    setFilesToDownload,
  } = useFiles();

  const { handleZip } = useDownload();
  const { mutate, isPending } = useMutation(
    orpc.convert.createMany.mutationOptions({
      onSuccess: (output) => {
        toast.success("Files converted successfully!");
        output.forEach((file) => updateConverted(file.id, true));
        setFilesToDownload((prev) => [...prev, ...output]);
      },
      onError: () => {
        toast.error("Failed to convert files");
      },
    }),
  );

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

  function handleDownloadAll() {
    handleZip(filesToDownload);
  }

  function handleConvertAll() {
    mutate({
      files: files.map((file) => ({
        id: file.id,
        file: file.file,
        format: file.format!,
        resize: file.resize ?? undefined,
      })),
    });
  }
  const allConverted = useMemo(() => {
    return files.every((file) => file.converted);
  }, [files]);

  return (
    <div className="flex flex-col gap-4">
      <FileUpload
        maxFiles={FILES_CONFIG.maxFiles}
        maxSize={FILES_CONFIG.maxSize}
        value={files.map((file) => file.file)}
        onAccept={(acceptedFiles) => {
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
              Or click to browse (max {FILES_CONFIG.maxFiles} files)
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
              return <FileItem key={file.id} file={file} />;
            })}
          </FileUploadList>
        </ScrollArea>
      </FileUpload>
      {files.length > 1 && !allConverted ? (
        <Button
          className="w-full cursor-pointer"
          variant={"outline"}
          onClick={handleConvertAll}
        >
          Convert all <Play className="size-3" />
        </Button>
      ) : null}
      {filesToDownload.length > 1 ? (
        <Button
          className="w-full cursor-pointer"
          variant={"outline"}
          disabled={isPending}
          onClick={handleDownloadAll}
        >
          Download all{" "}
          {isPending ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Download className="size-3" />
          )}
        </Button>
      ) : null}
    </div>
  );
}

interface FileItemProps {
  file: FileInput;
}
function FileItem({ file }: FileItemProps) {
  const { deleteFile, updateConverted, setFilesToDownload } = useFiles();
  const [downloadedFile, setDownloadedFile] = useState<{
    blob: Blob;
    fileName: string;
  } | null>(null);
  const { handleSingleFileDownload } = useDownload();

  const { mutate, isPending } = useMutation(
    orpc.convert.create.mutationOptions({
      onSuccess: (output) => {
        updateConverted(file.id, true);
        setDownloadedFile({
          blob: new Blob([output.image]),
          fileName: output.fileName,
        });
        setFilesToDownload((prev) => [
          ...prev,
          { image: new Blob([output.image]), fileName: output.fileName },
        ]);
      },
    }),
  );

  function handleDownload() {
    if (!downloadedFile) return;

    handleSingleFileDownload({
      blob: downloadedFile.blob,
      fileName: downloadedFile.fileName,
    });
  }

  return (
    <FileUploadItem key={file.id} value={file.file}>
      <FileUploadItemPreview />
      <FileUploadItemMetadata />

      {!file.converted ? <ConverterType file={file} /> : null}
      <Tooltip>
        {file.converted ? (
          <>
            <TooltipTrigger asChild>
              <Button size="sm" className="w-fit" onClick={handleDownload}>
                <Download className="size-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Download</p>
            </TooltipContent>
          </>
        ) : (
          <>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-fit"
                disabled={isPending}
                onClick={() => {
                  if (!file.format) {
                    toast.error("Please select a format");
                    return;
                  }
                  mutate({
                    id: file.id,
                    file: file.file,
                    format: file.format!,
                    resize: file.resize ?? undefined,
                  });
                }}
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Play className="size-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Convert</p>
            </TooltipContent>
          </>
        )}
      </Tooltip>
      <FileUploadItemDelete asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => deleteFile(file.id)}
        >
          <X />
        </Button>
      </FileUploadItemDelete>
    </FileUploadItem>
  );
}
