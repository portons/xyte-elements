import { useState, useMemo } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot, Prog } from '../primitives';
import { useAnim, useLive, useTick } from '../hooks';

// ── Vessel Tracker ──────────────────────────────────────────────────
export function VesselTracker({ title = 'Vessel Tracker', speedUnit = 'kn' }: { title?: string; speedUnit?: string }) {
  const X = getX();

  const vessels = useMemo(() => [
    { name: 'MV Pacific Star', imo: '9284057', type: 'container', hdgBase: 142, spdBase: 14.2, eta: '14:30', status: 'underway' },
    { name: 'NS Meridian', imo: '9510382', type: 'tanker', hdgBase: 278, spdBase: 11.8, eta: '08:15', status: 'underway' },
    { name: 'CMA Horizon', imo: '9773641', type: 'container', hdgBase: 90, spdBase: 0, eta: '—', status: 'berthed' },
    { name: 'MV Iron Duke', imo: '9418295', type: 'cargo', hdgBase: 315, spdBase: 0, eta: '—', status: 'anchored' },
    { name: 'Orinoco Express', imo: '9651804', type: 'tanker', hdgBase: 195, spdBase: 12.5, eta: '22:45', status: 'underway' },
    { name: 'Jade Fortune', imo: '9832176', type: 'cargo', hdgBase: 58, spdBase: 8.1, eta: '11:00', status: 'underway' },
  ], []);

  const headings = [
    useLive(vessels[0].hdgBase, 5, 2500),
    useLive(vessels[1].hdgBase, 4, 2800),
    useLive(vessels[2].hdgBase, 0, 3000),
    useLive(vessels[3].hdgBase, 2, 3200),
    useLive(vessels[4].hdgBase, 6, 2200),
    useLive(vessels[5].hdgBase, 3, 2600),
  ];

  const speeds = [
    useLive(vessels[0].spdBase, 1.5, 2000),
    useLive(vessels[1].spdBase, 1.2, 2200),
    useLive(vessels[2].spdBase, 0, 3000),
    useLive(vessels[3].spdBase, 0, 3000),
    useLive(vessels[4].spdBase, 1.8, 2400),
    useLive(vessels[5].spdBase, 1.0, 2600),
  ];

  const sc: Record<string, string> = { underway: X.teal, anchored: X.amber, berthed: X.purple };
  const tc: Record<string, string> = { container: X.indigo, tanker: X.amber, cargo: X.teal };
  const underwayCount = vessels.filter(v => v.status === 'underway').length;

  return (
    <Card noPad style={{ width: 460 }} glow={X.indigo}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{underwayCount} Underway</Badge>
      </div>
      <div style={{ padding: '0 6px 6px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 56px 44px 50px 40px 60px', gap: 4, padding: '4px 8px', borderBottom: `1px solid ${X.borderLight}` }}>
          {['Vessel', 'IMO', 'Type', 'Hdg', 'Speed', 'ETA', 'Status'].map(h => <Lbl key={h}>{h}</Lbl>)}
        </div>
        {vessels.map((v, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 56px 44px 50px 40px 60px', gap: 4, padding: '5px 8px', borderRadius: 3, background: i % 2 === 0 ? X.bgAlt : 'transparent', alignItems: 'center', animation: `sr 120ms ${ease.o} ${i * 15}ms both` }}>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name}</M>
            <M style={{ fontSize: 8, color: X.textMut }}>{v.imo}</M>
            <Badge color={tc[v.type]}>{v.type}</Badge>
            <M style={{ fontSize: 9, fontWeight: 600, color: v.status === 'underway' ? X.text : X.textMut }}>{Math.round(headings[i])}&deg;</M>
            <M style={{ fontSize: 9, fontWeight: 600, color: v.status === 'underway' ? X.teal : X.textMut }}>{Math.max(0, speeds[i]).toFixed(1)} {speedUnit}</M>
            <M style={{ fontSize: 8, color: v.eta === '—' ? X.textMut : X.purple }}>{v.eta}</M>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Dot c={sc[v.status]} pulse={v.status === 'underway'} s={5} />
              <M style={{ fontSize: 7, color: sc[v.status] }}>{v.status}</M>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Container Yard ──────────────────────────────────────────────────
export function ContainerYard({ title = 'Container Yard', capacityWarning = 90 }: { title?: string; capacityWarning?: number }) {
  const X = getX();

  const blocks = useMemo(() => [
    { name: 'A1', capacity: 82, containers: 164, maxContainers: 200 },
    { name: 'A2', capacity: 45, containers: 90, maxContainers: 200 },
    { name: 'A3', capacity: 91, containers: 182, maxContainers: 200 },
    { name: 'A4', capacity: 67, containers: 134, maxContainers: 200 },
    { name: 'A5', capacity: 38, containers: 76, maxContainers: 200 },
    { name: 'A6', capacity: 94, containers: 188, maxContainers: 200 },
  ], []);

  const capAnims = [
    useAnim(blocks[0].capacity, 1200),
    useAnim(blocks[1].capacity, 1200),
    useAnim(blocks[2].capacity, 1200),
    useAnim(blocks[3].capacity, 1200),
    useAnim(blocks[4].capacity, 1200),
    useAnim(blocks[5].capacity, 1200),
  ];

  const capColor = (v: number) => v >= capacityWarning ? X.red : v >= capacityWarning - 20 ? X.amber : X.teal;
  const totalContainers = blocks.reduce((a, b) => a + b.containers, 0);
  const avgCap = Math.round(blocks.reduce((a, b) => a + b.capacity, 0) / blocks.length);

  return (
    <Card style={{ width: 380 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <M style={{ fontSize: 16, fontWeight: 800, color: capColor(avgCap) }}>{avgCap}%</M>
          <M style={{ fontSize: 8, color: X.textMut }}>avg</M>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 10 }}>
        {blocks.map((b, i) => {
          const c = capColor(b.capacity);
          return (
            <div key={i} style={{
              padding: '10px 8px', borderRadius: X.rs,
              background: c + '08', border: `1px solid ${c}20`,
              textAlign: 'center',
              animation: `fu 150ms ${ease.o} ${i * 25}ms both`,
            }}>
              <M style={{ fontSize: 14, fontWeight: 800, color: X.text, display: 'block', marginBottom: 4 }}>{b.name}</M>
              <Prog value={capAnims[i]} color={c} h={3} style={{ marginBottom: 4 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <M style={{ fontSize: 8, color: X.textMut }}>{b.containers} TEU</M>
                <M style={{ fontSize: 9, fontWeight: 700, color: c }}>{Math.round(capAnims[i])}%</M>
              </div>
              <Dot c={c} pulse={b.capacity >= 90} s={5} />
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 1 }}>Total TEU</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.text }}>{totalContainers.toLocaleString()}</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 1 }}>Blocks</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.indigo }}>{blocks.length}</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 1 }}>Max Capacity</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.purple }}>{blocks.length * 200} TEU</M></div>
      </div>
    </Card>
  );
}

// ── Tide Monitor ────────────────────────────────────────────────────
export function TideMonitor({ title = 'Tide Monitor', depthUnit = 'meters' }: { title?: string; depthUnit?: string }) {
  const X = getX();

  const tideLevel = useLive(3.8, 0.4, 2000);
  const highTide = '14:22';
  const lowTide = '08:47';
  const nextHigh = '20:38';
  const tidalRange = 4.2;

  // 24h tide prediction (sinusoidal approximation)
  const tideCurve = useMemo(() =>
    Array.from({ length: 48 }, (_, i) => {
      const t = i / 48;
      return 2.0 + 2.1 * Math.sin(t * 2 * Math.PI * 2 - 0.8) + Math.random() * 0.15;
    }), []);

  const tMin = Math.min(...tideCurve), tMax = Math.max(...tideCurve);
  const sparkPts = tideCurve.map((v, i) => `${(i / 47) * 100},${100 - ((v - tMin) / (tMax - tMin)) * 75 - 10}`).join(' ');

  const levelColor = tideLevel > 4.5 ? X.amber : tideLevel < 1.5 ? X.red : X.teal;

  return (
    <Card style={{ width: 370 }} glow={X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}><Dot c={X.teal} pulse s={4} />Live</Badge>
      </div>

      {/* Big tide level */}
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <M style={{ fontSize: 36, fontWeight: 800, color: levelColor, letterSpacing: '-.03em' }}>{tideLevel.toFixed(1)}</M>
        <M style={{ fontSize: 10, color: X.textMut, marginLeft: 4 }}>{depthUnit}</M>
        <div style={{ marginTop: 2 }}>
          <Badge color={levelColor}>{tideLevel > 3.5 ? 'Rising' : 'Falling'}</Badge>
        </div>
      </div>

      {/* Tide curve SVG */}
      <div style={{ marginBottom: 10, padding: '4px 0', borderRadius: X.rs, background: X.bg, border: `1px solid ${X.borderLight}` }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 50, overflow: 'hidden' }}>
          <defs><linearGradient id="tide-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={X.teal} stopOpacity=".12" /><stop offset="100%" stopColor={X.teal} stopOpacity="0" /></linearGradient></defs>
          <polygon points={`0,100 ${sparkPts} 100,100`} fill="url(#tide-g)" />
          <polyline points={sparkPts} fill="none" stroke={X.teal} strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={{ filter: `drop-shadow(0 0 2px ${X.teal}40)` }} />
          {/* Current time indicator ~ 40% through the day */}
          <line x1="40" y1="5" x2="40" y2="95" stroke={X.amber} strokeWidth=".5" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" opacity=".6" />
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px 0' }}>
          <M style={{ fontSize: 7, color: X.textMut }}>00:00</M>
          <M style={{ fontSize: 7, color: X.amber }}>Now</M>
          <M style={{ fontSize: 7, color: X.textMut }}>24:00</M>
        </div>
      </div>

      {/* Bottom stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {([
          { label: 'Current', value: `${tideLevel.toFixed(1)}m`, color: levelColor },
          { label: 'Next High', value: nextHigh, color: X.teal },
          { label: 'Next Low', value: lowTide, color: X.amber },
          { label: 'Range', value: `${tidalRange}m`, color: X.indigo },
        ] as const).map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', animation: `fu 150ms ${ease.o} ${i * 20}ms both` }}>
            <Lbl style={{ marginBottom: 2 }}>{s.label}</Lbl>
            <M style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.value}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Crane Ops ───────────────────────────────────────────────────────
export function CraneOps({ title = 'Quay Cranes', efficiencyTarget = 90 }: { title?: string; efficiencyTarget?: number }) {
  const X = getX();

  const cranes = useMemo(() => [
    { id: 'QC-01', status: 'operating', liftsBase: 142, loadBase: 38, efficiency: 94 },
    { id: 'QC-02', status: 'operating', liftsBase: 118, loadBase: 42, efficiency: 88 },
    { id: 'QC-03', status: 'idle', liftsBase: 0, loadBase: 0, efficiency: 0 },
    { id: 'QC-04', status: 'maintenance', liftsBase: 67, loadBase: 0, efficiency: 72 },
  ], []);

  const liftsAnims = [
    useAnim(cranes[0].liftsBase, 1400),
    useAnim(cranes[1].liftsBase, 1400),
    useAnim(cranes[2].liftsBase, 1400),
    useAnim(cranes[3].liftsBase, 1400),
  ];

  const loads = [
    useLive(cranes[0].loadBase, 6, 1500),
    useLive(cranes[1].loadBase, 8, 1800),
    useLive(cranes[2].loadBase, 0, 3000),
    useLive(cranes[3].loadBase, 0, 3000),
  ];

  const sc: Record<string, string> = { operating: X.teal, idle: X.amber, maintenance: X.red };
  const operatingCount = cranes.filter(c => c.status === 'operating').length;

  return (
    <Card style={{ width: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{operatingCount}/{cranes.length} Operating</Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {cranes.map((c, i) => (
          <div key={i} style={{
            padding: '10px 10px', borderRadius: X.rs,
            background: X.bgAlt, border: `1px solid ${sc[c.status]}20`,
            animation: `fu 150ms ${ease.o} ${i * 25}ms both`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <M style={{ fontSize: 12, fontWeight: 800, color: X.text }}>{c.id}</M>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Dot c={sc[c.status]} pulse={c.status === 'operating'} s={5} />
                <M style={{ fontSize: 8, color: sc[c.status] }}>{c.status}</M>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div>
                <Lbl style={{ marginBottom: 1 }}>Lifts Today</Lbl>
                <M style={{ fontSize: 14, fontWeight: 700, color: c.liftsBase > 0 ? X.indigo : X.textMut }}>{Math.round(liftsAnims[i])}</M>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Lbl style={{ marginBottom: 1 }}>Load</Lbl>
                <M style={{ fontSize: 14, fontWeight: 700, color: loads[i] > 40 ? X.amber : X.teal }}>{c.status === 'operating' ? `${Math.max(0, loads[i]).toFixed(0)}t` : '—'}</M>
              </div>
            </div>

            {c.efficiency > 0 && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <Lbl>Efficiency</Lbl>
                  <M style={{ fontSize: 8, fontWeight: 700, color: c.efficiency >= efficiencyTarget ? X.teal : c.efficiency >= efficiencyTarget - 15 ? X.amber : X.red }}>{c.efficiency}%</M>
                </div>
                <Prog value={c.efficiency} color={c.efficiency >= efficiencyTarget ? X.teal : c.efficiency >= efficiencyTarget - 15 ? X.amber : X.red} h={2} />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Berth Schedule ──────────────────────────────────────────────────
export function BerthSchedule({ title = 'Berth Schedule', statusFilter = 'all' }: { title?: string; statusFilter?: string }) {
  const X = getX();

  const berths = useMemo(() => [
    { berth: 'B-01', vessel: 'CMA Horizon', arrival: '06:00', departure: '18:00', status: 'occupied', cargo: 'Containers' },
    { berth: 'B-02', vessel: 'MV Iron Duke', arrival: '08:30', departure: '22:00', status: 'occupied', cargo: 'Bulk Grain' },
    { berth: 'B-03', vessel: '—', arrival: '—', departure: '—', status: 'available', cargo: '—' },
    { berth: 'B-04', vessel: 'NS Meridian', arrival: '14:30', departure: '02:00 +1', status: 'reserved', cargo: 'Crude Oil' },
    { berth: 'B-05', vessel: 'Jade Fortune', arrival: '11:00', departure: '20:30', status: 'occupied', cargo: 'Steel Coils' },
    { berth: 'B-06', vessel: 'Coral Seas', arrival: '16:00', departure: '06:00 +1', status: 'reserved', cargo: 'Vehicles' },
  ], []);

  const sc: Record<string, string> = { occupied: X.teal, available: X.purple, reserved: X.amber };
  const occupiedCount = berths.filter(b => b.status === 'occupied').length;

  return (
    <Card noPad style={{ width: 450 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <Badge color={X.teal}>{occupiedCount} Occupied</Badge>
          <Badge color={X.amber}>{berths.filter(b => b.status === 'reserved').length} Reserved</Badge>
        </div>
      </div>
      <div style={{ padding: '0 6px 6px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 52px 60px 62px 72px', gap: 4, padding: '4px 8px', borderBottom: `1px solid ${X.borderLight}` }}>
          {['Berth', 'Vessel', 'Arrival', 'Departure', 'Status', 'Cargo'].map(h => <Lbl key={h}>{h}</Lbl>)}
        </div>
        {berths.map((b, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 52px 60px 62px 72px', gap: 4, padding: '5px 8px', borderRadius: 3, background: i % 2 === 0 ? X.bgAlt : 'transparent', alignItems: 'center', animation: `sr 120ms ${ease.o} ${i * 15}ms both` }}>
            <M style={{ fontSize: 9, fontWeight: 700, color: X.text }}>{b.berth}</M>
            <M style={{ fontSize: 9, fontWeight: 600, color: b.vessel === '—' ? X.textMut : X.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.vessel}</M>
            <M style={{ fontSize: 8, color: b.arrival === '—' ? X.textMut : X.textSec }}>{b.arrival}</M>
            <M style={{ fontSize: 8, color: b.departure === '—' ? X.textMut : X.textSec }}>{b.departure}</M>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Dot c={sc[b.status]} pulse={b.status === 'occupied'} s={5} />
              <M style={{ fontSize: 7, color: sc[b.status] }}>{b.status}</M>
            </div>
            <M style={{ fontSize: 8, color: b.cargo === '—' ? X.textMut : X.purple, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.cargo}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Cargo Manifest ──────────────────────────────────────────────────
export function CargoManifest({ title = 'Cargo Manifest', hazmatHighlight = true }: { title?: string; hazmatHighlight?: boolean }) {
  const X = getX();

  const totalTEU = 12480;
  const animTEU = useAnim(totalTEU, 1400);
  const importPct = 58;
  const exportPct = 42;
  const hazmatCount = 14;

  const commodities = useMemo(() => [
    { name: 'Electronics', teu: 3840, color: X.indigo },
    { name: 'Machinery', teu: 2980, color: X.teal },
    { name: 'Consumer Goods', teu: 2650, color: X.purple },
  ], [X]);

  // Donut chart: import vs export
  const circumference = 2 * Math.PI * 14;
  const importArc = (importPct / 100) * circumference;
  const exportArc = (exportPct / 100) * circumference;

  return (
    <Card style={{ width: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        {hazmatHighlight && <Badge color={X.red}><Dot c={X.red} s={4} />{hazmatCount} Hazmat</Badge>}
      </div>

      {/* Big TEU number */}
      <div style={{ marginBottom: 10 }}>
        <M style={{ fontSize: 28, fontWeight: 800, color: X.text, letterSpacing: '-.02em' }}>{Math.round(animTEU).toLocaleString()}</M>
        <M style={{ fontSize: 9, color: X.textMut, marginLeft: 4 }}>total TEUs</M>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
        {/* Donut chart */}
        <svg viewBox="0 0 36 36" style={{ width: 72, height: 72, transform: 'rotate(-90deg)', flexShrink: 0 }}>
          <circle cx="18" cy="18" r="14" fill="none" stroke={X.borderLight} strokeWidth="4" />
          <circle cx="18" cy="18" r="14" fill="none" stroke={X.indigo} strokeWidth="4"
            strokeDasharray={`${importArc} ${circumference - importArc}`}
            strokeDashoffset="0"
            style={{ transition: `stroke-dasharray 500ms ${ease.sp}` }}
          />
          <circle cx="18" cy="18" r="14" fill="none" stroke={X.amber} strokeWidth="4"
            strokeDasharray={`${exportArc} ${circumference - exportArc}`}
            strokeDashoffset={`${-importArc}`}
            style={{ transition: `stroke-dasharray 500ms ${ease.sp}` }}
          />
          <text x="18" y="17" textAnchor="middle" dominantBaseline="central" fontFamily={X.m} fontSize="6" fontWeight="800" fill={X.text} style={{ transform: 'rotate(90deg)', transformOrigin: '18px 18px' }}>
            I/E
          </text>
        </svg>

        {/* Import/Export bars */}
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Dot c={X.indigo} s={5} />
                <M style={{ fontSize: 9, color: X.textMut }}>Import</M>
              </div>
              <M style={{ fontSize: 10, fontWeight: 700, color: X.indigo }}>{importPct}%</M>
            </div>
            <Prog value={importPct} color={X.indigo} h={3} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Dot c={X.amber} s={5} />
                <M style={{ fontSize: 9, color: X.textMut }}>Export</M>
              </div>
              <M style={{ fontSize: 10, fontWeight: 700, color: X.amber }}>{exportPct}%</M>
            </div>
            <Prog value={exportPct} color={X.amber} h={3} />
          </div>
        </div>
      </div>

      {/* Top commodities */}
      <Lbl style={{ marginBottom: 6 }}>Top Commodities</Lbl>
      {commodities.map((c, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: i < commodities.length - 1 ? `1px solid ${X.borderLight}` : 'none', animation: `sr 150ms ${ease.o} ${i * 20}ms both` }}>
          <Dot c={c.color} s={5} />
          <M style={{ fontSize: 9, fontWeight: 600, color: X.text, flex: 1 }}>{c.name}</M>
          <M style={{ fontSize: 9, fontWeight: 700, color: c.color }}>{c.teu.toLocaleString()} TEU</M>
        </div>
      ))}
    </Card>
  );
}
