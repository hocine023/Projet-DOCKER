CREATE TABLE IF NOT EXISTS "Continent" (
  "Id_continent" SERIAL PRIMARY KEY,
  "continent" VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "country" (
  "id_country" SERIAL PRIMARY KEY,
  "country" VARCHAR(255) NOT NULL UNIQUE,
  "population" BIGINT,
  "Id_continent" INT,
  FOREIGN KEY ("Id_continent") REFERENCES "Continent"("Id_continent")
);

CREATE TABLE IF NOT EXISTS "pandemic" (
  "id_pandemic" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "pandemic_country" (
  "id_country" INT,
  "id_pandemic" INT,
  "total_confirmed" BIGINT,
  "total_deaths" BIGINT,
  "total_recovered" BIGINT,
  "active_cases" BIGINT,
  "total_tests" BIGINT,
  PRIMARY KEY ("id_country","id_pandemic"),
  FOREIGN KEY ("id_country") REFERENCES "country"("id_country") ON DELETE CASCADE,
  FOREIGN KEY ("id_pandemic") REFERENCES "pandemic"("id_pandemic") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "daily_pandemic_country" (
  "id_country" INT,
  "id_pandemic" INT,
  "date" DATE,
  "active_cases" BIGINT,
  "daily_new_deaths" BIGINT,
  "daily_new_cases" BIGINT,
  PRIMARY KEY ("id_country","id_pandemic","date"),
  FOREIGN KEY ("id_country") REFERENCES "country"("id_country") ON DELETE CASCADE,
  FOREIGN KEY ("id_pandemic") REFERENCES "pandemic"("id_pandemic") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_country_continent ON "country"("Id_continent");
CREATE INDEX IF NOT EXISTS idx_daily_date ON "daily_pandemic_country"("date");
