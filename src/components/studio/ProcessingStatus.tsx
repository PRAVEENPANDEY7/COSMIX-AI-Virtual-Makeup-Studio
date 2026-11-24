'use client';

import React from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStudioStore } from '@/stores/studio-store';

export const ProcessingStatus: React.FC = () => {
  const { processingStatus, faceError } = useStudioStore();
  const { stage, message } = processingStatus;

  if (stage === 'idle' || (!message && !faceError)) {
    return null;
  }

  const isError = stage === 'error' || !!faceError;
  const isReady = stage === 'ready' && !faceError;

  return (
    <div
      className={`rounded-xl px-4 py-3 text-xs transition-all flex items-center space-x-3 shadow-sm border ${
        isError
          ? 'bg-rosewood-50 border-rosewood-200 text-rosewood-900'
          : isReady
          ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
          : 'bg-studio-100 border-studio-200 text-studio-800'
      }`}
    >
      <div className="flex-shrink-0">
        {isError ? (
          <AlertCircle className="w-4 h-4 text-rosewood-600" />
        ) : isReady ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        ) : (
          <Loader2 className="w-4 h-4 text-rosewood-700 animate-spin" />
        )}
      </div>

      <div className="flex-1">
        <p className="font-medium">{faceError || message}</p>
      </div>
    </div>
  );
};
