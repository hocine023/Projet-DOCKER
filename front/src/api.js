import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function fetchCountries() {
  const r = await axios.get(`${API_URL}/country`);
  return r.data;
}

export async function fetchPandemics() {
  const r = await axios.get(`${API_URL}/pandemic`);
  return r.data;
}

export async function fetchSummary(countryId, pandemicId) {
  const r = await axios.get(`${API_URL}/pandemic_country/${countryId}/${pandemicId}`);
  return r.data;
}

export async function fetchDaily(countryId, pandemicId) {
  const r = await axios.get(`${API_URL}/daily_pandemic_country/${countryId}/${pandemicId}`);
  return r.data;
}
