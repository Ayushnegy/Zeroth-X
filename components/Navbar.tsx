import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import { handleSignIn, handleSignOut } from '@/lib/actions';
import { Rocket } from 'lucide-react';

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-50 bg-darkbase/80 backdrop-blur-md border-b border-border shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity group">
            <Rocket className="h-6 w-6 transition-transform group-hover:-translate-y-1 group-hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
            <span className="font-bold text-xl tracking-tight text-foreground font-heading">FirstPR Pro</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6 font-mono text-sm leading-none">
            {session ? (
              <>
                <Link href="/dashboard" className="text-secondaryText hover:text-primary transition-colors hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]">Dashboard</Link>
                <Link href="/feed" className="text-secondaryText hover:text-primary transition-colors hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]">Find Issues</Link>
                <Link href="/bookmarks" className="text-secondaryText hover:text-primary transition-colors hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.4)]">Bookmarks</Link>
                <div className="flex items-center gap-3 sm:ml-4 sm:pl-4 sm:border-l border-border h-6">
                  <span className="hidden sm:inline-block font-semibold">{session.user?.username || session.user?.name}</span>
                  {session.user?.avatar ? (
                    <Image src={session.user.avatar as string} alt="avatar" width={32} height={32} className="rounded-full ring-2 ring-primary/20" />
                  ) : null}
                  <form action={handleSignOut}>
                    <button type="submit" className="border border-border bg-darkcard hover:bg-white hover:text-darkbase text-secondaryText px-3 py-1.5 rounded-md transition-colors shadow-sm ml-2">Sign Out</button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 font-sans">
                <form action={handleSignIn.bind(null, 'github')}>
                  <button type="submit" className="bg-foreground text-darkbase font-medium px-4 py-2 rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] text-sm sm:text-base">
                    Sign in with GitHub
                  </button>
                </form>
                <form action={handleSignIn.bind(null, 'google')}>
                  <button type="submit" className="bg-darkcard border border-border text-foreground hover:bg-darkcard/80 font-medium px-4 py-2 rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-sm text-sm sm:text-base">
                    Sign in with Google
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
