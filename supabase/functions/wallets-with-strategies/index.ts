import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

interface WalletStrategy {
  id: string;
  wallet_address: string;
  strategy_type: string;
  confidence_score: number;
  detected_at: string;
  metadata: Record<string, unknown>;
}

interface Wallet {
  address: string;
  label: string | null;
  avatar_url: string | null;
  twitter: string | null;
  telegram: string | null;
  wallet_class: string | null;
  created_at: string;
  strategies?: WalletStrategy[];
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const url = new URL(req.url);
    const walletClass = url.searchParams.get("wallet_class");
    const strategyType = url.searchParams.get("strategy_type");
    const limit = Math.min(parseInt(url.searchParams.get("limit") || "100"), 500);
    const offset = parseInt(url.searchParams.get("offset") || "0");

    // Build the wallets query
    let walletsQuery = supabase
      .from("wallets")
      .select(`
        address,
        label,
        avatar_url,
        twitter,
        telegram,
        wallet_class,
        created_at
      `)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by wallet_class if provided
    if (walletClass) {
      walletsQuery = walletsQuery.eq("wallet_class", walletClass);
    }

    const { data: wallets, error: walletsError } = await walletsQuery;

    if (walletsError) {
      throw new Error(`Failed to fetch wallets: ${walletsError.message}`);
    }

    if (!wallets || wallets.length === 0) {
      return new Response(
        JSON.stringify({ wallets: [], total: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get wallet addresses for the strategies query
    const walletAddresses = wallets.map((w: Wallet) => w.address);

    // Build the strategies query
    let strategiesQuery = supabase
      .from("wallet_strategies")
      .select("*")
      .in("wallet_address", walletAddresses)
      .order("confidence_score", { ascending: false });

    // Filter by strategy_type if provided
    if (strategyType) {
      strategiesQuery = strategiesQuery.eq("strategy_type", strategyType);
    }

    const { data: strategies, error: strategiesError } = await strategiesQuery;

    if (strategiesError) {
      throw new Error(`Failed to fetch strategies: ${strategiesError.message}`);
    }

    // Group strategies by wallet address
    const strategiesByWallet: Record<string, WalletStrategy[]> = {};
    for (const strategy of strategies || []) {
      const addr = strategy.wallet_address;
      if (!strategiesByWallet[addr]) {
        strategiesByWallet[addr] = [];
      }
      strategiesByWallet[addr].push(strategy);
    }

    // Join wallets with their strategies
    const walletsWithStrategies = wallets.map((wallet: Wallet) => ({
      ...wallet,
      strategies: strategiesByWallet[wallet.address] || [],
    }));

    // If filtering by strategy_type, only return wallets that have matching strategies
    const filteredWallets = strategyType
      ? walletsWithStrategies.filter((w: Wallet) => w.strategies && w.strategies.length > 0)
      : walletsWithStrategies;

    // Get total count for pagination
    let countQuery = supabase
      .from("wallets")
      .select("address", { count: "exact", head: true });

    if (walletClass) {
      countQuery = countQuery.eq("wallet_class", walletClass);
    }

    const { count } = await countQuery;

    return new Response(
      JSON.stringify({
        wallets: filteredWallets,
        total: count || filteredWallets.length,
        limit,
        offset,
        filters: {
          wallet_class: walletClass,
          strategy_type: strategyType,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
