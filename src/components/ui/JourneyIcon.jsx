import Image from "next/image";
import { cn } from "@/lib/utils";

export default function JourneyIcon({ src, alt, size = "md", className }) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-9 h-9",
    lg: "w-10 h-10",
  };

  return (
    <span
      className={cn(
        "rounded-full overflow-hidden border border-indigo-300/40 dark:border-[#7c3aed]/30 bg-white dark:bg-neutral-900 flex items-center justify-center shrink-0 shadow-lg ring-4 ring-neutral-50 dark:ring-neutral-900",
        sizeClasses[size],
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={40}
        height={40}
        className="w-full h-full object-contain p-0.5"
      />
    </span>
  );
}
