import { useState, useMemo } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot, Prog } from '../primitives';
import { useAnim, useTick } from '../hooks';

// ── HVAC Zone ───────────────────────────────────────────────────────
export function HVACZone({ title = 'HVAC Zone', zone = 'Zone A — Lobby', setpoint = 22, mode = 'auto', temp, humidity, fanSpeed }: {
  title?: string; zone?: string; setpoint?: number; mode?: string; temp: number; humidity: number; fanSpeed: number;
}) {
  const X = getX();
  const [activeMode, setActiveMode] = useState(mode);

  const modeColor: Record<string, string> = { heat: X.amber, cool: X.indigo, auto: X.teal, off: X.textMut };
  const mc = modeColor[activeMode] || X.teal;
  const delta = temp - setpoint;
  const tempColor = Math.abs(delta) > 2 ? X.amber : Math.abs(delta) > 1 ? X.purple : X.teal;
  const animFan = useAnim(Math.max(0, Math.min(100, Math.round(fanSpeed))));

  return (
    <Card style={{ width: 350 }} glow={mc}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={mc} solid>{activeMode.toUpperCase()}</Badge>
      </div>
      {/* Temperature display */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 }}>
        <M style={{ fontSize: 32, fontWeight: 800, color: tempColor }}>{temp.toFixed(1)}</M>
        <M style={{ fontSize: 14, color: X.textMut }}>°C</M>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>Setpoint</Lbl>
          <M style={{ fontSize: 14, fontWeight: 700, color: X.textSec }}>{setpoint}°C</M>
        </div>
      </div>
      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
        {(['heat', 'cool', 'auto', 'off'] as const).map(m => (
          <button key={m} onClick={() => setActiveMode(m)} style={{
            flex: 1, padding: '4px 0', borderRadius: X.rs, cursor: 'pointer',
            background: activeMode === m ? modeColor[m] + '18' : 'transparent',
            border: `1px solid ${activeMode === m ? modeColor[m] + '40' : X.borderLight}`,
            transition: `background-color 180ms ${ease.mv}, border-color 180ms ${ease.mv}`,
          }}>
            <M style={{ fontSize: 8, fontWeight: 600, color: activeMode === m ? modeColor[m] : X.textMut, textTransform: 'uppercase' }}>{m}</M>
          </button>
        ))}
      </div>
      {/* Fan speed bar */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <Lbl>Fan Speed</Lbl>
          <M style={{ fontSize: 9, fontWeight: 700, color: mc }}>{Math.round(fanSpeed)}%</M>
        </div>
        <Prog value={animFan} color={mc} h={3} />
      </div>
      {/* Bottom stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Humidity</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.teal }}>{Math.round(humidity)}%</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Delta</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: tempColor }}>{delta > 0 ? '+' : ''}{delta.toFixed(1)}°</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Status</Lbl><div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end' }}><Dot c={mc} pulse s={5} /><M style={{ fontSize: 9, fontWeight: 600, color: mc }}>Active</M></div></div>
      </div>
    </Card>
  );
}

// ── Elevator Status ─────────────────────────────────────────────────
export function ElevatorStatus({ title = 'Elevator Status', totalFloors = 15 }: {
  title?: string; totalFloors?: number;
}) {
  const X = getX();
  const elevators = useMemo(() => [
    { id: 'A', target: 12, dir: 'up', load: 62 },
    { id: 'B', target: 1, dir: 'down', load: 35 },
    { id: 'C', target: 7, dir: 'up', load: 88 },
    { id: 'D', target: 3, dir: 'idle', load: 0 },
  ], []);

  const floorA = elevators[0].target;
  const floorB = elevators[1].target;
  const floorC = elevators[2].target;
  const floorD = elevators[3].target;
  const floors = [floorA, floorB, floorC, floorD];

  const loadA = elevators[0].load;
  const loadB = elevators[1].load;
  const loadC = elevators[2].load;
  const loadD = elevators[3].load;
  const loads = [loadA, loadB, loadC, loadD];

  const dirArrow: Record<string, string> = { up: '\u25B2', down: '\u25BC', idle: '\u25CF' };
  const dirColor = (d: string) => d === 'up' ? X.teal : d === 'down' ? X.indigo : X.textMut;

  return (
    <Card style={{ width: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{elevators.filter(e => e.dir !== 'idle').length} Moving</Badge>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
        {elevators.map((el, i) => {
          const fl = Math.max(1, Math.min(totalFloors, Math.round(floors[i])));
          const ld = Math.max(0, Math.min(100, Math.round(loads[i])));
          const lc = ld > 80 ? X.red : ld > 60 ? X.amber : X.teal;
          return (
            <div key={el.id} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '10px 6px', borderRadius: X.rs, background: X.bgAlt,
              border: `1px solid ${X.borderLight}`, animation: `fu 180ms ${ease.o} ${i * 30}ms both`,
            }}>
              <Lbl>Elev {el.id}</Lbl>
              {/* Direction arrow */}
              <M style={{ fontSize: 10, color: dirColor(el.dir) }}>{dirArrow[el.dir]}</M>
              {/* Floor number */}
              <M style={{ fontSize: 22, fontWeight: 800, color: X.text }}>{fl}</M>
              <M style={{ fontSize: 7, color: X.textMut }}>FLOOR</M>
              {/* Shaft visualization */}
              <div style={{ width: '100%', height: 40, background: X.bg, borderRadius: 3, border: `1px solid ${X.borderLight}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', left: '15%', right: '15%', height: 8, borderRadius: 2,
                  background: dirColor(el.dir), boxShadow: `0 0 6px ${dirColor(el.dir)}30`,
                  bottom: `${((fl - 1) / (totalFloors - 1)) * 100}%`,
                  transition: `bottom 800ms ${ease.mv}`,
                }} />
              </div>
              {/* Load bar */}
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <M style={{ fontSize: 7, color: X.textMut }}>Load</M>
                  <M style={{ fontSize: 7, fontWeight: 600, color: lc }}>{ld}%</M>
                </div>
                <Prog value={ld} color={lc} h={2} />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Parking Occupancy ───────────────────────────────────────────────
export function ParkingOccupancy({ title = 'Parking Occupancy', warningThreshold = 65 }: {
  title?: string; warningThreshold?: number;
}) {
  const X = getX();
  const levels = useMemo(() => [
    { name: 'P1', total: 120, used: 98 },
    { name: 'P2', total: 150, used: 112 },
    { name: 'P3', total: 100, used: 45 },
    { name: 'P4', total: 80, used: 22 },
  ], []);

  const totalSpots = levels.reduce((a, l) => a + l.total, 0);
  const totalUsed = levels.reduce((a, l) => a + l.used, 0);
  const overallPct = (totalUsed / totalSpots) * 100;
  const animPct = useAnim(overallPct, 1000);
  const overallColor = overallPct > 85 ? X.red : overallPct > warningThreshold ? X.amber : X.teal;

  return (
    <Card style={{ width: 360 }} glow={overallColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={overallColor}>{totalSpots - totalUsed} Free</Badge>
      </div>
      {/* Overall gauge */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <svg viewBox="0 0 100 100" style={{ width: 80, height: 80 }}>
          <circle cx="50" cy="50" r="40" fill="none" stroke={X.borderLight} strokeWidth="6" />
          <circle cx="50" cy="50" r="40" fill="none" stroke={overallColor} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${(animPct / 100) * 251} 251`}
            transform="rotate(-90 50 50)"
            style={{ transition: `stroke-dasharray 600ms ${ease.sp}, stroke 400ms`, filter: `drop-shadow(0 0 4px ${overallColor}40)` }} />
          <text x="50" y="46" textAnchor="middle" fontFamily={X.m} fontSize="16" fontWeight="800" fill={overallColor}>{Math.round(animPct)}%</text>
          <text x="50" y="58" textAnchor="middle" fontFamily={X.m} fontSize="6" fill={X.textMut}>OCCUPIED</text>
        </svg>
      </div>
      {/* Level breakdown */}
      <Lbl style={{ marginBottom: 6 }}>Level Breakdown</Lbl>
      {levels.map((lv, i) => {
        const pct = (lv.used / lv.total) * 100;
        const c = pct > 85 ? X.red : pct > warningThreshold ? X.amber : X.teal;
        const avail = lv.total - lv.used;
        return (
          <div key={i} style={{ marginBottom: i < levels.length - 1 ? 6 : 0, animation: `sr 150ms ${ease.o} ${i * 25}ms both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
              <M style={{ fontSize: 10, fontWeight: 700, color: X.text }}>{lv.name}</M>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <M style={{ fontSize: 8, color: X.textMut }}>{lv.used}/{lv.total}</M>
                <M style={{ fontSize: 9, fontWeight: 600, color: c }}>{avail} free</M>
              </div>
            </div>
            <Prog value={pct} color={c} h={3} />
          </div>
        );
      })}
    </Card>
  );
}

// ── Water Meter ─────────────────────────────────────────────────────
export function WaterMeter({ title = 'Water Consumption', flowUnit = 'L/min', flowRate, dailyUsage, monthlyUsage, pressure }: {
  title?: string; flowUnit?: string; flowRate: number; dailyUsage: number; monthlyUsage: number; pressure: number;
}) {
  const X = getX();
  const leakDetected = false;

  const dailyBars = useMemo(() => Array.from({ length: 7 }, () => 2200 + Math.random() * 1400), []);
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const mx = Math.max(...dailyBars, 1);

  return (
    <Card style={{ width: 350 }} glow={X.indigo}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Dot c={leakDetected ? X.red : X.teal} pulse={leakDetected} s={6} />
          <M style={{ fontSize: 8, fontWeight: 600, color: leakDetected ? X.red : X.teal }}>{leakDetected ? 'LEAK' : 'No Leak'}</M>
        </div>
      </div>
      {/* Current flow */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
        <M style={{ fontSize: 28, fontWeight: 800, color: X.indigo }}>{flowRate.toFixed(1)}</M>
        <M style={{ fontSize: 11, color: X.textMut }}>{flowUnit}</M>
        <div style={{ marginLeft: 'auto' }}>
          <Lbl style={{ marginBottom: 2 }}>Pressure</Lbl>
          <M style={{ fontSize: 11, fontWeight: 700, color: pressure < 3 ? X.amber : X.teal }}>{pressure.toFixed(1)} bar</M>
        </div>
      </div>
      {/* Usage stats */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
        <div><Lbl style={{ marginBottom: 2 }}>Today</Lbl><M style={{ fontSize: 13, fontWeight: 800, color: X.text }}>{Math.round(dailyUsage).toLocaleString()}<span style={{ fontSize: 9, color: X.textMut }}> L</span></M></div>
        <div><Lbl style={{ marginBottom: 2 }}>Monthly</Lbl><M style={{ fontSize: 13, fontWeight: 800, color: X.textSec }}>{(monthlyUsage / 1000).toFixed(1)}<span style={{ fontSize: 9, color: X.textMut }}> m\u00B3</span></M></div>
      </div>
      {/* Weekly bar chart */}
      <Lbl style={{ marginBottom: 4 }}>Last 7 Days</Lbl>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 32 }}>
        {dailyBars.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ width: '100%', height: `${(v / mx) * 100}%`, background: v > 3200 ? X.amber : X.indigo, borderRadius: 2, transition: 'height 300ms', minHeight: 2 }} />
            <M style={{ fontSize: 6, color: X.textMut }}>{days[i]}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Lighting Scene ──────────────────────────────────────────────────
export function LightingScene({ title = 'Lighting Control', defaultScene = 'Meeting', totalPower }: {
  title?: string; defaultScene?: string; totalPower: number;
}) {
  const X = getX();
  const zones = useMemo(() => [
    { name: 'Lobby', brightness: 85 },
    { name: 'Conf Room A', brightness: 60 },
    { name: 'Conf Room B', brightness: 0 },
    { name: 'Open Floor', brightness: 100 },
    { name: 'Corridor', brightness: 45 },
    { name: 'Executive', brightness: 72 },
  ], []);

  const [scene, setScene] = useState(defaultScene);
  const scenes = ['Meeting', 'Presentation', 'Off'];
  const sceneColor: Record<string, string> = { Meeting: X.amber, Presentation: X.purple, Off: X.textMut };
  const activeLights = zones.filter(z => z.brightness > 0).length;

  return (
    <Card style={{ width: 370 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.amber}>{activeLights}/{zones.length} Active</Badge>
      </div>
      {/* Scene presets */}
      <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
        {scenes.map(s => (
          <button key={s} onClick={() => setScene(s)} style={{
            flex: 1, padding: '5px 0', borderRadius: X.rs, cursor: 'pointer',
            background: scene === s ? (sceneColor[s]) + '18' : 'transparent',
            border: `1px solid ${scene === s ? sceneColor[s] + '40' : X.borderLight}`,
            transition: `background-color 180ms ${ease.mv}, border-color 180ms ${ease.mv}`,
          }}>
            <M style={{ fontSize: 8, fontWeight: 600, color: scene === s ? sceneColor[s] : X.textMut }}>{s}</M>
          </button>
        ))}
      </div>
      {/* Zone brightness bars */}
      {zones.map((z, i) => {
        const bc = z.brightness > 70 ? X.amber : z.brightness > 30 ? X.purple : z.brightness > 0 ? X.indigo : X.textMut;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', borderBottom: i < zones.length - 1 ? `1px solid ${X.borderLight}` : 'none', animation: `sr 150ms ${ease.o} ${i * 20}ms both` }}>
            <Dot c={z.brightness > 0 ? X.amber : X.textMut} s={5} />
            <M style={{ fontSize: 9, flex: 1, color: X.text }}>{z.name}</M>
            <div style={{ width: 60 }}>
              <Prog value={z.brightness} color={bc} h={3} />
            </div>
            <M style={{ fontSize: 9, fontWeight: 600, color: bc, minWidth: 26, textAlign: 'right' }}>{z.brightness}%</M>
          </div>
        );
      })}
      {/* Power draw */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <Lbl>Power Draw</Lbl>
        <M style={{ fontSize: 9, fontWeight: 700, color: X.amber }}>{totalPower.toFixed(1)} kW</M>
      </div>
    </Card>
  );
}

// ── Access Door ─────────────────────────────────────────────────────
export function AccessDoor({ title = 'Door Access', maxDoors = 8 }: {
  title?: string; maxDoors?: number;
}) {
  const X = getX();
  const doors = useMemo(() => [
    { name: 'Main Entrance', status: 'locked', lastAccess: '10:42', reader: true },
    { name: 'Loading Dock', status: 'locked', lastAccess: '09:15', reader: true },
    { name: 'Server Room', status: 'locked', lastAccess: '08:30', reader: true },
    { name: 'Stairwell N', status: 'unlocked', lastAccess: '10:38', reader: true },
    { name: 'Stairwell S', status: 'locked', lastAccess: '10:20', reader: false },
    { name: 'Parking Gate', status: 'unlocked', lastAccess: '10:41', reader: true },
    { name: 'Roof Access', status: 'locked', lastAccess: '07:00', reader: true },
    { name: 'Fire Exit E', status: 'propped', lastAccess: '10:35', reader: false },
  ], []);

  const visibleDoors = doors.slice(0, maxDoors);
  const statusColor: Record<string, string> = { locked: X.teal, unlocked: X.amber, propped: X.red };
  const statusIcon: Record<string, string> = { locked: '\u25A0', unlocked: '\u25A1', propped: '\u25A3' };
  const lockedCount = visibleDoors.filter(d => d.status === 'locked').length;
  const proppedCount = visibleDoors.filter(d => d.status === 'propped').length;

  return (
    <Card noPad style={{ width: 420 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <Badge color={X.teal}>{lockedCount} Secured</Badge>
          {proppedCount > 0 && <Badge color={X.red}>{proppedCount} Alert</Badge>}
        </div>
      </div>
      <div style={{ padding: '2px 6px 8px' }}>
        {/* Header row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 48px 20px', gap: 4, padding: '4px 8px', borderBottom: `1px solid ${X.borderLight}` }}>
          {['Door', 'Status', 'Last', 'Rdr'].map(h => <Lbl key={h}>{h}</Lbl>)}
        </div>
        {visibleDoors.map((d, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 60px 48px 20px', gap: 4, padding: '5px 8px',
            borderRadius: 3, background: i % 2 === 0 ? X.bgAlt : 'transparent',
            borderLeft: d.status === 'propped' ? `2px solid ${X.red}` : '2px solid transparent',
            animation: `sr 120ms ${ease.o} ${i * 15}ms both`,
          }}>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.text }}>{d.name}</M>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <M style={{ fontSize: 8, color: statusColor[d.status] }}>{statusIcon[d.status]}</M>
              <M style={{ fontSize: 8, fontWeight: 600, color: statusColor[d.status] }}>{d.status}</M>
            </div>
            <M style={{ fontSize: 8, color: X.textMut }}>{d.lastAccess}</M>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Dot c={d.reader ? X.teal : X.textMut} s={5} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Fire Panel ──────────────────────────────────────────────────────
export function FirePanel({ title = 'Fire Alarm Panel', zoneLayout = '4x2' }: {
  title?: string; zoneLayout?: string;
}) {
  const X = getX();
  const zones = useMemo(() => [
    { name: 'Z1 Lobby', status: 'normal' },
    { name: 'Z2 Office', status: 'normal' },
    { name: 'Z3 Server', status: 'normal' },
    { name: 'Z4 Kitchen', status: 'alert' },
    { name: 'Z5 Parking', status: 'normal' },
    { name: 'Z6 Mech', status: 'normal' },
    { name: 'Z7 Roof', status: 'disabled' },
    { name: 'Z8 Storage', status: 'normal' },
  ], []);

  const detectors = useMemo(() => ({ smoke: 64, heat: 32, sprinkler: 48 }), []);
  const zoneStatusColor: Record<string, string> = { normal: X.teal, alert: X.red, disabled: X.textMut };
  const alertCount = zones.filter(z => z.status === 'alert').length;
  const systemStatus = alertCount > 0 ? 'ALERT' : 'NORMAL';
  const systemColor = alertCount > 0 ? X.red : X.teal;

  const tick = useTick(2000);

  return (
    <Card style={{ width: 370 }} glow={alertCount > 0 ? X.red : undefined}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={systemColor} solid>{systemStatus}</Badge>
      </div>
      {/* Zone status grid */}
      <Lbl style={{ marginBottom: 4 }}>Zone Status</Lbl>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${zoneLayout === '2x4' ? 2 : 4}, 1fr)`, gap: 4, marginBottom: 10 }}>
        {zones.map((z, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '6px 4px', borderRadius: X.rs, background: X.bgAlt,
            border: `1px solid ${z.status === 'alert' ? X.red + '40' : X.borderLight}`,
            animation: `fu 180ms ${ease.o} ${i * 25}ms both`,
          }}>
            <Dot c={zoneStatusColor[z.status]} pulse={z.status === 'alert'} s={6} />
            <M style={{ fontSize: 7, fontWeight: 600, color: z.status === 'disabled' ? X.textMut : X.text, textAlign: 'center' }}>{z.name}</M>
          </div>
        ))}
      </div>
      {/* Detector counts */}
      <Lbl style={{ marginBottom: 4 }}>Detector Inventory</Lbl>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {([
          ['Smoke', detectors.smoke, X.amber],
          ['Heat', detectors.heat, X.red],
          ['Sprinkler', detectors.sprinkler, X.indigo],
        ] as [string, number, string][]).map(([label, count, color], i) => (
          <div key={i} style={{ flex: 1, padding: '6px 0', borderRadius: X.rs, background: color + '0a', border: `1px solid ${color}20`, textAlign: 'center', animation: `sr 150ms ${ease.o} ${i * 20}ms both` }}>
            <M style={{ fontSize: 14, fontWeight: 800, color, display: 'block', marginBottom: 2 }}>{count}</M>
            <M style={{ fontSize: 7, color: X.textMut }}>{label}</M>
          </div>
        ))}
      </div>
      {/* Bottom info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><Lbl style={{ marginBottom: 2 }}>System</Lbl><div style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Dot c={systemColor} pulse={alertCount > 0} s={5} /><M style={{ fontSize: 9, fontWeight: 600, color: systemColor }}>{systemStatus}</M></div></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Alerts</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: alertCount > 0 ? X.red : X.teal }}>{alertCount}</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Last Test</Lbl><M style={{ fontSize: 9, fontWeight: 600, color: X.textSec }}>2025-01-28</M></div>
      </div>
    </Card>
  );
}
