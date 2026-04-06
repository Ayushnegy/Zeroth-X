import Link from "next/link";
import { FolderSearch } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function EmptyState({ title, description, ctaText, ctaHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-background border-2 border-border border-dashed rounded-xl">
      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
        <FolderSearch className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
      <p className="text-secondaryText max-w-md mb-8">{description}</p>
      
      {ctaText && ctaHref && (
        <Link href={ctaHref} className="bg-foreground text-background font-medium px-6 py-2.5 rounded-md hover:bg-foreground/90 transition-colors shadow-sm">
          {ctaText}
        </Link>
      )}
    </div>
  );
}
