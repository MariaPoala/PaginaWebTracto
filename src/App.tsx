
import './App.css';
import React from "react";
import { BrowserRouter, Routes, Route, NavLink, Outlet, useLocation } from "react-router-dom";
import ContactInfoPanel from './pages/contact.tsx';
import HeroCarousel from './carrusel.tsx';
import Homes from './pages/home.tsx'
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
     {/* <HeroCarousel></HeroCarousel> */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8">
        
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function Home() {
  return (
    <section>
      <Homes></Homes>
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
      <Homes></Homes>
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
