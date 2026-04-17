"use client";

export interface PanelResizeHandleProps {
  ariaLabel: string;
  onPointerDownClientX: (clientX: number) => void;
}

export function PanelResizeHandle({
  ariaLabel,
  onPointerDownClientX,
}: PanelResizeHandleProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="group relative h-full w-2 shrink-0 cursor-col-resize touch-none border-0 bg-transparent p-0 outline-none hover:bg-zinc-200/70 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:hover:bg-zinc-700/60 dark:focus-visible:ring-offset-zinc-950"
      onPointerDown={(e) => {
        if (e.button !== 0) {
          return;
        }
        e.preventDefault();
        onPointerDownClientX(e.clientX);
      }}
    >
      <span
        className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-zinc-300 group-hover:bg-zinc-500 dark:bg-zinc-600 dark:group-hover:bg-zinc-400"
        aria-hidden
      />
    </button>
  );
}
