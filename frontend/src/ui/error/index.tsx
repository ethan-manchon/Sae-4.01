import React from "react";

interface ErrorProps {
  error: string;
}

export default function Error({ error }: ErrorProps) {
  return (
    <div
      className="relative mt-2 rounded border border-error-border bg-error-bg px-4 py-3 text-error"
      role="alert"
    >
      <span className="block sm:inline">{error}</span>
    </div>
  );
}
