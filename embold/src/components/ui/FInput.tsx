import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const FInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          " flex h-10 w-full rounded-md  bg-emboldLight px-3 py-2 text-sm ring-offset-emboldLight50 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-emboldBlack focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-emboldBlack",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
FInput.displayName = "FInput";

export { FInput };
