"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  User,
} from "@heroui/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

import Logo from "./logo";

import { account } from "@/appwrite/clientConfig";
import { useUser } from "@/hooks/useUser";
import { TClassName } from "@/lib/types";

export function Nav({
  brandChild,
  endContent,
}: {
  endContent?: React.ReactNode;
  brandChild?: React.ReactNode;
  className?: TClassName;
}) {
  const user = useUser();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  return (
    <Navbar
      shouldHideOnScroll
      classNames={{ wrapper: "px-0" }}
      className="bg-transparent "
    >
      {/* Brand */}
      <NavbarBrand>
        <Link
          href="/dashboard"
          className="flex gap-2 font-bold  text-lg leading-normal"
        >
          <Logo />
          Insightly
        </Link>
        {brandChild}
      </NavbarBrand>

      {/* Right side user menu */}
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          {endContent ? (
            endContent
          ) : (
            <Dropdown showArrow>
              <DropdownTrigger>
                <Button
                  variant="ghost"
                  className="font-semibold shadow-md transition-all duration-200 hover:scale-105"
                >
                  <User
                    avatarProps={{
                      src: user?.image,
                      className: "size-6",
                    }}
                    name={user?.name || "rose berry"}
                  />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="User menu"
                className="p-2"
                disabledKeys={["profile"]}
              >
                {/* Profile Section */}
                <DropdownSection showDivider aria-label="Profile & Actions">
                  <DropdownItem
                    key="profile"
                    isReadOnly
                    className="h-14 gap-2 opacity-100"
                  >
                    <User
                      avatarProps={{
                        className: "hidden",
                      }}
                      classNames={{
                        name: "",
                        description: "text-neutral-400",
                      }}
                      description={user?.email}
                      name={user?.name}
                    />
                  </DropdownItem>
                  <DropdownItem key="settings">⚙️ Settings</DropdownItem>
                  <DropdownItem key="billing">💳 Billing</DropdownItem>
                </DropdownSection>

                {/* Preferences Section */}
                <DropdownSection aria-label="Preferences">
                  <DropdownItem
                    key="theme"
                    isReadOnly
                    className="cursor-default"
                    endContent={
                      <select
                        className="z-10 w-20 rounded-md text-xs border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#19191C] text-neutral-600 dark:text-neutral-400 hover:border-pink-500 transition"
                        id="theme"
                        name="theme"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                      >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="system">System</option>
                      </select>
                    }
                  >
                    🎨 Theme
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    className="text-pink-500"
                    onPress={() => {
                      account.deleteSessions().then(() => router.push("/auth"));
                    }}
                  >
                    🚪 Log Out
                  </DropdownItem>
                </DropdownSection>
              </DropdownMenu>
            </Dropdown>
          )}
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
