CREATE TABLE "endpoint_rules" (
	"id" text PRIMARY KEY,
	"endpoint_id" text NOT NULL UNIQUE,
	"custom_response_enabled" boolean DEFAULT false NOT NULL,
	"custom_status_code" integer,
	"custom_content_type" text,
	"custom_response_body" text,
	"delay_enabled" boolean DEFAULT false NOT NULL,
	"delay_ms" integer,
	"signature_enabled" boolean DEFAULT false NOT NULL,
	"signature_header_name" text,
	"signature_secret" text,
	"forward_enabled" boolean DEFAULT false NOT NULL,
	"forward_target_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "endpoint_rules" ADD CONSTRAINT "endpoint_rules_endpoint_id_endpoints_id_fkey" FOREIGN KEY ("endpoint_id") REFERENCES "endpoints"("id") ON DELETE CASCADE;