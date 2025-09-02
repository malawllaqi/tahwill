import { call, os } from "@orpc/server";
import sharp, { type ResizeOptions } from "sharp";
import { z } from "zod";
import type { FormatType } from "@/lib/types";

const FormatSchemaInput = z.object({
  id: z.string(),
  file: z.instanceof(File),
  format: z.custom<FormatType>(),
  resize: z.custom<ResizeOptions>().optional(),
});

const FormatOutputSchema = z.object({
  id: z.string(),
  image: z.instanceof(Blob),
  fileName: z.string(),
});

export const createFormat = os
  .input(FormatSchemaInput)
  .output(FormatOutputSchema)
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

    const image = new Blob([new Uint8Array(formatedImage)], {
      type: `image/${input.format.toLowerCase()}`,
    });

    return {
      id: input.id,
      image,
      fileName,
    };
  });

export const createFormatMany = os
  .input(
    z.object({
      files: z.array(FormatSchemaInput),
    }),
  )
  .output(
    z.array(
      z.object({
        id: z.string(),
        image: z.instanceof(Blob),
        fileName: z.string(),
      }),
    ),
  )
  .handler(async ({ input }) => {
    const images = await Promise.all(
      input.files.map(async ({ id, file, format, resize }) => {
        const image = await call(createFormat, { id, file, format, resize });
        return image;
      }),
    );
    return images;
  });
export const createFormatByUrl = os
  .input(z.object({ url: z.string() }))
  .output(z.object({ image: z.instanceof(Blob) }))
  .handler(async ({ input }) => {
    const response = await fetch(input.url);
    const blob = await response.blob();
    return { image: blob };
  });

export const router = {
  convert: {
    create: createFormat,
    createMany: createFormatMany,
    createByUrl: createFormatByUrl,
  },
};
