import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { watchAuth, db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = watchAuth(async (fbUser) => {
      setUser(fbUser || null);
      setProfile(null);

      if (fbUser) {
        const uref = doc(db, "users", fbUser.uid);
        const off = onSnapshot(uref, (snap) => {
          setProfile(snap.exists() ? snap.data() : null);
          setLoading(false);
        });
        return () => off();
      } else {
        setLoading(false);
      }
    });
    return () => unsub && unsub();
  }, []);

  const role = profile?.role || null;
  const value = useMemo(() => ({ user, role, profile, loading }), [user, role, profile, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}