import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import UserPrefs from '@/models/UserPrefs';
import { searchGithubIssues, fetchRepoDetails } from '@/lib/githubApi';
import { rankIssues } from '@/lib/ranker';

export async function GET() {
  const session = await auth();
  if (!session?.user?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const prefs = await UserPrefs.findOne({ userId: session.user.userId });
    
    if (!prefs || !prefs.skills?.length) {
      return NextResponse.json({ error: 'Preferences missing' }, { status: 400 });
    }

    const token = session.user.provider === 'github' ? session.user.accessToken : undefined;
    const rawIssues = await searchGithubIssues(prefs.languages || [], token, 1);
    
    const uniqueRepoUrls = Array.from(new Set(rawIssues.map((i: { repository_url: string }) => i.repository_url))) as string[];
    const repoDetailsMap: Record<string, { stars: number, language: string | null }> = {};
    
    await Promise.all(uniqueRepoUrls.map(async (url: string) => {
      const repoParts = url.split('/');
      const repoFullName = `${repoParts[repoParts.length - 2]}/${repoParts[repoParts.length - 1]}`;
      try {
         repoDetailsMap[url] = await fetchRepoDetails(repoFullName, token);
      } catch {
         repoDetailsMap[url] = { stars: 0, language: null };
      }
    }));

    const issuesWithDetails = rawIssues.map((issue: Record<string, unknown> & { repository_url: string }) => ({
      ...issue,
      stars: repoDetailsMap[issue.repository_url]?.stars || 0,
      language: repoDetailsMap[issue.repository_url]?.language || null
    }));

    const ranked = rankIssues(issuesWithDetails, prefs.skills);

    return NextResponse.json(ranked);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
