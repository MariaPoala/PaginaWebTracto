import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Wrench,
  ShieldCheck,
  Clock,
  Truck,
  Headphones,
  Cog,
  Cpu,
  CheckCircle2,
  MapPin,
  ArrowRight,
  Phone,
  MessageCircle,
  BadgeCheck,
} from "lucide-react";

/* =========================
   Helpers
========================= */
const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" },
  viewport: { once: true, margin: "-80px" },
} as const;

function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`py-10 sm:py-14 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200 ${className}`}>
      <BadgeCheck className="h-4 w-4" /> {children}
    </span>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-orange-100 text-orange-600">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="text-lg font-extrabold text-red-800">{value}</p>
      </div>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, desc, bullets }: { icon: any; title: string; desc: string; bullets?: string[] }) {
  return (
    <motion.div {...fadeUp} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-1 text-slate-600">{desc}</p>
      {bullets && bullets.length > 0 && (
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="mt-0.5 h-4 w-4 text-orange-600" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

function PlanCard({ name, price, features, highlight = false }: { name: string; price: string; features: string[]; highlight?: boolean }) {
  return (
    <motion.div
      {...fadeUp}
      className={`relative rounded-2xl border p-6 shadow-sm ${
        highlight
          ? "border-orange-300 bg-gradient-to-b from-orange-50 to-white"
          : "border-slate-200 bg-white"
      }`}
    >
      {highlight && (
        <div className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow">
          Más vendido
        </div>
      )}
      <h3 className="text-lg font-extrabold text-red-800">{name}</h3>
      <p className="mt-1 text-2xl font-black text-slate-900">{price}</p>
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-orange-600" /> {f}
          </li>
        ))}
      </ul>
      <a
        href="/solicitar-servicio"
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:from-red-700 hover:to-orange-600"
      >
        Contratar <ArrowRight className="h-4 w-4" />
      </a>
    </motion.div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-semibold text-slate-900">{q}</span>
        <span className={`ml-4 text-orange-600 transition ${open ? "rotate-90" : ""}`}>›</span>
      </button>
      {open && <p className="mt-3 text-slate-600">{a}</p>}
    </div>
  );
}

/* =========================
   Página de Servicios (Responsive)
========================= */
export default function Servicios() {
  return (
    <main className="bg-white">
      {/* HERO */}
      <Section>
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div>
            <Badge>Servicio técnico a nivel nacional</Badge>
            <motion.h1
              {...fadeUp}
              className="mt-4 text-3xl font-black tracking-tight text-red-800 sm:text-4xl"
            >
              Mantenimiento y soporte para tu maquinaria, en todo el Perú
            </motion.h1>
            <motion.p {...fadeUp} className="mt-3 text-slate-700">
              Ofrecemos servicios de diagnóstico, mantenimiento correctivo y preventivo diseñados para maximizar la disponibilidad de tu maquinaria agrícola e industrial. Nuestro equipo de técnicos certificados trabaja con altos estándares de calidad para garantizar soluciones rápidas y efectivas en cada intervención. Además, contamos con un amplio stock de repuestos originales y alternativos, asegurando no solo la continuidad de tus operaciones, sino también la durabilidad y el rendimiento óptimo de tus equipos. Con nosotros, tu inversión está protegida y tu productividad siempre respaldada.
            </motion.p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/solicitar-servicio"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 text-white shadow-sm transition hover:from-red-700 hover:to-orange-600"
              >
                Solicitar servicio <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/51999999999"
                className="inline-flex items-center gap-2 rounded-xl border border-orange-300 bg-white px-4 py-2 text-orange-700 transition hover:bg-orange-50"
              >
                WhatsApp técnico <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <motion.div {...fadeUp} className="relative order-first lg:order-none">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-orange-100 bg-slate-100 shadow-sm">
              <img
                src="https://images.milanuncios.com/api/v1/ma-ad-media-pro/images/99001d81-153c-49ab-8dbe-993a29999ac1?rule=hw396_70"
                alt="Técnicos dando mantenimiento a tractor"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="pointer-events-none absolute -bottom-4 -right-4 hidden rounded-2xl bg-orange-600/90 px-4 py-3 text-white shadow-lg lg:block">
              <p className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4" /> Llegamos a tu campo
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* SERVICIOS PRINCIPALES */}
      <Section>
        <div className="mb-6">
          <h2 className="text-2xl font-black text-red-800 sm:text-3xl">Servicios</h2>
          <p className="text-slate-600">Todo lo que necesitas para mantener tu operación en marcha.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ServiceCard
            icon={Cpu}
            title="Diagnóstico y escaneo"
            desc="Identificación de fallas electrónicas y mecánicas con herramientas de última generación."
            bullets={["Lectura de códigos de error", "Pruebas en carga", "Informe técnico"]}
          />
          <ServiceCard
            icon={Cog}
            title="Mantenimiento preventivo"
            desc="Planes a medida para reducir paradas y prolongar la vida útil de tus equipos."
            bullets={["Cambio de filtros y fluidos", "Ajustes y calibraciones", "Checklist de seguridad"]}
          />
          <ServiceCard
            icon={Wrench}
            title="Correctivo en campo"
            desc="Taller móvil y técnicos que llegan a tu ubicación para reparar con repuestos disponibles."
            bullets={["Hidráulico y transmisión", "Sistema de frenos", "Eléctrico y electrónico"]}
          />
          <ServiceCard
            icon={Headphones}
            title="Soporte remoto"
            desc="Asistencia inmediata por teléfono o video para diagnóstico inicial y recomendaciones."
            bullets={["Guía paso a paso", "Verificación de síntomas", "Escalamiento rápido"]}
          />
          <ServiceCard
            icon={Truck}
            title="Instalaciones y puesta en marcha"
            desc="Montaje, pruebas y capacitación para operar de forma segura y eficiente."
            bullets={["Capacitación operativa", "Protocolos de seguridad", "Pruebas de rendimiento"]}
          />
          <ServiceCard
            icon={ShieldCheck}
            title="Garantías y auditorías"
            desc="Intervenciones certificadas, auditorías de mantenimiento y respaldo postventa."
            bullets={["Certificados de trabajo", "Historial de equipos", "SLA por contrato"]}
          />
        </div>
      </Section>

      {/* PROCESO */}
      <Section>
        <div className="mb-6">
          <h2 className="text-2xl font-black text-red-800 sm:text-3xl">Cómo trabajamos</h2>
          <p className="text-slate-600">Proceso claro para resolver rápido y bien.</p>
        </div>
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {["Solicitud", "Diagnóstico", "Aprobación", "Reparación", "Entrega"].map((step, i) => (
            <li key={step} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 font-bold text-orange-700">{i + 1}</div>
              <h3 className="mt-3 font-semibold text-slate-900">{step}</h3>
              <p className="text-sm text-slate-600">
                {[
                  "Cuéntanos tu problema y ubicación",
                  "Visita/soporte remoto para evaluar",
                  "Enviamos propuesta y tiempos",
                  "Intervención en campo o taller",
                  "Pruebas, entrega y garantía",
                ][i]}
              </p>
            </li>
          ))}
        </ol>
      </Section>

      {/* COBERTURA + SLA */}
      <Section>
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2">
          <div className="order-2 lg:order-none">
            <h2 className="text-2xl font-black text-red-800 sm:text-3xl">Cobertura nacional y SLA</h2>
            <p className="mt-2 text-slate-700">
              Atendemos en las 24 regiones del Perú con base en Huancayo. Definimos tiempos de respuesta (SLA) por contrato y mantenemos repuestos críticos en stock.
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <li className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm"><Clock className="mr-2 inline h-5 w-5 text-orange-600"/> Respuesta estándar: ≤ 48h</li>
              <li className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm"><ShieldCheck className="mr-2 inline h-5 w-5 text-orange-600"/> Garantía hasta 12 meses</li>
              <li className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm"><Truck className="mr-2 inline h-5 w-5 text-orange-600"/> Taller móvil en regiones</li>
              <li className="rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm"><Wrench className="mr-2 inline h-5 w-5 text-orange-600"/> Repuestos disponibles</li>
            </ul>
          </div>
          <div className="order-1 lg:order-none">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-orange-100 bg-slate-100 shadow-sm">
              <img
                src="https://www.tractoreslorca.com/wp-content/uploads/2014/03/servicio-tecnico-taller.jpg"
                alt="Mapa y cobertura de servicio"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* CTA FINAL */}
      <Section>
        <div className="rounded-2xl border border-orange-200 bg-gradient-to-r from-red-50 to-orange-50 p-6 text-center">
          <h3 className="text-xl font-black text-red-800">¿Necesitas servicio técnico ahora?</h3>
          <p className="mt-1 text-slate-700">Cuéntanos tu caso y un asesor te contactará de inmediato.</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <a href="/solicitar-servicio" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 text-white shadow-sm transition hover:from-red-700 hover:to-orange-600">
              Solicitar servicio <ArrowRight className="h-4 w-4" />
            </a>
            <a href="tel:+51999999999" className="inline-flex items-center gap-2 rounded-xl border border-orange-300 bg-white px-4 py-2 text-orange-700 transition hover:bg-orange-50">
              <Phone className="h-4 w-4" /> Llamar ahora
            </a>
          </div>
        </div>
      </Section>
    </main>
  );
}
