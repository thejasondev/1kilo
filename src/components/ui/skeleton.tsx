import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/50", className)}
      style={style}
    />
  );
}

// Pre-built skeleton components for common patterns

export function CardSkeleton() {
  return (
    <div className="p-6 rounded-xl border border-border bg-card space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-32" />
      <Skeleton className="h-2 w-full" />
      <div className="grid grid-cols-3 gap-4 pt-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-12 mx-auto" />
          <Skeleton className="h-8 w-16 mx-auto" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-12 mx-auto" />
          <Skeleton className="h-8 w-16 mx-auto" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-12 mx-auto" />
          <Skeleton className="h-8 w-16 mx-auto" />
        </div>
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  // Deterministic heights for skeleton bars
  const heights = [60, 80, 45, 90, 55, 75, 65];

  return (
    <div className="p-6 rounded-xl border border-border bg-card">
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
      <div className="h-[250px] flex items-end gap-2 px-4">
        {heights.map((height, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <Skeleton
              className="w-full rounded-t-sm"
              style={{ height: `${height}%` }}
            />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function RoutineCardSkeleton() {
  return (
    <div className="p-4 rounded-xl border border-border bg-card flex gap-4">
      <Skeleton className="h-16 w-16 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-48" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function FoodItemSkeleton() {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-4 w-12" />
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    </div>
  );
}
