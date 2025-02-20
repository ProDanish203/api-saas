import React from "react";
import { UserProfileIcon } from "../helper";

export const Header = () => {
  return (
    <header className="bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground flex items-center justify-between md:px-6 px-4 py-6 h-[60px] w-full">
      <div></div>
      <UserProfileIcon />
    </header>
  );
};
