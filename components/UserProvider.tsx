"use client";

import React, { createContext, useContext } from "react";

const userContext = createContext<mobileNavigationProps | undefined>(undefined);

const UserProvider = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: mobileNavigationProps;
}) => {
  return <userContext.Provider value={user}>{children}</userContext.Provider>;
};

export const useUser = () => useContext(userContext);

export default UserProvider;
