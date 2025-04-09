import React, { useEffect, useState } from "react";
import { loadMe, updateUser } from "../../lib/UserService";

interface BooleanToggleProps {
  type?: "refresh" | "readOnly";
}

export default function BooleanToggle({ type }: BooleanToggleProps) {
  const [isRefresh, setIsRefresh] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchMe() {
      const me = await loadMe();
      if (me) {
        setIsRefresh(me.refresh);
        setIsReadOnly(me.readonly);
        setUserId(me.id);
      }
    }
    fetchMe();
  }, []);

  const isChecked = type === "readOnly" ? isReadOnly : isRefresh;
  const handleToggle = async () => {
    let newValue = false;
    let fieldToUpdate = "";

    if (type === "readOnly") {
      newValue = !isReadOnly;
      setIsReadOnly(newValue);
      fieldToUpdate = "readonly";
      console.log("readOnly", newValue);
    } else if (type === "refresh") {
      newValue = !isRefresh;
      setIsRefresh(newValue);
      fieldToUpdate = "refresh";
      console.log("refresh", newValue);
    }

    if (userId) {
      const res = await updateUser(userId, { [fieldToUpdate]: newValue });
      if (res.error) {
        console.error(res.error);
      }
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 p-4">
      <label className="flex cursor-pointer items-center gap-4">
        <div className="relative">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleToggle}
            className="sr-only"
          />
          <div
            className={`h-6 w-10 rounded-full transition-colors ${
              isChecked ? "bg-green" : "bg-red"
            }`}
          />
          <div
            className={`absolute top-1 left-1 h-4 w-4 transform rounded-full bg-white shadow-md transition-transform ${
              isChecked ? "translate-x-4" : ""
            }`}
          />
        </div>
        <span className="text-sm font-medium text-fg">
          {isChecked
            ? type === "readOnly"
              ? "Lecture seule activée"
              : "Actualisation automatique"
            : type === "readOnly"
              ? "Lecture seule désactivée"
              : "Actualisation désactivée"}
        </span>
      </label>
    </div>
  );
}
