import { useCallback, useEffect, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { createAvantisPlinkAdapter } from "./avantisPlinkAdapter.js";

const BG_SRC = "/plink/path-board-bg.png";
const GOOD_RUNNER_SRC = "/plink/good-runner.png";
const EVIL_RUNNER_SRC = "/plink/bad-runner.png";

const GAME = {
  gravity: 0.125,
  drift: 0.82,
  tickets: [75, 100, 125, 150, 200, 250, 500],
  closeLine: 0.965,
  maxSpeed: 0.3,
  minRunMs: 12000,
};

const BETS = [1, 5, 10, 25];

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const money = (n) => "$" + n.toFixed(2);
const rand = (min, max) => min + Math.random() * (max - min);
const asRoundList = (value) => Array.isArray(value) ? value : value ? [value] : [];
const ASSETS = ["BTC", "ETH", "SOL"];

function playTone(audioRef, type, side = "good") {
  const AudioCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtor) return;
  const ctx = audioRef.current || new AudioCtor();
  audioRef.current = ctx;
  if (ctx.state === "suspended") ctx.resume();
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.connect(ctx.destination);
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(type === "boost" ? 0.12 : 0.055, now + 0.01);
  master.gain.exponentialRampToValueAtTime(0.0001, now + (type === "boost" ? 0.44 : 0.16));

  const makeOsc = (freq, wave, offset = 0, dur = 0.18) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, now + offset);
    gain.gain.setValueAtTime(0.0001, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.9, now + offset + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + dur);
    osc.connect(gain);
    gain.connect(master);
    osc.start(now + offset);
    osc.stop(now + offset + dur + 0.03);
  };

  if (type === "launch") {
    makeOsc(side === "evil" ? 180 : 220, "triangle", 0, 0.13);
    makeOsc(side === "evil" ? 320 : 390, "sine", 0.035, 0.16);
  } else if (type === "peg") {
    makeOsc(side === "evil" ? rand(420, 680) : rand(560, 820), "square", 0, 0.055);
  } else if (type === "boost") {
    makeOsc(side === "evil" ? 220 : 300, "triangle", 0, 0.34);
    makeOsc(side === "evil" ? 440 : 600, "sine", 0.045, 0.32);
    makeOsc(side === "evil" ? 660 : 900, "sine", 0.09, 0.28);
  } else if (type === "close") {
    makeOsc(side === "evil" ? 260 : 330, "triangle", 0, 0.18);
    makeOsc(side === "evil" ? 190 : 480, "sine", 0.06, 0.18);
  }
}

function buildPegMap() {
  const pegs = [];
  const rows = 26;
  for (let y = 0; y < rows; y += 1) {
    const count = y % 2 ? 13 : 14;
    for (let x = 0; x < count; x += 1) {
      pegs.push({
        x: 0.055 + x * (0.89 / (count - 1)),
        y: 0.08 + y * 0.034,
        r: 0.0065,
      });
    }
  }
  return pegs;
}

const PEGS = buildPegMap();

function pickTicket() {
  return GAME.tickets[Math.floor(Math.random() * GAME.tickets.length)];
}

function pickBoost() {
  return {
    leverage: pickTicket(),
    asset: ASSETS[Math.floor(Math.random() * ASSETS.length)],
  };
}

function makeRound(side, bet, boost = pickBoost()) {
  const ticket = boost.leverage;
  const seed = Math.random() * 1000;
  const bias = (Math.random() - 0.46) * GAME.drift;
  const lane = side === "good"
    ? { min: 0.07, max: 0.49, spawn: 0.29 }
    : { min: 0.51, max: 0.93, spawn: 0.71 };
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    mode: "running",
    side,
    bet,
    ticket,
    asset: boost.asset,
    elapsed: 0,
    seed,
    bias,
    pegsHit: 0,
    lastHit: -1,
    lastPegSound: -999,
    lane,
    ball: {
      x: lane.spawn + rand(-0.025, 0.025),
      y: 0.055,
      vx: rand(-0.028, 0.028),
      vy: 0.04,
      r: 0.014,
    },
    mult: 1,
    minMult: 1,
    maxMult: 1,
    cashedOut: false,
    ticketLocked: true,
    tradeStatus: "opening",
    tradeId: null,
    closeRequested: false,
    sparks: [],
    result: null,
  };
}

export default function Plink() {
  const canvasRef = useRef(null);
  const bgRef = useRef(null);
  const rafRef = useRef(null);
  const stateRef = useRef([]);
  const adapterRef = useRef(createAvantisPlinkAdapter());
  const sideRef = useRef("good");
  const balanceRef = useRef(42.8);
  const audioRef = useRef(null);
  const [side, setSide] = useState("good");
  const [bet, setBet] = useState(1);
  const [balance, setBalance] = useState(42.8);
  const [rounds, setRounds] = useState([]);
  const [result, setResult] = useState(null);
  const [nextBoost, setNextBoost] = useState(() => pickBoost());

  const activeRounds = asRoundList(rounds);
  const openRounds = activeRounds;
  const latestRound = activeRounds[activeRounds.length - 1] || null;
  const canDrop = balance >= bet;
  const currentCashout = activeRounds.reduce((sum, r) => sum + r.bet * r.mult, 0);

  useEffect(() => {
    sideRef.current = side;
  }, [side]);

  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  const settleRoundData = useCallback((nextRound, reason) => {
    const payout = nextRound.settledPayout ?? (nextRound.mult <= 0 ? 0 : nextRound.bet * nextRound.mult);
    const profit = payout - nextRound.bet;
    return {
      id: nextRound.id,
      side: nextRound.side,
      boost: nextRound.ticket,
      bet: nextRound.bet,
      mult: nextRound.mult,
      payout,
      profit,
      reason,
      busted: payout <= 0.01,
    };
  }, []);

  const updateRound = useCallback((roundId, updater) => {
    const next = asRoundList(stateRef.current).map((round) => (
      round.id === roundId ? updater(round) : round
    ));
    stateRef.current = next;
    setRounds(next);
  }, []);

  const removeSettledRound = useCallback((roundId, settlement) => {
    const current = asRoundList(stateRef.current);
    const round = current.find((r) => r.id === roundId);
    if (!round) return;
    const settled = {
      ...round,
      tradeStatus: settlement.status || "settled",
      settledPayout: settlement.payout,
      mult: settlement.payout / Math.max(round.bet, 0.000001),
    };
    const resultData = settleRoundData(settled, "bottom");
    stateRef.current = current.filter((r) => r.id !== roundId);
    setRounds(stateRef.current);
    setBalance((v) => clamp(v + resultData.payout, 0, 999999));
    setResult(resultData);
    playTone(audioRef, "close", round.side);
  }, [settleRoundData]);

  const markRoundFailed = useCallback((roundId, message) => {
    updateRound(roundId, (round) => ({
      ...round,
      tradeStatus: "failed",
      error: message,
      closeRequested: true,
    }));
  }, [updateRound]);

  const requestOpenTrade = useCallback((round) => {
    adapterRef.current.openTrade({
      roundId: round.id,
      side: round.side,
      direction: round.side === "good" ? "long" : "short",
      asset: round.asset,
      leverage: round.ticket,
      bet: round.bet,
    }).then((opened) => {
      updateRound(round.id, (current) => ({
        ...current,
        tradeStatus: "open",
        tradeId: opened.tradeId,
        openedAt: opened.openedAt,
      }));
    }).catch((error) => {
      setBalance((v) => clamp(v + round.bet, 0, 999999));
      markRoundFailed(round.id, error.message || "Open failed");
    });
  }, [markRoundFailed, updateRound]);

  const requestCloseTrade = useCallback((round) => {
    adapterRef.current.closeTrade({
      roundId: round.id,
      tradeId: round.tradeId,
      side: round.side,
      asset: round.asset,
      leverage: round.ticket,
      bet: round.bet,
      mult: round.mult,
    }).then((closed) => {
      removeSettledRound(round.id, closed);
    }).catch((error) => {
      markRoundFailed(round.id, error.message || "Close failed");
    });
  }, [markRoundFailed, removeSettledRound]);

  const closeAll = useCallback((reason) => {
    const current = asRoundList(stateRef.current);
    if (!current.length) return;
    const closable = current.filter((round) => round.tradeStatus === "open" && !round.closeRequested);
    const next = current.map((round) => (
      closable.some((item) => item.id === round.id)
        ? { ...round, tradeStatus: "closing", closeRequested: true, closeReason: reason }
        : round
    ));
    stateRef.current = next;
    setRounds(next);
    closable.forEach((round) => requestCloseTrade({ ...round, closeReason: reason }));
  }, [requestCloseTrade]);

  const step = useCallback((ms) => {
    const currentList = asRoundList(stateRef.current);
    if (!currentList.length) return;

    const maxMs = Math.min(ms, 80);
    const substeps = Math.max(1, Math.ceil(maxMs / 12));
    const dt = (maxMs / substeps) / 1000;
    const nextRounds = [];
    const sounds = [];
    const closeRequests = [];

    currentList.forEach((current) => {
      if (current.tradeStatus === "closing" || current.tradeStatus === "failed") {
        nextRounds.push(current);
        return;
      }
      let ball = { ...current.ball };
      let pegsHit = current.pegsHit;
      let lastHit = current.lastHit;
      let newSparks = [...(current.sparks || [])];

      for (let s = 0; s < substeps; s += 1) {
        ball.vy += GAME.gravity * dt;
        ball.vx += Math.sin(current.seed + (current.elapsed / 1000 + s) * 4.2) * 0.052 * dt;
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;

        if (ball.x - ball.r < current.lane.min) {
          ball.x = current.lane.min + ball.r;
          ball.vx = Math.abs(ball.vx) * 0.72;
        }
        if (ball.x + ball.r > current.lane.max) {
          ball.x = current.lane.max - ball.r;
          ball.vx = -Math.abs(ball.vx) * 0.72;
        }
        if (ball.y - ball.r < 0.03) {
          ball.y = 0.03 + ball.r;
          ball.vy = Math.abs(ball.vy) * 0.5;
        }

        for (let i = 0; i < PEGS.length; i += 1) {
          const peg = PEGS[i];
          if (peg.x < current.lane.min - 0.03 || peg.x > current.lane.max + 0.03) continue;
          const dx = ball.x - peg.x;
          const dy = ball.y - peg.y;
          const minDist = ball.r + peg.r;
          const distSq = dx * dx + dy * dy;
          if (distSq <= 0 || distSq >= minDist * minDist) continue;

          const dist = Math.sqrt(distSq);
          const nx = dx / dist;
          const ny = dy / dist;
          const overlap = minDist - dist;
          ball.x += nx * overlap;
          ball.y += ny * overlap;

          const vn = ball.vx * nx + ball.vy * ny;
          if (vn < 0) {
            const restitution = 0.48;
            ball.vx -= (1 + restitution) * vn * nx;
            ball.vy -= (1 + restitution) * vn * ny;
            const tangentX = -ny;
            const tangentY = nx;
            const vt = ball.vx * tangentX + ball.vy * tangentY;
            ball.vx -= vt * tangentX * 0.16;
            ball.vy -= vt * tangentY * 0.16;
            ball.vx += rand(-0.01, 0.01);
            if (i !== lastHit) {
              pegsHit += 1;
              newSparks.push({ x: peg.x, y: peg.y, age: 0, side: current.side });
              if (current.elapsed - current.lastPegSound > 85) {
                sounds.push({ type: "peg", side: current.side });
                current.lastPegSound = current.elapsed;
              }
            }
            lastHit = i;
          }
        }

        ball.vx *= 0.994;
        ball.vy *= 0.998;
        if (current.ticketLocked && ball.vy < 0.035) {
          ball.vy += 0.018 * dt;
        }
        const speed = Math.hypot(ball.vx, ball.vy);
        if (speed > GAME.maxSpeed) {
          ball.vx = (ball.vx / speed) * GAME.maxSpeed;
          ball.vy = (ball.vy / speed) * GAME.maxSpeed;
        }
      }

      const elapsed = current.elapsed + maxMs;
      const ticketLocked = current.ticketLocked;
      let lastPegSound = current.lastPegSound;
      const sparks = newSparks
        .map((spark) => ({ ...spark, age: spark.age + maxMs }))
        .filter((spark) => spark.age < 520);
      const progress = clamp((ball.y - 0.055) / (GAME.closeLine - 0.055), 0, 1);
      const wave = Math.sin(current.seed + elapsed * 0.0017) * 0.28;
      const chop = Math.sin(current.seed * 0.7 + pegsHit * 1.9) * 0.13;
      const hitNoise = (pegsHit % 2 ? 0.035 : -0.018) * Math.min(pegsHit, 9);
      const priceMove = (current.bias * progress + wave + chop + hitNoise) * 0.0019;
      const nextMult = clamp(1 + priceMove * current.ticket, 0, 12);
      if (ball.y >= GAME.closeLine && elapsed < GAME.minRunMs) {
        ball.y = GAME.closeLine - 0.006;
        ball.vy = Math.min(Math.abs(ball.vy), 0.006);
        ball.vx *= 0.65;
      }
      const next = {
        ...current,
        elapsed,
        mult: nextMult,
        minMult: Math.min(current.minMult, nextMult),
        maxMult: Math.max(current.maxMult, nextMult),
        pegsHit,
        lastHit,
        lastPegSound,
        ball,
        ticketLocked,
        sparks,
      };

      const shouldClose = next.mult <= 0.01 || (next.elapsed >= GAME.minRunMs && next.ball.y >= GAME.closeLine);
      if (shouldClose && next.tradeStatus === "open" && !next.closeRequested) {
        const closingRound = {
          ...next,
          tradeStatus: "closing",
          closeRequested: true,
        };
        closeRequests.push(closingRound);
        nextRounds.push(closingRound);
      } else if (shouldClose && next.tradeStatus === "opening") {
        nextRounds.push({
          ...next,
          ball: {
            ...next.ball,
            y: GAME.closeLine - 0.006,
            vy: 0.004,
          },
        });
      } else if (next.tradeStatus === "closing" || next.tradeStatus === "failed") {
        nextRounds.push(next);
      } else {
        nextRounds.push(next);
      }
    });

    stateRef.current = nextRounds;
    setRounds(nextRounds);
    closeRequests.forEach((round) => requestCloseTrade(round));
    sounds.slice(0, 6).forEach((sound) => playTone(audioRef, sound.type, sound.side));
  }, [requestCloseTrade]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const currentRounds = asRoundList(stateRef.current);
    const visibleRounds = currentRounds.filter((round) => round.tradeStatus !== "closing" && round.tradeStatus !== "failed");
    const currentSide = currentRounds[currentRounds.length - 1]?.side || sideRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(320, Math.round(rect.width * dpr));
    const h = Math.max(560, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cw = w / dpr;
    const ch = h / dpr;
    const bg = bgRef.current;
    ctx.clearRect(0, 0, cw, ch);
    if (bg?.complete) {
      const scale = Math.max(cw / bg.width, ch / bg.height);
      const bw = bg.width * scale;
      const bh = bg.height * scale;
      ctx.drawImage(bg, (cw - bw) / 2, (ch - bh) / 2, bw, bh);
    } else {
      const grad = ctx.createLinearGradient(0, 0, cw, 0);
      grad.addColorStop(0, "#9bdcff");
      grad.addColorStop(0.5, "#172143");
      grad.addColorStop(1, "#260521");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, cw, ch);
    }

    ctx.fillStyle = "rgba(1, 4, 12, 0.24)";
    ctx.fillRect(0, 0, cw, ch);
    const board = {
      x: cw * 0.18,
      y: ch * 0.1,
      w: cw * 0.62,
      h: ch * 0.78,
    };
    const r = Math.min(30, board.w * 0.09);

    ctx.save();
    roundRect(ctx, board.x, board.y, board.w, board.h, r);
    const panel = ctx.createLinearGradient(board.x, 0, board.x + board.w, 0);
    panel.addColorStop(0, "rgba(111, 208, 255, 0.2)");
    panel.addColorStop(0.5, "rgba(255,255,255,0.08)");
    panel.addColorStop(1, "rgba(175, 53, 255, 0.22)");
    ctx.fillStyle = panel;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.38)";
    ctx.stroke();
    ctx.clip();

    drawPegs(ctx, board, visibleRounds);
    drawCloseLine(ctx, board, visibleRounds);
    drawSparks(ctx, board, visibleRounds);
    if (visibleRounds.length) {
      visibleRounds.forEach((round) => drawBall(ctx, board, round, round.side));
    } else {
      drawBall(ctx, board, null, currentSide);
    }
    ctx.restore();

    drawMascotAura(ctx, cw, ch, currentSide);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = BG_SRC;
    bgRef.current = img;
    img.onload = draw;
  }, [draw]);

  useEffect(() => {
    let last = performance.now();
    const loop = (now) => {
      step(now - last);
      last = now;
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw, step]);

  useEffect(() => {
    window.advanceTime = (ms) => {
      const steps = Math.max(1, Math.round(ms / 16.67));
      for (let i = 0; i < steps; i += 1) step(16.67);
      draw();
    };
    window.render_game_to_text = () => JSON.stringify({
      screen: "plink",
      mode: activeRounds.length ? "running" : result ? "result" : "idle",
      coordinate_system: "canvas normalized x/y, origin top-left",
      selected_side: side,
      bet,
      balance: Number(balance.toFixed(2)),
      active_count: activeRounds.length,
      open_count: openRounds.length,
      next_boost: nextBoost.leverage + "x",
      next_asset: nextBoost.asset,
      rounds: activeRounds.map((round) => ({
        id: round.id,
        side: round.side,
        boost: round.ticket + "x",
        asset: round.asset,
        boost_status: round.tradeStatus,
        progress: Number(clamp((round.ball.y - 0.055) / (GAME.closeLine - 0.055), 0, 1).toFixed(3)),
        boost_locked: round.ticketLocked,
        multiplier: Number(round.mult.toFixed(3)),
        pegs_hit: round.pegsHit,
        live_ms: Math.round(round.elapsed),
        trade_id: round.tradeId,
        error: round.error,
        ball: {
          x: Number(round.ball.x.toFixed(3)),
          y: Number(round.ball.y.toFixed(3)),
          vx: Number(round.ball.vx.toFixed(3)),
          vy: Number(round.ball.vy.toFixed(3)),
        },
      })),
      result,
    });
  }, [activeRounds, balance, bet, draw, nextBoost, result, side, step]);

  useEffect(() => {
    if (!result || !activeRounds.length) return undefined;
    const timeout = window.setTimeout(() => setResult(null), 1800);
    return () => window.clearTimeout(timeout);
  }, [activeRounds.length, result]);

  const start = (nextSide = side) => {
    if (balanceRef.current < bet) return;
    sideRef.current = nextSide;
    setSide(nextSide);
    const next = makeRound(nextSide, bet, nextBoost);
    setResult(null);
    playTone(audioRef, "launch", nextSide);
    playTone(audioRef, "boost", nextSide);
    setNextBoost(pickBoost());
    balanceRef.current = clamp(balanceRef.current - bet, 0, 999999);
    setBalance(balanceRef.current);
    stateRef.current = [...asRoundList(stateRef.current), next];
    setRounds(stateRef.current);
    requestOpenTrade(next);
  };

  const cashOut = () => {
    closeAll("cashout");
  };

  const boostText = latestRound ? latestRound.ticket + "x" : "????";
  const nextBoostText = nextBoost.leverage + "x";

  return (
    <>
      <div className="plink-shell">
        <canvas ref={canvasRef} className="plink-canvas" aria-label="Plink game board" />
        <div className="plink-vignette" />
        <img className={"board-mascot board-mascot-good " + (side === "good" ? "active" : "")} src={GOOD_RUNNER_SRC} alt="" />
        <img className={"board-mascot board-mascot-evil " + (side === "evil" ? "active" : "")} src={EVIL_RUNNER_SRC} alt="" />

        <header className="plink-top">
          <button className="plink-back" onClick={() => { window.location.href = "/"; }}>HISCORE</button>
          <div>
            <div className="plink-title">PLINK</div>
            <div className="plink-subtitle">choose your path</div>
          </div>
          <div className="plink-balance">
            <span>BALANCE</span>
            <strong>{money(balance)}</strong>
          </div>
        </header>

        <section className="plink-right">
          <div className="plink-card live-card">
            <span>CURRENT</span>
            <strong className={latestRound && latestRound.mult < 1 ? "hot danger" : "hot"}>
              {latestRound ? latestRound.mult.toFixed(2) : "1.00"}x
            </strong>
            <small>{activeRounds.length ? `${openRounds.filter((round) => round.tradeStatus === "open").length} open / ${activeRounds.length} balls` : "choose path"}</small>
          </div>
          <div className="plink-card">
            <span>BOOST</span>
            <strong>{latestRound ? boostText : nextBoostText}</strong>
            <small>{latestRound ? latestRound.tradeStatus.toUpperCase() : "NEXT"}</small>
          </div>
          <div className="plink-card open-card">
            <span>OPEN</span>
            <div className="open-stack">
              {openRounds.length ? openRounds.map((round) => (
	                <div key={round.id} className={"open-chip " + round.side}>
	                  <strong>{round.ticket}x</strong>
	                  <small>{round.tradeStatus === "open" ? `${round.mult.toFixed(2)}x` : round.tradeStatus}</small>
	                </div>
              )) : (
                <small className="open-empty">none</small>
              )}
            </div>
          </div>
          <button className="cashout-btn" disabled={!activeRounds.length} onClick={cashOut}>CASH OUT ALL</button>
        </section>

        <footer className="plink-controls">
          <div className="control-group">
            <span>BET</span>
            <div className="pill-row">
              {BETS.map((v) => (
                <button key={v} className={bet === v ? "active" : ""} onClick={() => setBet(v)}>
                  ${v}
                </button>
              ))}
            </div>
          </div>
          <div className="path-actions">
            <button className="path-drop good" disabled={!canDrop} onClick={() => start("good")}>
              <img src={GOOD_RUNNER_SRC} alt="" />
              <span>GOOD</span>
            </button>
            <button className="path-drop evil" disabled={!canDrop} onClick={() => start("evil")}>
              <img src={EVIL_RUNNER_SRC} alt="" />
              <span>EVIL</span>
            </button>
          </div>
          <div className="control-group boost-help">
            <span>NEXT BOOST</span>
            <strong>{nextBoostText}</strong>
          </div>
        </footer>

        {result && activeRounds.length > 0 && (
          <div className={"settle-toast " + result.side}>
            <span>{result.busted ? "BUST" : "CLOSED"}</span>
            <strong className={result.profit >= 0 ? "win" : "loss"}>
              {result.profit >= 0 ? "+" : "-"}{money(Math.abs(result.profit))}
            </strong>
            <small>{result.boost}x / {result.mult.toFixed(2)}x</small>
          </div>
        )}

        {result && activeRounds.length === 0 && (
          <div className="result-wrap">
            <div className={"result-card " + result.side}>
              <span>{result.reason === "cashout" ? "CASHED OUT" : result.busted ? "BUST" : "PLINKED"}</span>
              <strong className={result.profit >= 0 ? "win" : "loss"}>
                {result.profit >= 0 ? "+" : "-"}{money(Math.abs(result.profit))}
              </strong>
              <small>{result.boost}x {result.side === "good" ? "GOOD" : "EVIL"} / {result.mult.toFixed(2)}x</small>
              <button onClick={() => setResult(null)}>CLEAR</button>
            </div>
          </div>
        )}
      </div>
      <style>{styles}</style>
      <Analytics />
    </>
  );
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawPegs(ctx, board, rounds) {
  PEGS.forEach((peg) => {
    const px = board.x + board.w * peg.x;
    const py = board.y + board.h * peg.y;
    const glow = rounds.length
      ? Math.max(...rounds.map((round) => {
        const contact = round.ball.r + peg.r;
        return Math.max(0, 1 - Math.max(0, Math.hypot(round.ball.x - peg.x, round.ball.y - peg.y) - contact) * 42);
      }))
      : 0;
    const nearest = rounds.find((round) => Math.hypot(round.ball.x - peg.x, round.ball.y - peg.y) < round.ball.r + peg.r + 0.018);
    const notch = peg.y > 0.76;
    const radius = Math.max(2.8, board.w * peg.r);
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${notch ? 0.38 : 0.5 + glow * 0.4})`;
    ctx.shadowColor = nearest?.side === "evil" ? "rgba(198, 92, 255, 0.7)" : "rgba(255, 226, 111, 0.7)";
    ctx.shadowBlur = 4 + glow * 16;
    ctx.arc(px, py, radius + glow * 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.stroke();
  });
  for (let i = 0; i < 13; i += 1) {
    const x = board.x + board.w * (0.06 + i * 0.073);
    const y = board.y + board.h * 0.905;
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,255,255,0.26)";
    ctx.lineWidth = 2;
    ctx.shadowColor = "rgba(255,255,255,0.28)";
    ctx.shadowBlur = 8;
    ctx.moveTo(x, y + board.h * 0.055);
    ctx.lineTo(x + board.w * 0.018, y - board.h * 0.01);
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
}

function drawCloseLine(ctx, board, rounds) {
  const y = board.y + board.h * GAME.closeLine;
  const liveNear = rounds.some((round) => round.ball.y > GAME.closeLine - 0.11);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.strokeStyle = liveNear ? "rgba(114,255,177,0.72)" : "rgba(255,255,255,0.28)";
  ctx.lineWidth = liveNear ? 3 : 2;
  ctx.shadowColor = "rgba(114,255,177,0.5)";
  ctx.shadowBlur = liveNear ? 18 : 6;
  ctx.setLineDash([10, 9]);
  ctx.beginPath();
  ctx.moveTo(board.x + board.w * 0.08, y);
  ctx.lineTo(board.x + board.w * 0.92, y);
  ctx.stroke();
  ctx.restore();
}

function drawSparks(ctx, board, rounds) {
  const sparks = rounds.flatMap((round) => round.sparks || []);
  if (!sparks.length) return;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  sparks.forEach((spark) => {
    const t = clamp(spark.age / 520, 0, 1);
    const x = board.x + board.w * spark.x;
    const y = board.y + board.h * spark.y;
    const color = spark.side === "evil" ? "196, 92, 255" : "255, 226, 111";
    ctx.globalAlpha = 1 - t;
    ctx.strokeStyle = `rgba(${color}, ${1 - t})`;
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i += 1) {
      const a = i * 1.26 + t * 2;
      const len = 5 + t * 15;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
      ctx.stroke();
    }
  });
  ctx.restore();
}

function drawBall(ctx, board, round, side) {
  const idleX = side === "good" ? 0.29 : 0.71;
  const bx = board.x + board.w * (round?.ball.x ?? idleX);
  const by = board.y + board.h * (round?.ball.y ?? 0.055);
  const radius = round ? Math.max(8, board.w * round.ball.r) : 8;
  const vx = round?.ball.vx ?? 0;
  const vy = round?.ball.vy ?? 0;
  const speed = Math.hypot(vx, vy);
  if (round && speed > 0.03) {
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    const trail = ctx.createLinearGradient(bx - vx * 260, by - vy * 260, bx, by);
    trail.addColorStop(0, "rgba(255,255,255,0)");
    trail.addColorStop(0.72, round.side === "evil" ? "rgba(86,36,122,0.12)" : "rgba(120,98,36,0.12)");
    trail.addColorStop(1, round.side === "evil" ? "rgba(237,196,255,0.34)" : "rgba(255,246,190,0.34)");
    ctx.strokeStyle = trail;
    ctx.lineWidth = radius * 0.95;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(bx - vx * 260, by - vy * 260);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.restore();
  }
  ctx.save();
  ctx.globalAlpha = round ? 0.28 : 0.16;
  ctx.fillStyle = "rgba(0,0,0,0.8)";
  ctx.beginPath();
  ctx.ellipse(bx + radius * 0.2, by + radius * 1.05, radius * 0.95, radius * 0.34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const sideEvil = (round?.side ?? side) === "evil";
  const chrome = ctx.createRadialGradient(bx - radius * 0.38, by - radius * 0.48, radius * 0.12, bx, by, radius * 1.28);
  chrome.addColorStop(0, "#ffffff");
  chrome.addColorStop(0.18, sideEvil ? "#f2d8ff" : "#fff8d6");
  chrome.addColorStop(0.34, sideEvil ? "#b56bdf" : "#dfbe53");
  chrome.addColorStop(0.58, sideEvil ? "#4f1a70" : "#73591d");
  chrome.addColorStop(0.78, "#f8f8f2");
  chrome.addColorStop(1, sideEvil ? "#1b0a25" : "#2d250e");
  ctx.shadowColor = sideEvil ? "#c45cff" : "#ffe26f";
  ctx.shadowBlur = round ? 18 : 8;
  ctx.beginPath();
  ctx.fillStyle = chrome;
  ctx.arc(bx, by, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 2.2;
  ctx.strokeStyle = "rgba(255,255,255,0.76)";
  ctx.stroke();
  ctx.shadowBlur = 0;

  const rim = ctx.createLinearGradient(bx - radius, by - radius, bx + radius, by + radius);
  rim.addColorStop(0, "rgba(255,255,255,0.9)");
  rim.addColorStop(0.45, "rgba(255,255,255,0.08)");
  rim.addColorStop(0.72, sideEvil ? "rgba(255,99,226,0.55)" : "rgba(255,231,95,0.5)");
  rim.addColorStop(1, "rgba(0,0,0,0.2)");
  ctx.beginPath();
  ctx.strokeStyle = rim;
  ctx.lineWidth = 1.2;
  ctx.arc(bx, by, radius * 0.78, Math.PI * 0.05, Math.PI * 1.65);
  ctx.stroke();

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  const stripe = ctx.createLinearGradient(bx - radius * 0.7, by - radius * 0.25, bx + radius * 0.7, by + radius * 0.45);
  stripe.addColorStop(0, "rgba(255,255,255,0)");
  stripe.addColorStop(0.48, "rgba(255,255,255,0.4)");
  stripe.addColorStop(1, "rgba(255,255,255,0)");
  ctx.strokeStyle = stripe;
  ctx.lineWidth = radius * 0.28;
  ctx.beginPath();
  ctx.arc(bx, by, radius * 0.48, Math.PI * 0.12, Math.PI * 1.05);
  ctx.stroke();
  ctx.restore();

  ctx.beginPath();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.arc(bx - radius * 0.36, by - radius * 0.42, radius * 0.18, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "rgba(255,255,255,0.42)";
  ctx.arc(bx + radius * 0.26, by + radius * 0.18, radius * 0.09, 0, Math.PI * 2);
  ctx.fill();
}

function drawMascotAura(ctx, cw, ch, side) {
  ctx.save();
  const goodActive = side === "good";
  const evilActive = side === "evil";
  const goodX = cw * 0.13;
  const evilX = cw * 0.87;
  const y = ch * 0.79;
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = goodActive ? "rgba(255, 222, 99, 0.26)" : "rgba(255, 222, 99, 0.08)";
  ctx.beginPath();
  ctx.ellipse(goodX, y, cw * 0.07, ch * 0.045, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = evilActive ? "rgba(196, 92, 255, 0.3)" : "rgba(196, 92, 255, 0.08)";
  ctx.beginPath();
  ctx.ellipse(evilX, y, cw * 0.07, ch * 0.045, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

const styles = `
  @font-face { font-family: Kleemax; src: url('/fonts/KleemaxDemo.ttf'); }
  .plink-shell {
    position: relative;
    min-height: 100dvh;
    overflow: hidden;
    background: #05050a;
    color: white;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  }
  .plink-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
  .plink-vignette {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 50% 46%, transparent 0 42%, rgba(0,0,0,0.22) 70%),
      linear-gradient(180deg, rgba(0,0,0,0.18), transparent 18%, transparent 68%, rgba(0,0,0,0.58));
    pointer-events: none;
  }
  .plink-top {
    position: absolute;
    top: max(14px, env(safe-area-inset-top));
    left: 16px;
    right: 16px;
    display: grid;
    grid-template-columns: 88px 1fr 112px;
    align-items: center;
    gap: 10px;
    z-index: 3;
  }
  .plink-title {
    font-family: Kleemax, Inter, sans-serif;
    font-size: clamp(30px, 7vw, 54px);
    letter-spacing: 0.08em;
    text-align: center;
    text-shadow: 0 3px 18px rgba(0,0,0,0.5);
  }
  .plink-subtitle {
    margin-top: -4px;
    color: rgba(255,255,255,0.72);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.18em;
    text-align: center;
    text-transform: uppercase;
  }
  .plink-back, .plink-balance, .plink-card, .plink-controls, .result-card {
    border: 1px solid rgba(255,255,255,0.18);
    background: rgba(8,10,18,0.54);
    box-shadow: 0 12px 30px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.12);
    backdrop-filter: blur(14px);
  }
  .plink-back {
    height: 38px;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    font-size: 11px;
    font-weight: 900;
    letter-spacing: 0.08em;
  }
  .plink-balance {
    border-radius: 10px;
    padding: 7px 9px;
    text-align: right;
  }
  .plink-balance span, .plink-card span, .control-group span {
    display: block;
    color: rgba(255,255,255,0.62);
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.13em;
  }
  .plink-balance strong, .plink-card strong {
    display: block;
    font-size: 18px;
    line-height: 1.1;
  }
  .plink-right {
    position: absolute;
    top: 118px;
    z-index: 3;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .plink-right { right: 14px; width: min(150px, 29vw); }
  .plink-card {
    border-radius: 12px;
    padding: 10px;
  }
  .plink-card small {
    display: block;
    color: rgba(255,255,255,0.68);
    font-size: 11px;
    font-weight: 750;
    margin-top: 3px;
  }
  .open-card {
    padding-bottom: 8px;
  }
  .open-stack {
    display: grid;
    gap: 6px;
    margin-top: 8px;
    max-height: 210px;
    overflow: auto;
    scrollbar-width: none;
  }
  .open-stack::-webkit-scrollbar { display: none; }
  .open-chip {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
    gap: 6px;
    min-height: 34px;
    border-radius: 999px;
    padding: 6px 8px 6px 10px;
    border: 1px solid rgba(255,255,255,0.16);
    background: radial-gradient(circle at 25% 20%, rgba(255,255,255,0.3), rgba(255,255,255,0.05) 42%, rgba(0,0,0,0.18));
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.18), 0 8px 18px rgba(0,0,0,0.24);
    animation: open-pop 260ms ease-out both;
  }
  .open-chip.good {
    border-color: rgba(255,226,111,0.44);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.18), 0 0 18px rgba(255,226,111,0.12);
  }
  .open-chip.evil {
    border-color: rgba(216,148,255,0.42);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.18), 0 0 18px rgba(196,92,255,0.16);
  }
  .open-chip strong {
    font-size: 15px;
    line-height: 1;
  }
  .open-chip small {
    margin: 0;
    color: rgba(255,255,255,0.82);
    font-size: 10px;
  }
  .open-empty {
    margin-top: 8px;
  }
  @keyframes open-pop {
    from { opacity: 0; transform: translateX(12px) scale(0.9); filter: brightness(1.8); }
    to { opacity: 1; transform: translateX(0) scale(1); filter: brightness(1); }
  }
  .live-card .hot {
    color: #68ffac;
    font-size: 28px;
    text-shadow: 0 0 20px rgba(104,255,172,0.42);
  }
  .live-card .hot.danger {
    color: #ff6275;
    text-shadow: 0 0 20px rgba(255,98,117,0.42);
  }
  .board-mascot {
    position: absolute;
    z-index: 2;
    width: clamp(98px, 12vw, 176px);
    height: auto;
    pointer-events: none;
    filter: drop-shadow(0 18px 24px rgba(0,0,0,0.5));
    opacity: 0.82;
    transition: transform 0.2s ease, opacity 0.2s ease, filter 0.2s ease;
  }
  .board-mascot.active {
    opacity: 1;
    transform: translateY(-8px) scale(1.06);
  }
  .board-mascot-good {
    left: max(18px, 5vw);
    bottom: 18%;
  }
  .board-mascot-evil {
    right: max(18px, 5vw);
    bottom: 18%;
  }
  .board-mascot-evil.active {
    filter: drop-shadow(0 0 22px rgba(196,92,255,0.52)) drop-shadow(0 18px 24px rgba(0,0,0,0.5));
  }
  .board-mascot-good.active {
    filter: drop-shadow(0 0 22px rgba(255,226,111,0.5)) drop-shadow(0 18px 24px rgba(0,0,0,0.5));
  }
  .cashout-btn, .path-drop, .result-card button {
    border: 0;
    color: #07080c;
    cursor: pointer;
    font-weight: 950;
    letter-spacing: 0.08em;
    box-shadow: 0 12px 28px rgba(0,0,0,0.32);
  }
  .cashout-btn {
    height: 52px;
    border-radius: 12px;
    background: linear-gradient(180deg, #72ffb1, #18b865);
  }
  .cashout-btn:disabled, .path-drop:disabled, .pill-row button:disabled {
    opacity: 0.58;
    cursor: not-allowed;
  }
  .plink-controls {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: max(14px, env(safe-area-inset-bottom));
    z-index: 3;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(260px, 360px) minmax(0, 1fr);
    gap: 10px;
    align-items: center;
    border-radius: 16px;
    padding: 10px;
  }
  .control-group {
    min-width: 0;
  }
  .boost-help {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 14px;
    padding: 10px 12px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
  }
  .boost-help strong {
    display: block;
    margin-top: 4px;
    color: rgba(255,255,255,0.94);
    font-size: 24px;
    line-height: 1;
    letter-spacing: 0.04em;
  }
  .pill-row {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    margin-top: 7px;
  }
  .pill-row button {
    min-width: 42px;
    height: 30px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.08);
    color: white;
    cursor: pointer;
    font-size: 11px;
    font-weight: 900;
  }
  .pill-row button.active {
    border-color: rgba(255,255,255,0.6);
    background: rgba(255,255,255,0.22);
  }
  .path-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    min-width: 0;
  }
  .path-drop {
    position: relative;
    height: 86px;
    overflow: hidden;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.22);
    color: white;
    text-align: left;
    padding: 16px 14px;
    isolation: isolate;
  }
  .path-drop.good {
    background: linear-gradient(135deg, rgba(255,232,130,0.96), rgba(197,135,20,0.9));
    color: #171008;
  }
  .path-drop.evil {
    background: linear-gradient(135deg, rgba(111,39,162,0.98), rgba(29,7,39,0.98));
  }
  .path-drop img {
    position: absolute;
    right: -12px;
    bottom: -24px;
    width: 108px;
    z-index: -1;
    filter: drop-shadow(0 10px 18px rgba(0,0,0,0.35));
  }
  .path-drop.evil img {
    right: -20px;
    width: 116px;
  }
  .path-drop span {
    display: block;
    font-size: 20px;
    font-weight: 950;
    letter-spacing: 0.08em;
  }
  .path-drop small {
    display: block;
    margin-top: 2px;
    font-size: 11px;
    font-weight: 950;
    letter-spacing: 0.14em;
    opacity: 0.72;
  }
  .settle-toast {
    position: absolute;
    left: 50%;
    bottom: 128px;
    z-index: 4;
    display: grid;
    grid-template-columns: auto auto auto;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    transform: translateX(-50%);
    border-radius: 999px;
    padding: 9px 14px;
    border: 1px solid rgba(255,255,255,0.18);
    background: rgba(9,11,20,0.72);
    box-shadow: 0 16px 34px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.12);
    backdrop-filter: blur(16px);
    pointer-events: none;
  }
  .settle-toast span {
    color: rgba(255,255,255,0.66);
    font-size: 10px;
    font-weight: 950;
    letter-spacing: 0.14em;
  }
  .settle-toast strong {
    font-size: 20px;
    line-height: 1;
  }
  .settle-toast strong.win { color: #67ffae; }
  .settle-toast strong.loss { color: #ff6375; }
  .settle-toast small {
    color: rgba(255,255,255,0.7);
    font-size: 11px;
    font-weight: 850;
  }
  .result-wrap {
    position: absolute;
    inset: 0;
    z-index: 5;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.34);
    padding: 18px;
  }
  .result-card {
    width: min(360px, 92vw);
    border-radius: 18px;
    padding: 24px;
    text-align: center;
  }
  .result-card span {
    display: block;
    color: rgba(255,255,255,0.7);
    font-size: 12px;
    font-weight: 950;
    letter-spacing: 0.16em;
  }
  .result-card strong {
    display: block;
    margin: 8px 0;
    font-size: 46px;
    line-height: 1;
  }
  .result-card strong.win { color: #67ffae; }
  .result-card strong.loss { color: #ff6375; }
  .result-card small {
    display: block;
    color: rgba(255,255,255,0.68);
    font-weight: 800;
  }
  .result-card button {
    margin-top: 18px;
    height: 44px;
    width: 100%;
    border-radius: 12px;
    background: white;
  }
  @media (max-width: 780px) {
    .plink-top { grid-template-columns: 70px 1fr 94px; left: 10px; right: 10px; }
    .plink-right { top: auto; bottom: 326px; right: 10px; width: 112px; }
    .board-mascot {
      width: 92px;
      bottom: 31%;
    }
    .board-mascot-good { left: 6px; }
    .board-mascot-evil { right: 6px; }
    .plink-card { padding: 8px; }
    .plink-card strong { font-size: 16px; }
    .live-card .hot { font-size: 24px; }
    .open-stack { max-height: 86px; gap: 4px; }
    .open-chip { min-height: 28px; padding: 5px 7px; }
    .open-chip strong { font-size: 12px; }
    .open-chip small { font-size: 9px; }
    .plink-controls {
      grid-template-columns: 1fr;
      gap: 8px;
    }
    .path-actions { order: -1; }
    .path-drop { height: 74px; }
    .path-drop img { width: 92px; bottom: -20px; }
    .path-drop.evil img { width: 98px; }
    .settle-toast { bottom: 288px; max-width: calc(100vw - 28px); }
    .pill-row { flex-wrap: nowrap; overflow: hidden; }
    .pill-row button { flex: 1; min-width: 0; }
  }
`;
