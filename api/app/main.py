import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text

DATABASE_URL = os.environ.get("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set (example: postgresql+psycopg://user:pass@db:5432/pandemic)")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)

app = FastAPI(title="Pandemic API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"ok": True}


@app.get("/country")
def list_countries():
    sql = """
    SELECT "id_country" AS id,
           "country" AS name
    FROM "country"
    ORDER BY "country";
    """
    with engine.connect() as conn:
        rows = conn.execute(text(sql)).mappings().all()
    return list(rows)


@app.get("/pandemic")
def list_pandemics():
    sql = """
    SELECT "id_pandemic" AS id,
           "name"
    FROM "pandemic"
    ORDER BY "id_pandemic";
    """
    with engine.connect() as conn:
        rows = conn.execute(text(sql)).mappings().all()
    return list(rows)


@app.get("/pandemic_country/{country_id}/{pandemic_id}")
def get_summary(country_id: int, pandemic_id: int):
    sql = """
    SELECT
      pc."id_country",
      pc."id_pandemic",
      pc."total_confirmed",
      pc."total_deaths",
      pc."total_recovered",
      pc."active_cases",
      pc."total_tests",
      c."country" AS country_name,
      c."population",
      ct."continent"
    FROM "pandemic_country" pc
    JOIN "country" c
      ON c."id_country" = pc."id_country"
    LEFT JOIN "Continent" ct
      ON ct."Id_continent" = c."Id_continent"
    WHERE pc."id_country" = :cid
      AND pc."id_pandemic" = :pid;
    """
    with engine.connect() as conn:
        row = conn.execute(text(sql), {"cid": country_id, "pid": pandemic_id}).mappings().first()

    if not row:
        raise HTTPException(status_code=404, detail="No summary data found for this country/pandemic")

    return dict(row)


@app.get("/daily_pandemic_country/{country_id}/{pandemic_id}")
def get_daily(country_id: int, pandemic_id: int):
    sql = """
    SELECT
      "date",
      "daily_new_cases",
      "daily_new_deaths",
      "active_cases"
    FROM "daily_pandemic_country"
    WHERE "id_country" = :cid
      AND "id_pandemic" = :pid
    ORDER BY "date";
    """
    with engine.connect() as conn:
        rows = conn.execute(text(sql), {"cid": country_id, "pid": pandemic_id}).mappings().all()

    return list(rows)
