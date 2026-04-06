import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import UserPrefs from '@/models/UserPrefs';
import { searchGithubIssues, fetchRepoDetails } from '@/lib/githubApi';
import { rankIssues } from '@/lib/ranker';

export async function GET() {
  const session = await auth();
  if (!session?.user?.githubId || !session.user.accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const prefs = await UserPrefs.findOne({ githubId: session.user.githubId });
    
    if (!prefs || !prefs.skills?.length) {
      return NextResponse.json({ error: 'Preferences missing' }, { status: 400 });
    }

    const rawIssues = await searchGithubIssues(prefs.languages || [], session.user.accessToken, 1);
    
    const uniqueRepoUrls = Array.from(new Set(rawIssues.map((i: any) => i.repository_url)));
    const repoDetailsMap: Record<string, any> = {};
    
    await Promise.all(uniqueRepoUrls.map(async (url: any) => {
      const repoParts = url.split('/');
      const repoFullName = `${repoParts[repoParts.length - 2]}/${repoParts[repoParts.length - 1]}`;
      try {
         repoDetailsMap[url] = await fetchRepoDetails(repoFullName, session.user!.accessToken!);
      } catch {
         repoDetailsMap[url] = { stars: 0, language: null };
      }
    }));

    const issuesWithDetails = rawIssues.map((issue: any) => ({
      ...issue,
      stars: repoDetailsMap[issue.repository_url]?.stars || 0,
      language: repoDetailsMap[issue.repository_url]?.language || null
    }));

    const ranked = rankIssues(issuesWithDetails, prefs.skills);

    return NextResponse.json(ranked);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
