import { call, os } from "@orpc/server";
import sharp, { type ResizeOptions } from "sharp";
import { z } from "zod";
import type { FormatType } from "@/lib/types";

const ConvertSchema = z.object({
  id: z.string(),
  file: z.instanceof(File),
  format: z.custom<FormatType>(),
  resize: z.custom<ResizeOptions>().optional(),
});

const ConvertOutputSchema = z.object({
  id: z.string(),
  image: z.instanceof(Blob),
  fileName: z.string(),
});

export const helloWorld = os
  .input(z.object({ name: z.string() }))
  .output(z.string())
  .handler(async ({ input }) => {
    return `Hello ${input.name}`;
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

    const image = new Blob([new Uint8Array(formatedImage)], {
      type: `image/${input.format.toLowerCase()}`,
    });

    return {
      id: input.id,
      image,
      fileName,
    };
  });

export const createConvertMany = os
  .input(
    z.object({
      files: z.array(ConvertSchema),
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
        const image = await call(createConvert, { id, file, format, resize });
        return image;
      }),
    );
    return images;
  });
export const createConvertByUrl = os
  .input(z.object({ url: z.string() }))
  .output(z.object({ image: z.instanceof(Blob) }))
  .handler(async ({ input }) => {
    const response = await fetch(input.url);
    const blob = await response.blob();
    return { image: blob };
  });

export const router = {
  convert: {
    create: createConvert,
    createMany: createConvertMany,
    createByUrl: createConvertByUrl,
  },
  helloWorld: helloWorld,
};
