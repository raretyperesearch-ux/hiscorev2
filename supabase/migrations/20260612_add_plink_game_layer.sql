-- Add Plink as a first-class BuyMoney/HiScore game mode.
-- Plink uses the existing pg_* Avantis trade lane, with a game-specific
-- lifecycle table for ball/round state and UI reconciliation.

ALTER TABLE public.bm_players
  ADD COLUMN IF NOT EXISTS plink_total_rounds integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS plink_total_wagered_usdc numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS plink_total_pnl_usdc numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS plink_best_trade numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS plink_good_rounds integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS plink_evil_rounds integer NOT NULL DEFAULT 0;

ALTER TABLE public.pg_open_sessions
  ADD COLUMN IF NOT EXISTS game text NOT NULL DEFAULT 'popgame1000x',
  ADD COLUMN IF NOT EXISTS plink_round_id uuid,
  ADD COLUMN IF NOT EXISTS client_round_id text,
  ADD COLUMN IF NOT EXISTS visual_seed integer,
  ADD COLUMN IF NOT EXISTS path_side text,
  ADD COLUMN IF NOT EXISTS requested_close_at timestamp with time zone;

ALTER TABLE public.pg_trades
  ADD COLUMN IF NOT EXISTS game text NOT NULL DEFAULT 'popgame1000x',
  ADD COLUMN IF NOT EXISTS session_id text,
  ADD COLUMN IF NOT EXISTS wallet_id text,
  ADD COLUMN IF NOT EXISTS is_long boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS plink_round_id uuid,
  ADD COLUMN IF NOT EXISTS client_round_id text,
  ADD COLUMN IF NOT EXISTS visual_seed integer,
  ADD COLUMN IF NOT EXISTS path_side text;

CREATE TABLE IF NOT EXISTS public.plink_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_round_id text UNIQUE,
  player_id uuid REFERENCES public.bm_players(id) ON DELETE SET NULL,
  wallet_address text,
  did text,
  wallet_id text,
  status text NOT NULL DEFAULT 'queued',
  path_side text NOT NULL,
  is_long boolean NOT NULL,
  pair_index integer NOT NULL,
  asset_symbol text,
  leverage integer NOT NULL,
  wager_usdc numeric NOT NULL,
  house_fee_usdc numeric NOT NULL DEFAULT 0,
  collateral_usdc numeric,
  entry_price numeric,
  liquidation_price numeric,
  exit_price numeric,
  gross_pnl_usdc numeric,
  avantis_win_fee_usdc numeric,
  net_pnl_usdc numeric,
  payout_usdc numeric,
  was_liquidated boolean,
  open_session_id text,
  trade_id uuid,
  open_tx_hash text,
  close_tx_hash text,
  visual_seed integer,
  ball_started_at timestamp with time zone,
  open_requested_at timestamp with time zone,
  opened_at timestamp with time zone,
  close_requested_at timestamp with time zone,
  closed_at timestamp with time zone,
  error text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT plink_rounds_status_check CHECK (
    status = ANY (ARRAY[
      'queued'::text,
      'opening'::text,
      'open'::text,
      'closing'::text,
      'settled'::text,
      'failed'::text,
      'cancelled'::text
    ])
  ),
  CONSTRAINT plink_rounds_path_side_check CHECK (
    path_side = ANY (ARRAY['good'::text, 'evil'::text])
  ),
  CONSTRAINT plink_rounds_leverage_check CHECK (leverage > 0),
  CONSTRAINT plink_rounds_wager_check CHECK (wager_usdc > 0)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'plink_rounds_open_session_id_fkey'
  ) THEN
    ALTER TABLE public.plink_rounds
      ADD CONSTRAINT plink_rounds_open_session_id_fkey
      FOREIGN KEY (open_session_id)
      REFERENCES public.pg_open_sessions(session_id)
      ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'plink_rounds_trade_id_fkey'
  ) THEN
    ALTER TABLE public.plink_rounds
      ADD CONSTRAINT plink_rounds_trade_id_fkey
      FOREIGN KEY (trade_id)
      REFERENCES public.pg_trades(id)
      ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'pg_open_sessions_plink_round_id_fkey'
  ) THEN
    ALTER TABLE public.pg_open_sessions
      ADD CONSTRAINT pg_open_sessions_plink_round_id_fkey
      FOREIGN KEY (plink_round_id)
      REFERENCES public.plink_rounds(id)
      ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'pg_trades_plink_round_id_fkey'
  ) THEN
    ALTER TABLE public.pg_trades
      ADD CONSTRAINT pg_trades_plink_round_id_fkey
      FOREIGN KEY (plink_round_id)
      REFERENCES public.plink_rounds(id)
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_plink_rounds_player_created
  ON public.plink_rounds(player_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_plink_rounds_wallet_created
  ON public.plink_rounds(wallet_address, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_plink_rounds_status_created
  ON public.plink_rounds(status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_plink_rounds_open_session
  ON public.plink_rounds(open_session_id);

CREATE INDEX IF NOT EXISTS idx_plink_rounds_trade
  ON public.plink_rounds(trade_id);

CREATE INDEX IF NOT EXISTS idx_pg_open_sessions_game
  ON public.pg_open_sessions(game, status, inserted_at DESC);

CREATE INDEX IF NOT EXISTS idx_pg_open_sessions_plink_round
  ON public.pg_open_sessions(plink_round_id);

CREATE INDEX IF NOT EXISTS idx_pg_trades_game
  ON public.pg_trades(game, opened_at DESC);

CREATE INDEX IF NOT EXISTS idx_pg_trades_plink_round
  ON public.pg_trades(plink_round_id);

CREATE OR REPLACE FUNCTION public.plink_rounds_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_plink_rounds_set_updated_at ON public.plink_rounds;
CREATE TRIGGER trigger_plink_rounds_set_updated_at
  BEFORE UPDATE ON public.plink_rounds
  FOR EACH ROW
  EXECUTE FUNCTION public.plink_rounds_set_updated_at();

ALTER TABLE public.plink_rounds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "plink_rounds read public" ON public.plink_rounds;
CREATE POLICY "plink_rounds read public"
  ON public.plink_rounds
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "plink_rounds backend only" ON public.plink_rounds;
CREATE POLICY "plink_rounds backend only"
  ON public.plink_rounds
  FOR ALL
  USING (false)
  WITH CHECK (false);

ALTER TABLE public.bm_transactions
  DROP CONSTRAINT IF EXISTS bm_transactions_tx_type_check;

ALTER TABLE public.bm_transactions
  ADD CONSTRAINT bm_transactions_tx_type_check CHECK (
    tx_type = ANY (ARRAY[
      'buy_in'::text,
      'top_up'::text,
      'elimination'::text,
      'withdraw'::text,
      'fee_withdrawal'::text,
      'emergency_withdraw'::text,
      'sm_entry'::text,
      'sm_cashout'::text,
      'sm_death'::text,
      'sm_forfeit'::text,
      'ltm_buyback'::text,
      'ltm_winner_payout'::text,
      'plink_entry'::text,
      'plink_cashout'::text,
      'plink_refund'::text
    ])
  );

COMMENT ON TABLE public.plink_rounds IS 'Plink game lifecycle records linked to Avantis pg_open_sessions and pg_trades.';
COMMENT ON COLUMN public.plink_rounds.path_side IS 'good opens long positions; evil opens short positions.';
COMMENT ON COLUMN public.plink_rounds.visual_seed IS 'Deterministic seed for ball path replay and client reconciliation.';
