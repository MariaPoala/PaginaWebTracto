import React, { useEffect, useMemo, useRef, useState } from "react";

// =====================
// Tipos
// =====================
type Slide = {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  cta?: { label: string; href: string };
  align?: "left" | "center" | "right";
};

interface HeroCarouselProps {
  slides?: Slide[];
  interval?: number; // ms
  className?: string;
}

// =====================
// Slides demo (puedes borrar)
// =====================
const DEFAULT_SLIDES: Slide[] = [
  {
    id: "1",
    image:
      "https://cabinasglobal.com/sites/default/files/2024-07/new-tractors.jpg",
    title: "Venta de tractores",
    subtitle:
      "Tractores modernos y confiables para potenciar el trabajo en el campo y la industria.",
    cta: { label: "Ver productos", href: "/productos" },
    align: "left",
  },
  {
    id: "2",
    image:
      "https://s.alicdn.com/@sc04/kf/H99f43b744bf54c2cb42d309096e1f47bX/Tractor-Spare-Parts-Agricultural-Machinery-Part-R521498-Gasket-Replacement-for-John-Deeree.jpg",
    title: "Repuestos y partes",
    subtitle:
      "Amplio stock de repuestos originales y accesorios para mantener tu maquinaria en óptimas condiciones.",
    cta: { label: "Ver productos", href: "/productos" },
    align: "center",
  },
  {
    id: "3",
    image:
      "https://tractocentrocolombia.com/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2020-07-09-at-1.27.45-PM-1-1-q3kb3gj8s55ahjgzaf17sdrew538b98rrm77963coo.jpeg",
    title: "Servicios técnicos",
    subtitle:
      "Mantenimiento y soporte especializado para asegurar el máximo rendimiento de tus equipos.",
    cta: { label: "Solicítalo", href: "/servicios" },
    align: "right",
  },
];

// =====================
// Componente
// =====================
export default function HeroCarousel({
  slides = DEFAULT_SLIDES,
  interval = 6000,
  className = "",
}: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef(0);
  const lastTick = useRef<number | null>(null);

  // Helpers
  const goTo = (i: number) => setIndex(((i % slides.length) + slides.length) % slides.length);
  const next = () => {
    setIndex((i) => ((i + 1) % slides.length));
    setProgress(0);
  };
  const prev = () => {
    setIndex((i) => ((i - 1 + slides.length) % slides.length));
    setProgress(0);
  };

  // Autoplay con barra de progreso
  useEffect(() => {
    if (paused || isDragging) return;

    let raf: number;
    const tick = (t: number) => {
      if (lastTick.current === null) lastTick.current = t;
      const dt = t - lastTick.current;
      lastTick.current = t;
      setProgress((p) => {
        const np = p + dt / interval;
        if (np >= 1) {
          next();
          return 0;
        }
        return np;
      });
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      lastTick.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, isDragging, interval, index, slides.length]);

  // Navegación por teclado
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Touch / drag
  const onTouchStart: React.TouchEventHandler = (e) => {
    setIsDragging(true);
    setPaused(true);
    touchStartX.current = e.touches[0].clientX;
    setDragX(0);
  };
  const onTouchMove: React.TouchEventHandler = (e) => {
    if (!wrapRef.current) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    setDragX(dx);
  };
  const onTouchEnd: React.TouchEventHandler = () => {
    if (!wrapRef.current) return;
    const width = wrapRef.current.clientWidth || 1;
    const threshold = width * 0.18; // 18% swipe
    if (dragX > threshold) prev();
    else if (dragX < -threshold) next();
    setDragX(0);
    setIsDragging(false);
    setPaused(false);
  };

  // translateX con arrastre (% del width)
  const translateX = useMemo(() => {
    const width = wrapRef.current?.clientWidth || 1;
    const dragPct = (dragX / width) * 100;
    return `translateX(calc(${-index * 100}% + ${dragPct}%))`;
  }, [index, dragX]);

  // Alineación de texto
  const alignClass = (a?: Slide["align"]) =>
    a === "center"
      ? "items-center text-center"
      : a === "right"
      ? "items-end text-right"
      : "items-start text-left";

  return (
<section
  ref={wrapRef}
  tabIndex={0}
  role="region"
  aria-roledescription="carousel"
  aria-label="Carrusel principal"
  className={[
    "relative w-full overflow-hidden rounded-3xl",
    // Fondo + borde sutil con paleta verde/emerald
    "bg-neutral-950/70 ring-1 ring-white/10 shadow-2xl",
    "supports-[backdrop-filter]:backdrop-blur-sm",
    // Glow frío-verde
    "shadow-[0_10px_40px_rgba(16,185,129,0.25)]", // emerald-500
    className || "",
  ].join(" ")}
  onMouseEnter={() => setPaused(true)}
  onMouseLeave={() => setPaused(false)}
  onTouchStart={onTouchStart}
  onTouchMove={onTouchMove}
  onTouchEnd={onTouchEnd}
>
  {/* Barra de progreso con gradiente verde */}
  <div className="absolute left-0 top-0 z-30 h-1 w-full bg-white/10">
    <div
      className="h-full bg-gradient-to-r from-emerald-600 via-green-500 to-teal-400 transition-[width]"
      style={{ width: `${Math.min(progress * 100, 100)}%` }}
    />
  </div>

  {/* Mallas decorativas en verdes */}
  <div
    aria-hidden
    className="pointer-events-none absolute -left-1/4 -top-1/3 z-0 h-[60vh] w-[60vw] rounded-full
               bg-gradient-to-br from-emerald-600/25 via-green-500/20 to-teal-400/20 blur-3xl"
  />
  <div
    aria-hidden
    className="pointer-events-none absolute -right-1/3 -bottom-1/3 z-0 h-[60vh] w-[60vw] rounded-full
               bg-gradient-to-tr from-green-500/25 via-teal-400/20 to-cyan-400/20 blur-3xl"
  />

  {/* Slides */}
  <div
    ref={sliderRef}
    className="relative z-10 flex h-[60vh] w-full select-none md:h-[72vh]"
    style={{
      transform: translateX,
      transition: isDragging ? "none" : "transform 700ms cubic-bezier(0.22,0.61,0.36,1)",
    }}
  >
    {slides.map((s, i) => (
      <article key={s.id} className="relative h-full w-full shrink-0">
        {/* Capa imagen */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={s.image}
            alt={s.title || `slide-${i + 1}`}
            className="h-full w-full object-cover will-change-transform animate-kenburns motion-safe:opacity-100"
            draggable={false}
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
          />
          {/* Vignette/overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20" />
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_70%_90%,rgba(5,150,105,0.18),transparent)]" />{/* emerald-600 */}
        </div>

        {/* Texto */}
        <div className={`relative z-10 flex h-full w-full ${alignClass(s.align)}`}>
          <div className="container mx-auto grid h-full grid-cols-1 px-6 md:px-10">
            <div
              className={`mt-auto mb-16 max-w-3xl md:mb-24 ${
                s.align === "center" ? "mx-auto" : s.align === "right" ? "ml-auto" : ""
              }`}
            >
              {s.title && (
                <h2 className="text-3xl font-semibold tracking-tight text-white drop-shadow md:text-5xl">
                  <span className="inline-block bg-gradient-to-tr from-white via-white to-white bg-clip-text text-transparent">
                    {s.title}
                  </span>
                </h2>
              )}
              {s.subtitle && (
                <p className="mt-3 text-base leading-relaxed text-white/90 md:mt-4 md:text-lg">
                  {s.subtitle}
                </p>
              )}
              {s.cta && (
                <a
                  href={s.cta.href}
                  className="mt-6 inline-flex items-center gap-2 rounded-full
                             bg-gradient-to-tr from-emerald-700 via-green-600 to-emerald-500
                             px-5 py-2.5 text-sm font-medium text-white
                             shadow-lg ring-1 ring-emerald-300/20
                             transition focus:outline-none focus:ring-2 focus:ring-emerald-300/60 dark:focus:ring-emerald-700/60
                             hover:brightness-110 active:scale-[.98] md:text-base"
                >
                  {s.cta.label}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                       className="h-4 w-4" aria-hidden>
                    <path d="M13.5 4.5a.75.75 0 0 1 .75-.75h5.25a.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-1.5 0V6.31l-8.22 8.22a.75.75 0 1 1-1.06-1.06l8.22-8.22H14.25a.75.75 0 0 1-.75-.75Z" />
                    <path d="M3 6.75A2.75 2.75 0 0 1 5.75 4h5.5a.75.75 0 0 1 0 1.5h-5.5A1.25 1.25 0 0 0 4.5 6.75v10.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-5.5a.75.75 0 0 1 1.5 0v5.5A2.75 2.75 0 0 1 16.25 21h-10.5A2.75 2.75 0 0 1 3 18.25V6.75Z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    ))}
  </div>

  {/* Flechas */}
  <button
    aria-label="Anterior"
    onClick={prev}
    className="group absolute left-3 top-1/2 z-30 -translate-y-1/2 rounded-2xl bg-white/10 p-3 text-white
               ring-1 ring-white/30 backdrop-blur transition hover:bg-emerald-400/25
               focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd"
            d="M15.53 3.97a.75.75 0 0 1 0 1.06L9.56 11l5.97 5.97a.75.75 0 1 1-1.06 1.06l-6.5-6.5a.75.75 0 0 1 0-1.06l6.5-6.5a.75.75 0 0 1 1.06 0Z"
            clipRule="evenodd" />
    </svg>
  </button>
  <button
    aria-label="Siguiente"
    onClick={next}
    className="group absolute right-3 top-1/2 z-30 -translate-y-1/2 rounded-2xl bg-white/10 p-3 text-white
               ring-1 ring-white/30 backdrop-blur transition hover:bg-emerald-400/25
               focus:outline-none focus:ring-2 focus:ring-emerald-300/60"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path fillRule="evenodd"
            d="M8.47 3.97a.75.75 0 0 1 1.06 0l6.5 6.5a.75.75 0 0 1 0 1.06l-6.5 6.5a.75.75 0 1 1-1.06-1.06L14.44 12 8.47 6.03a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd" />
    </svg>
  </button>

  {/* Indicadores (píldoras) */}
  <div className="pointer-events-none absolute bottom-4 left-0 right-0 z-30 flex items-center justify-center gap-2">
    {slides.map((s, i) => (
      <button
        key={s.id}
        aria-label={`Ir al slide ${i + 1}`}
        aria-current={i === index}
        onClick={() => goTo(i)}
        className={[
          "pointer-events-auto h-2 w-6 rounded-full ring-1 ring-white/50 transition",
          i === index
            ? "scale-110 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-400"
            : "bg-white/30 hover:bg-white/60",
        ].join(" ")}
      />
    ))}
  </div>

  {/* Estilos extra */}
  <style>{`
    @keyframes kenburns { 0% { transform: scale(1.05); } 100% { transform: scale(1.12); } }
    .animate-kenburns { animation: kenburns 12s linear infinite alternate; }
    @media (prefers-reduced-motion: reduce) {
      .animate-kenburns { animation: none !important; }
    }
  `}</style>
</section>

  );
}
