import { useState, useMemo } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot, Prog, Gauge as GaugePrimitive } from '../primitives';
import { useAnim, useLive } from '../hooks';

// ── KPI Card ──────────────────────────────────────────────────────────
export function KPI({ value = 1247, prev = 1180, label = 'Devices Online', color, delay = 0 }: {
  value?: number; prev?: number; label?: string; color?: string; delay?: number;
}) {
  const X = getX();
  const c = color ?? X.purple;
  const a = useAnim(value, 1200);
  const delta = prev ? (((value - prev) / prev) * 100).toFixed(1) : 0;
  const up = value >= prev;
  const spark = useMemo(() => Array.from({ length: 20 }, (_, i) => prev + (value - prev) * (i / 19) + (Math.random() - 0.5) * value * 0.08), [value, prev]);
  const mn = Math.min(...spark), mx = Math.max(...spark);
  const pts = spark.map((v, i) => `${(i / 19) * 100},${100 - ((v - mn) / (mx - mn || 1)) * 100}`).join(' ');
  return (
    <Card delay={delay} glow={c} style={{ flex: '1 1 180px', minWidth: 165 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <Lbl>{label}</Lbl>
        <Badge color={up ? X.teal : X.red}>{up ? '▲' : '▼'} {Math.abs(Number(delta))}%</Badge>
      </div>
      <M style={{ fontSize: 26, fontWeight: 800, color: X.text, display: 'block', marginBottom: 6, letterSpacing: '-.02em', animation: `cu 400ms ${ease.o} ${delay + 150}ms both` }}>{Math.round(a).toLocaleString()}</M>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 28, overflow: 'hidden' }}>
        <defs><linearGradient id={`sk-${label}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={c} stopOpacity=".25" /><stop offset="100%" stopColor={c} stopOpacity="0" /></linearGradient></defs>
        <polygon points={`0,100 ${pts} 100,100`} fill={`url(#sk-${label})`} />
        <polyline points={pts} fill="none" stroke={c} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
    </Card>
  );
}

// ── Device Status Card ────────────────────────────────────────────────
export function DeviceCard({ name = 'NEC PA804UL', type = 'Projector', status = 'online', signal = 95, ip = '192.168.1.42', fw = 'v4.2.1', temp = 42, delay = 0 }: {
  name?: string; type?: string; status?: string; signal?: number; ip?: string; fw?: string; temp?: number; delay?: number;
}) {
  const X = getX();
  const sc: Record<string, string> = { online: X.teal, warning: X.amber, error: X.red, offline: X.textMut };
  const c = sc[status] ?? X.textMut;
  const icons: Record<string, JSX.Element> = {
    Projector: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="7" cy="12" r="3" /><line x1="15" y1="10" x2="19" y2="10" /><line x1="15" y1="14" x2="19" y2="14" /></svg>,
    Display: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>,
    Camera: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>,
    Speaker: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polygon points="11,5 6,9 2,9 2,15 6,15 11,19" /><path d="M15.54 8.46a5 5 0 010 7.07" /></svg>,
  };
  return (
    <Card delay={delay} style={{ width: 350 }}>
      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: X.rs, background: c + '12', border: `1px solid ${c}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icons[type] || icons.Projector}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: X.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
          <M style={{ fontSize: 9, color: X.textSec }}>{type}</M>
        </div>
        <Dot c={c} pulse={status === 'online'} s={7} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 6, marginBottom: 8 }}>
        {([['Signal', signal + '%', signal > 80 ? X.teal : signal > 40 ? X.amber : X.red], ['Temp', temp + '°', temp > 60 ? X.red : temp > 45 ? X.amber : X.teal], ['FW', fw, X.textSec], ['IP', ip.split('.').slice(-1)[0], X.textMut]] as [string, string, string][]).map(([l, v, vc], i) => (
          <div key={i}><Lbl style={{ marginBottom: 2 }}>{l}</Lbl><M style={{ fontSize: 10, fontWeight: 600, color: vc }}>{v}</M></div>
        ))}
      </div>
      <Prog value={signal} color={c} h={2} />
    </Card>
  );
}

// ── Radial Gauge ──────────────────────────────────────────────────────
export function Gauge({ value = 72, max = 100, label = 'CPU', unit = '%', color, size = 88 }: {
  value?: number; max?: number; label?: string; unit?: string; color?: string; size?: number;
}) {
  const X = getX();
  const c = color ?? X.purple;
  const a = useAnim(value);
  const r = (size - 12) / 2, circ = 2 * Math.PI * r, range = 260;
  const pct = Math.min(a / max, 1), off = circ - (pct * range / 360) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <div style={{ width: size, height: size, position: 'relative', overflow: 'hidden' }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={X.borderLight} strokeWidth={4} strokeDasharray={`${circ * range / 360} ${circ * (1 - range / 360)}`} strokeLinecap="round" transform={`rotate(140 ${size / 2} ${size / 2})`} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c} strokeWidth={4} strokeDasharray={`${circ * range / 360} ${circ * (1 - range / 360)}`} strokeDashoffset={off} strokeLinecap="round" transform={`rotate(140 ${size / 2} ${size / 2})`} style={{ transition: `stroke-dashoffset 800ms ${ease.mv}`, filter: `drop-shadow(0 0 4px ${c}40)` }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <M style={{ fontSize: size * 0.24, fontWeight: 800, color: X.text }}>{Math.round(a)}</M>
          <M style={{ fontSize: 7, color: X.textMut }}>{unit}</M>
        </div>
      </div>
      <Lbl>{label}</Lbl>
    </div>
  );
}

// ── Device Inventory Table ────────────────────────────────────────────
export function DeviceTable({ title = 'Device Inventory', maxRows = 8 }: {
  title?: string; maxRows?: number;
}) {
  const X = getX();
  const allDevices = [
    { n: 'NEC PA804UL', t: 'Projector', s: 'online', ip: '.42' },
    { n: 'Samsung QM85R', t: 'Display', s: 'warning', ip: '.43' },
    { n: 'Shure MXA920', t: 'Mic Array', s: 'online', ip: '.44' },
    { n: 'QSC Core 110f', t: 'DSP', s: 'online', ip: '.45' },
    { n: 'PTZ Optics 30X', t: 'Camera', s: 'error', ip: '.46' },
    { n: 'Crestron DM-NVX', t: 'Encoder', s: 'online', ip: '.47' },
    { n: 'Biamp TesiraFORTÉ', t: 'DSP', s: 'online', ip: '.48' },
    { n: 'BrightSign XC5', t: 'Player', s: 'offline', ip: '.49' },
  ];
  const devices = allDevices.slice(0, maxRows);
  const sc: Record<string, string> = { online: X.teal, warning: X.amber, error: X.red, offline: X.textMut };
  return (
    <Card noPad style={{ width: 420 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}>{devices.length} devices</Badge>
      </div>
      <div style={{ padding: '0 6px 6px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 60px 50px', gap: 4, padding: '4px 8px', borderBottom: `1px solid ${X.borderLight}` }}>
          {['Device', 'Type', 'Status', 'IP'].map(h => <Lbl key={h}>{h}</Lbl>)}
        </div>
        {devices.map((d, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 60px 50px', gap: 4, padding: '5px 8px', borderRadius: 3, background: i % 2 === 0 ? X.bgAlt : 'transparent', animation: `sr 120ms ${ease.o} ${i * 15}ms both` }}>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.text }}>{d.n}</M>
            <M style={{ fontSize: 9, color: X.textSec }}>{d.t}</M>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Dot c={sc[d.s]} s={4} /><M style={{ fontSize: 8, color: sc[d.s] }}>{d.s}</M></div>
            <M style={{ fontSize: 9, color: X.textMut }}>{d.ip}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Uptime Timeline ───────────────────────────────────────────────────
export function UptimeTimeline({ title = '30-Day Uptime', days: dayCount = 30 }: {
  title?: string; days?: number;
}) {
  const X = getX();
  const days = useMemo(() => Array.from({ length: dayCount }, () => Math.random() > 0.08 ? (Math.random() > 0.15 ? 100 : 60 + Math.random() * 30) : Math.random() * 40), [dayCount]);
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <Lbl>{title}</Lbl>
        <M style={{ fontSize: 10, color: X.teal, fontWeight: 700 }}>99.2%</M>
      </div>
      <div style={{ display: 'flex', gap: 1.5, alignItems: 'flex-end', height: 24 }}>
        {days.map((v, i) => <div key={i} style={{ flex: 1, height: `${(v / 100) * 22}px`, borderRadius: 1, background: v > 95 ? X.teal : v > 70 ? X.amber : X.red, opacity: 0.4 + (v / 100) * 0.6 }} />)}
      </div>
    </Card>
  );
}
