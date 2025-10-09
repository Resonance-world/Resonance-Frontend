'use client';

import dynamic from 'next/dynamic';
import { ErrorBoundary, SimpleErrorFallback } from '@/components/ui/ErrorBoundary';

// Dynamic import for better bundle splitting
const MyReflections = dynamic(
  () => import('@/components/garden/MyReflections').then(mod => ({ default: mod.MyReflections }))
);

export default function ReflectionsPage() {
  return (
    <ErrorBoundary fallback={SimpleErrorFallback}>
      <MyReflections />
    </ErrorBoundary>
  );
}
