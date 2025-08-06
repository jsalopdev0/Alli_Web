import React, { useState, useEffect, useRef } from "react";

function BuscadorDestino({ onSelect }) {
  const [todosLosDestinos, setTodosLosDestinos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [sugerencias, setSugerencias] = useState([]);

  const wrapperRef = useRef(null);

  useEffect(() => {
    fetch("/agencias_shalom.json")
      .then(res => res.json())
      .then(data => {
        const destinos = [];
        for (const departamento in data) {
          for (const provincia in data[departamento]) {
            for (const distrito in data[departamento][provincia]) {
              for (const agencia of data[departamento][provincia][distrito]) {
                destinos.push(`${departamento}/${provincia}/${distrito}/${agencia}`);
              }
            }
          }
        }
        setTodosLosDestinos(destinos);
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSugerencias([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInput = (e) => {
    const texto = e.target.value;
    setFiltro(texto);
    const sugeridos = todosLosDestinos.filter(dest =>
      dest.toLowerCase().includes(texto.toLowerCase())
    );
    setSugerencias(sugeridos.slice(0, 10));
  };

  const handleSelect = (destino) => {
    setFiltro(destino);
    setSugerencias([]);
    onSelect(destino);
  };

  return (
    <div style={{ position: "relative" }} ref={wrapperRef}>
      <input
        type="text"
        className="form-control"
        placeholder="Buscar destino..."
        value={filtro}
        onChange={handleInput}
      />
      {sugerencias.length > 0 && (
        <ul
          className="list-group position-absolute w-100"
          style={{ zIndex: 10, top: '100%' }}
        >
          {sugerencias.map((d, i) => (
            <li
              key={i}
              className="list-group-item list-group-item-action"
              onClick={() => handleSelect(d)}
              style={{ cursor: "pointer" }}
            >
              {d}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BuscadorDestino;
