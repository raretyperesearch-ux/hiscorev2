import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let walletAddresses: string[] = [];

    // Support both GET with query param and POST with body
    if (req.method === "POST") {
      const body = await req.json();
      walletAddresses = body.wallets || [];
    } else {
      const url = new URL(req.url);
      const walletsParam = url.searchParams.get("wallets");
      if (walletsParam) {
        walletAddresses = walletsParam.split(",").map(w => w.trim().toLowerCase());
      }
    }

    if (walletAddresses.length === 0) {
      return new Response(
        JSON.stringify({ strategies: {} }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize addresses to lowercase
    walletAddresses = walletAddresses.map(w => w.toLowerCase());

    // Query wallet_strategies for all provided addresses
    const { data: strategies, error } = await supabase
      .from("wallet_strategies")
      .select("wallet_address, strategy_type, confidence_score, detected_at, metadata")
      .in("wallet_address", walletAddresses)
      .order("confidence_score", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch strategies: ${error.message}`);
    }

    // Group strategies by wallet address
    const strategiesByWallet: Record<string, any[]> = {};
    for (const strategy of strategies || []) {
      const addr = strategy.wallet_address.toLowerCase();
      if (!strategiesByWallet[addr]) {
        strategiesByWallet[addr] = [];
      }
      strategiesByWallet[addr].push({
        strategy_type: strategy.strategy_type,
        confidence_score: strategy.confidence_score,
        detected_at: strategy.detected_at,
        metadata: strategy.metadata,
      });
    }

    return new Response(
      JSON.stringify({ strategies: strategiesByWallet }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message, strategies: {} }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
