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

// ── Reactor Status ───────────────────────────────────────────────────
export function ReactorStatus({ title = 'Reactor Status', powerLevel = 85, temp }: { title?: string; powerLevel?: number; temp: number } = {} as any) {
  const X = getX();
  const n = neo();
  const power = powerLevel;
  const pct = Math.max(0, Math.min(100, power));
  const animPct = useAnim(pct);
  const angle = -135 + (animPct / 100) * 270;
  const c = pct > 95 ? X.red : pct > 80 ? X.amber : X.teal;

  return (
    <Card style={{ width: 350 }} glow={c}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={c} solid>{pct > 95 ? 'CRITICAL' : pct > 80 ? 'HIGH' : 'NOMINAL'}</Badge>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <div style={{ width: 140, height: 140, borderRadius: '50%', background: n.metal, boxShadow: n.bezel, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 120, height: 120, borderRadius: '50%', background: X.bg, boxShadow: n.concave, position: 'relative', overflow: 'hidden' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="nuke-rg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={X.teal} stopOpacity=".15" />
                  <stop offset="100%" stopColor={X.amber} stopOpacity=".15" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="38" fill="none" stroke={X.borderLight} strokeWidth="3" />
              <circle cx="50" cy="50" r="38" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${(animPct / 100) * 180} 240`}
                transform="rotate(-225 50 50)"
                style={{ transition: `stroke-dasharray 600ms ${ease.sp}, stroke 400ms`, filter: `drop-shadow(0 0 4px ${c}40)` }} />
              {/* Tick marks */}
              {Array.from({ length: 11 }, (_, i) => {
                const a = (-135 + i * 27) * (Math.PI / 180);
                const x1 = 50 + 32 * Math.cos(a), y1 = 50 + 32 * Math.sin(a);
                const x2 = 50 + 36 * Math.cos(a), y2 = 50 + 36 * Math.sin(a);
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={X.textMut} strokeWidth="0.8" />;
              })}
              {/* Needle */}
              <line
                x1="50" y1="50"
                x2={50 + 28 * Math.cos((angle) * Math.PI / 180)}
                y2={50 + 28 * Math.sin((angle) * Math.PI / 180)}
                stroke={c} strokeWidth="1.5" strokeLinecap="round"
                style={{ transition: `x2 600ms ${ease.sp}, y2 600ms ${ease.sp}`, filter: `drop-shadow(0 0 3px ${c}60)` }} />
              <circle cx="50" cy="50" r="3" fill={c} />
              <text x="50" y="72" textAnchor="middle" fontFamily={X.m} fontSize="12" fontWeight="800" fill={c}>{Math.round(pct)}%</text>
              <text x="50" y="80" textAnchor="middle" fontFamily={X.m} fontSize="5" fill={X.textMut}>POWER</text>
            </svg>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Core Temp</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.amber }}>{temp.toFixed(0)}°C</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Power</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: c }}>{pct.toFixed(1)}%</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Status</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>Online</M></div>
      </div>
    </Card>
  );
}

// ── Cooling Loop ─────────────────────────────────────────────────────
export function CoolingLoop({ title = 'Cooling Loop', flowWarning = 85, flowRate, inletTemp, outletTemp, pressure }: { title?: string; flowWarning?: number; flowRate: number; inletTemp: number; outletTemp: number; pressure: number } = {} as any) {
  const X = getX();
  const n = neo();
  const tick = useTick(80);
  const isWarning = flowRate < flowWarning;

  const pipes: { label: string; from: [number, number]; to: [number, number]; color: string }[] = [
    { label: 'Primary', from: [15, 30], to: [85, 30], color: X.teal },
    { label: 'Secondary', from: [85, 50], to: [15, 50], color: X.indigo },
    { label: 'Return', from: [15, 70], to: [85, 70], color: X.amber },
  ];

  return (
    <Card style={{ width: 370 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <Dot c={isWarning ? X.amber : X.teal} pulse={isWarning} s={7} />
          <Badge color={isWarning ? X.amber : X.teal}>{isWarning ? 'LOW FLOW' : 'NOMINAL'}</Badge>
        </div>
      </div>
      <div style={{ background: n.metal, borderRadius: 8, boxShadow: n.bezel, padding: 12, marginBottom: 10 }}>
        <svg viewBox="0 0 100 85" style={{ display: 'block', width: '100%', height: 'auto' }}>
          {pipes.map((p, i) => (
            <g key={i}>
              <line x1={p.from[0]} y1={p.from[1]} x2={p.to[0]} y2={p.to[1]}
                stroke={X.borderLight} strokeWidth="4" strokeLinecap="round" />
              <line x1={p.from[0]} y1={p.from[1]} x2={p.to[0]} y2={p.to[1]}
                stroke={p.color} strokeWidth="2" strokeLinecap="round"
                strokeDasharray="6 4" strokeDashoffset={-(tick % 100) * (i === 1 ? -1 : 1)}
                style={{ filter: `drop-shadow(0 0 2px ${p.color}40)` }} />
              <text x={50} y={p.from[1] - 5} textAnchor="middle" fontFamily={X.m} fontSize="4.5" fill={X.textMut}>{p.label}</text>
            </g>
          ))}
          {/* Pump nodes */}
          <circle cx="15" cy="50" r="6" fill={X.bg} stroke={X.teal} strokeWidth="1" />
          <text x="15" y="52" textAnchor="middle" fontFamily={X.m} fontSize="4" fontWeight="700" fill={X.teal}>P</text>
          <circle cx="85" cy="50" r="6" fill={X.bg} stroke={X.indigo} strokeWidth="1" />
          <text x="85" y="52" textAnchor="middle" fontFamily={X.m} fontSize="4" fontWeight="700" fill={X.indigo}>HX</text>
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Flow</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: isWarning ? X.amber : X.teal }}>{flowRate.toFixed(0)}%</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Inlet</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>{inletTemp.toFixed(0)}°C</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Outlet</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.amber }}>{outletTemp.toFixed(0)}°C</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Pressure</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{pressure.toFixed(0)} bar</M></div>
      </div>
    </Card>
  );
}

// ── Radiation Level ──────────────────────────────────────────────────
export function RadiationLevel({ title = 'Radiation Level', alertThreshold = 80, level, dose }: { title?: string; alertThreshold?: number; level: number; dose: number } = {} as any) {
  const X = getX();
  const n = neo();
  const pct = Math.max(0, Math.min(100, level));
  const isAlert = pct > alertThreshold;
  const bars = 12;

  return (
    <Card style={{ width: 350 }} glow={isAlert ? X.red : undefined}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={isAlert ? X.red : X.teal} solid={isAlert}>{isAlert ? 'ALERT' : 'SAFE'}</Badge>
      </div>
      <div style={{ background: n.metal, borderRadius: 8, boxShadow: n.bezel, padding: '12px 14px', marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 50, marginBottom: 6 }}>
          {Array.from({ length: bars }, (_, i) => {
            const threshold = (i / bars) * 100;
            const active = pct > threshold;
            const barColor = threshold > 80 ? X.red : threshold > 60 ? X.amber : X.teal;
            return (
              <div key={i} style={{
                flex: 1, height: `${40 + i * 5}%`, borderRadius: 2,
                background: active ? `radial-gradient(circle at 50% 30%, ${barColor}ff, ${barColor}88)` : X.bg,
                boxShadow: active ? `0 0 6px ${barColor}40, inset 0 1px 0 rgba(255,255,255,0.15)` : n.concave,
                transition: `background 300ms ${ease.mv}, box-shadow 300ms ${ease.mv}`,
                animation: active && isAlert ? 'br 1.5s ease infinite' : 'none',
              }} />
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <M style={{ fontSize: 7, color: X.textMut }}>0</M>
          <M style={{ fontSize: 7, color: X.textMut }}>50</M>
          <M style={{ fontSize: 7, color: X.textMut }}>100%</M>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Level</Lbl><M style={{ fontSize: 12, fontWeight: 800, color: isAlert ? X.red : X.teal }}>{pct.toFixed(1)}%</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Dose Rate</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{dose.toFixed(3)} mSv/h</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Threshold</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.amber }}>{alertThreshold}%</M></div>
      </div>
    </Card>
  );
}

// ── Containment Status ───────────────────────────────────────────────
export function ContainmentStatus({ title = 'Containment', sealCount = 4, pressure }: { title?: string; sealCount?: number; pressure: number } = {} as any) {
  const X = getX();
  const n = neo();
  const [seals, setSeals] = useState<boolean[]>(() => Array.from({ length: sealCount }, () => true));

  const toggleSeal = (i: number) => {
    setSeals(prev => { const next = [...prev]; next[i] = !next[i]; return next; });
  };

  const allSealed = seals.every(Boolean);
  const sealLabels = ['Primary', 'Secondary', 'Airlock', 'Emergency', 'Aux-A', 'Aux-B'];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <Dot c={allSealed ? X.teal : X.red} pulse={!allSealed} s={7} />
          <Badge color={allSealed ? X.teal : X.red}>{allSealed ? 'SEALED' : 'BREACH'}</Badge>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
        {seals.map((on, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <M style={{ fontSize: 9, color: X.textMut, width: 60 }}>{sealLabels[i] || `Seal ${i + 1}`}</M>
            {/* Toggle track */}
            <div
              onClick={() => toggleSeal(i)}
              style={{
                width: 36, height: 18, borderRadius: 9, cursor: 'pointer', position: 'relative',
                background: on ? X.teal + '25' : X.bg,
                boxShadow: n.concave,
                transition: `background 200ms ${ease.mv}`,
              }}
            >
              <div style={{
                width: 14, height: 14, borderRadius: '50%', position: 'absolute', top: 2,
                left: on ? 20 : 2,
                background: on ? X.teal : X.textMut,
                boxShadow: on ? `0 0 6px ${X.teal}50, ${n.raised}` : n.raised,
                transition: `left 200ms ${ease.sp}, background 200ms ${ease.mv}, box-shadow 200ms ${ease.mv}`,
              }} />
            </div>
            {/* Status LED */}
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: on ? `radial-gradient(circle at 35% 35%, ${X.teal}ff, ${X.teal}88)` : X.bgAlt,
              boxShadow: on ? `0 0 6px ${X.teal}50` : n.concave,
              animation: on ? 'none' : 'br 1.5s ease infinite',
            }} />
            <M style={{ fontSize: 9, fontWeight: 600, color: on ? X.teal : X.red }}>{on ? 'SEALED' : 'OPEN'}</M>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${X.borderLight}`, paddingTop: 8 }}>
        <div><Lbl style={{ marginBottom: 2 }}>Pressure</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{pressure.toFixed(3)} atm</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Integrity</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: allSealed ? X.teal : X.red }}>{allSealed ? '100%' : `${((seals.filter(Boolean).length / seals.length) * 100).toFixed(0)}%`}</M></div>
      </div>
    </Card>
  );
}

// ── Fuel Rod Position ────────────────────────────────────────────────
export function FuelRodPosition({ title = 'Fuel Rods', rodCount = 4 }: { title?: string; rodCount?: number } = {}) {
  const X = getX();
  const n = neo();
  const rods = Array.from({ length: Math.min(rodCount, 6) }, (_, i) => ({
    label: `Rod ${String.fromCharCode(65 + i)}`,
    position: 40 + i * 10,
  }));
  const avgPos = rods.reduce((s, r) => s + r.position, 0) / rods.length;

  return (
    <Card style={{ width: 380 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>AVG {avgPos.toFixed(0)}%</Badge>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {rods.map((rod, i) => {
          const pos = Math.max(0, Math.min(100, rod.position));
          const c = pos > 80 ? X.red : pos > 60 ? X.amber : X.teal;
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <Lbl style={{ marginBottom: 0 }}>{rod.label}</Lbl>
              {/* Vertical track */}
              <div style={{
                width: 20, height: 80, borderRadius: 10, position: 'relative',
                background: X.bg, boxShadow: n.concave,
              }}>
                {/* Rod handle */}
                <div style={{
                  width: 28, height: 14, borderRadius: 7, position: 'absolute',
                  left: -4, bottom: `${pos * 0.8}%`,
                  background: n.metal, boxShadow: n.raised,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: `bottom 600ms ${ease.sp}`,
                }}>
                  <div style={{ width: 12, height: 2, borderRadius: 1, background: X.textMut }} />
                </div>
                {/* Fill */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 2, right: 2, borderRadius: 8,
                  height: `${pos}%`, background: `linear-gradient(to top, ${c}40, ${c}15)`,
                  transition: `height 600ms ${ease.sp}`,
                }} />
              </div>
              <M style={{ fontSize: 9, fontWeight: 700, color: c }}>{pos.toFixed(0)}%</M>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${X.borderLight}`, paddingTop: 8 }}>
        <div><Lbl style={{ marginBottom: 2 }}>Reactivity</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>+0.3 pcm</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Mode</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>Auto</M></div>
      </div>
    </Card>
  );
}

// ── Emergency Panel ──────────────────────────────────────────────────
export function EmergencyPanel({ title = 'Emergency', scramEnabled = true, elapsed }: { title?: string; scramEnabled?: boolean; elapsed: number } = {} as any) {
  const X = getX();
  const n = neo();
  const [scramPressed, setScramPressed] = useState(false);
  const [armed, setArmed] = useState(scramEnabled);

  const buttons: { label: string; color: string; icon: string }[] = [
    { label: 'SCRAM', color: X.red, icon: '⚠' },
    { label: 'ISOLATE', color: X.amber, icon: '⊘' },
    { label: 'VENT', color: X.indigo, icon: '↑' },
    { label: 'ALARM', color: X.pink, icon: '!' },
  ];

  return (
    <Card style={{ width: 370 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <Dot c={armed ? X.teal : X.textMut} pulse={armed} s={6} />
          <Badge color={armed ? X.teal : X.textMut}>{armed ? 'ARMED' : 'STANDBY'}</Badge>
        </div>
      </div>
      <div style={{ background: n.metal, borderRadius: 8, boxShadow: n.bezel, padding: 14, marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
          {buttons.map((btn, i) => {
            const isScram = i === 0;
            const pressed = isScram && scramPressed;
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <button
                  onMouseDown={() => isScram && setScramPressed(true)}
                  onMouseUp={() => isScram && setScramPressed(false)}
                  onMouseLeave={() => isScram && setScramPressed(false)}
                  onClick={() => { if (isScram) setArmed(!armed); }}
                  style={{
                    width: isScram ? 60 : 48, height: isScram ? 60 : 48,
                    borderRadius: '50%', border: 'none', cursor: 'pointer',
                    background: `radial-gradient(circle at 40% 35%, ${btn.color}dd, ${btn.color}88)`,
                    boxShadow: pressed
                      ? `inset 0 2px 4px rgba(0,0,0,0.4), 0 0 0 transparent`
                      : `0 3px 0 ${btn.color}66, 0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)`,
                    transform: pressed ? 'translateY(2px)' : 'translateY(0)',
                    transition: `transform 100ms ${ease.mv}, box-shadow 100ms ${ease.mv}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: isScram ? 18 : 14, color: '#fff', fontWeight: 700,
                  }}
                >
                  {btn.icon}
                </button>
                <M style={{ fontSize: 8, fontWeight: 700, color: btn.color, letterSpacing: '.05em' }}>{btn.label}</M>
                {/* Status LED */}
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: (isScram && armed) ? `radial-gradient(circle at 35% 35%, ${btn.color}ff, ${btn.color}88)` : X.bgAlt,
                  boxShadow: (isScram && armed) ? `0 0 6px ${btn.color}50` : n.concave,
                  animation: (isScram && armed) ? 'br 1.5s ease infinite' : 'none',
                }} />
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Last Test</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>14h ago</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Response</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>0.8s</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Trips</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textMut }}>0</M></div>
      </div>
    </Card>
  );
}
