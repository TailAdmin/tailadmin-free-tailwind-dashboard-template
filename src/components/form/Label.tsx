import { cn } from "@/utils";
import type { FC, ReactNode } from "react";

interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

const Label: FC<LabelProps> = ({ htmlFor, children, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400",
        className,
      )}
    >
      {children}
    </label>
  );
};

export default Label;
