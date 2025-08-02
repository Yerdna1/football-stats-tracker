'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { Sidebar } from '@/components/layout/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-muted/20 lg:pl-0">
          <div className="container mx-auto p-4 sm:p-6 lg:p-8 xl:p-10 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}