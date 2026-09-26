import { getCachedAccessToken } from './firebase';

export interface WorkspaceServiceStatus {
  service: 'drive' | 'sheets' | 'forms' | 'gmail' | 'chat' | 'contacts';
  name: string;
  connected: boolean;
  statusText: string;
  scope: string;
}

export const WORKSPACE_SERVICES: WorkspaceServiceStatus[] = [
  {
    service: 'drive',
    name: 'Google Drive',
    connected: false,
    statusText: 'OAuth Scope Active',
    scope: 'https://www.googleapis.com/auth/drive.file',
  },
  {
    service: 'sheets',
    name: 'Google Sheets',
    connected: false,
    statusText: 'OAuth Scope Active',
    scope: 'https://www.googleapis.com/auth/spreadsheets',
  },
  {
    service: 'forms',
    name: 'Google Forms',
    connected: false,
    statusText: 'OAuth Scope Active',
    scope: 'https://www.googleapis.com/auth/forms.body',
  },
  {
    service: 'gmail',
    name: 'Gmail',
    connected: false,
    statusText: 'OAuth Scope Active',
    scope: 'https://www.googleapis.com/auth/gmail.send',
  },
  {
    service: 'contacts',
    name: 'Google Contacts',
    connected: false,
    statusText: 'OAuth Scope Active',
    scope: 'https://www.googleapis.com/auth/contacts.readonly',
  },
  {
    service: 'chat',
    name: 'Google Chat',
    connected: false,
    statusText: 'OAuth Scope Active',
    scope: 'https://www.googleapis.com/auth/chat.spaces.readonly',
  },
];

// Helper to make authenticated requests to Google APIs
async function callGoogleApi(endpoint: string, options: RequestInit = {}) {
  const token = getCachedAccessToken();
  if (!token) {
    throw new Error('Google Workspace OAuth access token not found. Please Sign in with Google to grant permission.');
  }

  const res = await fetch(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google API error (${res.status}): ${errorText}`);
  }

  return res.json();
}

// 1. Google Drive: List or search files
export async function listDriveFiles(query: string = '') {
  const token = getCachedAccessToken();
  if (!token) {
    return {
      connected: false,
      files: [],
      error: 'Sign in with Google to browse Drive assets',
    };
  }

  try {
    const url = new URL('https://www.googleapis.com/drive/v3/files');
    url.searchParams.set('pageSize', '10');
    url.searchParams.set('fields', 'files(id, name, mimeType, webViewLink, thumbnailLink)');
    if (query) {
      url.searchParams.set('q', query);
    }
    const data = await callGoogleApi(url.toString());
    return { connected: true, files: data.files || [], error: null };
  } catch (err: any) {
    return { connected: false, files: [], error: err.message };
  }
}

// 2. Google Sheets: Export campaign data or financial ledger to a new spreadsheet
export async function exportToGoogleSheets(title: string, headers: string[], rows: (string | number)[][]) {
  const token = getCachedAccessToken();
  if (!token) {
    return {
      success: false,
      error: 'Google Sign-in with Sheets permissions required.',
    };
  }

  try {
    // 1. Create spreadsheet
    const createData = await callGoogleApi('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      body: JSON.stringify({
        properties: { title: `Kollavo - ${title} (${new Date().toLocaleDateString()})` },
      }),
    });

    const spreadsheetId = createData.spreadsheetId;
    const spreadsheetUrl = createData.spreadsheetUrl;

    // 2. Populate data
    const values = [headers, ...rows];
    await callGoogleApi(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        body: JSON.stringify({
          values,
        }),
      }
    );

    return {
      success: true,
      spreadsheetId,
      spreadsheetUrl,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// 3. Google Forms: Create campaign intake form
export async function createCampaignIntakeForm(campaignTitle: string, brandName: string) {
  const token = getCachedAccessToken();
  if (!token) {
    return { success: false, error: 'Sign in with Google to create Forms.' };
  }

  try {
    const formData = await callGoogleApi('https://forms.googleapis.com/v1/forms', {
      method: 'POST',
      body: JSON.stringify({
        info: {
          title: `${campaignTitle} — Creator Application`,
          documentTitle: `Kollavo - ${campaignTitle}`,
        },
      }),
    });

    return {
      success: true,
      formId: formData.formId,
      responderUri: formData.responderUri,
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// 4. Gmail: Send collaboration pitch or agreement
export async function sendCollaborationEmail(recipientEmail: string, subject: string, bodyText: string) {
  const token = getCachedAccessToken();
  if (!token) {
    return { success: false, error: 'Sign in with Google to send collaboration email.' };
  }

  try {
    const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
    const messageParts = [
      `To: ${recipientEmail}`,
      'Content-Type: text/plain; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      bodyText,
    ];
    const message = messageParts.join('\r\n');
    const encodedMessage = btoa(unescape(encodeURIComponent(message)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await callGoogleApi('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      body: JSON.stringify({ raw: encodedMessage }),
    });

    return { success: true, messageId: res.id };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// 5. Google Chat: List Spaces
export async function listChatSpaces() {
  const token = getCachedAccessToken();
  if (!token) {
    return { connected: false, spaces: [], error: 'Sign in with Google required' };
  }

  try {
    const data = await callGoogleApi('https://chat.googleapis.com/v1/spaces');
    return { connected: true, spaces: data.spaces || [], error: null };
  } catch (err: any) {
    return { connected: false, spaces: [], error: err.message };
  }
}

// 6. Google Contacts: Fetch contacts for Brand CRM
export async function fetchGoogleContacts() {
  const token = getCachedAccessToken();
  if (!token) {
    return { connected: false, contacts: [], error: 'Sign in with Google required' };
  }

  try {
    const url = new URL('https://people.googleapis.com/v1/people/me/connections');
    url.searchParams.set('personFields', 'names,emailAddresses,phoneNumbers,organizations');
    url.searchParams.set('pageSize', '20');

    const data = await callGoogleApi(url.toString());
    const contacts = (data.connections || []).map((person: any) => ({
      resourceName: person.resourceName,
      name: person.names?.[0]?.displayName || 'Unknown Contact',
      email: person.emailAddresses?.[0]?.value || '',
      organization: person.organizations?.[0]?.name || '',
    }));

    return { connected: true, contacts, error: null };
  } catch (err: any) {
    return { connected: false, contacts: [], error: err.message };
  }
}
