import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: "primary" | "emerald" | "amber" | "red";
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 10,
  label,
  sublabel,
  color = "primary",
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const offset = circumference - (clampedProgress / 100) * circumference;

  const colorClasses = {
    primary: "stroke-primary",
    emerald: "stroke-emerald-500",
    amber: "stroke-amber-500",
    red: "stroke-red-500",
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(
            "fill-none transition-all duration-500",
            colorClasses[color],
          )}
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && (
          <span className="text-2xl font-black text-foreground">{label}</span>
        )}
        {sublabel && (
          <span className="text-xs text-muted-foreground font-medium">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
