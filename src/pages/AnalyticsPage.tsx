import React from 'react';
import { BarChart3, TrendingUp, Users, Eye, FileText, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

interface AnalyticsPageProps {
  onNavigate: (path: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const username = profile?.username || 'user';

  return (
    <DashboardLayout
      currentPath="/analytics"
      pageTitle="Analytics & Reach"
      onNavigate={onNavigate}
    >
      <div className="space-y-6 text-left">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141416]">
              Audience Reach & Profile Telemetry
            </h2>
            <p className="text-xs sm:text-sm text-[#575762] mt-0.5">
              Live engagement benchmarks, profile traffic, and media kit inquiry analytics.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate(`/creator/${username}`)}
            className="text-xs shrink-0"
          >
            <Eye className="w-3.5 h-3.5 mr-1 text-[#8EA633]" />
            <span>Test public page</span>
          </Button>
        </div>

        {/* Clean Telemetry Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-6 space-y-2">
            <span className="text-xs font-semibold text-[#575762]">Profile Views</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-[#141416] tabular-nums">0</span>
              <span className="text-xs text-[#888894]">unique visitors</span>
            </div>
            <p className="text-[11px] text-[#888894] pt-2 border-t border-[rgba(20,20,22,0.04)]">
              Counts unique page loads of your public vanity URL.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-6 space-y-2">
            <span className="text-xs font-semibold text-[#575762]">Media Kit Inquiries</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-[#141416] tabular-nums">0</span>
              <span className="text-xs text-[#888894]">submissions</span>
            </div>
            <p className="text-[11px] text-[#888894] pt-2 border-t border-[rgba(20,20,22,0.04)]">
              Contact briefs and sponsorship inquiries submitted by brands.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-6 space-y-2">
            <span className="text-xs font-semibold text-[#575762]">Commercial Rate Clicks</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-[#141416] tabular-nums">0</span>
              <span className="text-xs text-[#888894]">views</span>
            </div>
            <p className="text-[11px] text-[#888894] pt-2 border-t border-[rgba(20,20,22,0.04)]">
              Number of times visitors expanded your service rate cards.
            </p>
          </div>
        </div>

        {/* Tip Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#141416]">
              Share your link to begin collecting data
            </h3>
            <p className="text-xs text-[#575762]">
              Add <strong className="font-mono text-[#141416]">kollavo.com/creator/{username}</strong> to your Instagram bio or email signature to track real inbound inquiries.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigate(`/creator/${username}`)}
            className="text-xs shrink-0"
          >
            <span>View your profile link</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};
