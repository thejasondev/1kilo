import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  GripVertical,
  Trash2,
  Search,
  Clock,
  Dumbbell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { EXERCISE_DB, MUSCLE_GROUPS } from "@/lib/data/exerciseDb";
import type { Exercise, MuscleGroup } from "@/lib/data/exerciseDb";
import { DexieAdapter } from "@/lib/storage/dexieAdapter";
import type { Routine, RoutineExercise } from "@/lib/data/routinesDb";

// Dnd Kit
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";

export function CreateRoutinePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [exercises, setExercises] = useState<
    (RoutineExercise & { id: string; name: string })[]
  >([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setExercises((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addExercise = (exercise: Exercise) => {
    const newEx = {
      id: crypto.randomUUID(),
      exerciseId: exercise.id,
      name: exercise.name,
      sets: 3,
      reps: 10,
    };
    setExercises([...exercises, newEx]);
    setIsDrawerOpen(false);
  };

  const removeExercise = (id: string) => {
    setExercises(exercises.filter((e) => e.id !== id));
  };

  const updateStats = (id: string, field: "sets" | "reps", value: string) => {
    setExercises(
      exercises.map((e) =>
        e.id === id ? { ...e, [field]: parseInt(value) || 0 } : e,
      ),
    );
  };

  const handleSave = async () => {
    if (!name) return;
    const newRoutine: Routine = {
      id: crypto.randomUUID(),
      name,
      description: "Rutina personalizada",
      category: "Personalizada",
      difficulty: "intermediate",
      estimatedMinutes: exercises.length * 5,
      restBetweenSets: 90,
      exercises: exercises.map(({ exerciseId, sets, reps }) => ({
        exerciseId,
        sets,
        reps,
      })),
    };

    const adapter = new DexieAdapter<Routine>("routines");
    await adapter.create(newRoutine);
    navigate("/workout");
  };

  // Estimated duration
  const estimatedMinutes = exercises.length * 5;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      {/* Header - Fixed & Elevated */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="-ml-2 hover:bg-transparent"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-bold">Nueva Rutina</h1>
          </div>

          <Button
            size="sm"
            onClick={handleSave}
            disabled={!name || exercises.length === 0}
            className="font-bold rounded-full px-4 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Guardar
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 pb-10 space-y-6 max-w-md mx-auto w-full">
        {/* Name Input */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Nombre
          </Label>
          <Input
            placeholder="Ej. Día de Pierna A"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-card font-bold text-xl h-14 border-transparent shadow-sm focus-visible:ring-primary/20 placeholder:text-muted-foreground/30"
            autoFocus
          />
        </div>

        {/* Info Bar */}
        <div className="flex items-center justify-between py-2 border-y border-border/40">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Dumbbell className="h-4 w-4" />
            <span>{exercises.length} Ejercicios</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>~{estimatedMinutes} min</span>
          </div>
        </div>

        {/* Exercises List */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={exercises}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {exercises.map((ex) => (
                <SortableExerciseItem
                  key={ex.id}
                  id={ex.id}
                  data={ex}
                  onRemove={() => removeExercise(ex.id)}
                  onUpdate={updateStats}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Large Add Button at Bottom of List */}
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="w-full h-14 border-dashed border-2 text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <Plus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
              Añadir Ejercicio
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[90vh] max-h-[90vh]">
            <ExerciseSelector onSelect={addExercise} />
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

interface SortableExerciseItemProps {
  id: string;
  data: { name: string; sets: number; reps: number };
  onRemove: () => void;
  onUpdate: (id: string, field: "sets" | "reps", value: string) => void;
}

function SortableExerciseItem({
  id,
  data,
  onRemove,
  onUpdate,
}: SortableExerciseItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="touch-none relative bg-card border border-border/60 rounded-xl p-4 flex gap-3 items-center shadow-sm"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground/50 hover:text-foreground p-1"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-base text-foreground line-clamp-1">
          {data.name}
        </h4>
        <div className="flex gap-4 mt-3">
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase">
              Sets
            </Label>
            <Input
              type="number"
              className="h-10 w-16 text-center font-bold bg-muted/30 border-border/50 focus-visible:bg-background"
              value={data.sets}
              onChange={(e) => onUpdate(id, "sets", e.target.value)}
              onClick={(e) => e.currentTarget.select()}
            />
          </div>
          <div className="flex flex-col gap-1">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase">
              Reps
            </Label>
            <Input
              type="number"
              className="h-10 w-16 text-center font-bold bg-muted/30 border-border/50 focus-visible:bg-background"
              value={data.reps}
              onChange={(e) => onUpdate(id, "reps", e.target.value)}
              onClick={(e) => e.currentTarget.select()}
            />
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 shrink-0 self-start -mt-1 -mr-1"
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function ExerciseSelector({ onSelect }: { onSelect: (ex: Exercise) => void }) {
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup | "all">(
    "all",
  );

  const filtered = useMemo(() => {
    let result = EXERCISE_DB;

    // Filter by muscle group
    if (selectedGroup !== "all") {
      result = result.filter((ex) => ex.muscleGroup === selectedGroup);
    }

    // Filter by search
    if (search) {
      result = result.filter((ex) =>
        ex.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return result;
  }, [search, selectedGroup]);

  // Group exercises by muscle group for display
  const groupedExercises = useMemo(() => {
    if (selectedGroup !== "all") {
      return { [selectedGroup]: filtered };
    }
    return filtered.reduce(
      (acc, ex) => {
        if (!acc[ex.muscleGroup]) {
          acc[ex.muscleGroup] = [];
        }
        acc[ex.muscleGroup].push(ex);
        return acc;
      },
      {} as Record<MuscleGroup, Exercise[]>,
    );
  }, [filtered, selectedGroup]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <DrawerHeader className="shrink-0 pb-2">
        <DrawerTitle className="text-center text-xl font-bold">
          Seleccionar Ejercicio
        </DrawerTitle>
      </DrawerHeader>

      {/* Search */}
      <div className="px-4 pb-3 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            className="pl-9 h-11 bg-muted/30 border-transparent focus-visible:bg-background focus-visible:border-primary/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
      </div>

      {/* Muscle Group Filter */}
      <div className="px-4 pb-4 shrink-0 overflow-x-auto no-scrollbar">
        <div className="flex gap-2">
          <Badge
            variant={selectedGroup === "all" ? "default" : "outline"}
            className="px-3 py-1.5 h-auto text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => setSelectedGroup("all")}
          >
            Todos
          </Badge>
          {MUSCLE_GROUPS.map((group) => (
            <Badge
              key={group}
              variant={selectedGroup === group ? "default" : "outline"}
              className="px-3 py-1.5 h-auto text-sm cursor-pointer whitespace-nowrap hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setSelectedGroup(group)}
            >
              {group}
            </Badge>
          ))}
        </div>
      </div>

      {/* Exercise List - Fix scroll isolation */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-8 space-y-6">
        {Object.entries(groupedExercises).map(([group, exercises]) => (
          <div key={group}>
            {selectedGroup === "all" && (
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
                {group}
              </h3>
            )}
            <div className="grid gap-2">
              {exercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => onSelect(ex)}
                  className="w-full text-left p-3 hover:bg-muted/50 active:bg-muted rounded-xl transition-all flex justify-between items-center group border border-transparent hover:border-border/50"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-foreground/90">
                      {ex.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-medium">
                        {ex.equipment}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          ex.difficulty === "beginner"
                            ? "text-emerald-500 bg-emerald-500/10"
                            : ex.difficulty === "intermediate"
                              ? "text-amber-500 bg-amber-500/10"
                              : "text-red-500 bg-red-500/10"
                        }`}
                      >
                        {ex.difficulty === "beginner"
                          ? "Básico"
                          : ex.difficulty === "intermediate"
                            ? "Intermedio"
                            : "Avanzado"}
                      </span>
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                    <Plus className="h-5 w-5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-10 opacity-50 flex flex-col items-center gap-2">
            <Search className="h-8 w-8" />
            <p>No se encontraron ejercicios</p>
          </div>
        )}
      </div>
    </div>
  );
}
