import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { DashboardHero } from '../components/dashboard/DashboardHero';
import { ProfileCompletionCard } from '../components/dashboard/ProfileCompletionCard';
import { StatsOverview } from '../components/dashboard/StatsOverview';
import { QuickActions } from '../components/dashboard/QuickActions';
import { PublicProfileCard } from '../components/dashboard/PublicProfileCard';
import { fetchServices, fetchSocialAccounts } from '../lib/supabase/client';
import { DbService, DbSocialAccount } from '../types';

interface DashboardPageProps {
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user, profile, status } = useAuth();

  const [services, setServices] = useState<DbService[]>([]);
  const [socials, setSocials] = useState<DbSocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      Promise.all([fetchServices(user.id), fetchSocialAccounts(user.id)])
        .then(([srvs, socs]) => {
          setServices(srvs);
          setSocials(socs);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [user?.id]);

  const fullName = profile?.full_name || user?.user_metadata?.full_name || 'Creator';
  const username = profile?.username || user?.user_metadata?.username || 'user';

  // Skeleton state
  if (status === 'loading') {
    return (
      <DashboardLayout
        currentPath="/dashboard"
        pageTitle="Dashboard"
        onNavigate={onNavigate}
      >
        <div className="space-y-6 animate-pulse">
          <div className="h-44 bg-white/60 rounded-2xl border border-[rgba(20,20,22,0.06)]"></div>
          <div className="h-56 bg-white/60 rounded-2xl border border-[rgba(20,20,22,0.06)]"></div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="h-28 bg-white/60 rounded-2xl"></div>
            <div className="h-28 bg-white/60 rounded-2xl"></div>
            <div className="h-28 bg-white/60 rounded-2xl"></div>
            <div className="h-28 bg-white/60 rounded-2xl"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      currentPath="/dashboard"
      pageTitle="Workspace Overview"
      onNavigate={onNavigate}
    >
      <div className="space-y-6 text-left">
        {/* 1. Dashboard Hero Banner */}
        <DashboardHero
          fullName={fullName}
          username={username}
          onNavigate={onNavigate}
        />

        {/* 2. Profile Completion Card (Calculated from real DB data) */}
        <ProfileCompletionCard
          profile={profile}
          socialsCount={socials.length}
          servicesCount={services.length}
          onNavigate={onNavigate}
        />

        {/* 3. Four Dashboard Statistics (Genuine 0 metrics, no fabricated stats) */}
        <StatsOverview
          profileViews={0}
          mediaKitViews={0}
          activeCollaborations={0}
          pendingInquiries={0}
          onNavigate={onNavigate}
        />

        {/* 4. Quick Actions Interactive Grid */}
        <QuickActions onNavigate={onNavigate} />

        {/* 5. Public Profile Preview Live Card */}
        <PublicProfileCard
          profile={profile}
          socials={socials}
          onNavigate={onNavigate}
        />
      </div>
    </DashboardLayout>
  );
};
