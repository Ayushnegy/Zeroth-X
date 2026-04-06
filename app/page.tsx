import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LandingHero from '@/components/LandingHero';
import { signIn } from '@/lib/auth';

export default async function Home() {
  const session = await auth();
  
  if (session) {
    redirect('/skills');
  }

  const githubSignIn = async () => {
    "use server";
    await signIn('github', { redirectTo: '/skills' });
  };

  const googleSignIn = async () => {
    "use server";
    await signIn('google', { redirectTo: '/skills' });
  };

  return (
    <>
      <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-darkbase selection:bg-primary/30">
        <LandingHero githubAction={githubSignIn} googleAction={googleSignIn} />
      </main>
      
      <footer className="border-t border-border py-8 text-center text-sm font-mono text-secondaryText">
        <div className="flex items-center justify-center gap-2">
          <span>&copy; {new Date().getFullYear()} FirstPR Pro. Powered by GitHub.</span>
        </div>
      </footer>
    </>
  );
}

