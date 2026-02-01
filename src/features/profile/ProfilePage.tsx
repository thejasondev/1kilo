import { useAuth } from "@/features/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { useEffect, useState } from "react";
import { User, Settings, Ruler, Weight, Activity, Edit2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  calculateSmartCalories,
  calculateMacros,
  calculateProjectedDate,
} from "@/lib/fitness/calculations";

export function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editRate, setEditRate] = useState(0);
  const [editTarget, setEditTarget] = useState(0);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = () => {
    if (!user) return;
    const adapter = new DexieAdapter<UserProfile>("profile");
    adapter.getById(user.id).then((p) => {
      setProfile(p);
      if (p) {
        setEditRate(p.weeklyRate || 0);
        setEditTarget(p.targetWeight || p.weight);
      }
    });
  };

  const handleCreatePlan = async () => {
    if (!profile || !user) return;

    const tdee = profile.tdee || 2000;
    const targetCalories = calculateSmartCalories(tdee, editRate);
    const macros = calculateMacros(targetCalories, profile.goal);

    const updated: UserProfile = {
      ...profile,
      targetWeight: editTarget,
      weeklyRate: editRate,
      tdee: tdee, // unchanged base
      macros: macros, // updated
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

  const projectedDate = profile
    ? calculateProjectedDate(
        profile.weight,
        profile.targetWeight || profile.weight,
        profile.weeklyRate || 0,
      )
    : new Date();

  return (
    <div className="space-y-6 max-w-md mx-auto pb-24">
      <div className="flex items-center gap-4 py-4">
        <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
          <User className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">
            {profile?.name || "Usuario"}
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            {user?.email}
          </p>
        </div>
      </div>

      {profile && (
        <section className="grid grid-cols-2 gap-3">
          <StatCard
            icon={Ruler}
            label="Altura"
            value={`${profile.height} cm`}
          />
          <StatCard icon={Weight} label="Peso" value={`${profile.weight} kg`} />
          <StatCard
            icon={Activity}
            label="Metabolismo"
            value={`${profile.tdee} kcal`}
          />
          <StatCard icon={Settings} label="Objetivo" value={profile.goal} />
        </section>
      )}

      {/* Goal Summary Card */}
      {profile && (
        <Card className="p-5 border-border bg-card shadow-sm border-l-4 border-l-primary relative">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
              Tu Meta Maestra
            </h3>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajustar Meta</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label>Peso Meta (kg)</Label>
                    <Input
                      type="number"
                      value={editTarget}
                      onChange={(e) =>
                        setEditTarget(parseFloat(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label>Ritmo Semanal</Label>
                      <span className="font-bold">{editRate} kg/sem</span>
                    </div>
                    <Slider
                      value={[editRate]}
                      min={-1.5}
                      max={1.5}
                      step={0.1}
                      onValueChange={(v) => setEditRate(v[0])}
                    />
                  </div>
                  <Button
                    onClick={handleCreatePlan}
                    className="w-full font-bold"
                  >
                    Actualizar Plan
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-3xl font-black tracking-tighter">
                {profile.targetWeight} kg
              </p>
              <p className="text-xs text-muted-foreground">
                Llegada estimada:{" "}
                {projectedDate.toLocaleDateString("es-ES", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`font-bold ${profile.weeklyRate && profile.weeklyRate > 0 ? "text-emerald-500" : "text-amber-500"}`}
              >
                {profile.weeklyRate} kg/sem
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Macros Summary if available */}
      {profile?.macros && (
        <Card className="p-5 border-border bg-card shadow-sm">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4">
            Tus Macros Objetivo
          </h3>
          <div className="flex justify-between text-center">
            <div>
              <p className="text-2xl font-black text-emerald-600">
                {profile.macros.protein}g
              </p>
              <p className="text-xs font-bold text-muted-foreground">
                Proteína
              </p>
            </div>
            <div>
              <p className="text-2xl font-black text-amber-600">
                {profile.macros.carbs}g
              </p>
              <p className="text-xs font-bold text-muted-foreground">Carbos</p>
            </div>
            <div>
              <p className="text-2xl font-black text-violet-600">
                {profile.macros.fats}g
              </p>
              <p className="text-xs font-bold text-muted-foreground">Grasa</p>
            </div>
          </div>
        </Card>
      )}

      <div className="pt-4">
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:hover:bg-red-950/30"
        >
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <Card className="p-4 flex flex-col gap-2 items-start border-border bg-background/50">
      <div className="p-2 rounded-md bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-lg font-bold">{value}</p>
        <p className="text-xs text-muted-foreground uppercase font-bold">
          {label}
        </p>
      </div>
    </Card>
  );
}
