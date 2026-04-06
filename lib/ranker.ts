export interface RankedIssue {
  issueId: number;
  title: string;
  url: string;
  repoName: string;
  repoOwner: string;
  labels: string[];
  language?: string;
  stars?: number;
  createdAt: string;
  relevanceScore: number;
}

interface RawIssue {
  number: number;
  title: string;
  html_url: string;
  repository_url: string;
  labels?: Array<{ name: string }>;
  body?: string;
  stars?: number;
  language?: string;
  created_at: string;
}

export function rankIssues(issues: RawIssue[], userSkills: string[]): RankedIssue[] {
  const lowercaseSkills = userSkills.map(s => s.toLowerCase());

  return issues.map(issue => {
    let score = 0;

    const repoParts = issue.repository_url.split('/');
    const repoOwner = repoParts[repoParts.length - 2];
    const repoName = repoParts[repoParts.length - 1];

    const labels = (issue.labels || []).map((l: { name: string }) => l.name);

    // 1. Label signals (Max 30)
    const hasGoodFirst = labels.some((l: string) => l.toLowerCase() === 'good first issue');
    const hasHelpWanted = labels.some((l: string) => l.toLowerCase() === 'help wanted');
    
    if (hasGoodFirst) score += 20;
    if (hasHelpWanted) score += 10;

    // 2. Skill Keyword matching (Max 40)
    const searchableTitle = issue.title.toLowerCase();
    const searchableBody = (issue.body || '').toLowerCase();
    const searchableLabels = labels.map((l: string) => l.toLowerCase()).join(' ');

    let skillScore = 0;
    lowercaseSkills.forEach(skill => {
      try {
        const regex = new RegExp(`\\b${skill}\\b`, 'i');
        if (regex.test(searchableTitle)) {
          skillScore += 15;
        } else if (regex.test(searchableBody) || regex.test(searchableLabels)) {
          skillScore += 8;
        }
      } catch {
        if (searchableTitle.includes(skill)) skillScore += 15;
        else if (searchableBody.includes(skill) || searchableLabels.includes(skill)) skillScore += 8;
      }
    });
    score += Math.min(skillScore, 40);

    // 3. Repo quality signals (Max 30)
    const stars = issue.stars || 0;
    let repoScore = 0;
    if (stars >= 5000) repoScore += 20;
    else if (stars >= 1000) repoScore += 10;

    const createdDate = new Date(issue.created_at);
    const now = new Date();
    const diffDays = (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
    
    if (diffDays <= 7) repoScore += 10;
    else if (diffDays <= 30) repoScore += 5;

    score += Math.min(repoScore, 30);

    return {
      issueId: issue.number,
      title: issue.title,
      url: issue.html_url,
      repoName,
      repoOwner,
      labels,
      language: issue.language || 'Unknown',
      stars,
      createdAt: issue.created_at,
      relevanceScore: Math.min(score, 100),
    };
  }).sort((a, b) => b.relevanceScore - a.relevanceScore);
}
