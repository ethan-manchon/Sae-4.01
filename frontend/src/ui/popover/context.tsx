import React, { createContext, useContext, useState, ReactNode } from "react";
import PopoverMessage from "./index";

type PopoverType = "error" | "success" | "info";

interface PopoverContextProps {
  showPopover: (message: string, type?: PopoverType) => void;
}

const PopoverContext = createContext<PopoverContextProps | undefined>(
  undefined,
);

export function usePopover() {
  const context = useContext(PopoverContext);
  if (!context)
    throw new Error("usePopover must be used within PopoverProvider");
  return context;
}

export function PopoverProvider({ children }: { children: ReactNode }) {
  const [popover, setPopover] = useState<{
    message: string;
    type: PopoverType;
  } | null>(null);

  const showPopover = (message: string, type: PopoverType = "info") => {
    setPopover({ message, type });
  };

  return (
    <PopoverContext.Provider value={{ showPopover }}>
      {children}
      {popover && (
        <PopoverMessage
          message={popover.message}
          type={popover.type}
          onClose={() => setPopover(null)}
        />
      )}
    </PopoverContext.Provider>
  );
}
