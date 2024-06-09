import { createClient } from "npm:@supabase/supabase-js";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);

Deno.serve(async (req) => {
  try {
    const { name, muscles_worked } = await req.json();

    if (!name || !muscles_worked) {
      return new Response(JSON.stringify({ error: "Name and muscles_worked are required" }), {
        headers: { "content-type": "application/json" },
        status: 400,
      });
    }

    // Validate muscles_worked against the related table
    const { data: muscleData, error: muscleError } = await supabase
      .from("muscle")
      .select("*")
      .eq("muscle", muscles_worked)
      .single();

    if (muscleError || !muscleData) {
      return new Response(JSON.stringify({ error: "Invalid muscles_worked value" }), {
        headers: { "content-type": "application/json" },
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from("exercise")
      .insert({ name, muscles_worked });

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
