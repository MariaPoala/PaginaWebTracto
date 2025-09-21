import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

/**
 * CardGlow: Componente para dar un halo luminoso (glow) verde alrededor del card.
 */
export function CardGlow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative rounded-2xl transition duration-300 hover:shadow-lg",
        className
      )}
    >
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-green-400/20 to-emerald-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
      {children}
    </div>
  );
}
