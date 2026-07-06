-- Maaden ARGP CDE — demo seed v1.0 (the "Pump Package story")
-- Idempotent when run after schema.sql (schema drops/recreates).
SET search_path TO cde;

-- ---- Standards
INSERT INTO standards (code,title,body,revision,discipline) VALUES
('API 610','Centrifugal Pumps for Petroleum, Petrochemical and Natural Gas Industries','API','12th','Mechanical'),
('ASME VIII','Pressure Vessels Division 1','ASME','2023','Mechanical'),
('MCIS-STR-01','Maaden Structural Standard','Maaden','03','Structural'),
('ASTM A240','Standard Specification for Stainless Steel Plate, Sheet and Strip','ASTM','24a','Materials'),
('IEC 61439','Low-voltage Switchgear and Controlgear Assemblies','IEC','3.0','Electrical');

-- ---- Product types
INSERT INTO product_types (class_code,name,discipline,asset_class) VALUES
('PUMP-CENT','Centrifugal Pump','Mechanical','EQP'),        -- 1
('VESSEL-V','Vessel, Vertical','Mechanical','EQP'),         -- 2
('STL-FRAME','Structural Steel Frame','Structural','STR'),  -- 3
('CLAD-PANEL','Cladding Panel','Structural','STR'),         -- 4
('EHOUSE','E-House / Switchroom Module','Electrical','ELE'),-- 5
('SS-PLATE','Stainless Steel Plate Material','Materials','MAT'); -- 6

INSERT INTO standard_product_type VALUES (1,1),(2,2),(3,3),(3,4),(5,5),(4,6);

-- ---- Properties
INSERT INTO properties (name,symbol,datatype,default_uom) VALUES
('Flow rate','Q','number','m3/h'),          -- 1
('Pressure (design)','P','number','bar'),   -- 2
('Power (absorbed)','Pw','number','kW'),    -- 3
('Material (casing)',NULL,'enum',NULL),     -- 4
('Asset class label',NULL,'enum',NULL),     -- 5
('Seal plan',NULL,'text',NULL),             -- 6
('Busbar rating','A','number','A'),         -- 7
('Enclosure rating',NULL,'text',NULL),      -- 8
('Member length','L','number','mm'),        -- 9
('Steel grade',NULL,'text',NULL),           -- 10
('Yield strength','Re','number','MPa'),     -- 11
('Plate thickness','t','number','mm');      -- 12

-- ---- Data templates
INSERT INTO data_templates (code,product_type_id,revision,status) VALUES
('DT-EQP-PUMP-001',1,'A','Approved'),   -- 1
('DT-ELE-EHSE-002',5,'C','Approved'),   -- 2
('DT-STR-FRAM-004',3,'B','Approved'),   -- 3
('DT-MAT-PLAT-001',6,'D','Approved');   -- 4

INSERT INTO standard_template VALUES (1,1),(5,2),(3,3),(4,4);

INSERT INTO template_properties (template_id,property_id,mandatory,uom,validation) VALUES
(1,1,TRUE ,'m3/h','{"check":"range","min":0,"max":2000}'),
(1,2,TRUE ,'bar' ,'{"check":"range","min":0,"max":100}'),
(1,3,TRUE ,'kW'  ,'{"check":"range","min":0,"max":5000}'),
(1,4,TRUE ,NULL  ,'{"check":"enum","values":["SS316","SS304","CS","Duplex"]}'),
(1,5,TRUE ,NULL  ,'{"check":"enum","values":["Pump Package"]}'),
(1,6,FALSE,NULL  ,NULL),
(2,7,TRUE ,'A'   ,'{"check":"range","min":100,"max":6300}'),
(2,8,TRUE ,NULL  ,NULL),
(3,9,TRUE ,'mm'  ,'{"check":"uom_matches"}'),
(3,10,TRUE,NULL  ,NULL),
(4,11,TRUE,'MPa' ,'{"check":"standard_limit","op":">=","value":205,"standard":"ASTM A240"}'),
(4,12,TRUE,'mm'  ,'{"check":"range","min":1,"max":150}');
-- ---- Plant hierarchy
INSERT INTO plant_hierarchy (code,name,level,parent_id) VALUES
('100','Crushing','Area',NULL),            -- 1
('220','Grinding','Area',NULL),            -- 2
('221','Ball Mill','Unit',2),              -- 3
('221-ML','Mill Line','System',3),         -- 4
('310','CIL Circuit','Area',NULL),         -- 5
('311','Leach Tanks','Unit',5),            -- 6
('311-PU','Pumping','System',6),           -- 7
('311-PU-01','Pumping Subsystem 01','Subsystem',7), -- 8
('410','Elution','Area',NULL),             -- 9
('900','Infrastructure','Area',NULL);      -- 10

-- ---- Assets (the 4-asset demo story + extras)
INSERT INTO assets (tag,asset_class,name,product_type_id,template_id,hierarchy_id,revision,lifecycle) VALUES
('EQP-000789','EQP','CIL Transfer Pump Package',1,1,8,'A','Published'),
('EQP-000790','EQP','CIL Transfer Pump Package (standby)',1,1,8,'A','Validated'),
('EQP-000811','EQP','Mill Discharge Pump',1,1,4,'0','Data Loaded'),
('ELE-000132','ELE','CIL Area E-House',5,2,7,'C','Data Loaded'),
('STR-000245','STR','Leach Tank Access Frame',3,3,7,'B','Data Loaded'),
('MAT-000567','MAT','SS Plate — Tank Shell Lot 4',6,4,6,'D','Data Loaded');

-- ---- Property values
-- Hero asset: EQP-000789 (client's own example — all pass)
INSERT INTO asset_property_values (asset_id,property_id,value,uom,source) VALUES
(1,1,'250','m3/h','vendor'),(1,2,'12','bar','vendor'),(1,3,'315','kW','engineering'),
(1,4,'SS316',NULL,'vendor'),(1,5,'Pump Package',NULL,'engineering'),(1,6,'Plan 53B',NULL,'vendor'),
-- EQP-000790 (passes)
(2,1,'250','m3/h','vendor'),(2,2,'12','bar','vendor'),(2,3,'315','kW','engineering'),
(2,4,'SS316',NULL,'vendor'),(2,5,'Pump Package',NULL,'engineering'),
-- EQP-000811 (incomplete on purpose — framework warn: no subsystem values yet)
(3,1,'820','m3/h','engineering'),(3,2,'6','bar','engineering'),
-- ELE-000132: mandatory 'Busbar rating' MISSING → framework FAIL
(4,8,'IP54',NULL,'vendor'),
-- STR-000245: length in ft, template wants mm → quality WARN
(5,9,'24','ft','engineering'),(5,10,'S355',NULL,'engineering'),
-- MAT-000567: yield 180 < 205 MPa ASTM min → technical FAIL
(6,11,'180','MPa','vendor'),(6,12,'12','mm','vendor');

-- ---- Documents
INSERT INTO documents (doc_no,title,doc_type,revision,cde_state) VALUES
('ARGP-310-DS-0789','Pump Package Datasheet','Datasheet','B','Published'),
('ARGP-310-PID-031','CIL Pumping P&ID','P&ID','C','Shared'),
('ARGP-310-ITP-114','Pump Package ITP','ITP','A','WIP');
INSERT INTO document_assets VALUES (1,1),(2,1),(3,1);

INSERT INTO asset_revisions (asset_id,revision,note,created_by) VALUES
(1,'0','IFR — vendor data loaded','m.saad'),
(1,'A','Approved & published','a.balilo');

-- ---- Validation rules
INSERT INTO validation_rules (family,name,expression,severity) VALUES
('framework','Mandatory properties populated','{"check":"mandatory_populated"}','fail'),
('framework','Template assigned','{"check":"has_template"}','fail'),
('framework','Hierarchy node assigned','{"check":"hierarchy_assigned"}','warn'),
('framework','Tag format valid','{"check":"tag_format","pattern":"^(STR|ELE|EQP|MAT)-\\d{6}$"}','fail'),
('quality','UoM matches template','{"check":"uom_matches"}','warn'),
('quality','Datatype valid','{"check":"datatype"}','fail'),
('quality','No duplicate tags','{"check":"unique_tag"}','fail'),
('quality','Value in template range','{"check":"template_range"}','warn'),
('technical','Value meets standard limit','{"check":"standard_limit"}','fail'),
('technical','Material in approved list','{"check":"template_enum"}','fail');

-- ---- Publish targets: 10 roadmap systems grouped into the 6 vision families
INSERT INTO publish_targets (system_name,family,protocol,status) VALUES
('Oracle Aconex','Document Management','REST/OAuth2','connected'),
('Primavera P6 EPPM','Engineering Management','REST','connected'),
('SAP S/4HANA','Operational & Relational DBs','OData','queued'),
('AVEVA PI System','Field & Data Acquisition','PI Web API','planned'),
('Microsoft EPM','Engineering Management','REST','connected'),
('Azure AD','Engineering Management','SAML 2.0','connected'),
('ADFS','Engineering Management','SAML 2.0','connected'),
('Maaden SIEM','Analytics & Reporting','Syslog/REST','connected'),
('Outlook','Analytics & Reporting','Graph API','planned'),
('ServiceNow','Operational & Relational DBs','REST','planned');

-- ---- Users
INSERT INTO users (username,display_name,role) VALUES
('a.balilo','Angel Balilo','governance_lead'),
('m.saad','Mohammed Saad','engineer'),
('doccon','Documents Controller','doc_controller'),
('viewer','Maaden Viewer','viewer');
