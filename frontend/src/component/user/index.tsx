import React, { useState } from "react";
import Button from "../../ui/button"; 
import Bloquer from "../../ui/bloquer"; 


interface UserListProps {
    id: number;
    pseudo: string;
    email: string;
    roles: string | string[];
    blocked: boolean;
    onUpdated?: () => void;
  }

export default function UserList({ id, pseudo, email, roles, blocked, onUpdated }: UserListProps) {
    const [editMode, setEditMode] = useState(false);
    const [newPseudo, setNewPseudo] = useState(pseudo);
    const [newEmail, setNewEmail] = useState(email);

    const initialRole = Array.isArray(roles) ? roles[0] : roles;
    const [newRoles, setNewRoles] = useState(initialRole);

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
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:8080/admin/users/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    pseudo: newPseudo,
                    email: newEmail,
                    roles: [newRoles],
                }),
            });

            if (response.ok) {
                setEditMode(false);
                onUpdated?.();
            } else {
                alert("Erreur lors de la mise à jour.");
            }
        } catch (error) {
            alert("Erreur réseau");
        }
    };

    return (
        <li className="flex items-center space-x-4 w-full bg-bg p-4 rounded">
            {editMode ? (
                <>
                    <input className="border p-1 rounded text-sm w-32" value={newPseudo} onChange={(e) => setNewPseudo(e.target.value)}/>
                    <input className="border p-1 rounded text-sm w-64" value={newEmail} onChange={(e) => setNewEmail(e.target.value)}/>
                    <select className="border p-1 rounded text-sm" value={newRoles} onChange={(e) => setNewRoles(e.target.value)}>
                        <option value="ROLE_USER">USER</option>
                        <option value="ROLE_ADMIN">ADMIN</option>
                    </select>
                    <div className="ml-auto flex gap-2">
                        <Button variant="default" size="sm" onClick={handleSave}>✅</Button>
                        <Button variant="transparent" size="sm" onClick={handleCancel}>❌</Button>
                    </div>
                    <Bloquer id={id} bloquer={blocked} onUpdated={onUpdated}/>
                </>
            ) : (
                <>
                    <h2 className="font-bold text-lg text-fg">{pseudo}</h2>
                    <p className="font-bold text-lg text-fg">|</p>
                    <p className="text-fg">{email}</p>
                    <div className="ml-auto flex items-center gap-2">
                        <p className="text-fg border p-1 rounded">{roleLabels[initialRole] || initialRole}</p>
                        <Button size="sm" onClick={() => setEditMode(true)}> Modifier </Button>
                    </div>
                    <Bloquer id={id} bloquer={blocked} onUpdated={onUpdated} />
                </>
            )}
        </li>
    );
}
