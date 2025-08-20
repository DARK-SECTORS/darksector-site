import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, Copy, Github, Twitter, Send, Globe,
  Play, Pause, Shield, Zap, Coins, Info, Youtube,
} from "lucide-react";
import "./index.css";

/* ============= util ============= */
const cn = (...cls) => cls.filter(Boolean).join(" ");

/* ============= Scramble (hover) ============= */
const HoverScrambleType = ({ text, className = "" }) => {
  const [display, setDisplay] = useState(text);
  const running = useRef(false);
  const startTs = useRef(0);
  const raf = useRef(null);
  const finalRef = useRef(text);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890$#@&";
  const S1 = 350, S2 = 650, TOTAL = S1 + S2;

  useEffect(() => {
    finalRef.current = text;
    setDisplay(text);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [text]);

  const loop = (ts) => {
    if (!running.current) return;
    if (!startTs.current) startTs.current = ts;
    const t = ts - startTs.current;
    const str = finalRef.current;
    const len = str.length;

    const fixed = t <= S1 ? 0 : Math.floor(len * Math.min(1, (t - S1) / S2));
    const left = str.slice(0, fixed);
    const right = str.slice(fixed).split("")
      .map(() => letters[(Math.random() * letters.length) | 0]).join("");
    setDisplay(left + right);

    if (t >= TOTAL) {
      setDisplay(str);
      running.current = false;
      cancelAnimationFrame(raf.current);
      return;
    }
    raf.current = requestAnimationFrame(loop);
  };

  const onEnter = () => {
    if (running.current) return;
    running.current = true;
    startTs.current = 0;
    raf.current = requestAnimationFrame(loop);
  };

  return (
    <span className={cn("scramble-wrap select-none", className)} onMouseEnter={onEnter}>
      <span className="scramble-placeholder">{text}</span>
      <span className="scramble-actual">{display}</span>
    </span>
  );
};

/* ============= Scramble (авто на монтаж + hover) ============= */
const ScrambleText = ({ text, className = "" }) => {
  const [display, setDisplay] = useState(text);
  const running = useRef(false);
  const startTs = useRef(0);
  const raf = useRef(null);
  const finalRef = useRef(text);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890$#@&";
  const S1 = 280, S2 = 520, TOTAL = S1 + S2;

  useEffect(() => {
    finalRef.current = text;
    setDisplay(text);
    // автозапуск при монтуванні
    running.current = true;
    startTs.current = 0;
    raf.current = requestAnimationFrame(loop);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const loop = (ts) => {
    if (!running.current) return;
    if (!startTs.current) startTs.current = ts;
    const t = ts - startTs.current;
    const str = finalRef.current;
    const len = str.length;

    const fixed = t <= S1 ? 0 : Math.floor(len * Math.min(1, (t - S1) / S2));
    const left = str.slice(0, fixed);
    const right = str.slice(fixed).split("")
      .map(() => letters[(Math.random() * letters.length) | 0]).join("");
    setDisplay(left + right);

    if (t >= TOTAL) {
      setDisplay(str);
      running.current = false;
      cancelAnimationFrame(raf.current);
      return;
    }
    raf.current = requestAnimationFrame(loop);
  };

  const onEnter = () => {
    if (running.current) return;
    running.current = true;
    startTs.current = 0;
    raf.current = requestAnimationFrame(loop);
  };

  return (
    <span className={cn("scramble-wrap select-none", className)} onMouseEnter={onEnter}>
      <span className="scramble-placeholder">{text}</span>
      <span className="scramble-actual">{display}</span>
    </span>
  );
};

/* ============= layout helpers ============= */
const Frame = ({ className = "", children }) => (
  <div className={cn("relative rounded-2xl p-[1px] bg-gradient-to-b from-slate-700/70 via-slate-600/30 to-slate-800/20", className)}>
    <div className="rounded-2xl bg-[#0a0d12]/90 backdrop-blur-sm transition-all duration-200 hover:shadow-[0_0_0_1px_rgba(148,163,184,.35),0_20px_40px_rgba(0,0,0,.35)] hover:-translate-y-0.5">
      {children}
    </div>
  </div>
);

const Starfield = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-[#06080c]" />
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 1px, transparent 1px)," +
          "radial-gradient(circle at 80% 30%, rgba(255,255,255,0.05) 1.2px, transparent 1.2px)," +
          "radial-gradient(circle at 40% 70%, rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "1200px 1200px, 1000px 1000px, 1400px 1400px",
        backgroundBlendMode: "screen",
        opacity: 0.6,
      }}
    />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.10),transparent_60%)]" />
  </div>
);

const Reveal = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 22 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay }}>
      {children}
    </motion.div>
  );
};

const Button = ({ href, icon: Icon, children, className = "", ...props }) => (
  <a href={href} className={cn("btn-fill btn-glow relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-slate-100", className)} {...props}>
    {Icon && <Icon className="h-4 w-4" />}
    <span className="text-sm font-medium tracking-wide">{children}</span>
    <ArrowRight className="ml-1 h-4 w-4 opacity-70" />
  </a>
);

const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/60 px-3 py-1 text-[11px] uppercase tracking-wider text-slate-300">
    <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
    {children}
  </span>
);

const Title = ({ k1, k2, sub }) => (
  <div className="mb-8 space-y-2">
    <h2 className="text-2xl md:text-3xl font-semibold text-slate-100">
      <HoverScrambleType text={k1} />{k2 ? <> <span className="text-slate-400">/</span> <HoverScrambleType text={k2} /></> : null}
    </h2>
    {sub && <p className="max-w-2xl text-slate-300/80">{sub}</p>}
  </div>
);

const Copyable = ({ value, label = "Copy" }) => {
  const [ok, setOk] = useState(false);
  const onCopy = async () => { try { await navigator.clipboard.writeText(value); setOk(true); setTimeout(() => setOk(false), 1200); } catch {} };
  return (
    <button onClick={onCopy} className="group inline-flex items-center gap-2 rounded-lg border border-slate-700/60 px-3 py-2 text-slate-200/90 transition-colors hover:border-slate-400/60 hover:text-white">
      <Copy className="h-4 w-4" />
      <span className="text-xs tracking-wide">{ok ? "Copied!" : label}</span>
    </button>
  );
};

const MediaCard = ({ title, href, icon: Icon }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="group">
    <Frame className="h-full frame-glow">
      <div className="flex items-center gap-3 px-4 py-4">
        <Icon className="h-5 w-5 text-slate-200 transition-all icon-glow" />
        <div>
          <div className="font-medium text-slate-100"><HoverScrambleType text={title} /></div>
          <div className="text-xs text-slate-400">{href?.replace(/^https?:\/\//, "")}</div>
        </div>
      </div>
    </Frame>
  </a>
);

/* ============= Accordion (FAQ) ============= */
const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const Accordion = ({ items }) => {
  const [open, setOpen] = useState(null);
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <Frame key={i}>
          <button className="flex w-full items-center justify-between px-4 py-4 text-left" onClick={() => setOpen(open === i ? null : i)}>
            <div className="text-base md:text-lg font-medium text-slate-100"><HoverScrambleType text={it.q} /></div>
            <motion.div animate={{ rotate: open === i ? 45 : 0 }}><PlusIcon /></motion.div>
          </button>
          <motion.div initial={false} animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 pt-0 text-slate-300/90">{it.a}</div>
          </motion.div>
        </Frame>
      ))}
    </div>
  );
};

/* ============= Candles (4 шаблони, фікси крашів) ============= */
function CycleCandles() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const readyRef = useRef(false);

  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d", { alpha: true });
    const DPR = Math.min(2, window.devicePixelRatio || 1);

    let w = 0, h = 0;
    const padX = 12, padY = 12;
    const bodyW = 4;
    const gap = 2;
    let N = 0;

    const DURATION = 8000;
    let phase = 0;
    let idx = 0;
    let last = performance.now();

    let stylesA = [];
    let stylesB = [];
    let TEMPLATES = [];

    const resize = () => {
      const r = c.getBoundingClientRect();
      w = Math.max(1, r.width); h = Math.max(1, r.height);
      c.width = Math.floor(w * DPR); c.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      N = Math.max(30, Math.floor((w - padX * 2) / (bodyW + gap)));
      const genSeries = (n, bias, amp) => {
        const out = []; let p = 100;
        for (let i = 0; i < n; i++) {
          const d = (Math.random() - 0.5) * amp + bias;
          const open = p;
          const close = p + d;
          const high = Math.max(open, close) + Math.random() * (amp * 0.6);
          const low  = Math.min(open, close) - Math.random() * (amp * 0.6);
          p = close;
          out.push({ open, close, high, low });
        }
        return out;
      };

      TEMPLATES = [
        genSeries(N,  +0.35, 8.0),
        genSeries(N,  -0.25, 7.0),
        genSeries(N,   0.00, 5.0),
        genSeries(N,  +0.20, 12.0),
      ];
      stylesA = Array.from({ length: N }, () => (Math.random() < 0.55 ? "filled" : "outline"));
      stylesB = Array.from({ length: N }, () => (Math.random() < 0.55 ? "filled" : "outline"));
      readyRef.current = true;
    };
    resize();
    window.addEventListener("resize", resize);

    const lerp = (a, b, t) => a + (b - a) * t;
    const lerpC = (a, b, t) => ({
      open:  lerp(a.open,  b.open,  t),
      close: lerp(a.close, b.close, t),
      high:  lerp(a.high,  b.high,  t),
      low:   lerp(a.low,   b.low,   t),
    });
    const ease = (t) => t*t*(3-2*t);

    let viewMin = 0, viewMax = 1;
    const computeBounds = (A, B, t) => {
      const mnA = Math.min(...A.map(c=>c.low)), mxA = Math.max(...A.map(c=>c.high));
      const mnB = Math.min(...B.map(c=>c.low)), mxB = Math.max(...B.map(c=>c.high));
      const mn = lerp(mnA, mnB, t), mx = lerp(mxA, mxB, t);
      const pad = (mx - mn) * 0.2 + 8;
      viewMin = lerp(viewMin, mn - pad, 0.12);
      viewMax = lerp(viewMax, mx + pad, 0.12);
      if (!Number.isFinite(viewMin) || !Number.isFinite(viewMax) || viewMax - viewMin < 1e-6) {
        viewMin = mn - pad; viewMax = mx + pad;
      }
    };
    const y = (v) => {
      const range = Math.max(1e-6, viewMax - viewMin);
      return padY + (h - padY * 2) * (1 - (v - viewMin) / range);
    };

    const draw = (now) => {
      if (!readyRef.current || TEMPLATES.length < 2) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const dt = now - last; last = now;
      phase += dt / DURATION;
      if (phase >= 1) {
        phase = 0;
        idx = (idx + 1) % TEMPLATES.length;
        stylesA = stylesB;
        stylesB = Array.from({ length: N }, () => (Math.random() < 0.55 ? "filled" : "outline"));
      }

      const nextIdx = (idx + 1) % TEMPLATES.length;
      const A = TEMPLATES[idx] || [];
      const B = TEMPLATES[nextIdx] || [];
      const t = ease(Math.min(1, Math.max(0, phase)));

      if (A.length !== N || B.length !== N) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      computeBounds(A, B, t);

      const wLocal = c.width / DPR;
      const hLocal = c.height / DPR;

      const r = 16;
      const edge = ctx.createLinearGradient(0,0,wLocal,0);
      edge.addColorStop(0,"rgba(11,15,22,1)");
      edge.addColorStop(0.06,"rgba(11,15,22,0)");
      edge.addColorStop(0.94,"rgba(11,15,22,0)");
      edge.addColorStop(1,"rgba(11,15,22,1)");

      ctx.clearRect(0,0,wLocal,hLocal);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(r,0); ctx.arcTo(wLocal,0,wLocal,hLocal,r); ctx.arcTo(wLocal,hLocal,0,hLocal,r);
      ctx.arcTo(0,hLocal,0,0,r); ctx.arcTo(0,0,wLocal,0,r); ctx.closePath();
      ctx.clip();

      for (let i=0;i<N;i++){
        const a = A[i], b = B[i];
        if (!a || !b) continue;
        const cd = lerpC(a, b, t);
        const x = padX + i*(bodyW+gap) + bodyW/2;

        const up = (cd.close ?? 0) >= (cd.open ?? 0);
        const color = up ? "rgba(34,197,94,1)" : "rgba(239,68,68,1)";
        const glow  = up ? "rgba(34,197,94,.45)" : "rgba(239,68,68,.45)";

        const top = y(Math.max(cd.open, cd.close));
        const bot = y(Math.min(cd.open, cd.close));
        const height = Math.max(2, bot-top);

        ctx.save();
        ctx.shadowColor = glow; ctx.shadowBlur = 8;

        ctx.lineWidth = 1.1;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, y(cd.high));
        ctx.lineTo(x, y(cd.low));
        ctx.stroke();

        const styleNow = phase < .5 ? stylesA[i] : stylesB[i];
        if (styleNow === "filled") {
          ctx.fillStyle = color;
          ctx.fillRect(x - bodyW/2, top, bodyW, height);
        } else {
          ctx.lineWidth = 1.6;
          ctx.strokeStyle = color;
          ctx.strokeRect(x - bodyW/2, top, bodyW, height);
        }
        ctx.restore();
      }

      ctx.fillStyle = edge; ctx.fillRect(0,0,wLocal,hLocal);
      ctx.restore();
      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full block" />;
}

/* ============= Cursor digits (глобально, менші/рідші/швидше зникають) ============= */
function CursorDigitsGlobal() {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const particles = useRef([]);
  const mouse = useRef({ x: -9999, y: -9999 });
  const lastEmit = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const w = Math.max(1, window.innerWidth);
      const h = Math.max(1, window.innerHeight);
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const letters = "01ACEF234579";
    const onMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const draw = (t) => {
      const w = canvas.width / DPR;
      const h = canvas.height / DPR;
      ctx.clearRect(0, 0, w, h);

      if (t - lastEmit.current > 40) {
        lastEmit.current = t;
        particles.current.push({
          x: mouse.current.x,
          y: mouse.current.y,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          born: t,
          life: 650 + Math.random() * 350,
          char: letters[(Math.random() * letters.length) | 0],
        });
      }

      particles.current.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        const age = t - p.born;
        const a = Math.max(0, 1 - age / p.life) * 0.75;
        if (a <= 0) return;
        ctx.globalAlpha = a;
        ctx.fillStyle = "#e6edf5";
        ctx.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.fillText(p.char, p.x, p.y);
        ctx.globalAlpha = 1;
      });
      particles.current = particles.current.filter((p) => (t - p.born) < p.life);

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-30" />;
}

/* ============= Panel (без локальних курсор‑цифр) ============= */
const TokenLogoPanel = () => {
  return (
    <Frame>
      <div className="relative overflow-hidden rounded-2xl">
        {/* Темний фон-квадрат */}
        <div className="relative z-0 aspect-[4/3] w-full bg-[#0b0f16]" />

        {/* Свічі — на всю площу під лініями */}
        <CycleCandles />

        {/* Горизонтальні лінії поверх свічей */}
        <div className="absolute inset-0 z-20 opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]">
          {Array.from({ length: 22 }).map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300/25 to-transparent"
              style={{ top: `${(i + 1) * 4}%` }}
            />
          ))}
        </div>
      </div>
    </Frame>
  );
};

/* ============= Tokenomics bar ============= */
const TrimBar = ({ value = 72, label }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null, raf;
    const anim = (t) => { if (!start) start = t; const p = Math.min(1, (t - start) / 1000); setShown(Math.round(value * p)); if (p < 1) raf = requestAnimationFrame(anim); };
    raf = requestAnimationFrame(anim);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-300/80">
        <span>{label}</span><span>{shown}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800/80 overflow-hidden">
        <motion.div className="h-2 rounded-full trim-fill" initial={{ width: 0 }} animate={inView ? { width: `${value}%` } : {}} transition={{ duration: 1.0, ease: "easeOut" }} />
      </div>
    </div>
  );
};

/* ============= content ============= */
const features = [
  { icon: Shield, title: "Audited Smart Contract", text: "Security-first contract with upgrade-safe patterns. (Placeholder)" },
  { icon: Zap, title: "High Velocity Launch", text: "Instant liquidity, fair mechanics, transparent metrics." },
  { icon: Coins, title: "Real Utility", text: "In-bot perks, tiers, on-chain roles, and community quests." },
];
const faq = [
  { q: "What is $VADER?", a: "Dark Sector's native token powering access, tiers, and in-ecosystem utility." },
  { q: "Which chain?", a: "Solana. Fast, low fees, and vibrant tooling." },
  { q: "When listing?", a: "TBA. Follow X/Telegram for dates. This site updates automatically when live." },
  { q: "Contract address?", a: "Will appear here at TGE. Use the copy button from the hero once announced." },
];
const mediaLinks = [
  { title: "Twitter / X", href: "https://x.com/Dark_Sector_", icon: Twitter },
  { title: "Telegram", href: "https://t.me/sector_empire", icon: Send },
  { title: "YouTube", href: "https://youtube.com/@dark-secto_r?si=kiaYX1QfqgxvkgRh", icon: Youtube },
  { title: "GitHub (site repo)", href: "https://github.com/DARK-SECTORS/darksector-site", icon: Github },
];

/* ============= marquee ============= */
const RowMarquee = ({ direction = 1 }) => {
  const items = Array.from({ length: 12 }).map((_, i) => `Coming soon #${i + 1}`);
  return (
    <div className="marquee-full">
      <motion.div
        className="flex gap-5 py-2"
        animate={{ x: direction > 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 24, ease: "linear", repeat: Infinity }}
        style={{ width: "200%" }}
      >
        {[...items, ...items].map((t, i) => (
          <div key={i} className="min-w-[260px]">
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/60 px-6 py-4 text-center text-slate-300/80">
              {t}
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

/* ============= App ============= */
export default function App() {
  const [addr] = useState("So1anaVADER_Address_Will_Go_Here_0000");
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const scrollTop = (e) => { e?.preventDefault?.(); window.scrollTo({ top: 0, behavior: "smooth" }); };

  useEffect(() => {
    const a = audioRef.current; if (!a) return;
    a.volume = 0.12; a.loop = true;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    const unlock = () => { if (a.paused) a.play().catch(()=>{}); document.removeEventListener("click", unlock); };
    document.addEventListener("click", unlock);
    return () => { a.removeEventListener("play", onPlay); a.removeEventListener("pause", onPause); document.removeEventListener("click", unlock); };
  }, []);

  const toggleAudio = () => {
    const a = audioRef.current; if (!a) return;
    a.paused ? a.play().catch(()=>{}) : a.pause();
  };

  return (
    <div className="relative text-slate-200">
      <div id="top" />
      <Starfield />
      <CursorDigitsGlobal />

      <audio ref={audioRef} src="/audio/imperial-march.mp3" preload="auto" loop />

      {/* NAV */}
      <header className="sticky top-0 z-30 border-b border-slate-800/60 bg-[#06080c]/70 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <a href="#top" onClick={scrollTop} className="inline-flex">
              <img src="/logo.png" alt="Dark Sector" className="h-16 w-16" />
            </a>
            <div className="text-sm font-semibold tracking-widest">DARK SECTOR</div>
          </div>

          <nav className="hidden items-center gap-4 md:flex">
            <button onClick={toggleAudio} className="rounded-lg border border-slate-700/60 px-2 py-1 text-xs text-slate-300 hover:text-white hover:border-slate-400/60 mr-2 inline-flex items-center gap-1">
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{playing ? "Pause" : "Play"}</span>
            </button>
            <a href="https://jup.ag/" target="_blank" rel="noopener noreferrer" className="btn-buy mr-2">Buy $VADER</a>
            {[
              ["About", "#about"],
              ["Tokenomics", "#tokenomics"],
              ["How to Buy", "#how"],
              ["Roadmap", "#roadmap"],
              ["FAQ", "#faq"],
              ["Media", "#media"],
            ].map(([label, href]) => (
              <a key={href} href={href} className="text-xs uppercase tracking-wider text-slate-300 hover:text-white link-underline">
                <HoverScrambleType text={label} />
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <Reveal>
            <div className="space-y-6">
              <Badge>Intergalactic Launch Status: <span className="ml-2 text-white">PRE-LIVE</span></Badge>

              <h1 className="text-4xl md:text-5xl leading-tight space-y-2">
                <span className="block text-slate-300 font-semibold tracking-wide">Welcome to</span>
                <span className="block text-white text-5xl md:text-6xl starjedi">Dark Sector</span>
              </h1>

              <p className="max-w-xl text-slate-300/90">
                Dark, minimalist, and merciless. Built for speed, clarity, and cinematic motion. <strong>$VADER</strong> is your key to ranks, access, and power across the Dark Sector ecosystem.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button href="#how" icon={Play}>How to Buy</Button>
                <Button href="#tokenomics" icon={Info}>Tokenomics</Button>
                <Copyable value={addr} label="Copy contract (soon)" />
              </div>

              <div className="text-[11px] text-slate-400">CA placeholder · Solana</div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <TokenLogoPanel />
          </Reveal>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-6xl px-4 py-16">
        <Title k1="About" k2="The Empire" sub="Dark, minimalist, and merciless. Built for speed, clarity, and cinematic motion." />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <Frame className="frame-glow group">
                <div className="space-y-2 p-5">
                  <f.icon className="h-5 w-5 text-amber-300 icon-glow" />
                  <div className="text-lg font-medium text-white"><HoverScrambleType text={f.title} /></div>
                  <p className="text-sm text-slate-300/90">{f.text}</p>
                </div>
              </Frame>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TOKENOMICS */}
      <section id="tokenomics" className="mx-auto max-w-6xl px-4 py-16">
        <Title k1="Token" k2="Economy" sub="Transparent allocations with animated progress to mirror on-chain distribution." />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <Reveal>
            <Frame>
              <div className="space-y-5 p-6">
                <div className="text-lg font-semibold text-white"><HoverScrambleType text="$VADER Supply & Allocation" /></div>
                <TrimBar value={40} label="Liquidity & Listing" />
                <TrimBar value={25} label="Community Rewards" />
                <TrimBar value={15} label="Team & Ops (Vested)" />
                <TrimBar value={10} label="Treasury" />
                <TrimBar value={10} label="Partnerships" />
              </div>
            </Frame>
          </Reveal>
          <Reveal delay={0.1}>
            <Frame>
              <div className="space-y-5 p-6">
                <div className="text-lg font-semibold text-white"><HoverScrambleType text="Key Parameters" /></div>
                <ul className="space-y-3 text-slate-300/90">
                  <li>Chain: <strong>Solana</strong></li>
                  <li>Ticker: <strong>VADER</strong></li>
                  <li>Decimals: <strong>9</strong></li>
                  <li>Supply: <strong>1,000,000,000</strong> (example)</li>
                </ul>
                <div className="pt-2"><Button href="#faq" icon={Info}>More details</Button></div>
              </div>
            </Frame>
          </Reveal>
        </div>
      </section>

      {/* HOW TO BUY */}
      <section id="howtobuy" className="py-20">
        <h2 className="text-3xl md:text-4xl text-center mb-12 text-white">
          <ScrambleText text="HOW TO BUY" />
        </h2>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3 px-4">
          {[
            { t: "Get a Solana wallet", d: "Install Phantom or Backpack and secure your seed phrase." },
            { t: "Fund with SOL", d: "Purchase SOL on a CEX, then transfer to your wallet." },
            { t: "Swap for $VADER", d: "Use a DEX like Jupiter/Orca once we go live." },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <Frame className="frame-glow group h-full">
                <div className="space-y-2 p-5 card-dim">
                  <div className="text-lg font-semibold text-white">
                    <span className="flicker-once">{s.t}</span>
                  </div>
                  <p className="text-sm text-slate-300/90">{s.d}</p>
                </div>
              </Frame>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ROADMAP */}
      <section id="roadmap" className="py-20 bg-black/40">
        <h2 className="text-3xl md:text-4xl text-center mb-12 text-white">
          <ScrambleText text="ROADMAP" />
        </h2>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 px-4">
          {[
            ["Phase I — Ignition", ["Teaser trailer launch", "Social channels online", "First community quests"]],
            ["Phase II — Expansion", ["Forum & empire threads", "XP / Rank Telegram bot", "Community leaderboard"]],
            ["Phase III — Utility", ["$VADER token live on Solana", "Wallet integration in bot", "Community perks & tiers"]],
            ["Phase IV — Dominion", ["DEX listings & liquidity", "Merch & creative campaigns", "Global expansion of the empire"]],
          ].map(([title, items], i) => (
            <Reveal key={i} delay={i * 0.06}>
              <Frame className="frame-glow group h-full">
                <div className="space-y-2 p-5 card-dim">
                  <div className="text-sm font-semibold text-white">
                    <span className="flicker-hover">{title}</span>
                  </div>
                  <ul className="list-disc space-y-1 pl-5 text-xs text-slate-300/90">
                    {items.map((li, k) => <li key={k}>{li}</li>)}
                  </ul>
                </div>
              </Frame>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TEAM / SPONSORS */}
      <section id="partners" className="py-20">
        <div className="mb-8 space-y-2 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-100">
            <HoverScrambleType text="Team / Sponsors" />
          </h2>
        </div>
        <div className="space-y-6">
          <RowMarquee direction={1} />
          <RowMarquee direction={-1} />
          <RowMarquee direction={1} />
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-4xl px-4 py-16">
        <Title k1="FAQ" sub="Answers open with smooth expansion and letter-scramble headings." />
        <Accordion items={faq} />
      </section>

      {/* MEDIA */}
      <section id="media" className="mx-auto max-w-6xl px-4 py-16">
        <Title k1="Media" k2="Links" sub="All official channels and mirrors live here." />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {mediaLinks.map((m, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <MediaCard {...m} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/60 bg-[#06080c]/70">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
          <div className="text-xs text-slate-400">© {new Date().getFullYear()} Dark Sector. All rights reserved.</div>
          <div className="flex items-center gap-3">
            <Button href="https://t.me/sectorsup_bot" icon={Send} target="_blank" rel="noopener noreferrer">Contact</Button>
            <Button href="https://t.me/darksectorforum" icon={Globe} target="_blank" rel="noopener noreferrer">Forum</Button>
          </div>
        </div>
      </footer>
    </div>
  );
}
