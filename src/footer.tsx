import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FooterLink = { label: string; href: string };

type LinkGroup = {
  title: string;
  links: FooterLink[];
};

interface InteractiveFooterProps {
  brand?: {
    name: string;
    logo?: string; // URL opcional
    tagline?: string;
  };
  groups?: LinkGroup[];
  newsletter?: {
    enabled?: boolean;
    title?: string;
    subtitle?: string;
    placeholder?: string;
    ctaLabel?: string;
  };
  languages?: string[]; // ej: ["ES", "EN", "PT"]
  className?: string;
}

const DEFAULT_GROUPS: LinkGroup[] = [
  {
    title: "Productos",
    links: [
      { label: "Venta de tractores", href: "/productos" },
      { label: "Repuestos", href: "/productos" },
      { label: "Servicios", href: "/servicios" }
    ],
  },
  {
    title: "Enlaces",
    links: [
      { label: "Inicio", href: "/" },
      { label: "Nosotros", href: "/nosotros" },
      { label: "Contacto", href: "/contact" }
    ],
  },
  {
    title: "Contacto",
    links: [
      { label: "Dirección: tractro calle principal s/n", href: "#docs" },
      { label: "Teléfono 1: +51 987456321", href: "https://wa.me/51981830008?text=Hola,%20quiero%20información" },
      { label: "Teléfono 2: +51 987456321", href: "https://wa.me/51981830008?text=Hola,%20quiero%20información" },
      { label: "Correo: tractrosac@gmail.com", href: "mailto:tractrosac@gmail.com?subject=Consulta&body=Hola,%20quisiera%20más%20información." }
    ],
  }
];

const SocialIcon = ({ name }: { name: "x" | "ig" | "in" | "yt" }) => {
  const icons = {
    x: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
        <path d="M18.244 2H21l-6.544 7.48L22 22h-6.873l-4.79-6.24L4.8 22H2l7.09-8.1L2 2h6.873l4.43 5.77L18.244 2Zm-2.408 18h1.87L8.3 4H6.43l9.406 16Z" />
      </svg>
    ),
    ig: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
        <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.51 5.51 0 0 1 12 7.5Zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5ZM18 6.8a1 1 0 1 0 1 1 1 1 0 0 0-1-1Z" />
      </svg>
    ),
    in: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
        <path d="M4.98 3.5A2.49 2.49 0 1 0 5 8.48a2.49 2.49 0 0 0-.02-4.98ZM3 9h4v12H3V9Zm7 0h3.8v1.64h.05A4.17 4.17 0 0 1 18 9c3 0 4 1.97 4 4.53V21h-4v-6.1c0-1.46-.03-3.35-2.04-3.35-2.05 0-2.36 1.6-2.36 3.24V21H10V9Z" />
      </svg>
    ),
    yt: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
        <path d="M23.5 7.2a4 4 0 0 0-2.8-2.8C18.9 4 12 4 12 4s-6.9 0-8.7.4A4 4 0 0 0 .5 7.2 41.7 41.7 0 0 0 0 12a41.7 41.7 0 0 0 .5 4.8 4 4 0 0 0 2.8 2.8C5.1 20 12 20 12 20s6.9 0 8.7-.4a4 4 0 0 0 2.8-2.8A41.7 41.7 0 0 0 24 12a41.7 41.7 0 0 0-.5-4.8ZM9.6 15.5v-7l6 3.5-6 3.5Z" />
      </svg>
    ),
  } as const;
  return icons[name];
};

export default function InteractiveFooter({
  brand = { name: "Tractro SAC", tagline: "Ofrecemos soluciones completas en maquinaria agrícola e industrial. Contamos con venta de tractores y repuestos de calidad garantizada. Brindamos servicios técnicos especializados para el óptimo rendimiento de su equipo. Somos su socio de confianza para impulsar productividad y crecimiento." },
  groups = DEFAULT_GROUPS,
  languages = ["ES", "EN", "PT"],
  className = "",
}: InteractiveFooterProps) {
  // Estado UI
  const [openIdx, setOpenIdx] = useState<number | null>(null); // acordeones mobile
  const [email, setEmail] = useState("");
  const [nlStatus, setNlStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [lang, setLang] = useState(languages[0] || "ES");
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    typeof window === "undefined"
      ? "light"
      : (localStorage.getItem("theme") as "light" | "dark") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );

  // Sync theme with document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Mostrar botón back-to-top al hacer scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 240);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const year = useMemo(() => new Date().getFullYear(), []);

  // Newsletter fake submit
  const submitNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setNlStatus("error");
      return;
    }
    setNlStatus("loading");
    // Simular petición
    await new Promise((r) => setTimeout(r, 900));
    setNlStatus("ok");
    setEmail("");
    setTimeout(() => setNlStatus("idle"), 2500);
  };

  return (
    <footer
      className={
        // Fondo verde oscuro + texto claro (accesible)
        "relative overflow-hidden border-t border-emerald-800 bg-emerald-950 text-emerald-100 dark:bg-emerald-950 " +
        (className || "")
      }
      aria-label="Pie de página"
    >
      {/* Deco superior en verdes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 h-44
                   bg-gradient-to-b from-emerald-300/30 via-green-200/20 to-transparent
                   blur-2xl"
      />

      <div className="mx-auto max-w-7xl px-6 pb-6 pt-8 md:pb-4 md:pt-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-2 md:grid-cols-12"
        >
          {/* Col brand + tagline */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-8 w-8 rounded-lg object-cover ring-1 ring-emerald-700/40"
                />
              ) : (
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-200 text-emerald-900 ring-1 ring-emerald-700/40">
                  <span className="text-sm font-bold">{brand.name[0]}</span>
                </div>
              )}
              <span className="text-lg font-semibold tracking-tight text-emerald-50">
                {brand.name}
              </span>
            </div>
            {brand.tagline && (
              <p className="mt-3 max-w-md text-sm text-emerald-200/90">
                {brand.tagline}
              </p>
            )}

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              {([
                { name: "x", href: "#" },
                { name: "ig", href: "#" },
                { name: "in", href: "#" },
                { name: "yt", href: "#" },
              ] as const).map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  className="group rounded-xl border border-emerald-800 bg-emerald-900/40 p-2 ring-1 ring-emerald-700/40 transition hover:bg-emerald-900/70"
                  aria-label={`Ir a ${s.name}`}
                >
                  <motion.span
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.96 }}
                    className="block text-emerald-200/80 group-hover:text-emerald-100"
                  >
                    <SocialIcon name={s.name} />
                  </motion.span>
                </a>
              ))}
            </div>
          </div>

          {/* Col enlaces (acordeones en mobile) */}
          <div className="md:col-span-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {groups.map((g, idx) => (
                <div
                  key={g.title}
                  className="rounded-2xl border border-emerald-800 bg-emerald-900/30 p-4 ring-1 ring-emerald-700/40"
                >
                  {/* Header */}
                  <button
                    className="flex w-full items-center justify-between gap-2 sm:cursor-default"
                    onClick={() => setOpenIdx((v) => (v === idx ? null : idx))}
                    aria-expanded={openIdx === idx}
                    aria-controls={`panel-${idx}`}
                  >
                    <span className="text-sm font-semibold tracking-wide text-emerald-100">
                      {g.title}
                    </span>
                    <span className="sm:hidden text-emerald-200/80">
                      <svg
                        className={`h-5 w-5 transition ${openIdx === idx ? "rotate-180" : ""}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 14.5a.75.75 0 0 1-.53-.22l-6-6a.75.75 0 0 1 1.06-1.06L12 12.69l5.47-5.47a.75.75 0 1 1 1.06 1.06l-6 6a.75.75 0 0 1-.53.22Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    <motion.ul
                      id={`panel-${idx}`}
                      initial={false}
                      animate={{
                        height:
                          openIdx === idx ||
                          (typeof window !== "undefined" && window.innerWidth >= 640)
                            ? "auto"
                            : 0,
                        opacity:
                          openIdx === idx ||
                          (typeof window !== "undefined" && window.innerWidth >= 640)
                            ? 1
                            : 0,
                      }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="mt-3 space-y-2 overflow-hidden text-sm"
                    >
                      {g.links.map((l) => (
                        <li key={l.label}>
                          <a
                            href={l.href}
                            className="group inline-flex items-center gap-1 rounded-lg px-1 py-1 text-emerald-200 transition hover:text-emerald-50"
                          >
                            <span className="relative">
                              {l.label}
                              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-emerald-300 transition-[width] group-hover:w-full" />
                            </span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100"
                              aria-hidden
                            >
                              <path d="M13.5 4.5a.75.75 0 0 1 .75-.75h5.25a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V6.31l-8.22 8.22a.75.75 0 1 1-1.06-1.06l8.22-8.22H14.25a.75.75 0 0 1-.75-.75Z" />
                              <path d="M3 6.75A2.75 2.75 0 0 1 5.75 4h5.5a.75.75 0 0 1 0 1.5h-5.5A1.25 1.25 0 0 0 4.5 6.75v10.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-5.5a.75.75 0 0 1 1.5 0v5.5A2.75 2.75 0 0 1 16.25 21h-10.5A2.75 2.75 0 0 1 3 18.25V6.75Z" />
                            </svg>
                          </a>
                        </li>
                      ))}
                    </motion.ul>
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Barra inferior */}
        <div className="mt-8 flex flex-row items-center justify-center gap-2 border-t border-emerald-800 pt-4 text-sm text-emerald-200 md:flex-row">
          <p>
            © {year} {brand.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Back to top */}
      <AnimatePresence>
        {scrolled && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-xl ring-1 ring-emerald-300/60 transition hover:translate-y-[-2px] hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300/60"
            aria-label="Volver arriba"
          >
            ↑ Arriba
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
}

// -----------------------
// Subcomponentes / Íconos
// -----------------------
function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-80" d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Zm0-16a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm0 18a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1ZM3 11a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1Zm16 0a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2h-1a1 1 0 0 1-1-1ZM5.64 4.64a1 1 0 0 1 1.41 0l.71.71a1 1 0 0 1-1.41 1.41l-.71-.71a1 1 0 0 1 0-1.41Zm10.19 10.19a1 1 0 0 1 1.41 0l.71.71a1 1 0 1 1-1.41 1.41l-.71-.71a1 1 0 0 1 0-1.41ZM4.93 18.36a1 1 0 0 1 1.41 0l.71.71a1 1 0 1 1-1.41 1.41l-.71-.71a1 1 0 0 1 0-1.41ZM16.95 6.34a1 1 0 0 1 1.41 0l.71.71A1 1 0 1 1 17.66 8.46l-.71-.71a1 1 0 0 1 0-1.41Z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" />
    </svg>
  );
}
