'use client';

import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'oklch(0.12 0.02 260)',
          border: '1px solid oklch(0.22 0.02 260)',
          color: 'oklch(0.96 0.01 260)',
        },
      }}
    />
  );
}
