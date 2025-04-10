import React, { useState } from "react";
import { patchUsers } from "../../lib/UserService";
import Button from "../../ui/button";
import Ban from "../../ui/banned";
import { usePopover } from "../../ui/popover/context";

interface UserListProps {
  id: number;
  pseudo: string;
  email: string;
  roles: string | string[];
  banned: boolean;
  onUpdated?: () => void;
}

export default function UserList({
  id,
  pseudo,
  email,
  roles,
  banned,
  onUpdated,
}: UserListProps) {
  const [editMode, setEditMode] = useState(false);
  const [newPseudo, setNewPseudo] = useState(pseudo);
  const [newEmail, setNewEmail] = useState(email);

  const initialRole = Array.isArray(roles) ? roles[0] : roles;
  const [newRoles, setNewRoles] = useState(initialRole);

  const { showPopover } = usePopover();
  const roleLabels: Record<string, string> = {
    ROLE_USER: "USER",
    ROLE_ADMIN: "ADMIN",
  };

  const handleCancel = () => {
    setNewPseudo(pseudo);
    setNewEmail(email);
    setNewRoles(initialRole);
    setEditMode(false);
  };

  const handleSave = async () => {
    const result = await patchUsers(id, {
      pseudo: newPseudo,
      email: newEmail,
      roles: newRoles,
    });
    if (result.error) {
      showPopover(result.error);
      return;
    }
    if (onUpdated) onUpdated();
    setEditMode(false);
  };

  return (
    <li className="flex w-full items-center space-x-4 rounded bg-bg p-4">
      {editMode ? (
        <>
          <input
            className="w-32 rounded border p-1 text-sm"
            value={newPseudo}
            onChange={(e) => setNewPseudo(e.target.value)}
          />
          <input
            className="w-64 rounded border p-1 text-sm"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <select
            className="rounded border p-1 text-sm"
            value={newRoles}
            onChange={(e) => setNewRoles(e.target.value)}
          >
            <option value="ROLE_USER">USER</option>
            <option value="ROLE_ADMIN">ADMIN</option>
          </select>
          <div className="ml-auto flex gap-2">
            <Button variant="default" size="sm" onClick={handleSave}>
              ✅
            </Button>
            <Button variant="transparent" size="sm" onClick={handleCancel}>
              ❌
            </Button>
          </div>
          <Ban id={id} ban={banned} onUpdated={onUpdated} />
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold text-fg">{pseudo}</h2>
          <p className="text-lg font-bold text-fg">|</p>
          <p className="text-fg">{email}</p>
          <div className="ml-auto flex items-center gap-2">
            <p className="rounded border p-1 text-fg">
              {roleLabels[initialRole] || initialRole}
            </p>
            <Button size="sm" onClick={() => setEditMode(true)}>
              {" "}
              Modifier{" "}
            </Button>
          </div>
          <Ban id={id} ban={banned} onUpdated={onUpdated} />
        </>
      )}
    </li>
  );
}
