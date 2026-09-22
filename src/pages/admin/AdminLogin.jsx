import { useState } from "react";
import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext.jsx";

const AdminLogin = () => {
  const navigate = useNavigate();

  const {
    usuario,
    cargandoAuth,
    iniciarSesion,
  } = useAuth();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [enviando, setEnviando] =
    useState(false);

  if (cargandoAuth) {
    return (
      <div className="admin-login-loading">
        Cargando...
      </div>
    );
  }

  if (usuario) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  const manejarSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setEnviando(true);

      await iniciarSesion(
        email,
        password
      );

      navigate("/admin", {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      setError(
        "Correo o contraseña incorrectos."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <img
          src="/logoprote.png"
          alt="Protectora San Francisco de Asís"
        />

        <span className="admin-eyebrow">
          ADMINISTRACIÓN
        </span>

        <h1>Bienvenida</h1>

        <p>
          Ingresá para administrar los
          peluditos de la Protectora.
        </p>

        <form onSubmit={manejarSubmit}>
          <label>
            Correo electrónico

            <input
              required
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="correo@ejemplo.com"
            />
          </label>

          <label>
            Contraseña

            <input
              required
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="••••••••"
            />
          </label>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-primary-button"
            disabled={enviando}
          >
            {enviando
              ? "Ingresando..."
              : "Ingresar"}
          </button>
        </form>

        <a
          href="/"
          className="admin-login-back"
        >
          ← Volver a la página
        </a>
      </div>
    </main>
  );
};

export default AdminLogin;