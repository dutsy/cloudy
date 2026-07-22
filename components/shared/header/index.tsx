"use client";

import Image from "next/image";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/shared/cart-context";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "./language-toggle";

const Header = () => {
  const { itemCount } = useCart();

  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between px-4">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              src="/images/logo.svg"
              alt={`${APP_NAME} logo`}
              width={60}
              height={60}
              priority={true}
            />
            <span className="hidden lg:block font-bold text-2xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* GLOBAL CART BUTTON - Increased size */}
          <Button
            asChild
            variant="ghost"
            className="relative p-3 h-12 w-12 rounded-xl hover:bg-blue-600/10"
          >
            <Link href="/cart">
              {/* Icon increased to h-8 w-8 */}
              <ShoppingCart className="h-8 w-8 text-foreground" />

              {itemCount > 0 && (
                <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-900 text-[11px] font-black text-white shadow-md border-2 border-background">
                  {itemCount}
                </span>
              )}
            </Link>
          </Button>

          <LanguageToggle />

          {/* MENU COMPONENT */}
          <Menu />
        </div>
      </div>
    </header>
  );
};

export default Header;
