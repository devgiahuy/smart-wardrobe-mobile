import * as React from "react";
import { TextInput, type TextInputProps } from "react-native";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, TextInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          "h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground",
          className
        )}
        placeholderTextColor="#a1a1aa" // Tailwind zinc-400 equivalent for placeholder
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
