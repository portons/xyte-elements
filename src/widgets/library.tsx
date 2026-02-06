// @ts-nocheck
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import type { XyteWidgetMode } from "../explorer/types";
import { buildRuntimeX, type ThemeId } from "../theme/themes";

// ══════════════════════════════════════════════════════════════════════════════
//  XYTE CONNECT+ — AV FLEET DASHBOARD v2
//  Dark theme using XYTE's actual extracted brand system
//  40+ interactive AV/UC widget types
// ══════════════════════════════════════════════════════════════════════════════

let X = buildRuntimeX("xyte_classic_dark", "modern");

export function setWidgetRuntimeTheme(
  themeId: ThemeId,
  mode: XyteWidgetMode = "modern",
) {
  X = buildRuntimeX(themeId, mode);
}

const ease = { o: "cubic-bezier(0,0,.2,1)", sp: "cubic-bezier(.34,1.56,.64,1)", mv: "cubic-bezier(.4,0,.2,1)" };

// ── HOOKS ────────────────────────────────────────────────────────────────
function useAnim(t, d = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => { let s = null; const f = ts => { if (!s) s = ts; const p = Math.min((ts - s) / d, 1); setV(t * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }, [t, d]);
  return v;
}
function useLive(b, vr = 3, iv = 1200) {
  const [v, setV] = useState(b);
  useEffect(() => { const i = setInterval(() => setV(b + (Math.random() - .5) * vr * 2), iv); return () => clearInterval(i); }, [b, vr, iv]);
  return v;
}
function useTick(iv = 1000) {
  const [t, setT] = useState(0);
  useEffect(() => { const i = setInterval(() => setT(c => c + 1), iv); return () => clearInterval(i); }, [iv]);
  return t;
}

// ── PRIMITIVES ───────────────────────────────────────────────────────────
function normalizeCardWidth(width) {
  if (typeof width === "number") return `min(100%, ${width}px)`;
  if (typeof width === "string" && /^[0-9.]+px$/.test(width.trim())) {
    return `min(100%, ${width.trim()})`;
  }
  return width;
}

function Card({ children, style, delay = 0, glow, noPad, onClick }) {
  const [h, setH] = useState(false);
  const resolvedStyle = { ...(style || {}) };
  if (resolvedStyle.width) {
    resolvedStyle.width = normalizeCardWidth(resolvedStyle.width);
  }
  resolvedStyle.maxWidth = "100%";
  resolvedStyle.minWidth = resolvedStyle.minWidth ?? 0;

  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={onClick} style={{
      background: X.gradCard, borderRadius: X.r, border: `1px solid ${h ? X.borderHov : X.border}`,
      boxShadow: h ? X.shHov : X.sh,
      padding: noPad ? 0 : 16,
      transition: `border-color 200ms ${ease.o}, box-shadow 200ms ${ease.o}, transform 200ms ${ease.o}`,
      position: "relative",
      overflow: "hidden",
      cursor: onClick ? "pointer" : "default",
      animation: `si 300ms ${ease.o} ${delay}ms both`,
      ...resolvedStyle,
    }}>
      {glow && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${glow}60, transparent)` }} />}
      {children}
    </div>
  );
}

const Lbl = ({ children, style }) => <div style={{ fontFamily: X.m, fontSize: 9, color: X.textMut, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 600, lineHeight: 1, ...style }}>{children}</div>;
const M = ({ children, style }) => <span style={{ fontFamily: X.m, ...style }}>{children}</span>;
const Dot = ({ c, pulse, s = 6 }) => <span style={{ display: "inline-block", width: s, height: s, borderRadius: "50%", background: c, flexShrink: 0, animation: pulse ? "br 2s ease infinite" : "none", boxShadow: pulse ? `0 0 6px ${c}50` : "none" }} />;

function Badge({ children, color = X.purple, solid, style: s }) {
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: solid ? "3px 8px" : "2px 7px", borderRadius: 16, background: solid ? color : color + "18", color: solid ? "#fff" : color, fontFamily: X.m, fontSize: 9, fontWeight: 600, lineHeight: 1, ...s }}>{children}</span>;
}

function Btn({ children, onClick, color = X.purple, small, ghost, active, disabled, style: s }) {
  const [hov, setHov] = useState(false);
  const bg = ghost ? (active ? color + "15" : hov ? color + "0a" : "transparent") : (disabled ? X.border : color);
  const clr = ghost ? (active ? color : X.textMut) : "#fff";
  const brd = ghost ? `1px solid ${active ? color + "30" : X.border}` : "none";
  return (
    <button onClick={disabled ? undefined : onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      padding: small ? "3px 8px" : "6px 14px", borderRadius: small ? 12 : X.rs,
      border: brd, background: bg, color: clr, fontFamily: X.m, fontSize: small ? 9 : 10,
      fontWeight: 600, cursor: disabled ? "default" : "pointer", opacity: disabled ? .4 : 1,
      transition: `background-color 150ms ${ease.mv}, border-color 150ms ${ease.mv}, color 150ms ${ease.mv}, box-shadow 150ms ${ease.mv}, transform 150ms ${ease.mv}`, display: "inline-flex", alignItems: "center", gap: 4, ...s,
    }}>{children}</button>
  );
}

function Prog({ value = 0, color = X.purple, h = 3, style: s }) {
  return (
    <div style={{ height: h, borderRadius: h, background: X.borderLight, overflow: "hidden", ...s }}>
      <div style={{ height: "100%", borderRadius: h, width: `${Math.min(Math.max(value, 0), 100)}%`, background: color, transition: `width 500ms ${ease.sp}` }} />
    </div>
  );
}

function Slider({ value, onChange, min = 0, max = 100, color = X.purple, label, unit = "" }) {
  const pct = ((value - min) / (max - min)) * 100;
  const ref = useRef(null);
  const handle = e => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    onChange(Math.round(min + p * (max - min)));
  };
  const [drag, setDrag] = useState(false);
  useEffect(() => {
    if (!drag) return;
    const mv = e => handle(e);
    const up = () => setDrag(false);
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
  }, [drag]);
  return (
    <div>
      {label && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><Lbl>{label}</Lbl><M style={{ fontSize: 10, color, fontWeight: 700 }}>{value}{unit}</M></div>}
      <div ref={ref} onMouseDown={e => { setDrag(true); handle(e); }} style={{ height: 20, display: "flex", alignItems: "center", cursor: "pointer" }}>
        <div style={{ flex: 1, height: 3, borderRadius: 2, background: X.borderLight, position: "relative" }}>
          <div style={{ height: "100%", borderRadius: 2, width: `${pct}%`, background: color, transition: drag ? "none" : `width 200ms ${ease.mv}` }} />
          <div style={{ position: "absolute", top: -5, left: `calc(${pct}% - 6px)`, width: 12, height: 12, borderRadius: "50%", background: color, boxShadow: `0 0 8px ${color}40`, transition: drag ? "none" : `left 200ms ${ease.mv}` }} />
        </div>
      </div>
    </div>
  );
}

// ── XYTE LOGO (dark variant) ─────────────────────────────────────────────
function XyteLogo({ s = 16 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <svg width={s * 4} height={s} viewBox="0 0 82 21" fill="none" style={{ display: "block" }}>
        <path d="M13.6 12.8c-.5.52-.79 1.22-.79 1.95s.29 1.43.79 1.95l3.93 4 .04.04 2.92-2.98-5.89-5.99-1.01 1.03z" fill={X.text}/>
        <path d="M17.52.25l-7.27 7.27L3.03.3 2.98.26 0 3.24l7.27 7.26L.01 17.77l2.98 2.98L20.5 3.23 17.52.25z" fill={X.text}/>
        <path d="M32.67 7.58L25.8.26l-2.74 2.92 7.7 8.21v9.36h3.87V11.33L42.28 3.17 39.54.25l-6.87 7.33z" fill={X.text}/>
        <path d="M46.13 4.41h6.42v16.34h3.81V4.41h6.42V.25H46.13v4.16z" fill={X.text}/>
        <path d="M82 4.41V.25H67.91v20.5H82v-4.16H71.82v-4.01h6.55V8.42h-6.55V4.41H82z" fill={X.text}/>
      </svg>
      <div style={{ padding: "2px 5px", borderRadius: 5, background: `linear-gradient(135deg, ${X.purple}25, ${X.pink}18)`, border: `1px solid ${X.purple}30`, display: "flex", alignItems: "center", gap: 2 }}>
        <span style={{ fontSize: 8, fontWeight: 800, background: X.gradPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span>
        <svg width="7" height="7" viewBox="0 0 16 16" style={{ display: "block" }}><path d="M8 0l1.8 6.2L16 8l-6.2 1.8L8 16l-1.8-6.2L0 8l6.2-1.8z" fill={X.purple} opacity=".7"/></svg>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  1. KPI CARD — sparkline + trend
// ══════════════════════════════════════════════════════════════════════════
function KPI({ value = 1247, prev = 1180, label = "Devices Online", color = X.purple, delay = 0 }) {
  const a = useAnim(value, 1200);
  const delta = prev ? (((value - prev) / prev) * 100).toFixed(1) : 0;
  const up = value >= prev;
  const spark = useMemo(() => Array.from({ length: 20 }, (_, i) => prev + (value - prev) * (i / 19) + (Math.random() - .5) * value * .08), [value, prev]);
  const mn = Math.min(...spark), mx = Math.max(...spark);
  const pts = spark.map((v, i) => `${(i / 19) * 100},${100 - ((v - mn) / (mx - mn || 1)) * 100}`).join(" ");
  return (
    <Card delay={delay} glow={color} style={{ flex: "1 1 180px", minWidth: 165 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <Lbl>{label}</Lbl>
        <Badge color={up ? X.teal : X.red}>{up ? "▲" : "▼"} {Math.abs(delta)}%</Badge>
      </div>
      <M style={{ fontSize: 26, fontWeight: 800, color: X.text, display: "block", marginBottom: 6, letterSpacing: "-.02em", animation: `cu 400ms ${ease.o} ${delay + 150}ms both` }}>{Math.round(a).toLocaleString()}</M>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 28, overflow: "hidden" }}>
        <defs><linearGradient id={`sk-${label}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity=".25"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
        <polygon points={`0,100 ${pts} 100,100`} fill={`url(#sk-${label})`}/>
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke"/>
      </svg>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  2. DEVICE STATUS CARD — improved with SVG icons, mini chart
// ══════════════════════════════════════════════════════════════════════════
function DeviceCard({ name = "NEC PA804UL", type = "Projector", status = "online", signal = 95, ip = "192.168.1.42", fw = "v4.2.1", temp = 42, delay = 0 }) {
  const sc = { online: X.teal, warning: X.amber, error: X.red, offline: X.textMut };
  const c = sc[status];
  const icons = {
    Projector: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="7" cy="12" r="3"/><line x1="15" y1="10" x2="19" y2="10"/><line x1="15" y1="14" x2="19" y2="14"/></svg>,
    Display: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    Camera: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    Speaker: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19"/><path d="M15.54 8.46a5 5 0 010 7.07"/></svg>,
  };
  return (
    <Card delay={delay} style={{ width: 270 }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: X.rs, background: c + "12", border: `1px solid ${c}20`, display: "flex", alignItems: "center", justifyContent: "center" }}>{icons[type] || icons.Projector}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: X.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
          <M style={{ fontSize: 9, color: X.textSec }}>{type}</M>
        </div>
        <Dot c={c} pulse={status === "online"} s={7} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 8 }}>
        {[["Signal", signal + "%", signal > 80 ? X.teal : signal > 40 ? X.amber : X.red], ["Temp", temp + "°", temp > 60 ? X.red : temp > 45 ? X.amber : X.teal], ["FW", fw, X.textSec], ["IP", ip.split(".").slice(-1)[0], X.textMut]].map(([l, v, vc], i) => (
          <div key={i}><Lbl style={{ marginBottom: 2 }}>{l}</Lbl><M style={{ fontSize: 10, fontWeight: 600, color: vc }}>{v}</M></div>
        ))}
      </div>
      <Prog value={signal} color={c} h={2} />
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  3. RADIAL GAUGE — contained SVG, glow effect
// ══════════════════════════════════════════════════════════════════════════
function Gauge({ value = 72, max = 100, label = "CPU", unit = "%", color = X.purple, size = 88 }) {
  const a = useAnim(value);
  const r = (size - 12) / 2, circ = 2 * Math.PI * r, range = 260;
  const pct = Math.min(a / max, 1), off = circ - (pct * range / 360) * circ;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      <div style={{ width: size, height: size, position: "relative", overflow: "hidden" }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={X.borderLight} strokeWidth={4} strokeDasharray={`${circ * range / 360} ${circ * (1 - range / 360)}`} strokeLinecap="round" transform={`rotate(140 ${size / 2} ${size / 2})`} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={4} strokeDasharray={`${circ * range / 360} ${circ * (1 - range / 360)}`} strokeDashoffset={off} strokeLinecap="round" transform={`rotate(140 ${size / 2} ${size / 2})`} style={{ transition: `stroke-dashoffset 800ms ${ease.mv}`, filter: `drop-shadow(0 0 4px ${color}40)` }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <M style={{ fontSize: size * .24, fontWeight: 800, color: X.text }}>{Math.round(a)}</M>
          <M style={{ fontSize: 7, color: X.textMut }}>{unit}</M>
        </div>
      </div>
      <Lbl>{label}</Lbl>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  4. PTZ JOYSTICK — improved containment, focus/iris/gain
// ══════════════════════════════════════════════════════════════════════════
function PTZControl() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState(false);
  const [zoom, setZoom] = useState(50);
  const [focus, setFocus] = useState(75);
  const [iris, setIris] = useState(60);
  const [preset, setPreset] = useState(0);
  const ref = useRef(null);
  const sz = 110;
  const onMove = useCallback(e => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = (e.clientX ?? e.touches?.[0]?.clientX ?? 0) - r.left - r.width / 2;
    const cy = (e.clientY ?? e.touches?.[0]?.clientY ?? 0) - r.top - r.height / 2;
    let dx = cx / (sz / 2), dy = cy / (sz / 2);
    const d = Math.hypot(dx, dy); if (d > 1) { dx /= d; dy /= d; }
    setPos({ x: dx, y: dy });
  }, []);
  useEffect(() => {
    if (!drag) return;
    const up = () => { setDrag(false); setPos({ x: 0, y: 0 }); };
    window.addEventListener("mouseup", up); window.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("mouseup", up); window.removeEventListener("mousemove", onMove); };
  }, [drag, onMove]);

  return (
    <Card style={{ width: 340 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div><div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>PTZ Camera</div><M style={{ fontSize: 9, color: X.textSec }}>PTZ Optics 30X · Preset {preset + 1}</M></div>
        <Badge color={X.teal} solid><Dot c="#fff" pulse s={4} />Live</Badge>
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div ref={ref} onMouseDown={e => { setDrag(true); onMove(e); }} style={{ width: sz, height: sz, borderRadius: "50%", background: X.bgAlt, border: `1px solid ${drag ? X.purple + "50" : X.border}`, position: "relative", cursor: "grab", touchAction: "none", transition: "border-color 200ms" }}>
            <div style={{ position: "absolute", top: "50%", left: 10, right: 10, height: 1, background: X.border }} />
            <div style={{ position: "absolute", left: "50%", top: 10, bottom: 10, width: 1, background: X.border }} />
            <div style={{
              position: "absolute", width: 22, height: 22, borderRadius: "50%",
              background: X.surface, border: `2px solid ${drag ? X.purple : X.border}`,
              left: `calc(50% + ${pos.x * (sz / 2 - 14)}px - 11px)`,
              top: `calc(50% + ${pos.y * (sz / 2 - 14)}px - 11px)`,
              transition: drag ? "none" : `all 300ms ${ease.sp}`,
              boxShadow: drag ? `0 0 12px ${X.purple}30` : X.sh,
            }}>
              <div style={{ position: "absolute", inset: 5, borderRadius: "50%", background: drag ? X.purple : X.textMut, transition: "background 200ms" }} />
            </div>
          </div>
          <M style={{ fontSize: 8, color: X.textMut }}>P:{(pos.x * 180).toFixed(0)}° T:{(pos.y * -90).toFixed(0)}°</M>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <Slider value={zoom} onChange={setZoom} label="Zoom" unit="%" color={X.purple} />
          <Slider value={focus} onChange={setFocus} label="Focus" unit="%" color={X.indigo} />
          <Slider value={iris} onChange={setIris} label="Iris" unit="%" color={X.teal} />
          <div style={{ display: "flex", gap: 3, flexWrap: "wrap", marginTop: 2 }}>
            {["Wide", "Stage", "Podium", "Close"].map((p, i) => <Btn key={i} small ghost active={preset === i} onClick={() => setPreset(i)} color={X.purple}>{p}</Btn>)}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  5. AUDIO MIXER — improved fader, 8 channels
// ══════════════════════════════════════════════════════════════════════════
function Strip({ name = "Mic 1", color = X.purple }) {
  const [vol, setVol] = useState(65 + Math.random() * 20);
  const [muted, setMuted] = useState(false);
  const [lev, setLev] = useState(50);
  useEffect(() => { const i = setInterval(() => { setLev(muted ? 0 : Math.max(0, Math.min(100, vol + (Math.random() - .45) * 35))); }, 70); return () => clearInterval(i); }, [vol, muted]);
  const db = Math.round((vol / 100) * 48 - 48);
  return (
    <div style={{ width: 46, display: "flex", flexDirection: "column", alignItems: "center", gap: 0, padding: "8px 3px 6px", borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
      <M style={{ fontSize: 7, color: X.textMut, marginBottom: 4 }}>{name}</M>
      <div style={{ display: "flex", gap: 2, height: 64, marginBottom: 4 }}>
        <div style={{ width: 4, height: "100%", borderRadius: 2, background: X.borderLight, overflow: "hidden", display: "flex", flexDirection: "column-reverse" }}>
          <div style={{ width: "100%", borderRadius: 2, height: `${lev}%`, transition: "height 60ms", background: lev > 90 ? X.red : lev > 72 ? X.amber : color }} />
        </div>
        <div style={{ width: 6, height: "100%", borderRadius: 2, background: X.borderLight, position: "relative", cursor: "pointer" }}
          onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setVol(Math.max(0, Math.min(100, 100 - ((e.clientY - r.top) / r.height) * 100))); }}>
          <div style={{ position: "absolute", bottom: 0, width: "100%", height: `${vol}%`, borderRadius: 2, background: color + "18" }} />
          <div style={{ position: "absolute", width: 14, height: 5, borderRadius: 2, background: muted ? X.textMut : color, left: -4, bottom: `calc(${vol}% - 2px)`, transition: "bottom 60ms", boxShadow: `0 0 4px ${color}30` }} />
        </div>
      </div>
      <M style={{ fontSize: 10, fontWeight: 700, color: muted ? X.textMut : X.text, marginBottom: 3 }}>{muted ? "—" : db > 0 ? `+${db}` : db}</M>
      <button onClick={() => setMuted(!muted)} style={{ width: 20, height: 14, borderRadius: 3, border: "none", background: muted ? X.red : X.borderLight, color: muted ? "#fff" : X.textMut, fontFamily: X.m, fontSize: 7, fontWeight: 700, cursor: "pointer" }}>M</button>
    </div>
  );
}

function Mixer() {
  const chs = [{ n: "Mic 1", c: X.purple }, { n: "Mic 2", c: X.purple }, { n: "Line L", c: X.indigo }, { n: "Line R", c: X.indigo }, { n: "PC", c: X.teal }, { n: "BT", c: X.amber }, { n: "HDMI", c: X.pink }, { n: "Main", c: X.tealLight }];
  return (
    <Card noPad style={{ display: "inline-flex", flexDirection: "column" }}>
      <div style={{ padding: "12px 14px 6px", display: "flex", justifyContent: "space-between" }}>
        <div><div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>Audio Mixer</div><M style={{ fontSize: 9, color: X.textSec }}>QSC Core 110f · 8ch</M></div>
        <Badge color={X.teal}><Dot c={X.teal} pulse s={4} />DSP</Badge>
      </div>
      <div style={{ display: "flex", gap: 2, padding: "2px 6px 8px" }}>{chs.map((ch, i) => <Strip key={i} name={ch.n} color={ch.c} />)}</div>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  6. INPUT SELECTOR — with preview and signal strength
// ══════════════════════════════════════════════════════════════════════════
function InputSelector() {
  const inputs = [
    { id: "hdmi1", l: "HDMI 1", sig: true, res: "3840×2160p60", st: 95 },
    { id: "hdmi2", l: "HDMI 2", sig: true, res: "1920×1080p60", st: 72 },
    { id: "dp", l: "DisplayPort", sig: false, st: 0 },
    { id: "sdi", l: "SDI", sig: true, res: "1080i59.94", st: 88 },
    { id: "ndi", l: "NDI", sig: true, res: "1080p30", st: 60 },
    { id: "usbc", l: "USB-C", sig: false, st: 0 },
  ];
  const [active, setActive] = useState("hdmi1");
  return (
    <Card style={{ width: 260 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>Input Source</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {inputs.map((inp, i) => (
          <button key={inp.id} onClick={() => inp.sig && setActive(inp.id)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "7px 8px",
            borderRadius: X.rs, border: `1px solid ${active === inp.id ? X.purple + "30" : "transparent"}`,
            background: active === inp.id ? X.purple + "0c" : "transparent",
            cursor: inp.sig ? "pointer" : "default", textAlign: "left", transition: "background-color 150ms, border-color 150ms, transform 150ms",
            opacity: inp.sig ? 1 : .4, animation: `sr 180ms ${ease.o} ${i * 25}ms both`,
          }}>
            <div style={{ width: 4, height: 20, borderRadius: 2, background: active === inp.id ? X.purple : inp.sig ? X.teal + "30" : X.border }} />
            <div style={{ flex: 1 }}>
              <M style={{ fontSize: 10, fontWeight: 600, color: active === inp.id ? X.purple : X.text, display: "block" }}>{inp.l}</M>
              {inp.sig ? <M style={{ fontSize: 8, color: X.textMut }}>{inp.res}</M> : <M style={{ fontSize: 8, color: X.textMut }}>No signal</M>}
            </div>
            {inp.sig && <div style={{ width: 24 }}><Prog value={inp.st} color={inp.st > 80 ? X.teal : inp.st > 50 ? X.amber : X.red} h={2} /></div>}
          </button>
        ))}
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  7. LAMP LIFE — fixed SVG containment
// ══════════════════════════════════════════════════════════════════════════
function LampLife({ hours = 12400, max = 20000 }) {
  const pct = (hours / max) * 100;
  const c = pct > 85 ? X.red : pct > 65 ? X.amber : X.teal;
  const a = useAnim(pct);
  return (
    <Card style={{ width: 220 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>Laser Life</div>
        <Badge color={c}>{pct > 85 ? "Replace" : pct > 65 ? "Aging" : "Good"}</Badge>
      </div>
      <div style={{ width: "100%", overflow: "hidden", marginBottom: 8 }}>
        <svg viewBox="0 0 200 65" preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", height: "auto" }}>
          <path d="M 20 55 A 80 80 0 0 1 180 55" fill="none" stroke={X.borderLight} strokeWidth={5} strokeLinecap="round" />
          <path d="M 20 55 A 80 80 0 0 1 180 55" fill="none" stroke={c} strokeWidth={5} strokeLinecap="round" strokeDasharray={`${(a / 100) * 252} 252`} style={{ transition: "stroke 400ms", filter: `drop-shadow(0 0 3px ${c}40)` }} />
          <text x="100" y="42" textAnchor="middle" fontFamily={X.m} fontSize="16" fontWeight="800" fill={c}>{Math.round(a)}%</text>
          <text x="100" y="56" textAnchor="middle" fontFamily={X.m} fontSize="6" fill={X.textMut}>CAPACITY USED</text>
        </svg>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div><Lbl style={{ marginBottom: 2 }}>Used</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.text }}>{hours.toLocaleString()}h</M></div>
        <div style={{ textAlign: "right" }}><Lbl style={{ marginBottom: 2 }}>Left</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: c }}>{(max - hours).toLocaleString()}h</M></div>
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  8. SCENE PRESETS — animated transition
// ══════════════════════════════════════════════════════════════════════════
function ScenePresets() {
  const scenes = [{ n: "Presentation", d: "Projector + screens + dim lights" }, { n: "Video Call", d: "Camera + display + auto-frame" }, { n: "Standby", d: "Low power, displays off" }, { n: "All On", d: "Full brightness, all sources" }];
  const [active, setActive] = useState(0);
  const [sw, setSw] = useState(false);
  const go = i => { if (i === active || sw) return; setSw(true); setTimeout(() => { setActive(i); setSw(false); }, 600); };
  return (
    <Card style={{ width: 250 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>Room Presets</div>
        {sw && <M style={{ fontSize: 9, color: X.amber, animation: "br 800ms ease infinite" }}>Switching…</M>}
      </div>
      {scenes.map((sc, i) => (
        <button key={i} onClick={() => go(i)} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 10px",
          borderRadius: X.rs, border: `1px solid ${active === i ? X.purple + "25" : "transparent"}`,
          background: active === i ? X.purple + "0c" : "transparent", cursor: "pointer", textAlign: "left",
          marginBottom: 1, transition: "background-color 180ms, border-color 180ms, transform 180ms", animation: `sr 180ms ${ease.o} ${i * 30}ms both`,
        }}>
          <div style={{ width: 3, height: 24, borderRadius: 2, background: active === i ? X.purple : X.border, transition: "background 200ms" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: active === i ? X.text : X.textSec }}>{sc.n}</div>
            <M style={{ fontSize: 8, color: X.textMut }}>{sc.d}</M>
          </div>
          {active === i && <Badge color={X.teal} solid>Active</Badge>}
        </button>
      ))}
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  9. FIRMWARE UPDATE — improved terminal
// ══════════════════════════════════════════════════════════════════════════
function FirmwareUpdate() {
  const [phase, setPhase] = useState(0);
  const [prog, setProg] = useState(0);
  const [done, setDone] = useState(false);
  const phases = ["Download", "Verify", "Install", "Reboot"];
  useEffect(() => {
    const i = setInterval(() => setProg(p => {
      if (p >= 100) { if (phase < 3) { setPhase(c => c + 1); return 0; } else { setDone(true); clearInterval(i); return 100; } }
      return p + Math.random() * 3 + .4;
    }), 100);
    return () => clearInterval(i);
  }, [phase]);
  return (
    <Card style={{ width: 320 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
        <div><div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>Firmware Update</div><M style={{ fontSize: 9, color: X.textSec }}>v4.2.1 → v4.3.0</M></div>
        {done ? <Badge color={X.teal} solid>✓ Done</Badge> : <M style={{ fontSize: 16, fontWeight: 800, color: X.purple }}>{Math.round(((phase * 100 + prog) / 400) * 100)}%</M>}
      </div>
      <div style={{ display: "flex", gap: 3, marginBottom: 10 }}>
        {phases.map((ph, i) => (
          <div key={i} style={{ flex: 1 }}>
            <Prog value={i < phase ? 100 : i === phase ? Math.min(prog, 100) : 0} color={i < phase ? X.teal : X.purple} h={2} />
            <M style={{ fontSize: 7, color: i <= phase ? (i < phase ? X.teal : X.purple) : X.textMut, marginTop: 2, display: "block" }}>{ph}</M>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: X.m, fontSize: 9, color: X.teal, padding: "6px 8px", background: X.bg, borderRadius: X.rs, border: `1px solid ${X.borderLight}`, lineHeight: 1.4 }}>
        <span style={{ color: X.textMut }}>$</span> ota-update --target NEC-PA804UL{"\n"}
        {!done && <span style={{ color: X.purple, animation: "bl 1s step-end infinite" }}>▌</span>}
        {done ? <span style={{ color: X.teal }}>✓ All phases complete</span> : <span>{phases[phase]}… {Math.min(Math.round(prog), 100)}%</span>}
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  10. COMMAND LOG — with severity filter
// ══════════════════════════════════════════════════════════════════════════
function CommandLog() {
  const logs = [
    { t: "10:42:15", cmd: "SET input HDMI1", res: "OK", ms: 12 },
    { t: "10:42:03", cmd: "GET power.status", res: "ON", ms: 8 },
    { t: "10:41:58", cmd: "SET volume 72", res: "OK", ms: 15 },
    { t: "10:41:45", cmd: "GET lamp.hours", res: "12400", ms: 22 },
    { t: "10:41:30", cmd: "SET aspect 16:9", res: "OK", ms: 11 },
    { t: "10:40:12", cmd: "SET mute true", res: "ERR", ms: 145 },
  ];
  return (
    <Card noPad style={{ width: 340 }}>
      <div style={{ padding: "12px 14px 6px", display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>Command Log</div>
        <Badge color={X.teal}><Dot c={X.teal} pulse s={4} />RS-232</Badge>
      </div>
      <div style={{ padding: "0 6px 8px" }}>
        {logs.map((l, i) => {
          const ok = l.res === "OK" || l.res === "ON";
          return (
            <div key={i} style={{ display: "flex", gap: 6, padding: "3px 6px", borderRadius: 3, fontFamily: X.m, fontSize: 9, animation: `sr 150ms ${ease.o} ${i * 20}ms both`, background: i % 2 === 0 ? X.bgAlt : "transparent" }}>
              <span style={{ color: X.textMut, minWidth: 48 }}>{l.t}</span>
              <span style={{ color: X.purple, flex: 1 }}>{l.cmd}</span>
              <span style={{ color: ok ? X.teal : X.red, minWidth: 34, fontWeight: 600 }}>{l.res}</span>
              <span style={{ color: l.ms > 50 ? X.amber : X.textMut, minWidth: 28, textAlign: "right" }}>{l.ms}ms</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  11. NETWORK INFO — with live sparklines
// ══════════════════════════════════════════════════════════════════════════
function NetworkInfo() {
  const j = useLive(1.2, 2, 1500);
  const lat = useLive(2.1, .8, 1800);
  const rows = [["IP", "192.168.1.42"], ["MAC", "A8:5E:45:3B:C1:9F"], ["Gateway", "192.168.1.1"], ["Link", "1 Gbps"], ["PoE", "25.2W Active"], ["VLAN", "10 (AV)"], ["Latency", lat.toFixed(1) + " ms"], ["Jitter", j.toFixed(1) + " ms"]];
  return (
    <Card style={{ width: 230 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>Network</div>
      {rows.map(([l, v], i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0", borderBottom: i < rows.length - 1 ? `1px solid ${X.borderLight}` : "none", animation: `fu 150ms ${ease.o} ${i * 15}ms both` }}>
          <M style={{ fontSize: 9, color: X.textMut }}>{l}</M>
          <M style={{ fontSize: 9, fontWeight: 600, color: l === "Jitter" ? (j > 3 ? X.red : j > 1.5 ? X.amber : X.teal) : l === "Latency" ? (lat > 3 ? X.red : X.teal) : l === "PoE" ? X.teal : X.text }}>{v}</M>
        </div>
      ))}
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  12. SCHEDULE — with time indicator
// ══════════════════════════════════════════════════════════════════════════
function Schedule() {
  const events = [{ t: "09:00–10:00", n: "All Hands", st: "done" }, { t: "10:30–11:30", n: "Client Presentation", st: "live" }, { t: "13:00–14:00", n: "Design Review", st: "next" }, { t: "15:00–16:30", n: "Board Meeting", st: "next" }];
  const sc = { done: X.textMut, live: X.teal, next: X.purple };
  return (
    <Card style={{ width: 240 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>Room Schedule</div>
      {events.map((ev, i) => (
        <div key={i} style={{ display: "flex", gap: 8, padding: "7px 0", borderLeft: `2px solid ${sc[ev.st]}`, paddingLeft: 10, marginLeft: 2, opacity: ev.st === "done" ? .35 : 1, animation: `sr 180ms ${ease.o} ${i * 30}ms both` }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: X.text }}>{ev.n}</div>
            <M style={{ fontSize: 8, color: X.textMut }}>{ev.t}</M>
          </div>
          {ev.st === "live" && <Badge color={X.teal} solid>Live</Badge>}
        </div>
      ))}
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  13. PORT STATUS — improved port indicators
// ══════════════════════════════════════════════════════════════════════════
function PortStatus() {
  const ports = [{ t: "HDMI", n: 1, s: "active", d: "MacBook" }, { t: "HDMI", n: 2, s: "active", d: "Apple TV" }, { t: "HDMI", n: 3, s: "idle" }, { t: "HDMI", n: 4, s: "error" }, { t: "DP", n: 1, s: "active", d: "Laptop" }, { t: "USB-C", n: 1, s: "idle" }, { t: "SDI", n: 1, s: "active", d: "Cam 1" }, { t: "SDI", n: 2, s: "active", d: "Cam 2" }];
  const sc = { active: X.teal, idle: X.textMut, error: X.red };
  return (
    <Card noPad>
      <div style={{ padding: "12px 14px 6px", display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>I/O Ports</div>
        <Badge color={X.teal}>{ports.filter(p => p.s === "active").length}/{ports.length} Active</Badge>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3, padding: "2px 6px 8px" }}>
        {ports.map((p, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 3px", borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${p.s === "error" ? X.red + "25" : X.borderLight}`, gap: 2, animation: `fu 180ms ${ease.o} ${i * 20}ms both` }}>
            <div style={{ width: 12, height: 6, borderRadius: 2, background: sc[p.s], opacity: p.s === "idle" ? .25 : 1, boxShadow: p.s === "active" ? `0 0 4px ${X.teal}30` : "none" }} />
            <M style={{ fontSize: 7, fontWeight: 600, color: X.textSec }}>{p.t} {p.n}</M>
            {p.d ? <M style={{ fontSize: 6, color: X.teal }}>{p.d}</M> : p.s === "error" ? <M style={{ fontSize: 6, color: X.red }}>Fail</M> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  14. AUDIO SPECTRUM — peak hold, channel labels
// ══════════════════════════════════════════════════════════════════════════
function AudioSpectrum() {
  const bars = 32;
  const [levels, setLevels] = useState(() => Array(bars).fill(40));
  const [peaks, setPeaks] = useState(() => Array(bars).fill(40));
  useEffect(() => {
    const i = setInterval(() => {
      setLevels(prev => prev.map(v => Math.max(2, Math.min(100, v + (Math.random() * 100 - v) * .35))));
      setPeaks(prev => prev.map((pk, j) => { const nv = levels[j]; return nv > pk ? nv : Math.max(pk - 1.5, nv); }));
    }, 60);
    return () => clearInterval(i);
  }, [levels]);
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <Lbl>Audio Spectrum</Lbl>
        <M style={{ fontSize: 9, color: X.teal }}>−12.4 dBFS</M>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 1.5, height: 36, position: "relative" }}>
        {levels.map((lv, i) => (
          <div key={i} style={{ flex: 1, position: "relative", height: "100%" }}>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, borderRadius: 1.5, height: Math.max(1, (lv / 100) * 34), background: lv > 90 ? X.red : lv > 72 ? X.amber : X.purple, transition: "height 55ms linear", opacity: .6 + (lv / 100) * .4 }} />
            <div style={{ position: "absolute", bottom: Math.max(0, (peaks[i] / 100) * 34), left: 0, right: 0, height: 1.5, borderRadius: 1, background: X.pink, opacity: .6 }} />
          </div>
        ))}
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  15. ALERT FEED — with dismiss
// ══════════════════════════════════════════════════════════════════════════
function AlertFeed() {
  const init = [
    { t: "2m ago", msg: "HDMI 4 — HDCP handshake failed", sev: "error" },
    { t: "15m ago", msg: "Samsung QM85R — Temp 72°C", sev: "warning" },
    { t: "1h ago", msg: "FW v4.3.0 available for NEC PA804UL", sev: "info" },
    { t: "3h ago", msg: "PTZ — Auto-tracking re-enabled", sev: "success" },
  ];
  const [alerts, setAlerts] = useState(init);
  const sc = { error: X.red, warning: X.amber, info: X.purple, success: X.teal };
  return (
    <Card noPad style={{ width: 330 }}>
      <div style={{ padding: "12px 14px 6px", display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>Alerts</div>
        <Badge color={X.red}>{alerts.filter(a => a.sev === "error").length} Critical</Badge>
      </div>
      <div style={{ padding: "0 6px 8px" }}>
        {alerts.map((a, i) => (
          <div key={i} style={{ display: "flex", gap: 6, padding: "6px", borderRadius: X.rs, borderLeft: `2px solid ${sc[a.sev]}`, marginBottom: 2, background: sc[a.sev] + "08", animation: `sr 180ms ${ease.o} ${i * 30}ms both` }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: X.text, marginBottom: 1 }}>{a.msg}</div>
              <M style={{ fontSize: 8, color: X.textMut }}>{a.t}</M>
            </div>
            <button onClick={() => setAlerts(alerts.filter((_, j) => j !== i))} style={{ width: 18, height: 18, borderRadius: "50%", border: "none", background: X.bgAlt, color: X.textMut, fontSize: 10, cursor: "pointer", flexShrink: 0 }}>✕</button>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  16. VIDEO WALL — with source assignment
// ══════════════════════════════════════════════════════════════════════════
function VideoWall() {
  const layouts = { "1×1": [1, 1], "2×2": [2, 2], "3×3": [3, 3], "1×3": [3, 1] };
  const [layout, setLayout] = useState("2×2");
  const [sel, setSel] = useState(null);
  const sources = ["HDMI 1", "HDMI 2", "SDI 1", "NDI"];
  const [assigns, setAssigns] = useState({});
  const [c, r] = layouts[layout];
  return (
    <Card style={{ width: 260 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 8 }}>Video Wall</div>
      <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
        {Object.keys(layouts).map(k => <Btn key={k} small ghost active={layout === k} onClick={() => { setLayout(k); setSel(null); setAssigns({}); }}>{k}</Btn>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${c}, 1fr)`, gridTemplateRows: `repeat(${r}, 1fr)`, gap: 2, aspectRatio: layout === "1×3" ? "3/1" : "16/10", marginBottom: sel !== null ? 8 : 0 }}>
        {Array.from({ length: c * r }, (_, i) => (
          <button key={i} onClick={() => setSel(i === sel ? null : i)} style={{ borderRadius: X.rs, border: `1px solid ${sel === i ? X.purple + "50" : X.border}`, background: sel === i ? X.purple + "10" : X.bgAlt, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "background-color 180ms, border-color 180ms, transform 180ms", gap: 1, padding: 2 }}>
            <M style={{ fontSize: 10, color: sel === i ? X.purple : X.textSec, fontWeight: 700 }}>{i + 1}</M>
            {assigns[i] && <M style={{ fontSize: 6, color: X.teal }}>{assigns[i]}</M>}
          </button>
        ))}
      </div>
      {sel !== null && (
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap", animation: `fu 150ms ${ease.o}` }}>
          {sources.map(s => <Btn key={s} small ghost active={assigns[sel] === s} onClick={() => setAssigns({ ...assigns, [sel]: s })} color={X.teal}>{s}</Btn>)}
        </div>
      )}
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  17-18. TOGGLE & CMD BUTTON (improved)
// ══════════════════════════════════════════════════════════════════════════
function Toggle({ label, color = X.purple, initial = false }) {
  const [on, setOn] = useState(initial);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <button onClick={() => setOn(!on)} style={{ width: 36, height: 20, borderRadius: 10, border: "none", cursor: "pointer", background: on ? color : X.borderLight, transition: `background 180ms ${ease.mv}`, position: "relative", padding: 0 }}>
        <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: on ? 19 : 3, transition: `left 180ms ${ease.sp}`, boxShadow: "0 1px 3px #0003" }} />
      </button>
      <span style={{ fontSize: 11, color: on ? X.text : X.textMut, fontWeight: 500 }}>{label}</span>
    </div>
  );
}

function CmdBtn({ label = "Reboot", color = X.purple }) {
  const [st, setSt] = useState("idle");
  const click = () => { if (st !== "idle") return; setSt("load"); setTimeout(() => { setSt("done"); setTimeout(() => setSt("idle"), 1200); }, 900); };
  return (
    <Btn onClick={click} color={st === "idle" ? color : st === "done" ? X.teal : X.borderLight} disabled={st === "load"}>
      {st === "load" ? <span style={{ display: "inline-block", animation: "sp .7s linear infinite" }}>⟳</span> : st === "done" ? "✓" : label}
    </Btn>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  NEW WIDGETS 19-45+
// ══════════════════════════════════════════════════════════════════════════

// 19. BRIGHTNESS / CONTRAST / SATURATION
function DisplayAdjust() {
  const [bright, setBright] = useState(75);
  const [contrast, setContrast] = useState(50);
  const [sat, setSat] = useState(60);
  const [sharp, setSharp] = useState(40);
  return (
    <Card style={{ width: 250 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>Display Adjust</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Slider value={bright} onChange={setBright} label="Brightness" unit="%" color={X.amber} />
        <Slider value={contrast} onChange={setContrast} label="Contrast" unit="%" color={X.purple} />
        <Slider value={sat} onChange={setSat} label="Saturation" unit="%" color={X.pink} />
        <Slider value={sharp} onChange={setSharp} label="Sharpness" unit="%" color={X.teal} />
      </div>
    </Card>
  );
}

// 20. COLOR TEMPERATURE
function ColorTemp() {
  const [temp, setTemp] = useState(6500);
  const c = temp < 4000 ? "#ffb347" : temp > 8000 ? "#a0c4ff" : "#ffffff";
  return (
    <Card style={{ width: 250 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>Color Temperature</div>
        <M style={{ fontSize: 11, fontWeight: 700, color: c }}>{temp}K</M>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: "linear-gradient(90deg, #ff8c00, #ffecb3, #ffffff, #a0c4ff, #6090ff)", marginBottom: 8 }} />
      <Slider value={temp} onChange={setTemp} min={2700} max={10000} color={X.purple} />
      <div style={{ display: "flex", gap: 3, marginTop: 6 }}>
        {[["Warm", 3200], ["Neutral", 5600], ["Daylight", 6500], ["Cool", 9300]].map(([l, v]) => <Btn key={l} small ghost active={temp === v} onClick={() => setTemp(v)}>{l}</Btn>)}
      </div>
    </Card>
  );
}

// 21. AUDIO EQ — 10-band
function AudioEQ() {
  const bands = ["32", "64", "125", "250", "500", "1K", "2K", "4K", "8K", "16K"];
  const [vals, setVals] = useState(() => bands.map(() => 50 + (Math.random() - .5) * 30));
  const setB = (i, v) => { const n = [...vals]; n[i] = v; setVals(n); };
  const presets = { Flat: bands.map(() => 50), "V-Curve": [70, 65, 45, 35, 30, 30, 35, 50, 65, 72], Voice: [40, 45, 55, 70, 75, 72, 60, 45, 40, 38] };
  return (
    <Card style={{ width: 340 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>Parametric EQ</div>
        <div style={{ display: "flex", gap: 2 }}>
          {Object.keys(presets).map(p => <Btn key={p} small ghost onClick={() => setVals(presets[p])} color={X.indigo}>{p}</Btn>)}
        </div>
      </div>
      <div style={{ display: "flex", gap: 3, alignItems: "flex-end" }}>
        {bands.map((b, i) => {
          const db = Math.round((vals[i] - 50) * .48);
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <M style={{ fontSize: 7, color: db > 0 ? X.teal : db < 0 ? X.pink : X.textMut, fontWeight: 600 }}>{db > 0 ? "+" : ""}{db}</M>
              <div style={{ width: "100%", height: 60, borderRadius: 3, background: X.bgAlt, position: "relative", cursor: "pointer" }}
                onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setB(i, Math.round(100 - ((e.clientY - r.top) / r.height) * 100)); }}>
                <div style={{ position: "absolute", bottom: 0, width: "100%", height: `${vals[i]}%`, borderRadius: 3, background: `${X.purple}18`, transition: "height 100ms" }} />
                <div style={{ position: "absolute", width: "120%", left: "-10%", height: 3, borderRadius: 2, background: X.purple, bottom: `calc(${vals[i]}% - 1px)`, transition: "bottom 100ms", boxShadow: `0 0 4px ${X.purple}40` }} />
              </div>
              <M style={{ fontSize: 6, color: X.textMut }}>{b}</M>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// 22. VOLUME KNOB (rotary)
function VolumeKnob({ label = "Master Volume", color = X.purple }) {
  const [vol, setVol] = useState(65);
  const [drag, setDrag] = useState(false);
  const ref = useRef(null);
  const sz = 70, startA = 225, endA = -45, range = startA - endA;
  const angle = startA - (vol / 100) * range;
  useEffect(() => {
    if (!drag) return;
    const mv = e => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2;
      let a = Math.atan2(-dx, dy) * (180 / Math.PI) + 180;
      const v = Math.max(0, Math.min(100, ((a - (360 - startA)) / range) * 100));
      setVol(Math.round(v));
    };
    const up = () => setDrag(false);
    window.addEventListener("mousemove", mv); window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
  }, [drag]);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div ref={ref} onMouseDown={() => setDrag(true)} style={{ width: sz, height: sz, borderRadius: "50%", background: `conic-gradient(from 225deg, ${color} 0deg, ${color} ${(vol / 100) * range}deg, ${X.borderLight} ${(vol / 100) * range}deg, ${X.borderLight} ${range}deg, transparent ${range}deg)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "grab", position: "relative" }}>
        <div style={{ width: sz - 10, height: sz - 10, borderRadius: "50%", background: X.surface, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: X.sh }}>
          <M style={{ fontSize: 14, fontWeight: 800, color }}>{vol}</M>
        </div>
        <div style={{ position: "absolute", width: 3, height: 10, borderRadius: 2, background: color, top: 2, left: "50%", marginLeft: -1.5, transformOrigin: `50% ${sz / 2 - 2}px`, transform: `rotate(${startA - (vol / 100) * range - 180}deg)`, boxShadow: `0 0 4px ${color}40` }} />
      </div>
      <Lbl>{label}</Lbl>
    </div>
  );
}

// 23. ROOM OCCUPANCY
function Occupancy() {
  const occ = useLive(12, 5, 4000);
  const max = 30;
  const pct = (Math.round(occ) / max) * 100;
  return (
    <Card style={{ width: 180 }}>
      <Lbl style={{ marginBottom: 6 }}>Occupancy</Lbl>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
        <M style={{ fontSize: 28, fontWeight: 800, color: X.text }}>{Math.max(0, Math.round(occ))}</M>
        <M style={{ fontSize: 12, color: X.textMut }}>/ {max}</M>
      </div>
      <Prog value={pct} color={pct > 85 ? X.red : pct > 60 ? X.amber : X.teal} h={4} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 2, marginTop: 8 }}>
        {Array.from({ length: max }, (_, i) => <div key={i} style={{ width: 7, height: 7, borderRadius: 2, background: i < Math.round(occ) ? X.teal : X.borderLight, transition: "background 400ms" }} />)}
      </div>
    </Card>
  );
}

// 24. POWER CONSUMPTION
function PowerMonitor() {
  const watts = useLive(847, 80, 2000);
  const [history, setHistory] = useState(() => Array.from({ length: 40 }, () => 800 + Math.random() * 200));
  useEffect(() => { const i = setInterval(() => setHistory(h => [...h.slice(1), watts]), 2000); return () => clearInterval(i); }, [watts]);
  const mn = Math.min(...history), mx = Math.max(...history);
  const pts = history.map((v, i) => `${(i / 39) * 100},${100 - ((v - mn) / (mx - mn || 1)) * 80}`).join(" ");
  return (
    <Card style={{ width: 240 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>Power</div>
        <M style={{ fontSize: 16, fontWeight: 800, color: X.amber }}>{Math.round(watts)}W</M>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 40, overflow: "hidden" }}>
        <defs><linearGradient id="pw-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={X.amber} stopOpacity=".2"/><stop offset="100%" stopColor={X.amber} stopOpacity="0"/></linearGradient></defs>
        <polygon points={`0,100 ${pts} 100,100`} fill="url(#pw-g)"/>
        <polyline points={pts} fill="none" stroke={X.amber} strokeWidth="2" vectorEffect="non-scaling-stroke"/>
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        {[["Today", "8.2 kWh"], ["Avg", "812W"], ["Peak", "1.1 kW"]].map(([l, v], i) => <div key={i}><Lbl style={{ marginBottom: 1 }}>{l}</Lbl><M style={{ fontSize: 9, fontWeight: 600, color: X.textSec }}>{v}</M></div>)}
      </div>
    </Card>
  );
}

// 25. BANDWIDTH MONITOR
function BandwidthMonitor() {
  const [dl, setDl] = useState(() => Array.from({ length: 30 }, () => Math.random() * 80));
  const [ul, setUl] = useState(() => Array.from({ length: 30 }, () => Math.random() * 30));
  useEffect(() => { const i = setInterval(() => { setDl(d => [...d.slice(1), Math.random() * 80 + 20]); setUl(u => [...u.slice(1), Math.random() * 30 + 5]); }, 500); return () => clearInterval(i); }, []);
  const render = (data, color, h = 24) => {
    const mx = Math.max(...data, 1);
    return (
      <div style={{ display: "flex", alignItems: "flex-end", gap: 1, height: h }}>
        {data.map((v, i) => <div key={i} style={{ flex: 1, height: `${(v / mx) * 100}%`, background: color, borderRadius: 1, opacity: .3 + (i / data.length) * .7, transition: "height 300ms" }} />)}
      </div>
    );
  };
  return (
    <Card style={{ width: 200 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 8 }}>Bandwidth</div>
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><Lbl>Download</Lbl><M style={{ fontSize: 9, color: X.teal, fontWeight: 600 }}>{dl[dl.length - 1].toFixed(0)} Mbps</M></div>
        {render(dl, X.teal)}
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}><Lbl>Upload</Lbl><M style={{ fontSize: 9, color: X.indigo, fontWeight: 600 }}>{ul[ul.length - 1].toFixed(0)} Mbps</M></div>
        {render(ul, X.indigo)}
      </div>
    </Card>
  );
}

// 26. CROSSPOINT MATRIX
function CrosspointMatrix() {
  const ins = ["HDMI 1", "HDMI 2", "SDI", "NDI"];
  const outs = ["Display A", "Display B", "Projector", "Record"];
  const [routes, setRoutes] = useState({ 0: 0, 1: 1, 2: 0, 3: 2 });
  return (
    <Card style={{ width: 300 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>Crosspoint Matrix</div>
      <div style={{ display: "grid", gridTemplateColumns: `60px repeat(${ins.length}, 1fr)`, gap: 2 }}>
        <div />
        {ins.map((inp, i) => <M key={i} style={{ fontSize: 7, color: X.textMut, textAlign: "center", transform: "rotate(-35deg)", transformOrigin: "center", padding: "0 0 4px" }}>{inp}</M>)}
        {outs.map((out, oi) => (
          <>
            <M key={`l-${oi}`} style={{ fontSize: 8, color: X.textSec, display: "flex", alignItems: "center" }}>{out}</M>
            {ins.map((_, ii) => (
              <button key={`${oi}-${ii}`} onClick={() => setRoutes({ ...routes, [oi]: ii })} style={{
                width: "100%", aspectRatio: "1", borderRadius: X.rs, cursor: "pointer",
                border: routes[oi] === ii ? `1px solid ${X.teal}40` : `1px solid ${X.borderLight}`,
                background: routes[oi] === ii ? X.teal + "20" : X.bgAlt,
                display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 150ms, border-color 150ms, transform 150ms",
              }}>
                {routes[oi] === ii && <Dot c={X.teal} s={6} />}
              </button>
            ))}
          </>
        ))}
      </div>
    </Card>
  );
}

// 27. POWER SEQUENCER
function PowerSequencer() {
  const devs = [{ n: "Amplifier", del: 0 }, { n: "Processor", del: 2 }, { n: "Projector", del: 5 }, { n: "Display A", del: 5 }, { n: "Display B", del: 5 }, { n: "Lighting", del: 8 }];
  const [states, setStates] = useState(() => devs.map(() => false));
  const [running, setRunning] = useState(false);
  const run = (target) => {
    setRunning(true);
    devs.forEach((d, i) => {
      setTimeout(() => {
        setStates(prev => { const n = [...prev]; n[i] = target; return n; });
        if (i === devs.length - 1) setTimeout(() => setRunning(false), 500);
      }, d.del * 200);
    });
  };
  return (
    <Card style={{ width: 260 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>Power Sequencer</div>
        {running && <M style={{ fontSize: 9, color: X.amber, animation: "br 800ms ease infinite" }}>Running…</M>}
      </div>
      {devs.map((d, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: i < devs.length - 1 ? `1px solid ${X.borderLight}` : "none", animation: `sr 150ms ${ease.o} ${i * 20}ms both` }}>
          <Dot c={states[i] ? X.teal : X.textMut} pulse={states[i]} s={6} />
          <M style={{ fontSize: 10, flex: 1, color: X.text }}>{d.n}</M>
          <M style={{ fontSize: 8, color: X.textMut }}>+{d.del}s</M>
        </div>
      ))}
      <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
        <Btn onClick={() => run(true)} color={X.teal} style={{ flex: 1 }}>Power On</Btn>
        <Btn onClick={() => run(false)} color={X.red} style={{ flex: 1 }}>Power Off</Btn>
      </div>
    </Card>
  );
}

// 28. DISPLAY ORIENTATION
function DisplayOrientation() {
  const [rot, setRot] = useState(0);
  const [flip, setFlip] = useState({ h: false, v: false });
  return (
    <Card style={{ width: 200 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>Orientation</div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <div style={{ width: 80, height: 50, borderRadius: 4, border: `2px solid ${X.purple}`, background: X.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(${rot}deg) scaleX(${flip.h ? -1 : 1}) scaleY(${flip.v ? -1 : 1})`, transition: `transform 400ms ${ease.sp}` }}>
          <M style={{ fontSize: 8, color: X.purple }}>16:9</M>
        </div>
      </div>
      <div style={{ display: "flex", gap: 3, justifyContent: "center", marginBottom: 6 }}>
        {[0, 90, 180, 270].map(r => <Btn key={r} small ghost active={rot === r} onClick={() => setRot(r)} color={X.purple}>{r}°</Btn>)}
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <Toggle label="Flip H" color={X.indigo} initial={flip.h} />
        <Toggle label="Flip V" color={X.indigo} initial={flip.v} />
      </div>
    </Card>
  );
}

// 29. RESOLUTION PICKER
function ResolutionPicker() {
  const res = ["3840×2160", "2560×1440", "1920×1080", "1280×720", "1024×768", "Custom"];
  const rates = ["60 Hz", "50 Hz", "30 Hz", "24 Hz"];
  const [selR, setSelR] = useState(0);
  const [selF, setSelF] = useState(0);
  return (
    <Card style={{ width: 200 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>Resolution</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 8 }}>
        {res.map((r, i) => <Btn key={i} small ghost active={selR === i} onClick={() => setSelR(i)} color={X.purple} style={{ width: "100%", justifyContent: "flex-start" }}>{r}</Btn>)}
      </div>
      <Lbl style={{ marginBottom: 4 }}>Refresh Rate</Lbl>
      <div style={{ display: "flex", gap: 2 }}>
        {rates.map((r, i) => <Btn key={i} small ghost active={selF === i} onClick={() => setSelF(i)} color={X.teal}>{r}</Btn>)}
      </div>
    </Card>
  );
}

// 30. EDID MANAGER
function EDIDManager() {
  const edids = [{ n: "Native", r: "3840×2160", s: "HDMI 2.0" }, { n: "Clone A", r: "1920×1080", s: "HDMI 1.4" }, { n: "Clone B", r: "2560×1440", s: "DP 1.2" }, { n: "Custom", r: "3840×2160", s: "HDMI 2.1" }];
  const [sel, setSel] = useState(0);
  return (
    <Card style={{ width: 230 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>EDID Manager</div>
        <Badge color={X.purple}>4 Profiles</Badge>
      </div>
      {edids.map((e, i) => (
        <button key={i} onClick={() => setSel(i)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", borderRadius: X.rs, border: `1px solid ${sel === i ? X.purple + "30" : "transparent"}`, background: sel === i ? X.purple + "0c" : "transparent", cursor: "pointer", textAlign: "left", marginBottom: 1, transition: "background-color 150ms, border-color 150ms, transform 150ms" }}>
          <div style={{ width: 3, height: 18, borderRadius: 2, background: sel === i ? X.purple : X.border }} />
          <div style={{ flex: 1 }}>
            <M style={{ fontSize: 10, fontWeight: 600, color: sel === i ? X.text : X.textSec, display: "block" }}>{e.n}</M>
            <M style={{ fontSize: 8, color: X.textMut }}>{e.r} · {e.s}</M>
          </div>
          {sel === i && <Dot c={X.teal} s={5} />}
        </button>
      ))}
    </Card>
  );
}

// 31. IR/RS232 CODE TESTER
function CodeTester() {
  const [proto, setProto] = useState("rs232");
  const [cmd, setCmd] = useState("POWR ON");
  const [resp, setResp] = useState(null);
  const [sending, setSending] = useState(false);
  const send = () => { setSending(true); setTimeout(() => { setResp(Math.random() > .2 ? "ACK" : "NAK"); setSending(false); }, 500 + Math.random() * 500); };
  return (
    <Card style={{ width: 260 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 8 }}>Command Tester</div>
      <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
        {["rs232", "ir", "tcp"].map(p => <Btn key={p} small ghost active={proto === p} onClick={() => setProto(p)} color={X.indigo}>{p.toUpperCase()}</Btn>)}
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        <input value={cmd} onChange={e => setCmd(e.target.value)} style={{ flex: 1, padding: "5px 8px", borderRadius: X.rs, border: `1px solid ${X.border}`, background: X.bgAlt, color: X.text, fontFamily: X.m, fontSize: 10, outline: "none" }} />
        <Btn onClick={send} color={X.purple} disabled={sending}>{sending ? "…" : "Send"}</Btn>
      </div>
      {resp && (
        <div style={{ fontFamily: X.m, fontSize: 9, padding: "4px 8px", borderRadius: X.rs, background: X.bg, border: `1px solid ${X.borderLight}`, color: resp === "ACK" ? X.teal : X.red, animation: `fu 150ms ${ease.o}` }}>
          Response: <span style={{ fontWeight: 700 }}>{resp}</span> <span style={{ color: X.textMut }}>({proto.toUpperCase()} · 12ms)</span>
        </div>
      )}
    </Card>
  );
}

// 32. PoE PORT MANAGER
function PoEManager() {
  const ports = [{ n: "Port 1", w: 15.4, d: "PTZ Cam", s: true }, { n: "Port 2", w: 25.2, d: "Ceiling Mic", s: true }, { n: "Port 3", w: 12.8, d: "Touch Panel", s: true }, { n: "Port 4", w: 0, d: "—", s: false }, { n: "Port 5", w: 30.1, d: "AP", s: true }, { n: "Port 6", w: 0, d: "—", s: false }];
  const total = ports.reduce((a, p) => a + p.w, 0);
  return (
    <Card style={{ width: 260 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>PoE Manager</div>
        <M style={{ fontSize: 11, fontWeight: 700, color: X.amber }}>{total.toFixed(0)}W / 240W</M>
      </div>
      <Prog value={(total / 240) * 100} color={total > 200 ? X.red : X.amber} h={3} style={{ marginBottom: 8 }} />
      {ports.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 0", borderBottom: i < ports.length - 1 ? `1px solid ${X.borderLight}` : "none", opacity: p.s ? 1 : .35, animation: `sr 150ms ${ease.o} ${i * 15}ms both` }}>
          <Dot c={p.s ? X.teal : X.textMut} s={5} />
          <M style={{ fontSize: 9, flex: 1, color: X.text }}>{p.n}</M>
          <M style={{ fontSize: 8, color: X.textMut }}>{p.d}</M>
          <M style={{ fontSize: 9, fontWeight: 600, color: p.w > 25 ? X.amber : X.teal, minWidth: 30, textAlign: "right" }}>{p.w > 0 ? p.w + "W" : "—"}</M>
        </div>
      ))}
    </Card>
  );
}

// 33. AV-OVER-IP STATS
function AVoIPStats() {
  const bitrate = useLive(42, 10, 1500);
  const latency = useLive(1.8, .6, 2000);
  const drops = useLive(0.2, .4, 3000);
  return (
    <Card style={{ width: 200 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>AV-over-IP</div>
      {[["Bitrate", bitrate.toFixed(1) + " Mbps", X.teal], ["Latency", latency.toFixed(1) + " ms", latency > 3 ? X.red : X.teal], ["Packet Loss", Math.max(0, drops).toFixed(2) + "%", drops > 0.5 ? X.amber : X.teal], ["Codec", "H.265", X.textSec], ["Multicast", "239.1.1.10", X.textSec]].map(([l, v, c], i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: i < 4 ? `1px solid ${X.borderLight}` : "none" }}>
          <M style={{ fontSize: 9, color: X.textMut }}>{l}</M>
          <M style={{ fontSize: 9, fontWeight: 600, color: c }}>{v}</M>
        </div>
      ))}
    </Card>
  );
}

// 34. CERTIFICATE STATUS
function CertStatus() {
  const certs = [{ n: "SSL/TLS", exp: "2026-08-15", st: "valid" }, { n: "Device Auth", exp: "2026-03-01", st: "expiring" }, { n: "API Key", exp: "2025-12-31", st: "expired" }];
  const sc = { valid: X.teal, expiring: X.amber, expired: X.red };
  return (
    <Card style={{ width: 230 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>Certificates</div>
      {certs.map((c, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < certs.length - 1 ? `1px solid ${X.borderLight}` : "none" }}>
          <Dot c={sc[c.st]} s={6} />
          <div style={{ flex: 1 }}><M style={{ fontSize: 10, fontWeight: 600, color: X.text, display: "block" }}>{c.n}</M><M style={{ fontSize: 8, color: X.textMut }}>Expires {c.exp}</M></div>
          <Badge color={sc[c.st]}>{c.st}</Badge>
        </div>
      ))}
    </Card>
  );
}

// 35. LATENCY GRAPH (rolling)
function LatencyGraph() {
  const [data, setData] = useState(() => Array.from({ length: 50 }, () => 1 + Math.random() * 3));
  useEffect(() => { const i = setInterval(() => setData(d => [...d.slice(1), 1 + Math.random() * 4]), 300); return () => clearInterval(i); }, []);
  const mx = Math.max(...data), mn = Math.min(...data);
  const pts = data.map((v, i) => `${(i / 49) * 100},${100 - ((v - mn) / (mx - mn || 1)) * 80}`).join(" ");
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <Lbl>Latency</Lbl>
        <M style={{ fontSize: 10, color: data[49] > 3 ? X.amber : X.teal, fontWeight: 700 }}>{data[49].toFixed(1)}ms</M>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 32, overflow: "hidden" }}>
        <polyline points={pts} fill="none" stroke={X.teal} strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
        <line x1="0" y1={100 - ((3 - mn) / (mx - mn || 1)) * 80} x2="100" y2={100 - ((3 - mn) / (mx - mn || 1)) * 80} stroke={X.amber} strokeWidth=".5" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" opacity=".5"/>
      </svg>
    </Card>
  );
}

// 36. MACRO BUILDER
function MacroBuilder() {
  const [steps, setSteps] = useState([{ a: "Power On Projector", d: 0 }, { a: "Set Input HDMI 1", d: 2 }, { a: "Set Volume 60%", d: 3 }, { a: "Lower Screen", d: 4 }]);
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState(-1);
  const run = () => {
    setRunning(true); setCurrent(0);
    steps.forEach((s, i) => setTimeout(() => { setCurrent(i); if (i === steps.length - 1) setTimeout(() => { setRunning(false); setCurrent(-1); }, 600); }, s.d * 200));
  };
  return (
    <Card style={{ width: 250 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>Macro: Startup</div>
        <Btn small onClick={run} color={running ? X.amber : X.teal} disabled={running}>{running ? "Running…" : "▶ Run"}</Btn>
      </div>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: i < steps.length - 1 ? `1px solid ${X.borderLight}` : "none" }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", border: `1px solid ${current === i ? X.teal : current > i ? X.teal + "40" : X.border}`, background: current > i ? X.teal + "15" : current === i ? X.teal + "20" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "background-color 200ms, border-color 200ms, transform 200ms" }}>
            {current > i ? <M style={{ fontSize: 8, color: X.teal }}>✓</M> : <M style={{ fontSize: 8, color: current === i ? X.teal : X.textMut }}>{i + 1}</M>}
          </div>
          <M style={{ fontSize: 10, flex: 1, color: current >= i ? X.text : X.textSec }}>{s.a}</M>
          <M style={{ fontSize: 8, color: X.textMut }}>+{s.d}s</M>
        </div>
      ))}
    </Card>
  );
}

// 37. THERMOSTAT CONTROL
function ThermostatControl({ form = "hybrid", unit = "celsius" }) {
  const [activeForm, setActiveForm] = useState(form);
  const [activeUnit, setActiveUnit] = useState(unit);
  const [hvacMode, setHvacMode] = useState("auto");
  const [setpointC, setSetpointC] = useState(22);
  const ambientC = useLive(22.4, 1, 2600);

  const toDisplay = useCallback(
    (valueC) => (activeUnit === "fahrenheit" ? valueC * 9 / 5 + 32 : valueC),
    [activeUnit],
  );
  const fromDisplay = useCallback(
    (value) => (activeUnit === "fahrenheit" ? (value - 32) * 5 / 9 : value),
    [activeUnit],
  );

  const setpointDisplay = toDisplay(setpointC);
  const ambientDisplay = toDisplay(ambientC);
  const minDisplay = activeUnit === "fahrenheit" ? 60 : 16;
  const maxDisplay = activeUnit === "fahrenheit" ? 82 : 28;
  const unitMark = activeUnit === "fahrenheit" ? "F" : "C";

  const updateSetpointDisplay = (value) => {
    const clamped = Math.max(minDisplay, Math.min(maxDisplay, value));
    setSetpointC(fromDisplay(clamped));
  };

  return (
    <Card style={{ width: 260 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>Thermostat</div>
        <Badge color={X.indigo}>{activeForm}</Badge>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
        {["rotary", "digital", "hybrid"].map((formOption) => (
          <Btn
            key={formOption}
            small
            ghost
            active={activeForm === formOption}
            onClick={() => setActiveForm(formOption)}
            color={X.indigo}
          >
            {formOption}
          </Btn>
        ))}
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
        <Btn small ghost active={activeUnit === "celsius"} onClick={() => setActiveUnit("celsius")} color={X.teal}>C</Btn>
        <Btn small ghost active={activeUnit === "fahrenheit"} onClick={() => setActiveUnit("fahrenheit")} color={X.teal}>F</Btn>
      </div>

      {(activeForm === "rotary" || activeForm === "hybrid") && (
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <div style={{
            width: 104,
            height: 104,
            borderRadius: "50%",
            border: `1px solid ${X.borderLight}`,
            background: X.bgAlt,
            boxShadow: X.sh,
            display: "grid",
            placeItems: "center",
            position: "relative",
          }}>
            <div style={{ textAlign: "center" }}>
              <M style={{ fontSize: 24, fontWeight: 800, color: X.text }}>{Math.round(setpointDisplay)}°</M>
              <M style={{ fontSize: 9, color: X.textMut }}>{unitMark}</M>
            </div>
            <button
              onClick={() => updateSetpointDisplay(setpointDisplay + 1)}
              aria-label="Increase thermostat setpoint"
              style={{ position: "absolute", right: -6, top: "50%", transform: "translateY(-50%)", border: `1px solid ${X.border}`, background: X.surface, color: X.text, borderRadius: "50%", width: 22, height: 22, cursor: "pointer" }}
            >
              +
            </button>
            <button
              onClick={() => updateSetpointDisplay(setpointDisplay - 1)}
              aria-label="Decrease thermostat setpoint"
              style={{ position: "absolute", left: -6, top: "50%", transform: "translateY(-50%)", border: `1px solid ${X.border}`, background: X.surface, color: X.text, borderRadius: "50%", width: 22, height: 22, cursor: "pointer" }}
            >
              -
            </button>
          </div>
        </div>
      )}

      {(activeForm === "digital" || activeForm === "hybrid") && (
        <div style={{ marginBottom: 10 }}>
          <Slider
            label="Setpoint"
            value={Math.round(setpointDisplay)}
            min={minDisplay}
            max={maxDisplay}
            onChange={updateSetpointDisplay}
            color={X.indigo}
            unit={`°${unitMark}`}
          />
        </div>
      )}

      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 10 }}>
        {["off", "heat", "cool", "auto"].map((modeOption) => (
          <Btn
            key={modeOption}
            small
            ghost
            active={hvacMode === modeOption}
            onClick={() => setHvacMode(modeOption)}
            color={X.purple}
          >
            {modeOption}
          </Btn>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Lbl>Ambient</Lbl>
        <M style={{ fontSize: 11, fontWeight: 700, color: X.teal }}>{ambientDisplay.toFixed(1)}°{unitMark}</M>
      </div>
    </Card>
  );
}

// 38. ROOM TEMPERATURE / CLIMATE
function Climate() {
  const temp = useLive(22.4, 1, 3000);
  const hum = useLive(45, 5, 4000);
  const [target, setTarget] = useState(22);
  return (
    <Card style={{ width: 190 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>Climate</div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <M style={{ fontSize: 36, fontWeight: 800, color: temp > target + 2 ? X.amber : temp < target - 2 ? X.indigo : X.text }}>{temp.toFixed(1)}°</M>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 10 }}>
        <Btn small ghost onClick={() => setTarget(t => t - 1)}>−</Btn>
        <M style={{ fontSize: 11, color: X.textSec, display: "flex", alignItems: "center" }}>Target: {target}°C</M>
        <Btn small ghost onClick={() => setTarget(t => t + 1)}>+</Btn>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div><Lbl style={{ marginBottom: 2 }}>Humidity</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.teal }}>{Math.round(hum)}%</M></div>
        <div style={{ textAlign: "right" }}><Lbl style={{ marginBottom: 2 }}>CO₂</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.teal }}>420 ppm</M></div>
      </div>
    </Card>
  );
}

// 38. DEVICE INVENTORY TABLE
function DeviceTable() {
  const devices = [
    { n: "NEC PA804UL", t: "Projector", s: "online", ip: ".42" },
    { n: "Samsung QM85R", t: "Display", s: "warning", ip: ".43" },
    { n: "Shure MXA920", t: "Mic Array", s: "online", ip: ".44" },
    { n: "QSC Core 110f", t: "DSP", s: "online", ip: ".45" },
    { n: "PTZ Optics 30X", t: "Camera", s: "error", ip: ".46" },
    { n: "Crestron DM-NVX", t: "Encoder", s: "online", ip: ".47" },
    { n: "Biamp TesiraFORTÉ", t: "DSP", s: "online", ip: ".48" },
    { n: "BrightSign XC5", t: "Player", s: "offline", ip: ".49" },
  ];
  const sc = { online: X.teal, warning: X.amber, error: X.red, offline: X.textMut };
  return (
    <Card noPad style={{ width: 420 }}>
      <div style={{ padding: "12px 14px 6px", display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>Device Inventory</div>
        <Badge color={X.purple}>{devices.length} devices</Badge>
      </div>
      <div style={{ padding: "0 6px 6px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 60px 50px", gap: 4, padding: "4px 8px", borderBottom: `1px solid ${X.borderLight}` }}>
          {["Device", "Type", "Status", "IP"].map(h => <Lbl key={h}>{h}</Lbl>)}
        </div>
        {devices.map((d, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 80px 60px 50px", gap: 4, padding: "5px 8px", borderRadius: 3, background: i % 2 === 0 ? X.bgAlt : "transparent", animation: `sr 120ms ${ease.o} ${i * 15}ms both` }}>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.text }}>{d.n}</M>
            <M style={{ fontSize: 9, color: X.textSec }}>{d.t}</M>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}><Dot c={sc[d.s]} s={4} /><M style={{ fontSize: 8, color: sc[d.s] }}>{d.s}</M></div>
            <M style={{ fontSize: 9, color: X.textMut }}>{d.ip}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// 39. ASPECT RATIO SELECTOR
function AspectRatio() {
  const ratios = [{ l: "16:9", w: 16, h: 9 }, { l: "4:3", w: 4, h: 3 }, { l: "21:9", w: 21, h: 9 }, { l: "1:1", w: 1, h: 1 }, { l: "Auto", w: 16, h: 9 }];
  const [sel, setSel] = useState(0);
  return (
    <Card style={{ width: 200 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>Aspect Ratio</div>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <div style={{ width: 80, height: 80 * (ratios[sel].h / ratios[sel].w), borderRadius: 4, border: `2px solid ${X.purple}`, background: X.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", transition: `height 300ms ${ease.sp}, border-color 300ms ${ease.sp}, transform 300ms ${ease.sp}` }}>
          <M style={{ fontSize: 12, fontWeight: 700, color: X.purple }}>{ratios[sel].l}</M>
        </div>
      </div>
      <div style={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
        {ratios.map((r, i) => <Btn key={i} small ghost active={sel === i} onClick={() => setSel(i)} color={X.purple}>{r.l}</Btn>)}
      </div>
    </Card>
  );
}

// 40. UPTIME TIMELINE
function UptimeTimeline() {
  const days = useMemo(() => Array.from({ length: 30 }, () => Math.random() > .08 ? (Math.random() > .15 ? 100 : 60 + Math.random() * 30) : Math.random() * 40), []);
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <Lbl>30-Day Uptime</Lbl>
        <M style={{ fontSize: 10, color: X.teal, fontWeight: 700 }}>99.2%</M>
      </div>
      <div style={{ display: "flex", gap: 1.5, alignItems: "flex-end", height: 24 }}>
        {days.map((v, i) => <div key={i} style={{ flex: 1, height: `${(v / 100) * 22}px`, borderRadius: 1, background: v > 95 ? X.teal : v > 70 ? X.amber : X.red, opacity: .4 + (v / 100) * .6 }} />)}
      </div>
    </Card>
  );
}

// 41. SIGNAL FLOW (simple chain)
function SignalFlow() {
  const chain = [{ n: "Source", d: "HDMI 1" }, { n: "Switcher", d: "DM-NVX" }, { n: "Scaler", d: "Processor" }, { n: "Output", d: "Projector" }];
  return (
    <Card>
      <Lbl style={{ marginBottom: 8 }}>Signal Flow</Lbl>
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {chain.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ padding: "6px 10px", borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.border}`, textAlign: "center" }}>
              <M style={{ fontSize: 9, fontWeight: 600, color: X.text, display: "block" }}>{c.n}</M>
              <M style={{ fontSize: 7, color: X.textMut }}>{c.d}</M>
            </div>
            {i < chain.length - 1 && <div style={{ width: 16, height: 0, borderTop: `1px dashed ${X.teal}40`, position: "relative" }}><div style={{ position: "absolute", right: -2, top: -3, fontSize: 8, color: X.teal }}>›</div></div>}
          </div>
        ))}
      </div>
    </Card>
  );
}

// 42. BULK ACTIONS
function BulkActions() {
  const [sel, setSel] = useState(new Set([0, 2, 4]));
  const devs = ["NEC PA804UL", "Samsung QM85R", "Shure MXA920", "QSC Core 110f", "PTZ Optics 30X"];
  const toggle = i => { const n = new Set(sel); n.has(i) ? n.delete(i) : n.add(i); setSel(n); };
  return (
    <Card style={{ width: 260 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>Bulk Actions</div>
        <Badge color={X.purple}>{sel.size} selected</Badge>
      </div>
      {devs.map((d, i) => (
        <button key={i} onClick={() => toggle(i)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", borderRadius: X.rs, border: "none", background: sel.has(i) ? X.purple + "0c" : "transparent", cursor: "pointer", textAlign: "left", transition: "background-color 150ms, color 150ms, transform 150ms" }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, border: `1px solid ${sel.has(i) ? X.purple : X.border}`, background: sel.has(i) ? X.purple : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {sel.has(i) && <M style={{ fontSize: 8, color: "#fff" }}>✓</M>}
          </div>
          <M style={{ fontSize: 10, color: X.text }}>{d}</M>
        </button>
      ))}
      <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
        <CmdBtn label="Reboot All" color={X.purple} />
        <CmdBtn label="Update FW" color={X.indigo} />
      </div>
    </Card>
  );
}

// 43. QUICK CONTROLS PANEL
function QuickControls() {
  return (
    <Card style={{ width: 280 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>Quick Controls</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
        {[["⏻", "Power", X.teal], ["🔇", "Mute", X.pink], ["📺", "Blank", X.indigo], ["🔒", "Lock", X.amber], ["📡", "Stream", X.purple], ["💡", "Lights", X.amber], ["🔊", "Vol+", X.teal], ["🔈", "Vol−", X.teal], ["⟳", "Reset", X.red]].map(([icon, label, color], i) => {
          const [on, setOn] = useState(false);
          return (
            <button key={i} onClick={() => setOn(!on)} style={{
              padding: "10px 4px", borderRadius: X.rs, border: `1px solid ${on ? color + "30" : X.borderLight}`,
              background: on ? color + "12" : X.bgAlt, cursor: "pointer", display: "flex", flexDirection: "column",
              alignItems: "center", gap: 3, transition: "background-color 180ms, border-color 180ms, color 180ms, transform 180ms",
            }}>
              <span style={{ fontSize: 16, filter: on ? "none" : "grayscale(1) opacity(.4)" }}>{icon}</span>
              <M style={{ fontSize: 7, color: on ? color : X.textMut, fontWeight: 600 }}>{label}</M>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  SECTION COMPONENT
// ══════════════════════════════════════════════════════════════════════════
function Section({ title, desc, children, cols }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <div style={{ marginBottom: 4 }}><h2 style={{ fontSize: 14, fontWeight: 800, color: X.text, letterSpacing: "-.01em" }}>{title}</h2></div>
      <p style={{ fontSize: 10, color: X.textMut, marginBottom: 12, fontFamily: X.m }}>{desc}</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-start" }}>{children}</div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════════════════
//  MAIN APP
// ══════════════════════════════════════════════════════════════════════════
export function DashboardContent() {
  return (
    <div style={{ background: X.bg, minHeight: "100vh", fontFamily: X.f, color: X.text }}>
      {/* HEADER */}
      <header style={{ background: X.surface, borderBottom: `1px solid ${X.border}`, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <XyteLogo />
          <div style={{ width: 1, height: 18, background: X.border }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: X.textSec }}>Connect+</span>
          <M style={{ fontSize: 10, color: X.textMut }}>AV Fleet Dashboard</M>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Badge color={X.teal} solid><Dot c="#fff" pulse s={4} />1,247 Online</Badge>
          <Badge color={X.amber}>23 Alerts</Badge>
          <Badge color={X.purple}>v2.0</Badge>
        </div>
      </header>

      {/* HERO */}
      <div style={{ background: X.gradHero, padding: "14px 20px", borderBottom: `1px solid ${X.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: X.textBright }}>Conference Room Alpha — Building A, Floor 3</div>
          <M style={{ fontSize: 9, color: X.textSec }}>12 devices · Last activity 2m ago · All nominal</M>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <CmdBtn label="Identify All" color={X.indigo} />
          <CmdBtn label="Power Cycle" color={X.pink} />
        </div>
      </div>

      <main style={{ padding: "20px", maxWidth: 1400, margin: "0 auto" }}>

        <Section title="Fleet Overview" desc="Real-time KPI metrics with sparkline trends.">
          <KPI value={1247} prev={1180} label="Devices Online" color={X.teal} delay={0} />
          <KPI value={98} prev={97} label="Uptime %" color={X.purple} delay={60} />
          <KPI value={23} prev={31} label="Open Alerts" color={X.amber} delay={120} />
          <KPI value={142} prev={89} label="Commands/hr" color={X.indigo} delay={180} />
          <KPI value={847} prev={812} label="Power (W)" color={X.pink} delay={240} />
        </Section>

        <Section title="Device Fleet" desc="Individual device health with signal, temperature, firmware.">
          <DeviceCard name="NEC PA804UL" type="Projector" status="online" signal={95} temp={42} fw="v4.2.1" ip="192.168.1.42" delay={0} />
          <DeviceCard name="Samsung QM85R" type="Display" status="warning" signal={62} temp={68} fw="v3.1.0" ip="192.168.1.43" delay={50} />
          <DeviceCard name="PTZ Optics 30X" type="Camera" status="error" signal={0} temp={31} fw="v2.0.4" ip="192.168.1.46" delay={100} />
          <DeviceCard name="QSC Core 110f" type="Speaker" status="online" signal={88} temp={38} fw="v4.0.2" ip="192.168.1.45" delay={150} />
        </Section>

        <Section title="Telemetry Gauges" desc="Real-time device performance metrics.">
          <Card style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", justifyContent: "center", padding: "16px 20px" }}>
            <Gauge value={72} label="CPU" /><Gauge value={45} label="Memory" color={X.indigo} /><Gauge value={88} label="Temp" unit="°C" color={X.amber} /><Gauge value={31} label="Fan" color={X.teal} /><Gauge value={95} label="Signal" color={X.teal} /><Gauge value={62} label="Load" color={X.pink} />
          </Card>
        </Section>

        <Section title="AV Controls" desc="PTZ camera joystick with focus/iris, 8-channel audio mixer.">
          <PTZControl />
          <Mixer />
          <QuickControls />
        </Section>

        <Section title="Audio" desc="Spectrum analyzer with peak hold, parametric EQ, volume knob.">
          <AudioSpectrum />
          <AudioEQ />
          <Card style={{ display: "flex", gap: 16, alignItems: "center", padding: "16px 20px" }}>
            <VolumeKnob label="Master" color={X.purple} />
            <VolumeKnob label="Monitor" color={X.indigo} />
            <VolumeKnob label="Sub" color={X.teal} />
          </Card>
        </Section>

        <Section title="Display & Source" desc="Input switching, display adjustments, color temperature, EDID, resolution, aspect ratio.">
          <InputSelector />
          <DisplayAdjust />
          <ColorTemp />
          <ResolutionPicker />
          <AspectRatio />
          <EDIDManager />
          <DisplayOrientation />
        </Section>

        <Section title="Video Wall & Matrix" desc="Video wall layout with source assignment, crosspoint routing matrix.">
          <VideoWall />
          <CrosspointMatrix />
          <SignalFlow />
        </Section>

        <Section title="Room Automation" desc="Scene presets, power sequencing, macro builder, climate control.">
          <ScenePresets />
          <PowerSequencer />
          <MacroBuilder />
          <ThermostatControl />
          <Climate />
          <Occupancy />
        </Section>

        <Section title="Network & Transport" desc="Network stack, bandwidth monitoring, AV-over-IP stats, latency graph.">
          <NetworkInfo />
          <BandwidthMonitor />
          <AVoIPStats />
          <LatencyGraph />
          <UptimeTimeline />
        </Section>

        <Section title="Power & Infrastructure" desc="Power consumption monitoring, PoE port management, I/O ports.">
          <PowerMonitor />
          <PoEManager />
          <PortStatus />
          <CertStatus />
        </Section>

        <Section title="Remote Commands" desc="Command buttons, toggle switches, bulk actions, code tester, command log.">
          <Card style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <CmdBtn label="Reboot" color={X.purple} /><CmdBtn label="Power Off" color={X.pink} /><CmdBtn label="Identify" color={X.indigo} /><CmdBtn label="Factory Reset" color={X.red} /><CmdBtn label="Clear Cache" color={X.amber} /><CmdBtn label="Sync Time" color={X.teal} />
            </div>
            <div style={{ height: 1, background: X.borderLight }} />
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Toggle label="Auto-brightness" /><Toggle label="Standby" color={X.indigo} initial /><Toggle label="Fan Override" color={X.red} /><Toggle label="Net Lock" color={X.teal} initial /><Toggle label="Eco Mode" color={X.teal} /><Toggle label="CEC" color={X.amber} initial />
            </div>
          </Card>
          <BulkActions />
          <CodeTester />
          <CommandLog />
        </Section>

        <Section title="Alerts & Schedule" desc="Alert feed with dismiss, room calendar, device inventory.">
          <AlertFeed />
          <Schedule />
          <DeviceTable />
        </Section>

        <Section title="Firmware & Lifecycle" desc="Multi-phase OTA update tracker, laser life monitor.">
          <FirmwareUpdate />
          <LampLife />
        </Section>

      </main>

      <footer style={{ background: X.surface, borderTop: `1px solid ${X.border}`, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <XyteLogo s={11} />
          <M style={{ fontSize: 8, color: X.textMut }}>Connect+ AV Dashboard · 43 Widget Types · Dark Theme</M>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <M style={{ fontSize: 8, color: X.textMut }}>XYTE Brand: #7c4dff · #00bfa5 · #ff4081 · #536dfe · #ffc400</M>
          <div style={{ display: "flex", gap: 2 }}>
            {[X.purple, X.indigo, X.teal, X.pink, X.amber].map((c, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />)}
          </div>
        </div>
      </footer>
    </div>
  );
}

export {
  AVoIPStats,
  AlertFeed,
  AspectRatio,
  AudioEQ,
  AudioSpectrum,
  BandwidthMonitor,
  BulkActions,
  CertStatus,
  Climate,
  CodeTester,
  CmdBtn,
  ColorTemp,
  CommandLog,
  CrosspointMatrix,
  DeviceCard,
  DeviceTable,
  DisplayAdjust,
  DisplayOrientation,
  EDIDManager,
  FirmwareUpdate,
  Gauge,
  InputSelector,
  KPI,
  LampLife,
  LatencyGraph,
  MacroBuilder,
  Mixer,
  NetworkInfo,
  Occupancy,
  PTZControl,
  PoEManager,
  PortStatus,
  PowerMonitor,
  PowerSequencer,
  QuickControls,
  ResolutionPicker,
  ScenePresets,
  Schedule,
  Section,
  SignalFlow,
  ThermostatControl,
  Toggle,
  UptimeTimeline,
  VideoWall,
  VolumeKnob,
  XyteLogo,
};
