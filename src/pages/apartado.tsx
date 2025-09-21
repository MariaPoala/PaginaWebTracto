import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Tractor,
  Wrench,
  Headset,
  MapPin,
  ShieldCheck,
  Clock,
  Truck,
  ArrowRight,
  Star,
  Search,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { ARADOS } from "../data/arados.tsx";
import { AradoItem } from "./productos";
import { REPUESTOS } from "../data/repuestos.tsx";
import { RepuestoItem } from "./productos";

type TractorItem = {
  id: number;
  nombre: string;
  imagen: string;
  hp: number;
  traccion: "4x4" | "4x2";
  transmision: "Powershift" | "Synchro" | "Manual" | "CVT" | string;
  precio: number;
  nuevo?: boolean;
};

// type RepuestoItem = {
//   id: number;
//   imagen: string,
//   nombre: string;
//   codigo: string;
//   compatibilidad: string[];
// };

const TRACTORES: TractorItem[] = [
  {
    id: 1,
    nombre: "Tractor Serie X45",
    imagen:
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1600&auto=format&fit=crop",
    hp: 90,
    traccion: "4x4",
    transmision: "Powershift",
    precio: 79990,
    nuevo: true,
  },
  {
    id: 2,
    nombre: "Tractor Serie M70",
    imagen:
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1600&auto=format&fit=crop",
    hp: 110,
    traccion: "4x4",
    transmision: "Synchro",
    precio: 95990,
  },
  {
    id: 3,
    nombre: "Tractor Serie R20",
    imagen:
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1600&auto=format&fit=crop",
    hp: 75,
    traccion: "4x2",
    transmision: "Manual",
    precio: 58990,
  },
  {
    id: 4,
    nombre: "Tractor Serie T120",
    imagen:
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1600&auto=format&fit=crop",
    hp: 150,
    traccion: "4x4",
    transmision: "CVT",
    precio: 124990,
    nuevo: true,
  },
];

// const REPUESTOS: RepuestoItem[] = [
//   {
//     id: 1,
//     imagen: "https://modasa.pe/media/catalog/product/cache/00a894dfee62c148f81c61d3aaacbf72/r/5/r50offl0014.png",
//     nombre: "Filtro de aceite HeavyDuty",
//     codigo: "FD-8921",
//     compatibilidad: ["Serie X45", "Serie R20"],
//   },
//   {
//     id: 2,
//     imagen: "https://modasa.pe/media/catalog/product/cache/00a894dfee62c148f81c61d3aaacbf72/r/5/r50offl0014.png",
//     nombre: "Bomba hidráulica 2200 PSI",
//     codigo: "BH-2200",
//     compatibilidad: ["Serie M70", "Serie T120"],
//   },
//   {
//     id: 3,
//     imagen: "https://modasa.pe/media/catalog/product/cache/00a894dfee62c148f81c61d3aaacbf72/r/5/r50offl0014.png",
//     nombre: "Correa dentada premium",
//     codigo: "CD-5567",
//     compatibilidad: ["Serie X45", "Serie M70", "Serie R20"],
//   },
//   {
//     id: 4,
//     imagen: "https://modasa.pe/media/catalog/product/cache/00a894dfee62c148f81c61d3aaacbf72/r/5/r50offl0014.png",
//     nombre: "Filtro de aire ciclónico",
//     codigo: "FA-7710",
//     compatibilidad: ["Serie T120"],
//   },
//   {
//     id: 5,
//     imagen: "https://modasa.pe/media/catalog/product/cache/00a894dfee62c148f81c61d3aaacbf72/r/5/r50offl0014.png",
//     nombre: "Correa dentada premium",
//     codigo: "CD-5567",
//     compatibilidad: ["Serie X45", "Serie M70", "Serie R20"],
//   },
//   {
//     id: 6,
//     imagen: "https://modasa.pe/media/catalog/product/cache/00a894dfee62c148f81c61d3aaacbf72/r/5/r50offl0014.png",
//     nombre: "Filtro de aire ciclónico",
//     codigo: "FA-7710",
//     compatibilidad: ["Serie T120"],
//   },
// ];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut" },
} as const;

type SectionProps = { children: ReactNode; className?: string };
function Section({ children, className = "" }: SectionProps) {
  return (
    <section className={`py-12 sm:py-16 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

function AccentTitle({
  children,
  subtitle,
}: {
  children: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-extrabold tracking-tight text-emerald-900 sm:text-3xl">
        {children}
      </h2>
      {subtitle && <p className="mt-1 text-slate-500">{subtitle}</p>}
      <div className="mt-3 h-1 w-28 rounded-full bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-700" />
    </div>
  );
}

function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${className}`}
    >
      {children}
    </span>
  );
}

type StatProps = { icon: LucideIcon; label: string; value: string | number };
function Stat({ icon: Icon, label, value }: StatProps) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-sm text-emerald-700">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className="text-2xl font-semibold text-emerald-900">{value}</div>
    </div>
  );
}

function CardGlow({ children }: { children: ReactNode }) {
  return (
    <div className="group relative">
      {/* halo suave verde */}
      <div className="pointer-events-none absolute inset-0 -z-[1] rounded-2xl bg-gradient-to-r from-emerald-500/0 via-emerald-400/15 to-emerald-500/0 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
      {children}
    </div>
  );
}

function GradientButton({
  children,
  href,
  className = "",
}: {
  children: ReactNode;
  href?: string;
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:from-emerald-800 hover:to-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400";
  if (href) {
    return (
      <a href={href} className={`${base} ${className}`}>
        {children}
      </a>
    );
  }
  return <button className={`${base} ${className}`}>{children}</button>;
}



function ProductCardArado({ t }: { t: AradoItem }) {
  return (
    <CardGlow>
      <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl">
        {/* Imagen */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={t.imagen}
            alt={t.nombre}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {t.nuevo && (
            <div className="absolute left-3 top-3">
              <Badge className="bg-emerald-100 text-emerald-700 ring-emerald-200">
                Nuevo
              </Badge>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="space-y-3 p-4">
          {/* Nombre */}
          <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">
            {t.nombre}
          </h3>

          {/* Marca y código */}
          <p className="text-sm text-slate-600">
            <span className="font-medium text-emerald-700">{t.marca}</span> ·{" "}
            Código: {t.codigo}
          </p>

          {/* Stock
          <p className="text-sm text-slate-600">
            Stock disponible: <span className="font-medium">{t.stock}</span>
          </p> */}

          {/* Botón cotizar */}
          <div className="flex items-center justify-between">
            <GradientButton
              href={`https://wa.me/51981830008?text=Hola,%20quiero%20información%20sobre%20el%20insumo:%20${encodeURIComponent(
                t.nombre
              )}`}
            >
              Cotizar <ArrowRight className="h-4 w-4" />
            </GradientButton>
          </div>
        </div>
      </article>
    </CardGlow>
  );
}
function ProductCardRepuestos({ t }: { t: RepuestoItem }) {
  return (
    <CardGlow>
      <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl">
        {/* Imagen */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={t.imagen}
            alt={t.nombre}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {t.nuevo && (
            <div className="absolute left-3 top-3">
              <Badge className="bg-emerald-100 text-emerald-700 ring-emerald-200">
                Nuevo
              </Badge>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="space-y-3 p-4">
          {/* Nombre */}
          <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">
            {t.nombre}
          </h3>

          {/* Marca y código */}
          <p className="text-sm text-slate-600">
            <span className="font-medium text-emerald-700">{t.marca}</span> ·{" "}
            Código: {t.codigo}
          </p>

          {/* Stock
          <p className="text-sm text-slate-600">
            Stock disponible: <span className="font-medium">{t.stock}</span>
          </p> */}

          {/* Botón cotizar */}
          <div className="flex items-center justify-between">
            <GradientButton
              href={`https://wa.me/51981830008?text=Hola,%20quiero%20información%20sobre%20el%20insumo:%20${encodeURIComponent(
                t.nombre
              )}`}
            >
              Cotizar <ArrowRight className="h-4 w-4" />
            </GradientButton>
          </div>
        </div>
      </article>
    </CardGlow>
  );
}
function PartCard({ p }: { p: RepuestoItem }) {
  return (
    <CardGlow>
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl">
        <img
          src={p.imagen}
          alt={p.nombre}
          className="mb-3 h-40 w-full rounded-xl object-cover"
        />
        <div className="mb-2 flex items-center justify-between">
          <h4 className="line-clamp-1 font-semibold text-slate-900">
            {p.nombre}
          </h4>
          <Badge className="bg-emerald-50 text-emerald-700 ring-emerald-200">
            {p.codigo}
          </Badge>
        </div>
        <p className="text-sm text-slate-600">
          Compatibilidad: {p.compatibilidad.join(", ")}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <a
            href={`https://wa.me/51981830008?text=Hola,%20quiero%20información%20sobre%20el:%20${encodeURIComponent(p.nombre)}`}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            Cotizar <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </article>
    </CardGlow>
  );
}

export default function HomeModules(): JSX.Element {
  const [q, setQ] = useState<string>("");
  const [compat, setCompat] = useState<string>("");

  const filtrados = useMemo<RepuestoItem[]>(
    () =>
      REPUESTOS.filter((r) => {
        const hayQ =
          q === "" ||
          (r.nombre + r.codigo + r.compatibilidad.join(" "))
            .toLowerCase()
            .includes(q.toLowerCase());
        const hayC = compat === "" || r.compatibilidad.includes(compat);
        return hayQ && hayC;
      }),
    [q, compat]
  );

  const compatOptions = useMemo<string[]>(() => {
    const s = new Set<string>();
    REPUESTOS.forEach((r) => r.compatibilidad.forEach((m) => s.add(m)));
    return Array.from(s);
  }, []);

  return (
    <main className="bg-white">
      <Section>
        <motion.div {...fadeUp} className="mb-4 flex items-center gap-3">
          <span className="text-sm text-emerald-600">
            Productos agricolas · Servicio técnico
          </span>
        </motion.div>

        <motion.h2
          {...fadeUp}
          className="mb-3 max-w-3xl text-3xl font-black tracking-tight text-emerald-900 sm:text-4xl"
        >
          Soluciones integrales en maquinaria agrícola y soporte técnico a todo
          el Perú
        </motion.h2>
        <div className="mb-8 h-1 w-36 rounded-full bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-700" />

        <motion.div
          {...fadeUp}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <a
            href="/productos"
            className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition group-hover:scale-105">
              <Tractor className="h-6 w-6" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-slate-900">
              Venta de Tractores
            </h3>
            <p className="mb-4 text-slate-600">
              Modelos 45–220 HP para campo y obra.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition group-hover:gap-2.5">
              Ver catálogo <ArrowRight className="h-4 w-4" />
            </span>

            {/* halo */}
            <div className="pointer-events-none absolute inset-0 -z-[1] rounded-2xl bg-gradient-to-r from-emerald-500/0 via-green-400/15 to-emerald-500/0 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
          </a>

          <a
            href="/productos"
            className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition group-hover:scale-105">
              <Wrench className="h-6 w-6" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-slate-900">
              Repuestos
            </h3>
            <p className="mb-4 text-slate-600">
              Originales y alternativos, envíos nacionales.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition group-hover:gap-2.5">
              Buscar repuesto <ArrowRight className="h-4 w-4" />
            </span>
            <div className="pointer-events-none absolute inset-0 -z-[1] rounded-2xl bg-gradient-to-r from-emerald-500/0 via-green-400/15 to-emerald-500/0 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
          </a>

          <a
            href="/servicios"
            className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition group-hover:scale-105">
              <Headset className="h-6 w-6" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-slate-900">
              Servicio Técnico
            </h3>
            <p className="mb-4 text-slate-600">Atención en campo 24/7.</p>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 transition group-hover:gap-2.5">
              Solicitar atención <ArrowRight className="h-4 w-4" />
            </span>
            <div className="pointer-events-none absolute inset-0 -z-[1] rounded-2xl bg-gradient-to-r from-emerald-500/0 via-green-400/15 to-emerald-500/0 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
          </a>
        </motion.div>
      </Section>

      <Section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <AccentTitle subtitle="Rendimiento, potencia y respaldo postventa.">
            Arados
          </AccentTitle>
          <GradientButton href="/arados">
            Ver todos <ArrowRight className="h-4 w-4" />
          </GradientButton>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ARADOS.slice(0, 4).map((arado) => (
            <ProductCardArado key={arado.id} t={arado} />
          ))}
        </div>
      </Section>

      <Section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <AccentTitle subtitle="Encuentra el repuesto compatible con tu modelo.">
            Repuestos
          </AccentTitle>
          <a
            href="/repuestos"
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            Ver catálogo <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.slice(0, 3).map((p) => (
            <motion.div key={p.id} {...fadeUp}>
              <PartCard p={p} />
            </motion.div>
          ))}
          {filtrados.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-emerald-300 p-10 text-center text-slate-500">
              No encontramos resultados con esos filtros.
            </div>
          )}
        </div>
      </Section>

      <Section>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div>
            <Badge className="bg-emerald-50 text-emerald-700 ring-emerald-200">
              Servicio técnico nacional
            </Badge>
            <h3 className="mt-4 text-2xl font-extrabold text-emerald-900 sm:text-3xl">
              Mantenimiento y soporte en campo,{" "}
              <span className="text-emerald-600">a todo el Perú</span>
            </h3>
            <p className="mt-3 text-slate-600">
              Nuestro equipo de técnicos especializados atiende en sitio con
              repuestos disponibles y diagnóstico rápido para reducir tus
              tiempos de paro.
            </p>

            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <li className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <Clock className="mt-1 h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-900">Atención 24/7</p>
                  <p className="text-sm text-slate-600">
                    Respuesta prioritaria y diagnóstico ágil.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <Truck className="mt-1 h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-900">
                    Cobertura nacional
                  </p>
                  <p className="text-sm text-slate-600">
                    Llegamos a zonas rurales y de difícil acceso.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <Wrench className="mt-1 h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-900">Taller móvil</p>
                  <p className="text-sm text-slate-600">
                    Herramientas y repuestos en la primera visita.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                <ShieldCheck className="mt-1 h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-emerald-900">Garantía</p>
                  <p className="text-sm text-slate-600">
                    Trabajo certificado y repuestos garantizados.
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <GradientButton>
                Solicitar atención <ArrowRight className="h-4 w-4" />
              </GradientButton>
              <a
                href="https://wa.me/51981830008?text=Hola,%20quiero%20realizar%20mantenimiento%20"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-800 transition hover:border-emerald-400 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                WhatsApp técnico
              </a>
              <a
                href="https://wa.me/51981830008?text=Hola,%20quiero%20realizar%20mantenimiento%20"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-800 transition hover:border-emerald-400 hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                WhatsApp técnico
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-emerald-100 bg-slate-100 shadow-sm">
              <img
                src="https://www.repository.dealerwebmanager.com/sites/repository.dealerwebmanager.com/files/2018-02/JD_Compromiso_1170x478px.jpg"
                alt="Servicio técnico en campo"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                loading="lazy"
              />
            </div>
            <div className="pointer-events-none absolute -bottom-4 -right-4 hidden rounded-2xl bg-emerald-600/90 px-4 py-3 text-white shadow-lg lg:block">
              <p className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" /> Llegamos a tu campo
              </p>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
