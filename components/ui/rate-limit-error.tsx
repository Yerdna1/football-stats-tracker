'use client';

import { AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface RateLimitErrorProps {
  error: Error & { isRateLimit?: boolean; retryAfter?: number };
  onRetry?: () => void;
}

export function RateLimitError({ error, onRetry }: RateLimitErrorProps) {
  const retrySeconds = error.retryAfter ? Math.ceil(error.retryAfter / 1000) : 60;

  return (
    <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
          <AlertTriangle className="h-5 w-5" />
          API Rate Limit Exceeded
        </CardTitle>
        <CardDescription className="text-orange-700 dark:text-orange-300">
          You&apos;ve made too many requests in a short period
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
          <Clock className="h-4 w-4" />
          <span>Please wait {retrySeconds} seconds before trying again</span>
        </div>
        
        <div className="p-4 bg-orange-100 dark:bg-orange-900 rounded-lg">
          <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
            Why did this happen?
          </h4>
          <ul className="text-sm text-orange-700 dark:text-orange-300 space-y-1">
            <li>• The Football API has limits on how many requests can be made</li>
            <li>• This protects the service from being overloaded</li>
            <li>• Requests are automatically cached to reduce API calls</li>
          </ul>
        </div>
        
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
            Tips to avoid rate limits:
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Wait between making multiple requests</li>
            <li>• Use cached data when available</li>
            <li>• Avoid refreshing pages rapidly</li>
            <li>• Consider upgrading your API plan for higher limits</li>
          </ul>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </CardContent>
    </Card>
  );
}