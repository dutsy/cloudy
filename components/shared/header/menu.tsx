"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  EllipsisVertical,
  UserIcon,
  LayoutDashboard,
  Soup,
  LogOut,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUser } from "@/components/shared/user-context";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";

const Menu = () => {
  const { role, user, loading } = useUser();
  const supabase = getSupabaseBrowserClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; // Fresh start after logout
  };

  // Helper check: True if user is either a barista (worker) or manager (admin)
  const isStaff = !loading && (role === "worker" || role === "admin");

  return (
    <div className="flex justify-end gap-3">
      {/* DESKTOP NAVIGATION */}
      <nav className="hidden md:flex w-full max-w-xs gap-1 items-center">
        {/* <ModeToggle /> */}


        {/* ADMIN TAB */}
        {!loading && role === "admin" && (
          <Button
            asChild
            variant="ghost"
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
          >
            <Link href="/admin">
              <LayoutDashboard className="mr-2 h-5 w-5" />
              Admin
            </Link>
          </Button>
        )}

        {/* KITCHEN TAB - Fixed to use '/kitchen' matching your folder tree */}
        {isStaff && (
          <Button
            asChild
            variant="ghost"
            className="text-blue-600 hover:text-emerald-700 hover:bg-emerald-50"
          >
            <Link href="/kitchen">
              <Soup className="mr-2 h-5 w-5" />
              Kitchen
            </Link>
          </Button>
        )}

        <Button asChild variant="ghost">
          <Link href={user ? "/profile" : "/sign-in"}>
            <UserIcon className="mr-2 h-5 w-5" />
            {user ? "Profile" : "Sign In"}
          </Link>
        </Button>

        {user && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            title="Sign Out"
          >
            <LogOut className="h-5 w-5 text-destructive" />
          </Button>
        )}
      </nav>

      {/* MOBILE NAVIGATION */}
      <nav className="md:hidden flex items-center">
        <Sheet>
          <SheetTrigger className="align-middle p-2" asChild>
            <Button variant="ghost" size="icon">
              <EllipsisVertical className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start gap-4">
            <SheetTitle>Menu</SheetTitle>
            {/* <ModeToggle /> */}

            {/* Mobile Admin Link */}
            {!loading && role === "admin" && (
              <Button
                asChild
                variant="secondary"
                className="w-full justify-start border-l-4 border-orange-500"
              >
                <Link href="/admin">
                  <LayoutDashboard className="mr-2 h-5 w-5 text-orange-500" />
                  Admin Dashboard
                </Link>
              </Button>
            )}

            {/* Mobile Kitchen Link - Fixed to use '/kitchen' matching your folder tree */}
            {isStaff && (
              
              <Button
                asChild
                variant="secondary"
                className="w-full justify-start border-l-4 border-emerald-500 bg-blue-600/5 hover:bg-blue-600/10 text-emerald-700 dark:text-emerald-400"
              >
                <Link href="/kitchen">
                  <Soup className="mr-2 h-5 w-5 text-blue-600" />
                  Kitchen View
                </Link>
              </Button>
            )}

            <Button asChild variant="ghost" className="w-full justify-start">
              <Link href={user ? "/profile" : "/sign-in"}>
                <UserIcon className="mr-2 h-5 w-5" />
                {user ? "Profile" : "Sign In"}
              </Link>
            </Button>

            {user && (
              <Button
                variant="destructive"
                className="w-full justify-start mt-auto"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-5 w-5" />
                Sign Out
              </Button>
            )}

            <SheetDescription>
              {user
                ? `Logged in as ${user.email}`
                : "Access your Cloudy account."}
            </SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
