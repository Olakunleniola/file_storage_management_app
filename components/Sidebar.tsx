"use client";

import Link from "next/link";
import Image from "next/image";
import { navItems } from "@/constants";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  fullName: string;
  avatar: string;
  email: string;
}

const Sidebar = ({ fullName, avatar, email }: Props) => {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <Link href="/">
        <Image
          src="./assets/icons/logo-full-brand.svg"
          alt="logo"
          width={160}
          height={50}
          className="hidden h-auto lg:block"
        />
        <Image
          src="./assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52}
          className="h-auto lg:hidden"
        />
      </Link>
      <nav className="sidebar-nav">
        <ul className="flex flex-1 flex-col gap-6">
          {navItems.map(({ name, url, icon }) => (
            <Link href={url} key={name} className="lg:w-full">
              <li
                className={cn(
                  "sidebar-nav-item hover:bg-light-200 hover:!text-white",
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
                <p className="hidden lg:block">{name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
      <Image
        src="/assets/images/files-2.png"
        alt="logo"
        width={506}
        height={418}
        className="w-full "
      />

      <div className="sidebar-user-info">
        <Image
          src={avatar}
          alt="avatar"
          width={44}
          height={44}
          className="sidebar-user-avatar"
        />
        <div className="hidden lg:block truncate">
          <p className="capitalize subtitle-2">{fullName}</p>
          <p className="caption">{email}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
