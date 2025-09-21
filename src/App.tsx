import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { REPUESTOS } from "./data/repuestos.tsx";
import { ARADOS } from "./data/arados.tsx";
import { INSUMO } from "./data/insumos.tsx";
import { RASTRA } from "./data/rastras.tsx";
import { SURCADORA } from "./data/surcadoras.tsx";
import Homes from "./pages/home.tsx";
import Nosotros from "./pages/nosotros.tsx";
import Productos from "./pages/productos.tsx";
import Servicios from "./pages/servicios.tsx";
import ContactInfoPanel from "./pages/contact.tsx";
import WhatsAppButton from './botonwat.tsx'


function ShellLayout() {
  return (
    <div className="min-h-screen text-white flex flex-col">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <Routes>
            <Route index element={<Home />} />
            <Route path="/nosotros" element={<Nosotro />} />
            {/* <Route path="/productos" element={<Producto />} /> */}
            <Route
              path="/repuestos"
              element={
                <Productos
                  titulo="Repuestos"
                  descripcion="Piezas clave para reemplazo que garantizan el funcionamiento óptimo de tractores y equipos agrícolas."
                  data={REPUESTOS}
                  tipoFiltro="repuesto"
                />
              }
            />
            <Route
              path="/arados"
              element={
                <Productos
                  titulo="Arados"
                  descripcion="Herramientas que rompen y voltean la tierra para preparar el terreno de cultivo."
                  data={ARADOS}
                  tipoFiltro="arado"
                />
              }
            />
             <Route
              path="/insumos"
              element={
                <Productos
                  titulo="Insumos"
                  descripcion="Materiales esenciales como aceites, grasas y filtros que prolongan la vida útil de la maquinaria."
                  data={INSUMO}
                  tipoFiltro="insumo"
                />
              }
            />
             <Route
              path="/rastras"
              element={
                <Productos
                  titulo="Rastras"
                  descripcion="Implementos con discos que desmenuzan, nivelan y afinan la tierra tras el arado."
                  data={RASTRA}
                  tipoFiltro="rastra"
                />
              }
            />
             <Route
              path="/surcadoras"
              element={
                <Productos
                  titulo="Surcadoras"
                  descripcion="Equipos que abren surcos uniformes en el terreno para la siembra."
                  data={SURCADORA}
                  tipoFiltro="surcadora"
                />
              }
            />
            {/* <Route path="/arados" element={<Arados />} /> */}
            {/* <Route path="/repuestos" element={<Repuesto />} /> */}
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
// function Producto() {
//   return (
//     <section>
//       <Productos />
//     </section>
//   );
// }
// function Arado() {
//   return (
//     <section>
//       <Arados />
//     </section>
//   );
// }
// function Repuesto() {
//   return (
//     <section>
//       <Repuestos />
//     </section>
//   );
// }
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
      <WhatsAppButton></WhatsAppButton>
    </BrowserRouter>
  );
}
