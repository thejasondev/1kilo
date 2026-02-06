import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "@/lib/supabase";
import { syncAllData, type SyncResult } from "@/lib/sync/syncService";
import type { Session, User } from "@supabase/supabase-js";

type SyncStatus = "idle" | "syncing" | "success" | "error";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  syncStatus: SyncStatus;
  lastSyncResult: SyncResult | null;
  signOut: () => Promise<void>;
  triggerSync: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>("idle");
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);

  const triggerSync = useCallback(async () => {
    if (!user) return;

    setSyncStatus("syncing");
    try {
      const result = await syncAllData(user.id);
      setLastSyncResult(result);
      setSyncStatus(result.success ? "success" : "error");

      // Reset status after 3 seconds
      setTimeout(() => setSyncStatus("idle"), 3000);
    } catch (error) {
      console.error("Sync failed:", error);
      setSyncStatus("error");
      setLastSyncResult({
        success: false,
        message: "Error de sincronización",
      });
    }
  }, [user]);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      // Trigger sync after login
      if (session?.user) {
        // Small delay to ensure DB is ready
        setTimeout(() => {
          syncAllData(session.user.id).then((result) => {
            setLastSyncResult(result);
            setSyncStatus(result.success ? "success" : "error");
            setTimeout(() => setSyncStatus("idle"), 3000);
          });
        }, 500);
      }
    });

    // 2. Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);

      // Sync on sign in
      if (event === "SIGNED_IN" && session?.user) {
        setTimeout(() => {
          syncAllData(session.user.id).then((result) => {
            setLastSyncResult(result);
            setSyncStatus(result.success ? "success" : "error");
            setTimeout(() => setSyncStatus("idle"), 3000);
          });
        }, 500);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSyncStatus("idle");
    setLastSyncResult(null);
  };

  const value = {
    session,
    user,
    isLoading,
    syncStatus,
    lastSyncResult,
    signOut,
    triggerSync,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
