import { type ReactNode } from "react";
import { motion } from "framer-motion";
import {
    Building2,
    Target,
    Eye,
    Handshake,
    MapPin,
    Clock,
    Wrench,
    ShieldCheck,
    PackageCheck,
    Award,
    Users,
    ArrowRight,
    PhoneCall,
    type LucideIcon,
} from "lucide-react";


type TimelineItem = { year: string; title: string; text: string };
type TeamMember = { name: string; role: string; photo?: string };

const TIMELINE: TimelineItem[] = [
    {
        year: "2018",
        title: "Nace la marca",
        text: "Iniciamos operaciones con enfoque en soluciones para el agro peruano.",
    },
    {
        year: "2020",
        title: "Cobertura nacional",
        text: "Ampliamos atención en campo con técnicos aliados en varias regiones.",
    },
    {
        year: "2023",
        title: "Servicio integral",
        text: "Unificamos ventas de tractores, repuestos y soporte técnico 24/7.",
    },
];

const TEAM: TeamMember[] = [
    { name: "María Torres", role: "Gerente Comercial", photo: "https://i.pravatar.cc/300?img=47" },
    { name: "Carlos Rojas", role: "Jefe de Servicio", photo: "https://i.pravatar.cc/300?img=12" },
    { name: "Ana Paredes", role: "Logística y Repuestos", photo: "https://i.pravatar.cc/300?img=32" },
    { name: "Luis Huamán", role: "Técnico en Campo", photo: "https://i.pravatar.cc/300?img=5" },
];


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

function AccentTitle({ children, subtitle }: { children: ReactNode; subtitle?: string }) {
    return (
        <div className="mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight text-red-800 sm:text-3xl">{children}</h2>
            {subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}
            <div className="mt-3 h-1 w-28 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />
        </div>
    );
}

function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${className}`}>
            {children}
        </span>
    );
}

function GradientButton({ children, href, className = "" }: { children: ReactNode; href?: string; className?: string }) {
    const base =
        "inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:from-red-700 hover:to-orange-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400";
    if (href) return (
        <a href={href} className={`${base} ${className}`}>{children}</a>
    );
    return <button className={`${base} ${className}`}>{children}</button>;
}

function Pillar({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
    return (
        <div className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 transition group-hover:scale-105">
                <Icon className="h-6 w-6" />
            </div>
            <h4 className="text-base font-semibold text-slate-900">{title}</h4>
            <p className="mt-1 text-sm text-slate-600">{text}</p>
            <div className="pointer-events-none absolute inset-0 -z-[1] rounded-2xl bg-gradient-to-r from-red-500/0 via-orange-400/15 to-red-500/0 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
        </div>
    );
}

function ValueCard({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
    return (
        <div className="rounded-2xl border border-orange-100 bg-orange-50/40 p-5">
            <div className="mb-2 flex items-center gap-2 text-orange-700"><Icon className="h-5 w-5" /><span className="font-medium">{title}</span></div>
            <p className="text-sm text-slate-700">{text}</p>
        </div>
    );
}

function Timeline() {
    return (
        <div className="relative">
            <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-orange-300 via-red-300 to-orange-300" />
            <ul className="space-y-6">
                {TIMELINE.map((i) => (
                    <li key={i.year} className="relative pl-12">
                        <div className="absolute left-1 top-2 h-6 w-6 rounded-full bg-gradient-to-tr from-red-600 to-orange-500 ring-4 ring-orange-100" />
                        <p className="text-sm font-semibold text-red-800">{i.year}</p>
                        <p className="font-medium text-slate-900">{i.title}</p>
                        <p className="text-sm text-slate-600">{i.text}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function TeamCard({ m }: { m: TeamMember }) {
    return (
        <div className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-xl">
            <div className="flex items-center gap-4">
                <div className="h-14 w-14 overflow-hidden rounded-xl bg-slate-100">
                    {m.photo ? (
                        <img src={m.photo} alt={m.name} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">{m.name.at(0)}</div>
                    )}
                </div>
                <div>
                    <p className="font-semibold text-slate-900">{m.name}</p>
                    <p className="text-sm text-slate-600">{m.role}</p>
                </div>
            </div>
        </div>
    );
}


export default function Nosotros(): JSX.Element {
    return (
        <main className="bg-white">

            <Section>
                <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
                    <div>
                        <Badge className="bg-red-50 text-red-700 ring-red-200 inline-flex items-center gap-2">
                            <Building2 className="h-4 w-4" /> Nosotros
                        </Badge>
                        <motion.h1 {...fadeUp} className="mt-4 text-3xl font-black tracking-tight text-red-800 sm:text-4xl">
                            Compromiso con el agro peruano
                        </motion.h1>
                        <motion.p {...fadeUp} className="mt-3 text-slate-700">
                            En Tractro SAC somos una empresa dedicada a la venta de tractores, repuestos y soluciones integrales para el sector agrícola e industrial.
                            Nuestra misión es brindar a nuestros clientes maquinaria y servicios que impulsen su productividad y confianza.
                            Contamos con una amplia gama de tractores de diferentes capacidades y marcas reconocidas en el mercado.
                            Ofrecemos repuestos originales y de calidad garantizada para asegurar el máximo rendimiento de cada equipo.
                            Nuestro servicio técnico especializado está preparado para atender mantenimientos y reparaciones en todo el país.
                            Trabajamos con un equipo comprometido que brinda asesoría y soporte en cada etapa de su proyecto.
                            En Tractro SAC creemos en construir relaciones sólidas y duraderas, siendo su socio estratégico en el crecimiento.
                        </motion.p>

                        <motion.div {...fadeUp} className="mt-6 flex flex-wrap gap-3">
                            <GradientButton href="tel:+51981830008">
                                Contáctanos <PhoneCall className="h-4 w-4" />
                            </GradientButton>
                        </motion.div>
                    </div>

        
                    <motion.div {...fadeUp} className="grid grid-cols-2 grid-rows-2 gap-3">
                        <div className="col-span-1 row-span-2 overflow-hidden rounded-2xl border border-orange-100 bg-slate-100">
                            <img src="https://i.pinimg.com/1200x/18/ce/60/18ce603c8eeab266994e6c63dd0c2b79.jpg" alt="Tractor" className="h-full w-full object-cover" />
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-orange-100 bg-slate-100">
                            <img src="https://i.pinimg.com/736x/a0/07/e3/a007e3ceba62c43310bc24f225f9ed54.jpg" alt="Campo" className="h-full w-full object-cover" />
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-orange-100 bg-slate-100">
                            <img src="https://www.liste.es/wp-content/uploads/2020/11/servicio-tecnico-liste-1.jpg" alt="Soporte" className="h-full w-full object-cover" />
                        </div>
                    </motion.div>
                </div>
            </Section>


            <Section>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <ValueCard icon={Target} title="Misión" text="Impulsar la productividad del campo con maquinaria y soporte confiables." />
                    <ValueCard icon={Eye} title="Visión" text="Ser la referencia en soluciones integrales para el agro en Perú." />
                    <ValueCard icon={Handshake} title="Valores" text="Compromiso, integridad, seguridad y enfoque al cliente." />
                </div>
            </Section>


            <Section>
                <AccentTitle subtitle="Lo que nos diferencia">Nuestros pilares</AccentTitle>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Pillar icon={MapPin} title="Cobertura nacional" text="Atención en campo con técnicos y aliados en múltiples regiones." />
                    <Pillar icon={Clock} title="Atención 24/7" text="Soporte cuando lo necesitas para minimizar tiempos de paro." />
                    <Pillar icon={PackageCheck} title="Stock confiable" text="Repuestos originales y alternativos con garantía." />
                    <Pillar icon={Wrench} title="Técnicos certificados" text="Diagnóstico y reparación con estándares de calidad." />
                    <Pillar icon={ShieldCheck} title="Seguridad y garantía" text="Procesos y repuestos respaldados." />
                    <Pillar icon={Award} title="Excelencia" text="Acompañamiento cercano y soluciones a medida." />
                </div>
            </Section>


            <Section>
                <div className="relative overflow-hidden rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 to-red-50 p-6">
                    <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
                        <div>
                            <h3 className="text-2xl font-extrabold text-red-800">¿Listo para trabajar con nosotros?</h3>
                            <p className="mt-1 text-slate-700">Conversemos sobre tus necesidades de maquinaria, repuestos o soporte técnico.</p>
                        </div>
                        <div className="flex flex-wrap items-center justify-start gap-3 md:justify-end">
                            <GradientButton href="#contacto">Escribenos ya <ArrowRight className="h-4 w-4" /></GradientButton>
                            <a href="https://wa.me/51981830008" className="inline-flex items-center gap-2 rounded-xl border border-orange-300 bg-white px-4 py-2 text-slate-800 transition hover:border-orange-400 hover:bg-orange-50">
                                WhatsApp <PhoneCall className="h-4 w-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </Section>
        </main>
    );
}


