import { useState, useEffect } from 'react';
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

// ── Charger Station ─────────────────────────────────────────────────
export function ChargerStation({ title = 'Charger Bay 01', status = 'charging' as 'charging' | 'available' | 'faulted', connectorType = 'CCS2', powerKW = 62, sessionMinutes = 34 }: { title?: string; status?: 'charging' | 'available' | 'faulted'; connectorType?: string; powerKW?: number; sessionMinutes?: number }) {
  const X = getX();
  const n = neo();
  const tick = useTick(80);
  const statusColor = status === 'charging' ? X.teal : status === 'available' ? X.purple : X.red;
  const statusLabel = status === 'charging' ? 'Charging' : status === 'available' ? 'Available' : 'Faulted';
  const animPower = useAnim(powerKW);
  const dashOffset = tick % 200;

  const hrs = Math.floor(sessionMinutes / 60);
  const mins = sessionMinutes % 60;

  return (
    <Card style={{ width: 350 }} glow={statusColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={statusColor} solid>{statusLabel}</Badge>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
        <svg viewBox="0 0 80 80" style={{ width: 80, height: 80, flexShrink: 0 }}>
          {/* Outer energy ring */}
          <circle cx="40" cy="40" r="36" fill="none" stroke={X.borderLight} strokeWidth="3" />
          {status === 'charging' && (
            <circle cx="40" cy="40" r="36" fill="none" stroke={statusColor} strokeWidth="3"
              strokeDasharray="12 6" strokeDashoffset={-dashOffset} strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 4px ${statusColor}60)` }} />
          )}
          {/* Plug icon */}
          <rect x="32" y="22" width="16" height="8" rx="2" fill="none" stroke={statusColor} strokeWidth="1.5" />
          <rect x="35" y="16" width="3" height="6" rx="1" fill={statusColor} />
          <rect x="42" y="16" width="3" height="6" rx="1" fill={statusColor} />
          <rect x="37" y="30" width="6" height="14" rx="1" fill="none" stroke={statusColor} strokeWidth="1.5" />
          <line x1="40" y1="44" x2="40" y2="52" stroke={statusColor} strokeWidth="1.5" />
          <circle cx="40" cy="56" r="4" fill="none" stroke={statusColor} strokeWidth="1.5" />
          {/* Lightning bolt for charging */}
          {status === 'charging' && (
            <path d="M38,58 L42,54 L40,54 L42,50 L38,54 L40,54 Z" fill={statusColor}
              style={{ opacity: (tick % 20) > 10 ? 0.4 : 1, transition: 'opacity 200ms' }} />
          )}
        </svg>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
            <M style={{ fontSize: 28, fontWeight: 800, color: statusColor }}>{animPower.toFixed(1)}</M>
            <M style={{ fontSize: 11, color: X.textMut }}>kW</M>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div><Lbl style={{ marginBottom: 2 }}>Connector</Lbl><M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{connectorType}</M></div>
            <div><Lbl style={{ marginBottom: 2 }}>Session</Lbl><M style={{ fontSize: 10, fontWeight: 600, color: X.textSec }}>{hrs > 0 ? `${hrs}h ` : ''}{mins}m</M></div>
          </div>
        </div>
      </div>
      <Prog value={status === 'charging' ? Math.min(100, (sessionMinutes / 60) * 100) : 0} color={statusColor} h={3} />
    </Card>
  );
}

// ── Charging Curve ──────────────────────────────────────────────────
export function ChargingCurve({ title = 'Charge Profile', currentKW = 48, maxKW = 150, socPercent = 62 }: { title?: string; currentKW?: number; maxKW?: number; socPercent?: number }) {
  const X = getX();
  const animKW = useAnim(currentKW);
  const animSoC = useAnim(socPercent);

  // Generate CC/CV curve: fast up to ~80%, then taper
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const soc = (i / 40) * 100;
    const x = (soc / 100) * 100;
    let kw: number;
    if (soc < 10) kw = maxKW * (soc / 10) * 0.95;
    else if (soc < 75) kw = maxKW * 0.95;
    else kw = maxKW * 0.95 * Math.pow(1 - ((soc - 75) / 25), 0.6);
    const y = 90 - (kw / maxKW) * 80;
    pts.push(`${x},${y}`);
  }
  const fillPts = `0,90 ${pts.join(' ')} 100,90`;

  // Current position on curve
  const curX = socPercent;
  let curKWOnCurve: number;
  if (socPercent < 10) curKWOnCurve = maxKW * (socPercent / 10) * 0.95;
  else if (socPercent < 75) curKWOnCurve = maxKW * 0.95;
  else curKWOnCurve = maxKW * 0.95 * Math.pow(1 - ((socPercent - 75) / 25), 0.6);
  const curY = 90 - (curKWOnCurve / maxKW) * 80;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{animSoC.toFixed(0)}% SoC</Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
        <M style={{ fontSize: 24, fontWeight: 800, color: X.teal }}>{animKW.toFixed(1)}</M>
        <M style={{ fontSize: 10, color: X.textMut }}>kW</M>
        <M style={{ fontSize: 10, color: X.textMut, marginLeft: 6 }}>of {maxKW} kW max</M>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 80, overflow: 'visible', marginBottom: 8 }}>
        <defs>
          <linearGradient id="cc-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={X.teal} stopOpacity=".2" />
            <stop offset="100%" stopColor={X.teal} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[25, 50, 75].map(v => (
          <line key={v} x1="0" y1={90 - (v / 100) * 80} x2="100" y2={90 - (v / 100) * 80} stroke={X.borderLight} strokeWidth="0.3" vectorEffect="non-scaling-stroke" />
        ))}
        <polygon points={fillPts} fill="url(#cc-g)" />
        <polyline points={pts.join(' ')} fill="none" stroke={X.teal} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {/* Current position dot */}
        <circle cx={curX} cy={curY} r="2.5" fill={X.teal} stroke={X.bg} strokeWidth="1" vectorEffect="non-scaling-stroke"
          style={{ filter: `drop-shadow(0 0 3px ${X.teal})` }} />
        {/* SoC axis labels */}
        {[0, 25, 50, 75, 100].map(v => (
          <text key={v} x={v} y="98" textAnchor="middle" fontFamily={X.m} fontSize="5" fill={X.textMut}>{v}%</text>
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Phase</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: socPercent < 80 ? X.teal : X.amber }}>{socPercent < 80 ? 'CC (Const Current)' : 'CV (Const Voltage)'}</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>ETA Full</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{Math.max(1, Math.round((100 - socPercent) * 0.6))} min</M></div>
      </div>
    </Card>
  );
}

// ── Fleet Charge Schedule ───────────────────────────────────────────
export function FleetChargeSchedule({ title = 'Fleet Schedule', vehicleCount = 6 }: { title?: string; vehicleCount?: number }) {
  const X = getX();
  const [vehicles] = useState(() => {
    const names = ['Van-A1', 'Bus-12', 'Truck-7', 'Van-B3', 'Sedan-04', 'Bus-08', 'Van-C2', 'Truck-3'];
    const priorities: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low', 'medium', 'low', 'high', 'medium', 'low'];
    return Array.from({ length: Math.min(vehicleCount, 8) }, (_, i) => ({
      name: names[i % names.length],
      priority: priorities[i % priorities.length],
      start: 2 + Math.floor(Math.random() * 10),
      duration: 2 + Math.floor(Math.random() * 6),
      soc: 20 + Math.floor(Math.random() * 60),
    }));
  });

  const prioColor = (p: string) => p === 'high' ? X.red : p === 'medium' ? X.amber : X.teal;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>{vehicleCount} vehicles</Badge>
      </div>
      {/* Time axis */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, paddingLeft: 56 }}>
        {[0, 6, 12, 18, 24].map(h => (
          <M key={h} style={{ fontSize: 7, color: X.textMut }}>{String(h).padStart(2, '0')}:00</M>
        ))}
      </div>
      {vehicles.map((v, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <M style={{ fontSize: 8, color: X.textSec, width: 50, textAlign: 'right', flexShrink: 0 }}>{v.name}</M>
          <div style={{ flex: 1, height: 14, position: 'relative', background: X.borderLight + '30', borderRadius: 3 }}>
            <div style={{
              position: 'absolute', left: `${(v.start / 24) * 100}%`, width: `${(v.duration / 24) * 100}%`,
              height: '100%', background: prioColor(v.priority) + '60', borderRadius: 3,
              border: `1px solid ${prioColor(v.priority)}40`,
            }}>
              <M style={{ fontSize: 6, color: X.text, paddingLeft: 3, lineHeight: '14px' }}>{v.soc}%</M>
            </div>
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
        {(['high', 'medium', 'low'] as const).map(p => (
          <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Dot c={prioColor(p)} s={5} />
            <M style={{ fontSize: 8, color: X.textMut, textTransform: 'capitalize' }}>{p}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Station Map ─────────────────────────────────────────────────────
export function StationMap({ title = 'Station Overview', bays = 12 }: { title?: string; bays?: number }) {
  const X = getX();
  const n = neo();
  const [bayStatus] = useState(() =>
    Array.from({ length: bays }, () => {
      const r = Math.random();
      return r < 0.4 ? 'charging' as const : r < 0.75 ? 'available' as const : r < 0.9 ? 'reserved' as const : 'faulted' as const;
    })
  );
  const cols = Math.min(6, Math.ceil(bays / 2));
  const statusColor = (s: string) => s === 'charging' ? X.teal : s === 'available' ? X.purple : s === 'reserved' ? X.amber : X.red;
  const counts = { charging: 0, available: 0, reserved: 0, faulted: 0 };
  bayStatus.forEach(s => counts[s]++);

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{counts.available} free</Badge>
      </div>
      <div style={{
        display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 6,
        padding: 12, borderRadius: X.rs, boxShadow: n.concave, marginBottom: 12,
      }}>
        {bayStatus.map((s, i) => {
          const c = statusColor(s);
          return (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '8px 4px', borderRadius: X.rs, background: c + '0a',
              border: `1px solid ${c}25`, transition: `background 200ms`,
            }}>
              <svg viewBox="0 0 20 20" style={{ width: 16, height: 16 }}>
                <rect x="2" y="4" width="16" height="12" rx="2" fill="none" stroke={c} strokeWidth="1.2" />
                <rect x="7" y="1" width="2" height="3" rx="0.5" fill={c} />
                <rect x="11" y="1" width="2" height="3" rx="0.5" fill={c} />
                {s === 'charging' && <path d="M9,7 L11,10 L9.5,10 L11,13 L9,10 L10.5,10 Z" fill={c} />}
              </svg>
              <M style={{ fontSize: 7, color: X.textMut }}>B{i + 1}</M>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {Object.entries(counts).map(([k, v]) => (
          <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Dot c={statusColor(k)} s={5} pulse={k === 'charging'} />
            <M style={{ fontSize: 8, color: X.textMut }}>{v} {k}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Energy Balance ──────────────────────────────────────────────────
export function EnergyBalance({ title = 'Energy Balance', solarKW = 45, gridKW = 28, batteryKW = 12 }: { title?: string; solarKW?: number; gridKW?: number; batteryKW?: number }) {
  const X = getX();
  const tick = useTick(80);
  const total = solarKW + gridKW + batteryKW;
  const animSolar = useAnim(solarKW);
  const animGrid = useAnim(gridKW);
  const animBatt = useAnim(batteryKW);

  const flowDash = (color: string): React.CSSProperties => ({
    stroke: color, strokeWidth: 2, fill: 'none',
    strokeDasharray: '8 4', strokeDashoffset: -(tick % 120),
    vectorEffect: 'non-scaling-stroke' as const,
  });

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>{total.toFixed(0)} kW total</M>
      </div>
      <svg viewBox="0 0 280 100" style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible', marginBottom: 8 }}>
        {/* Source labels + nodes */}
        <text x="12" y="18" fontFamily={X.m} fontSize="7" fontWeight="600" fill={X.amber}>Solar</text>
        <text x="12" y="27" fontFamily={X.m} fontSize="6" fill={X.textMut}>{animSolar.toFixed(1)} kW</text>
        <rect x="44" y="10" width="24" height="20" rx="4" fill={X.amber + '18'} stroke={X.amber} strokeWidth="1" />

        <text x="12" y="53" fontFamily={X.m} fontSize="7" fontWeight="600" fill={X.indigo}>Grid</text>
        <text x="12" y="62" fontFamily={X.m} fontSize="6" fill={X.textMut}>{animGrid.toFixed(1)} kW</text>
        <rect x="44" y="45" width="24" height="20" rx="4" fill={X.indigo + '18'} stroke={X.indigo} strokeWidth="1" />

        <text x="12" y="88" fontFamily={X.m} fontSize="7" fontWeight="600" fill={X.purple}>Battery</text>
        <text x="12" y="97" fontFamily={X.m} fontSize="6" fill={X.textMut}>{animBatt.toFixed(1)} kW</text>
        <rect x="44" y="80" width="24" height="20" rx="4" fill={X.purple + '18'} stroke={X.purple} strokeWidth="1" />

        {/* Merge node */}
        <rect x="130" y="40" width="28" height="24" rx="6" fill={X.teal + '15'} stroke={X.teal} strokeWidth="1" />
        <text x="144" y="56" textAnchor="middle" fontFamily={X.m} fontSize="6" fill={X.teal}>MIX</text>

        {/* Charger output */}
        <rect x="210" y="35" width="50" height="34" rx="6" fill={X.teal + '0c'} stroke={X.teal + '50'} strokeWidth="1" />
        <text x="235" y="50" textAnchor="middle" fontFamily={X.m} fontSize="7" fontWeight="600" fill={X.teal}>Chargers</text>
        <text x="235" y="62" textAnchor="middle" fontFamily={X.m} fontSize="6" fill={X.textMut}>{total.toFixed(0)} kW</text>

        {/* Flow paths: sources -> merge */}
        <path d="M68,20 Q100,20 130,52" style={flowDash(X.amber)} />
        <path d="M68,55 L130,55" style={flowDash(X.indigo)} />
        <path d="M68,90 Q100,90 130,58" style={flowDash(X.purple)} />

        {/* Flow path: merge -> chargers */}
        <path d="M158,52 L210,52" style={flowDash(X.teal)} />
      </svg>
      {/* Proportional bar */}
      <Lbl style={{ marginBottom: 4 }}>Source Mix</Lbl>
      <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
        <div style={{ width: `${(solarKW / total) * 100}%`, background: X.amber, transition: 'width 400ms' }} />
        <div style={{ width: `${(gridKW / total) * 100}%`, background: X.indigo, transition: 'width 400ms' }} />
        <div style={{ width: `${(batteryKW / total) * 100}%`, background: X.purple, transition: 'width 400ms' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <M style={{ fontSize: 8, color: X.amber }}>{((solarKW / total) * 100).toFixed(0)}% Solar</M>
        <M style={{ fontSize: 8, color: X.indigo }}>{((gridKW / total) * 100).toFixed(0)}% Grid</M>
        <M style={{ fontSize: 8, color: X.purple }}>{((batteryKW / total) * 100).toFixed(0)}% Battery</M>
      </div>
    </Card>
  );
}

// ── Session History ─────────────────────────────────────────────────
export function SessionHistory({ title = 'Session History', sessionsToday = 47, kwhToday = 1284, revenueToday = 385 }: { title?: string; sessionsToday?: number; kwhToday?: number; revenueToday?: number }) {
  const X = getX();
  const animSessions = useAnim(sessionsToday);
  const animKwh = useAnim(kwhToday);
  const animRev = useAnim(revenueToday);

  const [sparkData] = useState(() =>
    Array.from({ length: 24 }, (_, i) => {
      if (i < 6) return Math.random() * 5;
      if (i < 9) return 20 + Math.random() * 30;
      if (i < 17) return 40 + Math.random() * 40;
      if (i < 21) return 30 + Math.random() * 35;
      return 5 + Math.random() * 15;
    })
  );
  const mx = Math.max(...sparkData, 1);
  const sparkPts = sparkData.map((v, i) => `${(i / 23) * 100},${95 - (v / mx) * 85}`).join(' ');

  const [recentSessions] = useState(() => [
    { id: 'S-4712', kwh: 42.3, dur: '1h 12m', cost: 12.69 },
    { id: 'S-4711', kwh: 28.7, dur: '0h 48m', cost: 8.61 },
    { id: 'S-4710', kwh: 61.5, dur: '1h 35m', cost: 18.45 },
    { id: 'S-4709', kwh: 35.1, dur: '0h 55m', cost: 10.53 },
  ]);

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}>Today</Badge>
      </div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Sessions</Lbl>
          <M style={{ fontSize: 18, fontWeight: 800, color: X.text }}>{animSessions.toFixed(0)}</M>
        </div>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Energy</Lbl>
          <M style={{ fontSize: 18, fontWeight: 800, color: X.teal }}>{animKwh.toFixed(0)}<span style={{ fontSize: 9, color: X.textMut }}> kWh</span></M>
        </div>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Revenue</Lbl>
          <M style={{ fontSize: 18, fontWeight: 800, color: X.purple }}>${animRev.toFixed(0)}</M>
        </div>
      </div>
      <Lbl style={{ marginBottom: 4 }}>Hourly Load</Lbl>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 32, overflow: 'hidden', marginBottom: 10 }}>
        <defs>
          <linearGradient id="sh-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={X.purple} stopOpacity=".2" />
            <stop offset="100%" stopColor={X.purple} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,100 ${sparkPts} 100,100`} fill="url(#sh-g)" />
        <polyline points={sparkPts} fill="none" stroke={X.purple} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <Lbl style={{ marginBottom: 4 }}>Recent Sessions</Lbl>
      {recentSessions.map((s, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', borderBottom: i < recentSessions.length - 1 ? `1px solid ${X.borderLight}` : 'none' }}>
          <M style={{ fontSize: 9, color: X.textSec }}>{s.id}</M>
          <M style={{ fontSize: 9, color: X.textMut }}>{s.kwh} kWh</M>
          <M style={{ fontSize: 9, color: X.textMut }}>{s.dur}</M>
          <M style={{ fontSize: 9, fontWeight: 600, color: X.teal }}>${s.cost.toFixed(2)}</M>
        </div>
      ))}
    </Card>
  );
}
