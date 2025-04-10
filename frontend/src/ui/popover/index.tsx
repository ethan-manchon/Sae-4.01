import React, { useEffect, useState } from "react";

interface PopoverMessageProps {
  message: string;
  type?: "error" | "success" | "info";
  duration?: number;
  onClose?: () => void;
}

const bgColors = {
  error: "bg-red text-white",
  success: "bg-green text-white",
  info: "bg-blue text-white",
};

export default function PopoverMessage({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: PopoverMessageProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-5 right-5 z-50 rounded-lg px-4 py-2 shadow-lg ${bgColors[type]}`}
    >
      {message}
    </div>
  );
}
