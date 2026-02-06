import {
  Plus,
  Play,
  Dumbbell,
  Clock,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import type { Routine } from "@/lib/data/routinesDb";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/storage/db";
import { PREDEFINED_ROUTINES } from "@/lib/data/routinesDb";
import { useAuth } from "@/features/auth/AuthContext";
import { DexieAdapter } from "@/lib/storage/dexieAdapter";
import type { UserProfile } from "@/lib/storage/db";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function WorkoutPage() {
  const { user } = useAuth();
  const myRoutines = useLiveQuery(() => db.routines.toArray(), []);
  const profile = useLiveQuery(async () => {
    if (!user) return null;
    return await new DexieAdapter<UserProfile>("profile").getById(user.id);
  }, [user]);

  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);

  // Filter recommended routines based on user somatotype
  const recommendedRoutines = PREDEFINED_ROUTINES.filter((r) => {
    if (!profile) return false;
    // Show routines matching the user's category (somatotype)
    return r.category.toLowerCase() === profile.somatotype?.toLowerCase();
  });

  // If no specific match (or profile generic), show all or a subset
  const displayRecommended =
    recommendedRoutines.length > 0
      ? recommendedRoutines
      : PREDEFINED_ROUTINES.slice(0, 3);

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">
            Entreno
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Tu plan de transformación
          </p>
        </div>
        <Link to="/workout/create">
          <Button size="sm" className="font-bold gap-1 rounded-full">
            <Plus className="h-4 w-4" /> Nuevo
          </Button>
        </Link>
      </div>

      {/* Recommended Plan Section (Weekly View) */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Calendar className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-bold">Tu Plan Semanal</h2>
        </div>

        <div className="grid gap-3">
          {displayRecommended.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              onClick={() => setSelectedRoutine(routine)}
              isRecommended
            />
          ))}
        </div>
      </section>

      {/* My Routines Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold">Mis Rutinas</h2>
        </div>

        {myRoutines && myRoutines.length > 0 ? (
          <div className="grid gap-3">
            {myRoutines.map((routine) => (
              <RoutineCard
                key={routine.id}
                routine={routine}
                onClick={() => setSelectedRoutine(routine)}
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 bg-muted/20 p-6 flex flex-col items-center text-center gap-2">
            <div className="p-3 bg-background rounded-full shadow-sm">
              <Dumbbell className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Crea tu primera rutina</p>
              <p className="text-xs text-muted-foreground">
                Personaliza tus ejercicios y series
              </p>
            </div>
            <Button variant="outline" size="sm" className="mt-2" asChild>
              <Link to="/workout/create">Crear Rutina</Link>
            </Button>
          </Card>
        )}
      </section>

      {/* Routine Detail Drawer */}
      <Drawer
        open={!!selectedRoutine}
        onOpenChange={(open) => !open && setSelectedRoutine(null)}
      >
        <DrawerContent className="h-[85vh] max-h-[85vh] flex flex-col">
          {selectedRoutine && (
            <>
              <DrawerHeader className="text-left space-y-4 pb-2">
                <div className="space-y-1">
                  <Badge
                    variant="outline"
                    className="w-fit mb-2 bg-primary/10 text-primary border-primary/20"
                  >
                    {selectedRoutine.category}
                  </Badge>
                  <DrawerTitle className="text-2xl font-black">
                    {selectedRoutine.name}
                  </DrawerTitle>
                  <DrawerDescription className="text-base line-clamp-3">
                    {selectedRoutine.description}
                  </DrawerDescription>
                </div>

                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">
                      {selectedRoutine.estimatedMinutes} min
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Dumbbell className="h-4 w-4" />
                    <span className="font-medium">
                      {selectedRoutine.exercises.length} Ejercicios
                    </span>
                  </div>
                </div>
              </DrawerHeader>

              <div className="px-4 py-2 bg-muted/30 border-y border-border/50">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Lista de Ejercicios
                </p>
              </div>

              <ScrollArea className="flex-1 px-4">
                <div className="space-y-3 py-4">
                  {selectedRoutine.exercises.map((ex, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-xl bg-card border border-border/50 shadow-sm"
                    >
                      <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        {/* We need to fetch names if they aren't stored directly, but our RoutineExercise uses ID. 
                            Ideally, we should store names or look them up. For now, assuming we might need to look them up.
                            Wait, RoutineExercise only has ID. We need to look it up from EXERCISE_DB. */}
                        <ExerciseNameDisplay id={ex.exerciseId} />
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {ex.sets} sets × {ex.reps} reps
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <DrawerFooter className="pt-2 pb-8">
                <Button className="w-full font-bold text-lg h-12 shadow-lg shadow-primary/20">
                  <Play className="mr-2 h-5 w-5" fill="currentColor" />
                  Iniciar Rutina
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}

// Helper to display exercise name from ID
import { EXERCISE_DB } from "@/lib/data/exerciseDb";
function ExerciseNameDisplay({ id }: { id: string }) {
  const exercise = EXERCISE_DB.find((e) => e.id === id);
  return (
    <p className="font-bold text-base truncate">
      {exercise ? exercise.name : "Ejercicio desconocido"}
    </p>
  );
}

function RoutineCard({
  routine,
  onClick,
  isRecommended,
}: {
  routine: Routine;
  onClick: () => void;
  isRecommended?: boolean;
}) {
  const duration = routine.estimatedMinutes || routine.exercises.length * 5;

  return (
    <Card
      className={`group cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] border-border shadow-sm hover:shadow-md ${
        isRecommended ? "bg-gradient-to-br from-card to-secondary/5" : "bg-card"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-center gap-4">
        {/* Play Icon / Status */}
        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Play className="h-5 w-5 ml-1" fill="currentColor" />
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base truncate pr-2">
              {routine.name}
            </h3>
            {isRecommended && (
              <Badge
                variant="secondary"
                className="text-[10px] h-5 px-1.5 font-bold"
              >
                {routine.category}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground line-clamp-1">
            {routine.description}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground/80 font-medium pt-1">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {duration} min
            </span>
            <span className="flex items-center gap-1">
              <Dumbbell className="h-3 w-3" /> {routine.exercises.length} ejers.
            </span>
          </div>
        </div>

        <ChevronRight className="h-5 w-5 text-muted-foreground/30" />
      </CardContent>
    </Card>
  );
}
