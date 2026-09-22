import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargandoAuth, setCargandoAuth] =
    useState(true);

  useEffect(() => {
    const cargarSesion = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUsuario(session?.user ?? null);
      setCargandoAuth(false);
    };

    cargarSesion();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUsuario(session?.user ?? null);
        setCargandoAuth(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const iniciarSesion = async (
    email,
    password
  ) => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw error;
    }

    return data;
  };

  const cerrarSesion = async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargandoAuth,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error(
      "useAuth debe utilizarse dentro de AuthProvider."
    );
  }

  return contexto;
};