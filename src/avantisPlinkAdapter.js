const mockDelay = (min = 450, max = 1300) => new Promise((resolve) => {
  window.setTimeout(resolve, min + Math.random() * (max - min));
});

export function createAvantisPlinkAdapter() {
  const mode = import.meta.env.VITE_AVANTIS_MODE || "mock";

  if (mode !== "mock") {
    return {
      mode,
      async openTrade() {
        throw new Error("Avantis live adapter is not configured yet.");
      },
      async closeTrade() {
        throw new Error("Avantis live adapter is not configured yet.");
      },
    };
  }

  return {
    mode: "mock",
    async openTrade(intent) {
      await mockDelay();
      return {
        tradeId: `mock-${intent.roundId}`,
        openedAt: Date.now(),
        status: "open",
      };
    },
    async closeTrade(position) {
      await mockDelay(350, 950);
      const payout = Math.max(0, position.bet * position.mult);
      return {
        tradeId: position.tradeId,
        closedAt: Date.now(),
        payout,
        profit: payout - position.bet,
        status: "settled",
      };
    },
  };
}
