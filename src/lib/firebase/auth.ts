import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth, isFirebaseConfigured, db } from './config';
import { doc, getDoc } from 'firebase/firestore';
import { AdminUser } from '@/types';

// Admin emails configured via environment variable (comma separated)
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/**
 * Checks whether a given user is authorized as an administrator.
 * Verification checks:
 * 1. Environment-configured ADMIN_EMAILS (initial setup bootstrap)
 * 2. Dedicated 'admin_roles' collection in Firestore (server-verifiable)
 */
export async function checkIfAdmin(user: FirebaseUser | null): Promise<boolean> {
  if (!user || !user.email) return false;

  const emailLower = user.email.toLowerCase();

  // 1. Direct bootstrap check
  if (ADMIN_EMAILS.includes(emailLower)) {
    return true;
  }

  // 2. Firestore admin_roles document check
  if (db && isFirebaseConfigured) {
    try {
      const adminDocRef = doc(db, 'admin_roles', user.uid);
      const snapshot = await getDoc(adminDocRef);
      if (snapshot.exists() && snapshot.data()?.active === true) {
        return true;
      }
    } catch (err) {
      console.warn('Error verificando rol de administrador en Firestore:', err);
    }
  }

  return false;
}

/**
 * Sign in using Google OAuth Popup
 */
export async function signInWithGoogle(): Promise<{
  user: FirebaseUser | null;
  isAdmin: boolean;
  isDemoMode?: boolean;
}> {
  if (!isFirebaseConfigured || !auth) {
    console.info('Firebase no está configurado. Activando sesión demostrativa de desarrollo.');
    // Demo administrator session for previewing UI
    return {
      user: {
        uid: 'demo-admin-uid-123',
        email: 'administradora.demo@rosistudio.com',
        displayName: 'Administradora Rosi Studio (Demo)',
        photoURL: null,
      } as unknown as FirebaseUser,
      isAdmin: true,
      isDemoMode: true,
    };
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  const result = await signInWithPopup(auth, provider);
  const isAdmin = await checkIfAdmin(result.user);

  return {
    user: result.user,
    isAdmin,
    isDemoMode: false,
  };
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  if (auth && isFirebaseConfigured) {
    await firebaseSignOut(auth);
  }
}

/**
 * Listen to auth state changes
 */
export function subscribeToAuth(
  callback: (user: AdminUser | null) => void
): () => void {
  if (!auth || !isFirebaseConfigured) {
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }

    const isAdmin = await checkIfAdmin(firebaseUser);

    callback({
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      isAdmin,
    });
  });
}
