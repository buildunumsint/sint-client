import * as React from "react";
import { Label } from "./label";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  endIconClassName?: string;
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
  isInvalid?: boolean;
  isSuccess?: boolean;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      endIconClassName,
      type,
      isInvalid,
      startContent,
      endContent,
      startIcon: StartIcon,
      endIcon: EndIcon,
      isSuccess,
      size,
      label,
      ...props
    },
    ref
  ) => {
    const borderColor = isInvalid
      ? "border-error"
      : isSuccess
        ? "border-success"
        : "border-input-blur focus:border-input";

    const hasStartContent = startContent || StartIcon;
    const hasEndContent = endContent || EndIcon;

    const inputPaddingLeft = hasStartContent ? "pl-10" : "pl-3";
    const inputPaddingRight = hasEndContent ? "pr-10" : "pr-3";

    const inputSize = size ? `h-[${size}px]` : "h-12";

    return (
      <div className="w-full">
        {label && <Label className="text-md font-semibold mb-2">{label}</Label>}
        <div className="relative">
          {hasStartContent && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 ">
              {StartIcon ? <StartIcon className="h-5 w-5" /> : startContent}
            </span>
          )}
          <input
            type={type}
            className={cn(
              "flex rounded-lg border bg-[#F7F7F7] shadow-none  py-1 text-base transition-all duration-75 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-90 disabled:text-[#595959] md:text-sm",
              "w-full",
              inputSize,
              inputPaddingLeft,
              inputPaddingRight,
              borderColor,

              className
            )}
            ref={ref}
            {...props}
          />
          {hasEndContent && (
            <span className={cn("absolute right-3 top-1/2 -translate-y-1/2 ", endIconClassName)}>
              {EndIcon ? <EndIcon /> : endContent}
            </span>
          )}
        </div>
      </div>
    );
  }
);
// text-[var(--text-color-1)]
Input.displayName = "Input";

export { Input };

// import * as React from "react"

// import { cn } from "@/lib/utils"

// function Input({ className, type, ...props }: React.ComponentProps<"input">) {
//   return (
//     <input
//       type={type}
//       data-slot="input"
//       className={cn(
//         "dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:aria-invalid:border-destructive/50 disabled:bg-input/50 dark:disabled:bg-input/80 h-8 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors file:h-6 file:text-sm file:font-medium focus-visible:ring-3 aria-invalid:ring-3 md:text-sm file:text-foreground placeholder:text-muted-foreground w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
//         className
//       )}
//       {...props}
//     />
//   )
// }

// export { Input }
