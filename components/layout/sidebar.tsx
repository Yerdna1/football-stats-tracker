'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Globe, 
  Trophy, 
  Users, 
  Calendar, 
  BarChart3, 
  TrendingUp,
  Activity,
  Target,
  Percent,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme/theme-toggle';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Countries', href: '/dashboard/countries', icon: Globe },
  { name: 'Leagues', href: '/dashboard/leagues', icon: Trophy },
  { name: 'Teams', href: '/dashboard/teams', icon: Users },
  { name: 'Fixtures', href: '/dashboard/fixtures', icon: Calendar },
  { name: 'Standings', href: '/dashboard/standings', icon: BarChart3 },
  { name: 'Players', href: '/dashboard/players', icon: Users },
  { name: 'Top Scorers', href: '/dashboard/topscorers', icon: TrendingUp },
  { name: 'Statistics', href: '/dashboard/statistics', icon: Activity },
  { name: 'Predictions', href: '/dashboard/predictions', icon: Target },
  { name: 'Odds', href: '/dashboard/odds', icon: Percent },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-background border"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center px-6 border-b bg-gradient-to-r from-primary/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Football Stats
              </h2>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-3 py-6 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-md'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground"
                  )} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t bg-gradient-to-b from-transparent to-muted/20 p-4">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-muted/50 backdrop-blur-sm">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground text-sm font-bold ring-2 ring-primary/20">
                {user?.email?.[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Free Plan</p>
              </div>
              <ThemeToggle />
            </div>
            <Button
              variant="outline"
              className="w-full hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}