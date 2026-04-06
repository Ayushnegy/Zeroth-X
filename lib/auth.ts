import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

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
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token
        token.provider = account.provider
        
        if (account.provider === 'github') {
          token.userId = profile.id?.toString() || account.providerAccountId
          token.username = (profile as { login?: string }).login
          token.avatar = profile.avatar_url
        } else if (account.provider === 'google') {
          token.userId = profile.sub || account.providerAccountId
          token.username = profile.name || profile.email
          token.avatar = (profile as { picture?: string }).picture
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const user = session.user as any;
        user.accessToken = token.accessToken;
        user.userId = token.userId;
        user.username = token.username;
        user.avatar = token.avatar;
        user.provider = token.provider;
      }
      return session
    },
  },
})
