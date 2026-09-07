import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ygeihizlykqzkmwhdqtg.supabase.co";


const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnZWloaXpseWtxemttd2hkcXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc4NDMzNjksImV4cCI6MjEwMzQxOTM2OX0.Kxo-CYB7SRPTMdSPYwt6nw62W9vm_gCIwuBR-VC_XVM";

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);