function fmt(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return "—";
  return x.toLocaleString("fr-FR");
}

export default function SummaryCards({ summary }) {
  if (!summary) {
    return (
      <div className="card">
        <div className="small">Sélectionne un pays et une pandémie pour afficher les statistiques.</div>
      </div>
    );
  }

  const cards = [
    { title: "Total confirmés", value: fmt(summary.total_confirmed) },
    { title: "Total décès", value: fmt(summary.total_deaths) },
    { title: "Total guéris", value: fmt(summary.total_recovered) },
    { title: "Cas actifs", value: fmt(summary.active_cases) },
    { title: "Total tests", value: fmt(summary.total_tests) },
    { title: "Population", value: fmt(summary.population) }
  ];

  return (
    <div className="grid grid-3">
      {cards.map((c) => (
        <div className="card" key={c.title}>
          <div className="kpiTitle">{c.title}</div>
          <div className="kpiValue">{c.value}</div>
        </div>
      ))}
    </div>
  );
}
