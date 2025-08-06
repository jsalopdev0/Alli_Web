import React, { useState, useEffect, useRef } from "react";
import BuscadorDestino from "./components/BuscadorDestino";
import { generarEtiqueta, obtenerNombrePorDni } from "./services/api";
import "./App.css";

function App() {
  const [dni, setDni] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [destino, setDestino] = useState("");
  const [etiqueta, setEtiqueta] = useState(null);
  const [detalle, setDetalle] = useState("");
  const [fecha, setFecha] = useState("06/08/2025");

  const etiquetaRef = useRef(null);

  useEffect(() => {
    const fetchNombre = async () => {
      if (dni.length === 8) {
        try {
          const response = await obtenerNombrePorDni(dni);
          setNombre(response.data);
        } catch (error) {
          console.error("Error buscando nombre:", error);
          setNombre("");
        }
      } else {
        setNombre("");
      }
    };
    fetchNombre();
  }, [dni]);

  const handleSubmit = async () => {
    try {
      const response = await generarEtiqueta({
        destinatario: { dni, telefono, destino },
      });
      setEtiqueta(response.data);
    } catch (error) {
      console.error(error);
      alert("Error generando etiqueta");
    }
  };

  const handlePrint = () => {
    const content = etiquetaRef.current.innerHTML;
    const printWindow = window.open("", "", "width=600,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Etiqueta</title>
          <style>
            @media print {
              @page {
                size: 58mm 115mm;
                margin: 0;
              }
              body {
                margin: 0;
                padding: 0;
              }
              .etiqueta-box {
                margin: 0;
                padding: 4px;
                width: 50mm;
                font-family: Arial, sans-serif;
                font-size: 11.5px;
                line-height: 1.2;
                white-space: normal;
                word-break: break-word;
                overflow-wrap: break-word;
                box-sizing: border-box;
              }
              .etiqueta-box p {
                margin: 0 0 4px 0;
                max-width: 100%;
              }
            }
            body { margin: 0; padding: 0; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="etiqueta-box">${content}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handlePrintDetalle = () => {
    const items = detalle
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => `<li style="margin-bottom: 2px;">${line.trim()}</li>`)
      .join("");

    const printWindow = window.open("", "", "width=600,height=600");
    printWindow.document.write(`
    <html>
      <head>
        <title>Detalle de Compra</title>
        <style>
          @media print {
            @page {
              size: 58mm auto;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 10px;
              font-family: Arial, sans-serif;
              font-size: 11.5px;
              line-height: 1.4;
              text-align: left;
            }
            ul {
              padding-left: 1em;
              margin: 0;
            }
            li {
              margin-bottom: 2px;
            }
            .mensaje-final {
              margin-top: 12px;
              font-weight: bold;
              font-size: 12px;
              color: #d63384;
      text-align: left; /* ✅ ahora sí se alinea a la izquierda */
            }
           .kitty-img {
      display: block;
      margin-top: 4px;
      margin-left: 0;   /* ✅ ya no se centra */
      margin-right: 0;
      width: 55px;
            }
          }
        </style>
      </head>
      <body onload="window.print(); window.close();">
  <h4>🛍️ Detalle de Compra</h4>
  <p><strong>Fecha:</strong> ${fecha}</p>
  <p><strong>Descripción:</strong></p>
  <ul>${items}</ul>
  <div class="mensaje-final">¡Gracias por tu compra! ¡Bendiciones! 💖</div>
  <img class="kitty-img" src="https://yt3.googleusercontent.com/lmhxsfsw0iCPZ-LjfDuzl9jG7T5imPf91qW70tOTVAKEPNv2dLq0K4vGzfNX0eR5plVjrlwa_3c=s900-c-k-c0x00ffffff-no-rj" alt="Hello Kitty" />
</body>

    </html>
  `);
    printWindow.document.close();
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">Generador de Etiquetas de Alli Cases</h1>

      <div className="row">
        {/* Formulario */}
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-3">Datos de mi case:</h4>

              <div className="mb-3">
                <label className="form-label">DNI destinatario:</label>
                <input
                  type="text"
                  className="form-control"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Nombre completo:</label>
                <input
                  type="text"
                  className="form-control"
                  value={nombre}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Teléfono:</label>
                <input
                  type="text"
                  className="form-control"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Destino:</label>
                <BuscadorDestino onSelect={setDestino} />
              </div>

              <button className="btn btn-primary w-100" onClick={handleSubmit}>
                Generar Etiqueta
              </button>
            </div>
          </div>
        </div>

        {/* Etiqueta generada */}
        <div className="col-md-6">
          {etiqueta && (
            <div
              className="container mt-4 p-4 border rounded bg-light"
              style={{ maxWidth: "800px" }}
            >
              <h2 className="mb-4">📦 Datos de Envío</h2>
              <div ref={etiquetaRef}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <h4>Remitente</h4>
                    <p>
                      <strong>Nombre:</strong> {etiqueta.remitenteNombre}
                    </p>
                    <p>
                      <strong>DNI:</strong> {etiqueta.remitenteDni}
                    </p>
                    <p>
                      <strong>Teléfono:</strong> {etiqueta.remitenteTelefono}
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <h4>Destinatario</h4>
                    <p>
                      <strong>Nombre:</strong> {etiqueta.destinatarioNombre}
                    </p>
                    <p>
                      <strong>DNI:</strong> {etiqueta.destinatarioDni}
                    </p>
                    <p>
                      <strong>Teléfono:</strong> {etiqueta.destinatarioTelefono}
                    </p>
                    {etiqueta.destino &&
                      (() => {
                        const partes = etiqueta.destino.split("/");
                        const linea1 = `${partes[0]} / ${partes[1]}`;
                        const linea2 = `${partes[2]} / ${partes[3]}`;
                        return (
                          <>
                            <p>
                              <strong>Destino:</strong> {linea1.toUpperCase()}
                            </p>
                            <p>{linea2.toUpperCase()}</p>
                          </>
                        );
                      })()}
                  </div>
                </div>
              </div>
              <button className="btn btn-success mt-3" onClick={handlePrint}>
                🖨️ Imprimir Etiqueta
              </button>
            </div>
          )}
        </div>

        {/* Detalle de compra */}
        <div className="col-12 mt-4">
          <div
            className="card shadow-sm border border-pink"
            style={{ borderRadius: "1rem", background: "#ffeaf4" }}
          >
            <div className="card-body">
              <h4
                className="card-title text-center"
                style={{ color: "#d63384" }}
              >
                🛍️ Detalle de Compra
              </h4>

              <div className="mb-3">
                <label className="form-label">
                  Descripción del pedido (una prenda por línea):
                </label>
                <textarea
                  className="form-control"
                  rows="12"
                  placeholder="Ej. 2 casacas"
                  style={{ borderRadius: "0.5rem" }}
                  value={detalle}
                  onChange={(e) => setDetalle(e.target.value)}
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Fecha:</label>
                <input
                  type="text"
                  className="form-control"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  style={{ maxWidth: "200px", borderRadius: "0.5rem" }}
                />
              </div>

              <div className="text-center">
                <button
                  className="btn btn-success w-100"
                  onClick={handlePrintDetalle}
                >
                  🖨️ Imprimir Detalle de Compra
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
