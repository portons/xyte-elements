import { useState } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { useAnim, useTick } from '../hooks';

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

// ── Attitude HUD ───────────────────────────────────────────────────
export function AttitudeHUD({ title = 'Attitude HUD', pitch = 5, roll = 10, yaw = 0 }: { title?: string; pitch?: number; roll?: number; yaw?: number }) {
  const X = getX();
  const n = neo();
  const animPitch = useAnim(pitch, 800);
  const animRoll = useAnim(roll, 800);
  const animYaw = useAnim(yaw, 800);

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={Math.abs(pitch) > 20 || Math.abs(roll) > 30 ? X.red : Math.abs(pitch) > 10 || Math.abs(roll) > 15 ? X.amber : X.teal}>
          {Math.abs(pitch) > 20 || Math.abs(roll) > 30 ? 'DANGER' : Math.abs(pitch) > 10 || Math.abs(roll) > 15 ? 'Caution' : 'Stable'}
        </Badge>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <div style={{
          width: 200, height: 200, borderRadius: 12,
          background: '#000', boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <svg viewBox="0 0 120 120" style={{ width: 190, height: 190, display: 'block' }}>
            <defs>
              <linearGradient id="drone-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={X.indigo} stopOpacity=".7" />
                <stop offset="100%" stopColor={X.indigo} stopOpacity=".3" />
              </linearGradient>
              <linearGradient id="drone-gnd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={X.amber} stopOpacity=".4" />
                <stop offset="100%" stopColor={X.amber} stopOpacity=".7" />
              </linearGradient>
              <clipPath id="drone-hud-clip">
                <rect x="5" y="5" width="110" height="110" rx="8" />
              </clipPath>
            </defs>

            <g clipPath="url(#drone-hud-clip)">
              {/* Horizon group - pitch translates, roll rotates */}
              <g style={{
                transformOrigin: '60px 60px',
                transform: `rotate(${animRoll}deg) translateY(${animPitch * 0.8}px)`,
                transition: `transform 600ms ${ease.o}`,
              }}>
                <rect x="-40" y="-100" width="240" height="160" fill="url(#drone-sky)" />
                <rect x="-40" y="60" width="240" height="160" fill="url(#drone-gnd)" />
                <line x1="-40" y1="60" x2="200" y2="60" stroke="#fff" strokeWidth="0.6" strokeOpacity="0.7" />

                {/* Pitch ladder lines */}
                {[-30, -20, -10, 10, 20, 30].map((p) => (
                  <g key={p}>
                    <line x1="40" y1={60 - p * 0.8} x2="50" y2={60 - p * 0.8}
                      stroke="#fff" strokeWidth="0.5" strokeOpacity="0.5" strokeDasharray={p < 0 ? '2,1' : 'none'} />
                    <line x1="70" y1={60 - p * 0.8} x2="80" y2={60 - p * 0.8}
                      stroke="#fff" strokeWidth="0.5" strokeOpacity="0.5" strokeDasharray={p < 0 ? '2,1' : 'none'} />
                    <text x="83" y={60 - p * 0.8 + 1.5} fontSize="3.5" fill="#fff" fillOpacity="0.5" fontFamily="monospace">{Math.abs(p)}</text>
                  </g>
                ))}
              </g>

              {/* Fixed HUD crosshair */}
              <line x1="22" y1="60" x2="50" y2="60" stroke={X.teal} strokeWidth="1" />
              <line x1="70" y1="60" x2="98" y2="60" stroke={X.teal} strokeWidth="1" />
              <line x1="60" y1="60" x2="60" y2="66" stroke={X.teal} strokeWidth="1" />
              <circle cx="60" cy="60" r="3" fill="none" stroke={X.teal} strokeWidth="0.8" />

              {/* Heading tape at bottom */}
              <rect x="20" y="102" width="80" height="12" fill="#00000080" rx="2" />
              {[-40, -20, 0, 20, 40].map((offset) => {
                const hdg = ((Math.round(animYaw) + offset) % 360 + 360) % 360;
                const xPos = 60 + offset * 0.8;
                return (
                  <g key={offset}>
                    <line x1={xPos} y1="102" x2={xPos} y2="104" stroke="#fff" strokeWidth="0.4" strokeOpacity="0.5" />
                    <text x={xPos} y="111" textAnchor="middle" fontSize="4" fill={offset === 0 ? X.teal : '#ffffffaa'} fontFamily="monospace">
                      {hdg}
                    </text>
                  </g>
                );
              })}
              <polygon points="60,101 58,103 62,103" fill={X.teal} />

              {/* Speed/Alt placeholders on left/right edges */}
              <rect x="5" y="54" width="14" height="12" fill="#00000080" rx="2" />
              <text x="12" y="62" textAnchor="middle" fontSize="5" fill={X.teal} fontFamily="monospace" fontWeight="700">
                {Math.round(Math.abs(pitch))}
              </text>
              <rect x="101" y="54" width="14" height="12" fill="#00000080" rx="2" />
              <text x="108" y="62" textAnchor="middle" fontSize="5" fill={X.teal} fontFamily="monospace" fontWeight="700">
                {Math.round(Math.abs(roll))}
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Readout row */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Pitch', val: pitch, unit: '\u00B0' },
          { label: 'Roll', val: roll, unit: '\u00B0' },
          { label: 'Yaw', val: yaw, unit: '\u00B0' },
        ].map((r) => (
          <div key={r.label} style={{
            flex: 1, padding: '6px 8px', borderRadius: 6,
            background: n.metal, boxShadow: n.concave, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 2 }}>{r.label}</Lbl>
            <M style={{ fontSize: 16, fontWeight: 800, color: Math.abs(r.val) > 15 ? X.amber : X.teal, display: 'block' }}>
              {r.val.toFixed(1)}{r.unit}
            </M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Battery Endurance ──────────────────────────────────────────────
export function BatteryEndurance({ title = 'Battery', voltageV = 22.8, capacityPct = 72, timeRemainingMin = 18 }: { title?: string; voltageV?: number; capacityPct?: number; timeRemainingMin?: number }) {
  const X = getX();
  const n = neo();
  const animPct = useAnim(capacityPct, 1000);
  const animV = useAnim(voltageV, 800);

  const battColor = capacityPct > 50 ? X.teal : capacityPct > 20 ? X.amber : X.red;

  return (
    <Card style={{ width: 350 }} glow={capacityPct < 15 ? X.red : undefined}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={battColor}>
          {capacityPct > 50 ? 'Good' : capacityPct > 20 ? 'Low' : 'Critical'}
        </Badge>
      </div>

      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
        {/* Battery icon SVG */}
        <div style={{ flexShrink: 0 }}>
          <svg viewBox="0 0 60 100" style={{ width: 60, height: 100, display: 'block' }}>
            {/* Battery terminal nub */}
            <rect x="18" y="2" width="24" height="8" rx="3" fill={X.surface} stroke={X.border} strokeWidth="1" />
            {/* Battery body */}
            <rect x="8" y="10" width="44" height="82" rx="6" fill="none" stroke={X.border} strokeWidth="1.5" />
            <rect x="8" y="10" width="44" height="82" rx="6" fill={X.bgAlt} />
            {/* Fill level */}
            <rect
              x="12" y={14 + (1 - animPct / 100) * 74}
              width="36" height={animPct / 100 * 74}
              rx="3"
              fill={battColor}
              fillOpacity="0.6"
              style={{ transition: `y 800ms ${ease.o}, height 800ms ${ease.o}, fill 400ms ${ease.o}` }}
            />
            {/* Battery segments */}
            {[0.25, 0.5, 0.75].map((seg) => (
              <line key={seg} x1="12" y1={14 + seg * 74} x2="48" y2={14 + seg * 74} stroke={X.border} strokeWidth="0.5" strokeOpacity="0.3" />
            ))}
            {/* Percentage text */}
            <text x="30" y="58" textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight="800" fill="#fff">
              {Math.round(animPct)}%
            </text>
          </svg>
        </div>

        {/* Stats column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            padding: '10px 12px', borderRadius: 6,
            background: '#000', boxShadow: n.concave, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 3 }}>Voltage</Lbl>
            <M style={{ fontSize: 26, fontWeight: 800, color: battColor, display: 'block' }}>
              {animV.toFixed(1)}V
            </M>
          </div>

          <div style={{
            padding: '8px 12px', borderRadius: 6,
            background: n.metal, boxShadow: n.concave, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 3 }}>Time Remaining</Lbl>
            <M style={{ fontSize: 20, fontWeight: 800, color: timeRemainingMin < 5 ? X.red : X.text, display: 'block' }}>
              {timeRemainingMin}m
            </M>
          </div>

          <Prog value={capacityPct} color={battColor} h={4} />
        </div>
      </div>

      {/* Voltage curve hint */}
      <div style={{
        padding: '6px 10px', borderRadius: 6,
        background: X.bgAlt, border: `1px solid ${X.borderLight}`,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Cell Avg</M>
        <M style={{ fontSize: 8, fontWeight: 600, color: X.textSec }}>{(voltageV / 6).toFixed(2)}V/cell</M>
      </div>
    </Card>
  );
}

// ── Waypoint Tracker ───────────────────────────────────────────────
export function WaypointTracker({ title = 'Waypoints', waypointCount = 8, currentWaypoint = 3 }: { title?: string; waypointCount?: number; currentWaypoint?: number }) {
  const X = getX();
  const n = neo();
  const tick = useTick(800);

  const wps = Math.max(2, Math.min(waypointCount, 12));
  const cur = Math.max(0, Math.min(currentWaypoint, wps - 1));
  const pct = wps > 1 ? (cur / (wps - 1)) * 100 : 0;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={cur === wps - 1 ? X.teal : X.indigo}>
          {cur === wps - 1 ? 'Complete' : `WP ${cur + 1}/${wps}`}
        </Badge>
      </div>

      {/* Waypoint path SVG */}
      <div style={{ marginBottom: 12 }}>
        <svg viewBox="0 0 310 60" style={{ width: '100%', height: 60, display: 'block' }}>
          {/* Connection lines */}
          {Array.from({ length: wps - 1 }, (_, i) => {
            const x1 = 15 + (i / (wps - 1)) * 280;
            const x2 = 15 + ((i + 1) / (wps - 1)) * 280;
            const completed = i < cur;
            return (
              <line key={i}
                x1={x1} y1="30" x2={x2} y2="30"
                stroke={completed ? X.teal : X.border}
                strokeWidth={completed ? "2" : "1"}
                strokeDasharray={completed ? 'none' : '4,3'}
                strokeOpacity={completed ? 0.8 : 0.4}
              />
            );
          })}

          {/* Waypoint dots */}
          {Array.from({ length: wps }, (_, i) => {
            const cx = 15 + (i / (wps - 1)) * 280;
            const isCompleted = i < cur;
            const isCurrent = i === cur;
            const r = isCurrent ? 8 : 5;
            return (
              <g key={i}>
                {isCurrent && (
                  <circle cx={cx} cy="30" r={12}
                    fill="none" stroke={X.teal} strokeWidth="1"
                    strokeOpacity={tick % 2 === 0 ? 0.6 : 0.2}
                    style={{ transition: `stroke-opacity 400ms ${ease.o}` }}
                  />
                )}
                <circle cx={cx} cy="30" r={r}
                  fill={isCompleted ? X.teal : isCurrent ? X.indigo : 'none'}
                  stroke={isCompleted ? X.teal : isCurrent ? X.indigo : X.textMut}
                  strokeWidth={isCurrent ? "2" : "1.5"}
                  style={{ filter: isCurrent ? `drop-shadow(0 0 4px ${X.indigo}80)` : 'none' }}
                />
                {isCompleted && (
                  <text x={cx} y="33" textAnchor="middle" fontSize="7" fill="#fff" fontWeight="700" fontFamily="monospace">
                    {'\u2713'}
                  </text>
                )}
                {isCurrent && (
                  <text x={cx} y="34" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="800" fontFamily="monospace">
                    {i + 1}
                  </text>
                )}
                {!isCompleted && !isCurrent && (
                  <text x={cx} y="33" textAnchor="middle" fontSize="6" fill={X.textMut} fontFamily="monospace">
                    {i + 1}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Progress bar */}
      <Prog value={pct} color={X.indigo} h={3} />

      <div style={{
        display: 'flex', justifyContent: 'space-between', marginTop: 8,
        padding: '6px 8px', borderRadius: 6,
        background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Mission Progress</M>
        <M style={{ fontSize: 8, fontWeight: 600, color: X.teal }}>{Math.round(pct)}%</M>
      </div>
    </Card>
  );
}

// ── Signal Link ────────────────────────────────────────────────────
export function SignalLink({ title = 'Signal Link', uplinkStrength = 85, downlinkStrength = 72 }: { title?: string; uplinkStrength?: number; downlinkStrength?: number }) {
  const X = getX();
  const n = neo();
  const animUp = useAnim(uplinkStrength, 800);
  const animDown = useAnim(downlinkStrength, 800);
  const tick = useTick(600);

  const barCount = 8;
  const signalColor = (pct: number) => pct > 60 ? X.teal : pct > 30 ? X.amber : X.red;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <Dot c={signalColor(uplinkStrength)} pulse={uplinkStrength < 30} s={6} />
          <Badge color={Math.min(uplinkStrength, downlinkStrength) > 50 ? X.teal : X.amber}>
            {Math.min(uplinkStrength, downlinkStrength) > 50 ? 'Connected' : 'Degraded'}
          </Badge>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
        {/* Uplink bars */}
        <div style={{ flex: 1 }}>
          <Lbl style={{ marginBottom: 6, textAlign: 'center' }}>Uplink</Lbl>
          <svg viewBox="0 0 120 60" style={{ width: '100%', height: 60, display: 'block' }}>
            {Array.from({ length: barCount }, (_, i) => {
              const threshold = ((i + 1) / barCount) * 100;
              const active = animUp >= threshold;
              const barH = 8 + (i / (barCount - 1)) * 42;
              const color = signalColor(uplinkStrength);
              return (
                <rect key={i}
                  x={6 + i * 14} y={55 - barH}
                  width="10" height={barH}
                  rx="2"
                  fill={active ? color : X.border}
                  fillOpacity={active ? 0.8 : 0.2}
                  style={{ transition: `fill 300ms ${ease.o}, fill-opacity 300ms ${ease.o}` }}
                />
              );
            })}
          </svg>
          <div style={{ textAlign: 'center', marginTop: 4 }}>
            <M style={{ fontSize: 18, fontWeight: 800, color: signalColor(uplinkStrength) }}>{Math.round(animUp)}%</M>
          </div>
        </div>

        {/* Center divider with arrows */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 6, padding: '0 4px',
        }}>
          <svg viewBox="0 0 20 60" style={{ width: 20, height: 60 }}>
            {/* Uplink arrow */}
            <polygon points="10,5 5,15 15,15" fill={X.teal} fillOpacity={tick % 3 === 0 ? 1 : 0.4} />
            <line x1="10" y1="15" x2="10" y2="28" stroke={X.teal} strokeWidth="1.5" strokeOpacity="0.4" />
            {/* Downlink arrow */}
            <line x1="10" y1="32" x2="10" y2="45" stroke={X.purple} strokeWidth="1.5" strokeOpacity="0.4" />
            <polygon points="10,55 5,45 15,45" fill={X.purple} fillOpacity={tick % 3 === 1 ? 1 : 0.4} />
          </svg>
        </div>

        {/* Downlink bars */}
        <div style={{ flex: 1 }}>
          <Lbl style={{ marginBottom: 6, textAlign: 'center' }}>Downlink</Lbl>
          <svg viewBox="0 0 120 60" style={{ width: '100%', height: 60, display: 'block' }}>
            {Array.from({ length: barCount }, (_, i) => {
              const threshold = ((i + 1) / barCount) * 100;
              const active = animDown >= threshold;
              const barH = 8 + (i / (barCount - 1)) * 42;
              const color = signalColor(downlinkStrength);
              return (
                <rect key={i}
                  x={6 + i * 14} y={55 - barH}
                  width="10" height={barH}
                  rx="2"
                  fill={active ? color : X.border}
                  fillOpacity={active ? 0.8 : 0.2}
                  style={{ transition: `fill 300ms ${ease.o}, fill-opacity 300ms ${ease.o}` }}
                />
              );
            })}
          </svg>
          <div style={{ textAlign: 'center', marginTop: 4 }}>
            <M style={{ fontSize: 18, fontWeight: 800, color: signalColor(downlinkStrength) }}>{Math.round(animDown)}%</M>
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex', gap: 8,
      }}>
        <div style={{
          flex: 1, padding: '6px 8px', borderRadius: 6,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 2 }}>Latency</Lbl>
          <M style={{ fontSize: 12, fontWeight: 700, color: X.textSec, display: 'block' }}>
            {Math.round(120 - (uplinkStrength + downlinkStrength) / 4)}ms
          </M>
        </div>
        <div style={{
          flex: 1, padding: '6px 8px', borderRadius: 6,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 2 }}>Freq</Lbl>
          <M style={{ fontSize: 12, fontWeight: 700, color: X.textSec, display: 'block' }}>2.4 GHz</M>
        </div>
      </div>
    </Card>
  );
}

// ── Payload Status ─────────────────────────────────────────────────
export function PayloadStatus({ title = 'Payload', cameraActive = true, storageUsedGB = 28.4, storageTotalGB = 64 }: { title?: string; cameraActive?: boolean; storageUsedGB?: number; storageTotalGB?: number }) {
  const X = getX();
  const n = neo();
  const tick = useTick(1000);
  const storagePct = Math.min((storageUsedGB / storageTotalGB) * 100, 100);
  const animStorage = useAnim(storagePct, 800);
  const storageColor = storagePct > 90 ? X.red : storagePct > 70 ? X.amber : X.teal;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={cameraActive ? X.teal : X.textMut}>
          {cameraActive ? 'Recording' : 'Idle'}
        </Badge>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        {/* Camera icon */}
        <div style={{
          width: 100, height: 100, borderRadius: 10,
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, position: 'relative',
        }}>
          <svg viewBox="0 0 60 60" style={{ width: 70, height: 70, display: 'block' }}>
            {/* Camera body */}
            <rect x="8" y="18" width="44" height="30" rx="4" fill={X.surface} stroke={X.border} strokeWidth="1" />
            {/* Lens */}
            <circle cx="30" cy="33" r="10" fill="none" stroke={X.textMut} strokeWidth="1.5" />
            <circle cx="30" cy="33" r="6" fill={X.bgAlt} stroke={X.border} strokeWidth="0.8" />
            <circle cx="30" cy="33" r="3" fill={cameraActive ? X.teal + '60' : X.bgAlt} />
            {/* Flash/sensor */}
            <rect x="38" y="22" width="6" height="4" rx="1" fill={X.textMut} fillOpacity="0.5" />
            {/* Recording indicator */}
            {cameraActive && (
              <circle cx="14" cy="23" r="3"
                fill={X.red}
                fillOpacity={tick % 2 === 0 ? 1 : 0.3}
              />
            )}
          </svg>
        </div>

        {/* Status info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <Dot c={cameraActive ? X.red : X.textMut} pulse={cameraActive} s={8} />
            <M style={{ fontSize: 12, fontWeight: 700, color: cameraActive ? X.text : X.textMut }}>
              {cameraActive ? 'REC' : 'STANDBY'}
            </M>
            {cameraActive && (
              <M style={{ fontSize: 10, color: X.textMut, marginLeft: 'auto' }}>4K/30fps</M>
            )}
          </div>

          <div style={{
            padding: '8px 10px', borderRadius: 6,
            background: n.metal, boxShadow: n.concave,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Lbl>Storage</Lbl>
              <M style={{ fontSize: 8, color: storageColor, fontWeight: 600 }}>{Math.round(animStorage)}%</M>
            </div>
            <Prog value={storagePct} color={storageColor} h={4} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <M style={{ fontSize: 8, color: X.textMut }}>{storageUsedGB.toFixed(1)} GB used</M>
              <M style={{ fontSize: 8, color: X.textMut }}>{storageTotalGB} GB</M>
            </div>
          </div>

          <div style={{
            padding: '4px 8px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          }}>
            <M style={{ fontSize: 8, color: X.textMut }}>
              Remaining: ~{Math.round((storageTotalGB - storageUsedGB) / 0.5)}min @ 4K
            </M>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Fleet Overview ─────────────────────────────────────────────────
export function FleetOverview({ title = 'Fleet Overview', droneCount = 6 }: { title?: string; droneCount?: number }) {
  const X = getX();
  const n = neo();
  const tick = useTick(2000);

  const count = Math.max(1, Math.min(droneCount, 12));
  const statusCycle: ('active' | 'idle' | 'warning' | 'offline')[] = ['active', 'active', 'idle', 'warning', 'active', 'offline', 'active', 'idle', 'active', 'active', 'warning', 'idle'];
  const statusColor = (s: string) => s === 'active' ? X.teal : s === 'idle' ? X.indigo : s === 'warning' ? X.amber : X.red;

  const cols = count <= 4 ? 2 : count <= 6 ? 3 : 4;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>{count} Units</Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8, marginBottom: 12 }}>
        {Array.from({ length: count }, (_, i) => {
          const status = statusCycle[i % statusCycle.length];
          const color = statusColor(status);
          return (
            <div key={i} style={{
              padding: '10px 6px', borderRadius: 8,
              background: n.metal, boxShadow: n.raised,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              border: `1px solid ${color}20`,
            }}>
              {/* Drone silhouette SVG */}
              <svg viewBox="0 0 40 30" style={{ width: 40, height: 30, display: 'block' }}>
                {/* Arms */}
                <line x1="8" y1="10" x2="32" y2="10" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
                <line x1="8" y1="18" x2="32" y2="18" stroke={color} strokeWidth="1.5" strokeOpacity="0.6" />
                {/* Body */}
                <ellipse cx="20" cy="14" rx="6" ry="5" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1" />
                {/* Rotors */}
                {[8, 32].map((x) => [10, 18].map((y) => (
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="5"
                    fill="none" stroke={color} strokeWidth="0.6" strokeOpacity={status === 'active' ? 0.6 : 0.2}
                    strokeDasharray={status === 'active' ? 'none' : '2,2'}
                  />
                )))}
                {/* Status light */}
                <circle cx="20" cy="14" r="2" fill={color}
                  fillOpacity={status === 'active' && tick % 2 === 0 ? 1 : status === 'active' ? 0.5 : 0.8}
                />
              </svg>

              <M style={{ fontSize: 8, fontWeight: 700, color: X.text }}>D-{String(i + 1).padStart(2, '0')}</M>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Dot c={color} pulse={status === 'active'} s={4} />
                <M style={{ fontSize: 7, color, fontWeight: 600, textTransform: 'uppercase' as const }}>{status}</M>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fleet summary */}
      <div style={{
        display: 'flex', gap: 6,
      }}>
        {[
          { label: 'Active', count: Array.from({ length: count }, (_, i) => statusCycle[i % statusCycle.length]).filter(s => s === 'active').length, color: X.teal },
          { label: 'Idle', count: Array.from({ length: count }, (_, i) => statusCycle[i % statusCycle.length]).filter(s => s === 'idle').length, color: X.indigo },
          { label: 'Alert', count: Array.from({ length: count }, (_, i) => statusCycle[i % statusCycle.length]).filter(s => s === 'warning' || s === 'offline').length, color: X.amber },
        ].map((s) => (
          <div key={s.label} style={{
            flex: 1, padding: '6px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
          }}>
            <M style={{ fontSize: 16, fontWeight: 800, color: s.color, display: 'block' }}>{s.count}</M>
            <M style={{ fontSize: 7, color: X.textMut }}>{s.label}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}
