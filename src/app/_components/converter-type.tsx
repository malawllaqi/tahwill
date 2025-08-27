import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useFiles } from "@/components/providers/files-provider";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FILES_CONFIG } from "@/config/files-config";
import type { FileInput, FormatType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ConverterTypeProps {
  file: FileInput;
}

export function ConverterType({ file }: ConverterTypeProps) {
  const { updateFile } = useFiles();
  const [selectedFormat, setSelectedFormat] = useState<FormatType | null>(null);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "flex h-8 w-20 items-center bg-muted-foreground/10 text-muted-foreground text-xs hover:bg-muted-foreground/5 hover:text-foreground",
            file.format ? "uppercase" : "capitalize",
          )}
        >
          {file.format || "Type"}
          <ChevronDown className="size-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-card">
        <ScrollArea className="h-[300px] overflow-y-auto px-4 pt-4">
          <div className="grid gap-4 bg-card">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Format</h4>
              <p className="text-muted-foreground text-sm">
                Select the format you want to convert to.
              </p>
            </div>

            {Object.entries(FILES_CONFIG.formatCategories).map(
              ([category, formats]) => {
                return (
                  <div key={category}>
                    <h4 className="font-medium leading-none capitalize">
                      {category}
                    </h4>
                    <div className="grid grid-cols-3 gap-4 my-4">
                      {formats.map((format) => {
                        return (
                          <Button
                            key={format}
                            variant={
                              selectedFormat === format ? "default" : "outline"
                            }
                            type="button"
                            onClick={() => {
                              updateFile(
                                file.id,
                                format === selectedFormat ? null : format,
                              );
                              setSelectedFormat((prev) =>
                                prev === format ? null : format,
                              );
                            }}
                            className="w-full uppercase text-xs"
                            size="sm"
                          >
                            {format}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
