import JSZip from "jszip";
import { v4 as uuidv4 } from "uuid";
export const useDownload = () => {
  const id = uuidv4();
  async function handleZip(files: { image: Blob; fileName: string }[]) {
    const zip = new JSZip();

    files.forEach((file) => {
      zip.file(file.fileName, file.image);
    });

    // Generate the zip file
    const zipData = await zip.generateAsync({
      type: "blob",
      streamFiles: true,
    });

    // Create a download link for the zip file
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(zipData);
    link.download = `${id}.zip`;
    link.click();
  }

  function handleSingleFileDownload({
    blob,
    fileName,
  }: {
    blob: Blob;
    fileName: string;
  }) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return { handleZip, handleSingleFileDownload };
};
