import { Dice1, Github } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 xl:top-2 z-50 bg-background/50 backdrop-blur-sm">
      <div className="flex items-center justify-between border xl:rounded-xl px-6 xl:my-2 py-1.5 max-w-7xl mx-auto">
        <div className="flex items-center gap-1">
          <Dice1 className="size-4" />
          <h1 className="text-sm font-bold">Tahweel</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="https://github.com/malawllaqi"
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <Github />
          </a>
        </div>
      </div>
    </header>
  );
}
