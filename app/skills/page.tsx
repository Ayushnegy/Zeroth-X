'use client';

import SkillChip from '@/components/SkillChip';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
    
    await fetch('/api/prefs', {
      method: 'POST',
      body: JSON.stringify({ skills: selectedSkills, experience, languages: selectedLangs }),
    });
    
    router.push('/feed');
  };

  if (loading) return null;

  return (
    <>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-foreground mb-2">Let&apos;s set up your profile</h1>
        <p className="text-secondaryText mb-10">Select your skills so we can find the best issues for you.</p>

        <div className="space-y-8 bg-card p-6 md:p-10 rounded-2xl border border-border shadow-sm">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Programming Languages</h2>
            <div className="flex flex-wrap gap-3">
              {LANGUAGES.map(lang => (
                <SkillChip 
                  key={lang} 
                  label={lang} 
                  selected={selectedLangs.includes(lang)} 
                  onClick={() => setSelectedLangs(prev => prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang])} 
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Frameworks & Libraries</h2>
            <div className="flex flex-wrap gap-3">
              {FRAMEWORKS.map(fw => (
                <SkillChip 
                  key={fw} 
                  label={fw} 
                  selected={selectedSkills.includes(fw)} 
                  onClick={() => toggleSkill(fw)} 
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Other Technologies</h2>
            <div className="flex flex-wrap gap-3 mb-4">
              {OTHER.map(o => (
                <SkillChip 
                  key={o} 
                  label={o} 
                  selected={selectedSkills.includes(o)} 
                  onClick={() => toggleSkill(o)} 
                />
              ))}
              {selectedSkills.filter(s => !FRAMEWORKS.includes(s) && !OTHER.includes(s)).map(s => (
                <SkillChip key={s} label={s} selected={true} onClick={() => toggleSkill(s)} />
              ))}
            </div>
            <input 
              type="text" 
              placeholder="Type a custom skill and press Enter..." 
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyDown={handleCustomSkill}
              className="w-full max-w-sm px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder-secondaryText transition-all"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Experience Level</h2>
            <div className="flex gap-6">
              {['beginner', 'intermediate', 'advanced'].map(level => (
                <label key={level} className="flex items-center gap-2 cursor-pointer text-foreground font-medium">
                  <input 
                    type="radio" 
                    name="experience" 
                    value={level} 
                    checked={experience === level}
                    onChange={(e) => setExperience(e.target.value as 'beginner'|'intermediate'|'advanced')}
                    className="w-4 h-4 text-primary bg-background border-border focus:ring-primary focus:ring-2"
                  />
                  <span className="capitalize">{level}</span>
                </label>
              ))}
            </div>
          </div>
          
          {error && <p className="text-red-500 font-medium bg-red-50 px-4 py-2 rounded-md border border-red-200">{error}</p>}

          <div className="pt-6 border-t border-border">
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-white font-medium px-8 py-3 rounded-lg shadow-sm w-full sm:w-auto transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {saving ? 'Saving...' : 'Find My Issues'}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
