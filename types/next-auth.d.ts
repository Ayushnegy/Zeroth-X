import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      userId?: string;
      provider?: string;
      username?: string;
      avatar?: string;
      accessToken?: string;
    } & DefaultSession['user'];
  }
}
