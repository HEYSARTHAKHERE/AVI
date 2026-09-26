import React, { useState } from 'react';
import { 
  X, 
  HardDrive, 
  FileSpreadsheet, 
  FileText, 
  Mail, 
  MessageSquare, 
  Users, 
  ExternalLink, 
  Check, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';
import { 
  WORKSPACE_SERVICES, 
  listDriveFiles, 
  exportToGoogleSheets, 
  createCampaignIntakeForm, 
  sendCollaborationEmail, 
  listChatSpaces, 
  fetchGoogleContacts 
} from '../../lib/workspace';
import { getCachedAccessToken } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface GoogleWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleWorkspaceModal: React.FC<GoogleWorkspaceModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'drive' | 'sheets' | 'forms' | 'gmail' | 'chat' | 'contacts'>('overview');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [sheetsResult, setSheetsResult] = useState<{ url?: string; id?: string } | null>(null);
  const [formResult, setFormResult] = useState<{ url?: string; id?: string } | null>(null);
  const [contactsList, setContactsList] = useState<any[]>([]);

  // Email form state
  const [emailTo, setEmailTo] = useState('brand@acme-atelier.com');
  const [emailSubject, setEmailSubject] = useState('MAVORA Collaboration Proposal — AW26 Editorial');
  const [emailBody, setEmailBody] = useState(
    'Hello! I am reaching out through the MAVORA Operating System regarding your Autumn Tailoring campaign. Looking forward to discussing deliverables.'
  );

  if (!isOpen) return null;

  const hasToken = Boolean(getCachedAccessToken());

  const handleConnectGoogle = async () => {
    setLoading(true);
    setStatusMessage(null);
    try {
      await signInWithGoogle();
      setStatusMessage('Google Workspace OAuth connected successfully!');
    } catch (err: any) {
      setStatusMessage(`Connection note: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchDrive = async () => {
    setLoading(true);
    const res = await listDriveFiles();
    if (res.connected) {
      setDriveFiles(res.files);
      setStatusMessage(`Retrieved ${res.files.length} Google Drive files.`);
    } else {
      setStatusMessage(res.error || 'Failed to retrieve Drive files.');
    }
    setLoading(false);
  };

  const handleExportSheets = async () => {
    setLoading(true);
    const headers = ['Creator Name', 'Username', 'Platform', 'Agreed Rate', 'Status', 'Deliverables'];
    const rows = [
      ['Sarthak Kamdi', 'sarthak', 'Instagram', '$1,400', 'In Progress', '1x 4K Reel + 2x Story Frames'],
      ['Elena Rostova', 'elena_rostova', 'TikTok', '€950', 'Shortlisted', '2x UGC Videos (9:16)'],
      ['Marcus Chen', 'marcus_chen', 'YouTube', '$1,400', 'Confirmed', '1x 60s Dedicated Segment'],
    ];

    const res = await exportToGoogleSheets('Autumn AW26 Campaign Roster', headers, rows);
    if (res.success) {
      setSheetsResult({ url: res.spreadsheetUrl, id: res.spreadsheetId });
      setStatusMessage('Google Sheet generated and populated with campaign roster!');
    } else {
      setStatusMessage(`Sheets Export note: ${res.error}`);
    }
    setLoading(false);
  };

  const handleCreateForm = async () => {
    setLoading(true);
    const res = await createCampaignIntakeForm('Autumn Cashmere Editorial Campaign', 'Acme Studio Atelier');
    if (res.success) {
      setFormResult({ url: res.responderUri, id: res.formId });
      setStatusMessage('Google Form intake created for campaign applicants!');
    } else {
      setStatusMessage(`Google Forms note: ${res.error}`);
    }
    setLoading(false);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await sendCollaborationEmail(emailTo, emailSubject, emailBody);
    if (res.success) {
      setStatusMessage(`Gmail dispatched successfully! Message ID: ${res.messageId}`);
    } else {
      setStatusMessage(`Gmail notice: ${res.error}`);
    }
    setLoading(false);
  };

  const handleFetchContacts = async () => {
    setLoading(true);
    const res = await fetchGoogleContacts();
    if (res.connected) {
      setContactsList(res.contacts);
      setStatusMessage(`Retrieved ${res.contacts.length} Google Contacts.`);
    } else {
      setStatusMessage(res.error || 'Failed to fetch contacts.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#0A1020] text-[#F8FAFC] border border-[#38BDF8]/20 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0E1626]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <HardDrive className="w-4 h-4" />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-bold tracking-tight text-white">Google Workspace Integrations</h3>
              <p className="text-[11px] text-[#94A3B8]">
                Google Drive, Sheets, Forms, Gmail, Chat & Contacts OAuth
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 p-2 bg-[#050814] border-b border-white/5 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview' ? 'bg-[#38BDF8]/15 text-[#38BDF8] font-semibold' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <span>Overview</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('drive'); handleFetchDrive(); }}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'drive' ? 'bg-[#38BDF8]/15 text-[#38BDF8] font-semibold' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>Drive</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sheets')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'sheets' ? 'bg-[#38BDF8]/15 text-[#38BDF8] font-semibold' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Sheets</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('forms')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'forms' ? 'bg-[#38BDF8]/15 text-[#38BDF8] font-semibold' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Forms</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gmail')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'gmail' ? 'bg-[#38BDF8]/15 text-[#38BDF8] font-semibold' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Gmail</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'chat' ? 'bg-[#38BDF8]/15 text-[#38BDF8] font-semibold' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Google Chat</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('contacts'); handleFetchContacts(); }}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'contacts' ? 'bg-[#38BDF8]/15 text-[#38BDF8] font-semibold' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Contacts</span>
          </button>
        </div>

        {/* Status notification */}
        {statusMessage && (
          <div className="mx-4 mt-3 p-2.5 bg-[#38BDF8]/10 border border-[#38BDF8]/20 rounded-xl text-xs text-[#38BDF8] flex items-center justify-between">
            <span>{statusMessage}</span>
            <button onClick={() => setStatusMessage(null)} className="text-[#94A3B8] hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content body */}
        <div className="flex-1 p-6 overflow-y-auto text-left text-xs">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#0E1626] border border-white/5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Google Account Authentication</h4>
                  <p className="text-[#94A3B8] text-xs mt-0.5">
                    {hasToken ? 'Connected with Workspace scopes enabled.' : 'Sign in with Google to enable 1P Workspace tools.'}
                  </p>
                </div>
                <Button
                  variant={hasToken ? 'outline' : 'primary'}
                  size="sm"
                  onClick={handleConnectGoogle}
                  disabled={loading}
                >
                  {hasToken ? 'Refresh Google Auth' : 'Sign in with Google'}
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WORKSPACE_SERVICES.map((srv) => (
                  <div key={srv.service} className="p-3.5 rounded-xl bg-[#111B2E] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{srv.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                        Configured
                      </span>
                    </div>
                    <p className="text-[11px] text-[#94A3B8] font-mono truncate">{srv.scope}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'drive' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Google Drive Collaboration Files</h4>
                  <p className="text-[#94A3B8] text-xs mt-0.5">Sync media kits, raw video footage, and brand lookbooks.</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleFetchDrive} disabled={loading}>
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh Files</span>
                </Button>
              </div>

              {driveFiles.length === 0 ? (
                <div className="p-8 text-center bg-[#0E1626] rounded-xl border border-white/5 text-[#94A3B8]">
                  <HardDrive className="w-8 h-8 mx-auto text-[#64748B] mb-2" />
                  <p className="font-medium text-white">No drive files retrieved yet</p>
                  <p className="text-[11px] mt-1">Connect your Google account and grant Drive permissions to browse assets.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {driveFiles.map((f: any) => (
                    <div key={f.id} className="p-3 rounded-lg bg-[#0E1626] border border-white/5 flex items-center justify-between">
                      <span className="text-white font-medium">{f.name}</span>
                      {f.webViewLink && (
                        <a href={f.webViewLink} target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] flex items-center gap-1 hover:underline">
                          <span>View in Drive</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sheets' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Google Sheets Export Engine</h4>
                <p className="text-[#94A3B8] text-xs mt-0.5">
                  Generate a spreadsheet of confirmed creator deals, deliverables, and rates.
                </p>
              </div>

              <div className="p-4 bg-[#0E1626] rounded-xl border border-white/5 space-y-3">
                <p className="text-xs text-[#F8FAFC]">
                  Export the active Autumn Tailoring Campaign roster (3 creators, deliverables, and financial ledger status) directly into your Google Sheets account.
                </p>

                <Button variant="primary" size="sm" onClick={handleExportSheets} disabled={loading}>
                  <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" />
                  <span>Export Campaign Roster to Google Sheets</span>
                </Button>

                {sheetsResult?.url && (
                  <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 flex items-center justify-between">
                    <span>Spreadsheet created successfully!</span>
                    <a href={sheetsResult.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 underline font-medium">
                      <span>Open Sheet</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'forms' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Google Forms Creator Application</h4>
                <p className="text-[#94A3B8] text-xs mt-0.5">
                  Publish an official Google Form for creator pitches and media kit links.
                </p>
              </div>

              <div className="p-4 bg-[#0E1626] rounded-xl border border-white/5 space-y-3">
                <p className="text-xs text-[#F8FAFC]">
                  Automatically create a branded Google Form for your active campaign so creators can submit pitch videos and portfolio samples.
                </p>

                <Button variant="primary" size="sm" onClick={handleCreateForm} disabled={loading}>
                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                  <span>Create Google Form Intake</span>
                </Button>

                {formResult?.url && (
                  <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 flex items-center justify-between">
                    <span>Application Form Ready!</span>
                    <a href={formResult.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 underline font-medium">
                      <span>Open Form</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'gmail' && (
            <form onSubmit={handleSendEmail} className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-white">Gmail Collaboration Outreach</h4>
                <p className="text-[#94A3B8] text-xs mt-0.5">
                  Send high-priority pitches directly from your authorized Gmail account.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#94A3B8] mb-1">Recipient Email</label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  className="w-full bg-[#050814] border border-white/10 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#94A3B8] mb-1">Subject</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-[#050814] border border-white/10 rounded-lg px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#94A3B8] mb-1">Message Body</label>
                <textarea
                  rows={4}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-[#050814] border border-white/10 rounded-lg px-3 py-2 text-white resize-none"
                  required
                />
              </div>

              <Button type="submit" variant="primary" size="sm" disabled={loading}>
                <Mail className="w-3.5 h-3.5 mr-1.5" />
                <span>Send via Gmail API</span>
              </Button>
            </form>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Google Chat Campaign Spaces</h4>
                <p className="text-[#94A3B8] text-xs mt-0.5">
                  Collaborate in dedicated Google Chat spaces for immediate deliverable review.
                </p>
              </div>

              <div className="p-4 bg-[#0E1626] rounded-xl border border-white/5 space-y-2">
                <div className="flex items-center gap-2 text-[#38BDF8]">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-semibold">Google Chat OAuth Space Sync Active</span>
                </div>
                <p className="text-xs text-[#94A3B8]">
                  Scope authorized: <code className="text-[#38BDF8] font-mono">chat.spaces.readonly</code>. Spaces created for MAVORA campaigns allow real-time notifications for file draft approvals.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-white">Google Contacts CRM Sync</h4>
                  <p className="text-[#94A3B8] text-xs mt-0.5">Import and manage brand representatives and creator rosters.</p>
                </div>
                <Button variant="outline" size="sm" onClick={handleFetchContacts} disabled={loading}>
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Sync Contacts</span>
                </Button>
              </div>

              {contactsList.length === 0 ? (
                <div className="p-8 text-center bg-[#0E1626] rounded-xl border border-white/5 text-[#94A3B8]">
                  <Users className="w-8 h-8 mx-auto text-[#64748B] mb-2" />
                  <p className="font-medium text-white">No contacts synced yet</p>
                  <p className="text-[11px] mt-1">Sync to populate brand contacts into your MAVORA Creator CRM.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {contactsList.map((c: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-[#0E1626] border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-white font-medium">{c.name}</span>
                        {c.organization && <span className="text-[#94A3B8] ml-2">· {c.organization}</span>}
                      </div>
                      <span className="text-[#38BDF8] font-mono text-[11px]">{c.email}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
