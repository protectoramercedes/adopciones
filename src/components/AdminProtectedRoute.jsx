import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const AdminProtectedRoute = () => {
  const {
    usuario,
    cargandoAuth,
  } = useAuth();

  if (cargandoAuth) {
    return (
      <div className="admin-auth-loading">
        <span>🐾</span>
        <p>Cargando administración...</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  return <Outlet />;
};

export default AdminProtectedRoute;