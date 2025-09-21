import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Grid2X2,
  List,
  Search,
  ArrowUpDown,
  Tractor,
  Wrench,
  ShieldCheck,
  Truck,
  Star,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

/* =====================================
   Tipos
===================================== */
export type TipoProducto = "tractor" | "repuesto";

export type ProductoBase = {
  id: number;
  tipo: TipoProducto;
  nombre: string;
  imagen: string;
  marca?: string;
  nuevo?: boolean;
};

export type TractorItem = ProductoBase & {
  tipo: "tractor";
  hp: number;
  traccion: "4x4" | "4x2";
  compatibl: string;
};

export type RepuestoItem = ProductoBase & {
  tipo: "repuesto";
  codigo: string;
  compatibilidad: string[]; // modelos/series compatibles
  stock: number;
};

export type Producto = TractorItem | RepuestoItem;

/* =====================================
   Datos MOCK (reemplaza por tu API)
===================================== */
const DATA: Producto[] = [
  {
    "id": 1,
    "tipo": "repuesto",
    "codigo": "REP-001",
    "nombre": "Filtro de aire",
    "imagen": "https://www.mastropierrosa.com.ar/contenido/productos/original/1753220671.png",
    "marca": "Donaldson",
    "nuevo": true,
    "compatibilidad": ["tractores", "motosierras", "cultivadoras"],
    "stock": 120
  },
  {
    "id": 2,
    "tipo": "repuesto",
    "codigo": "REP-002",
    "nombre": "Pastillas de freno",
    "imagen": "https://www.mastropierrosa.com.ar/contenido/productos/original/1753220671.png",
    "marca": "Bosch",
    "nuevo": true,
    "compatibilidad": ["camiones", "tractores", "vehículos ligeros"],
    "stock": 85
  },
  {
    "id": 3,
    "tipo": "repuesto",
    "codigo": "REP-003",
    "nombre": "Filtro de aceite",
    "imagen": "https://www.mastropierrosa.com.ar/contenido/productos/original/1753220671.png",
    "marca": "Mann-Filter",
    "nuevo": true,
    "compatibilidad": ["tractores", "automóviles", "motos"],
    "stock": 200
  },
  {
    "id": 4,
    "tipo": "repuesto",
    "codigo": "REP-004",
    "nombre": "Bujía de encendido",
    "imagen": "https://www.mastropierrosa.com.ar/contenido/productos/original/1753220671.png",
    "marca": "NGK",
    "nuevo": true,
    "compatibilidad": ["automóviles", "motos", "generadores"],
    "stock": 500
  },
  {
    "id": 5,
    "tipo": "repuesto",
    "codigo": "REP-005",
    "nombre": "Amortiguador delantero",
    "imagen": "https://www.mastropierrosa.com.ar/contenido/productos/original/1753220671.png",
    "marca": "KYB",
    "nuevo": true,
    "compatibilidad": ["camiones", "tractores", "camionetas"],
    "stock": 40
  },
  {
    "id": 6,
    "tipo": "repuesto",
    "codigo": "REP-006",
    "nombre": "Bomba de agua",
    "imagen": "https://www.mastropierrosa.com.ar/contenido/productos/original/1753220671.png",
    "marca": "Gates",
    "nuevo": true,
    "compatibilidad": ["tractores", "vehículos agrícolas", "camiones"],
    "stock": 60
  },
  {
    "id": 7,
    "tipo": "repuesto",
    "codigo": "REP-007",
    "nombre": "Filtro de combustible",
    "imagen": "https://www.mastropierrosa.com.ar/contenido/productos/original/1753220671.png",
    "marca": "Mahle",
    "nuevo": true,
    "compatibilidad": ["tractores", "motores diésel agrícolas", "camiones"],
    "stock": 150
  } ]
;

/* =====================================
   Utilidades
===================================== */
const PEN = (v: number) => `S/ ${v.toLocaleString("es-PE")}`;

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" },
} as const;

/* =====================================
   Componentes reutilizables
===================================== */
function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`py-8 sm:py-10 ${className}`}>
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

function Chip({
  active,
  children,
  onClick,
  icon: Icon,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
}) {
  return (
    <button
      onClick={onClick}
      className={`min-h-10 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? "border-emerald-400 bg-emerald-50 text-emerald-700"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
      {children}
    </span>
  );
}

function Range({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-slate-600">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-600"
      />
      <span className="mt-0.5 block text-xs text-slate-500">{value}</span>
    </label>
  );
}

/* =====================================
   Tarjetas
===================================== */
function TractorCard({ p, view }: { p: TractorItem; view: "grid" | "list" }) {
  const list = view === "list";
  return (
    <motion.article
      {...fadeUp}
      className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl ${
        list ? "flex flex-col sm:flex-row" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden bg-slate-100 ${
          list ? "h-48 w-full flex-none sm:h-auto sm:w-56" : "aspect-[4/3]"
        }`}
      >
        <img
          src={p.imagen}
          alt={p.nombre}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          sizes="(min-width:1280px) 33vw, (min-width:640px) 50vw, 100vw"
        />
        {p.nuevo && (
          <div className="absolute left-3 top-3">
            <Pill>Nuevo</Pill>
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1 p-4 sm:p-5">
        <h3 className="truncate text-lg font-semibold text-slate-900">{p.nombre}</h3>
        <ul className="mt-2 flex flex-wrap gap-3 text-sm text-slate-600">
          <li className="inline-flex items-center gap-1">
            <Star className="h-4 w-4 text-emerald-600" /> {p.hp} HP
          </li>
          <li className="inline-flex items-center gap-1">
            <Truck className="h-4 w-4 text-emerald-600" /> {p.traccion}
          </li>
          <li className="inline-flex items-center gap-1">
            {/* <ShieldCheck className="h-4 w-4 text-emerald-600" /> {p.transmision} */}
          </li>
        </ul>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <a
            href={`https://wa.me/51981830008?text=Hola,%20quiero%20información%20sobre%20el:%20${encodeURIComponent(
              p.nombre
            )}`}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-green-600 px-4 py-2 text-sm font-medium text-white transition hover:from-emerald-800 hover:to-green-700"
          >
            Cotizar <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

function RepuestoCard({ p, view }: { p: RepuestoItem; view: "grid" | "list" }) {
  const list = view === "list";
  return (
    <motion.article
      {...fadeUp}
      className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl ${
        list ? "flex flex-col sm:flex-row" : ""
      }`}
    >
      <div
        className={`relative overflow-hidden bg-slate-100 ${
          list ? "h-48 w-full flex-none sm:h-auto sm:w-56" : "aspect-[4/3]"
        }`}
      >
        <img
          src={p.imagen}
          alt={p.nombre}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          sizes="(min-width:1280px) 33vw, (min-width:640px) 50vw, 100vw"
        />
      </div>
      <div className="min-w-0 flex-1 p-4 sm:p-5">
        <h3 className="truncate text-lg font-semibold text-slate-900">{p.nombre}</h3>
        <p className="text-sm text-slate-600">
          Código: <span className="font-medium text-slate-800">{p.codigo}</span>
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">
          Compatibilidad: {p.compatibilidad.join(", ")}
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase text-slate-500">Stock</p>
          </div>
          <a
            href={`https://wa.me/51981830008?text=Hola,%20quiero%20información%20sobre%20el:%20${encodeURIComponent(
              p.nombre
            )}`}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
          >
            Ver repuesto <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <p className="mt-2 text-xs text-slate-500">Stock: {p.stock}</p>
      </div>
    </motion.article>
  );
}

/* =====================================
   Página
===================================== */
export default function ProductosPage(): JSX.Element {
  const [q, setQ] = useState<string>("");
  const [tipo, setTipo] = useState<TipoProducto | "todos">("todos");
  const [marca, setMarca] = useState<string>("");
  const [precioMin, setPrecioMin] = useState<number>(0);
  const [precioMax, setPrecioMax] = useState<number>(150000);
  const [hpMin, setHpMin] = useState<number>(0);
  const [hpMax, setHpMax] = useState<number>(250);
  const [traccion, setTraccion] = useState<"4x4" | "4x2" | "">("");
  const [soloStock, setSoloStock] = useState<boolean>(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  const marcasDisponibles = useMemo(
    () => Array.from(new Set(DATA.map((d) => d.marca).filter(Boolean))) as string[],
    []
  );

  const filtrados = useMemo(() => {
    const text = q.trim().toLowerCase();
    let arr = DATA.filter((p) => {
      if (tipo !== "todos" && p.tipo !== tipo) return false;
      if (marca && p.marca !== marca) return false;
      const t = `${p.nombre} ${p.marca ?? ""}`.toLowerCase();
      const matchText = text === "" || t.includes(text);
      if (!matchText) return false;

      if (p.tipo === "tractor") {
        if (p.hp < hpMin || p.hp > hpMax) return false;
        if (traccion && p.traccion !== traccion) return false;
      }
      if (p.tipo === "repuesto") {
        if (soloStock && p.stock <= 0) return false;
      }
      return true;
    });

    return arr;
  }, [q, tipo, marca, precioMin, precioMax, hpMin, hpMax, traccion, soloStock]);

  const [page, setPage] = useState<number>(1);
  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(filtrados.length / pageSize));
  const pageItems = useMemo(
    () => filtrados.slice((page - 1) * pageSize, page * pageSize),
    [filtrados, page]
  );

  return (
    <main className="bg-white">
      <Section>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-emerald-900 sm:text-3xl">Repuestos</h1>
            <p className="text-slate-600">Los repuestos garantizan el funcionamiento óptimo y prolongan la vida útil de la maquinaria agrícola.</p>
            <div className="mt-3 h-1 w-28 rounded-full bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-700" />
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1">
              <button
                onClick={() => setView("grid")}
                className={`rounded-xl p-2 ${
                  view === "grid" ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100"
                }`}
                aria-label="Vista en cuadrícula"
              >
                <Grid2X2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`rounded-xl p-2 ${
                  view === "list" ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100"
                }`}
                aria-label="Vista en lista"
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative w-full max-w-xl">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Busca por nombre o marca…"
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Chip active={tipo === "todos"} onClick={() => setTipo("todos")} icon={Grid2X2}>
                  Todos
                </Chip>
                <Chip active={tipo === "tractor"} onClick={() => setTipo("tractor")} icon={Tractor}>
                  Tractores
                </Chip>
                <Chip active={tipo === "repuesto"} onClick={() => setTipo("repuesto")} icon={Wrench}>
                  Repuestos
                </Chip>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="rounded-full bg-slate-100 px-2.5 py-1">{filtrados.length} resultados</span>
              {tipo !== "todos" && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">{tipo}</span>
              )}
              {marca && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">Marca: {marca}</span>
              )}
              {(precioMin > 0 || precioMax < 150000) && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                  Precio: {PEN(precioMin)} - {PEN(precioMax)}
                </span>
              )}
              {tipo !== "repuesto" && (hpMin > 0 || hpMax < 250) && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                  HP: {hpMin}-{hpMax}
                </span>
              )}
              {traccion && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">{traccion}</span>
              )}
              {soloStock && (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">Solo stock</span>
              )}
              {(q ||
                tipo !== "todos" ||
                marca ||
                precioMin > 0 ||
                precioMax < 150000 ||
                hpMin > 0 ||
                hpMax < 250 ||
                traccion ||
                soloStock) && (
                <button
                  onClick={() => {
                    setQ("");
                    setTipo("todos");
                    setMarca("");
                    setPrecioMin(0);
                    setPrecioMax(150000);
                    setHpMin(0);
                    setHpMax(250);
                    setTraccion("");
                    setSoloStock(false);
                    setPage(1);
                  }}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-50"
                >
                  Limpiar todo
                </button>
              )}
            </div>

            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                  : "grid grid-cols-1 gap-4"
              }
            >
              {pageItems.map((p) =>
                p.tipo === "tractor" ? (
                  <TractorCard key={p.id} p={p} view={view} />
                ) : (
                  <RepuestoCard key={p.id} p={p} view={view} />
                )
              )}
            </div>

            {pageItems.length === 0 && (
              <div className="rounded-2xl border border-dashed border-emerald-300 p-10 text-center text-slate-500">
                No encontramos resultados con esos filtros.
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="min-h-10 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 disabled:opacity-50"
                disabled={page === 1}
              >
                Anterior
              </button>
              <span className="text-sm text-slate-600">
                Página {page} de {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="min-h-10 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 disabled:opacity-50"
                disabled={page === totalPages}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </Section>
    </main>
  );
}
