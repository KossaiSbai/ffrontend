"use client";

import * as React from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link";

export function Navbar() {
  return (
    <nav className="bg-white py-4 px-6">
      <NavigationMenu>
        <NavigationMenuList className="flex space-x-8">
          <NavigationMenuItem>
            <Link href="/evaluate" legacyBehavior passHref>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} bg-orange text-black !text-base !font-bold transition duration-300 hover:bg-black hover:text-white`}
              >
                Evaluate
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/submissions" legacyBehavior passHref>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} bg-orange text-black !text-base !font-bold transition duration-300 hover:bg-black hover:text-white`}
              >
                Submissions
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}
