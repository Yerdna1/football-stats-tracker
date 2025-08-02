'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Moon, Sun, Check, X } from 'lucide-react';

export default function CSSTest() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      <div className="min-h-screen bg-background text-foreground p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">🧪 CSS Test Suite</h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive test of all styling components and themes
              </p>
            </div>
            
            <Button onClick={toggleTheme} variant="outline" size="icon">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </div>

          {/* Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tailwind CSS</CardTitle>
                <Check className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Working</div>
                <p className="text-xs text-muted-foreground">Base styles loaded</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Components</CardTitle>
                <Check className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Working</div>
                <p className="text-xs text-muted-foreground">shadcn/ui loaded</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Theme Toggle</CardTitle>
                <Activity className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {isDark ? 'Dark' : 'Light'}
                </div>
                <p className="text-xs text-muted-foreground">Click moon/sun to toggle</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Animations</CardTitle>
                <div className="h-4 w-4 rounded-full bg-primary animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">Active</div>
                <p className="text-xs text-muted-foreground">CSS animations working</p>
              </CardContent>
            </Card>
          </div>

          {/* Button Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Button Components</CardTitle>
              <CardDescription>Testing all button variants and states</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button>Primary Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
            </CardContent>
          </Card>

          {/* Form Components */}
          <Card>
            <CardHeader>
              <CardTitle>Form Components</CardTitle>
              <CardDescription>Input fields, labels, and form styling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter password" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Palette */}
          <Card>
            <CardHeader>
              <CardTitle>Color System</CardTitle>
              <CardDescription>CSS custom properties and theme colors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <div className="h-12 w-full bg-background border rounded" />
                  <p className="text-xs">background</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 w-full bg-foreground rounded" />
                  <p className="text-xs">foreground</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 w-full bg-primary rounded" />
                  <p className="text-xs">primary</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 w-full bg-secondary rounded" />
                  <p className="text-xs">secondary</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 w-full bg-muted rounded" />
                  <p className="text-xs">muted</p>
                </div>
                <div className="space-y-2">
                  <div className="h-12 w-full bg-accent rounded" />
                  <p className="text-xs">accent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responsive Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Responsive Layout</CardTitle>
              <CardDescription>Grid system and breakpoint testing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="bg-muted rounded-lg p-4 text-center">
                    <div className="text-lg font-semibold">Card {i + 1}</div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Responsive grid item
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Summary */}
          <Card className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-200">
                ✅ CSS System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Tailwind CSS v4 configured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>PostCSS configuration fixed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Theme system working</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Component library loaded</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Dark/Light mode toggle</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Responsive breakpoints</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>CSS animations active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Custom properties loaded</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Back to App */}
          <div className="text-center">
            <Button asChild>
              <a href="/">← Back to Football Stats App</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}