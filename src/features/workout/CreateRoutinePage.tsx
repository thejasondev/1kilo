import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plus,
  GripVertical,
  Trash2,
  Search,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { EXERCISE_DB } from "@/lib/data/exerciseDb";
import type { Exercise } from "@/lib/data/exerciseDb";
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
      id: crypto.randomUUID(), // unique id for list sorting
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

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="-ml-2"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Nueva Rutina</h1>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Nombre de la Rutina</Label>
          <Input
            placeholder="Ej. Pierna Vol. 2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-card font-bold text-lg"
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase">
            Ejercicios ({exercises.length})
          </h3>

          <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DrawerTrigger asChild>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <Plus className="h-4 w-4" /> Agregar
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[80vh]">
              <ExerciseSelector onSelect={addExercise} />
            </DrawerContent>
          </Drawer>
        </div>

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

        {exercises.length === 0 && (
          <div className="text-center p-10 border border-dashed rounded-xl text-muted-foreground">
            <p>Añade ejercicios para armar tu rutina</p>
          </div>
        )}
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 left-4 right-4">
        <Button
          size="lg"
          className="w-full font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl"
          onClick={handleSave}
          disabled={!name || exercises.length === 0}
        >
          <Save className="h-5 w-5 mr-2" /> Guardar Rutina
        </Button>
      </div>
    </div>
  );
}

function SortableExerciseItem({ id, data, onRemove, onUpdate }: any) {
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
      className="touch-none relative bg-card border border-zinc-800 rounded-lg p-3 flex gap-3 items-center group"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-5 w-5" />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-base line-clamp-1">{data.name}</h4>
        <div className="flex gap-4 mt-2">
          <div className="flex items-center gap-1.5">
            <Label className="text-xs text-muted-foreground uppercase">
              Sets
            </Label>
            <Input
              type="number"
              className="h-7 w-12 text-center p-0 bg-zinc-900 border-zinc-800"
              value={data.sets}
              onChange={(e) => onUpdate(id, "sets", e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Label className="text-xs text-muted-foreground uppercase">
              Reps
            </Label>
            <Input
              type="number"
              className="h-7 w-12 text-center p-0 bg-zinc-900 border-zinc-800"
              value={data.reps}
              onChange={(e) => onUpdate(id, "reps", e.target.value)}
            />
          </div>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-red-500"
        onClick={onRemove}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

function ExerciseSelector({ onSelect }: { onSelect: (ex: Exercise) => void }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return EXERCISE_DB;
    return EXERCISE_DB.filter((ex) =>
      ex.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <div className="flex flex-col h-full">
      <DrawerHeader>
        <DrawerTitle>Seleccionar Ejercicio</DrawerTitle>
      </DrawerHeader>
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ejercicio..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1 pb-4">
          {filtered.map((ex) => (
            <button
              key={ex.id}
              onClick={() => onSelect(ex)}
              className="w-full text-left p-3 hover:bg-muted/50 rounded-lg transition-colors flex justify-between items-center group"
            >
              <div>
                <p className="font-semibold">{ex.name}</p>
                <p className="text-xs text-muted-foreground">
                  {ex.muscleGroup}
                </p>
              </div>
              <Plus className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
