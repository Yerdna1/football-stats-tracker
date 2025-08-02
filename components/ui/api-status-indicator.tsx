'use client';

import { useState } from 'react';
import { CheckCircle, AlertTriangle, Clock, Wifi } from 'lucide-react';

interface ApiStatus {
  status: 'idle' | 'loading' | 'success' | 'error' | 'rate-limited';
  message?: string;
  requestsInQueue?: number;
}

export function ApiStatusIndicator() {
  const [status] = useState<ApiStatus>({ status: 'idle' });

  // This would be connected to your API client's status
  // For now, it's a placeholder component structure

  const getStatusIcon = () => {
    switch (status.status) {
      case 'loading':
        return <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'rate-limited':
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (status.status) {
      case 'loading':
        return `Loading${status.requestsInQueue ? ` (${status.requestsInQueue} in queue)` : ''}...`;
      case 'success':
        return 'API Connected';
      case 'error':
        return status.message || 'API Error';
      case 'rate-limited':
        return 'Rate Limited - Waiting...';
      default:
        return 'Ready';
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'rate-limited':
        return 'text-orange-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      {getStatusIcon()}
      <span className={getStatusColor()}>{getStatusText()}</span>
    </div>
  );
}