import { useState, useEffect } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { useAnim, useTick } from '../hooks';

// ── Floor Plan ───────────────────────────────────────────────────────
export function FloorPlan({ title = 'Floor Plan', floorNumber = 1 }: { title?: string; floorNumber?: number }) {
  const X = getX();
  const tick = useTick(3000);
  const rooms = [
    { name: 'Lobby', x: 5, y: 5, w: 35, h: 40, devices: 4 },
    { name: 'Conf A', x: 45, y: 5, w: 25, h: 25, devices: 6 },
    { name: 'Conf B', x: 75, y: 5, w: 20, h: 25, devices: 3 },
    { name: 'Open Office', x: 5, y: 50, w: 55, h: 45, devices: 12 },
    { name: 'Server', x: 65, y: 35, w: 30, h: 25, devices: 8 },
    { name: 'Break Room', x: 65, y: 65, w: 30, h: 30, devices: 2 },
  ];

  // Device positions within rooms (randomized per room)
  const deviceDots = rooms.flatMap((r, ri) =>
    Array.from({ length: r.devices }, (_, di) => ({
      x: r.x + 3 + Math.random() * (r.w - 6),
      y: r.y + 8 + Math.random() * (r.h - 12),
      online: Math.random() > 0.15,
      roomIdx: ri,
    }))
  );

  const [selected, setSelected] = useState<number | null>(null);
  const totalDevices = rooms.reduce((a, r) => a + r.devices, 0);
  const onlineDevices = deviceDots.filter(d => d.online).length;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title} (F{floorNumber})</div>
        <Badge color={X.teal}>{onlineDevices}/{totalDevices} Online</Badge>
      </div>
      <div style={{ position: 'relative', width: '100%', paddingBottom: '60%', borderRadius: X.rs, overflow: 'hidden', border: `1px solid ${X.border}`, background: X.bgAlt, marginBottom: 8 }}>
        <svg viewBox="0 0 100 100" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          {/* Grid lines */}
          {Array.from({ length: 11 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke={X.borderLight} strokeWidth=".2" />
          ))}
          {Array.from({ length: 11 }, (_, i) => (
            <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" stroke={X.borderLight} strokeWidth=".2" />
          ))}
          {/* Rooms */}
          {rooms.map((r, i) => (
            <g key={i} onClick={() => setSelected(selected === i ? null : i)} style={{ cursor: 'pointer' }}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="1.5"
                fill={selected === i ? X.purple + '15' : X.surface + '80'}
                stroke={selected === i ? X.purple : X.border}
                strokeWidth={selected === i ? '.8' : '.4'} />
              <text x={r.x + r.w / 2} y={r.y + 6} textAnchor="middle" fontFamily={X.m} fontSize="3.5" fontWeight="600" fill={X.textMut}>{r.name}</text>
              {/* Device count badge */}
              <rect x={r.x + r.w - 8} y={r.y + 1} width="7" height="4" rx="1" fill={X.teal + '30'} />
              <text x={r.x + r.w - 4.5} y={r.y + 4} textAnchor="middle" fontFamily={X.m} fontSize="2.5" fontWeight="700" fill={X.teal}>{r.devices}</text>
            </g>
          ))}
          {/* Device dots */}
          {deviceDots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r="1.2"
              fill={d.online ? X.teal : X.red}
              opacity={selected !== null && d.roomIdx !== selected ? 0.15 : 0.8} />
          ))}
        </svg>
      </div>
      {selected !== null && (
        <div style={{ padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
          <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{rooms[selected].name}</M>
          <M style={{ fontSize: 8, color: X.textMut, display: 'block' }}>{rooms[selected].devices} devices installed</M>
        </div>
      )}
    </Card>
  );
}

// ── Zone Heatmap ─────────────────────────────────────────────────────
export function ZoneHeatmap({ title = 'Activity Heatmap', highThreshold = 75 }: { title?: string; highThreshold?: number }) {
  const X = getX();
  const [data, setData] = useState(() =>
    Array.from({ length: 24 }, () => Math.random() * 100)
  );
  useEffect(() => {
    const iv = setInterval(() => {
      setData(prev => prev.map(v => Math.max(0, Math.min(100, v + (Math.random() - 0.5) * 20))));
    }, 2500);
    return () => clearInterval(iv);
  }, []);

  const getColor = (v: number) => {
    if (v > highThreshold) return X.red;
    if (v > highThreshold * 0.67) return X.amber;
    if (v > highThreshold * 0.33) return X.teal;
    return X.teal + '40';
  };

  const rows = 4;
  const cols = 6;
  const labels = ['A', 'B', 'C', 'D'];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.amber}>Live</Badge>
      </div>
      {/* Column headers */}
      <div style={{ display: 'grid', gridTemplateColumns: `16px repeat(${cols}, 1fr)`, gap: 2, marginBottom: 2 }}>
        <div />
        {Array.from({ length: cols }, (_, i) => (
          <M key={i} style={{ fontSize: 7, color: X.textMut, textAlign: 'center' }}>{i + 1}</M>
        ))}
      </div>
      {/* Heatmap grid */}
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} style={{ display: 'grid', gridTemplateColumns: `16px repeat(${cols}, 1fr)`, gap: 2, marginBottom: 2 }}>
          <M style={{ fontSize: 7, color: X.textMut, display: 'flex', alignItems: 'center' }}>{labels[r]}</M>
          {Array.from({ length: cols }, (_, c) => {
            const idx = r * cols + c;
            const v = data[idx];
            return (
              <div key={c} style={{
                height: 26, borderRadius: 3,
                background: getColor(v),
                opacity: 0.2 + (v / 100) * 0.8,
                transition: 'background-color 500ms, opacity 500ms',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <M style={{ fontSize: 6, fontWeight: 600, color: X.text, opacity: v > 40 ? 1 : 0 }}>{Math.round(v)}</M>
              </div>
            );
          })}
        </div>
      ))}
      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, justifyContent: 'center' }}>
        <M style={{ fontSize: 7, color: X.textMut }}>Low</M>
        <div style={{ display: 'flex', gap: 1 }}>
          {[X.teal + '40', X.teal, X.amber, X.red].map((c, i) => (
            <div key={i} style={{ width: 12, height: 6, borderRadius: 1, background: c, opacity: 0.3 + i * 0.23 }} />
          ))}
        </div>
        <M style={{ fontSize: 7, color: X.textMut }}>High</M>
      </div>
    </Card>
  );
}

// ── Wayfinding Status ────────────────────────────────────────────────
export function WayfindingStatus({ title = 'Wayfinding', floor = '3F', activeRoutes }: { title?: string; floor?: string; activeRoutes: number }) {
  const X = getX();
  const tick = useTick(60000);

  const rows: [string, string, string][] = [
    ['Floor', '3 of 5', X.textSec],
    ['Active Routes', `${Math.max(0, Math.round(activeRoutes))}`, X.teal],
    ['Last Update', '12s ago', X.textSec],
    ['Display', '55" Touch', X.textSec],
    ['Connectivity', 'Online', X.teal],
    ['Firmware', 'v3.8.2', X.textMut],
  ];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Dot c={X.teal} pulse s={7} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, padding: '8px 10px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
        <div style={{ width: 32, height: 32, borderRadius: X.rs, background: X.purple + '15', border: `1px solid ${X.purple}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <M style={{ fontSize: 14, fontWeight: 800, color: X.purple }}>{floor}</M>
        </div>
        <div>
          <M style={{ fontSize: 11, fontWeight: 700, color: X.text, display: 'block' }}>Floor 3 - West Wing</M>
          <M style={{ fontSize: 8, color: X.textMut }}>Main Entrance Kiosk</M>
        </div>
      </div>
      {rows.map(([l, v, c], i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', borderBottom: i < rows.length - 1 ? `1px solid ${X.borderLight}` : 'none', animation: `fu 150ms ${ease.o} ${i * 15}ms both` }}>
          <M style={{ fontSize: 9, color: X.textMut }}>{l}</M>
          <M style={{ fontSize: 9, fontWeight: 600, color: c }}>{v}</M>
        </div>
      ))}
    </Card>
  );
}

// ── Beacon Manager ───────────────────────────────────────────────────
export function BeaconManager({ title = 'BLE Beacons', lowBatteryThreshold = 20 }: { title?: string; lowBatteryThreshold?: number }) {
  const X = getX();
  const beacons = [
    { name: 'Entrance-01', rssi: -42, battery: 95, lastSeen: '2s ago', zone: 'Lobby' },
    { name: 'MeetingA-02', rssi: -58, battery: 72, lastSeen: '5s ago', zone: 'Conf A' },
    { name: 'Hallway-03', rssi: -67, battery: 45, lastSeen: '3s ago', zone: 'Corridor' },
    { name: 'Cafe-04', rssi: -71, battery: 88, lastSeen: '8s ago', zone: 'Break Room' },
    { name: 'Server-05', rssi: -53, battery: 12, lastSeen: '1s ago', zone: 'Server' },
  ];

  const rssiColor = (rssi: number) => rssi > -50 ? X.teal : rssi > -65 ? X.amber : X.red;
  const battColor = (batt: number) => batt > 50 ? X.teal : batt > lowBatteryThreshold ? X.amber : X.red;
  const signalBars = (rssi: number) => {
    const strength = rssi > -50 ? 4 : rssi > -60 ? 3 : rssi > -70 ? 2 : 1;
    return Array.from({ length: 4 }, (_, i) => i < strength);
  };

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{beacons.length} Active</Badge>
      </div>
      {beacons.map((b, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 0', borderBottom: i < beacons.length - 1 ? `1px solid ${X.borderLight}` : 'none', animation: `sr 150ms ${ease.o} ${i * 20}ms both` }}>
          {/* Signal bars */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1, width: 14, height: 12 }}>
            {signalBars(b.rssi).map((on, j) => (
              <div key={j} style={{ width: 2.5, height: 3 + j * 3, borderRadius: 1, background: on ? rssiColor(b.rssi) : X.borderLight }} />
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.text, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</M>
            <M style={{ fontSize: 7, color: X.textMut }}>{b.zone} &middot; {b.rssi} dBm</M>
          </div>
          {/* Battery */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 16, height: 8, borderRadius: 2, border: `1px solid ${battColor(b.battery)}`, padding: 1, position: 'relative' }}>
              <div style={{ width: `${b.battery}%`, height: '100%', borderRadius: 1, background: battColor(b.battery) }} />
            </div>
            <M style={{ fontSize: 7, color: battColor(b.battery), fontWeight: 600, minWidth: 18 }}>{b.battery}%</M>
          </div>
          <M style={{ fontSize: 7, color: X.textMut, minWidth: 28, textAlign: 'right' }}>{b.lastSeen}</M>
        </div>
      ))}
    </Card>
  );
}

// ── Asset Tracker ────────────────────────────────────────────────────
export function AssetTracker({ title = 'Asset Tracker', showStatus = 'all' }: { title?: string; showStatus?: 'all' | 'stationary' | 'moving' }) {
  const X = getX();
  const [assets] = useState([
    { name: 'Projector A', zone: 'Conf Room 1', lastMoved: '2m ago', status: 'stationary' },
    { name: 'Laptop Cart', zone: 'Open Office', lastMoved: '15s ago', status: 'moving' },
    { name: 'AV Rack 3', zone: 'Server Room', lastMoved: '3d ago', status: 'stationary' },
    { name: 'Mic Kit B', zone: 'Conf Room 2', lastMoved: '45m ago', status: 'stationary' },
    { name: 'Display Stand', zone: 'Lobby', lastMoved: '1h ago', status: 'stationary' },
  ]);

  const statusColor: Record<string, string> = { stationary: X.teal, moving: X.amber, missing: X.red };
  const statusIcon: Record<string, string> = { stationary: '\u25CF', moving: '\u25B6', missing: '\u2715' };

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{assets.length} Tracked</Badge>
      </div>
      {assets.filter(a => showStatus === 'all' || a.status === showStatus).map((a, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: i < assets.length - 1 ? `1px solid ${X.borderLight}` : 'none', animation: `sr 150ms ${ease.o} ${i * 20}ms both` }}>
          <Dot c={statusColor[a.status]} pulse={a.status === 'moving'} s={6} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <M style={{ fontSize: 10, fontWeight: 600, color: X.text, display: 'block' }}>{a.name}</M>
            <M style={{ fontSize: 8, color: X.textMut }}>{a.zone}</M>
          </div>
          <div style={{ textAlign: 'right' }}>
            <M style={{ fontSize: 8, color: X.textMut, display: 'block' }}>{a.lastMoved}</M>
            <Badge color={statusColor[a.status]} style={{ fontSize: 7 }}>{a.status}</Badge>
          </div>
        </div>
      ))}
    </Card>
  );
}

// ── Environmental Sensor ─────────────────────────────────────────────
export function EnvironmentalSensor({ title = 'Environment', tempUnit = 'C', temp, humidity, co2, noise, light }: { title?: string; tempUnit?: 'C' | 'F'; temp: number; humidity: number; co2: number; noise: number; light: number }) {
  const X = getX();

  // Generate mini sparkline data for each sensor
  const [sparklines] = useState(() => ({
    temp: Array.from({ length: 16 }, () => 20 + Math.random() * 5),
    humidity: Array.from({ length: 16 }, () => 35 + Math.random() * 20),
    co2: Array.from({ length: 16 }, () => 380 + Math.random() * 80),
    noise: Array.from({ length: 16 }, () => 30 + Math.random() * 20),
    light: Array.from({ length: 16 }, () => 300 + Math.random() * 300),
  }));

  const makeSpark = (data: number[]) => {
    const mn = Math.min(...data), mx = Math.max(...data);
    const range = mx - mn || 1;
    return data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - mn) / range) * 80}`).join(' ');
  };

  const sensors: { label: string; value: string; unit: string; color: string; warn: boolean; sparkKey: keyof typeof sparklines }[] = [
    { label: 'Temperature', value: tempUnit === 'F' ? (temp * 9 / 5 + 32).toFixed(1) : temp.toFixed(1), unit: tempUnit === 'F' ? '°F' : '°C', color: temp > 25 ? X.amber : X.teal, warn: temp > 25, sparkKey: 'temp' },
    { label: 'Humidity', value: Math.round(humidity).toString(), unit: '%', color: humidity > 60 ? X.amber : X.teal, warn: humidity > 60, sparkKey: 'humidity' },
    { label: 'CO\u2082', value: Math.round(co2).toString(), unit: 'ppm', color: co2 > 500 ? X.amber : X.teal, warn: co2 > 500, sparkKey: 'co2' },
    { label: 'Noise', value: Math.round(noise).toString(), unit: 'dB', color: noise > 50 ? X.amber : X.teal, warn: noise > 50, sparkKey: 'noise' },
    { label: 'Light', value: Math.round(light).toString(), unit: 'lux', color: X.textSec, warn: false, sparkKey: 'light' },
  ];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Dot c={X.teal} pulse s={7} />
      </div>
      {sensors.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: i < sensors.length - 1 ? `1px solid ${X.borderLight}` : 'none', animation: `fu 150ms ${ease.o} ${i * 15}ms both` }}>
          <div style={{ width: 60 }}>
            <M style={{ fontSize: 8, color: X.textMut, display: 'block' }}>{s.label}</M>
            <M style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{s.value}<span style={{ fontSize: 8, color: X.textMut }}> {s.unit}</span></M>
          </div>
          {/* Mini sparkline */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ flex: 1, height: 18, overflow: 'hidden' }}>
            <polyline points={makeSpark(sparklines[s.sparkKey])} fill="none" stroke={s.color} strokeWidth="2" vectorEffect="non-scaling-stroke" opacity=".6" />
          </svg>
          {s.warn && <Dot c={X.amber} s={4} />}
        </div>
      ))}
    </Card>
  );
}
