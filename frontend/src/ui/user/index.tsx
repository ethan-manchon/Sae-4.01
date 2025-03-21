import React from "react";

interface UserListProps {
    pseudo: string;
    email: string;
    roles: string;
}

export default function UserList(props: UserListProps) {
    return (
        <div className="flex items-center space-x-4 bg-light p-4 rounded">
            <h2 className="font-bold text-lg text-dark">{props.pseudo}</h2>
            <p className="font-bold text-lg text-dark">|</p>
            <p className="text-dark">{props.email}</p>
            <div className="ml-auto">
                <p className="text-dark">{props.roles}</p>
            </div>
        </div>
    );
}