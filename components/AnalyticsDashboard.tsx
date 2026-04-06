'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Flame, GitMerge, GitPullRequest, CircleDot, CheckCircle, Rocket, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import Link from 'next/link';

type Contribution = {
  id: number;
  title: string;
  url: string;
  type: string;
  state: string;
  createdAt: string;
  mergedAt: string | null;
  repo: string;
};

type Milestone = {
  id: string;
  title: string;
  icon: string;
  achieved: boolean;
};

type AnalyticsData = {
  stats: {
    totalPRs: number;
    totalIssues: number;
    mergedPRs: number;
    currentStreak: number;
  };
  milestones: Milestone[];
  recentContributions: Contribution[];
};

const iconMap: Record<string, React.ReactNode> = {
  Rocket: <Rocket className="w-6 h-6" />,
  CheckCircle: <CheckCircle className="w-6 h-6" />,
  Award: <Award className="w-6 h-6" />,
  Flame: <Flame className="w-6 h-6" />,
};

function StatCard({ title, value, icon, gradient }: { title: string; value: number | string; icon: React.ReactNode; gradient: string }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative overflow-hidden rounded-2xl border border-border bg-darkcard p-6 shadow-lg`}
    >
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl ${gradient}`} />
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sans font-medium text-secondaryText">{title}</h3>
        <div className="p-2 rounded-lg bg-darkbase border border-border">
          {icon}
        </div>
      </div>
      <p className="font-heading font-bold text-4xl text-foreground">
        {value}
      </p>
    </motion.div>
  );
}

function MilestoneBadge({ milestone }: { milestone: Milestone }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="flex flex-col items-center gap-3 p-4 rounded-xl border border-border bg-darkcard shadow-md flex-1 min-w-[120px]"
    >
      <div className={clsx(
        "p-4 rounded-full shadow-[0_0_15px_rgba(0,212,255,0.3)]",
        milestone.achieved ? "bg-gradient-to-br from-primary/20 to-secondary/20 text-primary" : "bg-darkbase text-secondaryText grayscale"
      )}>
        {iconMap[milestone.icon] || <Award className="w-6 h-6" />}
      </div>
      <p className="font-sans text-sm font-semibold text-center text-foreground">
        {milestone.title}
      </p>
    </motion.div>
  );
}

function ContributionItem({ item }: { item: Contribution }) {
  const isMerged = item.state === 'closed' && item.mergedAt;
  const isClosed = item.state === 'closed' && !item.mergedAt;
  const isOpen = item.state === 'open';

  return (
    <motion.div
      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255,255,255,0.03)' }}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-darkcard transition-colors gap-4"
    >
      <div className="flex items-start gap-4">
        <div className="mt-1">
          {item.type === 'pr' ? (
            isMerged ? <GitMerge className="w-5 h-5 text-purple-500" /> : <GitPullRequest className={clsx("w-5 h-5", isOpen ? "text-green-500" : "text-red-500")} />
          ) : (
            <CircleDot className={clsx("w-5 h-5", isOpen ? "text-green-500" : "text-purple-500")} />
          )}
        </div>
        <div>
          <Link href={item.url} target="_blank" className="font-medium text-foreground hover:text-primary transition-colors hover:underline line-clamp-1">
            {item.title}
          </Link>
          <div className="flex items-center gap-2 mt-1 text-xs text-secondaryText font-mono">
            <span>{item.repo}</span>
            <span>•</span>
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <div className={clsx(
          "px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border",
          isMerged ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
          isOpen ? "bg-green-500/10 text-green-400 border-green-500/20" :
          "bg-red-500/10 text-red-400 border-red-500/20"
        )}>
          {isMerged ? 'Merged' : isOpen ? 'Open' : 'Closed'}
        </div>
        <div className={clsx(
          "px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wider border",
          item.type === 'pr' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
        )}>
          {item.type === 'pr' ? 'PR' : 'Issue'}
        </div>
      </div>
    </motion.div>
  );
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/analytics');
        if (!res.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-secondaryText font-mono animate-pulse">Scanning GitHub Network...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-xl max-w-2xl mx-auto mt-12">
        <p className="text-red-400 font-medium">{error || 'Could not load dashboard data.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight">Your Progress Matrix</h1>
        <p className="text-secondaryText text-lg">Track your open source contributions and impact.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total PRs" value={data.stats.totalPRs} icon={<GitPullRequest className="text-blue-400" />} gradient="bg-blue-500" />
        <StatCard title="Total Issues" value={data.stats.totalIssues} icon={<CircleDot className="text-purple-400" />} gradient="bg-purple-500" />
        <StatCard title="Merged PRs" value={data.stats.mergedPRs} icon={<GitMerge className="text-green-400" />} gradient="bg-green-500" />
        <StatCard title="Current Streak" value={`${data.stats.currentStreak} Days`} icon={<Flame className="text-orange-400" />} gradient="bg-orange-500" />
      </div>

      {/* Milestones */}
      {data.milestones && data.milestones.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-heading font-semibold pb-2 border-b border-border text-foreground">Unlocked Achievements</h2>
          <div className="flex flex-wrap gap-4">
            {data.milestones.map(m => (
              <MilestoneBadge key={m.id} milestone={m} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Contributions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-heading font-semibold pb-2 border-b border-border text-foreground">Completed Contributions</h2>
        {data.recentContributions.length > 0 ? (
          <div className="flex flex-col gap-3">
            {data.recentContributions.map(item => (
              <ContributionItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border border-border bg-darkcard rounded-xl border-dashed">
             <div className="bg-darkbase w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 border border-border shadow-inner">
               <Rocket className="w-8 h-8 text-secondaryText opacity-50" />
             </div>
             <p className="text-foreground font-medium mb-1">No contributions detected yet.</p>
             <p className="text-secondaryText text-sm mb-4">Start your open source journey and watch your progress grow!</p>
             <Link href="/feed" className="inline-flex items-center justify-center bg-primary text-darkbase font-medium px-4 py-2 rounded-lg hover:shadow-[0_0_15px_rgba(0,212,255,0.4)] transition-all">
                Find your first issue
             </Link>
          </div>
        )}
      </div>
    </div>
  );
}
