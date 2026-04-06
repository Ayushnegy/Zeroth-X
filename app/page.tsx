
import { Rocket, Sparkles, Filter, ShieldCheck, ArrowRight } from 'lucide-react';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();
  
  if (session) {
    redirect('/feed');
  }

  return (
    <>
      <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-background py-20 px-4">
        <div className="max-w-3xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Built for Beginners</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground">
            Find Your First <br /> <span className="text-primary">Open Source</span> Contribution
          </h1>
          <p className="text-xl text-secondaryText max-w-2xl mx-auto">
            Stop searching blindly. Tell us your skills and we&apos;ll instantly match you with beginner-friendly issues from real GitHub repositories.
          </p>
          <div className="pt-8">
            <form action={async () => { "use server"; const { signIn } = await import('@/lib/auth'); await signIn('github', { redirectTo: '/skills' }); }}>
              <button className="bg-primary hover:bg-primary/90 text-white font-semibold text-lg px-8 py-4 rounded-xl flex items-center gap-2 mx-auto transition-transform hover:scale-105 active:scale-95 shadow-md">
                Get Started with GitHub <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-32 max-w-5xl mx-auto w-full grid md:grid-cols-3 gap-8">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm text-center">
            <div className="w-12 h-12 bg-secondaryBg rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6 text-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Step 1: Sign in</h3>
            <p className="text-secondaryText">Securely authenticate with GitHub to personalize your layout.</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Step 2: Tell us your skills</h3>
            <p className="text-secondaryText">Select your programming languages and experience level.</p>
          </div>
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm text-center">
            <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Filter className="w-6 h-6 text-success" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Step 3: Get matched issues</h3>
            <p className="text-secondaryText">Browse a curated, ranked list of issues ready for you.</p>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-border py-8 text-center text-sm text-secondaryText">
        <div className="flex items-center justify-center gap-2">
          <span>&copy; {new Date().getFullYear()} FirstPR Pro. Powered by GitHub.</span>
        </div>
      </footer>
    </>
  );
}
