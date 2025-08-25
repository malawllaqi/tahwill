import { randomUUID } from "node:crypto";
import { os } from "@orpc/server";
import sharp, { type ResizeOptions } from "sharp";
import { z } from "zod";
import type { FormatType } from "@/lib/types";

const ConvertSchema = z.object({
  //   id: z.string(),
  file: z.instanceof(File),
  format: z.custom<FormatType>(),
  resize: z.custom<ResizeOptions>().optional(),
});

const ConvertOutputSchema = z.object({
  id: z.string(),
  image: z.instanceof(Blob),
  fileName: z.string(),
});

export const createConvert = os
  .input(ConvertSchema)
  .output(ConvertOutputSchema)
  .handler(async ({ input }) => {
    const buffer = Buffer.from(await input.file.arrayBuffer());
    const formatedImage = await sharp(buffer)
      .toFormat(input.format, {
        compressionLevel: 9,
        quality: 60,
        palette: true,
      })
      .resize(input.resize)
      .toBuffer();

    const fileName =
      input.file.name.replace(/\.[^/.]+$/, "") +
      `.${input.format.toLowerCase()}`;

    const image = new Blob([formatedImage], {
      type: `image/${input.format.toLowerCase()}`,
    });

    return {
      id: randomUUID(),
      image,
      fileName,
    };
  });

export const router = {
  convert: {
    create: createConvert,
  },
};
