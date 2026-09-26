import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize or retrieve the Firebase App instance using configuration
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Authentication service
export const auth = getAuth(app);

// Firestore Database instance (connecting to specific named database if configured)
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Export firestore as an alias to db for backwards compatibility
export const firestore = db;

// Firebase Cloud Storage instance
export const storage = getStorage(app);

// Configure Google Provider with requested Workspace Scopes for collaboration suite
export const googleAuthProvider = new GoogleAuthProvider();

// Scopes for Drive, Sheets, Forms, Gmail, Contacts, and Chat
const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/forms.body',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/chat.spaces.readonly',
];

WORKSPACE_SCOPES.forEach((scope) => {
  googleAuthProvider.addScope(scope);
});

// In-memory cache for OAuth access token (never stored in localStorage or persisted insecurely)
let inMemoryAccessToken: string | null = null;

export const setCachedAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const getCachedAccessToken = () => inMemoryAccessToken;

// Connection test helper
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, '_system', 'ping'));
    return true;
  } catch (err: any) {
    if (err?.message?.includes('the client is offline')) {
      console.warn('Firestore offline or pending connection.');
    }
    return false;
  }
}

export default {
  app,
  auth,
  db,
  storage,
  firestore,
};
