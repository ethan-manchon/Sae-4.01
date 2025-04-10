import React, { useState } from "react";
import { togglePin } from "../../lib/PostService";
import { usePopover } from "../popover/context";
import Button from "../button";
import { PinSvg } from "../../assets/svg/svg";

interface PinProps {
  postId: number;
  pinned: boolean;
}

export default function Pin({ postId, pinned }: PinProps) {
  const [pin, setPin] = useState<boolean>(pinned || false);
  const { showPopover } = usePopover();

  const handlePin = async () => {
    const newPin = !pin;
    const res = await togglePin(postId, newPin);
    if (res.success) {
      setPin(res.pinned);
      showPopover(res.pinned ? "Post épinglé." : "Post désépinglé.", "success");
    } else {
      showPopover("Erreur lors du changement de l’épingle.", "error");
    }
  };

  return (
    <Button onClick={handlePin} variant="transparent">
      <PinSvg className={pin ? "text-green" : "text-red"} />
    </Button>
  );
}
