import {
  useState,
} from "react";

import {
  Navigate,
  useNavigate,
} from "react-router-dom";

import {
  useAuth,
} from "../../context/AuthContext.jsx";

const ADMIN_USERNAME =
  "protectoramercedes";

const ADMIN_EMAIL =
  import.meta.env.VITE_ADMIN_EMAIL;

const AdminLogin = () => {
  const navigate =
    useNavigate();

  const {
    usuario,
    cargandoAuth,
    iniciarSesion,
  } = useAuth();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    mostrarPassword,
    setMostrarPassword,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [enviando, setEnviando] =
    useState(false);

  /* =========================================
     CARGANDO AUTH
     ========================================= */

  if (cargandoAuth) {
    return (
      <div className="admin-login-loading">
        Cargando...
      </div>
    );
  }

  /* =========================================
     YA ESTÁ LOGUEADO
     ========================================= */

  if (usuario) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  /* =========================================
     LOGIN
     ========================================= */

  const manejarSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const usuarioIngresado =
        username
          .trim()
          .toLowerCase();

      if (
        usuarioIngresado !==
        ADMIN_USERNAME
      ) {
        setError(
          "Usuario o contraseña incorrectos."
        );

        return;
      }

      if (!ADMIN_EMAIL) {
        console.error(
          "Falta VITE_ADMIN_EMAIL."
        );

        setError(
          "No se pudo iniciar sesión. Revisá la configuración."
        );

        return;
      }

      setEnviando(true);

      await iniciarSesion(
        ADMIN_EMAIL,
        password
      );

      navigate(
        "/admin",
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error(
        "Error iniciando sesión:",
        error
      );

      setError(
        "Usuario o contraseña incorrectos."
      );
    } finally {
      setEnviando(false);
    }
  };

  /* =========================================
     RENDER
     ========================================= */

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

        <h1>
          Bienvenidas
        </h1>

        <p>
          Ingresá para administrar los
          peluditos de la Protectora.
        </p>

        <form
          onSubmit={manejarSubmit}
        >

          {/* USUARIO */}

          <label>
            Usuario

            <input
              required
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
              placeholder="Usuario"
              autoComplete="username"
            />
          </label>

          {/* CONTRASEÑA */}

          <label>
            Contraseña

            <div className="admin-password-field">

              <input
                required
                type={
                  mostrarPassword
                    ? "text"
                    : "password"
                }
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                placeholder="••••••••"
                autoComplete="current-password"
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() =>
                  setMostrarPassword(
                    (actual) =>
                      !actual
                  )
                }
                aria-label={
                  mostrarPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
                title={
                  mostrarPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {mostrarPassword
                  ? "🙈"
                  : "👁️"}
              </button>

            </div>
          </label>

          {/* ERROR */}

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          {/* INGRESAR */}

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