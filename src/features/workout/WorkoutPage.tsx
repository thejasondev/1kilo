import { Plus, Play, Dumbbell, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import type { Routine } from "@/lib/data/routinesDb";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/storage/db";

export function WorkoutPage() {
  const routines = useLiveQuery(() => db.routines.toArray(), []);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Entreno
          </h1>
          <p className="text-sm font-medium text-muted-foreground">
            Tus rutinas activas
          </p>
        </div>
      </div>

      {/* Routines List */}
      <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {routines && routines.length > 0 ? (
          <div className="grid gap-4">
            {routines.map((routine) => (
              <RoutineCard key={routine.id} routine={routine} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-muted-foreground/20 p-8 text-center bg-muted/30">
            <Dumbbell className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground font-medium text-sm">
              No tienes rutinas asignadas.
            </p>
            <Button variant="link" asChild className="mt-2 text-primary">
              <Link to="/workout/create">Crear una ahora</Link>
            </Button>
          </div>
        )}
      </section>

      {/* FAB */}
      <Link to="/workout/create">
        <Button
          size="icon"
          className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-2xl bg-primary text-primary-foreground hover:bg-primary/90 z-40 transition-transform active:scale-95 border-2 border-primary-foreground/10"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </Link>
    </div>
  );
}

function RoutineCard({ routine }: { routine: Routine }) {
  const exerciseCount = routine.exercises.length;
  // Estimated time: ~4 mins per exercise (3 sets + breaks)
  const duration = exerciseCount * 4;

  return (
    <Card className="group overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-all cursor-pointer relative">
      <div className="absolute top-0 right-0 px-3 py-1 bg-secondary text-secondary-foreground text-[10px] font-bold uppercase rounded-bl-lg shadow-sm">
        {routine.category}
      </div>

      <CardContent className="p-5 flex items-center justify-between">
        <div className="space-y-1.5 flex-1 mr-4">
          <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors text-foreground">
            {routine.name}
          </h3>
          <p className="text-xs font-medium text-muted-foreground line-clamp-2">
            {routine.description}
          </p>
          <div className="flex items-center gap-3 mt-3 text-xs font-semibold text-muted-foreground/80">
            <span className="flex items-center gap-1.5 bg-muted px-2 py-0.5 rounded-full">
              <Dumbbell className="h-3 w-3" /> {exerciseCount} Ejers.
            </span>
            <span className="flex items-center gap-1.5 bg-muted px-2 py-0.5 rounded-full">
              <Clock className="h-3 w-3" /> ~{duration} min
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            size="icon"
            className="h-12 w-12 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
          >
            <Play className="h-6 w-6 ml-1" fill="currentColor" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
