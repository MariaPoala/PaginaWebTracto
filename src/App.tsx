import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homes from "./pages/home.tsx";
import Nosotros from "./pages/nosotros.tsx";
import Productos from "./pages/productos.tsx";
import Servicios from "./pages/servicios.tsx";
import ContactInfoPanel from "./pages/contact.tsx";


function ShellLayout() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Routes>
            <Route index element={<Home />} />
            <Route path="/nosotros" element={<Nosotro />} />
            <Route path="/productos" element={<Producto />} />
            <Route path="/servicios" element={<Servicio />} />
            <Route path="/contact" element={<Contacto />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function Home() {
  return (
    <section>
      <Homes />
    </section>
  );
}
function Servicio() {
  return (
    <section>
      <Servicios />
    </section>
  );
}
function Producto() {
  return (
    <section>
      <Productos />
    </section>
  );
}
function Nosotro() {
  return (
    <section>
      <Nosotros />
    </section>
  );
}
function Contacto() {
  return (
    <section>
      <ContactInfoPanel />
    </section>
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

export default function App() {
  return (
    <BrowserRouter>
      <ShellLayout />
    </BrowserRouter>
  );
}
