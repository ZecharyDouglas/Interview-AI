import { useState, useMemo } from "react";

export const authentication = useMemo(() => {
  const [session, setSession] = useState(null);
  return {
    signIn: () => {
      setSession({
        user: {
          name: null,
          email: null,
        },
      });
    },
    signOut: () => {
      setSession(null);
    },
  };
}, [session]);
