DROP TABLE IF EXISTS staging_summary;
CREATE TABLE staging_summary (
  country TEXT,
  continent TEXT,
  total_confirmed TEXT,
  total_deaths TEXT,
  total_recovered TEXT,
  active_cases TEXT,
  total_tests TEXT,
  population TEXT
);

DROP TABLE IF EXISTS staging_daily;
CREATE TABLE staging_daily (
  date TEXT,
  country TEXT,
  daily_new_cases TEXT,
  active_cases TEXT,
  daily_new_deaths TEXT
);

COPY staging_summary
FROM '/data/worldometer_coronavirus_summary_data_clean.csv'
WITH (FORMAT csv, HEADER true);

COPY staging_daily
FROM '/data/worldometer_coronavirus_daily_data_clean.csv'
WITH (FORMAT csv, HEADER true);


INSERT INTO "Continent" ("continent")
SELECT DISTINCT TRIM(continent)
FROM staging_summary
WHERE continent IS NOT NULL AND TRIM(continent) <> ''
ON CONFLICT ("continent") DO NOTHING;


INSERT INTO "country" ("country", "population", "Id_continent")
SELECT
  TRIM(s.country),
  NULLIF(TRIM(s.population), '')::BIGINT,
  ctn."Id_continent"
FROM staging_summary s
JOIN "Continent" ctn ON ctn."continent" = TRIM(s.continent)
WHERE s.country IS NOT NULL AND TRIM(s.country) <> ''
ON CONFLICT ("country") DO NOTHING;

DO $$
DECLARE covid_id INT;
BEGIN
  INSERT INTO "pandemic" ("name")
  VALUES ('COVID-19')
  ON CONFLICT ("name") DO NOTHING;

  SELECT "id_pandemic" INTO covid_id
  FROM "pandemic"
  WHERE "name" = 'COVID-19';

  INSERT INTO "pandemic_country" (
    "id_country","id_pandemic","total_confirmed","total_deaths",
    "total_recovered","active_cases","total_tests"
  )
  SELECT
    co."id_country",
    covid_id,
    NULLIF(TRIM(s.total_confirmed), '')::BIGINT,
    NULLIF(TRIM(s.total_deaths), '')::BIGINT,
    NULLIF(TRIM(s.total_recovered), '')::BIGINT,
    NULLIF(TRIM(s.active_cases), '')::BIGINT,
    NULLIF(TRIM(s.total_tests), '')::BIGINT
  FROM staging_summary s
  JOIN "country" co ON co."country" = TRIM(s.country)
  ON CONFLICT ("id_country","id_pandemic") DO NOTHING;

  INSERT INTO "daily_pandemic_country" (
    "id_country","id_pandemic","date","active_cases","daily_new_deaths","daily_new_cases"
  )
  SELECT
    co."id_country",
    covid_id,
    NULLIF(TRIM(d.date), '')::DATE,
    NULLIF(TRIM(d.active_cases), '')::BIGINT,
    NULLIF(TRIM(d.daily_new_deaths), '')::BIGINT,
    NULLIF(TRIM(d.daily_new_cases), '')::BIGINT
  FROM staging_daily d
  JOIN "country" co ON co."country" = TRIM(d.country)
  WHERE TRIM(d.date) <> ''
  ON CONFLICT ("id_country","id_pandemic","date") DO NOTHING;
END $$;

DROP TABLE staging_summary;
DROP TABLE staging_daily;
