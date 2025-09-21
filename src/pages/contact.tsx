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

function GradientButton({
  children,
  href,
  className = "",
  loading = false,
}: {
  children: ReactNode;
  href?: string;
  className?: string;
  loading?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-700 to-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:from-emerald-800 hover:to-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:opacity-60";
  if (href)
    return (
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

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: any;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 inline-flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
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

export default function Contacto(): JSX.Element {
  const direccion = "Av. Ejemplo 123, Lima, Perú";
  const telefono = "+51981830008";
  const email = "ventas@tutractor.pe";

  const mapsQuery = useMemo(() => encodeURIComponent(direccion), [direccion]);
  const mapsEmbedSrc = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <main className="bg-white">
      <Section>
        <div className="grid grid-cols-1 items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
              <Building2 className="h-4 w-4" /> Contacto
            </div>
            <motion.h1
              {...fadeUp}
              className="mt-4 text-3xl font-black tracking-tight text-emerald-900 sm:text-4xl"
            >
              Hablemos sobre tu próxima solución
            </motion.h1>
            <motion.p {...fadeUp} className="mt-3 text-slate-700">
              Escríbenos para cotizar tractores, solicitar repuestos o agendar servicio técnico. Respondemos rápido.
            </motion.p>

            <motion.div
              {...fadeUp}
              className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              <InfoRow
                icon={Phone}
                label="Teléfono"
                value={telefono}
                href={`tel:${telefono.replace(/\s|\+/g, "")}`}
              />
              <InfoRow icon={Mail} label="Email" value={email} href={`mailto:${email}`} />
              <InfoRow icon={Clock} label="Horario" value="Lun–Sáb 8:00–18:00" />
              <InfoRow icon={MapPin} label="Dirección" value={direccion} href={mapsLink} />
            </motion.div>

            <div className="mt-6 flex flex-wrap gap-3">
              <GradientButton href="https://wa.me/51981830008?text=Hola,%20quiero%20información">
                WhatsApp inmediato <MessageCircle className="h-4 w-4" />
              </GradientButton>
              <a
                href={mapsLink}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                Cómo llegar <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="overflow-hidden rounded-2xl border border-emerald-100">
          <iframe
            title="Mapa grande"
            src={mapsEmbedSrc}
            className="h:[420px] h-[420px] w-full"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <p className="mt-2 text-center text-sm text-slate-600">
          Si el mapa no muestra la ubicación correcta, revisa la dirección en{" "}
          <a href={mapsLink} className="font-medium text-emerald-700 underline">
            Google Maps
          </a>.
        </p>
      </Section>
    </main>
  );
}
