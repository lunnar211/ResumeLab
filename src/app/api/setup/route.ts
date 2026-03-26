import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const admin = createAdminClient()
    
    // Check if usage_logs table exists by querying it
    const { error: checkError } = await admin
      .from("usage_logs")
      .select("id")
      .limit(1)

    if (checkError && checkError.code === "42P01") {
      // Table doesn't exist - return instructions
      return NextResponse.json({
        status: "setup_required",
        message: "Please create the required tables in your Supabase dashboard",
        sql: `
-- Create usage_logs table
CREATE TABLE IF NOT EXISTS usage_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  feature text,
  tokens_used integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Add missing columns to profiles if needed
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan text DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_requests_today integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_count integer DEFAULT 0;

-- Create index
CREATE INDEX IF NOT EXISTS usage_logs_user_id_idx ON usage_logs(user_id);
CREATE INDEX IF NOT EXISTS usage_logs_created_at_idx ON usage_logs(created_at);
        `,
      })
    }

    return NextResponse.json({ status: "ok", message: "Database setup looks good!" })
  } catch (error) {
    console.error("Setup check error:", error)
    return NextResponse.json({ error: "Setup check failed", details: String(error) }, { status: 500 })
  }
}
