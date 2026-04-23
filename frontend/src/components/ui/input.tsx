import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border border-[var(--slate-300)] bg-white px-3 py-2 text-sm text-[var(--slate-900)] placeholder:text-[var(--slate-500)] outline-none ring-offset-background transition-all focus-visible:ring-2 focus-visible:ring-[var(--brand-500)] disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
