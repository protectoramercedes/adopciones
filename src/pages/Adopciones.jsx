import { useMemo, useState } from "react";

import PeluditoCard from "../components/PeluditoCard.jsx";
import perros from "../data/perros.js";

const Adopciones = () => {
  const [busqueda, setBusqueda] = useState("");
  const [sexo, setSexo] = useState("");
  const [tamano, setTamano] = useState("");
  const [energia, setEnergia] = useState("");

  const perrosFiltrados = useMemo(() => {
    return perros.filter((perro) => {
      const coincideBusqueda = perro.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());

      const coincideSexo =
        !sexo || perro.sexo === sexo;

      const coincideTamano =
        !tamano || perro.tamano === tamano;

      const coincideEnergia =
        !energia || perro.energia === energia;

      return (
        coincideBusqueda &&
        coincideSexo &&
        coincideTamano &&
        coincideEnergia
      );
    });
  }, [busqueda, sexo, tamano, energia]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setSexo("");
    setTamano("");
    setEnergia("");
  };

  return (
    <main className="adopciones-page">

      <section className="adopciones-hero">
        <span className="adopciones-eyebrow">
          🐾 ENCONTRÁ A TU COMPAÑERO
        </span>

        <h1>
          Peluditos buscando
          <span> una familia.</span>
        </h1>

        <p>
          Cada uno tiene una historia diferente,
          una personalidad única y muchísimo amor
          esperando para dar.
        </p>
      </section>

      <section className="catalogo">

        <div className="filtros-box">

          <div className="buscador">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) =>
                setBusqueda(e.target.value)
              }
            />
          </div>

          <select
            value={sexo}
            onChange={(e) =>
              setSexo(e.target.value)
            }
          >
            <option value="">Todos</option>
            <option value="Hembra">
              Hembras
            </option>
            <option value="Macho">
              Machos
            </option>
          </select>

          <select
            value={tamano}
            onChange={(e) =>
              setTamano(e.target.value)
            }
          >
            <option value="">
              Todos los tamaños
            </option>
            <option value="Pequeño">
              Pequeño
            </option>
            <option value="Mediano">
              Mediano
            </option>
            <option value="Grande">
              Grande
            </option>
          </select>

          <select
            value={energia}
            onChange={(e) =>
              setEnergia(e.target.value)
            }
          >
            <option value="">
              Todas las personalidades
            </option>
            <option value="Tranquila">
              Tranquilo/a
            </option>
            <option value="Moderada">
              Moderado/a
            </option>
            <option value="Activo">
              Activo/a
            </option>
          </select>

          <button
            className="limpiar-filtros"
            onClick={limpiarFiltros}
            type="button"
          >
            Limpiar
          </button>
        </div>

        <div className="catalogo-info">
          <p>
            Mostrando{" "}
            <strong>
              {perrosFiltrados.length}
            </strong>{" "}
            {perrosFiltrados.length === 1
              ? "peludito"
              : "peluditos"}
          </p>
        </div>

        {perrosFiltrados.length > 0 ? (
          <div className="peluditos-grid">
            {perrosFiltrados.map((perro) => (
              <PeluditoCard
                key={perro.id}
                perro={perro}
              />
            ))}
          </div>
        ) : (
          <div className="sin-resultados">
            <span>🐾</span>

            <h2>
              No encontramos peluditos
            </h2>

            <p>
              Probá cambiando alguno de los
              filtros.
            </p>

            <button
              type="button"
              onClick={limpiarFiltros}
            >
              Ver todos
            </button>
          </div>
        )}

      </section>
    </main>
  );
};

export default Adopciones;