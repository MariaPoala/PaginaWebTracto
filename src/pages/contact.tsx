import React, { useMemo, useRef, useState, useEffect } from "react";

// ---------------------------------------------------------------------------
// ContactInfoPanel – Página de contacto interactiva (sin formulario ni mapas)
// React + TypeScript + TailwindCSS (sin dependencias externas)
// Incluye: tabs por área, copiar al portapapeles, revelar teléfono, indicación
// de abierto/cerrado con horario local, acordeones de oficinas y mini-FAQ,
// acciones rápidas (tel, mail, WhatsApp) y descarga de vCard.
// ---------------------------------------------------------------------------

type DayKey = "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat";

type TimeRange = { start: string; end: string }; // "09:00", "18:00" (24h)

type WeeklySchedule = Partial<Record<DayKey, TimeRange[]>>;

interface Office {
  name: string;
  address: string;
  extra?: string;
}

interface ContactInfoPanelProps {
  company?: string;
  tagline?: string;
  email?: string; // contacto general
  phone?: string; // con prefijo país, ej: +51 989 000 000
  whatsapp?: string; // solo dígitos con código país, ej: 51989000000
  timezone?: string; // IANA, ej: "America/Lima"
  schedule?: WeeklySchedule;
  offices?: Office[];
  social?: Partial<Record<"x" | "ig" | "in" | "yt", string>>; // urls
}

const DEFAULT_SCHEDULE: WeeklySchedule = {
  mon: [{ start: "09:00", end: "18:00" }],
  tue: [{ start: "09:00", end: "18:00" }],
  wed: [{ start: "09:00", end: "18:00" }],
  thu: [{ start: "09:00", end: "18:00" }],
  fri: [{ start: "09:00", end: "18:00" }],
  sat: [{ start: "09:00", end: "13:00" }],
  // sun: cerrado
};

const dayNames: Record<DayKey, string> = {
  sun: "Domingo",
  mon: "Lunes",
  tue: "Martes",
  wed: "Miércoles",
  thu: "Jueves",
  fri: "Viernes",
  sat: "Sábado",
};

function parseHHMM(s: string) {
  const [h, m] = s.split(":").map(Number);
  return { h, m };
}

function timeInZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("es-PE", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
    .formatToParts(date)
    .reduce((acc: any, p) => ((acc[p.type] = p.value), acc), {} as any);
  const y = Number(parts.year);
  const mo = Number(parts.month) - 1;
  const d = Number(parts.day);
  const h = Number(parts.hour);
  const mi = Number(parts.minute);
  const se = Number(parts.second);
  return new Date(y, mo, d, h, mi, se);
}

function isOpenNow(tzNow: Date, schedule: WeeklySchedule) {
  const dow = tzNow.getDay(); // 0..6 (sun..sat)
  const map: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const dayKey = map[dow];
  const ranges = schedule[dayKey];
  if (!ranges || ranges.length === 0) return { open: false, current: null as TimeRange | null };
  const minutesNow = tzNow.getHours() * 60 + tzNow.getMinutes();
  for (const r of ranges) {
    const { h: sh, m: sm } = parseHHMM(r.start);
    const { h: eh, m: em } = parseHHMM(r.end);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    if (minutesNow >= startMin && minutesNow < endMin) return { open: true, current: r };
  }
  return { open: false, current: null };
}

function formatTimeRange(r: TimeRange) {
  return `${r.start} – ${r.end}`;
}

export default function ContactInfoPanel({
  company = "Tu Empresa",
  tagline = "Estamos aquí para ayudarte",
  email = "hola@tuempresa.com",
  phone = "+51 989 000 000",
  whatsapp = "51989000000",
  timezone = "America/Lima",
  schedule = DEFAULT_SCHEDULE,
  offices = [
    { name: "Lima (Principal)", address: "Av. Ejemplo 123, Miraflores, Lima" },
    { name: "Arequipa", address: "Calle Demo 456, Cercado, Arequipa" },
  ],
  social = { x: "#", ig: "#", in: "#", yt: "#" },
}: ContactInfoPanelProps) {
  const [activeTab, setActiveTab] = useState<"general" | "ventas" | "soporte" | "facturacion">("general");
  const [revealed, setRevealed] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [tzNow, setTzNow] = useState(() => timeInZone(new Date(), timezone));
  const toastTimer = useRef<number | null>(null);

  // reloj cada 30s en zona objetivo
  useEffect(() => {
    const id = setInterval(() => setTzNow(timeInZone(new Date(), timezone)), 30000);
    return () => clearInterval(id);
  }, [timezone]);

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
  }, []);

  const status = useMemo(() => isOpenNow(tzNow, schedule), [tzNow, schedule]);

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Copiado: ${label}`);
    } catch {
      showToast("No se pudo copiar");
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
  };

  const maskedPhone = useMemo(() => phone.replace(/(\+?\d{2})?(\s*\d{2,3})\s*\d{3}\s*\d{3}/, (m) => m.replace(/\d/g, (d, i) => (i < m.length - 4 ? "•" : d))), [phone]);

  const tabClasses = (val: typeof activeTab) =>
    `rounded-xl px-3 py-2 text-sm font-medium ring-1 ring-white/10 transition ${
      activeTab === val ? "bg-white text-neutral-900 shadow" : "bg-white/5 text-white/80 hover:bg-white/10"
    }`;

  const vcardHref = useMemo(() => {
    const cleanPhone = phone.replace(/\s+/g, "");
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${company}`,
      `ORG:${company}`,
      `TEL;TYPE=WORK,VOICE:${cleanPhone}`,
      `EMAIL;TYPE=INTERNET:${email}`,
      "END:VCARD",
    ];
    const data = encodeURIComponent(lines.join("\n"));
    return `data:text/vcard;charset=utf-8,${data}`;
  }, [company, email, phone]);

  const openRangesToday = useMemo(() => {
    const map: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    return schedule[map[tzNow.getDay()]] || [];
  }, [tzNow, schedule]);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 text-white ring-1 ring-white/10">
      {/* fondo decorativo */}
      <div aria-hidden className="pointer-events-none absolute -left-1/3 -top-1/3 h-80 w-80 rounded-full bg-gradient-to-br from-red-600/20 via-orange-500/20 to-amber-400/20 blur-3xl" />

      <div className="relative z-10 p-6 md:p-10">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Contacto — {company}</h1>
            <p className="mt-1 text-white/80">{tagline}</p>

            {/* Estado abierto/cerrado */}
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${status.open ? "bg-emerald-400" : "bg-rose-400"}`} />
              <span className="tabular-nums">
                {status.open ? "Abierto ahora" : "Cerrado"} · Hoy {openRangesToday.length > 0 ? openRangesToday.map(formatTimeRange).join(
                  ", "
                ) : "—"} ({new Intl.DateTimeFormat("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: timezone }).format(tzNow)} {timezone})
              </span>
            </div>
          </div>

          {/* Tabs */}
          <nav className="mt-2 flex gap-2 md:mt-0">
            <button className={tabClasses("general")} onClick={() => setActiveTab("general")}>General</button>
            <button className={tabClasses("ventas")} onClick={() => setActiveTab("ventas")}>Ventas</button>
            <button className={tabClasses("soporte")} onClick={() => setActiveTab("soporte")}>Soporte</button>
            <button className={tabClasses("facturacion")} onClick={() => setActiveTab("facturacion")}>Facturación</button>
          </nav>
        </header>

        {/* Paneles */}
        <div className="mt-8 grid gap-6 md:grid-cols-12">
          {/* Info principal */}
          <div className="md:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">Información de contacto</h2>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/60">Correo</p>
                    <a href={`mailto:${email}`} className="font-medium hover:underline">{email}</a>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => copy(email, "correo")}
                      className="rounded-xl bg-white/10 px-3 py-1.5 text-sm ring-1 ring-white/15 transition hover:bg-white/15">Copiar</button>
                    <a href={`mailto:${email}`} className="rounded-xl bg-white px-3 py-1.5 text-sm font-semibold text-neutral-900 ring-1 ring-black/5 transition hover:opacity-90">Abrir</a>
                  </div>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/60">Teléfono</p>
                    <button onClick={() => setRevealed((v) => !v)} className="font-medium underline-offset-2 hover:underline">
                      {revealed ? phone : maskedPhone}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => copy(phone, "teléfono")} className="rounded-xl bg-white/10 px-3 py-1.5 text-sm ring-1 ring-white/15 transition hover:bg-white/15">Copiar</button>
                    <a href={`tel:${phone.replace(/\s+/g, "")}`} className="rounded-xl bg-white px-3 py-1.5 text-sm font-semibold text-neutral-900 ring-1 ring-black/5 transition hover:opacity-90">Llamar</a>
                  </div>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/60">WhatsApp</p>
                    <a target="_blank" rel="noreferrer" className="font-medium hover:underline" href={`https://wa.me/${whatsapp}`}>wa.me/{whatsapp}</a>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => copy(`https://wa.me/${whatsapp}`, "WhatsApp")} className="rounded-xl bg-white/10 px-3 py-1.5 text-sm ring-1 ring-white/15 transition hover:bg-white/15">Copiar</button>
                    <a target="_blank" rel="noreferrer" href={`https://wa.me/${whatsapp}`} className="rounded-xl bg-white px-3 py-1.5 text-sm font-semibold text-neutral-900 ring-1 ring-black/5 transition hover:opacity-90">Abrir</a>
                  </div>
                </li>
              </ul>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a href={vcardHref} download={`${company.replace(/\s+/g, "_")}.vcf`} className="rounded-xl bg-white/10 px-3 py-1.5 text-sm ring-1 ring-white/15 transition hover:bg-white/15">Descargar vCard</a>
                {social && (
                  <div className="ml-auto flex items-center gap-2 text-white/70">
                    {social.x && <a className="hover:text-white" href={social.x} aria-label="X/Twitter">X</a>}
                    {social.ig && <a className="hover:text-white" href={social.ig} aria-label="Instagram">IG</a>}
                    {social.in && <a className="hover:text-white" href={social.in} aria-label="LinkedIn">IN</a>}
                    {social.yt && <a className="hover:text-white" href={social.yt} aria-label="YouTube">YT</a>}
                  </div>
                )}
              </div>
            </div>

            {/* Mini FAQ (sin formulario) */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold">Preguntas rápidas</h3>
              <div className="mt-3 divide-y divide-white/10">
                {[
                  { q: "¿En cuánto tiempo responden?", a: "En horario laboral respondemos normalmente en menos de 30 minutos." },
                  { q: "¿Ofrecen soporte los fines de semana?", a: "Sí, con disponibilidad reducida los sábados por la mañana." },
                  { q: "¿Puedo agendar una llamada?", a: "Envíanos un mensaje por WhatsApp y te compartimos el calendario de disponibilidad." },
                ].map((item, idx) => (
                  <details key={idx} className="group py-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-white/90">
                      <span>{item.q}</span>
                      <span className="rounded-lg bg-white/10 px-2 py-1 text-xs ring-1 ring-white/10 transition group-open:rotate-180">▾</span>
                    </summary>
                    <p className="mt-2 text-sm text-white/70">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Lateral: Horarios + Oficinas */}
          <aside className="md:col-span-5">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-red-600/20 via-orange-500/20 to-amber-400/20 p-5">
              <h2 className="text-lg font-semibold">Horarios (zona {timezone})</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {(["mon","tue","wed","thu","fri","sat","sun"] as DayKey[]).map((dk) => (
                  <li key={dk} className="flex items-center justify-between gap-3">
                    <span className="text-white/75">{dayNames[dk]}</span>
                    <span className="tabular-nums">{schedule[dk]?.map(formatTimeRange).join(", ") || "Cerrado"}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-lg font-semibold">Oficinas</h2>
              <div className="mt-3 divide-y divide-white/10">
                {offices.map((o, i) => (
                  <details key={i} className="group py-3">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                      <div>
                        <p className="font-medium">{o.name}</p>
                        <p className="text-sm text-white/70">{o.address}</p>
                      </div>
                      <span className="rounded-lg bg-white/10 px-2 py-1 text-xs ring-1 ring-white/10 transition group-open:rotate-180">▾</span>
                    </summary>
                    {o.extra && <p className="mt-2 text-sm text-white/70">{o.extra}</p>}
                    <div className="mt-3 flex gap-2">
                      <a href={`mailto:${email}`} className="rounded-lg bg-white/10 px-3 py-1.5 text-sm ring-1 ring-white/15 transition hover:bg-white/15">Escríbenos</a>
                      <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-neutral-900 ring-1 ring-black/5 transition hover:opacity-90">WhatsApp</a>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Toast */}
      <div aria-live="polite" className="pointer-events-none fixed inset-0 z-[60] flex items-end justify-end p-6">
        <div className={`transition-all ${toast ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
          {toast && (
            <div className="pointer-events-auto rounded-xl bg-white px-4 py-2 text-sm font-medium text-neutral-900 shadow-xl ring-1 ring-black/5">{toast}</div>
          )}
        </div>
      </div>
    </section>
  );
}
