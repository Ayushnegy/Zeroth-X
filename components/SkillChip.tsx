import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface SkillChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function SkillChip({ label, selected, onClick }: SkillChipProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all shadow-sm",
        selected 
          ? "bg-primary text-card border-primary" 
          : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-secondaryBg"
      )}
    >
      {selected && <Check className="w-4 h-4" />}
      {label}
    </button>
  );
}
