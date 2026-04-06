'use client';

import IssueCard from '@/components/IssueCard';
import EmptyState from '@/components/EmptyState';
import SkeletonCard from '@/components/SkeletonCard';
import { useState, useEffect } from 'react';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/bookmarks')
      .then(res => res.json())
      .then(data => {
        setBookmarks(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleBookmarkToggle = async (issueId: number) => {
    const updated = bookmarks.filter(b => b.issueId !== issueId);
    setBookmarks(updated);
    
    try {
      await fetch(`/api/bookmarks/${issueId}`, { method: 'DELETE' });
    } catch (e) {
      alert('Failed to remove bookmark');
    }
  };

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Saved Bookmarks</h1>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookmarks.map(issue => (
              <IssueCard 
                key={issue.issueId} 
                issue={issue} 
                isBookmarked={true}
                onBookmarkToggle={handleBookmarkToggle} 
              />
            ))}
          </div>
        ) : (
          <div className="mt-8">
            <EmptyState 
              title="No bookmarks yet" 
              description="You haven't saved any issues yet. Go back to the feed to find interesting problems to solve!"
              ctaText="Explore Issues"
              ctaHref="/feed"
            />
          </div>
        )}
      </main>
    </>
  );
}
