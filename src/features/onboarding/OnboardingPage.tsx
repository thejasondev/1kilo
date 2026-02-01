import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { DexieAdapter } from "@/lib/storage/dexieAdapter";
import { type UserProfile, db } from "@/lib/storage/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Target,
  TrendingUp,
  Calendar,
  Zap,
  Wind,
  User,
  Dumbbell,
  Anchor,
} from "lucide-react";
import {
  ACTIVITY_LEVELS,
  GOALS,
  RECOMMENDED_RATES,
  SOMATOTYPES,
  calculateBMR,
  calculateTDEE,
  calculateSmartCalories,
  calculateMacros,
  calculateProjectedDate,
} from "@/lib/fitness/calculations";
import { DEFAULT_ROUTINES } from "@/lib/data/defaultRoutines";

export function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    name: "",
    gender: "male",
    age: 25,
    height: 170,
    weight: 70,
    activityLevel: 1.375,
    goal: "maintain",
    somatotype: "mesomorph", // Default
    targetWeight: 70,
    weeklyRate: 0,
    startDate: new Date().toISOString(),
  });

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  // Auto-set reasonable defaults when goal/weight changes
  const updateGoalStrategy = (strategy: "cut" | "maintain" | "bulk") => {
    let rate = RECOMMENDED_RATES[strategy];
    let target = formData.weight || 70;

    // Suggest target based on strategy
    if (strategy === "cut") target = Math.max(0, target - 5);
    if (strategy === "bulk") target = target + 5;

    update("goal", strategy);
    update("weeklyRate", rate);
    update("targetWeight", target);
  };

  const calculateFinalPlan = () => {
    if (
      !formData.weight ||
      !formData.height ||
      !formData.age ||
      !formData.gender ||
      !formData.activityLevel ||
      !formData.goal ||
      !formData.somatotype
    )
      return null;

    const bmr = calculateBMR(
      formData.weight,
      formData.height,
      formData.age,
      formData.gender,
    );
    const tdee = calculateTDEE(bmr, formData.activityLevel);
    // Use Smart Calories logic
    const targetCalories = calculateSmartCalories(
      tdee,
      formData.weeklyRate || 0,
    );
    // Use Somatotype-aware Macros
    const macros = calculateMacros(
      targetCalories,
      formData.goal,
      formData.somatotype,
    );

    return { tdee, targetCalories, macros };
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFinish = async () => {
    if (!user || isSubmitting) return;
    setIsSubmitting(true);
    const plan = calculateFinalPlan();

    if (!plan) {
      setIsSubmitting(false);
      return;
    }

    // Filter out id/email from formData to avoid overwrite warnings
    const { id, email, ...rest } = formData as any;

    // Construct final profile
    const profile: UserProfile = {
      ...rest,
      id: user.id,
      email: user.email || "",
      tdee: plan.tdee,
      macros: plan.macros,
      startWeight: formData.weight, // Capture start point
    };

    console.log("Saving profile:", profile);
    const adapter = new DexieAdapter<UserProfile>("profile");

    try {
      await adapter.create(profile);

      // Save initial weight log
      const today = new Date().toISOString().split("T")[0];
      await db.weight_logs.add({
        userId: user.id,
        date: today,
        weight: profile.weight,
      });

      // 🔮 ASSIGN DEFAULT ROUTINE
      if (formData.somatotype && DEFAULT_ROUTINES[formData.somatotype]) {
        const defaultRoutine = DEFAULT_ROUTINES[formData.somatotype];
        await db.routines.put(defaultRoutine);
        console.log("Assigned Routine:", defaultRoutine.name);
      }
    } catch (err) {
      console.warn("Error saving onboarding data", err);
      setIsSubmitting(false);
      return;
    }

    console.log("Profile saved, navigating...");
    // Let the live query redirect us or navigate manually
    // Ideally, we just wait. The ProtectedRoute will see the profile and redirect /onboarding -> /
    // defaulting to navigate
    navigate("/profile");
  };

  const update = (field: keyof UserProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const plan = calculateFinalPlan();

  // Projection Logic
  const projectedDate = calculateProjectedDate(
    formData.weight || 0,
    formData.targetWeight || 0,
    formData.weeklyRate || 0,
  );

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col justify-center max-w-lg mx-auto pb-safe">
      <div className="space-y-2 mb-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1.5 w-8 rounded-full transition-colors ${i <= step ? "bg-primary" : "bg-muted"}`}
              />
            ))}
          </div>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">
          {step === 1 && "Sobre Ti"}
          {step === 2 && "Tu Cuerpo"}
          {step === 3 && "Tus Medidas"}
          {step === 4 && "Tu Meta Maestra"}
          {step === 5 && "Tu Plan Pro"}
        </h1>
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="space-y-2">
              <Label>Nombre Completo</Label>
              <Input
                value={formData.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Tu nombre"
                className="h-12 text-lg"
                autoFocus
              />
            </div>

            <div className="space-y-3">
              <Label>Género</Label>
              <div className="grid grid-cols-2 gap-4">
                {["male", "female"].map((g) => (
                  <button
                    key={g}
                    onClick={() => update("gender", g)}
                    className={`h-24 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                      formData.gender === g
                        ? "border-primary bg-primary/10 text-primary font-bold"
                        : "border-border bg-card text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    <span className="capitalize text-lg">
                      {g === "male" ? "Hombre" : "Mujer"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Edad</Label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) => update("age", parseInt(e.target.value))}
                className="h-12 text-lg"
              />
            </div>
          </div>
        )}

        {/* Step 2: Somatotype */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-300">
            <p className="text-muted-foreground text-center text-sm px-4">
              Selecciona el tipo de cuerpo que mejor describe tu estructura
              natural.
            </p>
            <div className="grid grid-cols-1 gap-3">
              {SOMATOTYPES.map((type) => {
                let Icon = User;
                if (type.value === "ectomorph") Icon = Wind;
                if (type.value === "mesomorph") Icon = Dumbbell;
                if (type.value === "endomorph") Icon = Anchor;

                return (
                  <button
                    key={type.value}
                    onClick={() => update("somatotype", type.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-4 ${
                      formData.somatotype === type.value
                        ? "border-primary bg-primary/5 shadow-md relative overflow-hidden"
                        : "border-border bg-card hover:bg-muted/30"
                    }`}
                  >
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${
                        formData.somatotype === type.value
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3
                        className={`font-bold text-lg mb-1 ${formData.somatotype === type.value ? "text-primary" : "text-foreground"}`}
                      >
                        {type.label}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {type.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="space-y-2">
              <Label>Altura (cm)</Label>
              <Input
                type="number"
                value={formData.height}
                onChange={(e) => update("height", parseInt(e.target.value))}
                className="h-14 text-2xl font-bold"
                placeholder="170"
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label>Peso Actual (kg)</Label>
              <Input
                type="number"
                value={formData.weight}
                onChange={(e) => {
                  const w = parseInt(e.target.value);
                  update("weight", w);
                  if (formData.goal === "maintain") update("targetWeight", w);
                }}
                className="h-14 text-2xl font-bold"
                placeholder="70"
              />
            </div>
            <div className="space-y-3">
              <Label>Nivel de Actividad</Label>
              <div className="space-y-2">
                {ACTIVITY_LEVELS.slice(0, 3).map((level) => (
                  <button
                    key={level.value}
                    onClick={() => update("activityLevel", level.value)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      formData.activityLevel === level.value
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-card hover:border-muted-foreground"
                    }`}
                  >
                    <div className="font-bold text-sm flex justify-between">
                      {level.label}
                      {formData.activityLevel === level.value && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
            <div className="grid grid-cols-3 gap-2">
              {GOALS.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => updateGoalStrategy(goal.value as any)}
                  className={`p-2 rounded-lg border text-center transition-all flex flex-col items-center gap-1 ${
                    formData.goal === goal.value
                      ? "border-primary bg-primary/5 text-primary font-bold shadow-sm"
                      : "border-border bg-card text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  {goal.value === "cut" && (
                    <TrendingUp className="h-5 w-5 rotate-180" />
                  )}
                  {goal.value === "maintain" && <Target className="h-5 w-5" />}
                  {goal.value === "bulk" && <TrendingUp className="h-5 w-5" />}
                  <span className="text-xs">{goal.label}</span>
                </button>
              ))}
            </div>

            <div className="p-4 bg-muted/20 rounded-xl border border-border space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-muted-foreground text-xs uppercase font-bold">
                    Peso Meta
                  </Label>
                  <div className="flex items-end gap-1">
                    <Input
                      type="number"
                      className="h-10 w-20 text-lg font-bold p-1 bg-transparent border-0 border-b border-primary rounded-none focus-visible:ring-0 px-0"
                      value={formData.targetWeight}
                      onChange={(e) =>
                        update("targetWeight", parseFloat(e.target.value))
                      }
                    />
                    <span className="text-sm font-medium mb-2">kg</span>
                  </div>
                </div>
                <div className="text-right">
                  <Label className="text-muted-foreground text-xs uppercase font-bold">
                    Diferencia
                  </Label>
                  <p
                    className={`text-2xl font-black ${
                      (formData.targetWeight || 0) > (formData.weight || 0)
                        ? "text-emerald-500"
                        : (formData.targetWeight || 0) < (formData.weight || 0)
                          ? "text-amber-500"
                          : "text-muted-foreground"
                    }`}
                  >
                    {(formData.targetWeight || 0) - (formData.weight || 0) > 0
                      ? "+"
                      : ""}
                    {(
                      (formData.targetWeight || 0) - (formData.weight || 0)
                    ).toFixed(1)}{" "}
                    kg
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Ritmo Semanal</Label>
                  <span className="text-sm font-bold text-primary">
                    {formData.weeklyRate && formData.weeklyRate > 0 ? "+" : ""}
                    {formData.weeklyRate} kg/sem
                  </span>
                </div>
                <Slider
                  defaultValue={[formData.weeklyRate || 0]}
                  min={-1.5}
                  max={1.5}
                  step={0.1}
                  onValueChange={(vals) => update("weeklyRate", vals[0])}
                  className="py-2"
                />
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-center gap-4">
              <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-primary uppercase">
                  Proyección
                </p>
                <p className="text-lg font-black text-foreground capitalize">
                  {projectedDate.toLocaleDateString("es-ES", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 5 && plan && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
            <Card className="p-6 bg-primary text-primary-foreground text-center shadow-xl">
              <p className="font-medium opacity-90 mb-1">Tu Meta Diaria</p>
              <h2 className="text-5xl font-black tracking-tighter mb-2">
                {plan.targetCalories}
              </h2>
              <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-4">
                Kcal
              </p>
              <div className="inline-flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full text-xs font-bold">
                <Zap className="h-3 w-3" />
                Adaptado a{" "}
                {
                  SOMATOTYPES.find((s) => s.value === formData.somatotype)
                    ?.label
                }
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <MacroCard
                label="Proteína"
                amount={plan.macros.protein}
                color="bg-emerald-500"
              />
              <MacroCard
                label="Carbs"
                amount={plan.macros.carbs}
                color="bg-amber-500"
              />
              <MacroCard
                label="Grasa"
                amount={plan.macros.fats}
                color="bg-violet-500"
              />
            </div>

            <div className="p-3 bg-muted/40 rounded-lg text-center">
              <p className="text-xs text-muted-foreground">
                Hemos asignado una rutina{" "}
                <strong>
                  {DEFAULT_ROUTINES[formData.somatotype as "ectomorph"].name}
                </strong>{" "}
                basada en tu cuerpo.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 flex gap-4">
        {step > 1 && (
          <Button
            variant="outline"
            size="lg"
            onClick={handleBack}
            className="flex-1"
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Atrás
          </Button>
        )}
        {step < 5 ? (
          <Button
            className="flex-1 font-bold shadow-lg"
            size="lg"
            onClick={handleNext}
          >
            Siguiente <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            className="flex-1 font-bold shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white"
            size="lg"
            onClick={handleFinish}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Creando Plan..."
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" /> Comenzar Plan
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

function MacroCard({
  label,
  amount,
  color,
}: {
  label: string;
  amount: number;
  color: string;
}) {
  return (
    <Card className="p-4 text-center border-border bg-card">
      <div className={`h-2 w-8 mx-auto rounded-full mb-3 ${color}`} />
      <p className="text-2xl font-black">{amount}g</p>
      <p className="text-[10px] uppercase font-bold text-muted-foreground">
        {label}
      </p>
    </Card>
  );
}
