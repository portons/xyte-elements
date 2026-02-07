import { useState } from 'react';
import { getX, ease, Card, Badge, Btn, Lbl, M, Dot } from '../primitives';
import { useAnim, useLive, useTick } from '../hooks';

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

// ── Crowd Density ────────────────────────────────────────────────────
export function CrowdDensity({ title = 'Crowd Density', maxCapacity = 50000 }: { title?: string; maxCapacity?: number } = {}) {
  const X = getX();
  const n = neo();

  const zones = [
    { name: 'North Stand', density: useLive(78, 6, 2800) },
    { name: 'South Stand', density: useLive(92, 4, 3200) },
    { name: 'East Wing', density: useLive(61, 8, 3000) },
    { name: 'West Wing', density: useLive(55, 7, 2600) },
    { name: 'VIP Box', density: useLive(44, 5, 3400) },
    { name: 'Pitch Side', density: useLive(85, 3, 3100) },
  ];

  const avgDensity = zones.reduce((s, z) => s + z.density, 0) / zones.length;
  const totalOccupancy = Math.round((avgDensity / 100) * maxCapacity);
  const animAvg = useAnim(avgDensity, 1200);
  const overallColor = avgDensity > 85 ? X.red : avgDensity > 65 ? X.amber : X.teal;
  const status = avgDensity > 85 ? 'Critical' : avgDensity > 65 ? 'High' : 'Normal';

  function heatColor(pct: number) {
    if (pct > 85) return X.red;
    if (pct > 70) return X.amber;
    if (pct > 50) return X.teal;
    return X.indigo;
  }

  return (
    <Card style={{ width: 350 }} glow={overallColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={overallColor}>{status}</Badge>
      </div>

      {/* Zone grid — 3x2 neumorphic cells */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6,
        marginBottom: 12,
      }}>
        {zones.map((z, i) => {
          const c = heatColor(z.density);
          return (
            <div key={i} style={{
              padding: '10px 6px', borderRadius: 8,
              background: n.metal, boxShadow: n.concave,
              textAlign: 'center', position: 'relative', overflow: 'hidden',
            }}>
              {/* Heat overlay */}
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 8,
                background: c, opacity: Math.min(0.18, (z.density / 100) * 0.22),
                transition: `opacity 600ms ${ease.o}`,
              }} />
              <Lbl style={{ marginBottom: 4, fontSize: 7, position: 'relative' }}>{z.name}</Lbl>
              <M style={{
                fontSize: 18, fontWeight: 800, color: c, display: 'block',
                position: 'relative',
              }}>
                {Math.round(z.density)}
              </M>
              <M style={{ fontSize: 8, color: X.textMut, position: 'relative' }}>%</M>
            </div>
          );
        })}
      </div>

      {/* Summary bar */}
      <div style={{
        padding: '8px 10px', borderRadius: 6,
        background: X.bgAlt, border: `1px solid ${X.borderLight}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: 8,
      }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Total Occupancy</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: overallColor }}>
            {totalOccupancy.toLocaleString()}
          </M>
          <M style={{ fontSize: 9, color: X.textMut }}> / {maxCapacity.toLocaleString()}</M>
        </div>
        <div style={{ width: 60 }}>
          <Lbl style={{ marginBottom: 2, textAlign: 'right' }}>Avg</Lbl>
          <M style={{ fontSize: 16, fontWeight: 800, color: overallColor, display: 'block', textAlign: 'right' }}>
            {Math.round(animAvg)}%
          </M>
        </div>
      </div>

      <div style={{
        height: 6, borderRadius: 3, boxShadow: n.concave,
        background: X.bgAlt, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: 3,
          width: `${Math.min(100, Math.max(0, animAvg))}%`,
          background: `linear-gradient(90deg, ${overallColor}80, ${overallColor})`,
          transition: `width 600ms ${ease.sp}`,
          boxShadow: `0 0 6px ${overallColor}30`,
        }} />
      </div>
    </Card>
  );
}

// ── Ticket Gate ──────────────────────────────────────────────────────
export function TicketGate({ title = 'Ticket Gates', gateCount = 8 }: { title?: string; gateCount?: number } = {}) {
  const X = getX();
  const n = neo();

  const gates = Array.from({ length: gateCount }, (_, i) => ({
    id: i + 1,
    entries: useLive(120 + i * 15, 12, 2200 + i * 200),
    throughput: useLive(24 + i * 2, 3, 2800 + i * 150),
    active: useLive(1, 0.4, 5000 + i * 500) > 0.6,
  }));

  const totalEntries = gates.reduce((s, g) => s + g.entries, 0);
  const activeGates = gates.filter(g => g.active).length;
  const statusColor = activeGates === gateCount ? X.teal : activeGates > gateCount / 2 ? X.amber : X.red;

  return (
    <Card style={{ width: 350 }} glow={statusColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={statusColor}>{activeGates}/{gateCount} Active</Badge>
      </div>

      {/* Gate LED panel with metallic frame */}
      <div style={{
        padding: 10, borderRadius: 8,
        background: n.metal, boxShadow: n.bezel,
        marginBottom: 12,
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(gateCount, 4)}, 1fr)`, gap: 6 }}>
          {gates.map((g, i) => (
            <div key={i} style={{
              padding: '8px 4px', borderRadius: 6,
              background: X.bgAlt, boxShadow: n.concave,
              textAlign: 'center',
            }}>
              {/* LED indicator */}
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: g.active ? X.teal : X.red,
                boxShadow: g.active ? `0 0 8px ${X.teal}60` : `0 0 4px ${X.red}40`,
                margin: '0 auto 6px',
                transition: `background 300ms ${ease.o}, box-shadow 300ms ${ease.o}`,
              }} />
              <Lbl style={{ marginBottom: 2, fontSize: 7 }}>Gate {g.id}</Lbl>
              <M style={{ fontSize: 14, fontWeight: 800, color: g.active ? X.text : X.textMut, display: 'block' }}>
                {Math.round(g.entries)}
              </M>
              <M style={{ fontSize: 7, color: X.textMut }}>entries</M>
            </div>
          ))}
        </div>
      </div>

      {/* Throughput bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
        {gates.slice(0, 4).map((g, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <M style={{ fontSize: 8, color: X.textMut, width: 32, textAlign: 'right' }}>G{g.id}</M>
            <div style={{ flex: 1, height: 4, borderRadius: 2, background: X.borderLight, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 2,
                width: `${Math.min(100, (g.throughput / 40) * 100)}%`,
                background: g.active ? X.teal : X.textMut,
                transition: `width 500ms ${ease.sp}`,
              }} />
            </div>
            <M style={{ fontSize: 8, color: X.textSec, width: 28 }}>{Math.round(g.throughput)}/m</M>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '6px 8px', borderRadius: 6,
        background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        <M style={{ fontSize: 9, color: X.textMut }}>Total Entries</M>
        <M style={{ fontSize: 12, fontWeight: 800, color: X.text }}>{Math.round(totalEntries).toLocaleString()}</M>
      </div>
    </Card>
  );
}

// ── Lighting Rig ─────────────────────────────────────────────────────
export function LightingRig({ title = 'Lighting Rig', fixtureCount = 6 }: { title?: string; fixtureCount?: number } = {}) {
  const X = getX();
  const n = neo();

  const fixtures = Array.from({ length: fixtureCount }, (_, i) => ({
    zone: ['Main Field', 'North End', 'South End', 'East Stand', 'West Stand', 'Stage'][i % 6],
    brightness: useLive(70 + i * 4, 8, 2600 + i * 300),
    power: useLive(1.8 + i * 0.3, 0.2, 3200 + i * 200),
  }));

  const avgBrightness = fixtures.reduce((s, f) => s + f.brightness, 0) / fixtures.length;
  const totalPower = fixtures.reduce((s, f) => s + f.power, 0);
  const statusColor = avgBrightness > 90 ? X.amber : avgBrightness > 50 ? X.teal : X.indigo;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={statusColor}>{Math.round(avgBrightness)}% Avg</Badge>
      </div>

      {/* Dimmer knobs grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10,
        marginBottom: 12,
      }}>
        {fixtures.map((f, i) => {
          const angle = -135 + (Math.min(100, Math.max(0, f.brightness)) / 100) * 270;
          const knobColor = f.brightness > 85 ? X.amber : f.brightness > 40 ? X.teal : X.indigo;
          return (
            <div key={i} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            }}>
              {/* Rotary knob SVG */}
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: n.metal, boxShadow: n.bezel,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg viewBox="0 0 60 60" style={{ width: 50, height: 50, display: 'block' }}>
                  <defs>
                    <radialGradient id={`stad-knob-${i}`} cx="40%" cy="35%">
                      <stop offset="0%" stopColor={X.surface} />
                      <stop offset="100%" stopColor={X.bgAlt} />
                    </radialGradient>
                  </defs>
                  {/* Knob background ring */}
                  <circle cx="30" cy="30" r="26" fill="none" stroke={X.borderLight}
                    strokeWidth="3" strokeDasharray="2 4" />
                  {/* Active arc */}
                  <circle cx="30" cy="30" r="26" fill="none" stroke={knobColor}
                    strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={`${(f.brightness / 100) * 163.4} 163.4`}
                    strokeDashoffset="40.8"
                    style={{
                      transform: 'rotate(-135deg)',
                      transformOrigin: '30px 30px',
                      transition: `stroke-dasharray 500ms ${ease.o}`,
                    }} />
                  {/* Knob body */}
                  <circle cx="30" cy="30" r="18" fill={`url(#stad-knob-${i})`}
                    stroke={X.border} strokeWidth="0.5" />
                  {/* Pointer line */}
                  <line x1="30" y1="30" x2="30" y2="15"
                    stroke={knobColor} strokeWidth="2" strokeLinecap="round"
                    style={{
                      transform: `rotate(${angle}deg)`,
                      transformOrigin: '30px 30px',
                      transition: `transform 500ms ${ease.o}`,
                    }} />
                  {/* Center dot */}
                  <circle cx="30" cy="30" r="3" fill={X.textMut} />
                </svg>
              </div>
              <Lbl style={{ fontSize: 7, textAlign: 'center' }}>{f.zone}</Lbl>
              <M style={{ fontSize: 11, fontWeight: 700, color: knobColor }}>
                {Math.round(f.brightness)}%
              </M>
            </div>
          );
        })}
      </div>

      {/* Footer stats */}
      <div style={{
        display: 'flex', gap: 10, padding: '8px 10px', borderRadius: 6,
        background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        <div style={{ flex: 1 }}>
          <Lbl style={{ marginBottom: 2 }}>Total Power</Lbl>
          <M style={{ fontSize: 12, fontWeight: 700, color: X.amber }}>{totalPower.toFixed(1)} kW</M>
        </div>
        <div style={{ flex: 1, textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>Fixtures</Lbl>
          <M style={{ fontSize: 12, fontWeight: 700, color: X.textSec }}>{fixtureCount} active</M>
        </div>
      </div>
    </Card>
  );
}

// ── PA System ────────────────────────────────────────────────────────
export function PASystem({ title = 'PA System', zoneCount = 4 }: { title?: string; zoneCount?: number } = {}) {
  const X = getX();
  const n = neo();
  const [activeZone, setActiveZone] = useState(0);
  const tick = useTick(120);

  const zoneNames = ['Main', 'North', 'South', 'East', 'West', 'Concourse', 'VIP', 'Stage'];
  const zones = Array.from({ length: zoneCount }, (_, i) => ({
    name: zoneNames[i % zoneNames.length],
    volume: useLive(72 + i * 3, 6, 1800 + i * 300),
    level: useLive(65 + i * 5, 14, 200 + i * 50),
  }));

  const activeLevel = zones[activeZone]?.level ?? 0;
  const activeVolume = zones[activeZone]?.volume ?? 0;
  const needleAngle = -45 + (Math.min(100, Math.max(0, activeLevel)) / 100) * 90;
  const vuColor = activeLevel > 85 ? X.red : activeLevel > 65 ? X.amber : X.teal;

  // LED bar segments
  const ledCount = 16;
  const litCount = Math.round((activeLevel / 100) * ledCount);

  return (
    <Card style={{ width: 350 }} glow={vuColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={vuColor}>
          <Dot c={vuColor} pulse s={5} /> Live
        </Badge>
      </div>

      {/* VU Meter with needle */}
      <div style={{
        padding: '14px 12px 8px', borderRadius: 10,
        background: n.metal, boxShadow: n.bezel,
        marginBottom: 12, position: 'relative',
      }}>
        <svg viewBox="0 0 200 110" style={{ width: '100%', height: 110, display: 'block' }}>
          <defs>
            <linearGradient id="stad-vu-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={X.bgAlt} />
              <stop offset="100%" stopColor={X.surface} />
            </linearGradient>
          </defs>
          {/* Meter face */}
          <rect x="10" y="5" width="180" height="95" rx="6" fill="url(#stad-vu-bg)"
            stroke={X.border} strokeWidth="0.5" />
          {/* Scale arc */}
          <path d="M 40 85 A 65 65 0 0 1 160 85" fill="none" stroke={X.borderLight} strokeWidth="1.5" />
          {/* Colored arc segments: green, yellow, red */}
          <path d="M 40 85 A 65 65 0 0 1 90 23" fill="none" stroke={X.teal} strokeWidth="2.5" opacity="0.5" />
          <path d="M 90 23 A 65 65 0 0 1 130 23" fill="none" stroke={X.amber} strokeWidth="2.5" opacity="0.5" />
          <path d="M 130 23 A 65 65 0 0 1 160 85" fill="none" stroke={X.red} strokeWidth="2.5" opacity="0.5" />
          {/* Scale ticks */}
          {Array.from({ length: 11 }, (_, i) => {
            const angle = -90 + i * 9;
            const rad = (angle * Math.PI) / 180;
            const inner = 55;
            const outer = 60;
            const cx = 100, cy = 85;
            return (
              <line key={i}
                x1={cx + Math.cos(rad) * inner} y1={cy + Math.sin(rad) * inner}
                x2={cx + Math.cos(rad) * outer} y2={cy + Math.sin(rad) * outer}
                stroke={X.textMut} strokeWidth={i % 5 === 0 ? '1.2' : '0.5'} />
            );
          })}
          {/* Scale labels */}
          <text x="38" y="96" fontSize="6" fill={X.textMut} fontFamily="monospace" textAnchor="middle">-20</text>
          <text x="100" y="18" fontSize="6" fill={X.textMut} fontFamily="monospace" textAnchor="middle">0</text>
          <text x="162" y="96" fontSize="6" fill={X.red} fontFamily="monospace" textAnchor="middle">+3</text>
          {/* Needle */}
          <line x1="100" y1="85"
            x2={100 + Math.cos(((needleAngle) * Math.PI) / 180) * 58}
            y2={85 + Math.sin(((needleAngle) * Math.PI) / 180) * 58}
            stroke={vuColor} strokeWidth="1.2" strokeLinecap="round"
            style={{ transition: `x2 150ms ${ease.mv}, y2 150ms ${ease.mv}` }} />
          {/* Needle pivot */}
          <circle cx="100" cy="85" r="4" fill={X.surface} stroke={X.border} strokeWidth="0.8" />
          <circle cx="100" cy="85" r="1.5" fill={vuColor} />
        </svg>
      </div>

      {/* LED bar */}
      <div style={{
        display: 'flex', gap: 2, marginBottom: 12, padding: '6px 8px',
        borderRadius: 6, background: X.bgAlt, boxShadow: n.concave,
      }}>
        {Array.from({ length: ledCount }, (_, i) => {
          const lit = i < litCount;
          const ledColor = i >= ledCount - 3 ? X.red : i >= ledCount - 6 ? X.amber : X.teal;
          return (
            <div key={i} style={{
              flex: 1, height: 14, borderRadius: 2,
              background: lit ? ledColor : X.borderLight,
              opacity: lit ? 1 : 0.3,
              boxShadow: lit ? `0 0 4px ${ledColor}40` : 'none',
              transition: `background 80ms ${ease.o}, opacity 80ms ${ease.o}`,
            }} />
          );
        })}
      </div>

      {/* Zone selector + volume */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        {zones.map((z, i) => (
          <Btn key={i} small ghost={i !== activeZone} active={i === activeZone}
            color={i === activeZone ? X.purple : undefined}
            onClick={() => setActiveZone(i)}>
            {z.name}
          </Btn>
        ))}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', padding: '6px 8px',
        borderRadius: 6, background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Volume</Lbl>
          <M style={{ fontSize: 12, fontWeight: 700, color: X.textSec }}>{Math.round(activeVolume)}%</M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>Level</Lbl>
          <M style={{ fontSize: 12, fontWeight: 700, color: vuColor }}>{Math.round(activeLevel)} dB</M>
        </div>
      </div>
    </Card>
  );
}

// ── Score Board ──────────────────────────────────────────────────────
export function ScoreBoard({ title = 'Scoreboard', sport = 'Football' }: { title?: string; sport?: string } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(1000);

  const homeScore = useLive(2, 0.3, 15000);
  const awayScore = useLive(1, 0.4, 18000);
  const minutes = Math.floor(tick / 6) % 90;
  const seconds = (tick * 10) % 60;
  const period = minutes < 45 ? '1st Half' : '2nd Half';

  const homeTeam = sport === 'Basketball' ? 'HAWKS' : 'UNITED';
  const awayTeam = sport === 'Basketball' ? 'WOLVES' : 'CITY FC';

  function segDigit(val: number, xOff: number, yOff: number, color: string) {
    const s = String(Math.round(Math.abs(val)) % 10);
    // Simplified seven-segment display using SVG text with emboss effect
    return (
      <g>
        {/* Embossed background panel */}
        <rect x={xOff} y={yOff} width="28" height="42" rx="3"
          fill={X.bgAlt} stroke={X.border} strokeWidth="0.5" />
        <rect x={xOff + 1} y={yOff + 1} width="26" height="40" rx="2.5"
          fill="none" stroke="#ffffff08" strokeWidth="0.5" />
        {/* Ghost segments (all 8s shown dimly) */}
        <text x={xOff + 14} y={yOff + 33} textAnchor="middle"
          fontFamily="monospace" fontSize="30" fontWeight="900"
          fill={color} opacity="0.1">
          8
        </text>
        {/* Active digit */}
        <text x={xOff + 14} y={yOff + 33} textAnchor="middle"
          fontFamily="monospace" fontSize="30" fontWeight="900"
          fill={color} style={{ filter: `drop-shadow(0 0 4px ${color}50)` }}>
          {s}
        </text>
      </g>
    );
  }

  const homeVal = Math.max(0, Math.round(homeScore));
  const awayVal = Math.max(0, Math.round(awayScore));
  const scoreColor = X.teal;

  return (
    <Card style={{ width: 350 }} glow={X.amber}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.amber}>{sport}</Badge>
      </div>

      {/* Main scoreboard display */}
      <div style={{
        padding: '14px 10px', borderRadius: 10,
        background: n.metal, boxShadow: n.bezel,
        marginBottom: 12,
      }}>
        <svg viewBox="0 0 260 90" style={{ width: '100%', height: 90, display: 'block' }}>
          <defs>
            <linearGradient id="stad-sb-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={X.bgAlt} />
              <stop offset="100%" stopColor={X.surface} />
            </linearGradient>
          </defs>
          {/* Board face */}
          <rect x="2" y="2" width="256" height="86" rx="6" fill="url(#stad-sb-bg)"
            stroke={X.border} strokeWidth="0.8" />

          {/* Home team label */}
          <text x="55" y="18" textAnchor="middle" fontFamily="monospace"
            fontSize="9" fontWeight="700" fill={X.textMut}>
            {homeTeam}
          </text>
          {/* Home score digits */}
          {segDigit(Math.floor(homeVal / 10), 26, 24, scoreColor)}
          {segDigit(homeVal % 10, 58, 24, scoreColor)}

          {/* Colon / separator */}
          <text x="130" y="54" textAnchor="middle" fontFamily="monospace"
            fontSize="24" fontWeight="900" fill={X.amber}
            opacity={tick % 2 === 0 ? 1 : 0.3}>
            :
          </text>

          {/* Away team label */}
          <text x="205" y="18" textAnchor="middle" fontFamily="monospace"
            fontSize="9" fontWeight="700" fill={X.textMut}>
            {awayTeam}
          </text>
          {/* Away score digits */}
          {segDigit(Math.floor(awayVal / 10), 176, 24, scoreColor)}
          {segDigit(awayVal % 10, 208, 24, scoreColor)}

          {/* Time display */}
          <text x="130" y="82" textAnchor="middle" fontFamily="monospace"
            fontSize="11" fontWeight="700" fill={X.amber}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </text>
        </svg>
      </div>

      {/* Period + stats */}
      <div style={{
        display: 'flex', gap: 8,
      }}>
        <div style={{
          flex: 1, padding: '8px 10px', borderRadius: 6,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 3 }}>Period</Lbl>
          <M style={{ fontSize: 11, fontWeight: 700, color: X.amber }}>{period}</M>
        </div>
        <div style={{
          flex: 1, padding: '8px 10px', borderRadius: 6,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 3 }}>Possession</Lbl>
          <M style={{ fontSize: 11, fontWeight: 700, color: X.teal }}>
            {homeVal >= awayVal ? homeTeam : awayTeam}
          </M>
        </div>
        <div style={{
          flex: 1, padding: '8px 10px', borderRadius: 6,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 3 }}>Status</Lbl>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Dot c={X.teal} pulse s={5} />
            <M style={{ fontSize: 11, fontWeight: 700, color: X.teal }}>Live</M>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Turnstile Flow ───────────────────────────────────────────────────
export function TurnstileFlow({ title = 'Turnstile Flow', entryPoints = 4 }: { title?: string; entryPoints?: number } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(800);

  const turnstiles = Array.from({ length: entryPoints }, (_, i) => ({
    label: String.fromCharCode(65 + i),
    entries: useLive(1240 + i * 180, 30, 3000 + i * 400),
    exits: useLive(890 + i * 120, 25, 3200 + i * 350),
    rpm: useLive(12 + i * 2, 3, 2000 + i * 300),
  }));

  const totalEntries = turnstiles.reduce((s, t) => s + t.entries, 0);
  const totalExits = turnstiles.reduce((s, t) => s + t.exits, 0);
  const netFlow = totalEntries - totalExits;
  const flowColor = netFlow > 0 ? X.teal : X.amber;

  return (
    <Card style={{ width: 350 }} glow={flowColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={flowColor}>Net {netFlow > 0 ? '+' : ''}{Math.round(netFlow)}</Badge>
      </div>

      {/* Counter dials row */}
      <div style={{
        display: 'flex', gap: 8, marginBottom: 12,
      }}>
        {turnstiles.map((t, i) => {
          const entryStr = String(Math.round(Math.abs(t.entries))).padStart(4, '0');
          const rotation = (tick + i * 3) * 36;
          return (
            <div key={i} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}>
              <Lbl style={{ fontSize: 8 }}>Gate {t.label}</Lbl>
              {/* Mechanical counter dial */}
              <div style={{
                width: 68, height: 68, borderRadius: '50%',
                background: n.metal, boxShadow: n.bezel,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative',
              }}>
                <svg viewBox="0 0 60 60" style={{ width: 52, height: 52, display: 'block' }}>
                  <defs>
                    <radialGradient id={`stad-dial-${i}`} cx="45%" cy="40%">
                      <stop offset="0%" stopColor={X.surface} />
                      <stop offset="100%" stopColor={X.bgAlt} />
                    </radialGradient>
                  </defs>
                  {/* Outer ring */}
                  <circle cx="30" cy="30" r="27" fill={`url(#stad-dial-${i})`}
                    stroke={X.border} strokeWidth="0.5" />
                  {/* Tick marks */}
                  {Array.from({ length: 12 }, (_, j) => {
                    const a = (j * 30 * Math.PI) / 180;
                    return (
                      <line key={j}
                        x1={30 + Math.cos(a) * 22} y1={30 + Math.sin(a) * 22}
                        x2={30 + Math.cos(a) * 25} y2={30 + Math.sin(a) * 25}
                        stroke={X.textMut} strokeWidth={j % 3 === 0 ? '1' : '0.4'} />
                    );
                  })}
                  {/* Spinning indicator hand */}
                  <line x1="30" y1="30"
                    x2={30 + Math.cos((rotation * Math.PI) / 180) * 16}
                    y2={30 + Math.sin((rotation * Math.PI) / 180) * 16}
                    stroke={X.teal} strokeWidth="1.2" strokeLinecap="round" />
                  {/* Center */}
                  <circle cx="30" cy="30" r="3.5" fill={X.surface} stroke={X.border} strokeWidth="0.5" />
                  <circle cx="30" cy="30" r="1.5" fill={X.textMut} />
                </svg>
              </div>
              {/* Mechanical digit counter */}
              <div style={{
                display: 'flex', gap: 1, padding: '3px 4px',
                borderRadius: 4, background: X.bgAlt, boxShadow: n.concave,
              }}>
                {entryStr.split('').map((d, j) => (
                  <div key={j} style={{
                    width: 12, height: 16, borderRadius: 2,
                    background: X.surface, border: `1px solid ${X.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <M style={{ fontSize: 10, fontWeight: 800, color: X.text }}>{d}</M>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Entry / Exit summary */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{
          flex: 1, padding: '8px 10px', borderRadius: 6,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`,
        }}>
          <Lbl style={{ marginBottom: 2 }}>Total In</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: X.teal }}>
            {Math.round(totalEntries).toLocaleString()}
          </M>
        </div>
        <div style={{
          flex: 1, padding: '8px 10px', borderRadius: 6,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`,
        }}>
          <Lbl style={{ marginBottom: 2 }}>Total Out</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: X.amber }}>
            {Math.round(totalExits).toLocaleString()}
          </M>
        </div>
        <div style={{
          flex: 1, padding: '8px 10px', borderRadius: 6,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`,
        }}>
          <Lbl style={{ marginBottom: 2 }}>Throughput</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: X.textSec }}>
            {Math.round(turnstiles.reduce((s, t) => s + t.rpm, 0))}/m
          </M>
        </div>
      </div>
    </Card>
  );
}
