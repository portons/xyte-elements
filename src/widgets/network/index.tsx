import { useState, useEffect } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { useAnim, useLive } from '../hooks';

// ── Network Info ──────────────────────────────────────────────────────
export function NetworkInfo({ title = 'Network', vlan = 10 }: { title?: string; vlan?: number }) {
  const X = getX();
  const j = useLive(1.2, 2, 1500);
  const lat = useLive(2.1, 0.8, 1800);
  const rows: [string, string][] = [['IP', '192.168.1.42'], ['MAC', 'A8:5E:45:3B:C1:9F'], ['Gateway', '192.168.1.1'], ['Link', '1 Gbps'], ['PoE', '25.2W Active'], ['VLAN', vlan + ' (AV)'], ['Latency', lat.toFixed(1) + ' ms'], ['Jitter', j.toFixed(1) + ' ms']];
  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>{title}</div>
      {rows.map(([l, v], i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: i < rows.length - 1 ? `1px solid ${X.borderLight}` : 'none', animation: `fu 150ms ${ease.o} ${i * 15}ms both` }}>
          <M style={{ fontSize: 9, color: X.textMut }}>{l}</M>
          <M style={{ fontSize: 9, fontWeight: 600, color: l === 'Jitter' ? (j > 3 ? X.red : j > 1.5 ? X.amber : X.teal) : l === 'Latency' ? (lat > 3 ? X.red : X.teal) : l === 'PoE' ? X.teal : X.text }}>{v}</M>
        </div>
      ))}
    </Card>
  );
}

// ── Bandwidth Monitor ─────────────────────────────────────────────────
export function BandwidthMonitor({ title = 'Bandwidth', sampleCount = 30 }: { title?: string; sampleCount?: number }) {
  const X = getX();
  const [dl, setDl] = useState(() => Array.from({ length: sampleCount }, () => Math.random() * 80));
  const [ul, setUl] = useState(() => Array.from({ length: sampleCount }, () => Math.random() * 30));
  useEffect(() => { const i = setInterval(() => { setDl(d => [...d.slice(1), Math.random() * 80 + 20]); setUl(u => [...u.slice(1), Math.random() * 30 + 5]); }, 500); return () => clearInterval(i); }, []);
  const render = (data: number[], color: string, h = 24) => {
    const mx = Math.max(...data, 1);
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: h }}>
        {data.map((v, i) => <div key={i} style={{ flex: 1, height: `${(v / mx) * 100}%`, background: color, borderRadius: 1, opacity: 0.3 + (i / data.length) * 0.7, transition: 'height 300ms' }} />)}
      </div>
    );
  };
  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 8 }}>{title}</div>
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}><Lbl>Download</Lbl><M style={{ fontSize: 9, color: X.teal, fontWeight: 600 }}>{dl[dl.length - 1].toFixed(0)} Mbps</M></div>
        {render(dl, X.teal)}
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}><Lbl>Upload</Lbl><M style={{ fontSize: 9, color: X.indigo, fontWeight: 600 }}>{ul[ul.length - 1].toFixed(0)} Mbps</M></div>
        {render(ul, X.indigo)}
      </div>
    </Card>
  );
}

// ── AVoIP Stats ───────────────────────────────────────────────────────
export function AVoIPStats({ title = 'AV-over-IP', codec = 'H.265' }: { title?: string; codec?: string }) {
  const X = getX();
  const bitrate = useLive(42, 10, 1500);
  const latency = useLive(1.8, 0.6, 2000);
  const drops = useLive(0.2, 0.4, 3000);
  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>{title}</div>
      {([['Bitrate', bitrate.toFixed(1) + ' Mbps', X.teal], ['Latency', latency.toFixed(1) + ' ms', latency > 3 ? X.red : X.teal], ['Packet Loss', Math.max(0, drops).toFixed(2) + '%', drops > 0.5 ? X.amber : X.teal], ['Codec', codec, X.textSec], ['Multicast', '239.1.1.10', X.textSec]] as [string, string, string][]).map(([l, v, c], i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: i < 4 ? `1px solid ${X.borderLight}` : 'none' }}>
          <M style={{ fontSize: 9, color: X.textMut }}>{l}</M>
          <M style={{ fontSize: 9, fontWeight: 600, color: c }}>{v}</M>
        </div>
      ))}
    </Card>
  );
}

// ── Latency Graph ─────────────────────────────────────────────────────
export function LatencyGraph({ title = 'Latency', warningMs = 3 }: { title?: string; warningMs?: number }) {
  const X = getX();
  const [data, setData] = useState(() => Array.from({ length: 50 }, () => 1 + Math.random() * 3));
  useEffect(() => { const i = setInterval(() => setData(d => [...d.slice(1), 1 + Math.random() * 4]), 300); return () => clearInterval(i); }, []);
  const mx = Math.max(...data), mn = Math.min(...data);
  const pts = data.map((v, i) => `${(i / 49) * 100},${100 - ((v - mn) / (mx - mn || 1)) * 80}`).join(' ');
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <Lbl>{title}</Lbl>
        <M style={{ fontSize: 10, color: data[49] > warningMs ? X.amber : X.teal, fontWeight: 700 }}>{data[49].toFixed(1)}ms</M>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 32, overflow: 'hidden' }}>
        <polyline points={pts} fill="none" stroke={X.teal} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <line x1="0" y1={100 - ((warningMs - mn) / (mx - mn || 1)) * 80} x2="100" y2={100 - ((warningMs - mn) / (mx - mn || 1)) * 80} stroke={X.amber} strokeWidth=".5" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" opacity=".5" />
      </svg>
    </Card>
  );
}

// ── Power Monitor ─────────────────────────────────────────────────────
export function PowerMonitor({ title = 'Power', nominalWatts = 850 }: { title?: string; nominalWatts?: number }) {
  const X = getX();
  const watts = useLive(nominalWatts, 80, 2000);
  const [history, setHistory] = useState(() => Array.from({ length: 40 }, () => nominalWatts - 50 + Math.random() * 200));
  useEffect(() => { const i = setInterval(() => setHistory(h => [...h.slice(1), watts]), 2000); return () => clearInterval(i); }, [watts]);
  const mn = Math.min(...history), mx = Math.max(...history);
  const pts = history.map((v, i) => `${(i / 39) * 100},${100 - ((v - mn) / (mx - mn || 1)) * 80}`).join(' ');
  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <M style={{ fontSize: 16, fontWeight: 800, color: X.amber }}>{Math.round(watts)}W</M>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 40, overflow: 'hidden' }}>
        <defs><linearGradient id="pw-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={X.amber} stopOpacity=".2" /><stop offset="100%" stopColor={X.amber} stopOpacity="0" /></linearGradient></defs>
        <polygon points={`0,100 ${pts} 100,100`} fill="url(#pw-g)" />
        <polyline points={pts} fill="none" stroke={X.amber} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        {([['Today', '8.2 kWh'], ['Avg', '812W'], ['Peak', '1.1 kW']] as [string, string][]).map(([l, v], i) => <div key={i}><Lbl style={{ marginBottom: 1 }}>{l}</Lbl><M style={{ fontSize: 9, fontWeight: 600, color: X.textSec }}>{v}</M></div>)}
      </div>
    </Card>
  );
}

// ── PoE Manager ───────────────────────────────────────────────────────
export function PoEManager({ title = 'PoE Manager', budget = 240 }: { title?: string; budget?: number }) {
  const X = getX();
  const ports = [{ n: 'Port 1', w: 15.4, d: 'PTZ Cam', s: true }, { n: 'Port 2', w: 25.2, d: 'Ceiling Mic', s: true }, { n: 'Port 3', w: 12.8, d: 'Touch Panel', s: true }, { n: 'Port 4', w: 0, d: '—', s: false }, { n: 'Port 5', w: 30.1, d: 'AP', s: true }, { n: 'Port 6', w: 0, d: '—', s: false }];
  const total = ports.reduce((a, p) => a + p.w, 0);
  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <M style={{ fontSize: 11, fontWeight: 700, color: X.amber }}>{total.toFixed(0)}W / {budget}W</M>
      </div>
      <Prog value={(total / budget) * 100} color={total > budget * 0.83 ? X.red : X.amber} h={3} style={{ marginBottom: 8 }} />
      {ports.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0', borderBottom: i < ports.length - 1 ? `1px solid ${X.borderLight}` : 'none', opacity: p.s ? 1 : 0.35, animation: `sr 150ms ${ease.o} ${i * 15}ms both` }}>
          <Dot c={p.s ? X.teal : X.textMut} s={5} />
          <M style={{ fontSize: 9, flex: 1, color: X.text }}>{p.n}</M>
          <M style={{ fontSize: 8, color: X.textMut }}>{p.d}</M>
          <M style={{ fontSize: 9, fontWeight: 600, color: p.w > 25 ? X.amber : X.teal, minWidth: 30, textAlign: 'right' }}>{p.w > 0 ? p.w + 'W' : '—'}</M>
        </div>
      ))}
    </Card>
  );
}

// ── Port Status ───────────────────────────────────────────────────────
export function PortStatus({ title = 'I/O Ports', columns = 4 }: { title?: string; columns?: number }) {
  const X = getX();
  const ports = [{ t: 'HDMI', n: 1, s: 'active', d: 'MacBook' }, { t: 'HDMI', n: 2, s: 'active', d: 'Apple TV' }, { t: 'HDMI', n: 3, s: 'idle' }, { t: 'HDMI', n: 4, s: 'error' }, { t: 'DP', n: 1, s: 'active', d: 'Laptop' }, { t: 'USB-C', n: 1, s: 'idle' }, { t: 'SDI', n: 1, s: 'active', d: 'Cam 1' }, { t: 'SDI', n: 2, s: 'active', d: 'Cam 2' }] as Array<{ t: string; n: number; s: string; d?: string }>;
  const sc: Record<string, string> = { active: X.teal, idle: X.textMut, error: X.red };
  return (
    <Card noPad>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{ports.filter(p => p.s === 'active').length}/{ports.length} Active</Badge>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 3, padding: '2px 6px 8px' }}>
        {ports.map((p, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 3px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${p.s === 'error' ? X.red + '25' : X.borderLight}`, gap: 2, animation: `fu 180ms ${ease.o} ${i * 20}ms both` }}>
            <div style={{ width: 12, height: 6, borderRadius: 2, background: sc[p.s], opacity: p.s === 'idle' ? 0.25 : 1, boxShadow: p.s === 'active' ? `0 0 4px ${X.teal}30` : 'none' }} />
            <M style={{ fontSize: 7, fontWeight: 600, color: X.textSec }}>{p.t} {p.n}</M>
            {p.d ? <M style={{ fontSize: 6, color: X.teal }}>{p.d}</M> : p.s === 'error' ? <M style={{ fontSize: 6, color: X.red }}>Fail</M> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Certificate Status ────────────────────────────────────────────────
export function CertStatus({ title = 'Certificates', warningDays = 90 }: { title?: string; warningDays?: number }) {
  const X = getX();
  const certs = [{ n: 'SSL/TLS', exp: '2026-08-15', st: 'valid' }, { n: 'Device Auth', exp: '2026-03-01', st: 'expiring' }, { n: 'API Key', exp: '2025-12-31', st: 'expired' }];
  const sc: Record<string, string> = { valid: X.teal, expiring: X.amber, expired: X.red };
  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>{title}</div>
      {certs.map((c, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: i < certs.length - 1 ? `1px solid ${X.borderLight}` : 'none' }}>
          <Dot c={sc[c.st]} s={6} />
          <div style={{ flex: 1 }}><M style={{ fontSize: 10, fontWeight: 600, color: X.text, display: 'block' }}>{c.n}</M><M style={{ fontSize: 8, color: X.textMut }}>Expires {c.exp}</M></div>
          <Badge color={sc[c.st]}>{c.st}</Badge>
        </div>
      ))}
    </Card>
  );
}

// ── Lamp Life ─────────────────────────────────────────────────────────
export function LampLife({ hours = 12400, max = 20000 }: { hours?: number; max?: number }) {
  const X = getX();
  const pct = (hours / max) * 100;
  const c = pct > 85 ? X.red : pct > 65 ? X.amber : X.teal;
  const a = useAnim(pct);
  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>Laser Life</div>
        <Badge color={c}>{pct > 85 ? 'Replace' : pct > 65 ? 'Aging' : 'Good'}</Badge>
      </div>
      <div style={{ width: '100%', overflow: 'hidden', marginBottom: 8 }}>
        <svg viewBox="0 0 200 65" preserveAspectRatio="xMidYMid meet" style={{ display: 'block', width: '100%', height: 'auto' }}>
          <path d="M 20 55 A 80 80 0 0 1 180 55" fill="none" stroke={X.borderLight} strokeWidth={5} strokeLinecap="round" />
          <path d="M 20 55 A 80 80 0 0 1 180 55" fill="none" stroke={c} strokeWidth={5} strokeLinecap="round" strokeDasharray={`${(a / 100) * 252} 252`} style={{ transition: 'stroke 400ms', filter: `drop-shadow(0 0 3px ${c}40)` }} />
          <text x="100" y="42" textAnchor="middle" fontFamily={X.m} fontSize="16" fontWeight="800" fill={c}>{Math.round(a)}%</text>
          <text x="100" y="56" textAnchor="middle" fontFamily={X.m} fontSize="6" fill={X.textMut}>CAPACITY USED</text>
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Used</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.text }}>{hours.toLocaleString()}h</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Left</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: c }}>{(max - hours).toLocaleString()}h</M></div>
      </div>
    </Card>
  );
}
