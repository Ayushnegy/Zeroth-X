import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import { handleSignIn, handleSignOut } from '@/lib/actions';
import { Rocket } from 'lucide-react';

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <Rocket className="h-6 w-6" />
            <span className="font-bold text-xl tracking-tight text-foreground">FirstPR Pro</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            {session ? (
              <>
                <Link href="/feed" className="text-secondaryText hover:text-foreground text-sm sm:text-base font-medium transition-colors">Find Issues</Link>
                <Link href="/bookmarks" className="text-secondaryText hover:text-foreground text-sm sm:text-base font-medium transition-colors">Bookmarks</Link>
                <div className="flex items-center gap-3 sm:ml-4 sm:pl-4 sm:border-l border-border">
                  <span className="hidden sm:inline-block text-sm font-semibold">{session.user?.username || session.user?.name}</span>
                  {session.user?.avatar ? (
                    <Image src={session.user.avatar as string} alt="avatar" width={32} height={32} className="rounded-full border border-border" />
                  ) : null}
                  <form action={handleSignOut}>
                    <button type="submit" className="text-sm font-medium border border-border bg-card hover:bg-secondaryBg px-3 py-1.5 rounded-md transition-colors shadow-sm">Sign Out</button>
                  </form>
                </div>
              </>
            ) : (
              <form action={handleSignIn}>
                <button type="submit" className="bg-foreground text-card hover:bg-foreground/90 font-medium px-4 py-2 rounded-md transition-colors shadow-sm text-sm sm:text-base">
                  Sign in with GitHub
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
