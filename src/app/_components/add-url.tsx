import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useFiles } from "@/components/providers/files-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { orpc } from "@/lib/orpc";
import { getLastPathSegment, isFileExists } from "@/lib/utils";

export function AddUrl() {
  const { files, addFile } = useFiles();
  const [url, setUrl] = useState<string>("");
  const { mutate } = useMutation(
    orpc.convert.createByUrl.mutationOptions({
      onSuccess: ({ image }) => {
        const lastPathSegment = getLastPathSegment(url);
        const newFile = new File([image], lastPathSegment, {
          type: image.type,
        });
        if (isFileExists(files, newFile)) {
          toast.error(`"${newFile.name}" has already been uploaded`);
        } else {
          addFile(newFile);
          toast.success(`"${newFile.name}" has been added`);
          setUrl("");
        }
      },
      onError: (_error) => {
        toast.error("Failed to add URL");
      },
    }),
  );
  return (
    <div className="flex flex-col gap-2 w-full my-2">
      <Label className="text-muted-foreground">By URL: </Label>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button
          type="button"
          variant="outline"
          disabled={!url}
          onClick={() => mutate({ url })}
        >
          Add URL
        </Button>
      </div>
    </div>
  );
}
