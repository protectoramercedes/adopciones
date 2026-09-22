import { Route, Routes } from "react-router-dom";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Adopciones from "./pages/Adopciones.jsx";
import PeluditoDetalle from "./pages/PeluditoDetalle.jsx";
import SolicitudAdopcion from "./pages/SolicitudAdopcion.jsx";
import Apadrinar from "./pages/Apadrinar.jsx";
import Donar from "./pages/Donar.jsx";
import FinalesFelices from "./pages/FinalesFelices.jsx";

const App = () => {
  return (
    <div className="app">
      <Header />

      <main>
        <Routes>
          {/* INICIO */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* CATÁLOGO DE ADOPCIONES */}
          <Route
            path="/adopciones"
            element={<Adopciones />}
          />

          {/* FICHA INDIVIDUAL DEL PELUDITO */}
          <Route
            path="/adopciones/:id"
            element={<PeluditoDetalle />}
          />

          {/* FORMULARIO DE ADOPCIÓN */}
          <Route
            path="/adoptar/:id"
            element={<SolicitudAdopcion />}
          />

          {/* MADRINAS Y PADRINOS */}
          <Route
            path="/apadrinar"
            element={<Apadrinar />}
          />

          {/* DONACIONES */}
          <Route
            path="/donar"
            element={<Donar />}
          />

          {/* FINALES FELICES */}
          <Route
            path="/finales-felices"
            element={<FinalesFelices />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;