
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

        {/* ── Learning Path Banner ── */}
        <div className="mt-24 w-full max-w-5xl mx-auto px-4">
          <div
            className="relative overflow-hidden rounded-3xl border border-primary/30 shadow-xl"
            style={{
              background:
                'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
            }}
          >
            {/* decorative blobs */}
            <div
              className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{ background: '#6366f1' }}
            />
            <div
              className="absolute -bottom-16 -right-16 w-60 h-60 rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{ background: '#3b82f6' }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-10 py-12">
              {/* left: icon + text */}
              <div className="flex items-start gap-5 text-left">
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg"
                  style={{ background: 'rgba(99,102,241,0.25)' }}
                >
                  {/* Map / Road icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#a5b4fc"
                    strokeWidth={1.8}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>

                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: '#a5b4fc' }}
                  >
                    New ✦ Resource
                  </p>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                    Not sure where to start?
                  </h2>
                  <p className="mt-2 text-sm md:text-base max-w-md" style={{ color: '#94a3b8' }}>
                    Follow a structured, beginner-friendly learning path to master
                    open-source contribution — from your very first commit to your
                    first merged PR.
                  </p>
                </div>
              </div>

              {/* right: CTA button */}
              <a
                href="https://oss-learning-path.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-base text-white transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
                  boxShadow: '0 0 30px rgba(99,102,241,0.5)',
                }}
              >
                {/* button glow on hover */}
                <span
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    boxShadow: '0 0 50px rgba(99,102,241,0.8)',
                  }}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 relative z-10"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <span className="relative z-10">Open Source Learning</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
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
