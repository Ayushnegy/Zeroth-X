'use client';

import SkillChip from '@/components/SkillChip';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C++', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Dart'];
const FRAMEWORKS = ['React', 'Next.js', 'Vue', 'Angular', 'Django', 'FastAPI', 'Spring', 'Flutter'];
const OTHER = ['CSS', 'HTML', 'GraphQL', 'Docker', 'Kubernetes', 'Git'];

export default function SkillsPage() {
  const router = useRouter();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLangs, setSelectedLangs] = useState<string[]>([]);
  const [experience, setExperience] = useState<'beginner'|'intermediate'|'advanced'>('beginner');
  const [customSkill, setCustomSkill] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/prefs')
      .then(res => res.json())
      .then(data => {
        if (data.skills) setSelectedSkills(data.skills);
        if (data.languages) setSelectedLangs(data.languages);
        if (data.experience) setExperience(data.experience);
        setLoading(false);
      });
  }, []);

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  };

  const handleCustomSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customSkill.trim()) {
      if (!selectedSkills.includes(customSkill.trim())) {
        setSelectedSkills([...selectedSkills, customSkill.trim()]);
      }
      setCustomSkill('');
    }
  };

  const handleSave = async () => {
    if (selectedSkills.length === 0 && selectedLangs.length === 0) {
      setError('Please select at least one skill or language.');
      return;
    }
    setError('');
    setSaving(true);
    
    const res = await fetch('/api/prefs', {
      method: 'POST',
      body: JSON.stringify({ skills: selectedSkills, experience, languages: selectedLangs }),
    });
    
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Failed to save preferences');
      setSaving(false);
      return;
    }
    
    router.push('/feed');
  };

  const totalSelected = selectedSkills.length + selectedLangs.length;

  if (loading) return null;

  return (
    <div className="relative min-h-screen bg-darkbase py-12 overflow-x-hidden">
      {/* Background Animated Gradient Mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-purple/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 pb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-4xl font-extrabold text-foreground mb-3 font-heading tracking-tight">Setup your <span className="text-primary">developer profile</span></h1>
          <p className="text-secondaryText mb-12 text-lg">Select your technical stack so we can find the perfect first issues for you.</p>

          <div className="space-y-12 glass-card p-6 md:p-10 rounded-3xl relative overflow-hidden backdrop-blur-2xl bg-darkbase/60">
            
            {/* Languages */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="text-xl font-semibold mb-6 text-foreground font-heading flex items-center gap-3">
                <span className="w-1 h-6 bg-primary rounded-full"></span>
                Programming Languages
              </h2>
              <div className="flex flex-wrap gap-4">
                {LANGUAGES.map(lang => (
                  <SkillChip key={lang} label={lang} color="primary" selected={selectedLangs.includes(lang)}
                    onClick={() => setSelectedLangs(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang])} />
                ))}
              </div>
            </motion.div>

            {/* Frameworks */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-xl font-semibold mb-6 text-foreground font-heading flex items-center gap-3">
                <span className="w-1 h-6 bg-accent-purple rounded-full"></span>
                Frameworks & Libraries
              </h2>
              <div className="flex flex-wrap gap-4">
                {FRAMEWORKS.map(fw => (
                  <SkillChip key={fw} label={fw} color="purple" selected={selectedSkills.includes(fw)} onClick={() => toggleSkill(fw)} />
                ))}
              </div>
            </motion.div>

            {/* Other tools */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="text-xl font-semibold mb-6 text-foreground font-heading flex items-center gap-3">
                <span className="w-1 h-6 bg-success rounded-full"></span>
                Other Technologies
              </h2>
              <div className="flex flex-wrap gap-4 mb-6">
                {OTHER.map(o => (
                  <SkillChip key={o} label={o} color="success" selected={selectedSkills.includes(o)} onClick={() => toggleSkill(o)} />
                ))}
                {selectedSkills.filter(s => !FRAMEWORKS.includes(s) && !OTHER.includes(s)).map(s => (
                  <SkillChip key={s} label={s} color="success" selected={true} onClick={() => toggleSkill(s)} />
                ))}
              </div>
              <input 
                type="text" 
                placeholder="Type a custom skill and press Enter..." 
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={handleCustomSkill}
                className="w-full max-w-sm px-5 py-3 border border-border rounded-xl bg-darkcard text-foreground focus:outline-none focus:ring-2 focus:ring-success/50 placeholder-secondaryText font-mono text-sm transition-all shadow-inner"
              />
            </motion.div>

            {/* Experience */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <h2 className="text-xl font-semibold mb-6 text-foreground font-heading flex items-center gap-3">
                <span className="w-1 h-6 bg-secondaryText rounded-full"></span>
                Experience Level
              </h2>
              <div className="flex flex-wrap gap-4">
                {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                  <label key={level} className={`flex items-center gap-3 cursor-pointer text-foreground font-medium px-5 py-3 rounded-xl border transition-all ${experience === level ? 'border-primary bg-primary/10' : 'border-border bg-darkcard hover:border-border/80'}`}>
                    <input 
                      type="radio" 
                      name="experience" 
                      value={level} 
                      checked={experience === level} 
                      onChange={() => setExperience(level)} 
                      className="hidden" 
                    />
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${experience === level ? 'border-primary' : 'border-secondaryText'}`}>
                       {experience === level && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <span className="capitalize">{level}</span>
                  </label>
                ))}
              </div>
            </motion.div>
            
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 font-mono text-sm bg-red-400/10 px-4 py-3 rounded-xl border border-red-400/20">
                {error}
              </motion.p>
            )}

          </div>
        </motion.div>

        {/* Floating Sticky Button */}
        <AnimatePresence>
          {totalSelected > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="sticky bottom-10 mt-12 flex justify-center z-40 px-4"
            >
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="relative group flex items-center gap-4 bg-foreground text-darkbase font-bold text-lg px-8 py-4 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-transform hover:scale-105 active:scale-95 border border-white/20"
              >
                <div className="absolute inset-0 rounded-full bg-white blur-md opacity-20 group-hover:opacity-40 transition duration-300"></div>
                <span className="relative z-10">{saving ? 'Saving...' : 'Continue'}</span>
                {!saving && (
                  <div className="relative z-10 flex items-center gap-2">
                     <div className="bg-darkbase text-white text-xs px-2 py-0.5 rounded-full font-mono">{totalSelected}</div>
                     <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
