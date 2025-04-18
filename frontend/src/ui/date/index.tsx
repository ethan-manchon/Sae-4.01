import React from "react";

interface DateProps {
  date: string;
}
export default function DateComponent({ date }: DateProps) {
  const now = new Date();
  const createdDate = new Date(Date.parse(date));
  createdDate.setHours(createdDate.getHours());
  const diffInMs = now.getTime() - createdDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeek = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 7));

  let formattedDate;
  if (diffInMinutes < 60) formattedDate = `${diffInMinutes} min`;
  else if (diffInHours < 24) formattedDate = `${diffInHours} h`;
  else if (diffInDays < 7) formattedDate = `${diffInDays} j`;
  else if (diffInWeek < 4) formattedDate = `${diffInWeek} sem`;
  else {
    formattedDate = new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "long",
    }).format(createdDate);
  }
  return (
    <div className="flex items-center text-xs text-element">
      <span className="mx-1 text-element">·</span>
      <span className="text-xs text-element">{formattedDate}</span>
    </div>
  );
}
