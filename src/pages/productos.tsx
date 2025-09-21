import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Grid2X2, List, Search, ArrowRight, Tractor, Wrench, type LucideIcon } from "lucide-react";

/* =====================================
   Tipos
===================================== */
export type TipoProducto = "tractor" | "repuesto" | "arado" | "rastra" | "surcadora" | "insumo";

export interface ProductoBase {
  id: number;
  tipo: TipoProducto;
  nombre: string;
  imagen: string;
  marca?: string;
  nuevo?: boolean;
}

export interface TractorItem extends ProductoBase {
  tipo: "tractor";
  hp: number;
  traccion: "4x4" | "4x2";
  transmision: string;
}

export interface RepuestoItem extends ProductoBase {
  tipo: "repuesto";
  codigo: string;
  compatibilidad: string[];
  stock: number;
}

export interface AradoItem extends ProductoBase {
  tipo: "arado";
  codigo: string;
  compatibilidad: string[];
  stock: number;
}
export interface InsumoItem extends ProductoBase {
  tipo: "insumo";
  codigo: string;
  compatibilidad: string[];
  stock: number;
}

export interface RastraItem extends ProductoBase {
  tipo: "rastra";
  codigo: string;
  compatibilidad: string[];
  stock: number;
}

export interface SurcadoraItem extends ProductoBase {
  tipo: "surcadora";
  codigo: string;
  compatibilidad: string[];
  stock: number;
}



export type Producto = TractorItem | RepuestoItem | ProductoBase | AradoItem| InsumoItem| RastraItem| SurcadoraItem;


/* =====================================
   Props para la página reutilizable
===================================== */
type ProductosPageProps = {
  titulo: string;
  descripcion: string;
  data: Producto[];
  tipoFiltro?: TipoProducto;
};

export default function Productos({ titulo, descripcion, data, tipoFiltro }: ProductosPageProps) {
  const [q, setQ] = useState<string>("");
  const [view, setView] = useState<"grid" | "list">("grid");

  const filtrados = useMemo(() => {
    const text = q.trim().toLowerCase();
    return data.filter((p) => {
      if (tipoFiltro && p.tipo !== tipoFiltro) return false;
      const t = `${p.nombre} ${p.marca ?? ""}`.toLowerCase();
      return text === "" || t.includes(text);
    });
  }, [q, data, tipoFiltro]);

  return (
    <main className="bg-white">
      <section className="py-8 sm:py-10">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          {/* Encabezado */}
          <div className="mb-6">
            <h1 className="text-2xl font-black tracking-tight text-emerald-900 sm:text-3xl">{titulo}</h1>
            <p className="text-slate-600">{descripcion}</p>
            <div className="mt-3 h-1 w-28 rounded-full bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-700" />
          </div>

          {/* Barra de búsqueda */}
          <div className="mb-6 flex items-center gap-2">
            <div className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Busca por nombre o marca…"
                className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/10"
              />
            </div>
            {/* <div className="inline-flex items-center gap-1">
              <button
                onClick={() => setView("grid")}
                className={`rounded-xl p-2 ${view === "grid" ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100"}`}
              >
                <Grid2X2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`rounded-xl p-2 ${view === "list" ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100"}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div> */}
          </div>

          {/* Resultados */}
          <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "grid grid-cols-1 gap-4"}>
            {filtrados.map((p) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-xl p-4"
              >
                <img src={p.imagen} alt={p.nombre} className="mb-3 w-full rounded-lg object-cover aspect-[4/3]" />
                <h3 className="truncate text-lg font-semibold text-slate-900">{p.nombre}</h3>
                <p className="text-sm text-slate-600">{p.marca ?? "Sin marca"}</p>
                <a
                  href={`https://wa.me/51981830008?text=Hola,%20quiero%20información%20sobre:%20${encodeURIComponent(p.nombre)}`}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-green-600 px-4 py-2 text-sm font-medium text-white transition hover:from-emerald-800 hover:to-green-700"
                >
                  Cotizar <ArrowRight className="h-4 w-4" />
                </a>
              </motion.article>
            ))}
          </div>

          {filtrados.length === 0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-emerald-300 p-10 text-center text-slate-500">
              No encontramos resultados con esos filtros.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
