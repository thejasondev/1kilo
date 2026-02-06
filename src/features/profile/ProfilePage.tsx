import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserProfile } from "@/lib/storage/db";
import { DexieAdapter } from "@/lib/storage/dexieAdapter";
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  User,
  Ruler,
  Weight,
  Activity,
  Edit2,
  Flame,
  Target,
  Scale,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  calculateSmartCalories,
  calculateMacros,
  calculateBMI,
  RATE_LIMITS,
  MIN_SAFE_CALORIES,
  getRateIntensity,
  calculateWeeksToGoal,
} from "@/lib/fitness/calculations";
import { ProfileSkeleton } from "@/components/ui/skeleton";
import { SyncStatusIndicator } from "@/components/SyncStatusIndicator";

// Goal labels for display
const GOAL_LABELS: Record<string, string> = {
  cut: "Perder Grasa",
  maintain: "Mantener",
  bulk: "Ganar Músculo",
};

// BMI category and color
function getBMIInfo(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: "Bajo peso", color: "text-blue-500" };
  if (bmi < 25) return { label: "Normal", color: "text-emerald-500" };
  if (bmi < 30) return { label: "Sobrepeso", color: "text-amber-500" };
  return { label: "Obesidad", color: "text-red-500" };
}

export function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editRate, setEditRate] = useState(0);
  const [editTarget, setEditTarget] = useState(0);

  const loadProfile = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    const adapter = new DexieAdapter<UserProfile>("profile");
    const p = await adapter.getById(user.id);

    if (p) {
      setEditRate(p.weeklyRate || 0);
      setEditTarget(p.targetWeight || p.weight);

      // Auto-recalculate macros if they seem stale (not matching g/kg formula)
      const expectedProtein = Math.round(
        p.weight * (p.goal === "cut" ? 2.0 : p.goal === "bulk" ? 1.8 : 1.6),
      );
      const currentProtein = p.macros?.protein || 0;

      // If protein differs by more than 10%, recalculate
      if (Math.abs(currentProtein - expectedProtein) > expectedProtein * 0.1) {
        const tdee = p.tdee || 2000;
        const targetCalories = calculateSmartCalories(tdee, p.weeklyRate || 0);
        const newMacros = calculateMacros(
          targetCalories,
          p.goal,
          p.weight,
          p.somatotype,
        );

        const updated: UserProfile = { ...p, macros: newMacros };
        await adapter.update(user.id, updated);
        setProfile(updated);
      } else {
        setProfile(p);
      }
    } else {
      setProfile(null);
    }

    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user, loadProfile]);

  // Get dynamic slider limits based on goal
  const sliderLimits = useMemo(() => {
    if (!profile) return { min: -0.75, max: 0.35, step: 0.05 };
    const limits = RATE_LIMITS[profile.goal];
    return {
      min: limits.min,
      max: limits.max,
      step: 0.05,
    };
  }, [profile]);

  // Calculate preview calories for edit dialog
  const previewCalories = useMemo(() => {
    if (!profile) return 0;
    return calculateSmartCalories(profile.tdee || 2000, editRate);
  }, [profile, editRate]);

  // Check if preview calories are too low
  const isCaloriesTooLow = previewCalories < MIN_SAFE_CALORIES;

  // Get rate intensity
  const rateIntensity = useMemo(() => {
    if (!profile) return { label: "", color: "" };
    return getRateIntensity(profile.goal, editRate);
  }, [profile, editRate]);

  const handleCreatePlan = async () => {
    if (!profile || !user || isCaloriesTooLow) return;

    const tdee = profile.tdee || 2000;
    const targetCalories = calculateSmartCalories(tdee, editRate);
    const macros = calculateMacros(
      targetCalories,
      profile.goal,
      profile.weight,
      profile.somatotype,
    );

    const updated: UserProfile = {
      ...profile,
      targetWeight: editTarget,
      weeklyRate: editRate,
      tdee: tdee,
      macros: macros,
    };

    const adapter = new DexieAdapter<UserProfile>("profile");
    await adapter.update(user.id, updated);
    setProfile(updated);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  // Computed values
  const bmiValue = profile
    ? parseFloat(calculateBMI(profile.weight, profile.height))
    : 0;
  const bmiInfo = getBMIInfo(bmiValue);

  const targetCalories = profile
    ? calculateSmartCalories(profile.tdee || 2000, profile.weeklyRate || 0)
    : 0;

  const weeksRemaining = profile
    ? calculateWeeksToGoal(
        profile.weight,
        profile.targetWeight || profile.weight,
        profile.weeklyRate || 0,
      )
    : 0;

  // Progress percentage
  const progressPercent = useMemo(() => {
    if (!profile || !profile.startWeight || !profile.targetWeight) return 0;
    const totalChange = Math.abs(profile.targetWeight - profile.startWeight);
    const currentChange = Math.abs(profile.weight - profile.startWeight);
    if (totalChange === 0) return 100;
    return Math.min(100, Math.round((currentChange / totalChange) * 100));
  }, [profile]);

  const currentRateIntensity = profile
    ? getRateIntensity(profile.goal, profile.weeklyRate || 0)
    : { label: "", color: "" };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto pb-24 px-4">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-md mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center gap-4 py-4">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary border border-primary/20">
          <User className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{profile?.name || "Usuario"}</h1>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <div className="mt-1">
            <SyncStatusIndicator />
          </div>
        </div>
      </div>

      {/* Target Calories - Prominent Display */}
      {profile && (
        <Card className="p-5 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/20 text-primary">
                <Flame className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">
                  Calorías Objetivo
                </p>
                <p className="text-3xl font-black tracking-tight">
                  {targetCalories.toLocaleString()}
                  <span className="text-lg font-medium text-muted-foreground ml-1">
                    kcal
                  </span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary">
                <Target className="h-3 w-3" />
                {GOAL_LABELS[profile.goal]}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Stats Grid */}
      {profile && (
        <section className="grid grid-cols-2 gap-3">
          <StatCard icon={Weight} label="Peso" value={`${profile.weight} kg`} />
          <StatCard
            icon={Ruler}
            label="Altura"
            value={`${profile.height} cm`}
          />
          <StatCard
            icon={Scale}
            label="IMC"
            value={bmiValue.toFixed(1)}
            badge={bmiInfo.label}
            badgeColor={bmiInfo.color}
          />
          <StatCard
            icon={Activity}
            label="TDEE"
            value={`${profile.tdee} kcal`}
          />
        </section>
      )}

      {/* Goal Summary Card - Enhanced */}
      {profile && (
        <Card className="p-5 border-border bg-card shadow-sm border-l-4 border-l-primary relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
                Tu Meta
              </h3>
              <p className="text-xs text-muted-foreground">
                {profile.goal === "cut" ? "Perder" : "Ganar"}{" "}
                {Math.abs(
                  (profile.targetWeight || profile.weight) - profile.weight,
                ).toFixed(1)}{" "}
                kg
              </p>
            </div>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  aria-label="Editar meta"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajustar Meta</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="target-weight">Peso Meta (kg)</Label>
                    <Input
                      id="target-weight"
                      type="number"
                      value={editTarget}
                      onChange={(e) =>
                        setEditTarget(parseFloat(e.target.value))
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label>Ritmo Semanal</Label>
                      <div className="text-right">
                        <span className="font-bold text-primary">
                          {editRate > 0 ? "+" : ""}
                          {editRate.toFixed(2)} kg/sem
                        </span>
                        <span className={`text-xs ml-2 ${rateIntensity.color}`}>
                          ({rateIntensity.label})
                        </span>
                      </div>
                    </div>
                    <Slider
                      value={[editRate]}
                      min={sliderLimits.min}
                      max={sliderLimits.max}
                      step={sliderLimits.step}
                      onValueChange={(v) => setEditRate(v[0])}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{sliderLimits.min} kg</span>
                      <span>{sliderLimits.max} kg</span>
                    </div>

                    {/* Calorie Preview */}
                    <div className="p-3 rounded-lg bg-muted/50">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Calorías diarias:
                        </span>
                        <span
                          className={`font-bold ${isCaloriesTooLow ? "text-red-500" : ""}`}
                        >
                          {previewCalories.toLocaleString()} kcal
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {editRate < 0
                          ? `Déficit: ${Math.abs(editRate * 1100).toFixed(0)} kcal/día`
                          : editRate > 0
                            ? `Superávit: ${(editRate * 1100).toFixed(0)} kcal/día`
                            : "Mantenimiento"}
                      </p>
                    </div>

                    {/* Warning for too low calories */}
                    {isCaloriesTooLow && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <p className="text-xs">
                          Mínimo recomendado: {MIN_SAFE_CALORIES} kcal/día
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={handleCreatePlan}
                    className="w-full font-bold"
                    disabled={isCaloriesTooLow}
                  >
                    Actualizar Plan
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Progress Bar */}
          {profile.startWeight && profile.targetWeight && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{profile.startWeight} kg</span>
                <span>{progressPercent}%</span>
                <span>{profile.targetWeight} kg</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}

          <div className="flex justify-between items-end">
            <div>
              <p className="text-3xl font-black tracking-tighter">
                {profile.targetWeight} kg
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {weeksRemaining > 0 ? (
                  <span>
                    ~{weeksRemaining} semanas ({Math.ceil(weeksRemaining / 4)}{" "}
                    meses)
                  </span>
                ) : (
                  <span>Meta alcanzada</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-bold ${
                  profile.weeklyRate && profile.weeklyRate > 0
                    ? "text-emerald-500"
                    : profile.weeklyRate && profile.weeklyRate < 0
                      ? "text-amber-500"
                      : "text-muted-foreground"
                }`}
              >
                {profile.weeklyRate && profile.weeklyRate > 0 ? "+" : ""}
                {profile.weeklyRate} kg/sem
              </p>
              <p className={`text-xs ${currentRateIntensity.color}`}>
                {currentRateIntensity.label}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Macros Summary */}
      {profile?.macros && (
        <Card className="p-5 border-border bg-card shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">
              Tus Macros
            </h3>
            <span className="text-xs text-muted-foreground">
              {profile.weight} kg ×{" "}
              {profile.goal === "cut"
                ? "2.0"
                : profile.goal === "bulk"
                  ? "1.8"
                  : "1.6"}{" "}
              g/kg proteína
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-black text-emerald-500">
                {profile.macros.protein}g
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                Proteína
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-black text-amber-500">
                {profile.macros.carbs}g
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                Carbos
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-black text-violet-500">
                {profile.macros.fats}g
              </p>
              <p className="text-xs font-medium text-muted-foreground">Grasa</p>
            </div>
          </div>
        </Card>
      )}

      {/* Logout */}
      <div className="pt-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
        >
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  badge?: string;
  badgeColor?: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
  badge,
  badgeColor,
}: StatCardProps) {
  return (
    <Card className="p-4 border-border bg-card/50">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-muted text-muted-foreground shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-bold truncate">{value}</p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground uppercase font-medium">
              {label}
            </p>
            {badge && (
              <span className={`text-xs font-bold ${badgeColor}`}>{badge}</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
