# FirstPR Pro

Find Your First Open Source Contribution

FirstPR Pro is a personalized GitHub "good first issue" recommendation web application for beginner open-source contributors. It authenticates users via GitHub OAuth, gathers their skills and experience, and instantly provides a ranked, tailored feed of GitHub issues they can contribute to.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account (Free tier)
- GitHub Developer Account

### 1. Clone & Install
```bash
git clone <repository_url>
cd firstpr-pro
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:
```
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
```

> **Note:** Generate a NextAuth secret using `npx auth secret` or a random string generator.

### 3. Setup GitHub OAuth
1. Go to your GitHub Settings -> Developer settings -> OAuth Apps.
2. Create a new OAuth App.
3. Set the Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
4. Copy your Client ID and Client Secret into `.env.local`.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Ranking Algorithm

The application features a custom server-side ranking algorithm to push the most relevant beginner issues to the top. It calculates a score out of 100 based on three categories:

1. **Label Signals (Max 30 points):** 
   - +20 points for "good first issue" label.
   - +10 points for "help wanted" label.

2. **Skill Keyword Matching (Max 40 points):**
   - Matches the user's selected skills against the issue title, body, and labels.
   - +15 points for matched skills in the title.
   - +8 points for matched skills in the body or labels.

3. **Repository Quality Signals (Max 30 points):**
   - Repo Activity: +10 if created within the last 7 days, +5 if within 30 days.
   - Popularity: +20 points for repositories with > 5000 stars, +10 points for > 1000 stars.

---

## API Endpoints

### Authentication
Handled automatically by NextAuth at `/api/auth/*`.

### User Preferences
- **`GET /api/prefs`**
  - **Description**: Returns saved preferences for the authenticated user.
  - **Response**: `UserPrefs` object containing skills, languages, experience.
- **`POST /api/prefs`**
  - **Description**: Upserts the user.
  - **Accepted**: `{ skills: string[], experience: string, languages: string[] }`
  - **Response**: Updated `UserPrefs` document.

### Recommendations
- **`GET /api/recommend`**
  - **Description**: Fetches personalized ranked issues.
  - **Response**: Array of `RankedIssue` objects with a `relevanceScore`.

### Bookmarks
- **`GET /api/bookmarks`**
  - **Description**: Returns all saved bookmarks for the active user.
  - **Response**: Array of `Bookmark` objects.
- **`POST /api/bookmarks`**
  - **Description**: Saves a new bookmark linked to the user's GitHub ID.
  - **Accepted**: `{ issueId: number, title: string, url: string, repoName: string, repoOwner: string, labels: string[], language: string, stars: number }`
  - **Response**: Created `Bookmark` object or HTTP 409 if exists.
- **`DELETE /api/bookmarks/:issueId`**
  - **Description**: Deletes a specific bookmark for the active user.
  - **Response**: `{ success: true }`

