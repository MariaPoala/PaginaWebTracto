import React from "react";
import { BrowserRouter, Routes, Route, NavLink, Outlet, useLocation } from "react-router-dom";
import ContactInfoPanel from './pages/contact.tsx'
type NavItem = { label: string; to: string };

const NAV: NavItem[] = [
  { label: "Inicio", to: "/" },
  { label: "Servicios", to: "/servicios" },
  { label: "Precios", to: "/paginauno" },
  { label: "Nosotros", to: "/nosotros" },
  { label: "Contacto", to: "/contact" },
];

// ---- Shell/Layout con header + outlet + footer --------------------------------
function ShellLayout() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <SiteHeader />
      {/* BODY que cambia con la ruta */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <ScrollToTop />
          <Outlet />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Home() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Inicio</h1>
      <p className="mt-3 text-white/80">Contenido de tu home aquí.</p>
    </section>
  );
}
function Servicios() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Servicios</h1>
      <p className="mt-3 text-white/80">Describe tus servicios.</p>
    </section>
  );
}
function Precios() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Precios</h1>
      <p className="mt-3 text-white/80">Planes y tarifas.</p>
    </section>
  );
}
function Nosotros() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Nosotros</h1>
      <p className="mt-3 text-white/80">Quiénes somos.</p>
    </section>
  );
}
function Contacto() {
  return (
    <section>
     <ContactInfoPanel></ContactInfoPanel>
    </section>
  );
}

// ---- Header mínimo (puedes reemplazar por tu componente existente) -------------
function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 bg-brand-red-700 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-white text-neutral-900 ring-1 ring-white/20">
            <span className="text-sm font-bold">M</span>
          </div>
          <span className="font-semibold tracking-tight">MiMarca</span>
        </div>
        <nav>
          <ul className="flex gap-1">
            {NAV.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm transition ${
                      isActive
                        ? "bg-white text-neutral-900"
                        : "text-white/90 hover:bg-white/10"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

// ---- Footer mínimo (puedes reemplazar por tu componente existente) --------------
function SiteFooter() {
  return (
    <footer className="bg-brand-orange-700">
      <div className="mx-auto max-w-7xl px-6 py-6 text-white/90">
        <p>© {new Date().getFullYear()} MiMarca. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

// ---- Scroll al top en cada cambio de ruta --------------------------------------
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

// ---- App principal con enrutamiento anidado (Layout persistente) ----------------
export default function AppRouterLayout() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<ShellLayout />}> {/* Header y Footer persisten */}
          <Route index element={<Home />} />
          <Route path="servicios" element={<Servicios />} />
          <Route path="paginauno" element={<Precios />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="contact" element={<Contacto />} />
          {/* 404 simple */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Página no encontrada</h1>
      <p className="mt-3 text-white/70">La ruta solicitada no existe.</p>
    </section>
  );
}
