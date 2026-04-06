'use client';
import { ListFilter } from 'lucide-react';

interface FilterBarProps {
  onLanguageChange: (lang: string) => void;
  onStarsChange: (stars: string) => void;
  onSortChange: (sort: string) => void;
}

export default function FilterBar({ onLanguageChange, onStarsChange, onSortChange }: FilterBarProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm mb-6">
      <div className="flex items-center gap-2 text-foreground font-medium text-sm">
        <ListFilter className="w-4 h-4 text-primary" />
        Filters
      </div>
      
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto text-sm">
        <select 
          onChange={(e) => onLanguageChange(e.target.value)}
          className="bg-background border border-border text-foreground rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
        >
          <option value="">All Languages</option>
          <option value="JavaScript">JavaScript</option>
          <option value="TypeScript">TypeScript</option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
        </select>
        
        <select 
          onChange={(e) => onStarsChange(e.target.value)}
          className="bg-background border border-border text-foreground rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
        >
          <option value="">Any Stars</option>
          <option value="100">100+</option>
          <option value="1000">1k+</option>
          <option value="5000">5k+</option>
        </select>
        
        <select 
          onChange={(e) => onSortChange(e.target.value)}
          className="bg-background border border-border text-foreground rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
        >
          <option value="relevance">Relevance</option>
          <option value="newest">Newest</option>
          <option value="stars">Most Stars</option>
        </select>
      </div>
    </div>
  );
}
