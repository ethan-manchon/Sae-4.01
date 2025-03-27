import React, { useEffect, useState } from "react";
import { loadMe, updateRefreshSetting } from "../../lib/loader";

export default function BooleanToggle() {
  const [isChecked, setIsChecked] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchMe() {
      const me = await loadMe();
      if (me) {
        setIsChecked(me.refresh);
        setUserId(me.id);
      }
    }

    fetchMe();
  }, []);

  const handleToggle = async () => {
    const newValue = !isChecked;
    setIsChecked(newValue);

    if (userId) {
      const res = await updateRefreshSetting(userId, newValue);
      if (res.error) {
        console.error(res.error);
      }
    }
  };

  return (
    <div className="p-4 flex flex-col items-start gap-2">
      <label className="flex items-center gap-4 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleToggle}
            className="sr-only"
          />
          <div
            className={`w-10 h-6 rounded-full transition-colors ${
              isChecked ? "bg-green" : "bg-red"
            }`}
          />
          <div
            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform transform ${
              isChecked ? "translate-x-4" : ""
            }`}
          />
        </div>
        <span className="text-sm font-medium text-fg">
          {isChecked ? "Auto-refresh" : "Auto-refresh"}
        </span>
      </label>
    </div>
  );
}