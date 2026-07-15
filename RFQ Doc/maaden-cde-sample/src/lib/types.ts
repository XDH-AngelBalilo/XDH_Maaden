export type AssetClass = "STR" | "ELE" | "EQP" | "MAT";
export type Lifecycle = "Registered" | "Data Loaded" | "Validated" | "Published";
export type TemplateStatus = "Draft" | "Review" | "Approved" | "Superseded";
export type CdeState = "WIP" | "Shared" | "Published" | "Archived";
export type RuleFamily = "framework" | "quality" | "technical";
export type Severity = "fail" | "warn";
export type Role = "governance_lead" | "engineer" | "doc_controller" | "viewer";

export interface Asset {
  id: number;
  tag: string;
  asset_class: AssetClass;
  name: string;
  product_type_id: number | null;
  template_id: number | null;
  hierarchy_id: number | null;
  revision: string;
  lifecycle: Lifecycle;
}

export interface PropertyValue {
  id: number;
  asset_id: number;
  property_id: number;
  value: string | null;
  uom: string | null;
  source: "engineering" | "vendor" | "field" | null;
}

export interface TemplateProperty {
  id: number;
  template_id: number;
  property_id: number;
  mandatory: boolean;
  uom: string | null;
  validation: Record<string, any> | null;
  // joined
  name?: string;
  datatype?: string;
}

export interface ValidationRule {
  id: number;
  family: RuleFamily;
  name: string;
  expression: Record<string, any>;
  severity: Severity;
  active: boolean;
}

export interface Finding {
  asset_id: number;
  rule_id: number;
  family: RuleFamily;
  severity: Severity;
  /** i18n key, e.g. 'finding.mandatory_missing' — rendered per locale by the UI. */
  message_key: string;
  /** Structured values substituted into the message, e.g. { property: 'Busbar rating' }. */
  params: Record<string, string | number | null | undefined>;
}
