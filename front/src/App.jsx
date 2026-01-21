import { useEffect, useState } from "react";
import Filters from "./components/Filters.jsx";
import SummaryCards from "./components/SummaryCards.jsx";
import LineChart from "./components/LineChart.jsx";
import { fetchCountries, fetchPandemics, fetchSummary, fetchDaily } from "./api.js";

export default function App() {
  const [countries, setCountries] = useState([]);
  const [pandemics, setPandemics] = useState([]);

  const [countryId, setCountryId] = useState("");
  const [pandemicId, setPandemicId] = useState("");

  const [statType, setStatType] = useState("daily_new_cases");
  const [startDate, setStartDate] = useState("2020-01-01");
  const [endDate, setEndDate] = useState("2025-01-01");

  const [summary, setSummary] = useState(null);
  const [daily, setDaily] = useState([]);

  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [c, p] = await Promise.all([fetchCountries(), fetchPandemics()]);
        setCountries(c);
        setPandemics(p);
        setError("");
      } catch {
        setError("Impossible de charger les listes (API). Vérifie que l’API tourne.");
      }
    })();
  }, []);

  useEffect(() => {
    if (!countryId || !pandemicId) return;

    (async () => {
      try {
        const [s, d] = await Promise.all([
          fetchSummary(countryId, pandemicId),
          fetchDaily(countryId, pandemicId)
        ]);
        setSummary(s);
        setDaily(d);
        setError("");
      } catch {
        setSummary(null);
        setDaily([]);
        setError("Erreur lors de la récupération des données. Vérifie l’API et les IDs.");
      }
    })();
  }, [countryId, pandemicId]);

  const onChange = (patch) => {
    if (patch.countryId !== undefined) setCountryId(patch.countryId);
    if (patch.pandemicId !== undefined) setPandemicId(patch.pandemicId);
    if (patch.statType !== undefined) setStatType(patch.statType);
    if (patch.startDate !== undefined) setStartDate(patch.startDate);
    if (patch.endDate !== undefined) setEndDate(patch.endDate);
  };

  const countryName = countries.find((c) => String(c.id) === String(countryId))?.name;

  return (
    <div className="container">
      <div className="header">
        <div className="title">Pandemic Dashboard</div>
        <div className="small">{countryName ? `Pays : ${countryName}` : "Sélectionne un pays"}</div>
      </div>

      <div style={{ height: 12 }} />

      <Filters
        countries={countries}
        pandemics={pandemics}
        countryId={countryId}
        pandemicId={pandemicId}
        statType={statType}
        startDate={startDate}
        endDate={endDate}
        onChange={onChange}
      />

      <div style={{ height: 12 }} />

      {error && <div className="error">{error}</div>}

      <div style={{ height: 12 }} />

      <SummaryCards summary={summary} />

      <div style={{ height: 12 }} />

      <LineChart daily={daily} statType={statType} startDate={startDate} endDate={endDate} />

      <div className="footerNote"></div>
    </div>
  );
}
