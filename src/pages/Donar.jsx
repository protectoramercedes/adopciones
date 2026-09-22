import "../styles/donar.css";

const Donar = () => {
  const donaciones = [
    {
      monto: "$150",
      url: "https://mpago.la/1g769V4",
    },
    {
      monto: "$300",
      url: "https://mpago.la/2ZCE69N",
    },
    {
      monto: "$500",
      url: "https://mpago.la/1mGKsZo",
    },
    {
      monto: "$1000",
      url: "https://mpago.la/1QYpTpY",
    },
  ];

  const suscripcionMensual =
    "https://www.mercadopago.com.uy/subscriptions/checkout?preapproval_plan_id=c09aabb6ee6547e1bedf50b7b0b21761";

  return (
    <main className="donar-page">
      {/* HERO */}
      <section className="donar-hero">
        <span className="donar-eyebrow">
          🐾 SUMATE A AYUDAR
        </span>

        <h1>
          Cada aporte cambia
          <span> una historia.</span>
        </h1>

        <p>
          Tu colaboración nos ayuda a brindar
          alimento, medicamentos, atención
          veterinaria y cuidados diarios a los
          peluditos de la Protectora.
        </p>
      </section>

      {/* CONTENIDO */}
      <section className="donar-content">
        {/* SUSCRIPCIÓN MENSUAL */}
        <article className="donar-mensual-card">
          <div className="donar-mensual-icon">
            ❤️
          </div>

          <div className="donar-mensual-info">
            <span className="donar-card-label">
              LA FORMA MÁS SIMPLE DE AYUDAR
            </span>

            <h2>
              Ayudanos todos los meses
            </h2>

            <p>
              Convertite en colaborador mensual de
              la Protectora. Elegí el monto que
              quieras aportar y ayudanos a seguir
              cuidando a quienes más lo necesitan.
            </p>

            <a
              href={suscripcionMensual}
              target="_blank"
              rel="noopener noreferrer"
              className="donar-primary-button"
            >
              ❤️ Quiero colaborar mensualmente
            </a>

            <small>
              El pago se realiza de forma segura
              mediante Mercado Pago.
            </small>
          </div>
        </article>

        {/* DONACIÓN ÚNICA */}
        <div className="donar-section-heading">
          <span>UNA AYUDA, UNA GRAN DIFERENCIA</span>

          <h2>
            ¿Preferís colaborar una sola vez?
          </h2>

          <p>
            Elegí el monto con el que quieras
            ayudarnos.
          </p>
        </div>

        <div className="donar-montos">
          {donaciones.map((donacion) => (
            <a
              key={donacion.monto}
              href={donacion.url}
              target="_blank"
              rel="noopener noreferrer"
              className="donar-monto-card"
            >
              <span>🐾</span>

              <strong>
                {donacion.monto}
              </strong>

              <small>
                Colaborar
              </small>
            </a>
          ))}
        </div>

        {/* OTRAS FORMAS */}
        <div className="donar-section-heading donar-otras-heading">
          <span>OTRAS FORMAS DE AYUDAR</span>

          <h2>
            También podés colaborar directamente
          </h2>
        </div>

        <div className="donar-alternativas">
          <article className="donar-alternativa-card">
            <div className="donar-alternativa-icon">
              🏦
            </div>

            <div>
              <span className="donar-card-label">
                TRANSFERENCIA BANCARIA
              </span>

              <h3>BROU</h3>

              <p>
                Cuenta en pesos
              </p>

              <strong>
                001544758-00001
              </strong>

              <span className="donar-account-secondary">
                025-0308240
              </span>
            </div>
          </article>

          <article className="donar-alternativa-card">
            <div className="donar-alternativa-icon">
              💛
            </div>

            <div>
              <span className="donar-card-label">
                COLABORÁ EN ABITAB
              </span>

              <h3>Abitab</h3>

              <p>
                Acercate a cualquier local y
                colaborá mediante:
              </p>

              <strong>
                Caja 3148
              </strong>
            </div>
          </article>
        </div>

        {/* CIERRE */}
        <div className="donar-cierre">
          <span>🐾</span>

          <h2>
            No importa cuánto.
            <br />
            Cada ayuda suma.
          </h2>

          <p>
            Gracias por ser parte de esta red que
            hace posible que nuestros peluditos
            tengan alimento, cuidados y una nueva
            oportunidad.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Donar;