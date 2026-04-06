import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { fetchUserContributions } from '@/lib/githubApi';

export const dynamic = 'force-dynamic';

// ✅ Proper type instead of `any`
type GithubItem = {
  id: number;
  title: string;
  html_url: string;
  state: string;
  created_at: string;
  repository_url: string;
  pull_request?: {
    merged_at: string | null;
  };
};

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { username, accessToken } = session.user as {
      username?: string;
      accessToken?: string;
    };

    if (!username) {
      return NextResponse.json({ error: 'GitHub username not found' }, { status: 400 });
    }

    const contributions = await fetchUserContributions(username, accessToken);

    let totalPRs = 0;
    let totalIssues = 0;
    let mergedPRs = 0;

    // ✅ No `any` used here
    const recentContributions = (contributions as GithubItem[]).map((item) => {
      const isPR = !!item.pull_request;

      if (isPR) {
        totalPRs++;
        if (item.pull_request?.merged_at) {
          mergedPRs++;
        }
      } else {
        totalIssues++;
      }

      return {
        id: item.id,
        title: item.title,
        url: item.html_url,
        type: isPR ? 'pr' : 'issue',
        state: item.state,
        createdAt: item.created_at,
        mergedAt: isPR ? item.pull_request?.merged_at : null,
        repo: item.repository_url.split('/').slice(-2).join('/'),
      };
    });

    // ✅ Streak logic
    let currentStreak = 0;

    const dates = new Set(
      recentContributions.map((c) =>
        new Date(c.createdAt).toDateString()
      )
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      if (dates.has(d.toDateString())) {
        currentStreak++;
      } else if (i !== 0) {
        break;
      }
    }

    // ✅ Milestones
    const milestones = [];

    if (totalPRs >= 1)
      milestones.push({ id: 'first_pr', title: 'First PR Opened', icon: 'Rocket', achieved: true });

    if (mergedPRs >= 1)
      milestones.push({ id: 'first_merge', title: 'First PR Merged', icon: 'CheckCircle', achieved: true });

    if (totalPRs >= 10)
      milestones.push({ id: 'ten_prs', title: '10 PRs Club', icon: 'Award', achieved: true });

    if (currentStreak >= 7)
      milestones.push({ id: 'seven_day_streak', title: '7 Day Streak', icon: 'Flame', achieved: true });

    return NextResponse.json({
      stats: {
        totalPRs,
        totalIssues,
        mergedPRs,
        currentStreak,
      },
      milestones,
      recentContributions: recentContributions.slice(0, 10),
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}