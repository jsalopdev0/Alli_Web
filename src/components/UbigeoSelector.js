import React, { useState, useEffect } from 'react';

const UbigeoSelector = ({ onDestinoChange }) => {
  const [destino, setDestino] = useState('');

  useEffect(() => {
    onDestinoChange(destino);
  }, [destino, onDestinoChange]);

  return (
    <input
      type="text"
      placeholder="Buscar destino..."
      value={destino}
      onChange={(e) => setDestino(e.target.value)}
    />
  );
};

export default UbigeoSelector;
