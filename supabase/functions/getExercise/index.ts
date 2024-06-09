import { createClient } from "npm:@supabase/supabase-js";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);

Deno.serve(async (req) => {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { "content-type": "application/json" },
      status: 405,
    });
  }

  const { data: name, error } = await supabase.from("exercise").select('*');

  console.log(name);

  return new Response(JSON.stringify(name), {
    headers: { "content-type": "application/json" },
  });
});