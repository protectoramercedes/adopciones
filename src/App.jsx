import {
  Route,
  Routes,
} from "react-router-dom";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";

import Home from "./pages/Home.jsx";
import Adopciones from "./pages/Adopciones.jsx";
import PeluditoDetalle from "./pages/PeluditoDetalle.jsx";
import SolicitudAdopcion from "./pages/SolicitudAdopcion.jsx";
import Apadrinar from "./pages/Apadrinar.jsx";
import Donar from "./pages/Donar.jsx";
import FinalesFelices from "./pages/FinalesFelices.jsx";

import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminPeluditos from "./pages/admin/AdminPeluditos.jsx";
import AdminPeluditoForm from "./pages/admin/AdminPeluditoForm.jsx";

const PublicLayout = () => {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/adopciones"
            element={<Adopciones />}
          />

          <Route
            path="/adopciones/:id"
            element={<PeluditoDetalle />}
          />

          <Route
            path="/adoptar/:id"
            element={<SolicitudAdopcion />}
          />

          <Route
            path="/apadrinar"
            element={<Apadrinar />}
          />

          <Route
            path="/donar"
            element={<Donar />}
          />

          <Route
            path="/finales-felices"
            element={<FinalesFelices />}
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
};

const App = () => {
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* LOGIN ADMIN */}
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        {/* ADMIN PROTEGIDO */}
        <Route
          element={<AdminProtectedRoute />}
        >
          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            <Route
              index
              element={<AdminDashboard />}
            />

            <Route
              path="peluditos"
              element={<AdminPeluditos />}
            />

            <Route
              path="peluditos/nuevo"
              element={<AdminPeluditoForm />}
            />

            <Route
              path="peluditos/:id/editar"
              element={<AdminPeluditoForm />}
            />
          </Route>
        </Route>

        {/* WEB PÚBLICA */}
        <Route
          path="/*"
          element={<PublicLayout />}
        />
      </Routes>
    </>
  );
};

export default App;