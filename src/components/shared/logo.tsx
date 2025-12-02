import { APP_NAME } from "@/lib/constant";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import * as React from "react";

interface LogoProps {
  className?: string;
}

export const Logo: React.FC<LogoProps> = () => {
  return (
    <Link href="#" className="flex flex-col items-center gap-2 font-medium">
      <div className="flex size-8 items-center justify-center rounded-md">
        <GalleryVerticalEnd className="size-6" />
      </div>
      <span className="sr-only">{APP_NAME}</span>
    </Link>
  );
};
