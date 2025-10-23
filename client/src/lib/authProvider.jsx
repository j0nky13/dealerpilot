// src/lib/authProvider.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthCtx = createContext({ user: null, role: null, profile: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u || null);

      if (!u) {
        setRole(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      // One-shot fetch of user profile (no real-time Listen)
      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() };
          setProfile(data);
          setRole(data.role || "sales");
        } else {
          // no profile document yet – allow app to continue
          setProfile(null);
          setRole("sales");
        }
      } catch (e) {
        console.error("[Auth] Failed to load profile:", e);
        // degrade gracefully so the app renders
        setProfile(null);
        setRole("sales");
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const value = useMemo(() => ({ user, role, profile, loading }), [user, role, profile, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}