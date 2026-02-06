import { useAuth } from "@/features/auth/AuthContext";
import {
  Cloud,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SyncStatusIndicator({
  showDetails = false,
}: {
  showDetails?: boolean;
}) {
  const { syncStatus, lastSyncResult, triggerSync } = useAuth();

  const statusConfig = {
    idle: {
      icon: Cloud,
      text: "En la nube",
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
    },
    syncing: {
      icon: Loader2,
      text: "Sincronizando...",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    success: {
      icon: CheckCircle,
      text: "Sincronizado",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    error: {
      icon: AlertCircle,
      text: "Error de sync",
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  };

  const config = statusConfig[syncStatus];
  const Icon = config.icon;

  return (
    <div className="space-y-2">
      <button
        onClick={() => triggerSync()}
        disabled={syncStatus === "syncing"}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
          config.bgColor,
          config.color,
          syncStatus === "syncing" && "cursor-wait",
          syncStatus !== "syncing" && "hover:opacity-80 active:scale-95",
        )}
      >
        <Icon
          className={cn(
            "h-3.5 w-3.5",
            syncStatus === "syncing" && "animate-spin",
          )}
        />
        <span>{config.text}</span>
        {syncStatus === "idle" && <RefreshCw className="h-3 w-3 opacity-50" />}
      </button>

      {showDetails && lastSyncResult?.details && (
        <div className="text-[10px] text-muted-foreground pl-2 space-y-0.5">
          {lastSyncResult.details.weightLogsUploaded > 0 && (
            <p>↑ {lastSyncResult.details.weightLogsUploaded} pesos subidos</p>
          )}
          {lastSyncResult.details.weightLogsDownloaded > 0 && (
            <p>
              ↓ {lastSyncResult.details.weightLogsDownloaded} pesos descargados
            </p>
          )}
          {lastSyncResult.details.dailyLogsUploaded > 0 && (
            <p>↑ {lastSyncResult.details.dailyLogsUploaded} días subidos</p>
          )}
          {lastSyncResult.details.dailyLogsDownloaded > 0 && (
            <p>
              ↓ {lastSyncResult.details.dailyLogsDownloaded} días descargados
            </p>
          )}
        </div>
      )}
    </div>
  );
}
