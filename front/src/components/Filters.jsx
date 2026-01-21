export default function Filters({
  countries,
  pandemics,
  countryId,
  pandemicId,
  statType,
  startDate,
  endDate,
  onChange
}) {
 return (
  <div className="card">

    {/* Ligne 1 : Pays | Pandémie */}
    <div className="grid grid-2">
      <div>
        <div className="label">Pays</div>
        <select value={countryId} onChange={(e) => onChange({ countryId: e.target.value })}>
          <option value="" disabled>Sélectionner un pays</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <div className="label">Pandémie</div>
        <select value={pandemicId} onChange={(e) => onChange({ pandemicId: e.target.value })}>
          <option value="" disabled>Sélectionner une pandémie</option>
          {pandemics.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
    </div>

    <div style={{ height: 12 }} />

    {/* Ligne 2 : Statistique | Date début | Date fin */}
    <div className="filtersRow3">
      <div>
        <div className="label">Statistique</div>
        <select value={statType} onChange={(e) => onChange({ statType: e.target.value })}>
          <option value="daily_new_cases">Cas (nouveaux / jour)</option>
          <option value="daily_new_deaths">Décès (nouveaux / jour)</option>
          <option value="active_cases">Cas actifs</option>
        </select>
      </div>

      <div>
        <div className="label">Date début</div>
        <input
          type="date"
          value={startDate}
          max={endDate}
          onChange={(e) => onChange({ startDate: e.target.value })}
        />
      </div>

      <div>
        <div className="label">Date fin</div>
        <input
          type="date"
          value={endDate}
          min={startDate}
          onChange={(e) => onChange({ endDate: e.target.value })}
        />
      </div>
    </div>
  </div>
);
}