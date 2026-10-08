import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../auth/firebase/services.js";

/** Returns { user, ready } for the signed-in Firebase user. */
export default function useCurrentUser() {
  const [user, setUser] = useState(auth?.currentUser ?? null);
  const [ready, setReady] = useState(!auth);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, (next) => {
      setUser(next);
      setReady(true);
    });
  }, []);

  return { user, ready };
}
