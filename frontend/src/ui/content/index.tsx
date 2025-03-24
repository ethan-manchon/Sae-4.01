import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

interface ContentProps {
    children?: string;
    className?: string;
}

const contentVariants = cva("text-left", {
    variants: {
        mode: {
            light: "text-fg bg-bg break-words",
            dark: "text-bg bg-fg break-words",
        },
        size: {
            default: "text-sm",
            lg: "text-lg",
            xl: "text-xl",
        },
    },
    defaultVariants: {
        mode: "light",
        size: "default",
    },
});


export default function Content(props : ContentProps) {
    if (props.children === undefined || props.children === "") {
        return null;
    }

    return (
        <p className={cn(contentVariants(), props.className)}>{props.children}</p>
    );
}