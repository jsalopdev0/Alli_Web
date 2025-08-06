// components/EtiquetaPrint.js
import React, { forwardRef } from 'react';

const EtiquetaPrint = forwardRef(({ etiqueta }, ref) => {
  if (!etiqueta) return null;

  return (
    <div ref={ref} className="etiqueta-print">
      <h2>📦 Etiqueta de Envío</h2>
      <hr />
      <p><strong>Remitente:</strong> {etiqueta.remitenteNombre}</p>
      <p><strong>DNI:</strong> {etiqueta.remitenteDni}</p>
      <p><strong>Teléfono:</strong> {etiqueta.remitenteTelefono}</p>
      <hr />
      <p><strong>Destinatario:</strong> {etiqueta.destinatarioNombre}</p>
      <p><strong>DNI:</strong> {etiqueta.destinatarioDni}</p>
      <p><strong>Teléfono:</strong> {etiqueta.destinatarioTelefono}</p>
      <hr />
      <p><strong>Destino:</strong> {etiqueta.destino}</p>
    </div>
  );
});

export default EtiquetaPrint;
