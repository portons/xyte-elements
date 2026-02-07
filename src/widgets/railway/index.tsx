import { useState } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot } from '../primitives';
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

// ── Track Occupancy ──────────────────────────────────────────────────
export function TrackOccupancy({ title = 'Track Occupancy', sections = 8 }: { title?: string; sections?: number } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(2000);

  const sectionStates = Array.from({ length: sections }, (_, i) => {
    const seed = (tick + i * 7) % 11;
    return seed < 5 ? 'free' : seed < 8 ? 'occupied' : 'reserved';
  });

  const occupied = sectionStates.filter(s => s === 'occupied').length;
  const reserved = sectionStates.filter(s => s === 'reserved').length;
  const free = sectionStates.filter(s => s === 'free').length;

  const statusColor = occupied > sections * 0.7 ? X.red : occupied > sections * 0.4 ? X.amber : X.teal;

  const getColor = (state: string) => {
    if (state === 'occupied') return X.red;
    if (state === 'reserved') return X.amber;
    return X.teal;
  };

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={statusColor}>{occupied}/{sections} Occupied</Badge>
      </div>

      {/* Track diagram */}
      <div style={{
        padding: '14px 12px', borderRadius: 8,
        background: n.metal, boxShadow: n.raised, marginBottom: 12,
      }}>
        <svg viewBox={`0 0 ${sections * 40 + 10} 50`} style={{ width: '100%', height: 50, display: 'block' }}>
          <defs>
            <linearGradient id="rail-trk-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={X.surface} />
              <stop offset="100%" stopColor={X.bgAlt} />
            </linearGradient>
          </defs>
          {/* Rails */}
          <line x1="5" y1="18" x2={sections * 40 + 5} y2="18" stroke={X.border} strokeWidth="2" strokeLinecap="round" />
          <line x1="5" y1="32" x2={sections * 40 + 5} y2="32" stroke={X.border} strokeWidth="2" strokeLinecap="round" />

          {sectionStates.map((state, i) => {
            const x = 5 + i * 40;
            const c = getColor(state);
            return (
              <g key={i}>
                {/* Sleepers */}
                <rect x={x + 4} y="14" width="4" height="22" rx="1" fill={X.border} opacity={0.5} />
                <rect x={x + 16} y="14" width="4" height="22" rx="1" fill={X.border} opacity={0.5} />
                <rect x={x + 28} y="14" width="4" height="22" rx="1" fill={X.border} opacity={0.5} />

                {/* Track section highlight (beveled) */}
                <rect x={x + 2} y="12" width="34" height="26" rx="4"
                  fill={c + '15'} stroke={c + '40'} strokeWidth="1" />

                {/* LED indicator */}
                <circle cx={x + 19} cy="6" r="3.5"
                  fill={c} opacity={0.9}
                  style={{ filter: `drop-shadow(0 0 4px ${c})` }} />

                {/* Section label */}
                <text x={x + 19} y="47" textAnchor="middle"
                  fontFamily="monospace" fontSize="6" fill={X.textMut}>
                  {String(i + 1).padStart(2, '0')}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12, padding: '6px 8px', borderRadius: 6, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
        {([
          ['Free', free, X.teal],
          ['Occupied', occupied, X.red],
          ['Reserved', reserved, X.amber],
        ] as [string, number, string][]).map(([label, count, c], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Dot c={c} s={6} />
            <M style={{ fontSize: 9, color: X.textMut }}>{label}: </M>
            <M style={{ fontSize: 9, fontWeight: 700, color: c }}>{count}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Signal Head ──────────────────────────────────────────────────────
export function SignalHead({ title = 'Signal Head', aspectCount = 3 }: { title?: string; aspectCount?: number } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(3000);

  const clampedAspects = Math.max(2, Math.min(4, aspectCount));
  const activeAspect = tick % clampedAspects;

  const aspectColors = [X.red, X.amber, X.teal, '#ffffff'];
  const aspectLabels = ['Danger', 'Caution', 'Clear', 'Shunt'];

  const activeColor = aspectColors[activeAspect];
  const activeLabel = aspectLabels[activeAspect];

  const signalHeight = clampedAspects * 32 + 16;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={activeColor}>{activeLabel}</Badge>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Physical signal housing */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0,
        }}>
          <svg viewBox={`0 0 60 ${signalHeight + 40}`} style={{ width: 60, height: signalHeight + 40, display: 'block' }}>
            <defs>
              <linearGradient id="rail-sig-housing" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={X.border} />
                <stop offset="30%" stopColor={X.surface} />
                <stop offset="70%" stopColor={X.surface} />
                <stop offset="100%" stopColor={X.border} />
              </linearGradient>
              <radialGradient id="rail-sig-led" cx="0.35" cy="0.35" r="0.65">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Post */}
            <rect x="27" y={signalHeight + 4} width="6" height="34" rx="2"
              fill={X.border} stroke={X.textMut + '40'} strokeWidth="0.5" />

            {/* Housing body (metallic) */}
            <rect x="10" y="2" width="40" height={signalHeight} rx="6"
              fill="url(#rail-sig-housing)"
              stroke={X.textMut + '30'} strokeWidth="1" />

            {/* Housing bevel top highlight */}
            <rect x="11" y="3" width="38" height={signalHeight - 2} rx="5"
              fill="none" stroke="#ffffff08" strokeWidth="1" />

            {/* Visor hood */}
            <path d={`M8 6 Q8 2 12 2 L48 2 Q52 2 52 6 L50 10 L10 10 Z`}
              fill={X.border} stroke={X.textMut + '20'} strokeWidth="0.5" />

            {/* Aspect LEDs */}
            {Array.from({ length: clampedAspects }, (_, i) => {
              const cy = 20 + i * 32;
              const color = aspectColors[i];
              const isActive = i === activeAspect;

              return (
                <g key={i}>
                  {/* LED housing recess */}
                  <circle cx="30" cy={cy} r="12"
                    fill={X.bgAlt} stroke={X.border} strokeWidth="1" />

                  {/* LED itself */}
                  <circle cx="30" cy={cy} r="9"
                    fill={isActive ? color : X.border + '60'}
                    opacity={isActive ? 1 : 0.3}
                    style={{
                      filter: isActive ? `drop-shadow(0 0 8px ${color})` : 'none',
                      transition: `fill 400ms ${ease.o}, opacity 400ms ${ease.o}`,
                    }} />

                  {/* Glass highlight */}
                  {isActive && (
                    <circle cx="30" cy={cy} r="9" fill="url(#rail-sig-led)" />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Signal info panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Current aspect readout */}
          <div style={{
            padding: '10px 12px', borderRadius: 8,
            background: n.metal, boxShadow: n.concave, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 4 }}>Active Aspect</Lbl>
            <M style={{ fontSize: 22, fontWeight: 800, color: activeColor, display: 'block' }}>
              {activeLabel}
            </M>
            <M style={{ fontSize: 9, color: X.textMut }}>Aspect {activeAspect + 1} of {clampedAspects}</M>
          </div>

          {/* Aspect list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {Array.from({ length: clampedAspects }, (_, i) => {
              const isActive = i === activeAspect;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '4px 8px', borderRadius: 4,
                  background: isActive ? aspectColors[i] + '15' : 'transparent',
                  border: isActive ? `1px solid ${aspectColors[i]}30` : '1px solid transparent',
                  animation: `fu 150ms ${ease.o} ${i * 30}ms both`,
                }}>
                  <span style={{
                    display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                    background: isActive ? aspectColors[i] : X.border,
                    boxShadow: isActive ? `0 0 6px ${aspectColors[i]}50` : 'none',
                    animation: isActive ? 'br 2s ease infinite' : 'none',
                  }} />
                  <M style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? aspectColors[i] : X.textMut }}>
                    {aspectLabels[i]}
                  </M>
                </div>
              );
            })}
          </div>

          {/* Signal ID */}
          <div style={{
            padding: '5px 8px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
          }}>
            <M style={{ fontSize: 8, color: X.textMut }}>Signal ID: </M>
            <M style={{ fontSize: 8, fontWeight: 700, color: X.textSec, fontFamily: 'monospace' }}>SIG-{String(tick % 100).padStart(3, '0')}</M>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Train Schedule ───────────────────────────────────────────────────
export function TrainSchedule({ title = 'Departures', maxTrains = 5 }: { title?: string; maxTrains?: number } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(4000);

  const destinations = ['London Euston', 'Birmingham NS', 'Manchester Pic', 'Edinburgh Wav', 'Glasgow Ctrl', 'Bristol TM', 'Leeds Central', 'Cardiff Ctrl'];
  const platforms = ['1A', '2B', '3', '4C', '5', '6A', '7', '8B'];
  const statuses = ['On Time', 'On Time', 'Delayed', 'On Time', 'Cancelled', 'On Time', 'Boarding', 'On Time'];

  const clampedMax = Math.min(maxTrains, 8);

  const trains = Array.from({ length: clampedMax }, (_, i) => {
    const idx = (i + tick) % destinations.length;
    const hour = 6 + ((i * 2 + tick) % 16);
    const min = ((i * 17 + tick * 3) % 60);
    return {
      dest: destinations[idx],
      time: `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`,
      platform: platforms[(idx + i) % platforms.length],
      status: statuses[(idx + tick) % statuses.length],
    };
  });

  const getStatusColor = (s: string) => {
    if (s === 'Delayed') return X.amber;
    if (s === 'Cancelled') return X.red;
    if (s === 'Boarding') return X.teal;
    return X.textMut;
  };

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>Live</Badge>
      </div>

      {/* Embossed departure board */}
      <div style={{
        borderRadius: 8, overflow: 'hidden',
        background: n.metal, boxShadow: n.bezel,
      }}>
        {/* Header row */}
        <div style={{
          display: 'grid', gridTemplateColumns: '68px 1fr 48px 64px',
          padding: '6px 10px', gap: 4,
          background: X.bgAlt, borderBottom: `1px solid ${X.border}`,
        }}>
          <Lbl style={{ marginBottom: 0 }}>Time</Lbl>
          <Lbl style={{ marginBottom: 0 }}>Destination</Lbl>
          <Lbl style={{ marginBottom: 0 }}>Plat</Lbl>
          <Lbl style={{ marginBottom: 0, textAlign: 'right' }}>Status</Lbl>
        </div>

        {/* Train rows */}
        {trains.map((train, i) => {
          const sColor = getStatusColor(train.status);
          return (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '68px 1fr 48px 64px',
              padding: '7px 10px', gap: 4,
              borderBottom: i < trains.length - 1 ? `1px solid ${X.border}30` : 'none',
              background: i % 2 === 0 ? 'transparent' : X.bgAlt + '40',
              animation: `fu 150ms ${ease.o} ${i * 40}ms both`,
            }}>
              {/* Time - embossed look */}
              <M style={{
                fontSize: 13, fontWeight: 800, color: X.amber,
                fontFamily: 'monospace', letterSpacing: '.03em',
                textShadow: `0 1px 0 ${X.bg}80`,
              }}>
                {train.time}
              </M>

              {/* Destination */}
              <M style={{
                fontSize: 11, fontWeight: 600, color: X.text,
                textShadow: `0 1px 0 ${X.bg}40`,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {train.dest}
              </M>

              {/* Platform */}
              <M style={{
                fontSize: 12, fontWeight: 800, color: X.indigo,
                textAlign: 'center', fontFamily: 'monospace',
              }}>
                {train.platform}
              </M>

              {/* Status */}
              <M style={{
                fontSize: 9, fontWeight: 700, color: sColor,
                textAlign: 'right', lineHeight: '16px',
                animation: train.status === 'Boarding' ? 'br 2s ease infinite' : 'none',
              }}>
                {train.status}
              </M>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 8, padding: '5px 8px', borderRadius: 6,
        background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Updated every 30s</M>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Dot c={X.teal} pulse s={5} />
          <M style={{ fontSize: 8, color: X.teal, fontWeight: 600 }}>Live Feed</M>
        </div>
      </div>
    </Card>
  );
}

// ── Pantograph Monitor ───────────────────────────────────────────────
export function PantographMonitor({ title = 'Pantograph', voltageUnit = 'kV' }: { title?: string; voltageUnit?: string } = {}) {
  const X = getX();
  const n = neo();
  const voltage = useLive(25.0, 1.5, 2000);
  const currentDraw = useLive(420, 40, 2500);
  const contactForce = useLive(78, 5, 3000);
  const temperature = useLive(52, 4, 3500);

  const maxVoltage = 30;
  const normalizedV = Math.min(1, Math.max(0, voltage / maxVoltage));
  const needleAngle = useAnim(-135 + normalizedV * 270, 800);

  const voltageColor = voltage > 27 ? X.red : voltage < 22 ? X.amber : X.teal;
  const contactOk = contactForce > 60;
  const currentPct = Math.min(100, (currentDraw / 600) * 100);
  const animCurrent = useAnim(currentPct, 1000);

  return (
    <Card style={{ width: 350 }} glow={voltageColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Dot c={contactOk ? X.teal : X.red} pulse={!contactOk} s={7} />
          <Badge color={contactOk ? X.teal : X.red}>{contactOk ? 'Contact OK' : 'Low Contact'}</Badge>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        {/* Voltage gauge with metallic bezel */}
        <div style={{
          width: 130, height: 130, borderRadius: '50%',
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg viewBox="0 0 100 100" style={{ width: 110, height: 110, display: 'block' }}>
            <defs>
              <linearGradient id="rail-pg-face" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={X.surface} />
                <stop offset="100%" stopColor={X.bgAlt} />
              </linearGradient>
            </defs>
            {/* Gauge face */}
            <circle cx="50" cy="50" r="46" fill="url(#rail-pg-face)" stroke={X.border} strokeWidth=".5" />

            {/* Scale arc */}
            <path
              d={`M ${50 + 38 * Math.cos((-135 * Math.PI) / 180)} ${50 + 38 * Math.sin((-135 * Math.PI) / 180)} A 38 38 0 1 1 ${50 + 38 * Math.cos((135 * Math.PI) / 180)} ${50 + 38 * Math.sin((135 * Math.PI) / 180)}`}
              fill="none" stroke={X.borderLight} strokeWidth="3" strokeLinecap="round"
            />

            {/* Colored arc */}
            <path
              d={`M ${50 + 38 * Math.cos((-135 * Math.PI) / 180)} ${50 + 38 * Math.sin((-135 * Math.PI) / 180)} A 38 38 0 ${needleAngle > 0 ? 1 : 0} 1 ${50 + 38 * Math.cos(((needleAngle - 90) * Math.PI) / 180)} ${50 + 38 * Math.sin(((needleAngle - 90) * Math.PI) / 180)}`}
              fill="none" stroke={voltageColor} strokeWidth="3" strokeLinecap="round"
              style={{ transition: `d 800ms ${ease.o}`, filter: `drop-shadow(0 0 3px ${voltageColor}40)` }}
            />

            {/* Scale markings */}
            {[0, 5, 10, 15, 20, 25, 30].map((val, i) => {
              const pct = val / maxVoltage;
              const angle = (-135 + pct * 270 - 90) * (Math.PI / 180);
              const inner = 32;
              const outer = 36;
              const textR = 27;
              return (
                <g key={i}>
                  <line
                    x1={50 + inner * Math.cos(angle)} y1={50 + inner * Math.sin(angle)}
                    x2={50 + outer * Math.cos(angle)} y2={50 + outer * Math.sin(angle)}
                    stroke={X.textMut} strokeWidth=".6"
                  />
                  <text
                    x={50 + textR * Math.cos(angle)} y={50 + textR * Math.sin(angle) + 1.5}
                    textAnchor="middle" fontFamily="monospace" fontSize="5" fill={X.textMut}
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Needle */}
            <line
              x1="50" y1="50"
              x2={50 + 30 * Math.cos(((needleAngle - 90) * Math.PI) / 180)}
              y2={50 + 30 * Math.sin(((needleAngle - 90) * Math.PI) / 180)}
              stroke={X.red} strokeWidth="1.2" strokeLinecap="round"
              style={{ transition: `x2 800ms ${ease.o}, y2 800ms ${ease.o}`, filter: `drop-shadow(0 0 2px ${X.red}40)` }}
            />
            {/* Counterweight */}
            <line
              x1="50" y1="50"
              x2={50 - 8 * Math.cos(((needleAngle - 90) * Math.PI) / 180)}
              y2={50 - 8 * Math.sin(((needleAngle - 90) * Math.PI) / 180)}
              stroke={X.red} strokeWidth="2" strokeLinecap="round"
              style={{ transition: `x2 800ms ${ease.o}, y2 800ms ${ease.o}` }}
            />
            {/* Center cap */}
            <circle cx="50" cy="50" r="4" fill={X.surface} stroke={X.border} strokeWidth=".8" />
            <circle cx="50" cy="50" r="2" fill={X.textMut} />

            {/* Voltage readout */}
            <text x="50" y="70" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill={voltageColor}>
              {voltage.toFixed(1)}
            </text>
            <text x="50" y="76" textAnchor="middle" fontFamily="monospace" fontSize="4.5" fill={X.textMut}>
              {voltageUnit}
            </text>
          </svg>
        </div>

        {/* Right-side readouts */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Current draw bar */}
          <div style={{
            padding: '8px 10px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Lbl style={{ marginBottom: 0 }}>Current Draw</Lbl>
              <M style={{ fontSize: 11, fontWeight: 700, color: currentDraw > 500 ? X.red : X.indigo }}>
                {Math.round(currentDraw)} A
              </M>
            </div>
            <div style={{
              height: 8, borderRadius: 4,
              boxShadow: n.concave, background: n.metal,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 1, bottom: 1, left: 1,
                width: `${Math.min(100, Math.max(0, animCurrent))}%`,
                borderRadius: 3,
                background: `linear-gradient(90deg, ${X.indigo}60, ${X.indigo})`,
                transition: `width 600ms ${ease.sp}`,
                boxShadow: `0 0 6px ${X.indigo}30`,
              }} />
            </div>
          </div>

          {/* Contact force */}
          <div style={{
            padding: '6px 10px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          }}>
            <Lbl style={{ marginBottom: 2 }}>Contact Force</Lbl>
            <M style={{ fontSize: 14, fontWeight: 800, color: contactOk ? X.teal : X.red, display: 'block' }}>
              {contactForce.toFixed(0)} N
            </M>
          </div>

          {/* Temperature */}
          <div style={{
            padding: '6px 10px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          }}>
            <Lbl style={{ marginBottom: 2 }}>Strip Temp</Lbl>
            <M style={{ fontSize: 14, fontWeight: 800, color: temperature > 70 ? X.red : temperature > 55 ? X.amber : X.textSec, display: 'block' }}>
              {temperature.toFixed(1)}&#176;C
            </M>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Points Switch ────────────────────────────────────────────────────
export function PointsSwitch({ title = 'Points Control', switchCount = 4 }: { title?: string; switchCount?: number } = {}) {
  const X = getX();
  const n = neo();
  const clampedCount = Math.max(2, Math.min(6, switchCount));
  const [positions, setPositions] = useState<boolean[]>(() => Array(clampedCount).fill(false));

  const labels = ['PT-01', 'PT-02', 'PT-03', 'PT-04', 'PT-05', 'PT-06'];
  const routeLabels = ['Normal', 'Reverse'];

  const toggle = (idx: number) => {
    setPositions(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const normalCount = positions.filter(p => !p).length;
  const reverseCount = positions.filter(p => p).length;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>{clampedCount} Points</Badge>
      </div>

      {/* Metallic control panel */}
      <div style={{
        padding: '12px 14px', borderRadius: 8,
        background: n.metal, boxShadow: n.raised, marginBottom: 12,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(clampedCount, 3)}, 1fr)`,
          gap: 10,
        }}>
          {positions.map((isReverse, i) => {
            const ledColor = isReverse ? X.amber : X.teal;
            return (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                animation: `fu 150ms ${ease.o} ${i * 40}ms both`,
              }}>
                {/* Label */}
                <M style={{ fontSize: 9, fontWeight: 700, color: X.textMut, letterSpacing: '.05em' }}>
                  {labels[i]}
                </M>

                {/* Position LEDs (Normal / Reverse) */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {/* Normal LED */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <span style={{
                      display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                      background: !isReverse ? X.teal : X.border,
                      boxShadow: !isReverse ? `0 0 6px ${X.teal}50` : 'none',
                      animation: !isReverse ? 'br 2s ease infinite' : 'none',
                    }} />
                    <M style={{ fontSize: 6, color: X.textMut }}>N</M>
                  </div>
                  {/* Reverse LED */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <span style={{
                      display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                      background: isReverse ? X.amber : X.border,
                      boxShadow: isReverse ? `0 0 6px ${X.amber}50` : 'none',
                      animation: isReverse ? 'br 2s ease infinite' : 'none',
                    }} />
                    <M style={{ fontSize: 6, color: X.textMut }}>R</M>
                  </div>
                </div>

                {/* Physical toggle switch */}
                <button
                  onClick={() => toggle(i)}
                  style={{
                    width: 42, height: 52, borderRadius: 6, border: 'none',
                    background: isReverse
                      ? `linear-gradient(180deg, ${X.bgAlt}, ${X.surface})`
                      : `linear-gradient(180deg, ${X.surface}, ${X.bgAlt})`,
                    boxShadow: isReverse ? n.concave : n.raised,
                    cursor: 'pointer', position: 'relative',
                    transition: `box-shadow 200ms ${ease.o}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {/* Toggle handle */}
                  <div style={{
                    width: 20, height: 20, borderRadius: 4,
                    background: `linear-gradient(180deg, ${ledColor}cc, ${ledColor})`,
                    boxShadow: `0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)`,
                    transform: isReverse ? 'translateY(10px)' : 'translateY(-10px)',
                    transition: `transform 200ms ${ease.sp}, background 200ms ${ease.o}`,
                  }} />

                  {/* Slot groove */}
                  <div style={{
                    position: 'absolute', top: 8, bottom: 8, width: 2,
                    background: X.border, borderRadius: 1,
                  }} />
                </button>

                {/* Route label */}
                <M style={{ fontSize: 8, fontWeight: 600, color: ledColor }}>
                  {routeLabels[isReverse ? 1 : 0]}
                </M>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', padding: '6px 8px',
        borderRadius: 6, background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Dot c={X.teal} s={6} />
          <M style={{ fontSize: 9, color: X.textMut }}>Normal: </M>
          <M style={{ fontSize: 9, fontWeight: 700, color: X.teal }}>{normalCount}</M>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Dot c={X.amber} s={6} />
          <M style={{ fontSize: 9, color: X.textMut }}>Reverse: </M>
          <M style={{ fontSize: 9, fontWeight: 700, color: X.amber }}>{reverseCount}</M>
        </div>
      </div>
    </Card>
  );
}

// ── Platform Display ─────────────────────────────────────────────────
export function PlatformDisplay({ title = 'Platform Status', platformCount = 6 }: { title?: string; platformCount?: number } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(3000);

  const clampedCount = Math.max(2, Math.min(8, platformCount));

  const platformStates = Array.from({ length: clampedCount }, (_, i) => {
    const seed = (tick + i * 5 + i * i) % 13;
    if (seed < 4) return 'empty';
    if (seed < 8) return 'occupied';
    if (seed < 10) return 'arriving';
    return 'departing';
  });

  const trainIds = ['IC 204', 'RE 118', 'S3', 'ICE 571', 'TGV 29', 'EC 83', 'RB 42', 'IR 15'];

  const getStateColor = (state: string) => {
    if (state === 'occupied') return X.red;
    if (state === 'arriving') return X.amber;
    if (state === 'departing') return X.indigo;
    return X.teal;
  };

  const getStateLabel = (state: string) => {
    if (state === 'occupied') return 'Occupied';
    if (state === 'arriving') return 'Arriving';
    if (state === 'departing') return 'Departing';
    return 'Empty';
  };

  const occupied = platformStates.filter(s => s !== 'empty').length;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={occupied > clampedCount * 0.7 ? X.red : X.teal}>
          {occupied}/{clampedCount} Active
        </Badge>
      </div>

      {/* Platform grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(clampedCount, 3)}, 1fr)`,
        gap: 8, marginBottom: 10,
      }}>
        {platformStates.map((state, i) => {
          const c = getStateColor(state);
          const isEmpty = state === 'empty';
          const trainId = trainIds[(i + tick) % trainIds.length];

          return (
            <div key={i} style={{
              borderRadius: 8,
              background: X.bgAlt,
              boxShadow: n.concave,
              padding: '10px 8px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
              position: 'relative', overflow: 'hidden',
              animation: `fu 150ms ${ease.o} ${i * 30}ms both`,
            }}>
              {/* Concave well depth effect */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                borderRadius: 8,
                background: `radial-gradient(ellipse at 50% 30%, ${c}08 0%, transparent 70%)`,
              }} />

              {/* Platform number */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: n.metal, boxShadow: n.raised,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <M style={{ fontSize: 13, fontWeight: 800, color: c }}>{i + 1}</M>
              </div>

              {/* Status LED */}
              <span style={{
                display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                background: c,
                boxShadow: `0 0 6px ${c}50`,
                animation: (state === 'arriving' || state === 'departing') ? 'br 2s ease infinite' : 'none',
              }} />

              {/* State */}
              <M style={{ fontSize: 8, fontWeight: 700, color: c, textAlign: 'center' }}>
                {getStateLabel(state)}
              </M>

              {/* Train ID if not empty */}
              {!isEmpty && (
                <M style={{
                  fontSize: 9, fontWeight: 600, color: X.textSec,
                  fontFamily: 'monospace', textAlign: 'center',
                }}>
                  {trainId}
                </M>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{
        display: 'flex', gap: 10, flexWrap: 'wrap',
        padding: '6px 8px', borderRadius: 6,
        background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        {(['empty', 'occupied', 'arriving', 'departing'] as const).map((state) => (
          <div key={state} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Dot c={getStateColor(state)} s={5} />
            <M style={{ fontSize: 8, color: X.textMut }}>{getStateLabel(state)}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}
