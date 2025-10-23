// src/lib/firebase.js
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
  // swap getFirestore -> initializeFirestore so we can set transport options
  initializeFirestore,
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

// ✅ force a firewall-friendly transport (kills WebChannel 400s)
export const db = initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
  useFetchStreams: false,
  ignoreUndefinedProperties: true,
});

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

    // ensure user profile exists / update last login
    const uref = doc(db, "users", cred.user.uid);
    const snap = await getDoc(uref);
    if (!snap.exists()) {
      await setDoc(uref, {
        email,
        role: "sales",        // default; elevate later via Manager UI
        active: true,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
    } else {
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
    localStorage.removeItem("emailForSignIn");
    localStorage.removeItem("storeCode");
  }
}