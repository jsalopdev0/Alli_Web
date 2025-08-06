import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const getDepartamentos = () => axios.get(`${API_BASE_URL}/ubigeo/departamentos`);
export const getProvincias = (departamento) => axios.get(`${API_BASE_URL}/ubigeo/provincias`, { params: { departamento } });
export const getDistritos = (departamento, provincia) => axios.get(`${API_BASE_URL}/ubigeo/distritos`, { params: { departamento, provincia } });
export const getAgencias = (departamento, provincia, distrito) => axios.get(`${API_BASE_URL}/ubigeo/agencias`, { params: { departamento, provincia, distrito } });

export const generarEtiqueta = (data) => axios.post(`${API_BASE_URL}/etiquetas`, data);

// ✅ Nuevo método para obtener nombre desde backend
export const obtenerNombrePorDni = (dni) =>
  axios.get(`${API_BASE_URL}/etiquetas/nombre`, { params: { dni } });
