import { initializeApp } from "firebase/app";
import {
  getAuth,
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// --- Auth helpers ---
export async function sendMagicLink(email) {
  const actionCodeSettings = {
    url: window.location.origin + "/login",
    handleCodeInApp: true,
  };
  localStorage.setItem("emailForSignIn", email);
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
}

export async function completeMagicLinkSignIn() {
  if (!isSignInWithEmailLink(auth, window.location.href)) return null;

  let email = localStorage.getItem("emailForSignIn");
  if (!email) {
    email = window.prompt("Please confirm your email for sign-in");
  }
  try {
    const cred = await signInWithEmailLink(auth, email, window.location.href);
    localStorage.removeItem("emailForSignIn");

    // Ensure a user profile exists (optional but useful)
    const uref = doc(db, "users", cred.user.uid);
    const snap = await getDoc(uref);
    if (!snap.exists()) {
      await setDoc(uref, {
        email,
        role: "sales",        // default role; elevate via Manager UI later
        active: true,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
    } else {
      // touch last login
      await setDoc(uref, { lastLoginAt: serverTimestamp() }, { merge: true });
    }

    return cred.user;
  } catch (err) {
    console.error("Sign-in failed:", err);
    throw err;
  }
}

export function watchAuth(cb) {
  return onAuthStateChanged(auth, cb);
}

export async function logout() {
  try {
    await signOut(auth);
  } finally {
    // remove any app-local caches
    localStorage.removeItem("emailForSignIn");
    localStorage.removeItem("storeCode");
  }
}