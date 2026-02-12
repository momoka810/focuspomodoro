import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  reflectionText: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const difyApiKey = Deno.env.get("DIFY_API_KEY");
    const difyApiUrl = Deno.env.get("DIFY_API_URL");

    if (!difyApiKey || !difyApiUrl) {
      return new Response(
        JSON.stringify({
          error: "Dify API configuration is missing. Please set DIFY_API_KEY and DIFY_API_URL environment variables.",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { reflectionText }: RequestBody = await req.json();

    if (!reflectionText || reflectionText.trim() === "") {
      return new Response(
        JSON.stringify({
          error: "Reflection text is required",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const difyResponse = await fetch(difyApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${difyApiKey}`,
      },
      body: JSON.stringify({
        inputs: {
          reflection: reflectionText,
        },
        response_mode: "blocking",
        user: "user",
      }),
    });

    if (!difyResponse.ok) {
      throw new Error(`Dify API error: ${difyResponse.status}`);
    }

    const difyData = await difyResponse.json();
    const feedback = difyData.answer || difyData.text || "素晴らしい努力ですね！その調子で頑張りましょう！";

    return new Response(
      JSON.stringify({
        feedback,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unknown error occurred",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
