import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const AdminLayout = () => {
  const navigate = useNavigate();

  const {
    usuario,
    cerrarSesion,
  } = useAuth();

  const [cerrando, setCerrando] =
    useState(false);

  const manejarCerrarSesion = async () => {
    try {
      setCerrando(true);

      await cerrarSesion();

      navigate("/admin/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Error al cerrar sesión:",
        error
      );

      alert(
        "No se pudo cerrar la sesión. Intentá nuevamente."
      );
    } finally {
      setCerrando(false);
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        {/* LOGO */}
        <div className="admin-brand">
          <img
            src="/logoprote.png"
            alt="Protectora San Francisco de Asís"
          />

          <span>
            Administración
          </span>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="admin-nav">
          <NavLink
            to="/admin"
            end
          >
            <span>⌂</span>
            Resumen
          </NavLink>

          <NavLink
            to="/admin/peluditos"
          >
            <span>🐾</span>
            Peluditos
          </NavLink>

          <NavLink
            to="/admin/solicitudes"
          >
            <span>♡</span>
            Solicitudes
          </NavLink>
        </nav>

        {/* PIE DEL ADMIN */}
        <div className="admin-sidebar-footer">
          {usuario?.email && (
            <div className="admin-user">
              <small>
                Sesión iniciada
              </small>

              <span>
                {usuario.email}
              </span>
            </div>
          )}

          <NavLink
            to="/"
            className="admin-public-link"
          >
            ← Ver página pública
          </NavLink>

          <button
            type="button"
            className="admin-logout"
            onClick={
              manejarCerrarSesion
            }
            disabled={cerrando}
          >
            {cerrando
              ? "Cerrando..."
              : "Cerrar sesión"}
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;