import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth, googleProvider } from './config';

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: unknown) {
    return { user: null, error: error instanceof Error ? error.message : 'Google sign-in failed' };
  }
}

export async function loginWithEmail(email: string, pass: string) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return { user: result.user, error: null };
  } catch (error: unknown) {
    return { user: null, error: error instanceof Error ? error.message : 'Email sign-in failed' };
  }
}

export async function registerWithEmail(email: string, pass: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    return { user: result.user, error: null };
  } catch (error: unknown) {
    return { user: null, error: error instanceof Error ? error.message : 'Registration failed' };
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : 'Sign out failed' };
  }
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
