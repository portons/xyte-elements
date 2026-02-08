import { useState } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { useAnim, useTick } from '../hooks';

function neo() {
  const X = getX();
  const dark = X.bg + '40';
  const light = '#ffffff12';
  return {
    raised: `4px 4px 10px ${dark}, -2px -2px 6px ${light}`,
    concave: `inset 3px 3px 8px ${dark}, inset -2px -2px 5px ${light}`,
    bezel: `inset 0 1px 0 ${light}, inset 0 -1px 0 rgba(0,0,0,0.3), 0 2px 8px ${dark}`,
    metal: `linear-gradient(135deg, ${X.surface}, ${X.bgAlt} 40%, ${X.surface} 60%, ${X.bgAlt})`,
  };
}

// ── Dewar Vessel ────────────────────────────────────────────────────
export function DewarVessel({ title = 'Dewar Vessel', levelPct = 72, boilOffRate = 1.2, tempK = 77 }: { title?: string; levelPct?: number; boilOffRate?: number; tempK?: number } = {}) {
  const X = getX();
  const n = neo();
  const level = Math.max(0, Math.min(100, levelPct));
  const animLevel = useAnim(level);
  const c = level < 20 ? X.red : level < 40 ? X.amber : X.teal;

  return (
    <Card style={{ width: 350 }} glow={level < 20 ? X.red : undefined}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={c}>{level < 20 ? 'LOW' : level < 40 ? 'REFILL SOON' : 'OK'}</Badge>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <div style={{ background: n.metal, borderRadius: 12, boxShadow: n.bezel, padding: 8 }}>
          <svg viewBox="0 0 120 160" style={{ width: 140, height: 180, display: 'block' }}>
            <defs>
              <linearGradient id="cryo-ln2" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#1e90ff" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#00bfff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#87ceeb" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="cryo-frost" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.12" />
              </linearGradient>
              <clipPath id="cryo-tank">
                <path d="M30,20 Q30,10 45,10 L75,10 Q90,10 90,20 L90,130 Q90,150 60,150 Q30,150 30,130 Z" />
              </clipPath>
            </defs>
            {/* Tank shell */}
            <path d="M30,20 Q30,10 45,10 L75,10 Q90,10 90,20 L90,130 Q90,150 60,150 Q30,150 30,130 Z"
              fill={X.bg} stroke={X.borderLight} strokeWidth="1.5" />
            {/* Liquid fill */}
            <rect x="30" y={10 + (140 * (1 - animLevel / 100))} width="60" height={140 * (animLevel / 100)}
              fill="url(#cryo-ln2)" clipPath="url(#cryo-tank)"
              style={{ transition: `y 600ms ${ease.sp}, height 600ms ${ease.sp}` }} />
            {/* Frost overlay */}
            <path d="M30,20 Q30,10 45,10 L75,10 Q90,10 90,20 L90,130 Q90,150 60,150 Q30,150 30,130 Z"
              fill="url(#cryo-frost)" />
            {/* Inner wall lines */}
            <line x1="36" y1="25" x2="36" y2="125" stroke={X.borderLight} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.4" />
            <line x1="84" y1="25" x2="84" y2="125" stroke={X.borderLight} strokeWidth="0.5" strokeDasharray="2 4" opacity="0.4" />
            {/* Level indicator marks */}
            {[0, 25, 50, 75, 100].map(m => {
              const my = 10 + 140 * (1 - m / 100);
              return <g key={m}>
                <line x1="91" y1={my} x2="98" y2={my} stroke={X.textMut} strokeWidth="0.8" />
                <text x="101" y={my + 2} fontFamily={X.m} fontSize="5" fill={X.textMut}>{m}%</text>
              </g>;
            })}
            {/* Neck / top cap */}
            <rect x="48" y="2" width="24" height="10" rx="3" fill={X.bgAlt} stroke={X.borderLight} strokeWidth="1" />
            {/* Temperature reading */}
            <text x="60" y="85" textAnchor="middle" fontFamily={X.m} fontSize="11" fontWeight="800" fill="#ddeeff">
              {tempK.toFixed(0)} K
            </text>
            <text x="60" y="96" textAnchor="middle" fontFamily={X.m} fontSize="5" fill={X.textMut}>LN2 TEMP</text>
          </svg>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Level</Lbl><M style={{ fontSize: 12, fontWeight: 800, color: c }}>{level.toFixed(0)}%</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Boil-Off</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.amber }}>{boilOffRate.toFixed(1)}%/day</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Temp</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>{tempK.toFixed(0)} K</M></div>
      </div>
    </Card>
  );
}

// ── Temp Gradient ───────────────────────────────────────────────────
export function TempGradient({ title = 'Temperature Gradient', temps = [-196, -180, -150, -120, -80] }: { title?: string; temps?: number[] } = {}) {
  const X = getX();
  const n = neo();
  const minT = Math.min(...temps);
  const maxT = Math.max(...temps);
  const range = maxT - minT || 1;

  const tempColor = (t: number) => {
    const ratio = (t - minT) / range;
    if (ratio < 0.3) return X.teal;
    if (ratio < 0.6) return X.indigo;
    if (ratio < 0.8) return X.amber;
    return X.red;
  };

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>CRYO</Badge>
      </div>
      <div style={{ background: n.metal, borderRadius: 8, boxShadow: n.bezel, padding: 12, marginBottom: 10 }}>
        <svg viewBox="0 0 260 140" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            <linearGradient id="tg-bar" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#1e90ff" />
              <stop offset="40%" stopColor="#6366f1" />
              <stop offset="70%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>
          {/* Gradient bar */}
          <rect x="20" y="10" width="24" height="120" rx="6" fill="url(#tg-bar)" opacity="0.7" />
          <rect x="20" y="10" width="24" height="120" rx="6" fill="none" stroke={X.borderLight} strokeWidth="1" />
          {/* Temperature markers */}
          {temps.map((t, i) => {
            const y = 10 + (1 - (t - minT) / range) * 120;
            const c = tempColor(t);
            return (
              <g key={i}>
                <line x1="44" y1={y} x2="56" y2={y} stroke={c} strokeWidth="1.5" />
                <circle cx="50" cy={y} r="3" fill={c} style={{ filter: `drop-shadow(0 0 3px ${c}60)` }} />
                <text x="62" y={y + 1} fontFamily={X.m} fontSize="8" fontWeight="700" fill={c} dominantBaseline="middle">
                  {t.toFixed(0)}°C
                </text>
                <text x="110" y={y + 1} fontFamily={X.m} fontSize="6" fill={X.textMut} dominantBaseline="middle">
                  Zone {temps.length - i}
                </text>
                {/* Connecting line */}
                <line x1="56" y1={y} x2="60" y2={y} stroke={X.borderLight} strokeWidth="0.5" strokeDasharray="2 2" />
              </g>
            );
          })}
          {/* Scale labels */}
          <text x="32" y="7" textAnchor="middle" fontFamily={X.m} fontSize="5" fill={X.textMut}>WARM</text>
          <text x="32" y="140" textAnchor="middle" fontFamily={X.m} fontSize="5" fill={X.textMut}>COLD</text>
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Min</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>{minT.toFixed(0)}°C</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Points</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{temps.length}</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Max</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.amber }}>{maxT.toFixed(0)}°C</M></div>
      </div>
    </Card>
  );
}

// ── Cryo Pump ───────────────────────────────────────────────────────
export function CryoPump({ title = 'Cryo Pump', pressureMbar = 0.003, turboRPM = 42000, status = 'running' as 'running' | 'standby' | 'fault' }: { title?: string; pressureMbar?: number; turboRPM?: number; status?: 'running' | 'standby' | 'fault' } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(40);
  const sc = status === 'running' ? X.teal : status === 'standby' ? X.amber : X.red;
  const spinning = status === 'running';
  const animRPM = useAnim(turboRPM);
  const rpmPct = Math.min(100, (turboRPM / 60000) * 100);

  return (
    <Card style={{ width: 350 }} glow={status === 'fault' ? X.red : undefined}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <Dot c={sc} pulse={status === 'fault'} s={7} />
          <Badge color={sc} solid={status === 'fault'}>{status.toUpperCase()}</Badge>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
        {/* Turbine visual */}
        <div style={{ background: n.metal, borderRadius: '50%', boxShadow: n.bezel, width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: 85, height: 85, borderRadius: '50%', background: X.bg, boxShadow: n.concave, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 60 60" style={{ width: 70, height: 70 }}>
              <g transform={`rotate(${spinning ? tick * 12 % 360 : 0} 30 30)`}>
                {Array.from({ length: 6 }, (_, i) => {
                  const angle = i * 60;
                  return (
                    <path key={i}
                      d={`M30,30 L${30 + 20 * Math.cos((angle - 15) * Math.PI / 180)},${30 + 20 * Math.sin((angle - 15) * Math.PI / 180)} A20,20 0 0,1 ${30 + 20 * Math.cos((angle + 15) * Math.PI / 180)},${30 + 20 * Math.sin((angle + 15) * Math.PI / 180)} Z`}
                      fill={sc} opacity={spinning ? 0.7 : 0.3}
                      style={{ filter: spinning ? `drop-shadow(0 0 2px ${sc}40)` : 'none' }} />
                  );
                })}
              </g>
              <circle cx="30" cy="30" r="6" fill={X.bgAlt} stroke={sc} strokeWidth="1" />
              <circle cx="30" cy="30" r="2.5" fill={sc} />
            </svg>
          </div>
        </div>
        {/* Readings */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <Lbl style={{ marginBottom: 3 }}>Pressure</Lbl>
            <M style={{ fontSize: 16, fontWeight: 800, color: X.textBright }}>{pressureMbar < 0.01 ? pressureMbar.toExponential(1) : pressureMbar.toFixed(3)}</M>
            <M style={{ fontSize: 8, color: X.textMut, marginLeft: 3 }}>mbar</M>
          </div>
          <div>
            <Lbl style={{ marginBottom: 3 }}>Turbo RPM</Lbl>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <M style={{ fontSize: 13, fontWeight: 700, color: sc }}>{Math.round(animRPM).toLocaleString()}</M>
            </div>
            <Prog value={rpmPct} color={sc} h={3} />
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${X.borderLight}`, paddingTop: 8 }}>
        <div><Lbl style={{ marginBottom: 2 }}>Backing</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>2.1 mbar</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Bearing</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>42°C</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Hours</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textMut }}>8,412</M></div>
      </div>
    </Card>
  );
}

// ── Sample Rack ─────────────────────────────────────────────────────
export function SampleRack({ title = 'Sample Rack', rows = 8, cols = 8, occupiedCount = 42 }: { title?: string; rows?: number; cols?: number; occupiedCount?: number } = {}) {
  const X = getX();
  const n = neo();
  const total = rows * cols;
  const occupied = Math.min(total, Math.max(0, occupiedCount));
  const occupancyPct = (occupied / total) * 100;

  // Generate a deterministic pattern of occupied cells
  const cells = Array.from({ length: total }, (_, i) => i < occupied);

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={occupancyPct > 90 ? X.amber : X.teal}>{occupied}/{total}</Badge>
      </div>
      <div style={{ background: n.metal, borderRadius: 8, boxShadow: n.bezel, padding: 10, marginBottom: 10 }}>
        {/* Column headers */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 4, paddingLeft: 18 }}>
          {Array.from({ length: cols }, (_, c) => (
            <div key={c} style={{ flex: 1, textAlign: 'center' }}>
              <M style={{ fontSize: 6, color: X.textMut }}>{c + 1}</M>
            </div>
          ))}
        </div>
        {/* Grid */}
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} style={{ display: 'flex', gap: 2, marginBottom: 2, alignItems: 'center' }}>
            <M style={{ fontSize: 6, color: X.textMut, width: 14, textAlign: 'right' }}>{String.fromCharCode(65 + r)}</M>
            {Array.from({ length: cols }, (_, c) => {
              const idx = r * cols + c;
              const filled = cells[idx];
              return (
                <div key={c} style={{
                  flex: 1, aspectRatio: '1', borderRadius: 3, minHeight: 0,
                  background: filled
                    ? `radial-gradient(circle at 40% 35%, ${X.teal}dd, ${X.teal}66)`
                    : X.bg,
                  boxShadow: filled ? `0 0 4px ${X.teal}30` : n.concave,
                  border: `0.5px solid ${filled ? X.teal + '40' : X.borderLight}`,
                  transition: `background 200ms ${ease.mv}`,
                }} />
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Occupied</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>{occupied}</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Available</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{total - occupied}</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Fill</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: occupancyPct > 90 ? X.amber : X.teal }}>{occupancyPct.toFixed(0)}%</M></div>
      </div>
    </Card>
  );
}

// ── Refill Schedule ─────────────────────────────────────────────────
export function RefillSchedule({ title = 'Refill Schedule', daysUntilEmpty = 12, deliveryDays = 5 }: { title?: string; daysUntilEmpty?: number; deliveryDays?: number } = {}) {
  const X = getX();
  const n = neo();
  const maxDays = 30;
  const pct = Math.max(0, Math.min(100, (daysUntilEmpty / maxDays) * 100));
  const animPct = useAnim(pct);
  const urgent = daysUntilEmpty <= deliveryDays;
  const critical = daysUntilEmpty <= 3;
  const c = critical ? X.red : urgent ? X.amber : X.teal;
  const angle = (animPct / 100) * 270;

  return (
    <Card style={{ width: 350 }} glow={critical ? X.red : undefined}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={c} solid={critical}>{critical ? 'CRITICAL' : urgent ? 'ORDER NOW' : 'SCHEDULED'}</Badge>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
        {/* Countdown arc */}
        <div style={{ flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" style={{ width: 120, height: 120 }}>
            <circle cx="50" cy="50" r="40" fill={X.bg} stroke={X.borderLight} strokeWidth="1" style={{ boxShadow: n.concave }} />
            {/* Background arc */}
            <path d={describeArc(50, 50, 36, -135, 135)} fill="none" stroke={X.borderLight} strokeWidth="5" strokeLinecap="round" />
            {/* Filled arc */}
            <path d={describeArc(50, 50, 36, -135, -135 + angle)} fill="none" stroke={c} strokeWidth="5" strokeLinecap="round"
              style={{ transition: `d 600ms ${ease.sp}`, filter: `drop-shadow(0 0 4px ${c}40)` }} />
            {/* Tick marks */}
            {Array.from({ length: 7 }, (_, i) => {
              const a = (-135 + i * 45) * (Math.PI / 180);
              return <line key={i} x1={50 + 30 * Math.cos(a)} y1={50 + 30 * Math.sin(a)} x2={50 + 33 * Math.cos(a)} y2={50 + 33 * Math.sin(a)} stroke={X.textMut} strokeWidth="0.8" />;
            })}
            <text x="50" y="48" textAnchor="middle" fontFamily={X.m} fontSize="16" fontWeight="800" fill={c}>{daysUntilEmpty}</text>
            <text x="50" y="58" textAnchor="middle" fontFamily={X.m} fontSize="5.5" fill={X.textMut}>DAYS LEFT</text>
            {/* Truck icon */}
            <g transform="translate(34,66) scale(0.6)">
              <rect x="0" y="2" width="20" height="12" rx="2" fill={X.textMut} opacity="0.5" />
              <rect x="20" y="6" width="10" height="8" rx="1" fill={X.textMut} opacity="0.5" />
              <circle cx="8" cy="16" r="3" fill={X.textMut} opacity="0.6" />
              <circle cx="25" cy="16" r="3" fill={X.textMut} opacity="0.6" />
            </g>
          </svg>
        </div>
        {/* Info panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: X.bg, borderRadius: 6, boxShadow: n.concave, padding: 8 }}>
            <Lbl style={{ marginBottom: 3 }}>Delivery ETA</Lbl>
            <M style={{ fontSize: 14, fontWeight: 800, color: urgent ? X.amber : X.teal }}>{deliveryDays} days</M>
          </div>
          <div style={{ background: X.bg, borderRadius: 6, boxShadow: n.concave, padding: 8 }}>
            <Lbl style={{ marginBottom: 3 }}>Buffer</Lbl>
            <M style={{ fontSize: 14, fontWeight: 800, color: c }}>{Math.max(0, daysUntilEmpty - deliveryDays)} days</M>
          </div>
        </div>
      </div>
      <Prog value={pct} color={c} h={3} />
    </Card>
  );
}

// Helper for SVG arc paths
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// ── Cold Chain Log ──────────────────────────────────────────────────
export function ColdChainLog({ title = 'Cold Chain Log', excursionCount = 2 }: { title?: string; excursionCount?: number } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(200);

  // Simulated temperature data over 24 points
  const threshold = -150;
  const baseline = -185;
  const points = Array.from({ length: 24 }, (_, i) => {
    const base = baseline + Math.sin(i * 0.5) * 8;
    // Insert excursions at deterministic positions
    if (excursionCount > 0 && i === 8) return threshold + 15;
    if (excursionCount > 1 && i === 18) return threshold + 10;
    return base;
  });

  const minY = -200;
  const maxY = -100;
  const yRange = maxY - minY;
  const w = 280;
  const h = 90;
  const px = (i: number) => (i / (points.length - 1)) * w;
  const py = (v: number) => h - ((v - minY) / yRange) * h;

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)},${py(p).toFixed(1)}`).join(' ');
  const thresholdY = py(threshold);

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {excursionCount > 0 && <Dot c={X.red} pulse s={6} />}
          <Badge color={excursionCount > 0 ? X.red : X.teal}>{excursionCount} EXCURSION{excursionCount !== 1 ? 'S' : ''}</Badge>
        </div>
      </div>
      <div style={{ background: n.metal, borderRadius: 8, boxShadow: n.bezel, padding: '10px 12px', marginBottom: 10 }}>
        <svg viewBox={`-20 -5 ${w + 40} ${h + 20}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Grid lines */}
          {[-200, -175, -150, -125, -100].map(t => (
            <g key={t}>
              <line x1="0" y1={py(t)} x2={w} y2={py(t)} stroke={X.borderLight} strokeWidth="0.5" strokeDasharray="3 3" />
              <text x="-4" y={py(t) + 2} textAnchor="end" fontFamily={X.m} fontSize="5" fill={X.textMut}>{t}°</text>
            </g>
          ))}
          {/* Threshold line */}
          <line x1="0" y1={thresholdY} x2={w} y2={thresholdY} stroke={X.red} strokeWidth="0.8" strokeDasharray="4 2" opacity="0.6" />
          <text x={w + 3} y={thresholdY + 2} fontFamily={X.m} fontSize="4.5" fill={X.red}>LIMIT</text>
          {/* Excursion zones */}
          {points.map((p, i) => {
            if (p > threshold) {
              return <rect key={i} x={px(i) - 5} y={0} width={10} height={h} fill={X.red} opacity="0.08" rx="2" />;
            }
            return null;
          })}
          {/* Temperature line */}
          <path d={linePath} fill="none" stroke={X.teal} strokeWidth="1.5" strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 2px ${X.teal}40)` }} />
          {/* Data points */}
          {points.map((p, i) => {
            const isExcursion = p > threshold;
            return <circle key={i} cx={px(i)} cy={py(p)} r={isExcursion ? 3 : 1.5}
              fill={isExcursion ? X.red : X.teal}
              style={{ filter: isExcursion ? `drop-shadow(0 0 3px ${X.red}80)` : 'none' }} />;
          })}
          {/* Time axis */}
          {[0, 6, 12, 18, 23].map(i => (
            <text key={i} x={px(i)} y={h + 10} textAnchor="middle" fontFamily={X.m} fontSize="4.5" fill={X.textMut}>{i}h</text>
          ))}
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Current</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>{points[points.length - 1].toFixed(0)}°C</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Threshold</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.amber }}>{threshold}°C</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Excursions</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: excursionCount > 0 ? X.red : X.teal }}>{excursionCount}</M></div>
      </div>
    </Card>
  );
}
