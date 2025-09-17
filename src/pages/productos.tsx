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
  precio: number; // PEN
  marca?: string;
  nuevo?: boolean;
};

export type TractorItem = ProductoBase & {
  tipo: "tractor";
  hp: number;
  traccion: "4x4" | "4x2";
  transmision: string;
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
  // Tractores
  {
    id: 1,
    tipo: "tractor",
    nombre: "Tractor Serie X45",
    imagen:
      "https://images.unsplash.com/photo-1568890350424-6f14a07b56d3?q=80&w=1600&auto=format&fit=crop",
    precio: 79990,
    marca: "Agromax",
    nuevo: true,
    hp: 90,
    traccion: "4x4",
    transmision: "Powershift",
  },
  {
    id: 2,
    tipo: "tractor",
    nombre: "Tractor Serie M70",
    imagen:
      "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1600&auto=format&fit=crop",
    precio: 95990,
    marca: "Farmtech",
    hp: 110,
    traccion: "4x4",
    transmision: "Synchro",
  },
  {
    id: 3,
    tipo: "tractor",
    nombre: "Tractor Serie R20",
    imagen:
      "https://images.unsplash.com/photo-1627586696628-1d7f6da1d9a9?q=80&w=1600&auto=format&fit=crop",
    precio: 58990,
    marca: "Terra",
    hp: 75,
    traccion: "4x2",
    transmision: "Manual",
  },
  {
    id: 4,
    tipo: "tractor",
    nombre: "Tractor Serie T120",
    imagen:
      "https://images.unsplash.com/photo-1592982537447-334c57d5dc70?q=80&w=1600&auto=format&fit=crop",
    precio: 124990,
    marca: "Agromax",
    nuevo: true,
    hp: 150,
    traccion: "4x4",
    transmision: "CVT",
  },
  // Repuestos
  {
    id: 101,
    tipo: "repuesto",
    nombre: "Filtro de aceite HeavyDuty",
    imagen:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=1600&auto=format&fit=crop",
    precio: 190,
    marca: "Hydro",
    codigo: "FD-8921",
    compatibilidad: ["Serie X45", "Serie R20"],
    stock: 24,
  },
  {
    id: 102,
    tipo: "repuesto",
    nombre: "Bomba hidráulica 2200 PSI",
    imagen:
      "https://images.unsplash.com/photo-1518306727298-4c12e94e28a3?q=80&w=1600&auto=format&fit=crop",
    precio: 1450,
    marca: "Hydro",
    codigo: "BH-2200",
    compatibilidad: ["Serie M70", "Serie T120"],
    stock: 8,
  },
  {
    id: 103,
    tipo: "repuesto",
    nombre: "Correa dentada premium",
    imagen:
      "https://images.unsplash.com/photo-1626760078989-9cbf25eeec78?q=80&w=1600&auto=format&fit=crop",
    precio: 95,
    marca: "Power",
    codigo: "CD-5567",
    compatibilidad: ["Serie X45", "Serie M70", "Serie R20"],
    stock: 46,
  },
  {
    id: 104,
    tipo: "repuesto",
    nombre: "Filtro de aire ciclónico",
    imagen:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1600&auto=format&fit=crop",
    precio: 220,
    marca: "Power",
    codigo: "FA-7710",
    compatibilidad: ["Serie T120"],
    stock: 13,
  },
];

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

function Chip({ active, children, onClick, icon: Icon }: { active?: boolean; children: ReactNode; onClick?: () => void; icon?: LucideIcon }) {
  return (
    <button
      onClick={onClick}
      className={`min-h-10 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
        active
          ? "border-orange-400 bg-orange-50 text-orange-700"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">{children}</span>;
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
        className="w-full accent-orange-600"
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
          <li className="inline-flex items-center gap-1"><Star className="h-4 w-4 text-orange-600" /> {p.hp} HP</li>
          <li className="inline-flex items-center gap-1"><Truck className="h-4 w-4 text-orange-600" /> {p.traccion}</li>
          <li className="inline-flex items-center gap-1"><ShieldCheck className="h-4 w-4 text-orange-600" /> {p.transmision}</li>
        </ul>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase text-slate-500">Desde</p>
            <p className="text-lg font-extrabold text-red-700">{PEN(p.precio)}</p>
          </div>
          <a
            href={`/cotizar?producto=${p.id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:from-red-700 hover:to-orange-600"
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
            <p className="text-xs uppercase text-slate-500">Precio</p>
            <p className="text-lg font-extrabold text-red-700">{PEN(p.precio)}</p>
          </div>
          <a
            href={`/repuestos/${p.id}`}
            className="inline-flex items-center gap-2 rounded-xl border border-orange-300 bg-white px-4 py-2 text-sm font-medium text-orange-700 transition hover:bg-orange-50"
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
   Panel de Filtros (siempre visible)
   - En móvil: tarjeta completa por encima de resultados
   - En desktop: columna sticky a la izquierda
===================================== */
function FiltersPanel({
  tipo,
  setTipo,
  marca,
  setMarca,
  precioMin,
  setPrecioMin,
  precioMax,
  setPrecioMax,
  hpMin,
  setHpMin,
  hpMax,
  setHpMax,
  traccion,
  setTraccion,
  soloStock,
  setSoloStock,
  marcasDisponibles,
}: {
  tipo: TipoProducto | "todos";
  setTipo: (t: TipoProducto | "todos") => void;
  marca: string;
  setMarca: (m: string) => void;
  precioMin: number;
  setPrecioMin: (n: number) => void;
  precioMax: number;
  setPrecioMax: (n: number) => void;
  hpMin: number;
  setHpMin: (n: number) => void;
  hpMax: number;
  setHpMax: (n: number) => void;
  traccion: "4x4" | "4x2" | "";
  setTraccion: (t: "4x4" | "4x2" | "") => void;
  soloStock: boolean;
  setSoloStock: (v: boolean) => void;
  marcasDisponibles: string[];
}) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
      <h3 className="text-lg font-bold text-slate-900">Filtros</h3>

      {/* Tipo */}
      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-slate-600">Tipo</p>
        <div className="flex flex-wrap gap-2">
          <Chip active={tipo === "todos"} onClick={() => setTipo("todos")} icon={Grid2X2}>Todos</Chip>
          <Chip active={tipo === "tractor"} onClick={() => setTipo("tractor")} icon={Tractor}>Tractores</Chip>
          <Chip active={tipo === "repuesto"} onClick={() => setTipo("repuesto")} icon={Wrench}>Repuestos</Chip>
        </div>
      </div>

      {/* Marca */}
      <div className="mt-5">
        <label className="mb-2 block text-xs font-medium text-slate-600">Marca</label>
        <select
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/10"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
        >
          <option value="">Todas</option>
          {marcasDisponibles.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Precio */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-medium text-slate-600">Precio</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Range label="Mín." min={0} max={150000} step={500} value={precioMin} onChange={setPrecioMin} />
          <Range label="Máx." min={0} max={150000} step={500} value={precioMax} onChange={setPrecioMax} />
        </div>
        <p className="mt-1 text-xs text-slate-500">
          {PEN(precioMin)} - {PEN(precioMax)}
        </p>
      </div>

      {/* Solo tractores: HP / Tracción */}
      <div className="mt-5">
        <p className="mb-2 text-xs font-medium text-slate-600">Potencia (HP) — solo tractores</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Range label="Mín." min={0} max={250} step={5} value={hpMin} onChange={setHpMin} />
          <Range label="Máx." min={0} max={250} step={5} value={hpMax} onChange={setHpMax} />
        </div>
        <p className="mt-1 text-xs text-slate-500">{hpMin} - {hpMax} HP</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Chip active={traccion === "4x4"} onClick={() => setTraccion(traccion === "4x4" ? "" : "4x4")} icon={Truck}>4x4</Chip>
          <Chip active={traccion === "4x2"} onClick={() => setTraccion(traccion === "4x2" ? "" : "4x2")} icon={Truck}>4x2</Chip>
        </div>
      </div>


      <div className="mt-5">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" className="h-4 w-4 accent-orange-600" checked={soloStock} onChange={(e) => setSoloStock(e.target.checked)} />
          Solo repuestos con stock
        </label>
      </div>
    </aside>
  );
}

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
  const [sort, setSort] = useState<"relevancia" | "precio_asc" | "precio_desc">("relevancia");
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
      if (p.precio < precioMin || p.precio > precioMax) return false;
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

    if (sort === "precio_asc") arr = arr.sort((a, b) => a.precio - b.precio);
    if (sort === "precio_desc") arr = arr.sort((a, b) => b.precio - a.precio);

    return arr;
  }, [q, tipo, marca, precioMin, precioMax, hpMin, hpMax, traccion, soloStock, sort]);


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
            <h1 className="text-2xl font-black tracking-tight text-red-800 sm:text-3xl">Productos</h1>
            <p className="text-slate-600">Tractores y repuestos con soporte técnico en todo el Perú.</p>
            <div className="mt-3 h-1 w-28 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="appearance-none rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/10"
              >
                <option value="relevancia">Relevancia</option>
                <option value="precio_asc">Precio: menor a mayor</option>
                <option value="precio_desc">Precio: mayor a menor</option>
              </select>
              <ArrowUpDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <div className="inline-flex items-center gap-1">
              <button
                onClick={() => setView("grid")}
                className={`rounded-xl p-2 ${view === "grid" ? "bg-orange-50 text-orange-700" : "text-slate-600 hover:bg-slate-100"}`}
                aria-label="Vista en cuadrícula"
              >
                <Grid2X2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`rounded-xl p-2 ${view === "list" ? "bg-orange-50 text-orange-700" : "text-slate-600 hover:bg-slate-100"}`}
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
                  className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/10"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Chip active={tipo === "todos"} onClick={() => setTipo("todos")} icon={Grid2X2}>Todos</Chip>
                <Chip active={tipo === "tractor"} onClick={() => setTipo("tractor")} icon={Tractor}>Tractores</Chip>
                <Chip active={tipo === "repuesto"} onClick={() => setTipo("repuesto")} icon={Wrench}>Repuestos</Chip>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,320px),1fr]">
          <FiltersPanel
            tipo={tipo}
            setTipo={setTipo}
            marca={marca}
            setMarca={setMarca}
            precioMin={precioMin}
            setPrecioMin={setPrecioMin}
            precioMax={precioMax}
            setPrecioMax={setPrecioMax}
            hpMin={hpMin}
            setHpMin={setHpMin}
            hpMax={hpMax}
            setHpMax={setHpMax}
            traccion={traccion}
            setTraccion={setTraccion}
            soloStock={soloStock}
            setSoloStock={setSoloStock}
            marcasDisponibles={marcasDisponibles}
          />

          <div>

            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="rounded-full bg-slate-100 px-2.5 py-1">{filtrados.length} resultados</span>
              {tipo !== "todos" && (
                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-orange-700">{tipo}</span>
              )}
              {marca && (
                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-orange-700">Marca: {marca}</span>
              )}
              {(precioMin > 0 || precioMax < 150000) && (
                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-orange-700">
                  Precio: {PEN(precioMin)} - {PEN(precioMax)}
                </span>
              )}
              {tipo !== "repuesto" && (hpMin > 0 || hpMax < 250) && (
                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-orange-700">HP: {hpMin}-{hpMax}</span>
              )}
              {traccion && (
                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-orange-700">{traccion}</span>
              )}
              {soloStock && (
                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-orange-700">Solo stock</span>
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
              <div className="rounded-2xl border border-dashed border-orange-300 p-10 text-center text-slate-500">
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
