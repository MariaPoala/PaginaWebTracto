import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Building2,
  Send,
  ArrowRight,
  Loader2,
  MessageCircle,
} from "lucide-react";

/* =========================
   Helpers
========================= */
const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: "easeOut" },
} as const;

function Section({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={`py-12 sm:py-16 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

function GradientButton({ children, href, className = "", loading = false }: { children: ReactNode; href?: string; className?: string; loading?: boolean }) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:from-red-700 hover:to-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:opacity-60";
  if (href) return (
    <a href={href} className={`${base} ${className}`}>
      {children}
    </a>
  );
  return (
    <button className={`${base} ${className}`} disabled={loading}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

function InfoRow({ icon: Icon, label, value, href }: { icon: any; label: string; value: string; href?: string }) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-orange-100 text-orange-600">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
        <p className="font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
  if (href) return <a href={href} className="block transition hover:opacity-90">{content}</a>;
  return content;
}

/* =========================
   Página de Contacto
========================= */
export default function Contacto(): JSX.Element {
  // Cambia estos valores por los reales de tu empresa
  const direccion = "Av. Ejemplo 123, Lima, Perú";
  const telefono = "+51 999 999 999";
  const email = "ventas@tutractor.pe";

  // Mapa dinámico por dirección (sin API key)
  const mapsQuery = useMemo(() => encodeURIComponent(direccion), [direccion]);
  const mapsEmbedSrc = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  // Form state (solo demo en cliente)
  const [form, setForm] = useState({
    nombre: "",
    empresa: "",
    telefono: "",
    email: "",
    asunto: "Ventas de tractores",
    mensaje: "",
    acepta: false,
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const canSubmit =
    form.nombre.trim().length > 1 &&
    /.+@.+\..+/.test(form.email) &&
    form.mensaje.trim().length >= 10 &&
    form.acepta;

  function onChange<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSending(true);
    // Aquí integra tu backend o un servicio como Formspree/Notify/Google Apps Script
    await new Promise((r) => setTimeout(r, 1000));
    setSending(false);
    setSent(true);
  }

  const whatsappHref = useMemo(() => {
    const text = encodeURIComponent(
      `Hola, quiero más información.\n\nNombre: ${form.nombre}\nEmpresa: ${form.empresa}\nTeléfono: ${form.telefono}\nEmail: ${form.email}\nAsunto: ${form.asunto}\nMensaje: ${form.mensaje}`
    );
    return `https://wa.me/51999999999?text=${text}`; // cambia al número real
  }, [form]);

  return (
    <main className="bg-white">
      {/* Hero */}
      <Section>
        <div className="grid grid-cols-1 items-center gap-8 ">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 ring-1 ring-red-200">
              <Building2 className="h-4 w-4" /> Contacto
            </div>
            <motion.h1 {...fadeUp} className="mt-4 text-3xl font-black tracking-tight text-red-800 sm:text-4xl">
              Hablemos sobre tu próxima solución
            </motion.h1>
            <motion.p {...fadeUp} className="mt-3 text-slate-700">
              Escríbenos para cotizar tractores, solicitar repuestos o agendar servicio técnico. Respondemos rápido.
            </motion.p>

            <motion.div {...fadeUp} className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoRow icon={Phone} label="Teléfono" value={telefono} href={`tel:${telefono.replace(/\s|\+/g, "")}`} />
              <InfoRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} />
              <InfoRow icon={Clock} label="Horario" value="Lun–Sáb 8:00–18:00" />
              <InfoRow icon={MapPin} label="Dirección" value={direccion} href={mapsLink} />
            </motion.div>

            <div className="mt-6 flex flex-wrap gap-3">
              <GradientButton href={whatsappHref}>
                WhatsApp inmediato <MessageCircle className="h-4 w-4" />
              </GradientButton>
              <a href={mapsLink} className="inline-flex items-center gap-2 rounded-xl border border-orange-300 bg-white px-4 py-2 text-sm font-medium text-orange-700 transition hover:bg-orange-50">
                Cómo llegar <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Mapa */}
          
        </div>
      </Section>

      {/* Mapa ancho (opcional, a pantalla casi completa) */}
      <Section className="pt-0">
        <div className="overflow-hidden rounded-2xl border border-orange-100">
          <iframe
            title="Mapa grande"
            src={mapsEmbedSrc}
            className="h-[420px] w-full"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <p className="mt-2 text-center text-sm text-slate-600">
          Si el mapa no muestra la ubicación correcta, revisa la dirección en <a href={mapsLink} className="font-medium text-orange-700 underline">Google Maps</a>.
        </p>
      </Section>
    </main>
  );
}

/* =========================
   Nota: 
   Si prefieres usar la API de Google Maps con marcadores personalizados, puedes integrar @react-google-maps/api.
   1) npm i @react-google-maps/api
   2) Crea una API Key y habilita Maps JavaScript API.
   3) Reemplaza el iframe por <GoogleMap> y <Marker>. Mantener iframe es lo más simple (sin key).
========================= */
