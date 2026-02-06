import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  validatePassword,
  getPasswordStrength,
  getAuthErrorMessage,
} from "@/lib/auth/passwordValidation";

export function AuthPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password validation (only show during signup)
  const passwordValidation = useMemo(() => {
    if (!isSignUp || !password) return null;
    return validatePassword(password);
  }, [password, isSignUp]);

  const passwordStrength = useMemo(() => {
    if (!passwordValidation) return null;
    return getPasswordStrength(passwordValidation.score);
  }, [passwordValidation]);

  // Handle email/password auth
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate password strength on signup
    if (isSignUp && passwordValidation && !passwordValidation.isValid) {
      setError("La contraseña no cumple los requisitos mínimos");
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      navigate("/");
    } catch (err: any) {
      setError(getAuthErrorMessage(err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(getAuthErrorMessage(err.message));
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-foreground">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo & Title */}
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            1Kilo
          </h1>
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Crea tu cuenta para empezar" : "Bienvenido de nuevo"}
          </p>
        </div>

        {/* Google OAuth Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 font-semibold gap-3 border-2 hover:bg-muted/50"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Continuar con Google
        </Button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground font-medium">
              o con email
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="bg-card border-border shadow-sm h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                className="bg-card border-border shadow-sm h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Password Strength Indicator (only on signup) */}
            {isSignUp && password && passwordValidation && (
              <div className="space-y-2 pt-1">
                {/* Strength Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-300 rounded-full",
                        passwordValidation.score === 0 && "w-0",
                        passwordValidation.score === 1 && "w-1/4 bg-red-500",
                        passwordValidation.score === 2 && "w-2/4 bg-amber-500",
                        passwordValidation.score === 3 && "w-3/4 bg-lime-500",
                        passwordValidation.score === 4 &&
                          "w-full bg-emerald-500",
                      )}
                    />
                  </div>
                  {passwordStrength && (
                    <span
                      className={cn(
                        "text-xs font-medium",
                        passwordStrength.color,
                      )}
                    >
                      {passwordStrength.label}
                    </span>
                  )}
                </div>

                {/* Requirements List */}
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { label: "8+ caracteres", met: password.length >= 8 },
                    { label: "Mayúscula", met: /[A-Z]/.test(password) },
                    { label: "Minúscula", met: /[a-z]/.test(password) },
                    { label: "Número", met: /[0-9]/.test(password) },
                  ].map((req) => (
                    <div
                      key={req.label}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      {req.met ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span
                        className={
                          req.met ? "text-emerald-600" : "text-muted-foreground"
                        }
                      >
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 p-3 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 font-bold shadow-lg"
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSignUp ? "Crear Cuenta" : "Iniciar Sesión"}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setPassword("");
            }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
          >
            {isSignUp
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta? Regístrate"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Al continuar, aceptas nuestros términos de servicio.
        </p>
      </div>
    </div>
  );
}
