"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import api, { UserResponse, TokenResponse } from "@/lib/api";

interface AuthContextType {
  user: UserResponse | null;
  firebaseUser: FirebaseUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  signUpWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapFirebaseError(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/cancelled-popup-request":
      return "Google sign-in was cancelled.";
    case "auth/popup-blocked":
      return "Popup was blocked by your browser. Please allow popups.";
    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";
    default:
      return "Authentication failed. Please try again.";
  }
}

interface FirebaseErrorLike {
  code?: string;
  message?: string;
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) {
    if (err.message.includes("taking too long") || err.message.includes("try again")) {
      return err.message;
    }
  }
  if (err && typeof err === "object") {
    const fbErr = err as FirebaseErrorLike;
    if (fbErr.code) return mapFirebaseError(fbErr.code);
    if (fbErr.message) return fbErr.message;
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return fallback;
}

function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(errorMessage));
    }, timeoutMs);
  });

  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timer);
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserResponse | null>(() => api.getCachedUser());
  const [token, setToken] = useState<string | null>(() => api.getToken());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // In-flight promise tracker to dedup concurrent sync requests
  const syncPromiseRef = React.useRef<Promise<TokenResponse> | null>(null);

  const clearError = () => setError(null);

  // Sync token with backend
  const syncWithBackend = useCallback(async (fbUser: FirebaseUser) => {
    if (syncPromiseRef.current) {
      return syncPromiseRef.current;
    }

    const promise = (async () => {
      try {
        // Force fresh token verification from Google Identity Platform
        const idToken = await withTimeout(
          fbUser.getIdToken(true),
          10000,
          "Authentication is taking too long. Please try again."
        );
        const tokenResp = await api.exchangeFirebaseToken(idToken, 10000);
        setUser(tokenResp.user);
        setToken(tokenResp.access_token);
        return tokenResp;
      } catch (err: unknown) {
        console.error("Backend auth sync error:", err);
        // Fallback local user structure if backend is temporarily unreachable
        const fallbackUser: UserResponse = {
          id: fbUser.uid,
          email: fbUser.email || "",
          full_name: fbUser.displayName || null,
          firebase_uid: fbUser.uid,
        };
        setUser(fallbackUser);
        throw err;
      } finally {
        syncPromiseRef.current = null;
      }
    })();

    syncPromiseRef.current = promise;
    return promise;
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentFbUser) => {
      setFirebaseUser(currentFbUser);
      if (currentFbUser) {
        try {
          await syncWithBackend(currentFbUser);
        } catch {
          console.warn("Could not sync with backend on initial load, using cached/firebase user");
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setToken(null);
        api.clearSession();
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [syncWithBackend]);

  const signUpWithEmail = async (name: string, email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      const cred = await withTimeout(
        createUserWithEmailAndPassword(auth, email, pass),
        15000,
        "Authentication is taking too long. Please try again."
      );
      if (name && cred.user) {
        try {
          await updateProfile(cred.user, { displayName: name });
        } catch {
          // non-critical
        }
      }
      await syncWithBackend(cred.user);
    } catch (err: unknown) {
      const friendlyMessage = getErrorMessage(err, "Failed to create account.");
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      const cred = await withTimeout(
        signInWithEmailAndPassword(auth, email, pass),
        15000,
        "Authentication is taking too long. Please try again."
      );
      await syncWithBackend(cred.user);
    } catch (err: unknown) {
      const friendlyMessage = getErrorMessage(err, "Failed to sign in.");
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const cred = await withTimeout(
        signInWithPopup(auth, googleProvider),
        60000,
        "Authentication is taking too long. Please try again."
      );
      await syncWithBackend(cred.user);
    } catch (err: unknown) {
      const friendlyMessage = getErrorMessage(err, "Google sign-in failed.");
      setError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      api.clearSession();
      setUser(null);
      setFirebaseUser(null);
      setToken(null);
    } catch (err: unknown) {
      console.error("Sign out error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        token,
        loading,
        error,
        clearError,
        signUpWithEmail,
        signInWithEmail,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
