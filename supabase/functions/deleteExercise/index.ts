import { createClient } from "npm:@supabase/supabase-js";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);

Deno.serve(async (req) => {
  if (req.method !== "DELETE") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { "content-type": "application/json" },
      status: 405,
    });
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "ID is required" }), {
        headers: { "content-type": "application/json" },
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from("exercise")
      .delete()
      .eq("id", id);

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { "content-type": "application/json" },
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      headers: { "content-type": "application/json" },
      status: 400,
    });
  }
});
