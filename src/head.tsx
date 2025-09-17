// Header.tsx — paleta rojo/naranja, responsive y accesible
import { useEffect, useState } from "react";

/** Helpers */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Tipos */
type NavChild = { label: string; href: string; description?: string };
type NavItem = { label: string; href?: string; children?: NavChild[] };
type Brand = { name: string; logo?: string; href?: string };

const DEFAULT_BRAND: Brand = {
  name: "Tractro SAC",
  logo: "https://dummyimage.com/48x48/f97316/ffffff.png&text=T",
  href: "/",
};

const DEFAULT_NAV: NavItem[] = [
  { label: "INICIO", href: "/" },
  { label: "NOSOTROS", href: "/nosotros" },
  { label: "PRODUCTOS", href: "/productos" },
  { label: "SERVICIOS", href: "/servicios" },
  { label: "CONTACTO", href: "/contact" },
];

export default function Header({
  brand = DEFAULT_BRAND,
  nav = DEFAULT_NAV,
  ctaLabel = "Cotizar",
  ctaHref = "/contact",
}: {
  brand?: Brand;
  nav?: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileAccordions, setMobileAccordions] = useState<Record<number, boolean>>({});

  /** Tema persistente */
  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("theme")) || undefined;
    const prefersDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initial = stored === "dark" || (!stored && prefersDark) ? "dark" : "light";
    setTheme(initial);
  }, []);
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  /** Header sticky */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** Cierra al cambiar tamaño (si pasan a desktop) */
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /** Bloquear scroll del body cuando el drawer está abierto */
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  const baseHref = typeof window !== "undefined" ? window.location.href : "http://localhost/";
  const isActive = (href?: string) => {
    if (!href) return false;
    try { return pathname === new URL(href, baseHref).pathname; } catch { return false; }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all",
        scrolled
          ? "backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-neutral-900/80 border-b border-red-100 dark:border-neutral-800"
          : "bg-white/0 dark:bg-neutral-900"
      )}
      role="banner"
    >
      {/* franja sutil en rojo→naranja */}
      <div className="h-0.5 w-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Brand */}
          <a href={brand?.href || "/"} className="flex items-center gap-3">
            {brand?.logo ? (
              <img src={brand.logo} alt={brand.name} className="h-9 w-9 rounded-xl object-cover shadow-sm" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-orange-500 text-white font-bold">
                {brand?.name?.[0] || "T"}
              </div>
            )}
            <span className="hidden text-base font-black tracking-tight text-red-800 sm:block dark:text-orange-200">{brand?.name}</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {nav.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                className={cn(
                  "relative px-3 py-2 text-sm font-semibold rounded-lg transition",
                  isActive(item.href)
                    ? "text-red-800 dark:text-white after:absolute after:left-3 after:right-3 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-red-600 after:to-orange-500"
                    : "text-red-700 hover:text-orange-700 hover:bg-orange-50/60 dark:text-neutral-100 dark:hover:text-orange-300 dark:hover:bg-neutral-800"
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* CTA desktop */}
            <a
              href={ctaHref}
              className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:from-red-700 hover:to-orange-600 lg:inline-flex"
            >
              {ctaLabel}
            </a>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-orange-200 bg-white text-red-700 shadow-sm hover:bg-orange-50 lg:hidden dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Abrir menú"
              aria-expanded={mobileOpen}
            >
              <Burger open={mobileOpen} />
            </button>
          </div>
        </div>
      </div>

      {/* Drawer móvil */}
      <div
        className={cn("fixed inset-0 z-[60] lg:hidden transition", mobileOpen ? "visible" : "invisible")}
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
      >
        {/* overlay */}
        <div className={cn("absolute inset-0 bg-black/40 transition", mobileOpen ? "opacity-100" : "opacity-0")} />
        {/* panel */}
        <aside
          className={cn(
            "absolute right-0 top-0 h-full w-[88%] max-w-sm border-l border-red-100 bg-white shadow-xl transition-transform dark:border-neutral-800 dark:bg-neutral-900",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4 ">
            <a href={brand?.href || "/"} className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              {brand?.logo ? (
                <img src={brand.logo} alt={brand.name} className="h-8 w-8 rounded-lg object-cover" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-orange-500 text-white font-bold">
                  {brand?.name?.[0] || "T"}
                </div>
              )}
              <span className="text-sm font-extrabold text-red-800 dark:text-orange-200">{brand?.name}</span>
            </a>
            <button
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-orange-200 bg-white text-red-700 hover:bg-orange-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Cerrar menú"
            >
              <Close className="h-5 w-5" />
            </button>
          </div>

          <div className="px-4 pb-4 bg-red-900">
            <a
              href={ctaHref}
              className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-red-700 hover:to-orange-600"
              onClick={() => setMobileOpen(false)}
            >
              {ctaLabel}
            </a>

            <nav className="mt-2 space-y-1" aria-label="Mobile">
              {nav.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-sm font-semibold transition",
                    isActive(item.href)
                      ? "text-red-800 ring-1 ring-inset ring-orange-200 bg-orange-50/70 dark:text-orange-200 dark:ring-neutral-700 dark:bg-neutral-800"
                      : "text-red-700 hover:bg-orange-50/60 dark:text-neutral-100 dark:hover:bg-neutral-800"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </header>
  );
}

/** Iconos (inline SVG, sin libs) */
function Close(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function Burger({ open }: { open: boolean }) {
  return (
    <div className="relative h-5 w-5">
      <span className={cn("absolute left-0 top-0 h-0.5 w-full bg-current transition", open ? "translate-y-2 rotate-45" : "")} />
      <span className={cn("absolute left-0 top-2 h-0.5 w-full bg-current transition", open ? "opacity-0" : "opacity-100")} />
      <span className={cn("absolute left-0 top-4 h-0.5 w-full bg-current transition", open ? "-translate-y-2 -rotate-45" : "")} />
    </div>
  );
}
