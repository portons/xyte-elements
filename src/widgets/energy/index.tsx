import { useState, useEffect } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { useAnim, useTick } from '../hooks';

// ── Solar Panel ──────────────────────────────────────────────────────
export function SolarPanel({ title = 'Solar Production', panelCount = 24, output, daily, efficiency }: { title?: string; panelCount?: number; output: number; daily: number; efficiency: number }) {
  const X = getX();
  const [curve, setCurve] = useState(() =>
    Array.from({ length: 24 }, (_, i) => {
      const h = i;
      if (h < 6 || h > 20) return 0;
      return Math.sin(((h - 6) / 14) * Math.PI) * 5.5 + Math.random() * 0.8;
    })
  );
  useEffect(() => {
    const iv = setInterval(() => {
      setCurve(prev => prev.map((v, i) => {
        if (i < 6 || i > 20) return 0;
        return Math.max(0, v + (Math.random() - 0.5) * 0.4);
      }));
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const mx = Math.max(...curve, 1);
  const pts = curve.map((v, i) => `${(i / 23) * 100},${100 - (v / mx) * 85}`).join(' ');

  return (
    <Card style={{ width: 350 }} glow={X.amber}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.amber} solid>Live</Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
        <M style={{ fontSize: 28, fontWeight: 800, color: X.amber }}>{output.toFixed(1)}</M>
        <M style={{ fontSize: 11, color: X.textMut }}>kW</M>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 36, overflow: 'hidden', marginBottom: 10 }}>
        <defs>
          <linearGradient id="sol-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={X.amber} stopOpacity=".25" />
            <stop offset="100%" stopColor={X.amber} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,100 ${pts} 100,100`} fill="url(#sol-g)" />
        <polyline points={pts} fill="none" stroke={X.amber} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Daily Yield</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.text }}>{daily.toFixed(1)} kWh</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Efficiency</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>{efficiency.toFixed(1)}%</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Panels</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{panelCount} Active</M></div>
      </div>
    </Card>
  );
}

// ── Battery Bank ─────────────────────────────────────────────────────
export function BatteryBank({ title = 'Battery', capacity = 100, charge, rate }: { title?: string; capacity?: number; charge: number; rate: number }) {
  const X = getX();
  const pct = Math.max(0, Math.min(100, Math.round(charge)));
  const c = pct > 60 ? X.teal : pct > 25 ? X.amber : X.red;
  const animPct = useAnim(pct);
  const isCharging = rate > 0;
  const hoursLeft = isCharging ? ((capacity - pct) / (rate || 1) * 2).toFixed(1) : (pct / (Math.abs(rate) || 1) * 2).toFixed(1);

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={isCharging ? X.teal : X.amber}>{isCharging ? 'Charging' : 'Discharging'}</Badge>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <svg viewBox="0 0 100 100" style={{ width: 90, height: 90 }}>
          <circle cx="50" cy="50" r="42" fill="none" stroke={X.borderLight} strokeWidth="6" />
          <circle cx="50" cy="50" r="42" fill="none" stroke={c} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${(animPct / 100) * 264} 264`}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dasharray 600ms, stroke 400ms', filter: `drop-shadow(0 0 4px ${c}40)` }} />
          <text x="50" y="46" textAnchor="middle" fontFamily={X.m} fontSize="18" fontWeight="800" fill={c}>{pct}%</text>
          <text x="50" y="60" textAnchor="middle" fontFamily={X.m} fontSize="7" fill={X.textMut}>CHARGE</text>
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Rate</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: isCharging ? X.teal : X.amber }}>{isCharging ? '+' : ''}{rate.toFixed(1)} kW</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Est. Time</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{hoursLeft}h</M></div>
      </div>
    </Card>
  );
}

// ── Grid Status ──────────────────────────────────────────────────────
export function GridStatus({ title = 'Grid Status', nominalVoltage = 230, importW, freq, voltage }: { title?: string; nominalVoltage?: number; importW: number; freq: number; voltage: number }) {
  const X = getX();
  const [mode, setMode] = useState<'grid' | 'island'>('grid');
  const isExporting = importW < 0;

  const rows: [string, string, string][] = [
    [isExporting ? 'Export' : 'Import', `${Math.abs(importW).toFixed(0)} W`, isExporting ? X.teal : X.amber],
    ['Frequency', `${freq.toFixed(2)} Hz`, Math.abs(freq - 50) > 0.05 ? X.amber : X.teal],
    ['Voltage', `${voltage.toFixed(1)} V`, voltage < 225 || voltage > 235 ? X.amber : X.teal],
    ['Phase', '3-Phase', X.textSec],
    ['PF', '0.97', X.teal],
  ];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Dot c={mode === 'grid' ? X.teal : X.amber} pulse s={7} />
      </div>
      {rows.map(([l, v, c], i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: i < rows.length - 1 ? `1px solid ${X.borderLight}` : 'none', animation: `fu 150ms ${ease.o} ${i * 15}ms both` }}>
          <M style={{ fontSize: 9, color: X.textMut }}>{l}</M>
          <M style={{ fontSize: 9, fontWeight: 600, color: c }}>{v}</M>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
        <Btn small ghost active={mode === 'grid'} onClick={() => setMode('grid')} color={X.teal}>Grid</Btn>
        <Btn small ghost active={mode === 'island'} onClick={() => setMode('island')} color={X.amber}>Island</Btn>
      </div>
    </Card>
  );
}

// ── Carbon Tracker ───────────────────────────────────────────────────
export function CarbonTracker({ title = 'CO\u2082 Tracker', unit = 'kg', dailyCO2, monthlyCO2, reduction }: { title?: string; unit?: string; dailyCO2: number; monthlyCO2: number; reduction: number }) {
  const X = getX();
  const [bars] = useState(() => Array.from({ length: 7 }, () => 8 + Math.random() * 18));
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mx = Math.max(...bars, 1);

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>-{Math.round(reduction)}%</Badge>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div><Lbl style={{ marginBottom: 2 }}>Today</Lbl><M style={{ fontSize: 14, fontWeight: 800, color: X.text }}>{dailyCO2.toFixed(1)}<span style={{ fontSize: 9, color: X.textMut }}> {unit}</span></M></div>
        <div><Lbl style={{ marginBottom: 2 }}>Monthly</Lbl><M style={{ fontSize: 14, fontWeight: 800, color: X.textSec }}>{Math.round(monthlyCO2)}<span style={{ fontSize: 9, color: X.textMut }}> {unit}</span></M></div>
      </div>
      <Lbl style={{ marginBottom: 4 }}>Last 7 Days</Lbl>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 36 }}>
        {bars.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ width: '100%', height: `${(v / mx) * 100}%`, background: v > 18 ? X.amber : X.teal, borderRadius: 2, transition: 'height 300ms', minHeight: 2 }} />
            <M style={{ fontSize: 6, color: X.textMut }}>{days[i]}</M>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <Lbl>vs Baseline</Lbl>
        <M style={{ fontSize: 9, fontWeight: 700, color: X.teal }}>-{Math.round(reduction)}% reduction</M>
      </div>
    </Card>
  );
}

// ── Energy Flow ──────────────────────────────────────────────────────
export function EnergyFlow({ title = 'Energy Flow', showBattery = true, solarW, gridW, battW, loadW }: { title?: string; showBattery?: boolean; solarW: number; gridW: number; battW: number; loadW: number }) {
  const X = getX();
  const tick = useTick(100);

  const flowStyle = (color: string): React.CSSProperties => ({
    stroke: color,
    strokeWidth: 2,
    fill: 'none',
    strokeDasharray: '6 4',
    strokeDashoffset: -(tick % 100),
    vectorEffect: 'non-scaling-stroke' as const,
  });

  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>{title}</div>
      <svg viewBox="0 0 260 120" style={{ display: 'block', width: '100%', height: 'auto', overflow: 'visible' }}>
        {/* Source labels */}
        <text x="10" y="18" fontFamily={X.m} fontSize="8" fontWeight="600" fill={X.amber}>Solar</text>
        <text x="10" y="28" fontFamily={X.m} fontSize="7" fill={X.textMut}>{(solarW / 1000).toFixed(1)}kW</text>
        <text x="10" y="58" fontFamily={X.m} fontSize="8" fontWeight="600" fill={X.indigo}>Grid</text>
        <text x="10" y="68" fontFamily={X.m} fontSize="7" fill={X.textMut}>{(gridW / 1000).toFixed(1)}kW</text>

        {/* Storage label */}
        <text x="113" y="108" fontFamily={X.m} fontSize="8" fontWeight="600" fill={X.teal} textAnchor="middle">Battery</text>
        <text x="113" y="118" fontFamily={X.m} fontSize="7" fill={X.textMut} textAnchor="middle">{(battW / 1000).toFixed(1)}kW</text>

        {/* Load label */}
        <text x="220" y="42" fontFamily={X.m} fontSize="8" fontWeight="600" fill={X.purple} textAnchor="middle">Load</text>
        <text x="220" y="52" fontFamily={X.m} fontSize="7" fill={X.textMut} textAnchor="middle">{(loadW / 1000).toFixed(1)}kW</text>

        {/* Source nodes */}
        <rect x="50" y="10" width="30" height="20" rx="4" fill={X.amber + '20'} stroke={X.amber} strokeWidth="1" />
        <rect x="50" y="50" width="30" height="20" rx="4" fill={X.indigo + '20'} stroke={X.indigo} strokeWidth="1" />

        {/* Storage node */}
        <rect x="100" y="85" width="26" height="20" rx="4" fill={X.teal + '20'} stroke={X.teal} strokeWidth="1" />

        {/* Load node */}
        <rect x="200" y="25" width="40" height="20" rx="4" fill={X.purple + '20'} stroke={X.purple} strokeWidth="1" />

        {/* Flow: Solar -> Load */}
        <path d={`M80,20 Q140,20 200,35`} style={flowStyle(X.amber)} />
        {/* Flow: Grid -> Load */}
        <path d={`M80,60 Q140,50 200,40`} style={flowStyle(X.indigo)} />
        {/* Flow: Solar -> Battery */}
        <path d={`M65,30 Q65,70 100,95`} style={flowStyle(X.amber)} opacity=".5" />
        {/* Flow: Battery -> Load */}
        <path d={`M126,95 Q170,80 200,45`} style={flowStyle(X.teal)} />
      </svg>
    </Card>
  );
}

// ── Cost Monitor ─────────────────────────────────────────────────────
export function CostMonitor({ title = 'Energy Cost', currency = '$', rate, dailyCost, monthlyCost }: { title?: string; currency?: string; rate: number; dailyCost: number; monthlyCost: number }) {
  const X = getX();
  const [period, setPeriod] = useState<'peak' | 'off-peak' | 'shoulder'>('peak');

  const periods: { name: string; hours: string; rate: string; color: string; id: 'peak' | 'off-peak' | 'shoulder' }[] = [
    { name: 'Off-Peak', hours: '22:00 - 06:00', rate: `${currency}0.08`, color: X.teal, id: 'off-peak' },
    { name: 'Shoulder', hours: '06:00 - 16:00', rate: `${currency}0.12`, color: X.amber, id: 'shoulder' },
    { name: 'Peak', hours: '16:00 - 22:00', rate: `${currency}0.22`, color: X.red, id: 'peak' },
  ];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={period === 'peak' ? X.red : period === 'shoulder' ? X.amber : X.teal}>{period}</Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 10 }}>
        <M style={{ fontSize: 22, fontWeight: 800, color: X.text }}>{currency}{rate.toFixed(2)}</M>
        <M style={{ fontSize: 9, color: X.textMut }}>/kWh</M>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div><Lbl style={{ marginBottom: 2 }}>Today</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.amber }}>{currency}{dailyCost.toFixed(2)}</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Monthly</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.textSec }}>{currency}{Math.round(monthlyCost)}</M></div>
      </div>
      <Lbl style={{ marginBottom: 6 }}>Pricing Periods</Lbl>
      {periods.map((p, i) => (
        <button key={i} onClick={() => setPeriod(p.id)} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px',
          borderRadius: X.rs, border: `1px solid ${period === p.id ? p.color + '30' : 'transparent'}`,
          background: period === p.id ? p.color + '0c' : 'transparent', cursor: 'pointer', marginBottom: 1,
          transition: `background-color 180ms, border-color 180ms`,
        }}>
          <Dot c={p.color} s={5} />
          <M style={{ fontSize: 9, flex: 1, color: X.text, textAlign: 'left' }}>{p.name}</M>
          <M style={{ fontSize: 8, color: X.textMut }}>{p.hours}</M>
          <M style={{ fontSize: 9, fontWeight: 700, color: p.color }}>{p.rate}</M>
        </button>
      ))}
    </Card>
  );
}
