import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { DiaryPage } from "@/features/diary/DiaryPage";
import { WorkoutPage } from "@/features/workout/WorkoutPage";
import { CreateRoutinePage } from "@/features/workout/CreateRoutinePage";
import { AuthProvider, useAuth } from "@/features/auth/AuthContext";
import { AuthPage } from "@/features/auth/AuthPage";
import { OnboardingPage } from "@/features/onboarding/OnboardingPage";
import { ProfilePage } from "@/features/profile/ProfilePage";
import { db } from "@/lib/storage/db";
import { ProgressPage } from "@/features/progress/ProgressPage";
import { useLiveQuery } from "dexie-react-hooks";

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

function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { session, isLoading, user } = useAuth();
  const location = useLocation();

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

  // Redirect to onboarding if no profile and not already there
  if (!hasProfile && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // Redirect to home if has profile and trying to access onboarding
  if (hasProfile && location.pathname === "/onboarding") {
    return <Navigate to="/" replace />;
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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/diary" replace />} />
            <Route path="/diary" element={<DiaryPage />} />
            <Route path="/workout" element={<WorkoutPage />} />
            <Route path="/workout/create" element={<CreateRoutinePage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
