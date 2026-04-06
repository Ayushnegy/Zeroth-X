export async function searchGithubIssues(languages: string[], accessToken?: string, page = 1) {
  if (!languages || languages.length === 0) {
    return _fetchIssuesForLanguage('', accessToken, page);
  }

  const promises = languages.map(lang => _fetchIssuesForLanguage(lang, accessToken, page));
  const results = await Promise.all(promises);
  
  const allItems = results.flat();
  const uniqueItems = Array.from(new Map(allItems.map(item => [item.id, item])).values());
  
  uniqueItems.sort((a: { created_at: string }, b: { created_at: string }) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  
  return uniqueItems.slice(0, 50);
}

async function _fetchIssuesForLanguage(lang: string, accessToken: string | undefined, page: number) {
  const queryParts = [
    'is:issue',
    'is:open',
    'label:"good first issue"',
  ];

  if (lang) {
    queryParts.push(`language:${lang}`);
  }

  const q = encodeURIComponent(queryParts.join(' '));
  const url = `https://api.github.com/search/issues?q=${q}&sort=created&order=desc&per_page=50&page=${page}`;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    headers,
    cache: 'no-store',
  });

  if (!response.ok) {
    if (response.status === 403 || response.status === 429) {
      throw new Error(`GitHub API rate limit exceeded. Please try again later.`);
    }
    throw new Error(`Failed to fetch from GitHub: ${response.statusText}`);
  }

  const data = await response.json();
  return data.items || [];
}

export async function fetchRepoDetails(repoFullName: string, accessToken?: string) {
  const url = `https://api.github.com/repos/${repoFullName}`;
  
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    headers,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return { stars: 0, language: null };
  }

  const data = await response.json();
  return {
    stars: data.stargazers_count,
    language: data.language,
  };
}

export async function fetchUserContributions(username: string, accessToken?: string) {
  const queryParts = [
    `author:${username}`,
    'is:public'
  ];

  const q = encodeURIComponent(queryParts.join(' '));
  const url = `https://api.github.com/search/issues?q=${q}&sort=created&order=desc&per_page=100`;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (accessToken && accessToken !== 'undefined') {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    headers,
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    if (response.status === 403 || response.status === 429) {
      console.warn(`GitHub API rate limit exceeded when fetching contributions for ${username}.`);
      return [];
    }
    console.error(`Failed to fetch contributions from GitHub: ${response.statusText}`);
    return [];
  }

  const data = await response.json();
  return data.items || [];
}
