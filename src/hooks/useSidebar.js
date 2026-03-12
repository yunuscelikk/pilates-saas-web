"use client";

import { createContext, useContext, useState, useCallback } from "react";

const SidebarContext = createContext(undefined);

const STORAGE_KEY = "sidebar-collapsed";

function getInitialCollapsed() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function SidebarProvider({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(getInitialCollapsed);

  const toggle = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const setCollapsed = useCallback((value) => {
    setIsCollapsed(value);
    localStorage.setItem(STORAGE_KEY, String(value));
  }, []);

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggle, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
