import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:user user:email public_repo",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token
        token.githubId = profile.id?.toString() || account.providerAccountId
        token.username = (profile as { login?: string }).login
        token.avatar = profile.avatar_url
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const user = session.user as unknown as Record<string, unknown>;
        user.accessToken = token.accessToken;
        user.githubId = token.githubId;
        user.username = token.username;
        user.avatar = token.avatar;
      }
      return session
    },
  },
})
