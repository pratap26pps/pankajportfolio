'use client'

import { Toaster } from 'react-hot-toast';

export default function AppToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        style: { background: '#111827', color: '#fff', border: '1px solid #374151' },
        success: { iconTheme: { primary: '#34d399', secondary: '#111827' } },
        error: { iconTheme: { primary: '#f87171', secondary: '#111827' } },
      }}
    />
  );
}
