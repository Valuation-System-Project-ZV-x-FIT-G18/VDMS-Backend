CREATE TABLE IF NOT EXISTS technical_officer_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  report_title varchar NOT NULL,
  inspection_notes text NOT NULL,
  valuation_summary text NOT NULL,
  recommendation text NOT NULL,
  status varchar NOT NULL DEFAULT 'Draft',
  rejection_reason text NULL,
  clarification_request text NULL,
  clarification_response text NULL,
  submitted_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT fk_technical_officer_reports_project
    FOREIGN KEY (project_id)
    REFERENCES technical_officer_projects(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_technical_officer_reports_project_id
  ON technical_officer_reports(project_id);
