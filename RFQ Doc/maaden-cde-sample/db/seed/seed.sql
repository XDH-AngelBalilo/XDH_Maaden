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
-- EQP-000811 (framework warn: assigned to System node, no Subsystem yet)
(3,1,'820','m3/h','engineering'),(3,2,'6','bar','engineering'),(3,3,'450','kW','engineering'),
(3,4,'SS316',NULL,'engineering'),(3,5,'Pump Package',NULL,'engineering'),
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

-- =====================================================================
-- Demo seed v1.1 — scale-out to ~roadmap targets (§6: ~5 areas, 40 tags,
-- 8 templates, standards register). Every asset added below is CLEAN
-- (subsystem-assigned, all mandatory props valid) so the 4-asset demo
-- story is untouched: run 1 still shows exactly ELE-000132 (framework
-- fail) + MAT-000567 (technical fail) + STR-000245 (quality warn), and
-- the dashboard still goes green after those three are fixed.
-- =====================================================================

-- ---- Standards (5 -> 8)
INSERT INTO standards (code,title,body,revision,discipline) VALUES
('API 682','Pumps — Shaft Sealing Systems for Centrifugal and Rotary Pumps','API','4th','Mechanical'), -- 6
('IEC 60034','Rotating Electrical Machines','IEC','2022','Electrical'),                                 -- 7
('API 600','Steel Gate Valves — Flanged and Butt-welding Ends','API','13th','Mechanical');             -- 8

-- ---- Product types (6 -> 8)
INSERT INTO product_types (class_code,name,discipline,asset_class) VALUES
('MOTOR-LV','LV Induction Motor','Electrical','ELE'),  -- 7
('VALVE-GATE','Gate Valve','Mechanical','EQP');        -- 8

INSERT INTO standard_product_type VALUES (6,1),(7,7),(8,8);

-- ---- Properties (12 -> 24)
INSERT INTO properties (name,symbol,datatype,default_uom) VALUES
('Design temperature','T','number','°C'),         -- 13
('Vessel volume','V','number','m3'),              -- 14
('Material of construction',NULL,'enum',NULL),    -- 15
('Panel thickness','t','number','mm'),            -- 16
('Panel material',NULL,'enum',NULL),              -- 17
('Fire rating',NULL,'text',NULL),                 -- 18
('Rated power','P','number','kW'),                -- 19
('Rated voltage','U','number','V'),               -- 20
('IP rating',NULL,'text',NULL),                   -- 21
('Rated speed','n','number','rpm'),               -- 22
('Valve size','DN','number','mm'),                -- 23
('Pressure rating class',NULL,'text',NULL);       -- 24

-- ---- Data templates (4 -> 8)
INSERT INTO data_templates (code,product_type_id,revision,status) VALUES
('DT-EQP-VESL-001',2,'A','Approved'),   -- 5 Vertical vessel (ASME VIII)
('DT-STR-CLAD-001',4,'A','Approved'),   -- 6 Cladding panel (MCIS-STR)
('DT-ELE-MOTR-001',7,'B','Approved'),   -- 7 LV motor (IEC 60034)
('DT-EQP-VALV-001',8,'A','Approved');   -- 8 Gate valve (API 600)

INSERT INTO standard_template VALUES (2,5),(3,6),(7,7),(8,8);

INSERT INTO template_properties (template_id,property_id,mandatory,uom,validation) VALUES
-- Vessel
(5,2 ,TRUE ,'bar','{"check":"range","min":0,"max":50}'),
(5,13,TRUE ,'°C' ,'{"check":"range","min":-20,"max":400}'),
(5,14,TRUE ,'m3' ,'{"check":"range","min":0.1,"max":500}'),
(5,15,TRUE ,NULL ,'{"check":"enum","values":["SS316","CS","Duplex"]}'),
-- Cladding
(6,16,TRUE ,'mm' ,'{"check":"range","min":0.5,"max":6}'),
(6,17,TRUE ,NULL ,'{"check":"enum","values":["Aluminium","Steel","Composite"]}'),
(6,18,FALSE,NULL ,NULL),
-- Motor
(7,19,TRUE ,'kW' ,'{"check":"range","min":0.1,"max":1000}'),
(7,20,TRUE ,'V'  ,'{"check":"range","min":380,"max":690}'),
(7,21,TRUE ,NULL ,NULL),
(7,22,TRUE ,'rpm','{"check":"range","min":500,"max":3600}'),
-- Valve
(8,23,TRUE ,'mm' ,'{"check":"range","min":15,"max":1200}'),
(8,24,TRUE ,NULL ,NULL),
(8,15,TRUE ,NULL ,'{"check":"enum","values":["SS316","CS","Duplex"]}');

-- ---- Plant hierarchy (10 -> 27; areas now 6: 100/220/310/410/500/900)
INSERT INTO plant_hierarchy (code,name,level,parent_id) VALUES
('101','Primary Crusher','Unit',1),            -- 11
('101-CR','Crusher Line','System',11),         -- 12
('101-CR-01','Crusher Subsystem 01','Subsystem',12), -- 13
('312','Adsorption','Unit',5),                 -- 14
('312-AD','Adsorption Columns','System',14),   -- 15
('312-AD-01','Adsorption Subsystem 01','Subsystem',15), -- 16
('311-PU-02','Pumping Subsystem 02','Subsystem',7),     -- 17
('411','Elution Circuit','Unit',9),            -- 18
('411-EL','Elution Heaters','System',18),      -- 19
('411-EL-01','Elution Subsystem 01','Subsystem',19),    -- 20
('901','Utilities','Unit',10),                 -- 21
('901-UT','Power Distribution','System',21),   -- 22
('901-UT-01','Switchroom Subsystem 01','Subsystem',22), -- 23
('500','Tailings','Area',NULL),                -- 24
('510','TSF Pumping','Unit',24),               -- 25
('510-PU','TSF Pump Line','System',25),        -- 26
('510-PU-01','TSF Pump Subsystem 01','Subsystem',26);   -- 27

-- ---- Assets (6 -> 40). All new assets clean + subsystem-assigned.
INSERT INTO assets (tag,asset_class,name,product_type_id,template_id,hierarchy_id,revision,lifecycle) VALUES
-- pumps (template 1)
('EQP-000812','EQP','CIL Recycle Pump',1,1,8,'A','Published'),          -- 7
('EQP-000813','EQP','Adsorption Feed Pump',1,1,16,'A','Validated'),     -- 8
('EQP-000814','EQP','Elution Circulation Pump',1,1,20,'0','Data Loaded'),-- 9
('EQP-000815','EQP','TSF Transfer Pump',1,1,27,'A','Published'),        -- 10
('EQP-000816','EQP','TSF Transfer Pump (standby)',1,1,27,'A','Validated'),-- 11
('EQP-000817','EQP','Crusher Spray Pump',1,1,13,'0','Data Loaded'),     -- 12
-- vessels (template 5)
('EQP-000818','EQP','Leach Tank Surge Vessel',2,5,16,'A','Published'),  -- 13
('EQP-000819','EQP','Elution Eluate Vessel',2,5,20,'A','Validated'),    -- 14
('EQP-000820','EQP','Carbon Regen Vessel',2,5,16,'0','Data Loaded'),    -- 15
('EQP-000821','EQP','Acid Wash Vessel',2,5,20,'A','Published'),         -- 16
('EQP-000822','EQP','TSF Return Vessel',2,5,27,'0','Data Loaded'),      -- 17
-- valves (template 8)
('EQP-000823','EQP','CIL Isolation Valve',8,8,8,'A','Published'),       -- 18
('EQP-000824','EQP','Elution Control Valve',8,8,20,'A','Validated'),    -- 19
('EQP-000825','EQP','TSF Line Gate Valve',8,8,27,'0','Data Loaded'),    -- 20
-- e-houses (template 2)
('ELE-000133','ELE','Adsorption E-House',5,2,16,'A','Published'),       -- 21
('ELE-000134','ELE','Elution Switchroom',5,2,20,'C','Validated'),       -- 22
('ELE-000135','ELE','Utilities Main Switchroom',5,2,23,'A','Published'),-- 23
('ELE-000136','ELE','TSF Field Panel',5,2,27,'0','Data Loaded'),        -- 24
-- motors (template 7)
('ELE-000137','ELE','CIL Pump Motor',7,7,8,'A','Published'),            -- 25
('ELE-000138','ELE','Adsorption Feed Motor',7,7,16,'A','Validated'),    -- 26
('ELE-000139','ELE','Elution Pump Motor',7,7,20,'0','Data Loaded'),     -- 27
('ELE-000140','ELE','TSF Pump Motor',7,7,27,'A','Published'),           -- 28
('ELE-000141','ELE','Crusher Motor',7,7,13,'A','Validated'),            -- 29
-- frames (template 3)
('STR-000246','STR','Adsorption Access Frame',3,3,16,'B','Published'),  -- 30
('STR-000247','STR','Elution Pipe Rack Frame',3,3,20,'A','Validated'),  -- 31
('STR-000248','STR','Utilities Platform Frame',3,3,23,'B','Published'), -- 32
('STR-000249','STR','TSF Walkway Frame',3,3,27,'0','Data Loaded'),      -- 33
-- cladding (template 6)
('STR-000250','STR','E-House Cladding Panel A',4,6,23,'A','Published'), -- 34
('STR-000251','STR','E-House Cladding Panel B',4,6,16,'A','Validated'), -- 35
('STR-000252','STR','Switchroom Cladding',4,6,20,'0','Data Loaded'),    -- 36
-- plates (template 4)
('MAT-000568','MAT','SS Plate — Tank Shell Lot 5',6,4,16,'D','Published'),  -- 37
('MAT-000569','MAT','SS Plate — Column Lot 2',6,4,20,'D','Validated'),      -- 38
('MAT-000570','MAT','SS Plate — Vessel Lot 3',6,4,27,'0','Data Loaded'),    -- 39
('MAT-000571','MAT','SS Plate — TSF Liner Lot 1',6,4,13,'D','Published');   -- 40

INSERT INTO asset_property_values (asset_id,property_id,value,uom,source) VALUES
-- pumps
(7,1,'300','m3/h','vendor'),(7,2,'14','bar','vendor'),(7,3,'355','kW','engineering'),(7,4,'SS316',NULL,'vendor'),(7,5,'Pump Package',NULL,'engineering'),(7,6,'Plan 53B',NULL,'vendor'),
(8,1,'420','m3/h','vendor'),(8,2,'9','bar','vendor'),(8,3,'220','kW','engineering'),(8,4,'Duplex',NULL,'vendor'),(8,5,'Pump Package',NULL,'engineering'),
(9,1,'180','m3/h','engineering'),(9,2,'16','bar','engineering'),(9,3,'160','kW','engineering'),(9,4,'SS304',NULL,'engineering'),(9,5,'Pump Package',NULL,'engineering'),
(10,1,'650','m3/h','vendor'),(10,2,'20','bar','vendor'),(10,3,'500','kW','engineering'),(10,4,'SS316',NULL,'vendor'),(10,5,'Pump Package',NULL,'engineering'),(10,6,'Plan 11',NULL,'vendor'),
(11,1,'650','m3/h','vendor'),(11,2,'20','bar','vendor'),(11,3,'500','kW','engineering'),(11,4,'SS316',NULL,'vendor'),(11,5,'Pump Package',NULL,'engineering'),
(12,1,'120','m3/h','engineering'),(12,2,'8','bar','engineering'),(12,3,'55','kW','engineering'),(12,4,'CS',NULL,'engineering'),(12,5,'Pump Package',NULL,'engineering'),
-- vessels
(13,2,'6','bar','vendor'),(13,13,'80','°C','engineering'),(13,14,'45','m3','vendor'),(13,15,'SS316',NULL,'vendor'),
(14,2,'10','bar','vendor'),(14,13,'120','°C','engineering'),(14,14,'25','m3','vendor'),(14,15,'Duplex',NULL,'vendor'),
(15,2,'4','bar','engineering'),(15,13,'150','°C','engineering'),(15,14,'60','m3','engineering'),(15,15,'CS',NULL,'engineering'),
(16,2,'8','bar','vendor'),(16,13,'60','°C','engineering'),(16,14,'15','m3','vendor'),(16,15,'SS316',NULL,'vendor'),
(17,2,'5','bar','engineering'),(17,13,'45','°C','engineering'),(17,14,'90','m3','engineering'),(17,15,'CS',NULL,'engineering'),
-- valves
(18,23,'300','mm','vendor'),(18,24,'ANSI 150',NULL,'vendor'),(18,15,'SS316',NULL,'vendor'),
(19,23,'150','mm','vendor'),(19,24,'ANSI 300',NULL,'vendor'),(19,15,'CS',NULL,'vendor'),
(20,23,'500','mm','engineering'),(20,24,'ANSI 150',NULL,'engineering'),(20,15,'Duplex',NULL,'engineering'),
-- e-houses
(21,7,'2500','A','vendor'),(21,8,'IP54',NULL,'vendor'),
(22,7,'1600','A','vendor'),(22,8,'IP55',NULL,'vendor'),
(23,7,'4000','A','vendor'),(23,8,'IP54',NULL,'vendor'),
(24,7,'630','A','engineering'),(24,8,'IP55',NULL,'engineering'),
-- motors
(25,19,'315','kW','vendor'),(25,20,'690','V','vendor'),(25,21,'IP55',NULL,'vendor'),(25,22,'1500','rpm','vendor'),
(26,19,'220','kW','vendor'),(26,20,'400','V','vendor'),(26,21,'IP55',NULL,'vendor'),(26,22,'3000','rpm','vendor'),
(27,19,'160','kW','engineering'),(27,20,'400','V','engineering'),(27,21,'IP55',NULL,'engineering'),(27,22,'1500','rpm','engineering'),
(28,19,'500','kW','vendor'),(28,20,'690','V','vendor'),(28,21,'IP55',NULL,'vendor'),(28,22,'1000','rpm','vendor'),
(29,19,'400','kW','vendor'),(29,20,'690','V','vendor'),(29,21,'IP55',NULL,'vendor'),(29,22,'1500','rpm','vendor'),
-- frames (length in mm — uom_matches)
(30,9,'6500','mm','engineering'),(30,10,'S355',NULL,'engineering'),
(31,9,'9000','mm','engineering'),(31,10,'S355',NULL,'engineering'),
(32,9,'4200','mm','engineering'),(32,10,'S275',NULL,'engineering'),
(33,9,'12000','mm','engineering'),(33,10,'S355',NULL,'engineering'),
-- cladding
(34,16,'2','mm','vendor'),(34,17,'Aluminium',NULL,'vendor'),(34,18,'2h',NULL,'vendor'),
(35,16,'1.5','mm','vendor'),(35,17,'Steel',NULL,'vendor'),
(36,16,'3','mm','engineering'),(36,17,'Composite',NULL,'engineering'),(36,18,'1h',NULL,'engineering'),
-- plates (yield >= 205 MPa ASTM A240)
(37,11,'250','MPa','vendor'),(37,12,'12','mm','vendor'),
(38,11,'220','MPa','vendor'),(38,12,'20','mm','vendor'),
(39,11,'310','MPa','engineering'),(39,12,'8','mm','engineering'),
(40,11,'240','MPa','vendor'),(40,12,'16','mm','vendor');

-- ---- Extra documents for populated Asset Detail screens
INSERT INTO documents (doc_no,title,doc_type,revision,cde_state) VALUES
('ARGP-510-DS-0815','TSF Transfer Pump Datasheet','Datasheet','A','Published'),  -- 4
('ARGP-312-DS-0818','Surge Vessel Datasheet','Datasheet','A','Shared'),          -- 5
('ARGP-901-DS-0135','Main Switchroom Datasheet','Datasheet','B','Published'),    -- 6
('ARGP-310-DS-0137','CIL Pump Motor Datasheet','Datasheet','A','Published');     -- 7
INSERT INTO document_assets VALUES (4,10),(5,13),(6,23),(7,25);

INSERT INTO asset_revisions (asset_id,revision,note,created_by) VALUES
(10,'0','IFR — vendor data loaded','m.saad'),(10,'A','Approved & published','a.balilo'),
(13,'0','IFR — vendor data loaded','m.saad'),(13,'A','Approved & published','a.balilo'),
(23,'0','IFR — vendor data loaded','m.saad'),(23,'A','Approved & published','a.balilo');
