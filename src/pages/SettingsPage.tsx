import React, { useState } from 'react';
import { Settings, User, Lock, ShieldCheck, Download, LogOut, Check, AlertCircle, Loader2 } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { Button } from '../components/ui/Button';
import { PasswordInput } from '../components/auth/PasswordInput';
import { useAuth } from '../context/AuthContext';

interface SettingsPageProps {
  onNavigate: (path: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const { user, profile, logOut, updatePassword } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordNotice, setPasswordNotice] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordNotice(null);
    setPasswordError(null);

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setIsUpdatingPassword(true);
    const res = await updatePassword(newPassword);
    setIsUpdatingPassword(false);

    if (res.success) {
      setPasswordNotice('Your password has been updated securely.');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordError(res.error || 'Failed to update password.');
    }
  };

  const handleLogout = async () => {
    await logOut();
    onNavigate('/');
  };

  const handleExportData = () => {
    const data = {
      profile,
      user_metadata: user?.user_metadata,
      exported_at: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mavora-profile-${profile?.username || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout
      currentPath="/settings"
      pageTitle="Settings"
      onNavigate={onNavigate}
    >
      <div className="space-y-6 text-left max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-6">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#141416]">
            Account & Security Settings
          </h2>
          <p className="text-xs sm:text-sm text-[#575762] mt-0.5">
            Manage your credentials, password encryption, and account preferences.
          </p>
        </div>

        {/* Account Info Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(20,20,22,0.06)]">
            <User className="w-4 h-4 text-[#8EA633]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#141416]">
              Account Credentials
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-semibold text-[#888894] block">Full Name</span>
              <span className="font-medium text-[#141416] text-sm mt-0.5 block">
                {profile?.full_name || 'Creator'}
              </span>
            </div>
            <div>
              <span className="font-semibold text-[#888894] block">Email Address</span>
              <span className="font-medium text-[#141416] text-sm mt-0.5 block">
                {user?.email || 'user@domain.com'}
              </span>
            </div>
            <div>
              <span className="font-semibold text-[#888894] block">Public Username Handle</span>
              <span className="font-mono font-medium text-[#8EA633] text-sm mt-0.5 block">
                @{profile?.username || 'user'}
              </span>
            </div>
            <div>
              <span className="font-semibold text-[#888894] block">Profile Visibility</span>
              <span className="font-medium text-[#141416] text-sm mt-0.5 block">
                {profile?.is_public ? 'Public (Visible)' : 'Private (Hidden)'}
              </span>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(20,20,22,0.06)]">
            <Lock className="w-4 h-4 text-[#8EA633]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#141416]">
              Update Security Password
            </h3>
          </div>

          {passwordNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{passwordNotice}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 bg-red-50 border border-red-200/80 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            <PasswordInput
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              showStrengthIndicator
              required
            />

            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
            />

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={isUpdatingPassword || !newPassword}
                className="text-xs"
              >
                {isUpdatingPassword ? (
                  <div className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  <span>Update Password</span>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Data & Sessions */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-[rgba(20,20,22,0.08)] shadow-sm p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[rgba(20,20,22,0.06)]">
            <ShieldCheck className="w-4 h-4 text-[#8EA633]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#141416]">
              Data Ownership & Session Management
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <div>
              <span className="text-xs font-bold text-[#141416] block">
                Export Profile Snapshot (JSON)
              </span>
              <p className="text-xs text-[#575762]">
                Download a complete machine-readable copy of your profile, services, and configuration.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="text-xs shrink-0"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>Export Data</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[rgba(20,20,22,0.06)]">
            <div>
              <span className="text-xs font-bold text-[#141416] block">
                Sign Out of Current Session
              </span>
              <p className="text-xs text-[#575762]">
                Safely end your creator workspace session on this device.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-xs shrink-0 text-red-600 hover:bg-red-50 hover:border-red-200"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span>Sign out</span>
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
