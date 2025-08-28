import { FilesProvider } from "@/components/providers/files-provider";
// import { FileConverter } from "./_components/file-converter";
import { HelloWorld } from "./_components/hello-world";

export default function Home() {
  return (
    <FilesProvider>
      <div className="font-sans min-h-[calc(100vh-150px)] p-8 pb-20 gap-16 sm:p-20 flex flex-col items-center">
        <main className="flex flex-col gap-8 w-full max-w-lg mx-auto">
          {/* <FileConverter /> */}
          <HelloWorld />
        </main>
      </div>
    </FilesProvider>
  );
}
