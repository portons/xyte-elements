import { useState, useMemo } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot, Prog } from '../primitives';
import { useAnim, useLive, useTick } from '../hooks';

// ── Rack Thermal ────────────────────────────────────────────────────
export function RackThermal({ title = 'Rack Thermal Map', alertTemp = 45 }: { title?: string; alertTemp?: number }) {
  const X = getX();
  const racks = useMemo(() => [
    { id: 'R01', front: 24, rear: 38 },
    { id: 'R02', front: 26, rear: 42 },
    { id: 'R03', front: 23, rear: 36 },
    { id: 'R04', front: 29, rear: 48 },
    { id: 'R05', front: 25, rear: 40 },
    { id: 'R06', front: 27, rear: 44 },
  ], []);

  const liveTemps = racks.map((r, i) => ({
    front: useLive(r.front, 1.5, 2000 + i * 200),
    rear: useLive(r.rear, 2, 1800 + i * 150),
  }));

  const hotSpot = Math.max(...liveTemps.map(t => t.rear));
  const hasAlert = hotSpot > alertTemp;

  const heatColor = (t: number) => {
    if (t < 30) return X.teal;
    if (t < 38) return X.indigo;
    if (t < 44) return X.amber;
    return X.red;
  };

  return (
    <Card style={{ width: 420 }} glow={hasAlert ? X.red : undefined}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        {hasAlert ? <Badge color={X.red}><Dot c={X.red} pulse s={4} />Hot Spot</Badge> : <Badge color={X.teal}>Normal</Badge>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4, marginBottom: 10 }}>
        {racks.map((r, i) => {
          const rearC = heatColor(liveTemps[i].rear);
          return (
            <div key={i} style={{
              padding: '6px 4px', borderRadius: X.rs, background: X.bgAlt,
              border: `1px solid ${liveTemps[i].rear > alertTemp ? X.red + '40' : X.borderLight}`,
              textAlign: 'center', animation: `fu 150ms ${ease.o} ${i * 30}ms both`,
            }}>
              <M style={{ fontSize: 9, fontWeight: 700, color: X.text, display: 'block', marginBottom: 4 }}>{r.id}</M>
              <Lbl style={{ marginBottom: 1 }}>Front</Lbl>
              <M style={{ fontSize: 10, fontWeight: 600, color: heatColor(liveTemps[i].front), display: 'block', marginBottom: 3 }}>{liveTemps[i].front.toFixed(1)}&deg;</M>
              <Lbl style={{ marginBottom: 1 }}>Rear</Lbl>
              <M style={{ fontSize: 10, fontWeight: 700, color: rearC, display: 'block' }}>{liveTemps[i].rear.toFixed(1)}&deg;</M>
            </div>
          );
        })}
      </div>
      {/* Heat bar legend */}
      <Lbl style={{ marginBottom: 3 }}>Heat Scale</Lbl>
      <div style={{ height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${X.teal}, ${X.indigo}, ${X.amber}, ${X.red})`, marginBottom: 4 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <M style={{ fontSize: 7, color: X.textMut }}>20&deg;C</M>
        <M style={{ fontSize: 7, color: X.textMut }}>30&deg;C</M>
        <M style={{ fontSize: 7, color: X.textMut }}>40&deg;C</M>
        <M style={{ fontSize: 7, color: X.textMut }}>50&deg;C+</M>
      </div>
    </Card>
  );
}

// ── Server Health ───────────────────────────────────────────────────
export function ServerHealth({ title = 'Server Health', warningThreshold = 65 }: { title?: string; warningThreshold?: number }) {
  const X = getX();
  const servers = useMemo(() => [
    { host: 'node-web-01', cpu: 72, ram: 85, disk: 44, uptime: '142d', status: 'healthy' as const },
    { host: 'node-web-02', cpu: 58, ram: 62, disk: 51, uptime: '142d', status: 'healthy' as const },
    { host: 'node-db-01', cpu: 91, ram: 94, disk: 78, uptime: '89d', status: 'degraded' as const },
    { host: 'node-db-02', cpu: 34, ram: 48, disk: 72, uptime: '89d', status: 'healthy' as const },
    { host: 'node-cache-01', cpu: 45, ram: 71, disk: 22, uptime: '210d', status: 'healthy' as const },
    { host: 'node-worker-01', cpu: 0, ram: 0, disk: 65, uptime: '—', status: 'down' as const },
  ], []);

  const statusColor: Record<string, string> = { healthy: X.teal, degraded: X.amber, down: X.red };
  const barColor = (v: number) => v > 85 ? X.red : v > warningThreshold ? X.amber : X.teal;
  const healthyCount = servers.filter(s => s.status === 'healthy').length;

  return (
    <Card noPad style={{ width: 460 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={healthyCount === servers.length ? X.teal : X.amber}>{healthyCount}/{servers.length} Healthy</Badge>
      </div>
      <div style={{ padding: '0 6px 8px' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 60px 60px 40px 14px', gap: 4, padding: '4px 8px', borderBottom: `1px solid ${X.borderLight}` }}>
          {['Host', 'CPU', 'RAM', 'Disk', 'Up', ''].map(h => <Lbl key={h}>{h}</Lbl>)}
        </div>
        {servers.map((s, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 60px 60px 60px 40px 14px', gap: 4,
            padding: '5px 8px', borderRadius: 3, alignItems: 'center',
            background: i % 2 === 0 ? X.bgAlt : 'transparent',
            opacity: s.status === 'down' ? 0.4 : 1,
            animation: `sr 120ms ${ease.o} ${i * 15}ms both`,
          }}>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.text }}>{s.host}</M>
            <div><Prog value={s.cpu} color={barColor(s.cpu)} h={3} /><M style={{ fontSize: 7, color: X.textMut }}>{s.cpu}%</M></div>
            <div><Prog value={s.ram} color={barColor(s.ram)} h={3} /><M style={{ fontSize: 7, color: X.textMut }}>{s.ram}%</M></div>
            <div><Prog value={s.disk} color={barColor(s.disk)} h={3} /><M style={{ fontSize: 7, color: X.textMut }}>{s.disk}%</M></div>
            <M style={{ fontSize: 8, color: X.textMut }}>{s.uptime}</M>
            <Dot c={statusColor[s.status]} pulse={s.status === 'healthy'} s={5} />
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── VM Density ──────────────────────────────────────────────────────
export function VMDensity({ title = 'VM Density', optimalScore = 85 }: { title?: string; optimalScore?: number }) {
  const X = getX();
  const hosts = useMemo(() => [
    { name: 'esxi-host-01', vms: 28, vcpuRatio: 4.2, memOvercommit: 135, score: 82 },
    { name: 'esxi-host-02', vms: 34, vcpuRatio: 5.8, memOvercommit: 162, score: 68 },
    { name: 'esxi-host-03', vms: 18, vcpuRatio: 2.6, memOvercommit: 108, score: 94 },
    { name: 'esxi-host-04', vms: 31, vcpuRatio: 4.9, memOvercommit: 148, score: 75 },
  ], []);

  const scoreBadge = (s: number): { label: string; color: string } => {
    if (s >= optimalScore) return { label: 'Optimal', color: X.teal };
    if (s >= 70) return { label: 'Normal', color: X.amber };
    return { label: 'Dense', color: X.red };
  };

  const totalVMs = hosts.reduce((a, h) => a + h.vms, 0);
  const animTotal = useAnim(totalVMs, 900);

  return (
    <Card style={{ width: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
          <M style={{ fontSize: 18, fontWeight: 800, color: X.purple }}>{Math.round(animTotal)}</M>
          <M style={{ fontSize: 9, color: X.textMut }}>VMs</M>
        </div>
      </div>
      {hosts.map((h, i) => {
        const { label, color } = scoreBadge(h.score);
        return (
          <div key={i} style={{
            padding: '8px 10px', borderRadius: X.rs, marginBottom: 4,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
            animation: `fu 150ms ${ease.o} ${i * 30}ms both`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
              <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{h.name}</M>
              <Badge color={color}>{label}</Badge>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              <div><Lbl style={{ marginBottom: 2 }}>VMs</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.purple }}>{h.vms}</M></div>
              <div><Lbl style={{ marginBottom: 2 }}>vCPU</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: h.vcpuRatio > 5 ? X.amber : X.teal }}>{h.vcpuRatio}:1</M></div>
              <div><Lbl style={{ marginBottom: 2 }}>Mem OC</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: h.memOvercommit > 150 ? X.red : h.memOvercommit > 120 ? X.amber : X.teal }}>{h.memOvercommit}%</M></div>
              <div><Lbl style={{ marginBottom: 2 }}>Score</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: color }}>{h.score}</M></div>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// ── Bandwidth Pipe ──────────────────────────────────────────────────
export function BandwidthPipe({ title = 'Bandwidth', highUtilThreshold = 85 }: { title?: string; highUtilThreshold?: number }) {
  const X = getX();
  const links = useMemo(() => [
    { name: 'Uplink', capacity: 10, base: 6.2, color: X.teal },
    { name: 'Downlink', capacity: 10, base: 7.8, color: X.indigo },
    { name: 'Peering', capacity: 40, base: 18.5, color: X.purple },
    { name: 'Transit', capacity: 100, base: 42.3, color: X.amber },
  ], []);

  const liveThroughputs = links.map((l, i) => useLive(l.base, l.base * 0.12, 1500 + i * 300));

  return (
    <Card style={{ width: 370 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal} solid>Live</Badge>
      </div>
      {links.map((l, i) => {
        const throughput = Math.max(0, liveThroughputs[i]);
        const util = Math.min(100, (throughput / l.capacity) * 100);
        const utilColor = util > highUtilThreshold ? X.red : util > 65 ? X.amber : l.color;
        return (
          <div key={i} style={{
            padding: '6px 0', borderBottom: i < links.length - 1 ? `1px solid ${X.borderLight}` : 'none',
            animation: `sr 150ms ${ease.o} ${i * 20}ms both`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Dot c={l.color} s={5} />
                <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{l.name}</M>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                <M style={{ fontSize: 12, fontWeight: 700, color: utilColor }}>{throughput.toFixed(1)}</M>
                <M style={{ fontSize: 8, color: X.textMut }}>/ {l.capacity} Gbps</M>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Prog value={util} color={utilColor} h={4} style={{ flex: 1 }} />
              <M style={{ fontSize: 9, fontWeight: 700, color: utilColor, minWidth: 28, textAlign: 'right' }}>{util.toFixed(0)}%</M>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// ── UPS Status ──────────────────────────────────────────────────────
export function UPSStatus({ title = 'UPS Status', nominalVoltage = 230 }: { title?: string; nominalVoltage?: number }) {
  const X = getX();
  const battery = 87;
  const animBattery = useAnim(battery, 1200);
  const load = useLive(62, 4, 2500);
  const runtime = useLive(24, 2, 4000);
  const inputV = useLive(230, 3, 2000);
  const outputV = useLive(230, 0.8, 1800);

  const battColor = battery > 60 ? X.teal : battery > 30 ? X.amber : X.red;
  const loadColor = load > 80 ? X.red : load > 60 ? X.amber : X.teal;
  const transferStatus = 'Online';

  // SVG arc parameters
  const cx = 60, cy = 55, r = 42;
  const startAngle = 150, endAngle = 390;
  const range = endAngle - startAngle;
  const filledAngle = startAngle + (animBattery / 100) * range;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcX = (a: number) => cx + r * Math.cos(toRad(a));
  const arcY = (a: number) => cy + r * Math.sin(toRad(a));

  const bgArc = `M ${arcX(startAngle)} ${arcY(startAngle)} A ${r} ${r} 0 1 1 ${arcX(endAngle)} ${arcY(endAngle)}`;
  const largeFlag = (filledAngle - startAngle) > 180 ? 1 : 0;
  const fillArc = `M ${arcX(startAngle)} ${arcY(startAngle)} A ${r} ${r} 0 ${largeFlag} 1 ${arcX(filledAngle)} ${arcY(filledAngle)}`;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{transferStatus}</Badge>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <svg viewBox="0 0 120 90" style={{ width: 160, height: 120 }}>
          <path d={bgArc} fill="none" stroke={X.borderLight} strokeWidth="6" strokeLinecap="round" />
          <path d={fillArc} fill="none" stroke={battColor} strokeWidth="6" strokeLinecap="round" style={{ transition: `d 600ms`, filter: `drop-shadow(0 0 4px ${battColor}40)` }} />
          <text x={cx} y={cy - 4} textAnchor="middle" fontFamily={X.m} fontSize="18" fontWeight="800" fill={battColor}>{Math.round(animBattery)}%</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontFamily={X.m} fontSize="7" fill={X.textMut}>BATTERY</text>
        </svg>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, marginBottom: 8 }}>
        <div style={{ padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt }}>
          <Lbl style={{ marginBottom: 2 }}>Load</Lbl>
          <M style={{ fontSize: 14, fontWeight: 700, color: loadColor }}>{Math.round(load)}%</M>
          <Prog value={load} color={loadColor} h={2} style={{ marginTop: 3 }} />
        </div>
        <div style={{ padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt }}>
          <Lbl style={{ marginBottom: 2 }}>Runtime</Lbl>
          <M style={{ fontSize: 14, fontWeight: 700, color: X.text }}>{Math.round(runtime)}<span style={{ fontSize: 9, color: X.textMut }}> min</span></M>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {([['Input', `${inputV.toFixed(0)}V`, Math.abs(inputV - nominalVoltage) > 8 ? X.amber : X.teal], ['Output', `${outputV.toFixed(0)}V`, X.teal], ['Transfer', transferStatus, X.teal]] as [string, string, string][]).map(([l, v, c], i) => (
          <div key={i}><Lbl style={{ marginBottom: 2 }}>{l}</Lbl><M style={{ fontSize: 10, fontWeight: 600, color: c }}>{v}</M></div>
        ))}
      </div>
    </Card>
  );
}

// ── Cooling Efficiency ──────────────────────────────────────────────
export function CoolingEfficiency({ title = 'Cooling Efficiency', pueTarget = 1.4 }: { title?: string; pueTarget?: number }) {
  const X = getX();
  const pue = 1.38;
  const animPue = useAnim(pue * 100, 1400);
  const supplyTemp = useLive(12.4, 0.8, 2000);
  const returnTemp = useLive(22.6, 1.2, 2200);
  const chillerStatus = 'Running';

  const crahUnits = useMemo(() => [
    { name: 'CRAH-A1', airflow: 88, fanSpeed: 72 },
    { name: 'CRAH-A2', airflow: 92, fanSpeed: 78 },
    { name: 'CRAH-B1', airflow: 76, fanSpeed: 65 },
    { name: 'CRAH-B2', airflow: 84, fanSpeed: 70 },
  ], []);

  const pueColor = pue < pueTarget ? X.teal : pue < 1.6 ? X.amber : X.red;
  const pueLabel = pue < pueTarget ? 'Efficient' : pue < 1.6 ? 'Average' : 'Poor';

  return (
    <Card style={{ width: 370 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={pueColor}>{pueLabel}</Badge>
      </div>
      {/* PUE hero value */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
        <div style={{ textAlign: 'center' }}>
          <Lbl style={{ marginBottom: 3 }}>PUE</Lbl>
          <M style={{ fontSize: 28, fontWeight: 800, color: pueColor }}>{(animPue / 100).toFixed(2)}</M>
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt }}>
            <Lbl style={{ marginBottom: 2 }}>Supply</Lbl>
            <M style={{ fontSize: 12, fontWeight: 700, color: X.teal }}>{supplyTemp.toFixed(1)}&deg;C</M>
          </div>
          <div style={{ flex: 1, padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt }}>
            <Lbl style={{ marginBottom: 2 }}>Return</Lbl>
            <M style={{ fontSize: 12, fontWeight: 700, color: X.amber }}>{returnTemp.toFixed(1)}&deg;C</M>
          </div>
        </div>
      </div>
      {/* Chiller */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: `1px solid ${X.borderLight}`, marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Dot c={X.teal} pulse s={5} />
          <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>Chiller</M>
        </div>
        <Badge color={X.teal}>{chillerStatus}</Badge>
      </div>
      {/* CRAH units */}
      <Lbl style={{ marginBottom: 5 }}>CRAH Units</Lbl>
      {crahUnits.map((u, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0',
          borderBottom: i < crahUnits.length - 1 ? `1px solid ${X.borderLight}` : 'none',
          animation: `sr 150ms ${ease.o} ${i * 20}ms both`,
        }}>
          <M style={{ fontSize: 9, fontWeight: 600, color: X.text, minWidth: 52 }}>{u.name}</M>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
              <M style={{ fontSize: 7, color: X.textMut }}>Airflow</M>
              <M style={{ fontSize: 7, fontWeight: 600, color: X.indigo }}>{u.airflow}%</M>
            </div>
            <Prog value={u.airflow} color={X.indigo} h={2} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
              <M style={{ fontSize: 7, color: X.textMut }}>Fan</M>
              <M style={{ fontSize: 7, fontWeight: 600, color: X.purple }}>{u.fanSpeed}%</M>
            </div>
            <Prog value={u.fanSpeed} color={X.purple} h={2} />
          </div>
        </div>
      ))}
    </Card>
  );
}

// ── Patch Panel ─────────────────────────────────────────────────────
export function PatchPanel({ title = 'Patch Panel', portsPerRow = 6 }: { title?: string; portsPerRow?: number }) {
  const X = getX();
  const ports = useMemo(() => [
    { id: 1, label: 'P01', status: 'connected' as const, speed: '10G' },
    { id: 2, label: 'P02', status: 'connected' as const, speed: '10G' },
    { id: 3, label: 'P03', status: 'fault' as const, speed: '—' },
    { id: 4, label: 'P04', status: 'connected' as const, speed: '1G' },
    { id: 5, label: 'P05', status: 'empty' as const, speed: '—' },
    { id: 6, label: 'P06', status: 'connected' as const, speed: '10G' },
    { id: 7, label: 'P07', status: 'connected' as const, speed: '25G' },
    { id: 8, label: 'P08', status: 'empty' as const, speed: '—' },
    { id: 9, label: 'P09', status: 'connected' as const, speed: '10G' },
    { id: 10, label: 'P10', status: 'connected' as const, speed: '1G' },
    { id: 11, label: 'P11', status: 'empty' as const, speed: '—' },
    { id: 12, label: 'P12', status: 'fault' as const, speed: '—' },
  ], []);

  const statusColor: Record<string, string> = { connected: X.teal, empty: X.textMut, fault: X.red };
  const connectedCount = ports.filter(p => p.status === 'connected').length;
  const faultCount = ports.filter(p => p.status === 'fault').length;

  return (
    <Card noPad style={{ width: 360 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <Badge color={X.teal}>{connectedCount} Up</Badge>
          {faultCount > 0 && <Badge color={X.red}>{faultCount} Fault</Badge>}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${portsPerRow}, 1fr)`, gap: 4, padding: '4px 8px 10px' }}>
        {ports.map((p, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 3px',
            borderRadius: X.rs, background: X.bgAlt,
            border: `1px solid ${p.status === 'fault' ? X.red + '35' : X.borderLight}`,
            gap: 3, animation: `fu 180ms ${ease.o} ${i * 20}ms both`,
          }}>
            <Dot c={statusColor[p.status]} pulse={p.status === 'fault'} s={7} />
            <M style={{ fontSize: 8, fontWeight: 600, color: X.textSec }}>{p.label}</M>
            {p.status === 'connected' ? (
              <Badge color={p.speed === '25G' ? X.purple : p.speed === '10G' ? X.teal : X.indigo} style={{ padding: '1px 4px', fontSize: 7 }}>{p.speed}</Badge>
            ) : p.status === 'fault' ? (
              <M style={{ fontSize: 7, color: X.red, fontWeight: 600 }}>ERR</M>
            ) : (
              <M style={{ fontSize: 7, color: X.textMut }}>—</M>
            )}
          </div>
        ))}
      </div>
      {/* Legend */}
      <div style={{ padding: '0 14px 10px', display: 'flex', gap: 10, justifyContent: 'center' }}>
        {(['connected', 'empty', 'fault'] as const).map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Dot c={statusColor[s]} s={4} />
            <M style={{ fontSize: 7, color: X.textMut, textTransform: 'capitalize' }}>{s}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}
