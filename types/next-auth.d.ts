import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      githubId?: string;
      username?: string;
      avatar?: string;
      accessToken?: string;
    } & DefaultSession['user'];
  }
}
