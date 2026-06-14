'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import './globals.css';

//  Create a single React Query client instance
// This handles caching, background refetching, and API state management
const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
          {/*  React Query Provider
            Makes API caching + server-state management available globally */}
        <QueryClientProvider client={queryClient}>
          {children}
           {/*  Toast notifications container
              Used for success/error messages across the app */}
          <Toaster position="top-right" />
        </QueryClientProvider>
      </body>
    </html>
  );
}