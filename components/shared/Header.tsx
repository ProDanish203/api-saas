import React from "react";
import { UserProfileIcon } from "../helper";

export const Header = () => {
  return (
    <header className="flex items-center justify-between md:px-6 px-2 py-6 h-[60px] container">
      <div></div>
      <UserProfileIcon />
    </header>
  );
};
