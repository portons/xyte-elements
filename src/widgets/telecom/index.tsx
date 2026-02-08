import { useState, useMemo } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot, Prog } from '../primitives';
import { useAnim, useTick } from '../hooks';

// ── Cell Tower ──────────────────────────────────────────────────────
export function CellTower({ title = 'Cell Towers', signalWarning = -85 }: { title?: string; signalWarning?: number }) {
  const X = getX();

  const towers = useMemo(() => [
    { id: 'TWR-4401', loc: 'Downtown West', sectors: 3, dbm: -68, status: 'active' },
    { id: 'TWR-4402', loc: 'Industrial Park', sectors: 6, dbm: -74, status: 'active' },
    { id: 'TWR-4403', loc: 'Highway Corridor', sectors: 3, dbm: -82, status: 'degraded' },
    { id: 'TWR-4404', loc: 'Harbor District', sectors: 4, dbm: -71, status: 'active' },
    { id: 'TWR-4405', loc: 'Suburban North', sectors: 3, dbm: -95, status: 'offline' },
    { id: 'TWR-4406', loc: 'Airport Zone', sectors: 6, dbm: -66, status: 'active' },
  ], []);

  const signals = [
    towers[0].dbm,
    towers[1].dbm,
    towers[2].dbm,
    towers[3].dbm,
    towers[4].dbm,
    towers[5].dbm,
  ];

  const sc: Record<string, string> = { active: X.teal, degraded: X.amber, offline: X.red };
  const signalColor = (dbm: number) => dbm > -75 ? X.teal : dbm > signalWarning ? X.amber : X.red;
  const activeCount = towers.filter(t => t.status === 'active').length;

  return (
    <Card noPad style={{ width: 420 }} glow={X.teal}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{activeCount}/{towers.length} Active</Badge>
      </div>
      <div style={{ padding: '0 6px 6px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '68px 1fr 50px 66px 64px', gap: 4, padding: '4px 8px', borderBottom: `1px solid ${X.borderLight}` }}>
          {['Tower ID', 'Location', 'Sectors', 'Signal', 'Status'].map(h => <Lbl key={h}>{h}</Lbl>)}
        </div>
        {towers.map((t, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '68px 1fr 50px 66px 64px', gap: 4, padding: '5px 8px', borderRadius: 3, background: i % 2 === 0 ? X.bgAlt : 'transparent', alignItems: 'center', animation: `sr 120ms ${ease.o} ${i * 15}ms both` }}>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.purple }}>{t.id}</M>
            <M style={{ fontSize: 8, color: X.textSec, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.loc}</M>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.text, textAlign: 'center' }}>{t.sectors}</M>
            <M style={{ fontSize: 9, fontWeight: 600, color: signalColor(signals[i]) }}>{Math.round(signals[i])} dBm</M>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Dot c={sc[t.status]} pulse={t.status === 'active'} s={5} />
              <M style={{ fontSize: 8, color: sc[t.status] }}>{t.status}</M>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Spectrum Analyzer ───────────────────────────────────────────────
export function SpectrumAnalyzer({ title = 'Spectrum Analyzer', binCount = 32 }: { title?: string; binCount?: number }) {
  const X = getX();
  const tick = useTick(800);

  const bins = useMemo(() =>
    Array.from({ length: binCount }, (_, i) => ({
      freq: 3400 + i * (400 / binCount),
      amp: -40 - Math.random() * 50,
    })), [binCount]);

  const liveBins = useMemo(() => {
    return bins.map(b => ({
      ...b,
      amp: b.amp + (Math.random() - 0.5) * 15,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const peakPower = Math.max(...liveBins.map(b => b.amp));
  const centerFreq = 3600;
  const bandwidth = 400;

  return (
    <Card style={{ width: 400 }} glow={X.purple}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}><Dot c={X.purple} pulse s={4} />Live</Badge>
      </div>

      {/* Frequency bars */}
      <div style={{ padding: '6px 0', borderRadius: X.rs, background: X.bg, border: `1px solid ${X.borderLight}`, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 80, padding: '0 8px' }}>
          {liveBins.map((b, i) => {
            const norm = ((b.amp + 90) / 50) * 100;
            const h = Math.max(2, Math.min(100, norm));
            const c = h > 70 ? X.red : h > 45 ? X.amber : X.purple;
            return (
              <div key={i} style={{
                flex: 1, height: `${h}%`, borderRadius: 2,
                background: `linear-gradient(to top, ${c}40, ${c})`,
                transition: `height 400ms ${ease.mv}`,
                boxShadow: h > 70 ? `0 0 4px ${c}40` : 'none',
              }} />
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px 0' }}>
          <M style={{ fontSize: 7, color: X.textMut }}>3400 MHz</M>
          <M style={{ fontSize: 7, color: X.textMut }}>3800 MHz</M>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <Lbl style={{ marginBottom: 2 }}>Center Freq</Lbl>
          <M style={{ fontSize: 12, fontWeight: 700, color: X.text }}>{centerFreq} MHz</M>
        </div>
        <div style={{ flex: 1 }}>
          <Lbl style={{ marginBottom: 2 }}>Bandwidth</Lbl>
          <M style={{ fontSize: 12, fontWeight: 700, color: X.indigo }}>{bandwidth} MHz</M>
        </div>
        <div style={{ flex: 1 }}>
          <Lbl style={{ marginBottom: 2 }}>Peak Power</Lbl>
          <M style={{ fontSize: 12, fontWeight: 700, color: X.amber }}>{peakPower.toFixed(1)} dBm</M>
        </div>
      </div>
    </Card>
  );
}

// ── Subscriber Metrics ──────────────────────────────────────────────
export function SubscriberMetrics({ title = 'Subscribers', arpu = 42.50, activeSessions }: { title?: string; arpu?: number; activeSessions: number }) {
  const X = getX();

  const totalSubs = 2847530;
  const animSubs = useAnim(totalSubs, 1400);
  const churnRate = 1.8;

  const trendData = useMemo(() =>
    Array.from({ length: 24 }, (_, i) => 2780000 + Math.sin(i / 4) * 30000 + Math.random() * 15000), []);

  const tMin = Math.min(...trendData), tMax = Math.max(...trendData);
  const sparkPts = trendData.map((v, i) => `${(i / 23) * 100},${100 - ((v - tMin) / (tMax - tMin)) * 75 - 10}`).join(' ');

  const prepaid = 1240000;
  const postpaid = 1380000;
  const enterprise = 227530;

  return (
    <Card style={{ width: 370 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>+2.4% MoM</Badge>
      </div>

      {/* Big number */}
      <div style={{ marginBottom: 8 }}>
        <M style={{ fontSize: 28, fontWeight: 800, color: X.text, letterSpacing: '-.02em' }}>{Math.round(animSubs).toLocaleString()}</M>
        <M style={{ fontSize: 9, color: X.textMut, marginLeft: 4 }}>total subscribers</M>
      </div>

      {/* KPIs row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <div style={{ flex: 1, padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
          <Lbl style={{ marginBottom: 2 }}>Active Sessions</Lbl>
          <M style={{ fontSize: 11, fontWeight: 700, color: X.teal }}>{Math.round(activeSessions).toLocaleString()}</M>
        </div>
        <div style={{ flex: 1, padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
          <Lbl style={{ marginBottom: 2 }}>Churn Rate</Lbl>
          <M style={{ fontSize: 11, fontWeight: 700, color: X.amber }}>{churnRate}%</M>
        </div>
        <div style={{ flex: 1, padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
          <Lbl style={{ marginBottom: 2 }}>ARPU</Lbl>
          <M style={{ fontSize: 11, fontWeight: 700, color: X.purple }}>${arpu.toFixed(2)}</M>
        </div>
      </div>

      {/* 24h sparkline */}
      <div style={{ marginBottom: 10 }}>
        <Lbl style={{ marginBottom: 4 }}>24-Hour Subscriber Trend</Lbl>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 36, overflow: 'hidden' }}>
          <defs><linearGradient id="sub-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={X.teal} stopOpacity=".15" /><stop offset="100%" stopColor={X.teal} stopOpacity="0" /></linearGradient></defs>
          <polygon points={`0,100 ${sparkPts} 100,100`} fill="url(#sub-g)" />
          <polyline points={sparkPts} fill="none" stroke={X.teal} strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={{ filter: `drop-shadow(0 0 2px ${X.teal}40)` }} />
        </svg>
      </div>

      {/* Segment breakdown */}
      <div style={{ display: 'flex', gap: 6 }}>
        {([
          { label: 'Prepaid', count: prepaid, color: X.teal },
          { label: 'Postpaid', count: postpaid, color: X.indigo },
          { label: 'Enterprise', count: enterprise, color: X.purple },
        ] as const).map((s, i) => (
          <div key={i} style={{ flex: 1, padding: '6px 8px', borderRadius: X.rs, background: s.color + '0a', border: `1px solid ${s.color}20`, textAlign: 'center', animation: `fu 150ms ${ease.o} ${i * 25}ms both` }}>
            <Lbl style={{ marginBottom: 2, color: s.color }}>{s.label}</Lbl>
            <M style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{(s.count / 1000000).toFixed(2)}M</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Network Slicing ─────────────────────────────────────────────────
export function NetworkSlicing({ title = '5G Network Slices', slaTarget = 99 }: { title?: string; slaTarget?: number }) {
  const X = getX();

  const slices = useMemo(() => [
    { name: 'eMBB', desc: 'Enhanced Mobile Broadband', sla: 99.2, throughput: '4.8 Gbps', latBase: 8 },
    { name: 'URLLC', desc: 'Ultra-Reliable Low Latency', sla: 99.99, throughput: '1.2 Gbps', latBase: 1.2 },
    { name: 'mMTC', desc: 'Massive Machine Type Comms', sla: 97.8, throughput: '850 Mbps', latBase: 22 },
    { name: 'V2X', desc: 'Vehicle-to-Everything', sla: 99.5, throughput: '2.1 Gbps', latBase: 3.5 },
  ], []);

  const latencies = [
    slices[0].latBase,
    slices[1].latBase,
    slices[2].latBase,
    slices[3].latBase,
  ];

  const slaColor = (v: number) => v >= slaTarget + 0.5 ? X.teal : v >= slaTarget - 1 ? X.amber : X.red;

  return (
    <Card style={{ width: 380 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>4 Active</Badge>
      </div>
      {slices.map((s, i) => {
        const c = slaColor(s.sla);
        return (
          <div key={i} style={{ padding: '8px 0', borderBottom: i < slices.length - 1 ? `1px solid ${X.borderLight}` : 'none', animation: `fu 150ms ${ease.o} ${i * 20}ms both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div>
                <M style={{ fontSize: 11, fontWeight: 700, color: X.text }}>{s.name}</M>
                <M style={{ fontSize: 8, color: X.textMut, marginLeft: 6 }}>{s.desc}</M>
              </div>
              <Badge color={c}>{s.sla}% SLA</Badge>
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 5 }}>
              <div><Lbl style={{ marginBottom: 1 }}>Throughput</Lbl><M style={{ fontSize: 9, fontWeight: 600, color: X.indigo }}>{s.throughput}</M></div>
              <div><Lbl style={{ marginBottom: 1 }}>Latency</Lbl><M style={{ fontSize: 9, fontWeight: 600, color: latencies[i] > 15 ? X.amber : X.teal }}>{latencies[i].toFixed(1)} ms</M></div>
              <div><Lbl style={{ marginBottom: 1 }}>Compliance</Lbl><M style={{ fontSize: 9, fontWeight: 600, color: c }}>{s.sla >= 99 ? 'Met' : 'At Risk'}</M></div>
            </div>
            <Prog value={s.sla} color={c} h={2} />
          </div>
        );
      })}
    </Card>
  );
}

// ── SIM Inventory ───────────────────────────────────────────────────
export function SIMInventory({ title = 'SIM Inventory', dataWarning = 80 }: { title?: string; dataWarning?: number }) {
  const X = getX();

  const sims = useMemo(() => [
    { iccid: '8901260882168430041', type: 'eSIM', status: 'active', usage: 72, device: 'iPhone 15 Pro' },
    { iccid: '8901260114520091837', type: 'physical', status: 'active', usage: 45, device: 'IoT Gateway M3' },
    { iccid: '8901260930447281556', type: 'eSIM', status: 'suspended', usage: 0, device: 'Tablet A9' },
    { iccid: '8901260776831994012', type: 'physical', status: 'available', usage: 0, device: '—' },
    { iccid: '8901260441095528369', type: 'eSIM', status: 'active', usage: 88, device: 'Fleet Tracker V2' },
    { iccid: '8901260553678210483', type: 'physical', status: 'active', usage: 31, device: 'Smart Meter R4' },
  ], []);

  const sc: Record<string, string> = { active: X.teal, suspended: X.amber, available: X.purple };
  const activeCount = sims.filter(s => s.status === 'active').length;

  return (
    <Card noPad style={{ width: 440 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <Badge color={X.teal}>{activeCount} Active</Badge>
          <Badge color={X.purple}>{sims.length} Total</Badge>
        </div>
      </div>
      <div style={{ padding: '0 6px 6px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '100px 54px 64px 50px 1fr', gap: 4, padding: '4px 8px', borderBottom: `1px solid ${X.borderLight}` }}>
          {['ICCID', 'Type', 'Status', 'Data %', 'Device'].map(h => <Lbl key={h}>{h}</Lbl>)}
        </div>
        {sims.map((s, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '100px 54px 64px 50px 1fr', gap: 4, padding: '5px 8px', borderRadius: 3, background: i % 2 === 0 ? X.bgAlt : 'transparent', alignItems: 'center', animation: `sr 120ms ${ease.o} ${i * 15}ms both` }}>
            <M style={{ fontSize: 8, fontWeight: 600, color: X.purple, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.iccid.slice(0, 10)}...</M>
            <Badge color={s.type === 'eSIM' ? X.indigo : X.textSec}>{s.type}</Badge>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Dot c={sc[s.status]} pulse={s.status === 'active'} s={5} />
              <M style={{ fontSize: 8, color: sc[s.status] }}>{s.status}</M>
            </div>
            <M style={{ fontSize: 9, fontWeight: 600, color: s.usage > dataWarning ? X.red : s.usage > 50 ? X.amber : X.teal }}>{s.usage > 0 ? `${s.usage}%` : '—'}</M>
            <M style={{ fontSize: 8, color: s.device === '—' ? X.textMut : X.textSec, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.device}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Call Quality ────────────────────────────────────────────────────
export function CallQuality({ title = 'Call Quality', mosTarget = 4, mos, jitter, latency, packetLoss }: { title?: string; mosTarget?: number; mos: number; jitter: number; latency: number; packetLoss: number }) {
  const X = getX();

  const mosColor = mos >= mosTarget ? X.teal : mos >= mosTarget - 1 ? X.amber : X.red;
  const mosLabel = mos >= mosTarget ? 'Excellent' : mos >= mosTarget - 1 ? 'Fair' : 'Poor';

  // Semicircular gauge: arc from -180 to 0 degrees
  const mosClamped = Math.max(1, Math.min(5, mos));
  const mosPct = ((mosClamped - 1) / 4) * 100;
  // Arc path: 180 degree arc, radius 40, center at 50,50
  const arcLen = Math.PI * 40; // half-circumference

  return (
    <Card style={{ width: 370 }} glow={X.indigo}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={mosColor}>{mosLabel}</Badge>
      </div>

      {/* MOS Gauge */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <svg viewBox="0 0 100 58" style={{ width: '100%', maxWidth: 220, height: 'auto', display: 'block', overflow: 'visible' }}>
          {/* Background arc */}
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={X.borderLight} strokeWidth={5} strokeLinecap="round" />
          {/* Value arc */}
          <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke={mosColor} strokeWidth={5} strokeLinecap="round"
            strokeDasharray={`${(mosPct / 100) * arcLen} ${arcLen}`}
            style={{ transition: `stroke-dasharray 500ms ${ease.sp}, stroke 400ms ${ease.mv}`, filter: `drop-shadow(0 0 4px ${mosColor}50)` }}
          />
          {/* MOS value */}
          <text x="50" y="40" textAnchor="middle" fontFamily={X.m} fontSize="18" fontWeight="800" fill={mosColor}>{mos.toFixed(1)}</text>
          <text x="50" y="52" textAnchor="middle" fontFamily={X.m} fontSize="5" fill={X.textMut}>MOS SCORE</text>
          {/* Scale labels */}
          <text x="8" y="56" textAnchor="middle" fontFamily={X.m} fontSize="4" fill={X.textMut}>1</text>
          <text x="92" y="56" textAnchor="middle" fontFamily={X.m} fontSize="4" fill={X.textMut}>5</text>
        </svg>
      </div>

      {/* Metrics grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        <div style={{ padding: '8px 8px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center', animation: `fu 150ms ${ease.o} 0ms both` }}>
          <Lbl style={{ marginBottom: 3 }}>Jitter</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: jitter > 20 ? X.red : jitter > 10 ? X.amber : X.teal }}>{jitter.toFixed(1)}</M>
          <M style={{ fontSize: 8, color: X.textMut, display: 'block' }}>ms</M>
        </div>
        <div style={{ padding: '8px 8px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center', animation: `fu 150ms ${ease.o} 25ms both` }}>
          <Lbl style={{ marginBottom: 3 }}>Latency</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: latency > 50 ? X.red : latency > 30 ? X.amber : X.teal }}>{Math.round(latency)}</M>
          <M style={{ fontSize: 8, color: X.textMut, display: 'block' }}>ms</M>
        </div>
        <div style={{ padding: '8px 8px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center', animation: `fu 150ms ${ease.o} 50ms both` }}>
          <Lbl style={{ marginBottom: 3 }}>Pkt Loss</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: packetLoss > 1 ? X.red : packetLoss > 0.5 ? X.amber : X.teal }}>{Math.max(0, packetLoss).toFixed(2)}</M>
          <M style={{ fontSize: 8, color: X.textMut, display: 'block' }}>%</M>
        </div>
      </div>
    </Card>
  );
}
