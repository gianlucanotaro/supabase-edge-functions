import { createClient } from "npm:@supabase/supabase-js";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      headers: { "content-type": "application/json" },
      status: 405,
    });
  }

  try {
    const { exercise, reps_planned, reps_done, exercise_type} = await req.json();

    if (!exercise || !reps_planned || !reps_done || !exercise_type) {
      return new Response(JSON.stringify({ error: "Exercise, reps_planned, reps_done and exercise_type are required" }), {
        headers: { "content-type": "application/json" },
        status: 400,
      });
    }

    // validate exercise and exercise_type against the related tables
    const { data: exerciseData, error: exerciseError } = await supabase
      .from("exercise")
      .select("*")
      .eq("name", exercise)
      .single();

    if (exerciseError || !exerciseData) {
      return new Response(JSON.stringify({ error: "Invalid exercise value" }), {
        headers: { "content-type": "application/json" },
        status: 400,
      });
    }

    const { data: exerciseTypeData, error: exerciseTypeError } = await supabase
      .from("exercise_type")
      .select("*")
      .eq("type", exercise_type)
      .single();


    if (exerciseTypeError || !exerciseTypeData) {
      return new Response(JSON.stringify({ error: "Invalid exercise_type value" + exerciseTypeData + exercise_type}), {
        headers: { "content-type": "application/json" },
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from("exerciseUnit")
      .insert({ exercise, reps_planned, reps_done, exercise_type });

    if (error) {
      return new Response(JSON.stringify({ error: error }), {
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
