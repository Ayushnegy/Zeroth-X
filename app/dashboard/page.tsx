import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export const metadata = {
  title: 'Dashboard | FirstPR Pro',
  description: 'Track your open source contributions and check your progress.',
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AnalyticsDashboard />
    </div>
  );
}
