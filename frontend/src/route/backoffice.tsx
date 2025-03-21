import React from "react";
import Button from "../ui/button";
import UsersList from "../component/usersList";

export default function BackOffice() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold">Backoffice</h1>
            <UsersList />
        </div>
    );
}