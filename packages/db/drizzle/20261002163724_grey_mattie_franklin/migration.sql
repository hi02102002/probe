CREATE TABLE "forward_logs" (
	"id" text PRIMARY KEY,
	"endpoint_id" text NOT NULL,
	"method" text NOT NULL,
	"target_url" text NOT NULL,
	"req_body" jsonb,
	"status_code" integer,
	"duration_ms" integer,
	"success" boolean DEFAULT false NOT NULL,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "forward_log_endpoint_created_at_id_idx" ON "forward_logs" ("endpoint_id","created_at","id");--> statement-breakpoint
ALTER TABLE "forward_logs" ADD CONSTRAINT "forward_logs_endpoint_id_endpoints_id_fkey" FOREIGN KEY ("endpoint_id") REFERENCES "endpoints"("id") ON DELETE CASCADE;