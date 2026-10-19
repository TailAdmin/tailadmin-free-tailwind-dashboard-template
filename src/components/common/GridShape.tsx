import { cn } from "@/utils";

interface GridShapeProps {
  className?: string;
}

export default function GridShape({ className }: GridShapeProps) {
  return (
    <>
      <div
        className={cn(
          "absolute inset-e-0 top-0 -z-1 w-full max-w-62.5 xl:max-w-112.5 rtl:-scale-x-100",
          className,
        )}
      >
        <img src="/images/shape/grid-01.svg" alt="grid" />
      </div>
      <div
        className={cn(
          "absolute inset-s-0 bottom-0 -z-1 w-full max-w-62.5 rotate-180 xl:max-w-112.5 rtl:-scale-x-100",
          className,
        )}
      >
        <img src="/images/shape/grid-01.svg" alt="grid" />
      </div>
    </>
  );
}
