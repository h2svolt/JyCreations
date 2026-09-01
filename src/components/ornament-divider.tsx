import { cn } from "@/lib/utils";

/** A thin heritage-style rule with a small centered flourish, used sparingly
 * between major sections instead of plain whitespace. */
export function OrnamentDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)} aria-hidden="true">
      <span className="h-px w-16 bg-border sm:w-24" />
      <span className="font-display text-sm text-gold">✦</span>
      <span className="h-px w-16 bg-border sm:w-24" />
    </div>
  );
}
