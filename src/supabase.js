import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = "https://alkpxrclmkhiordeljao.supabase.co"
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsa3B4cmNsbWtoaW9yZGVsamFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDA0MTEsImV4cCI6MjA5NjkxNjQxMX0.EDLyeEIHvHXOVL0uuDgmsNIC6TQSQMzAA2SUuErVPvE"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)