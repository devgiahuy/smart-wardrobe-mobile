import React from "react";
import { Pressable, Text, type PressableProps, type ViewStyle, type TextStyle } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group flex flex-row items-center justify-center rounded-lg border border-transparent active:opacity-80 disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary",
        outline: "border-border bg-background",
        secondary: "bg-secondary",
        ghost: "bg-transparent",
        destructive: "bg-destructive/10",
        link: "bg-transparent",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-8 px-2 rounded-md",
        sm: "h-9 px-3 rounded-md",
        lg: "h-12 px-8 rounded-lg",
        icon: "h-10 w-10",
        "icon-xs": "h-6 w-6 rounded-md",
        "icon-sm": "h-7 w-7 rounded-md",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const buttonTextVariants = cva(
  "text-sm font-medium",
  {
    variants: {
      variant: {
        default: "text-primary-foreground",
        outline: "text-foreground",
        secondary: "text-secondary-foreground",
        ghost: "text-foreground",
        destructive: "text-destructive",
        link: "text-primary underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ButtonProps
  extends PressableProps,
    VariantProps<typeof buttonVariants> {
  className?: string;
  textClassName?: string;
  children?: React.ReactNode;
}

const Button = React.forwardRef<React.ElementRef<typeof Pressable>, ButtonProps>(
  ({ className, textClassName, variant, size, children, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {typeof children === "string" ? (
          <Text className={cn(buttonTextVariants({ variant }), textClassName)}>
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants, buttonTextVariants };
