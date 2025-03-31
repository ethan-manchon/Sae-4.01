import React, { useState } from "react";
import { patchUsers } from "../../lib/UserService";
import Button from "../button";
import {PadlockCloseSvg, PadlockOpenSvg} from "../../assets/svg/svg";

interface BanProps {
  id: number;
  ban?: boolean;
  onUpdated?: () => void;
}

export default function Ban({ id, ban = false, onUpdated }: BanProps) {
  const [isBanned, setIsBanned] = useState(ban);

  const handleBlock = async () => {
    if (!confirm("Bannir cet utilisateur ?")) return;
    setIsBanned(true);
    const res = await patchUsers(id, { patch: isBanned });
  };

  const handleUnblock = async () => {
    if (!confirm("Déban cet utilisateur ?")) return;
    setIsBanned(false);
    const res = await patchUsers(id, { patch: isBanned });
    };

  return (
    <div className="ml-2">
      {isBanned ? ( 
        <Button size="sm" variant="transparent" className=" text-red" onClick={handleUnblock}>
          <PadlockCloseSvg/>
        </Button>
      ) : (
        <Button size="sm" variant="transparent" className=" text-green" onClick={handleBlock}>
          <PadlockOpenSvg/>
        </Button>
      )}
    </div>
  );
}
