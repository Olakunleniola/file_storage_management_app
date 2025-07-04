"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Separator } from "./ui/separator";
import { navItems } from "@/constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { signOutUser } from "@/lib/actions/users.actions";

import FileUploader from "./FileUploader";

const MobileNavigation = ({
  fullName,
  avatar,
  email,
  $id: ownerId,
  accountId,
}: mobileNavigationProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="mobile-header">
      <Image
        src="./assets/icons/logo-full-brand.svg"
        alt="logo"
        width={120}
        height={52}
        className="h-auto"
      />
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image
            src="./assets/icons/menu.svg"
            alt="menu icon"
            width={24}
            height={24}
            className="h-auto"
          />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
          <SheetTitle>
            <div className="header-user">
              <Image
                src={avatar}
                alt="avatar"
                width={44}
                height={44}
                className="header-user-avatar"
              />
              <div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">{fullName}</p>
                <p className="caption">{email}</p>
              </div>
            </div>
            <Separator className="mb-3 text-light-200/20" />
          </SheetTitle>
          <nav className="mobile-nav ">
            <ul className="mobile-nav-list">
              {navItems.map(({ name, url, icon }) => (
                <Link
                  href={url}
                  key={name}
                  className="lg:w-full"
                  onClick={() => setOpen(false)}
                >
                  <li
                    className={cn(
                      "mobile-nav-item",
                      pathname === url && "shad-active"
                    )}
                  >
                    <Image
                      src={icon}
                      alt="nav icon"
                      width={24}
                      height={24}
                      className={cn(
                        "h-auto",
                        pathname === url && "nav-icon-active"
                      )}
                    />
                    <p className="">{name}</p>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>
          <Separator className="m-5 bg-light-200/20" />
          <div className="flex flex-col justify-between gap-5">
            <FileUploader ownerId={ownerId} accountId={accountId} />
            <Button
              type="submit"
              className="mobile-sign-out-button"
              onClick={async () => await signOutUser()}
            >
              <Image
                src="./assets/icons/logout.svg"
                alt="logout logo"
                width={24}
                height={24}
                className="w-6"
              />
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default MobileNavigation;
