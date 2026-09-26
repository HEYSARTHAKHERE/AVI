import React, { useState } from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  Mail, 
  ArrowUpRight, 
  Download, 
  Share2, 
  ExternalLink,
  Instagram,
  Youtube,
  Clock,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { CreatorProfile } from '../../types';
import { Button } from '../ui/Button';

interface PublicProfileViewProps {
  creator: CreatorProfile;
  isModal?: boolean;
  onClose?: () => void;
}

export const PublicProfileView: React.FC<PublicProfileViewProps> = ({
  creator,
  isModal = false,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'work' | 'rates' | 'collaborations' | 'about'>('work');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [formData, setFormData] = useState({
    brandName: '',
    email: '',
    budget: '$2,500 - $5,000',
    message: '',
  });

  const totalFollowers = creator.socials.reduce((acc, curr) => acc + curr.followers, 0);

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandName || !formData.email) return;
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactModalOpen(false);
      setFormData({ brandName: '', email: '', budget: '$2,500 - $5,000', message: '' });
    }, 2000);
  };

  return (
    <div className="bg-[#FAF9F5] text-[#141416] min-h-screen">
      {/* Top Bar on Public Profile */}
      <div className="sticky top-0 z-30 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-[rgba(20,20,22,0.06)] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#8EA633]"></span>
          <span className="text-xs font-semibold text-[#141416] tracking-wider uppercase">
            kollavo.com/creator/{creator.username}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('Profile URL copied to clipboard!');
            }}
            className="p-2 text-[#575762] hover:text-[#141416] hover:bg-[#F3F1EC] rounded-lg transition-colors text-xs flex items-center gap-1.5"
            title="Share Profile"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
          
          <Button
            variant="primary"
            size="sm"
            onClick={() => setContactModalOpen(true)}
          >
            <Mail className="w-3.5 h-3.5 mr-1" />
            Contact & Brief
          </Button>

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 ml-2 text-[#888894] hover:text-[#141416] hover:bg-[#F3F1EC] rounded-lg transition-colors"
              aria-label="Close preview"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Creator Hero Header: Editorial Fashion Layout */}
        <div className="flex flex-col md:flex-row items-start gap-8 pb-12 border-b border-[rgba(20,20,22,0.08)]">
          {/* Avatar with subtle ring */}
          <div className="relative shrink-0">
            <img
              src={creator.avatarUrl}
              alt={creator.fullName}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border border-[rgba(20,20,22,0.12)] shadow-md"
              referrerPolicy="no-referrer"
            />
            {creator.verified && (
              <div
                className="absolute -bottom-2 -right-2 bg-[#FAF9F5] p-1 rounded-full shadow-xs"
                title="Verified Creator"
              >
                <CheckCircle2 className="w-5 h-5 text-[#8EA633] fill-[#FAF9F5]" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#575762]">
              <span className="font-semibold text-[#141416]">@{creator.username}</span>
              <span aria-hidden="true">·</span>
              <span>{creator.category}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#888894]" />
                {creator.location}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#141416]">
              {creator.fullName}
            </h1>

            <p className="text-sm sm:text-base text-[#575762] leading-relaxed max-w-2xl font-light">
              {creator.bio}
            </p>

            {/* Social handles with zero-pill unboxed text */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-[#141416]">
              {creator.socials.map((soc) => (
                <a
                  key={soc.platform}
                  href={soc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-[#8EA633] transition-colors"
                >
                  <span className="capitalize">{soc.platform}:</span>
                  <span className="font-mono-data font-semibold">
                    {(soc.followers / 1000).toFixed(0)}k
                  </span>
                  {soc.engagementRate && (
                    <span className="text-[#888894] font-normal">
                      ({soc.engagementRate}%)
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Live Commercial Metrics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-b border-[rgba(20,20,22,0.08)]">
          <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[rgba(20,20,22,0.06)] shadow-xs">
            <span className="text-xs text-[#575762] block">Total Reach</span>
            <span className="text-2xl font-bold font-mono-data text-[#141416] mt-1 block">
              {(totalFollowers / 1000).toFixed(0)}k+
            </span>
            <span className="text-[11px] text-[#888894] mt-0.5 block">Combined Channels</span>
          </div>

          <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[rgba(20,20,22,0.06)] shadow-xs">
            <span className="text-xs text-[#575762] block">Average Engagement</span>
            <span className="text-2xl font-bold font-mono-data text-[#8EA633] mt-1 block">
              5.4%
            </span>
            <span className="text-[11px] text-[#888894] mt-0.5 block">Verified organic</span>
          </div>

          <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[rgba(20,20,22,0.06)] shadow-xs">
            <span className="text-xs text-[#575762] block">Core Audience</span>
            <span className="text-2xl font-bold font-mono-data text-[#141416] mt-1 block">
              21–34
            </span>
            <span className="text-[11px] text-[#888894] mt-0.5 block">74% key demographic</span>
          </div>

          <div className="bg-[#FFFFFF] p-4 rounded-xl border border-[rgba(20,20,22,0.06)] shadow-xs">
            <span className="text-xs text-[#575762] block">Commercial Starting Rate</span>
            <span className="text-2xl font-bold font-mono-data text-[#141416] mt-1 block">
              ${creator.featuredRate.toLocaleString()}
            </span>
            <span className="text-[11px] text-[#888894] mt-0.5 block">Deliverable packages</span>
          </div>
        </div>

        {/* Tab Controls for Profile Sections */}
        <div className="flex items-center gap-2 pt-8 pb-6 border-b border-[rgba(20,20,22,0.06)]">
          <button
            onClick={() => setActiveTab('work')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'work'
                ? 'bg-[#141416] text-[#FAF9F5]'
                : 'text-[#575762] hover:text-[#141416] hover:bg-[#F3F1EC]'
            }`}
          >
            Portfolio ({creator.portfolio.length})
          </button>
          <button
            onClick={() => setActiveTab('rates')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'rates'
                ? 'bg-[#141416] text-[#FAF9F5]'
                : 'text-[#575762] hover:text-[#141416] hover:bg-[#F3F1EC]'
            }`}
          >
            Services & Rate Card
          </button>
          <button
            onClick={() => setActiveTab('collaborations')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'collaborations'
                ? 'bg-[#141416] text-[#FAF9F5]'
                : 'text-[#575762] hover:text-[#141416] hover:bg-[#F3F1EC]'
            }`}
          >
            Past Collaborations
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'about'
                ? 'bg-[#141416] text-[#FAF9F5]'
                : 'text-[#575762] hover:text-[#141416] hover:bg-[#F3F1EC]'
            }`}
          >
            Audience & Press Kit
          </button>
        </div>

        {/* TAB CONTENT: 1. PORTFOLIO */}
        {activeTab === 'work' && (
          <div className="py-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {creator.portfolio.map((item) => (
                <div
                  key={item.id}
                  className="group bg-[#FFFFFF] rounded-2xl border border-[rgba(20,20,22,0.08)] overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] bg-[#EBE8E1] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {item.brand && (
                      <div className="absolute top-3 left-3 bg-[#141416]/80 backdrop-blur-xs text-[#FAF9F5] text-[11px] font-medium px-2.5 py-1 rounded-md">
                        {item.brand}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between text-xs text-[#575762] mb-1.5">
                      <span>{item.category}</span>
                      <span>{item.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-[#141416] group-hover:text-[#8EA633] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB CONTENT: 2. SERVICES & RATE CARD */}
        {activeTab === 'rates' && (
          <div className="py-6 space-y-4 animate-in fade-in duration-200">
            {creator.services.map((service) => (
              <div
                key={service.id}
                className="bg-[#FFFFFF] p-6 rounded-2xl border border-[rgba(20,20,22,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-[rgba(20,20,22,0.18)] transition-all"
              >
                <div className="space-y-1.5 max-w-xl">
                  <h3 className="text-lg font-bold text-[#141416]">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#575762] leading-relaxed">
                    {service.deliverables}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-[#888894] pt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Estimated turnaround: {service.turnaroundDays} business days</span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-[rgba(20,20,22,0.06)]">
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-[#888894] block">Starting at</span>
                    <span className="text-2xl font-bold font-mono-data text-[#141416]">
                      ${service.startingPrice.toLocaleString()}
                    </span>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setContactModalOpen(true)}
                  >
                    Request Package
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB CONTENT: 3. PAST COLLABORATIONS */}
        {activeTab === 'collaborations' && (
          <div className="py-6 space-y-3 animate-in fade-in duration-200">
            {creator.recentCollaborations.map((collab, idx) => (
              <div
                key={idx}
                className="bg-[#FFFFFF] p-5 rounded-2xl border border-[rgba(20,20,22,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#141416]">
                      {collab.brandName}
                    </h3>
                    <span className="text-xs text-[#575762]">·</span>
                    <span className="text-xs text-[#575762]">{collab.campaign}</span>
                  </div>
                  <p className="text-xs text-[#888894] mt-1">Completed {collab.date}</p>
                </div>

                {collab.highlightMetric && (
                  <div className="text-xs font-semibold text-[#3D4A14] bg-[#8EA633]/15 px-3 py-1.5 rounded-lg font-mono-data">
                    {collab.highlightMetric}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TAB CONTENT: 4. ABOUT & PRESS KIT */}
        {activeTab === 'about' && (
          <div className="py-6 space-y-6 animate-in fade-in duration-200">
            <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[rgba(20,20,22,0.08)] space-y-4">
              <h3 className="text-lg font-bold text-[#141416]">
                Audience Demographics & Geo Distribution
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[rgba(20,20,22,0.06)]">
                  <span className="text-xs text-[#888894] block">Top Geographic Locations</span>
                  <span className="text-sm font-semibold text-[#141416] mt-1 block">
                    {creator.audienceDemographics.topLocation}
                  </span>
                </div>
                <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[rgba(20,20,22,0.06)]">
                  <span className="text-xs text-[#888894] block">Gender Split</span>
                  <span className="text-sm font-semibold text-[#141416] mt-1 block">
                    {creator.audienceDemographics.genderRatio}
                  </span>
                </div>
                <div className="p-4 bg-[#FAF9F5] rounded-xl border border-[rgba(20,20,22,0.06)]">
                  <span className="text-xs text-[#888894] block">Age Distribution</span>
                  <span className="text-sm font-semibold text-[#141416] mt-1 block">
                    {creator.audienceDemographics.ageRange}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF9F5] p-6 rounded-2xl border border-[rgba(20,20,22,0.08)] flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-[#141416]">
                  Download Official Rate Card & Press Kit
                </h4>
                <p className="text-xs text-[#575762] mt-1">
                  High-res headshots, commercial rates, usage terms, and audience reports.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert('Media Kit PDF ready for export!')}
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export Media Kit
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Brand Inquiry Modal */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#141416]/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FFFFFF] w-full max-w-lg rounded-2xl p-6 sm:p-7 shadow-xl border border-[rgba(20,20,22,0.1)] relative">
            <button
              onClick={() => setContactModalOpen(false)}
              className="absolute top-4 right-4 text-[#888894] hover:text-[#141416] p-1.5 rounded-lg hover:bg-[#F3F1EC]"
            >
              <X className="w-4 h-4" />
            </button>

            {contactSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#8EA633]/20 text-[#3D4A14] flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#141416]">Inquiry Sent Successfully!</h3>
                <p className="text-xs text-[#575762] max-w-xs mx-auto">
                  Your brief has been forwarded directly to {creator.fullName}. You will receive a response within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#141416]">
                    Direct Brand Brief to {creator.fullName}
                  </h3>
                  <p className="text-xs text-[#575762] mt-0.5">
                    Submit your campaign proposal, deliverables, and estimated budget.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141416] mb-1">
                    Brand or Agency Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    placeholder="e.g. Dior Beauty, Acne Studios, Acme Agency"
                    className="w-full text-sm px-3.5 py-2.5 border border-[rgba(20,20,22,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8EA633]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141416] mb-1">
                    Contact Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="marketing@brand.com"
                    className="w-full text-sm px-3.5 py-2.5 border border-[rgba(20,20,22,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8EA633]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141416] mb-1">
                    Estimated Campaign Budget
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full text-sm px-3.5 py-2.5 border border-[rgba(20,20,22,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8EA633] bg-white"
                  >
                    <option>$1,500 – $3,000</option>
                    <option>$3,000 – $5,000</option>
                    <option>$5,000 – $10,000</option>
                    <option>$10,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#141416] mb-1">
                    Campaign Scope & Deliverables
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your campaign goals, platform focus (Instagram, TikTok, YouTube), and timeline..."
                    className="w-full text-sm px-3.5 py-2.5 border border-[rgba(20,20,22,0.12)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8EA633]"
                  ></textarea>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setContactModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                  >
                    Send Campaign Brief
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
