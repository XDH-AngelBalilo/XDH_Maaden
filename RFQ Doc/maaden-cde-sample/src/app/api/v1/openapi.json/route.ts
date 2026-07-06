import { ok } from "@/lib/api";

export const dynamic = "force-static";

const spec = {
  openapi: "3.0.3",
  info: {
    title: "Maaden ARGP — CDE Asset Data Backbone API",
    version: "1.0.0",
    description:
      "Module M1 Master Data Registry + Data Template governance (localhost sample). REST per SoW 3.4.4.",
  },
  servers: [{ url: "/api/v1" }],
  tags: [
    { name: "hierarchy" }, { name: "templates" }, { name: "assets" },
    { name: "validation" }, { name: "publish" }, { name: "governance" },
  ],
  paths: {
    "/hierarchy": {
      get: { tags: ["hierarchy"], summary: "Plant hierarchy nodes (Area→Unit→System→Subsystem) with asset counts", responses: { "200": { description: "OK" } } },
    },
    "/standards": {
      get: { tags: ["governance"], summary: "Standards register with derived-template counts", responses: { "200": { description: "OK" } } },
    },
    "/templates": {
      get: { tags: ["templates"], summary: "Data templates with product type, standards and instance counts", responses: { "200": { description: "OK" } } },
    },
    "/templates/{code}": {
      get: {
        tags: ["templates"], summary: "Template detail: property set, validation rules, instances",
        parameters: [{ name: "code", in: "path", required: true, schema: { type: "string" }, example: "DT-EQP-PUMP-001" }],
        responses: { "200": { description: "OK" }, "404": { description: "Unknown template" } },
      },
      patch: {
        tags: ["governance"], summary: "Approval workflow: set status Draft|Review|Approved|Superseded (governance_lead)",
        parameters: [{ name: "code", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { type: "object", properties: { status: { type: "string", enum: ["Draft", "Review", "Approved", "Superseded"] } } } } } },
        responses: { "200": { description: "Updated" }, "403": { description: "Role denied" } },
      },
    },
    "/assets": {
      get: {
        tags: ["assets"], summary: "Asset register (MEL / Tag Register) with filters",
        parameters: [
          { name: "class", in: "query", schema: { type: "string", enum: ["STR", "ELE", "EQP", "MAT"] } },
          { name: "hierarchy", in: "query", schema: { type: "integer" }, description: "Hierarchy node id (includes descendants)" },
          { name: "q", in: "query", schema: { type: "string" }, description: "Search tag/name" },
        ],
        responses: { "200": { description: "OK" } },
      },
      post: {
        tags: ["assets"], summary: "Register a new asset (engineer+). Tag format {CLASS}-{6 digits}.",
        requestBody: { content: { "application/json": { schema: { type: "object", required: ["tag", "name", "asset_class"], properties: { tag: { type: "string", example: "EQP-000812" }, name: { type: "string" }, asset_class: { type: "string", enum: ["STR", "ELE", "EQP", "MAT"] }, product_type_id: { type: "integer" }, template_id: { type: "integer" }, hierarchy_id: { type: "integer" } } } } } },
        responses: { "201": { description: "Registered" }, "409": { description: "Duplicate tag" } },
      },
    },
    "/assets/{tag}": {
      get: {
        tags: ["assets"], summary: "Asset detail: properties vs template, documents, revisions, findings, publish log",
        parameters: [{ name: "tag", in: "path", required: true, schema: { type: "string" }, example: "EQP-000789" }],
        responses: { "200": { description: "OK" }, "404": { description: "Unknown asset" } },
      },
    },
    "/assets/{tag}/values": {
      put: {
        tags: ["assets"], summary: "Upsert property values (engineer+). Published assets bump to a new revision.",
        parameters: [{ name: "tag", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { type: "object", properties: { values: { type: "array", items: { type: "object", properties: { property_id: { type: "integer" }, value: { type: "string" }, uom: { type: "string" }, source: { type: "string" } } } } } } } } },
        responses: { "200": { description: "Updated" }, "403": { description: "Role denied" } },
      },
    },
    "/assets/{tag}/hierarchy": {
      patch: {
        tags: ["assets"], summary: "Assign asset to a plant hierarchy node (engineer+)",
        parameters: [{ name: "tag", in: "path", required: true, schema: { type: "string" } }],
        requestBody: { content: { "application/json": { schema: { type: "object", properties: { hierarchy_id: { type: "integer" } } } } } },
        responses: { "200": { description: "Updated" } },
      },
    },
    "/validation/run": {
      post: { tags: ["validation"], summary: "Execute the 3-family rule engine; writes run + findings, moves lifecycle", responses: { "200": { description: "Run result with findings" } } },
    },
    "/validation/runs": {
      get: { tags: ["validation"], summary: "Validation run history", responses: { "200": { description: "OK" } } },
    },
    "/validation/findings": {
      get: {
        tags: ["validation"], summary: "Findings for latest (or given) run",
        parameters: [{ name: "run", in: "query", schema: { type: "integer" } }],
        responses: { "200": { description: "OK" } },
      },
    },
    "/publish": {
      post: {
        tags: ["publish"], summary: "Publish asset payload to targets (governance_lead). Blocked if compliance fails.",
        requestBody: { content: { "application/json": { schema: { type: "object", required: ["tag", "target_ids"], properties: { tag: { type: "string" }, target_ids: { type: "array", items: { type: "integer" } } } } } } },
        responses: { "200": { description: "Sent" }, "409": { description: "Blocked — compliance" } },
      },
    },
    "/publish/targets": {
      get: { tags: ["publish"], summary: "The 10 roadmap integration targets grouped into 6 families", responses: { "200": { description: "OK" } } },
    },
    "/publish/events": {
      get: { tags: ["publish"], summary: "Publish queue & event log with payload + sha256", responses: { "200": { description: "OK" } } },
    },
    "/audit": {
      get: { tags: ["governance"], summary: "Immutable audit trail (latest 50)", responses: { "200": { description: "OK" } } },
    },
    "/auth/switch": {
      post: {
        tags: ["governance"], summary: "Demo role switcher — sets JWT session cookie for a seeded user",
        requestBody: { content: { "application/json": { schema: { type: "object", properties: { username: { type: "string", example: "m.saad" } } } } } },
        responses: { "200": { description: "OK" } },
      },
    },
  },
};

export async function GET() {
  return ok(spec);
}
