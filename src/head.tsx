// Header.tsx — estilo elegante con submenú en "PRODUCTOS"
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
  name: "Tracto Centro Peru",
  logo: "./logo.png",
  href: "/",
};

// 👇 Aquí definimos los submenús para PRODUCTOS
const DEFAULT_NAV: NavItem[] = [
  { label: "INICIO", href: "/" },
  { label: "NOSOTROS", href: "/nosotros" },
  {
    label: "PRODUCTOS",
    children: [
      { label: "Arados", href: "/arados", description: "Preparación de suelos con máxima eficiencia" },
      { label: "Insumos de mantenimiento", href: "/insumos", description: "Aceites, filtros y productos esenciales" },
      { label: "Repuestos", href: "/repuestos", description: "Piezas originales y de alta durabilidad" },
      { label: "Rastras", href: "/rastras", description: "Nivelación y refinado de terrenos agrícolas" },
      { label: "Surcadoras", href: "/surcadoras", description: "Surcos precisos para una siembra uniforme" }

    ],
  },
  { label: "SERVICIOS", href: "/servicios" },
  { label: "CONTACTO", href: "/contact" },
];

export default function Header({
  brand = DEFAULT_BRAND,
  nav = DEFAULT_NAV,
  ctaLabel = "Cotizar",
  ctaHref = "https://wa.me/51981830008?text=Hola,%20quiero%20realizar%20una%20cotización%20",
}: {
  brand?: Brand;
  nav?: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAcc, setMobileAcc] = useState<Record<number, boolean>>({});
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  /** Tema persistente */
  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("theme")) || undefined;
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
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
    const onScroll = () => setScrolled(window.scrollY > 8);
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
        "sticky top-0 z-50 w-full transition-all border-b border-emerald-800/15",
        scrolled
          ? "backdrop-blur-xl supports-[backdrop-filter]:bg-white/65 dark:supports-[backdrop-filter]:bg-emerald-950/60 border-b border-emerald-800/15 shadow-[0_8px_30px_rgba(2,44,34,0.07)]"
          : "bg-white/80 dark:bg-emerald-950/50"
      )}
      role="banner"
    >
      {/* filamento superior (sutil) */}
      <div className="h-px w-full bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-700" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Brand */}
          <a href={brand?.href || "/"} className="flex items-center gap-3">
            {brand?.logo ? (
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-9 w-9 rounded-2xl object-cover ring-1 ring-emerald-900/10 shadow-sm"
              />
            ) : (
              <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-emerald-700 to-green-600 text-white font-bold">
                {brand?.name?.[0] || "T"}
              </div>
            )}
            <span className="hidden text-[15px] font-extrabold tracking-tight text-emerald-900 sm:block dark:text-emerald-100">
              {brand?.name}<br /> Tecnología al servicio de la industria
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {nav.map((item, idx) => {
              const hasChildren = !!item.children?.length;
              return (
                <div key={idx} className={cn("relative group", hasChildren ? "px-1" : "")}>
                  {!hasChildren ? (
                    <a
                      href={item.href}
                      className={cn(
                        "relative rounded-lg px-3 py-2 text-[13px] font-semibold tracking-wide transition",
                        isActive(item.href)
                          ? "text-emerald-900 dark:text-white"
                          : "text-emerald-800/90 hover:text-emerald-900 dark:text-emerald-100/90 dark:hover:text-emerald-100"
                      )}
                    >
                      <span>{item.label}</span>
                      <span
                        className={cn(
                          "pointer-events-none absolute left-2 right-2 -bottom-1 h-[2px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-emerald-700 to-green-600 transition-transform duration-300",
                          (isActive(item.href) ? "scale-x-100" : "group-hover:scale-x-100")
                        )}
                      />
                    </a>
                  ) : (
                    <>
                      {/* Trigger con caret */}
                      <button
                        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[13px] font-semibold tracking-wide text-emerald-800/90 hover:text-emerald-900 transition dark:text-emerald-100/90 dark:hover:text-emerald-100"
                        aria-haspopup="menu"
                        aria-expanded="false"
                        aria-controls={`menu-${idx}`}
                      >
                        {item.label}
                        <CaretDown className="h-4 w-4 opacity-80" />
                      </button>

                      {/* Dropdown */}
                      <div
                        id={`menu-${idx}`}
                        role="menu"
                        className="invisible absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-emerald-900/10 bg-white/90 p-2 opacity-0 shadow-xl backdrop-blur-xl transition-[opacity,transform,visibility] duration-200 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 translate-y-1 dark:border-emerald-800/40 dark:bg-emerald-950/80"
                      >
                        {item.children!.map((c) => (
                          <a
                            key={c.label}
                            href={c.href}
                            className="block rounded-xl px-3 py-2 text-[13px] text-emerald-900 hover:bg-emerald-50/80 dark:text-emerald-100 dark:hover:bg-emerald-900/40"
                            role="menuitem"
                          >
                            <div className="font-semibold">{c.label}</div>
                            {c.description && (
                              <div className="text-[12px] text-emerald-800/70 dark:text-emerald-100/70">
                                {c.description}
                              </div>
                            )}
                          </a>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href={ctaHref}
              className="hidden rounded-full bg-gradient-to-r from-emerald-700 to-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-emerald-500/30 transition hover:shadow-md hover:brightness-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60 lg:inline-flex"
            >
              {ctaLabel}
            </a>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-800/10 bg-white/70 text-emerald-900 shadow-sm hover:bg-white lg:hidden dark:border-emerald-700/40 dark:bg-emerald-900/60 dark:text-emerald-100 dark:hover:bg-emerald-900"
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
            "absolute right-0 top-0 h-full w-[88%] max-w-sm border-l border-emerald-900/10 bg-white/90 backdrop-blur-xl shadow-2xl transition-transform dark:border-emerald-800/40 dark:bg-emerald-950/70",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-4">
            <a href={brand?.href || "/"} className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              {brand?.logo ? (
                <img src={brand.logo} alt={brand.name} className="h-8 w-8 rounded-xl object-cover ring-1 ring-emerald-900/10" />
              ) : (
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-emerald-700 to-green-600 text-white font-bold">
                  {brand?.name?.[0] || "T"}
                </div>
              )}
              <span className="text-sm font-extrabold text-emerald-900 dark:text-emerald-100">{brand?.name}</span>
            </a>
            <button
              onClick={() => setMobileOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-800/10 bg-white/80 text-emerald-900 hover:bg-white dark:border-emerald-800/40 dark:bg-emerald-900/60 dark:text-emerald-100 dark:hover:bg-emerald-900"
              aria-label="Cerrar menú"
            >
              <Close className="h-5 w-5" />
            </button>
          </div>

          <div className="px-4 pb-4">
            <a
              href={ctaHref}
              className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-700 to-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-emerald-500/30 transition hover:shadow-md hover:brightness-[1.03] focus:outline-none focus:ring-4 focus:ring-emerald-300/40 dark:focus:ring-emerald-700/50"
              onClick={() => setMobileOpen(false)}
            >
              {ctaLabel}
            </a>

            <nav className="mt-2 space-y-1" aria-label="Mobile">
              {nav.map((item, idx) => {
                const hasChildren = !!item.children?.length;
                if (!hasChildren) {
                  return (
                    <a
                      key={idx}
                      href={item.href}
                      className="block rounded-xl px-4 py-3 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50/70 dark:text-emerald-100 dark:hover:bg-emerald-900/40"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </a>
                  );
                }
                const open = !!mobileAcc[idx];
                return (
                  <div key={idx} className="rounded-xl bg-transparent">
                    <button
                      onClick={() => setMobileAcc((s) => ({ ...s, [idx]: !open }))}
                      className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50/70 dark:text-emerald-100 dark:hover:bg-emerald-900/40"
                      aria-expanded={open}
                      aria-controls={`mobile-sub-${idx}`}
                    >
                      <span>{item.label}</span>
                      <CaretDown className={cn("h-4 w-4 transition", open ? "rotate-180" : "")} />
                    </button>
                    <div
                      id={`mobile-sub-${idx}`}
                      className={cn(
                        "overflow-hidden pl-2 transition-[grid-template-rows,opacity] duration-200",
                        open ? "grid grid-rows-[1fr] opacity-100" : "grid grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="min-h-0">
                        {item.children!.map((c) => (
                          <a
                            key={c.label}
                            href={c.href}
                            className="block rounded-lg px-4 py-2 text-sm text-emerald-800/90 hover:bg-emerald-50/70 dark:text-emerald-100/90 dark:hover:bg-emerald-900/40"
                            onClick={() => setMobileOpen(false)}
                          >
                            <div className="font-medium">{c.label}</div>
                            {c.description && (
                              <div className="text-[12px] text-emerald-800/70 dark:text-emerald-100/70">
                                {c.description}
                              </div>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
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
    <svg viewBox="0 0 24 24" fill="none" {...props} aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function Burger({ open }: { open: boolean }) {
  return (
    <div className="relative h-5 w-5" aria-hidden="true">
      <span className={cn("absolute left-0 top-0 h-0.5 w-full bg-current transition", open ? "translate-y-2 rotate-45" : "")} />
      <span className={cn("absolute left-0 top-2 h-0.5 w-full bg-current transition", open ? "opacity-0" : "opacity-100")} />
      <span className={cn("absolute left-0 top-4 h-0.5 w-full bg-current transition", open ? "-translate-y-2 -rotate-45" : "")} />
    </div>
  );
}
function CaretDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props} aria-hidden="true">
      <path d="M6.7 9.2a1 1 0 0 1 1.4 0L12 13.1l3.9-3.9a1 1 0 1 1 1.4 1.4l-4.6 4.6a1 1 0 0 1-1.4 0L6.7 10.6a1 1 0 0 1 0-1.4Z" />
    </svg>
  );
}
