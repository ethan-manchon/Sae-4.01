import React from "react";

interface UserListProps {
    pseudo: string;
    email: string;
    roles: string;
}

export default function UserList(props: UserListProps) {
    return (
        <div className="flex items-center space-x-4 bg-bg p-4 rounded">
            <h2 className="font-bold text-lg text-fg">{props.pseudo}</h2>
            <p className="font-bold text-lg text-fg">|</p>
            <p className="text-fg">{props.email}</p>
            <div className="ml-auto">
                <p className="text-fg">{props.roles}</p>
            </div>
        </div>
    );
}