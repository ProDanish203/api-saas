"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon } from "lucide-react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/actions/user";

export const UserProfileIcon = () => {
  const handleLogout = async () => {
    await signOut();
  };

  const { data, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(),
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger disabled={isLoading}>
        <Image
          src={
            isLoading || !data
              ? "/images/user.webp"
              : data.image ?? "/images/user.webp"
          }
          width={40}
          height={40}
          alt="username"
          className="rounded-full object-contain"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-x-2"
        >
          <LogOutIcon />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
