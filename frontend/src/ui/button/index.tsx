import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";

interface BtnDataProps {
  children?: React.ReactNode;
  link?: string;
  onClick?: () => void;
}

interface BtnStyleProps {
  className?: string;
  variant?: "default" | "transparent" | "disabled";
  size?: "default" | "sm" | "lg";
}

type BtnProps = BtnDataProps & BtnStyleProps;

const buttonVariants = cva("rounded-md font-medium focus:outline-none", {
  variants: {
    variant: {
      default:
        "cursor-pointer bg-primary text-bg shadow-lg hover:bg-primary-hover focus:bg-primary-hover focus:underline focus:ring-primary-active",
      disabled: "text-light cursor-not-allowed bg-gray-400",
      transparent:
        "cursor-pointer text-dark hover:underline focus:underline focus:ring-transparent",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export default function Button({
  variant = "default",
  size = "default",
  className,
  children,
  link,
  ...props
}: BtnProps) {
  if (link) {
    return (
      <Link
        to={link}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
