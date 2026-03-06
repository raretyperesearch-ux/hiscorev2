-- Migration: Add wallet_class to wallets and create wallet_strategies table
-- Date: 2026-03-06

-- Add wallet_class column to wallets table if it doesn't exist
ALTER TABLE wallets
ADD COLUMN IF NOT EXISTS wallet_class VARCHAR(50) DEFAULT NULL;

-- Create index on wallet_class for filtering
CREATE INDEX IF NOT EXISTS idx_wallets_wallet_class ON wallets(wallet_class);

-- Create wallet_strategies table
CREATE TABLE IF NOT EXISTS wallet_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address VARCHAR(42) NOT NULL REFERENCES wallets(address) ON DELETE CASCADE,
  strategy_type VARCHAR(50) NOT NULL,
  confidence_score DECIMAL(5,4) DEFAULT 0.0 CHECK (confidence_score >= 0 AND confidence_score <= 1),
  detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Each wallet can only have one entry per strategy type
  UNIQUE(wallet_address, strategy_type)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_wallet_strategies_wallet ON wallet_strategies(wallet_address);
CREATE INDEX IF NOT EXISTS idx_wallet_strategies_type ON wallet_strategies(strategy_type);
CREATE INDEX IF NOT EXISTS idx_wallet_strategies_confidence ON wallet_strategies(confidence_score DESC);
CREATE INDEX IF NOT EXISTS idx_wallet_strategies_wallet_type ON wallet_strategies(wallet_address, strategy_type);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_wallet_strategies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_wallet_strategies_updated_at ON wallet_strategies;
CREATE TRIGGER trigger_wallet_strategies_updated_at
  BEFORE UPDATE ON wallet_strategies
  FOR EACH ROW
  EXECUTE FUNCTION update_wallet_strategies_updated_at();

-- Enable Row Level Security
ALTER TABLE wallet_strategies ENABLE ROW LEVEL SECURITY;

-- Create policy for read access (public can read all strategies)
CREATE POLICY "Enable read access for all users" ON wallet_strategies
  FOR SELECT USING (true);

-- Create policy for insert/update (only authenticated service role)
CREATE POLICY "Enable insert for service role" ON wallet_strategies
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for service role" ON wallet_strategies
  FOR UPDATE USING (true);

-- Add comment describing the table
COMMENT ON TABLE wallet_strategies IS 'Detected trading strategies for each wallet based on on-chain analysis';
COMMENT ON COLUMN wallet_strategies.strategy_type IS 'Type of strategy: sniper, whale, scalper, holder, arbitrage, mev, copytrader, degen';
COMMENT ON COLUMN wallet_strategies.confidence_score IS 'Confidence level of strategy detection (0.0 to 1.0)';
COMMENT ON COLUMN wallet_strategies.metadata IS 'Additional strategy-specific data in JSON format';

-- Valid wallet_class values comment
COMMENT ON COLUMN wallets.wallet_class IS 'Classification of wallet: smart_money, whale, retail, bot, new';
