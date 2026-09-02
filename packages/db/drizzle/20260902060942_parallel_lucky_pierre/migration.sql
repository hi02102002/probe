ALTER TABLE "endpoints" ADD COLUMN "status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "endpoints" ADD COLUMN "last_request_at" timestamp with time zone;