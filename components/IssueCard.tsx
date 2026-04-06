'use client';
import { Bookmark, Clock, GitBranch, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface IssueCardProps {
  issue: {
    issueId: number;
    title: string;
    url: string;
    repoName: string;
    repoOwner: string;
    labels: string[];
    language?: string;
    stars?: number;
    relevanceScore?: number;
    createdAt?: string;
    savedAt?: string;
    [key: string]: unknown;
  };
  onBookmarkToggle?: (issueId: number) => void;
  isBookmarked?: boolean;
}

export default function IssueCard({ issue, onBookmarkToggle, isBookmarked = false }: IssueCardProps) {
  const score = issue.relevanceScore || 0;
  
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow group flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start gap-4 mb-3">
          <a href={issue.url} target="_blank" rel="noreferrer" className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
            {issue.title}
          </a>
          {score > 0 && (
            <span className={cn(
              "px-2.5 py-1 text-xs font-bold rounded-full whitespace-nowrap",
              score >= 80 ? "bg-success/10 text-success" : score >= 50 ? "bg-primary/10 text-primary" : "bg-secondaryBg text-secondaryText"
            )}>
              {score} / 100
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-secondaryText mb-4">
          <GitBranch className="w-4 h-4" />
          <span className="font-medium">{issue.repoOwner}/{issue.repoName}</span>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span>{issue.stars || 0}</span>
          </div>
          {issue.language && (
            <>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                {issue.language}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {issue.labels?.map((label: string) => (
            <span key={label} className="px-2 py-0.5 bg-secondaryBg text-secondaryText border border-border/50 rounded text-xs font-medium">
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-secondaryText">
          <Clock className="w-3.5 h-3.5" />
          <span>{new Date(issue.createdAt || issue.savedAt || Date.now()).toLocaleDateString()}</span>
        </div>
        <button
          onClick={() => onBookmarkToggle?.(issue.issueId)}
          className={cn("transition-colors p-1 rounded-full hover:bg-secondaryBg", isBookmarked ? "text-primary" : "text-secondaryText hover:text-foreground")}
          title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
        >
          <Bookmark className={cn("w-5 h-5", isBookmarked && "fill-primary")} />
        </button>
      </div>
    </div>
  );
}
