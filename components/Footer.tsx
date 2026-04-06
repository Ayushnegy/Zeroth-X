import Link from 'next/link';
import { Rocket } from 'lucide-react';

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.02c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A4.8 4.8 0 0 0 8 18v4"></path>
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const developers = [
  { name: 'Sumanshu Jindal', github: 'https://github.com/Sumanshu01', linkedin: 'https://www.linkedin.com/in/sumanshu-jindal-5451b5310/' },
  { name: 'Ayush Negi', github: 'https://github.com/Ayushnegy', linkedin: 'https://www.linkedin.com/in/ayush-negi-345aa631b/' },
  { name: 'Tanmay Gaur', github: 'https://github.com/Tanmay30gaur', linkedin: 'https://www.linkedin.com/in/tanmay-gaur-813a12332/' },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-darkbase/50 backdrop-blur-md mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="flex flex-col items-center md:items-start gap-2 max-w-sm text-center md:text-left">
            <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity group">
              <Rocket className="h-5 w-5 transition-transform group-hover:-translate-y-1 group-hover:drop-shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
              <span className="font-bold text-lg tracking-tight text-foreground font-heading">FirstPR Pro</span>
            </Link>
            <p className="text-secondaryText text-sm font-mono mt-2">
              Empowering your first open source contribution.
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <span className="text-sm text-secondaryText font-medium tracking-wide uppercase">Developed By</span>
            <div className="flex flex-col sm:flex-row items-center gap-x-8 gap-y-4">
              {developers.map((dev) => (
                <div key={dev.name} className="flex flex-col items-center sm:items-end gap-1">
                  <span className="font-semibold text-foreground whitespace-nowrap">{dev.name}</span>
                  <div className="flex items-center gap-3">
                    <a 
                      href={dev.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-secondaryText hover:text-primary transition-colors hover:scale-110 active:scale-95"
                      aria-label={`${dev.name} GitHub`}
                    >
                      <GithubIcon />
                    </a>
                    <a 
                      href={dev.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-secondaryText hover:text-primary transition-colors hover:scale-110 active:scale-95"
                      aria-label={`${dev.name} LinkedIn`}
                    >
                      <LinkedinIcon />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border/50 flex justify-center w-full">
          <p className="text-xs text-secondaryText font-mono text-center">
            &copy; {new Date().getFullYear()} FirstPR Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
