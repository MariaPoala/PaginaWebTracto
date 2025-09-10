// Header.tsx
import { useEffect, useMemo, useState } from "react";

/** Helpers */
function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

/** Tipos */
type NavChild = { label: string; href: string; description?: string };
type NavItem = { label: string; href?: string; children?: NavChild[] };
type Brand = { name: string; logo?: string; href?: string };

// const DEFAULT_BRAND: Brand = {
//   name: "TuMarca",
//   logo: "https://dummyimage.com/48x48/000/fff&text=T",
//   href: "#",
// };

const DEFAULT_NAV: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Servicios",href: "#"},
  { label: "Precios", href: "./paginauno" },
  { label: "Nosotros", href: "#" },
  { label: "Contacto", href: "../contact" },
];

export default function Header({

  nav = DEFAULT_NAV,

  ctaHref = "#",
}: {
  brand?: Brand;
  nav?: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mobileAccordions, setMobileAccordions] = useState<Record<number, boolean>>({});

  /** Tema persistente */
  useEffect(() => {
    const stored =
      (typeof window !== "undefined" && localStorage.getItem("theme")) || undefined;
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

  /** Header sticky con blur */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** Cierra al cambiar tamaño (si pasan a desktop) */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /** Bloquear scroll de body cuando el drawer está abierto */
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
  }, [mobileOpen]);

  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";

  const baseHref =
    typeof window !== "undefined" ? window.location.href : "http://localhost/";

  const isActive = (href?: string) => {
    if (!href) return false;
    try {
      return pathname === new URL(href, baseHref).pathname;
    } catch {
      return false;
    }
  };


  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all ",
        scrolled
          ? "backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-neutral-900/70 border-b border-gray-200/70 dark:border-neutral-800"
          : "bg-white/0 dark:bg-neutral-900/0"
      )}
      role="banner"
    >
      <div className="mx-auto max-w-7xl bg-brand-red-700 px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">


          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Primary"
          >
            {nav.map((item, idx) =>
              <a
                key={idx}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg hover:text-orange-500 dark:hover:bg-neutral-300 ",
                  isActive(item.href)
                    ? "text-red-800 dark:text-white"
                    : "text-red-700 hover:text-orange-500 dark:text-orange-200 dark:hover:text-orange-500"
                )}
              >
                {item.label}
              </a>

            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">



            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 lg:hidden dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-100 dark:hover:bg-neutral-700"
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
        className={cn(
          "fixed inset-0 z-[60] lg:hidden transition",
          mobileOpen ? "visible" : "invisible"
        )}
        aria-hidden={!mobileOpen}
        onClick={() => setMobileOpen(false)}
      >
        {/* overlay */}
        <div className={cn("absolute inset-0 bg-black/30 transition", mobileOpen ? "opacity-100" : "opacity-0")} />
        {/* panel */}
        <aside
          className={cn(
            "absolute right-0 top-0 h-full w-[88%] max-w-sm bg-white dark:bg-neutral-900 border-l border-gray-200 dark:border-neutral-800 shadow-xl p-4",
            "transition-transform",
            mobileOpen ? "translate-x-0" : "translate-x-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >


          <div className="mt-6 space-y-1">
            {nav.map((item, idx) =>
              item.children ? (
                <div key={idx} className="rounded-xl border border-gray-200 dark:border-neutral-800">
                  <button
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-gray-800 dark:text-gray-100"
                    onClick={() =>
                      setMobileAccordions((m) => ({ ...m, [idx]: !m[idx] }))
                    }
                    aria-expanded={!!mobileAccordions[idx]}
                    aria-controls={`sect-${idx}`}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition",
                        mobileAccordions[idx] && "rotate-180"
                      )}
                    />
                  </button>
                  <div
                    id={`sect-${idx}`}
                    className={cn(
                      "grid overflow-hidden transition-[grid-template-rows] duration-300",
                      mobileAccordions[idx] ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    )}
                  >
                    <div className="min-h-0">
                      {item.children.map((ch, i) => (
                        <a
                          key={i}
                          href={ch.href}
                          className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-neutral-800"
                          onClick={() => setMobileOpen(false)}
                        >
                          <div className="font-medium text-gray-800 dark:text-gray-100">{ch.label}</div>
                          {ch.description && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {ch.description}
                            </div>
                          )}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <a
                  key={idx}
                  href={item.href}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-sm font-medium",
                    "text-gray-800 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-neutral-800",
                    isActive(item.href) && "text-indigo-600 dark:text-indigo-400"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              )
            )}
          </div>
        </aside>
      </div>
    </header>
  );
}

/** Iconos (inline SVG, sin libs) */
function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function ArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function Sun(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function Moon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
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
      <span
        className={cn(
          "absolute left-0 top-0 h-0.5 w-full bg-current transition",
          open ? "translate-y-2 rotate-45" : ""
        )}
      />
      <span
        className={cn(
          "absolute left-0 top-2 h-0.5 w-full bg-current transition",
          open ? "opacity-0" : "opacity-100"
        )}
      />
      <span
        className={cn(
          "absolute left-0 top-4 h-0.5 w-full bg-current transition",
          open ? "-translate-y-2 -rotate-45" : ""
        )}
      />
    </div>
  );
}
// src/Navbar.tsx
// import { NavLink } from "react-router-dom";

// type NavItem = { label: string; to: string };

// const DEFAULT_NAV: NavItem[] = [
//   { label: "Inicio",    to: "/" },
//   { label: "Servicios", to: "/servicios" },
//   { label: "Precios",   to: "/paginauno" },
//   { label: "Nosotros",  to: "/nosotros" },
//   { label: "Contacto",  to: "/contact" },
// ];

// export default function Navbar() {
//   return (
//     <header className="sticky top-0 z-40 bg-brand-red-700 text-white">
//       <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
//         <span className="font-semibold">MiMarca</span>
//         <ul className="flex gap-4">
//           {DEFAULT_NAV.map((item) => (
//             <li key={item.to}>
//               <NavLink
//                 to={item.to}
//                 className={({ isActive }) =>
//                   `rounded-lg px-3 py-2 text-sm transition ${
//                     isActive
//                       ? "bg-white text-neutral-900"
//                       : "text-white/90 hover:bg-white/10"
//                   }`
//                 }
//               >
//                 {item.label}
//               </NavLink>
//             </li>
//           ))}
//         </ul>
//       </nav>
//     </header>
//   );
// }
