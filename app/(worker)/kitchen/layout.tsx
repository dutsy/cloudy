import { createSupabaseServerClient } from '@/lib/supabase/server-client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Using your existing shadcn button
import { ArrowLeft, LayoutDashboard } from 'lucide-react';

export default async function KitchenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Initialize your custom server client
  const supabase = await createSupabaseServerClient();

  // 2. Check if the user is logged in
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  // 3. Fetch their role from your public.profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // 4. Verify they have the rights to see the kitchen
  if (!profile || (profile.role !== 'worker' && profile.role !== 'admin')) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* GLOBAL KITCHEN UTILITY BAR */}
      <div className="border-b bg-card px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          
          {/* Back to main client shop (Visible to both workers and admins) */}
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Shop
            </Link>
          </Button>

          {/* Conditional Admin Portal Redirect Shortcut */}
          {profile.role === 'admin' && (
            <Button asChild variant="secondary" size="sm" className="border-orange-500/20 text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:text-orange-400 dark:hover:text-orange-300 dark:hover:bg-orange-950/20">
              <Link href="/admin">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Admin Dashboard
              </Link>
            </Button>
          )}

        </div>
      </div>

      {/* LIVE QUEUE CONTENT DISPLAY PANEL */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}