'use client' // Required because we are using useCart context

import { Button } from "@/components/ui/button";
import ModeToggle from "./mode-toggle";
import Link from "next/link";
import { EllipsisVertical, ShoppingCart, UserIcon } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/components/shared/cart-context"; // Import your hook

const Menu = () => {
    const { itemCount } = useCart(); // Get the live count

    return (
        <div className="flex justify-end gap-3">
            {/* DESKTOP NAVIGATION */}
            <nav className="hidden md:flex w-full max-w-xs gap-1 items-center">
                <ModeToggle />
                <Button asChild variant='ghost' className="relative">
                    <Link href='/cart'>
                        <ShoppingCart className="h-5 w-5" />
                        <span className="ml-2">Cart</span>
                        {/* Desktop Badge */}
                        {itemCount > 0 && (
                            <span className="absolute -top-1 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-bold text-white shadow-sm">
                                {itemCount}
                            </span>
                        )}
                    </Link>
                </Button>
                <Button asChild>
                    <Link href='/sign-in'>
                        <UserIcon className="mr-2 h-5 w-5" />
                        Sign In
                    </Link>
                </Button>
            </nav>

            {/* MOBILE NAVIGATION */}
            <nav className="md:hidden flex items-center">
                <Sheet>
                    <SheetTrigger className="align-middle relative p-2">                        
                        <EllipsisVertical />
                        {/* Mobile Badge on the three-dot menu so they know items are inside */}
                        {itemCount > 0 && (
                            <span className="absolute top-1 right-1 flex h-3 w-3 rounded-full bg-orange-500 border-2 border-background"></span>
                        )}
                    </SheetTrigger>
                    <SheetContent className="flex flex-col items-start gap-4">
                        <SheetTitle>Menu</SheetTitle>
                        
                        <div className="flex items-center gap-2 w-full justify-between">
                            <span className="text-sm font-medium">Theme</span>
                            <ModeToggle />
                        </div>

                        <Button asChild variant='ghost' className="w-full justify-start relative">
                            <Link href='/cart'>
                                <ShoppingCart className="mr-2 h-5 w-5" /> 
                                Cart
                                {itemCount > 0 && (
                                    <span className="ml-2 bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px]">
                                        {itemCount} items
                                    </span>
                                )}
                            </Link>
                        </Button>

                        <Button asChild className="w-full justify-start">
                            <Link href='/sign-in'>
                                <UserIcon className="mr-2 h-5 w-5" />
                                Sign In
                            </Link>
                        </Button>
                        
                        <SheetDescription></SheetDescription>
                    </SheetContent>
                </Sheet>
            </nav>
        </div>
    );
}
 
export default Menu;