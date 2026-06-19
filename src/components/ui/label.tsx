import * as React from "react";
import { Text, type TextProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const labelVariants = cva(
  "text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef<
  React.ElementRef<typeof Text>,
  TextProps & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <Text
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
