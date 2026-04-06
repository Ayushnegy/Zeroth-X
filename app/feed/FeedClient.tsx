'use client';
import IssueCard from '@/components/IssueCard';
import FilterBar from '@/components/FilterBar';
import SkeletonCard from '@/components/SkeletonCard';
import EmptyState from '@/components/EmptyState';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FeedClient() {
  const router = useRouter();
  const [issues, setIssues] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const [languageFilter, setLanguageFilter] = useState('');
  const [starsFilter, setStarsFilter] = useState('');
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    Promise.all([
      fetch('/api/recommend').then(res => {
        if (res.status === 400) {
          router.push('/skills');
          throw new Error('No preferences');
        }
        return res.json();
      }),
      fetch('/api/bookmarks').then(res => res.json())
    ]).then(([recommendData, bookmarksData]) => {
      setIssues(recommendData.error ? [] : recommendData);
      setBookmarks(new Set((bookmarksData || []).map((b: any) => b.issueId)));
      setLoading(false);
    }).catch(console.error);
  }, [router]);

  const handleBookmarkToggle = async (issueId: number) => {
    const isBookmarked = bookmarks.has(issueId);

    setBookmarks(prev => {
      const next = new Set(prev);
      if (isBookmarked) next.delete(issueId);
      else next.add(issueId);
      return next;
    });

    try {
      if (isBookmarked) {
        await fetch(`/api/bookmarks/${issueId}`, { method: 'DELETE' });
      } else {
        const issue = issues.find(i => i.issueId === issueId);
        await fetch('/api/bookmarks', {
          method: 'POST',
          body: JSON.stringify({
            issueId,
            title: issue.title,
            url: issue.url,
            repoName: issue.repoName,
            repoOwner: issue.repoOwner,
            labels: issue.labels,
            language: issue.language,
            stars: issue.stars
          })
        });
      }
    } catch (e) {
      setBookmarks(prev => {
        const next = new Set(prev);
        if (!isBookmarked) next.delete(issueId);
        else next.add(issueId);
        return next;
      });
      alert('Failed to update bookmark');
    }
  };

  const filteredIssues = issues.filter(issue => {
    if (languageFilter && issue.language?.toLowerCase() !== languageFilter.toLowerCase()) return false;
    if (starsFilter && (issue.stars || 0) < parseInt(starsFilter)) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'stars') return (b.stars || 0) - (a.stars || 0);
    return b.relevanceScore - a.relevanceScore;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Your Recommended Issues</h1>

      <FilterBar
        onLanguageChange={setLanguageFilter}
        onStarsChange={setStarsFilter}
        onSortChange={setSortBy}
      />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
        </div>
      ) : filteredIssues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {filteredIssues.map((issue: any) => (
            <IssueCard
              key={issue.issueId}
              issue={issue}
              isBookmarked={bookmarks.has(issue.issueId)}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            title="No issues found"
            description="We couldn't find any issues matching your criteria. Try adjusting your filters or broadening your skills."
            ctaText="Update Skills"
            ctaHref="/skills"
          />
        </div>
      )}
    </main>
  );
}
