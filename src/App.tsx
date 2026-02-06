import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { AuthProvider, useAuth } from "@/features/auth/AuthContext";
import { db } from "@/lib/storage/db";
import { useLiveQuery } from "dexie-react-hooks";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Lazy load route components for code splitting
const DiaryPage = lazy(() =>
  import("@/features/diary/DiaryPage").then((m) => ({ default: m.DiaryPage })),
);
const WorkoutPage = lazy(() =>
  import("@/features/workout/WorkoutPage").then((m) => ({
    default: m.WorkoutPage,
  })),
);
const CreateRoutinePage = lazy(() =>
  import("@/features/workout/CreateRoutinePage").then((m) => ({
    default: m.CreateRoutinePage,
  })),
);
const ProgressPage = lazy(() =>
  import("@/features/progress/ProgressPage").then((m) => ({
    default: m.ProgressPage,
  })),
);
const ProfilePage = lazy(() =>
  import("@/features/profile/ProfilePage").then((m) => ({
    default: m.ProfilePage,
  })),
);
const OnboardingPage = lazy(() =>
  import("@/features/onboarding/OnboardingPage").then((m) => ({
    default: m.OnboardingPage,
  })),
);
const AuthPage = lazy(() =>
  import("@/features/auth/AuthPage").then((m) => ({ default: m.AuthPage })),
);

function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <h1 className="text-4xl font-black tracking-tighter text-white">
          1Kilo
        </h1>
        <div className="h-1 w-24 bg-zinc-800 overflow-hidden rounded-full">
          <div className="h-full w-1/2 bg-white animate-[translateX_1s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  );
}

// Lightweight loading indicator for lazy routes
function RouteLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
    </div>
  );
}

/**
 * Requires authentication. Redirects to /auth if not logged in.
 */
function RequireAuth({ children }: { children: React.ReactElement }) {
  const { session, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!session) return <Navigate to="/auth" replace />;

  return children;
}

/**
 * Requires authentication + profile. Redirects to /onboarding if no profile.
 */
function RequireProfile({ children }: { children: React.ReactElement }) {
  const { session, isLoading, user } = useAuth();

  // Use LiveQuery to react immediately to profile creation
  const profile = useLiveQuery(async () => {
    if (!user) return null;
    return await db.profile.get(user.id);
  }, [user]);

  // Wait for profile check to complete (undefined means loading)
  const isCheckingProfile = profile === undefined;
  const hasProfile = !!profile;

  if (isLoading || (user && isCheckingProfile)) return <LoadingScreen />;
  if (!session) return <Navigate to="/auth" replace />;

  // Redirect to onboarding if no profile
  if (!hasProfile) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial hydration
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<RouteLoader />}>
            <Routes>
              {/* Public route */}
              <Route path="/auth" element={<AuthPage />} />

              {/* Onboarding - requires auth but NO profile required */}
              <Route
                path="/onboarding"
                element={
                  <RequireAuth>
                    <OnboardingPage />
                  </RequireAuth>
                }
              />

              {/* Protected routes - require auth + profile */}
              <Route
                element={
                  <RequireProfile>
                    <AppLayout />
                  </RequireProfile>
                }
              >
                <Route path="/" element={<Navigate to="/diary" replace />} />
                <Route path="/diary" element={<DiaryPage />} />
                <Route path="/workout" element={<WorkoutPage />} />
                <Route path="/workout/create" element={<CreateRoutinePage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
