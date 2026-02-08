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

// ── Speedometer ─────────────────────────────────────────────────────
export function Speedometer({ title = 'Speed', maxSpeed = 260, speed }: { title?: string; maxSpeed?: number; speed: number }) {
  const X = getX();
  const n = neo();
  const tick = useTick(1000);
  const pct = Math.max(0, Math.min(1, speed / maxSpeed));
  const sweepDeg = 270;
  const startAngle = -225;
  const needleAngle = startAngle + pct * sweepDeg;

  // Odometer: slowly incrementing
  const baseOdo = 87432;
  const odoValue = baseOdo + tick;
  const odoStr = String(odoValue).padStart(6, '0');
  const cellH = 16;

  // Color zones on arc
  const zoneColors = [
    { start: 0, end: 0.38, color: X.teal },
    { start: 0.38, end: 0.62, color: X.amber },
    { start: 0.62, end: 0.77, color: '#e8822a' },
    { start: 0.77, end: 1, color: X.red },
  ];

  // Scale markings every 20 km/h
  const markings: number[] = [];
  for (let v = 0; v <= maxSpeed; v += 20) markings.push(v);

  return (
    <Card style={{ width: 350 }} glow={X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={speed > maxSpeed * 0.77 ? X.red : X.teal}>{Math.round(speed)} km/h</Badge>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <div style={{ width: 200, height: 200, borderRadius: '50%', background: n.metal, boxShadow: n.bezel, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 180, height: 180, borderRadius: '50%', background: X.bg, boxShadow: n.concave, position: 'relative', overflow: 'hidden' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              {/* Color zone arcs */}
              {zoneColors.map((z, i) => {
                const r = 40;
                const circ = 2 * Math.PI * r;
                const arcLen = (z.end - z.start) * (sweepDeg / 360) * circ;
                const offset = -(z.start * (sweepDeg / 360) * circ);
                return (
                  <circle key={i} cx="50" cy="50" r={r} fill="none"
                    stroke={z.color} strokeWidth="3" strokeOpacity=".25"
                    strokeDasharray={`${arcLen} ${circ - arcLen}`}
                    strokeDashoffset={offset}
                    transform="rotate(-225 50 50)" />
                );
              })}

              {/* Scale markings */}
              {markings.map((v, i) => {
                const frac = v / maxSpeed;
                const angleDeg = -225 + frac * sweepDeg;
                const aRad = angleDeg * Math.PI / 180;
                const major = v % 40 === 0;
                const r1 = major ? 33 : 35;
                const r2 = 39;
                const x1 = 50 + r1 * Math.cos(aRad);
                const y1 = 50 + r1 * Math.sin(aRad);
                const x2 = 50 + r2 * Math.cos(aRad);
                const y2 = 50 + r2 * Math.sin(aRad);
                return (
                  <g key={i}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={major ? X.text : X.textMut}
                      strokeWidth={major ? '0.8' : '0.4'} />
                    {major && (
                      <text
                        x={50 + 28 * Math.cos(aRad)}
                        y={50 + 28 * Math.sin(aRad) + 1.5}
                        textAnchor="middle" fontFamily={X.m} fontSize="4"
                        fontWeight="600" fill={X.textMut}>
                        {v}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Needle */}
              <line
                x1="50" y1="50"
                x2={50 + 30 * Math.cos(needleAngle * Math.PI / 180)}
                y2={50 + 30 * Math.sin(needleAngle * Math.PI / 180)}
                stroke={X.red} strokeWidth="1.2" strokeLinecap="round"
                style={{ transition: `x2 500ms ${ease.sp}, y2 500ms ${ease.sp}`, filter: `drop-shadow(0 0 3px ${X.red}80)` }} />
              <circle cx="50" cy="50" r="2.5" fill={X.red} style={{ filter: `drop-shadow(0 0 2px ${X.red}60)` }} />

              {/* Speed readout */}
              <text x="50" y="68" textAnchor="middle" fontFamily={X.m} fontSize="10" fontWeight="800" fill={X.text}>
                {Math.round(speed)}
              </text>
              <text x="50" y="73" textAnchor="middle" fontFamily={X.m} fontSize="3.5" fill={X.textMut}>km/h</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Drum Odometer */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
        <div style={{ display: 'flex', gap: 1, background: X.bgAlt, borderRadius: 4, padding: '2px 4px', boxShadow: n.concave }}>
          {odoStr.split('').map((digit, i) => {
            const d = parseInt(digit, 10);
            return (
              <div key={i} style={{
                width: 14, height: cellH, overflow: 'hidden',
                borderRadius: 2,
                background: X.bg,
                border: `1px solid ${X.borderLight}`,
                position: 'relative',
              }}>
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  transform: `translateY(${-d * cellH}px)`,
                  transition: `transform 600ms ${ease.sp}`,
                }}>
                  {Array.from({ length: 10 }, (_, n) => (
                    <div key={n} style={{
                      height: cellH, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: X.m, fontSize: 10, fontWeight: 700, color: X.text, flexShrink: 0,
                    }}>
                      {n}
                    </div>
                  ))}
                </div>
                {/* Curved shadow overlay */}
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  boxShadow: `inset 0 4px 4px ${X.bg}cc, inset 0 -4px 4px ${X.bg}cc`,
                }} />
              </div>
            );
          })}
          <M style={{ fontSize: 7, color: X.textMut, alignSelf: 'center', marginLeft: 3 }}>km</M>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Speed</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: speed > maxSpeed * 0.77 ? X.red : X.teal }}>{Math.round(speed)} km/h</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Max</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{maxSpeed}</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Odometer</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.purple }}>{odoValue.toLocaleString()}</M></div>
      </div>
    </Card>
  );
}

// ── Tachometer ──────────────────────────────────────────────────────
export function Tachometer({ title = 'Tachometer', redline = 7000, rpm }: { title?: string; redline?: number; rpm: number }) {
  const X = getX();
  const n = neo();
  const maxRPM = 8000;
  const pct = Math.max(0, Math.min(1, rpm / maxRPM));
  const sweepDeg = 270;
  const startAngle = -225;
  const needleAngle = startAngle + pct * sweepDeg;

  // Thermal palette: indigo (cold) -> teal -> amber -> red (hot)
  const thermalStops = [
    { at: 0, color: X.indigo },
    { at: 0.33, color: X.teal },
    { at: 0.66, color: X.amber },
    { at: 1, color: X.red },
  ];

  // Interpolate needle color based on RPM fraction
  const getNeedleColor = (frac: number) => {
    if (frac < 0.33) return X.indigo;
    if (frac < 0.5) return X.teal;
    if (frac < 0.75) return X.amber;
    return X.red;
  };
  const needleColor = getNeedleColor(pct);

  // Redline zone start fraction
  const redlineStart = 6500 / maxRPM;
  const redlineEnd = 1;

  // Scale markings every 1000 RPM
  const markings: number[] = [];
  for (let v = 0; v <= maxRPM; v += 1000) markings.push(v);

  return (
    <Card style={{ width: 350 }} glow={needleColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={rpm >= redline ? X.red : X.teal}>{rpm >= redline ? 'REDLINE' : 'NORMAL'}</Badge>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <div style={{ width: 200, height: 200, borderRadius: '50%', background: n.metal, boxShadow: n.bezel, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 180, height: 180, borderRadius: '50%', background: X.bg, boxShadow: n.concave, position: 'relative', overflow: 'hidden' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              <defs>
                <linearGradient id="auto-tacho-thermal" gradientUnits="userSpaceOnUse"
                  x1={50 + 40 * Math.cos(startAngle * Math.PI / 180)}
                  y1={50 + 40 * Math.sin(startAngle * Math.PI / 180)}
                  x2={50 + 40 * Math.cos((startAngle + sweepDeg) * Math.PI / 180)}
                  y2={50 + 40 * Math.sin((startAngle + sweepDeg) * Math.PI / 180)}>
                  {thermalStops.map((s, i) => (
                    <stop key={i} offset={`${s.at * 100}%`} stopColor={s.color} stopOpacity=".5" />
                  ))}
                </linearGradient>
              </defs>

              {/* Background thermal arc */}
              {(() => {
                const r = 40;
                const circ = 2 * Math.PI * r;
                const arcLen = (sweepDeg / 360) * circ;
                return (
                  <circle cx="50" cy="50" r={r} fill="none"
                    stroke="url(#auto-tacho-thermal)" strokeWidth="4"
                    strokeDasharray={`${arcLen} ${circ - arcLen}`}
                    transform="rotate(-225 50 50)" />
                );
              })()}

              {/* Redline zone */}
              {(() => {
                const r = 40;
                const circ = 2 * Math.PI * r;
                const arcLen = (redlineEnd - redlineStart) * (sweepDeg / 360) * circ;
                const offset = -(redlineStart * (sweepDeg / 360) * circ);
                return (
                  <circle cx="50" cy="50" r={r} fill="none"
                    stroke={X.red} strokeWidth="4" strokeOpacity=".35"
                    strokeDasharray={`${arcLen} ${circ - arcLen}`}
                    strokeDashoffset={offset}
                    transform="rotate(-225 50 50)" />
                );
              })()}

              {/* Scale markings */}
              {markings.map((v, i) => {
                const frac = v / maxRPM;
                const angleDeg = -225 + frac * sweepDeg;
                const aRad = angleDeg * Math.PI / 180;
                const r1 = 33;
                const r2 = 38;
                const x1 = 50 + r1 * Math.cos(aRad);
                const y1 = 50 + r1 * Math.sin(aRad);
                const x2 = 50 + r2 * Math.cos(aRad);
                const y2 = 50 + r2 * Math.sin(aRad);
                const isRedzone = v >= 6500;
                return (
                  <g key={i}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={isRedzone ? X.red : X.textMut}
                      strokeWidth="0.8" />
                    <text
                      x={50 + 27 * Math.cos(aRad)}
                      y={50 + 27 * Math.sin(aRad) + 1.5}
                      textAnchor="middle" fontFamily={X.m} fontSize="3.5"
                      fontWeight="600" fill={isRedzone ? X.red : X.textMut}>
                      {v / 1000}
                    </text>
                  </g>
                );
              })}

              {/* Needle (color shifts with thermal palette) */}
              <line
                x1="50" y1="50"
                x2={50 + 30 * Math.cos(needleAngle * Math.PI / 180)}
                y2={50 + 30 * Math.sin(needleAngle * Math.PI / 180)}
                stroke={needleColor} strokeWidth="1.5" strokeLinecap="round"
                style={{ transition: `x2 400ms ${ease.sp}, y2 400ms ${ease.sp}, stroke 400ms`, filter: `drop-shadow(0 0 4px ${needleColor}80)` }} />
              <circle cx="50" cy="50" r="2.5" fill={needleColor} style={{ transition: 'fill 400ms' }} />
            </svg>
          </div>
        </div>
      </div>

      {/* Large digital RPM readout */}
      <div style={{ textAlign: 'center', marginBottom: 6 }}>
        <M style={{ fontSize: 32, fontWeight: 800, color: needleColor, letterSpacing: '-.02em', transition: 'color 400ms' }}>
          {Math.round(rpm)}
        </M>
        <M style={{ fontSize: 10, color: X.textMut, marginLeft: 4 }}>RPM</M>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Current</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: needleColor }}>{Math.round(rpm)} RPM</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Redline</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.red }}>{redline}</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Max</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{maxRPM}</M></div>
      </div>
    </Card>
  );
}

// ── Boost Gauge ─────────────────────────────────────────────────────
export function BoostGauge({ title = 'Boost', maxBoost = 25, boost }: { title?: string; maxBoost?: number; boost: number }) {
  const X = getX();
  const n = neo();
  const tick = useTick(60);

  const minVac = -30;
  const totalRange = maxBoost - minVac; // -30 to +25 = 55 units
  const pct = Math.max(0, Math.min(1, (boost - minVac) / totalRange));
  const zeroPct = (0 - minVac) / totalRange; // where zero sits

  const sweepDeg = 270;
  const startAngle = -225;
  const needleAngle = startAngle + pct * sweepDeg;

  // Pressure particles when boost > 15
  const highBoost = boost > 15;
  const particles = highBoost ? Array.from({ length: 8 }, (_, i) => {
    const baseAngle = (i / 8) * 360;
    const progress = ((tick + i * 7) % 30) / 30; // 0-1 cycle
    const dist = 8 + progress * 32;
    const rad = baseAngle * Math.PI / 180;
    return {
      cx: 50 + dist * Math.cos(rad),
      cy: 50 + dist * Math.sin(rad),
      opacity: 1 - progress,
      r: 0.6 + (1 - progress) * 0.4,
    };
  }) : [];

  // Scale markings
  const scaleValues: number[] = [];
  for (let v = minVac; v <= maxBoost; v += 5) scaleValues.push(v);

  return (
    <Card style={{ width: 350 }} glow={highBoost ? X.amber : X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={highBoost ? X.amber : boost > 0 ? X.teal : X.indigo}>
          {highBoost ? 'HIGH BOOST' : boost > 0 ? 'BOOST' : 'VACUUM'}
        </Badge>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <div style={{ width: 200, height: 200, borderRadius: '50%', background: n.metal, boxShadow: n.bezel, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 180, height: 180, borderRadius: '50%', background: X.bg, boxShadow: n.concave, position: 'relative', overflow: 'hidden' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              {/* Background arc */}
              {(() => {
                const r = 40;
                const circ = 2 * Math.PI * r;
                const arcLen = (sweepDeg / 360) * circ;
                return (
                  <circle cx="50" cy="50" r={r} fill="none"
                    stroke={X.borderLight} strokeWidth="3"
                    strokeDasharray={`${arcLen} ${circ - arcLen}`}
                    transform="rotate(-225 50 50)" />
                );
              })()}

              {/* Vacuum arc (blue) */}
              {(() => {
                const r = 40;
                const circ = 2 * Math.PI * r;
                const vacArc = zeroPct * (sweepDeg / 360) * circ;
                return (
                  <circle cx="50" cy="50" r={r} fill="none"
                    stroke={X.indigo} strokeWidth="3" strokeOpacity=".25"
                    strokeDasharray={`${vacArc} ${circ - vacArc}`}
                    transform="rotate(-225 50 50)" />
                );
              })()}

              {/* Boost arc (green/amber) */}
              {(() => {
                const r = 40;
                const circ = 2 * Math.PI * r;
                const boostArc = (1 - zeroPct) * (sweepDeg / 360) * circ;
                const offset = -(zeroPct * (sweepDeg / 360) * circ);
                return (
                  <circle cx="50" cy="50" r={r} fill="none"
                    stroke={X.teal} strokeWidth="3" strokeOpacity=".25"
                    strokeDasharray={`${boostArc} ${circ - boostArc}`}
                    strokeDashoffset={offset}
                    transform="rotate(-225 50 50)" />
                );
              })()}

              {/* Scale markings */}
              {scaleValues.map((v, i) => {
                const frac = (v - minVac) / totalRange;
                const angleDeg = -225 + frac * sweepDeg;
                const aRad = angleDeg * Math.PI / 180;
                const major = v % 10 === 0;
                const r1 = major ? 33 : 35;
                const r2 = 38;
                const isZero = v === 0;
                return (
                  <g key={i}>
                    <line
                      x1={50 + r1 * Math.cos(aRad)} y1={50 + r1 * Math.sin(aRad)}
                      x2={50 + r2 * Math.cos(aRad)} y2={50 + r2 * Math.sin(aRad)}
                      stroke={isZero ? X.text : (major ? X.textMut : X.borderLight)}
                      strokeWidth={isZero ? '1' : major ? '0.7' : '0.4'} />
                    {major && (
                      <text
                        x={50 + 27 * Math.cos(aRad)}
                        y={50 + 27 * Math.sin(aRad) + 1.5}
                        textAnchor="middle" fontFamily={X.m} fontSize="3.5"
                        fontWeight={isZero ? '800' : '600'}
                        fill={isZero ? X.text : X.textMut}>
                        {v}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Pressure particles */}
              {particles.map((p, i) => (
                <circle key={i} cx={p.cx} cy={p.cy} r={p.r}
                  fill={X.amber} opacity={p.opacity * 0.7}
                  style={{ filter: `drop-shadow(0 0 2px ${X.amber}60)` }} />
              ))}

              {/* Needle */}
              <line
                x1="50" y1="50"
                x2={50 + 30 * Math.cos(needleAngle * Math.PI / 180)}
                y2={50 + 30 * Math.sin(needleAngle * Math.PI / 180)}
                stroke={boost > 15 ? X.amber : boost > 0 ? X.teal : X.indigo}
                strokeWidth="1.3" strokeLinecap="round"
                style={{ transition: `x2 400ms ${ease.sp}, y2 400ms ${ease.sp}, stroke 300ms`, filter: `drop-shadow(0 0 3px ${boost > 0 ? X.teal : X.indigo}60)` }} />
              <circle cx="50" cy="50" r="2.5" fill={boost > 0 ? X.teal : X.indigo} style={{ transition: 'fill 300ms' }} />

              {/* Readout */}
              <text x="50" y="68" textAnchor="middle" fontFamily={X.m} fontSize="9" fontWeight="800" fill={boost > 15 ? X.amber : boost > 0 ? X.teal : X.indigo}>
                {boost.toFixed(1)}
              </text>
              <text x="50" y="73.5" textAnchor="middle" fontFamily={X.m} fontSize="3.5" fill={X.textMut}>
                {boost > 0 ? 'PSI' : 'inHg'}
              </text>
            </svg>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Current</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: boost > 0 ? X.teal : X.indigo }}>{boost.toFixed(1)} {boost > 0 ? 'PSI' : 'inHg'}</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Peak</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.amber }}>{maxBoost} PSI</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Zone</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: boost > 15 ? X.amber : boost > 0 ? X.teal : X.indigo }}>{boost > 15 ? 'High' : boost > 0 ? 'Boost' : 'Vacuum'}</M></div>
      </div>
    </Card>
  );
}

// ── Oil Temperature ─────────────────────────────────────────────────
export function OilTemp({ title = 'Oil Temperature', temp }: { title?: string; temp: number }) {
  const X = getX();
  const n = neo();
  const tick = useTick(80);
  const isWarning = temp > 120;

  // Temperature scale markings (50-140 deg C)
  const minTemp = 50;
  const maxTemp = 140;
  const pct = Math.max(0, Math.min(1, (temp - minTemp) / (maxTemp - minTemp)));

  // Heat shimmer: wavy overlay using sin-based translateX
  const shimmerX = Math.sin(tick * 0.15) * 2;

  const gaugeH = 180;
  const gaugeW = 40;
  const fillH = pct * (gaugeH - 16);

  // Temperature markers
  const markers = [50, 70, 90, 110, 120, 140];

  return (
    <Card style={{ width: 350 }} glow={isWarning ? X.red : X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Warning LED */}
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: isWarning ? X.red : X.borderLight,
            boxShadow: isWarning ? `0 0 8px ${X.red}80, 0 0 16px ${X.red}40` : 'none',
            transition: 'background 300ms, box-shadow 300ms',
          }} />
          <Badge color={isWarning ? X.red : temp > 100 ? X.amber : X.teal}>
            {isWarning ? 'OVERHEAT' : temp > 100 ? 'WARM' : 'NORMAL'}
          </Badge>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', alignItems: 'flex-end', marginBottom: 10 }}>
        {/* Temperature markings on left */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: gaugeH, paddingBottom: 8, paddingTop: 8 }}>
          {[...markers].reverse().map((m, i) => {
            const markerPct = (m - minTemp) / (maxTemp - minTemp);
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <M style={{
                  fontSize: 8, fontWeight: 600,
                  color: m >= 120 ? X.red : m >= 100 ? X.amber : X.textMut,
                  textAlign: 'right', width: 24,
                }}>{m}°</M>
                <div style={{
                  width: 6, height: 1,
                  background: m >= 120 ? X.red : X.borderLight,
                }} />
              </div>
            );
          })}
        </div>

        {/* Vertical gauge */}
        <div style={{
          width: gaugeW, height: gaugeH,
          borderRadius: gaugeW / 2,
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: gaugeW - 8, height: gaugeH - 8,
            borderRadius: (gaugeW - 8) / 2,
            background: X.bg, boxShadow: n.concave,
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Liquid fill from bottom with thermal gradient */}
            <div style={{
              position: 'absolute', bottom: 4, left: 4, right: 4,
              height: fillH,
              borderRadius: (gaugeW - 16) / 2,
              background: `linear-gradient(to top, ${X.teal}, ${X.amber} 50%, ${X.red})`,
              transition: `height 800ms ${ease.sp}`,
              overflow: 'hidden',
            }}>
              {/* Heat shimmer at top of liquid */}
              <div style={{
                position: 'absolute', top: 0, left: -4, right: -4, height: 8,
                background: `linear-gradient(to bottom, rgba(255,255,255,0.12), transparent)`,
                transform: `translateX(${shimmerX}px)`,
                transition: 'transform 80ms linear',
              }} />
            </div>
          </div>
        </div>

        {/* Current value readout */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <M style={{
            fontSize: 28, fontWeight: 800,
            color: isWarning ? X.red : temp > 100 ? X.amber : X.teal,
            transition: 'color 300ms',
          }}>
            {temp.toFixed(0)}
          </M>
          <M style={{ fontSize: 9, color: X.textMut }}>°C</M>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Current</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: isWarning ? X.red : X.teal }}>{temp.toFixed(1)}°C</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Optimal</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>85-105°C</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Warning</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.red }}>120°C</M></div>
      </div>
    </Card>
  );
}

// ── Fuel Gauge ──────────────────────────────────────────────────────
export function FuelGauge({ title = 'Fuel Level', fuel }: { title?: string; fuel: number }) {
  const X = getX();
  const n = neo();
  const tick = useTick(80);
  const isLow = fuel < 15;

  const pct = Math.max(0, Math.min(100, fuel));
  // 180° sweep: E (left) to F (right)
  const needleAngle = -180 + (pct / 100) * 180;

  // Fuel tank cross-section with sine wave liquid
  const tankW = 120;
  const tankH = 50;
  const liquidH = (pct / 100) * (tankH - 8);
  const liquidY = tankH - liquidH - 4;

  // Build sine wave path for liquid surface
  const wavePoints: string[] = [];
  const numPoints = 30;
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * tankW;
    const waveAmp = 2 + (pct > 50 ? 1 : 0.5);
    const y = liquidY + Math.sin((i / numPoints) * Math.PI * 3 + tick * 0.12) * waveAmp;
    wavePoints.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  wavePoints.push(`L${tankW},${tankH}`);
  wavePoints.push(`L0,${tankH}`);
  wavePoints.push('Z');
  const wavePath = wavePoints.join(' ');

  return (
    <Card style={{ width: 350 }} glow={isLow ? X.red : X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Low fuel LED */}
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: isLow ? X.red : X.borderLight,
            boxShadow: isLow ? `0 0 8px ${X.red}80, 0 0 16px ${X.red}40` : 'none',
            animation: isLow ? 'br 1s ease infinite' : 'none',
          }} />
          <Badge color={isLow ? X.red : pct < 30 ? X.amber : X.teal}>
            {isLow ? 'LOW FUEL' : pct < 30 ? 'LOW' : 'OK'}
          </Badge>
        </div>
      </div>

      {/* Semicircular gauge */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
        <div style={{ width: 180, height: 100, position: 'relative' }}>
          <svg viewBox="0 0 100 55" style={{ width: '100%', height: '100%' }}>
            {/* Background arc */}
            <path d="M 8 50 A 42 42 0 0 1 92 50" fill="none" stroke={X.borderLight} strokeWidth="4" strokeLinecap="round" />
            {/* Filled arc showing level */}
            {(() => {
              const r = 42;
              const cx = 50, cy = 50;
              const startRad = Math.PI; // 180 degrees (left)
              const endRad = Math.PI - (pct / 100) * Math.PI; // sweeps right
              const x1 = cx + r * Math.cos(startRad);
              const y1 = cy + r * Math.sin(startRad);
              const x2 = cx + r * Math.cos(endRad);
              const y2 = cy + r * Math.sin(endRad);
              const largeArc = pct > 50 ? 1 : 0;
              if (pct <= 0) return null;
              return (
                <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`}
                  fill="none" stroke={isLow ? X.red : pct < 30 ? X.amber : X.teal}
                  strokeWidth="4" strokeLinecap="round"
                  style={{ transition: `stroke 400ms`, filter: `drop-shadow(0 0 3px ${isLow ? X.red : X.teal}40)` }} />
              );
            })()}

            {/* E and F labels */}
            <text x="6" y="54" textAnchor="middle" fontFamily={X.m} fontSize="5" fontWeight="800" fill={X.red}>E</text>
            <text x="94" y="54" textAnchor="middle" fontFamily={X.m} fontSize="5" fontWeight="800" fill={X.teal}>F</text>

            {/* Scale marks */}
            {[0, 25, 50, 75, 100].map((v, i) => {
              const aRad = Math.PI - (v / 100) * Math.PI;
              const r1 = 36, r2 = 40;
              return (
                <line key={i}
                  x1={50 + r1 * Math.cos(aRad)} y1={50 + r1 * Math.sin(aRad)}
                  x2={50 + r2 * Math.cos(aRad)} y2={50 + r2 * Math.sin(aRad)}
                  stroke={X.textMut} strokeWidth="0.6" />
              );
            })}

            {/* Needle with heavy damping */}
            <line
              x1="50" y1="50"
              x2={50 + 32 * Math.cos((needleAngle) * Math.PI / 180)}
              y2={50 + 32 * Math.sin((needleAngle) * Math.PI / 180)}
              stroke={X.text} strokeWidth="1.2" strokeLinecap="round"
              style={{ transition: `x2 1200ms cubic-bezier(.34,1.56,.64,1), y2 1200ms cubic-bezier(.34,1.56,.64,1)` }} />
            <circle cx="50" cy="50" r="2" fill={X.text} />

            {/* Value */}
            <text x="50" y="44" textAnchor="middle" fontFamily={X.m} fontSize="10" fontWeight="800" fill={isLow ? X.red : X.text}>{Math.round(pct)}%</text>
          </svg>
        </div>
      </div>

      {/* Fuel tank cross-section with sine wave */}
      <div style={{ marginBottom: 8, padding: 6, borderRadius: 6, background: n.metal, boxShadow: n.bezel }}>
        <Lbl style={{ marginBottom: 4 }}>Tank Cross-Section</Lbl>
        <svg viewBox={`0 0 ${tankW} ${tankH}`} style={{ display: 'block', width: '100%', height: 40, borderRadius: 4, overflow: 'hidden' }}>
          <rect x="0" y="0" width={tankW} height={tankH} rx="6" fill={X.bg} />
          <clipPath id="auto-fuel-tank-clip">
            <rect x="2" y="2" width={tankW - 4} height={tankH - 4} rx="5" />
          </clipPath>
          <g clipPath="url(#auto-fuel-tank-clip)">
            <path d={wavePath}
              fill={isLow ? X.red + '40' : X.teal + '30'}
              stroke={isLow ? X.red : X.teal}
              strokeWidth="0.5" />
          </g>
          <rect x="1" y="1" width={tankW - 2} height={tankH - 2} rx="5.5" fill="none" stroke={X.borderLight} strokeWidth="1" />
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Level</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: isLow ? X.red : X.teal }}>{Math.round(pct)}%</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Est. Range</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.text }}>{Math.round(pct * 5.2)} km</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Capacity</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>55 L</M></div>
      </div>
    </Card>
  );
}

// ── Engine Diagnostics ──────────────────────────────────────────────
export function EngDiagnostics({ title = 'Engine Diagnostics', rpmVal, coolantVal, intakeVal, batteryVal }: { title?: string; rpmVal: number; coolantVal: number; intakeVal: number; batteryVal: number }) {
  const X = getX();
  const n = neo();
  const tick = useTick(500);

  const readings = [
    { label: 'RPM', value: Math.round(rpmVal), digits: 4, unit: '', color: X.teal },
    { label: 'Coolant', value: Math.round(coolantVal), digits: 3, unit: '°C', color: coolantVal > 105 ? X.red : X.amber },
    { label: 'Intake', value: Math.round(intakeVal), digits: 3, unit: '°C', color: X.indigo },
    { label: 'Battery', value: Math.round(batteryVal * 10), digits: 3, unit: 'V', color: batteryVal < 12 ? X.red : X.teal },
  ];

  const dtcCodes = [
    { code: 'P0300', label: 'Misfire', ok: true },
    { code: 'P0171', label: 'Lean B1', ok: false },
    { code: 'P0420', label: 'Cat Eff.', ok: true },
    { code: 'P0442', label: 'EVAP Sm', ok: true },
  ];

  const cellH = 18;
  const commDotCount = 5;
  const activeDot = tick % commDotCount;

  return (
    <Card style={{ width: 350 }} glow={X.indigo}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={dtcCodes.some(d => !d.ok) ? X.amber : X.teal}>
          OBD-II {dtcCodes.some(d => !d.ok) ? 'FAULT' : 'OK'}
        </Badge>
      </div>

      {/* Drum counter readouts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
        {readings.map((r, ri) => {
          const valStr = String(Math.abs(r.value)).padStart(r.digits, '0');
          // For battery, show with decimal: last digit is decimal
          const isBattery = r.label === 'Battery';
          return (
            <div key={ri} style={{
              padding: '8px 8px', borderRadius: 6,
              background: n.metal, boxShadow: n.bezel,
            }}>
              <Lbl style={{ marginBottom: 4 }}>{r.label}</Lbl>
              <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {valStr.split('').map((digit, di) => {
                  const d = parseInt(digit, 10);
                  return (
                    <div key={di} style={{ position: 'relative' }}>
                      {isBattery && di === valStr.length - 1 && (
                        <M style={{ fontSize: 8, color: X.textMut, position: 'absolute', left: -3, top: 10 }}>.</M>
                      )}
                      <div style={{
                        width: 16, height: cellH, overflow: 'hidden',
                        borderRadius: 2,
                        background: X.bg,
                        border: `1px solid ${X.borderLight}`,
                        marginLeft: isBattery && di === valStr.length - 1 ? 2 : 0,
                      }}>
                        <div style={{
                          display: 'flex', flexDirection: 'column',
                          transform: `translateY(${-d * cellH}px)`,
                          transition: `transform 500ms ${ease.sp}`,
                        }}>
                          {Array.from({ length: 10 }, (_, n) => (
                            <div key={n} style={{
                              height: cellH, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontFamily: X.m, fontSize: 11, fontWeight: 700, color: r.color, flexShrink: 0,
                            }}>
                              {n}
                            </div>
                          ))}
                        </div>
                        <div style={{
                          position: 'absolute', inset: 0, pointerEvents: 'none',
                          boxShadow: `inset 0 4px 3px ${X.bg}cc, inset 0 -4px 3px ${X.bg}cc`,
                        }} />
                      </div>
                    </div>
                  );
                })}
                <M style={{ fontSize: 8, color: X.textMut, marginLeft: 3 }}>{r.unit}</M>
              </div>
            </div>
          );
        })}
      </div>

      {/* DTC LED tiles */}
      <Lbl style={{ marginBottom: 4 }}>Diagnostic Trouble Codes</Lbl>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginBottom: 10 }}>
        {dtcCodes.map((dtc, i) => (
          <div key={i} style={{
            padding: '6px 4px', borderRadius: 4, textAlign: 'center',
            background: dtc.ok ? X.teal + '10' : X.red + '15',
            border: `1px solid ${dtc.ok ? X.teal + '30' : X.red + '40'}`,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', margin: '0 auto 4px',
              background: dtc.ok ? X.teal : X.red,
              boxShadow: dtc.ok ? `0 0 4px ${X.teal}40` : `0 0 8px ${X.red}60`,
              animation: dtc.ok ? 'none' : 'br 1.5s ease infinite',
            }} />
            <M style={{ fontSize: 8, fontWeight: 700, color: dtc.ok ? X.teal : X.red, display: 'block' }}>{dtc.code}</M>
            <M style={{ fontSize: 7, color: X.textMut }}>{dtc.label}</M>
          </div>
        ))}
      </div>

      {/* Sequential communication dots */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <M style={{ fontSize: 8, color: X.textMut }}>CAN Bus</M>
        <div style={{ display: 'flex', gap: 3 }}>
          {Array.from({ length: commDotCount }, (_, i) => (
            <div key={i} style={{
              width: 6, height: 6, borderRadius: '50%',
              background: i === activeDot ? X.teal : X.borderLight,
              boxShadow: i === activeDot ? `0 0 6px ${X.teal}60` : 'none',
              transition: 'background 150ms, box-shadow 150ms',
            }} />
          ))}
        </div>
        <M style={{ fontSize: 8, color: X.teal, marginLeft: 'auto' }}>Connected</M>
      </div>
    </Card>
  );
}
