import React from "react";
import Button from "../../ui/button";
import Icon from "../../ui/icon";

export default function NavBar() {
    return (
        <div className="flex flex-col md:flex-row md:h-screen">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 md:flex-col md:justify-start md:items-start md:w-64 md:border-r md:border-b-0">
            <div className="flex justify-center items-center flex-row w-full">
                <Icon url="logo" className="w-8 h-8" />
                <p className="text-2xl text-primary font-bold">Twitter</p>
            </div>
            <div className="flex gap-4 md:flex-col">
                <Button link="/login" variant="transparent">Login</Button>
                <Button link="/register" variant="transparent">Register</Button>
            </div>
            </div>
        </div>
    );
}