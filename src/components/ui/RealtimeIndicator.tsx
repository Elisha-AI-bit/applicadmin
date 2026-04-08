import { Wifi, WifiOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RealtimeIndicatorProps {
  isConnected: boolean;
  label?: string;
}

export function RealtimeIndicator({ isConnected, label = "Real-time" }: RealtimeIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-1">
        {isConnected ? (
          <Wifi className="h-3 w-3" />
        ) : (
          <WifiOff className="h-3 w-3" />
        )}
        {label}
      </Badge>
    </div>
  );
}
