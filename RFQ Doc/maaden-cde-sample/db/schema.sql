-- Maaden ARGP CDE Asset Data Backbone — schema v1.0
-- Postgres 16. Aligned to plan §3 and Master Roadmap T-173 (MEL / Tag Register / System-Subsystem).

DROP SCHEMA IF EXISTS cde CASCADE;
CREATE SCHEMA cde;
SET search_path TO cde;

-- ============ REFERENCE / LIBRARY SIDE ============

CREATE TABLE standards (
  id            SERIAL PRIMARY KEY,
  code          TEXT NOT NULL UNIQUE,          -- 'API 610'
  title         TEXT NOT NULL,
  body          TEXT,                          -- issuing body
  revision      TEXT,
  discipline    TEXT,
  source_doc    TEXT
);

CREATE TABLE product_types (
  id            SERIAL PRIMARY KEY,
  class_code    TEXT NOT NULL UNIQUE,          -- 'PUMP-CENT'
  name          TEXT NOT NULL,
  parent_id     INT REFERENCES product_types(id),
  discipline    TEXT,
  asset_class   TEXT NOT NULL CHECK (asset_class IN ('STR','ELE','EQP','MAT'))
);

CREATE TABLE properties (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  symbol        TEXT,
  datatype      TEXT NOT NULL CHECK (datatype IN ('number','text','enum','boolean','date')),
  default_uom   TEXT,
  definition_source TEXT
);

CREATE TABLE data_templates (
  id            SERIAL PRIMARY KEY,
  code          TEXT NOT NULL,                 -- 'DT-EQP-PUMP-001'
  product_type_id INT NOT NULL REFERENCES product_types(id),
  revision      TEXT NOT NULL DEFAULT '0',
  status        TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft','Review','Approved','Superseded')),
  UNIQUE (code, revision)
);

CREATE TABLE template_properties (
  id            SERIAL PRIMARY KEY,
  template_id   INT NOT NULL REFERENCES data_templates(id) ON DELETE CASCADE,
  property_id   INT NOT NULL REFERENCES properties(id),
  mandatory     BOOLEAN NOT NULL DEFAULT FALSE,
  uom           TEXT,
  validation    JSONB,                         -- e.g. {"check":"range","min":0,"max":2000}
  UNIQUE (template_id, property_id)
);

CREATE TABLE standard_product_type (
  standard_id   INT NOT NULL REFERENCES standards(id),
  product_type_id INT NOT NULL REFERENCES product_types(id),
  PRIMARY KEY (standard_id, product_type_id)
);

CREATE TABLE standard_template (
  standard_id   INT NOT NULL REFERENCES standards(id),
  template_id   INT NOT NULL REFERENCES data_templates(id),
  PRIMARY KEY (standard_id, template_id)
);

-- ============ PLANT / INSTANCE SIDE ============

CREATE TABLE plant_hierarchy (
  id            SERIAL PRIMARY KEY,
  code          TEXT NOT NULL UNIQUE,          -- '310', '311', '311-PU', '311-PU-01'
  name          TEXT NOT NULL,
  level         TEXT NOT NULL CHECK (level IN ('Area','Unit','System','Subsystem')),
  parent_id     INT REFERENCES plant_hierarchy(id)
);

CREATE TABLE assets (
  id            SERIAL PRIMARY KEY,
  tag           TEXT NOT NULL UNIQUE,          -- 'EQP-000789'
  asset_class   TEXT NOT NULL CHECK (asset_class IN ('STR','ELE','EQP','MAT')),
  name          TEXT NOT NULL,
  product_type_id INT REFERENCES product_types(id),
  template_id   INT REFERENCES data_templates(id),
  hierarchy_id  INT REFERENCES plant_hierarchy(id),
  revision      TEXT NOT NULL DEFAULT '0',
  lifecycle     TEXT NOT NULL DEFAULT 'Registered'
                CHECK (lifecycle IN ('Registered','Data Loaded','Validated','Published'))
);

CREATE TABLE asset_property_values (
  id            SERIAL PRIMARY KEY,
  asset_id      INT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  property_id   INT NOT NULL REFERENCES properties(id),
  value         TEXT,
  uom           TEXT,
  source        TEXT CHECK (source IN ('engineering','vendor','field')),
  confidence    NUMERIC,
  UNIQUE (asset_id, property_id)
);

CREATE TABLE documents (
  id            SERIAL PRIMARY KEY,
  doc_no        TEXT NOT NULL UNIQUE,          -- 'ARGP-310-DS-0789'
  title         TEXT,
  doc_type      TEXT,                          -- Datasheet / P&ID / ITP ...
  revision      TEXT NOT NULL DEFAULT '0',
  cde_state     TEXT NOT NULL DEFAULT 'WIP' CHECK (cde_state IN ('WIP','Shared','Published','Archived'))
);

CREATE TABLE document_assets (
  document_id   INT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  asset_id      INT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, asset_id)
);

CREATE TABLE asset_revisions (
  id            SERIAL PRIMARY KEY,
  asset_id      INT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  revision      TEXT NOT NULL,
  note          TEXT,
  created_by    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ GOVERNANCE SIDE ============

CREATE TABLE validation_rules (
  id            SERIAL PRIMARY KEY,
  family        TEXT NOT NULL CHECK (family IN ('framework','quality','technical')),
  name          TEXT NOT NULL,
  expression    JSONB NOT NULL,
  severity      TEXT NOT NULL DEFAULT 'fail' CHECK (severity IN ('fail','warn')),
  standard_id   INT REFERENCES standards(id),
  active        BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE validation_runs (
  id            SERIAL PRIMARY KEY,
  ruleset_version TEXT,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at   TIMESTAMPTZ,
  assets_checked INT,
  pass_count    INT, warn_count INT, fail_count INT
);

CREATE TABLE validation_findings (
  id            SERIAL PRIMARY KEY,
  run_id        INT NOT NULL REFERENCES validation_runs(id) ON DELETE CASCADE,
  asset_id      INT NOT NULL REFERENCES assets(id),
  rule_id       INT NOT NULL REFERENCES validation_rules(id),
  family        TEXT NOT NULL,
  severity      TEXT NOT NULL,
  message       TEXT NOT NULL,
  resolved      BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE publish_targets (
  id            SERIAL PRIMARY KEY,
  system_name   TEXT NOT NULL UNIQUE,          -- 'Oracle Aconex'
  family        TEXT NOT NULL,                 -- one of the 6 vision families
  protocol      TEXT,                          -- REST/OData/SAML...
  status        TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('connected','queued','planned'))
);

CREATE TABLE publish_events (
  id            SERIAL PRIMARY KEY,
  asset_id      INT NOT NULL REFERENCES assets(id),
  target_id     INT NOT NULL REFERENCES publish_targets(id),
  payload       JSONB NOT NULL,
  payload_sha256 TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sent','blocked')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id            SERIAL PRIMARY KEY,
  username      TEXT NOT NULL UNIQUE,
  display_name  TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('governance_lead','engineer','doc_controller','viewer'))
);

CREATE TABLE audit_log (
  id            SERIAL PRIMARY KEY,
  actor         TEXT NOT NULL,
  action        TEXT NOT NULL,
  entity        TEXT NOT NULL,
  entity_id     TEXT,
  before        JSONB,
  after         JSONB,
  at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_assets_hierarchy ON assets(hierarchy_id);
CREATE INDEX idx_apv_asset ON asset_property_values(asset_id);
CREATE INDEX idx_findings_run ON validation_findings(run_id);
CREATE INDEX idx_events_asset ON publish_events(asset_id);
