import { useState } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
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

// ── Attitude Indicator ──────────────────────────────────────────────
export function AttitudeIndicator({ title = 'Attitude', pitch = 10, roll = 15 }: { title?: string; pitch?: number; roll?: number } = {}) {
  const X = getX();
  const n = neo();
  const livePitch = useLive(pitch, 5, 1800);
  const liveRoll = useLive(roll, 8, 1600);
  const animPitch = useAnim(livePitch, 800);
  const animRoll = useAnim(liveRoll, 800);

  const bankMarks = [0, 10, 20, 30, 45, 60];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={Math.abs(livePitch) > 15 || Math.abs(liveRoll) > 25 ? X.amber : X.teal}>
          {Math.abs(livePitch) > 15 || Math.abs(liveRoll) > 25 ? 'Caution' : 'Level'}
        </Badge>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <div style={{
          width: 180, height: 180, borderRadius: '50%',
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <svg viewBox="0 0 100 100" style={{ width: 160, height: 160, display: 'block', overflow: 'hidden', borderRadius: '50%' }}>
            <defs>
              <linearGradient id="avi-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={X.indigo} stopOpacity=".9" />
                <stop offset="100%" stopColor={X.indigo} stopOpacity=".5" />
              </linearGradient>
              <linearGradient id="avi-ground" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={X.amber} stopOpacity=".7" />
                <stop offset="100%" stopColor={X.amber} stopOpacity=".9" />
              </linearGradient>
              <clipPath id="avi-clip">
                <circle cx="50" cy="50" r="46" />
              </clipPath>
            </defs>

            <g clipPath="url(#avi-clip)">
              {/* Sky/ground group - translated by pitch, rotated by roll */}
              <g style={{
                transformOrigin: '50px 50px',
                transform: `rotate(${animRoll}deg) translateY(${animPitch * 0.8}px)`,
                transition: `transform 600ms ${ease.o}`,
              }}>
                {/* Sky */}
                <rect x="-50" y="-100" width="200" height="150" fill="url(#avi-sky)" />
                {/* Ground */}
                <rect x="-50" y="50" width="200" height="150" fill="url(#avi-ground)" />
                {/* Horizon line */}
                <line x1="-50" y1="50" x2="150" y2="50" stroke="#fff" strokeWidth="0.8" strokeOpacity="0.8" />
                {/* Pitch ladder */}
                {[-20, -10, 10, 20].map((p) => (
                  <g key={p}>
                    <line x1="35" y1={50 - p * 0.8} x2="45" y2={50 - p * 0.8}
                      stroke="#fff" strokeWidth="0.5" strokeOpacity="0.6" />
                    <line x1="55" y1={50 - p * 0.8} x2="65" y2={50 - p * 0.8}
                      stroke="#fff" strokeWidth="0.5" strokeOpacity="0.6" />
                    <text x="68" y={50 - p * 0.8 + 1.5} fontSize="3.5" fill="#fff" fillOpacity="0.6"
                      fontFamily="monospace">{Math.abs(p)}</text>
                  </g>
                ))}
              </g>

              {/* Bank angle marks (fixed to frame) */}
              {bankMarks.map((deg) => (
                <g key={deg}>
                  {[deg, -deg].map((d) => (
                    <line key={d}
                      x1={50 + 42 * Math.sin((d * Math.PI) / 180)}
                      y1={50 - 42 * Math.cos((d * Math.PI) / 180)}
                      x2={50 + 46 * Math.sin((d * Math.PI) / 180)}
                      y2={50 - 46 * Math.cos((d * Math.PI) / 180)}
                      stroke={X.text} strokeWidth={deg === 0 ? '1' : '0.5'} strokeOpacity="0.7"
                    />
                  ))}
                </g>
              ))}

              {/* Fixed crosshair overlay */}
              <line x1="20" y1="50" x2="42" y2="50" stroke={X.amber} strokeWidth="1.5" />
              <line x1="58" y1="50" x2="80" y2="50" stroke={X.amber} strokeWidth="1.5" />
              <line x1="50" y1="50" x2="50" y2="54" stroke={X.amber} strokeWidth="1.5" />
              <circle cx="50" cy="50" r="2" fill="none" stroke={X.amber} strokeWidth="1" />

              {/* Top triangle indicator */}
              <polygon points="50,5 48,9 52,9" fill={X.text} fillOpacity="0.7" />
            </g>
          </svg>
        </div>
      </div>

      {/* Pitch/Roll readouts */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{
          flex: 1, padding: '8px 10px', borderRadius: 6,
          background: n.metal, boxShadow: n.concave, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 3 }}>Pitch</Lbl>
          <M style={{ fontSize: 18, fontWeight: 800, color: Math.abs(livePitch) > 15 ? X.amber : X.teal, display: 'block' }}>
            {livePitch.toFixed(1)}°
          </M>
        </div>
        <div style={{
          flex: 1, padding: '8px 10px', borderRadius: 6,
          background: n.metal, boxShadow: n.concave, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 3 }}>Roll</Lbl>
          <M style={{ fontSize: 18, fontWeight: 800, color: Math.abs(liveRoll) > 25 ? X.amber : X.teal, display: 'block' }}>
            {liveRoll.toFixed(1)}°
          </M>
        </div>
      </div>
    </Card>
  );
}

// ── Altimeter ───────────────────────────────────────────────────────
export function Altimeter({ title = 'Altimeter', maxAlt = 35000 }: { title?: string; maxAlt?: number } = {}) {
  const X = getX();
  const n = neo();
  const altitude = useLive(24500, 500, 2500);
  const animAlt = useAnim(altitude, 1200);

  const altStr = String(Math.round(Math.abs(animAlt))).padStart(5, '0');
  const digits = altStr.split('').map(Number);
  const cellH = 18;

  // Hundreds needle: 0-9 over 360 degrees
  const hundreds = (animAlt % 1000) / 1000;
  const needleAngle = hundreds * 360 - 90;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={altitude > 30000 ? X.amber : X.teal}>
          {altitude > 30000 ? 'High Alt' : 'Normal'}
        </Badge>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        {/* Round gauge dial */}
        <div style={{
          width: 140, height: 140, borderRadius: '50%',
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, position: 'relative',
        }}>
          <svg viewBox="0 0 100 100" style={{ width: 120, height: 120, display: 'block' }}>
            <defs>
              <linearGradient id="avi-alt-face" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={X.surface} />
                <stop offset="100%" stopColor={X.bgAlt} />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#avi-alt-face)" stroke={X.border} strokeWidth=".5" />

            {/* Scale markings 0-9 */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => {
              const angle = (val / 10) * 360 - 90;
              const rad = (angle * Math.PI) / 180;
              const inner = 34;
              const outer = 40;
              const textR = 28;
              return (
                <g key={val}>
                  <line
                    x1={50 + inner * Math.cos(rad)} y1={50 + inner * Math.sin(rad)}
                    x2={50 + outer * Math.cos(rad)} y2={50 + outer * Math.sin(rad)}
                    stroke={X.textMut} strokeWidth=".8"
                  />
                  <text
                    x={50 + textR * Math.cos(rad)} y={50 + textR * Math.sin(rad) + 1.5}
                    textAnchor="middle" fontFamily="monospace" fontSize="6" fill={X.text}
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Hundreds needle */}
            <line
              x1="50" y1="50"
              x2={50 + 28 * Math.cos((needleAngle * Math.PI) / 180)}
              y2={50 + 28 * Math.sin((needleAngle * Math.PI) / 180)}
              stroke={X.text} strokeWidth="1.5" strokeLinecap="round"
              style={{ transition: `x2 400ms ${ease.o}, y2 400ms ${ease.o}` }}
            />
            <circle cx="50" cy="50" r="3.5" fill={X.surface} stroke={X.border} strokeWidth=".8" />
            <circle cx="50" cy="50" r="1.5" fill={X.textMut} />

            <text x="50" y="70" textAnchor="middle" fontFamily="monospace" fontSize="4" fill={X.textMut}>
              x100 FT
            </text>
          </svg>
        </div>

        {/* Drum counter */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Lbl style={{ marginBottom: 2 }}>Altitude (ft)</Lbl>
          <div style={{
            display: 'flex', gap: 2, padding: '6px 8px', borderRadius: 6,
            background: X.bgAlt, boxShadow: n.concave,
          }}>
            {digits.map((digit, i) => (
              <div key={i} style={{
                width: 24, height: cellH, overflow: 'hidden',
                background: '#000', borderRadius: 3, position: 'relative',
                boxShadow: `inset 0 4px 6px rgba(0,0,0,0.5), inset 0 -4px 6px rgba(0,0,0,0.5)`,
              }}>
                <div style={{
                  transform: `translateY(${-digit * cellH}px)`,
                  transition: `transform 400ms ${ease.o}`,
                }}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
                    <div key={d} style={{
                      height: cellH, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'monospace', fontSize: 13, fontWeight: 800, color: X.teal,
                    }}>
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            padding: '8px 10px', borderRadius: 6,
            background: n.metal, boxShadow: n.concave, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 3 }}>Current Alt</Lbl>
            <M style={{ fontSize: 22, fontWeight: 800, color: X.teal, display: 'block' }}>
              {Math.round(altitude).toLocaleString()}
            </M>
            <M style={{ fontSize: 9, color: X.textMut }}>feet</M>
          </div>

          <div style={{
            padding: '4px 8px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <M style={{ fontSize: 8, color: X.textMut }}>Max</M>
              <M style={{ fontSize: 8, fontWeight: 600, color: X.textSec }}>{maxAlt.toLocaleString()} ft</M>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Airspeed Indicator ──────────────────────────────────────────────
export function AirspeedIndicator({ title = 'Airspeed', vne = 250 }: { title?: string; vne?: number } = {}) {
  const X = getX();
  const n = neo();
  const airspeed = useLive(165, 15, 2000);
  const animSpeed = useAnim(airspeed, 1000);

  const maxScale = 280;
  const sweepDeg = 270;
  const startAngle = -225; // start at bottom-left

  const speedToAngle = (spd: number) => startAngle + (spd / maxScale) * sweepDeg;
  const needleAngle = speedToAngle(animSpeed);

  // Arc drawing helper
  const arcPath = (from: number, to: number, r: number) => {
    const a1 = ((speedToAngle(from) - 90) * Math.PI) / 180;
    const a2 = ((speedToAngle(to) - 90) * Math.PI) / 180;
    const x1 = 50 + r * Math.cos(a1);
    const y1 = 50 + r * Math.sin(a1);
    const x2 = 50 + r * Math.cos(a2);
    const y2 = 50 + r * Math.sin(a2);
    const large = (to - from) / maxScale * sweepDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={airspeed > vne * 0.9 ? X.red : airspeed > 180 ? X.amber : X.teal}>
          {airspeed > vne * 0.9 ? 'OVERSPEED' : airspeed > 180 ? 'Caution' : 'Normal'}
        </Badge>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <div style={{
          width: 190, height: 190, borderRadius: '50%',
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <svg viewBox="0 0 100 100" style={{ width: 170, height: 170, display: 'block' }}>
            <defs>
              <linearGradient id="avi-spd-face" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={X.surface} />
                <stop offset="100%" stopColor={X.bgAlt} />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#avi-spd-face)" stroke={X.border} strokeWidth=".5" />

            {/* Color arcs - white (60-120), green (80-180), yellow (180-230), red line at VNE */}
            <path d={arcPath(60, 120, 40)} fill="none" stroke="#ffffff" strokeWidth="3" strokeOpacity="0.3" />
            <path d={arcPath(80, 180, 40)} fill="none" stroke={X.teal} strokeWidth="3" strokeOpacity="0.5" />
            <path d={arcPath(180, 230, 40)} fill="none" stroke={X.amber} strokeWidth="3" strokeOpacity="0.6" />

            {/* VNE red line */}
            {(() => {
              const vneAng = ((speedToAngle(vne) - 90) * Math.PI) / 180;
              return (
                <line
                  x1={50 + 36 * Math.cos(vneAng)} y1={50 + 36 * Math.sin(vneAng)}
                  x2={50 + 44 * Math.cos(vneAng)} y2={50 + 44 * Math.sin(vneAng)}
                  stroke={X.red} strokeWidth="2"
                />
              );
            })()}

            {/* Scale markings */}
            {[0, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260].map((val) => {
              const angle = ((speedToAngle(val) - 90) * Math.PI) / 180;
              const inner = val % 40 === 0 ? 32 : 35;
              const outer = 38;
              const textR = 27;
              return (
                <g key={val}>
                  <line
                    x1={50 + inner * Math.cos(angle)} y1={50 + inner * Math.sin(angle)}
                    x2={50 + outer * Math.cos(angle)} y2={50 + outer * Math.sin(angle)}
                    stroke={X.textMut} strokeWidth={val % 40 === 0 ? '.8' : '.4'}
                  />
                  {val % 40 === 0 && (
                    <text
                      x={50 + textR * Math.cos(angle)} y={50 + textR * Math.sin(angle) + 1.5}
                      textAnchor="middle" fontFamily="monospace" fontSize="4.5" fill={X.text}
                    >
                      {val}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Needle (red) */}
            <line
              x1="50" y1="50"
              x2={50 + 32 * Math.cos(((needleAngle - 90) * Math.PI) / 180)}
              y2={50 + 32 * Math.sin(((needleAngle - 90) * Math.PI) / 180)}
              stroke={X.red} strokeWidth="1.2" strokeLinecap="round"
              style={{ transition: `x2 600ms ${ease.o}, y2 600ms ${ease.o}`, filter: `drop-shadow(0 0 2px ${X.red}40)` }}
            />
            <line
              x1="50" y1="50"
              x2={50 - 8 * Math.cos(((needleAngle - 90) * Math.PI) / 180)}
              y2={50 - 8 * Math.sin(((needleAngle - 90) * Math.PI) / 180)}
              stroke={X.red} strokeWidth="2" strokeLinecap="round"
              style={{ transition: `x2 600ms ${ease.o}, y2 600ms ${ease.o}` }}
            />
            <circle cx="50" cy="50" r="3.5" fill={X.surface} stroke={X.border} strokeWidth=".8" />
            <circle cx="50" cy="50" r="1.5" fill={X.textMut} />

            {/* Speed readout */}
            <text x="50" y="68" textAnchor="middle" fontFamily="monospace" fontSize="8" fontWeight="800" fill={X.text}>
              {Math.round(animSpeed)}
            </text>
            <text x="50" y="73" textAnchor="middle" fontFamily="monospace" fontSize="4" fill={X.textMut}>
              KIAS
            </text>
          </svg>

          {/* Film grain overlay */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            borderRadius: '50%',
            background: `repeating-linear-gradient(45deg, transparent, transparent 2px, ${X.textMut}04 2px, transparent 4px)`,
            pointerEvents: 'none',
          }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{
          flex: 1, padding: '6px 8px', borderRadius: 6,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 2 }}>VNE</Lbl>
          <M style={{ fontSize: 12, fontWeight: 700, color: X.red, display: 'block' }}>{vne} kt</M>
        </div>
        <div style={{
          flex: 1, padding: '6px 8px', borderRadius: 6,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 2 }}>Current</Lbl>
          <M style={{ fontSize: 12, fontWeight: 700, color: X.teal, display: 'block' }}>{Math.round(airspeed)} kt</M>
        </div>
      </div>
    </Card>
  );
}

// ── Heading Compass ─────────────────────────────────────────────────
export function HeadingCompass({ title = 'Heading' }: { title?: string } = {}) {
  const X = getX();
  const n = neo();
  const heading = useLive(270, 20, 2000);
  const wobble = useLive(0, 1.5, 800);

  const cardinals: [number, string][] = [[0, 'N'], [90, 'E'], [180, 'S'], [270, 'W']];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>{Math.round(heading)}°</Badge>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <div style={{
          width: 190, height: 190, borderRadius: '50%',
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          {/* Lubber line at top */}
          <div style={{
            position: 'absolute', top: 4, left: '50%', transform: 'translateX(-50%)',
            width: 3, height: 14, background: X.red, borderRadius: 2, zIndex: 2,
            boxShadow: `0 0 4px ${X.red}60`,
          }} />

          <svg viewBox="0 0 100 100" style={{ width: 170, height: 170, display: 'block' }}>
            <defs>
              <linearGradient id="avi-cmp-face" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={X.surface} />
                <stop offset="100%" stopColor={X.bgAlt} />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#avi-cmp-face)" stroke={X.border} strokeWidth=".5" />

            {/* Rotating compass rose */}
            <g style={{
              transformOrigin: '50px 50px',
              transform: `rotate(${-heading + wobble}deg)`,
              transition: `transform 800ms cubic-bezier(.34,1.56,.64,1)`,
            }}>
              {/* Degree marks every 30 degrees */}
              {Array.from({ length: 12 }, (_, i) => i * 30).map((deg) => {
                const rad = ((deg - 90) * Math.PI) / 180;
                const isMajor = deg % 90 === 0;
                const inner = isMajor ? 30 : 34;
                const outer = 40;
                return (
                  <g key={deg}>
                    <line
                      x1={50 + inner * Math.cos(rad)} y1={50 + inner * Math.sin(rad)}
                      x2={50 + outer * Math.cos(rad)} y2={50 + outer * Math.sin(rad)}
                      stroke={isMajor ? X.text : X.textMut} strokeWidth={isMajor ? '1' : '.5'}
                    />
                    {!isMajor && (
                      <text
                        x={50 + 26 * Math.cos(rad)} y={50 + 26 * Math.sin(rad) + 1.5}
                        textAnchor="middle" fontFamily="monospace" fontSize="4" fill={X.textMut}
                      >
                        {deg}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Minor tick marks every 10 degrees */}
              {Array.from({ length: 36 }, (_, i) => i * 10).map((deg) => {
                if (deg % 30 === 0) return null;
                const rad = ((deg - 90) * Math.PI) / 180;
                return (
                  <line key={deg}
                    x1={50 + 37 * Math.cos(rad)} y1={50 + 37 * Math.sin(rad)}
                    x2={50 + 40 * Math.cos(rad)} y2={50 + 40 * Math.sin(rad)}
                    stroke={X.textMut} strokeWidth=".3"
                  />
                );
              })}

              {/* Cardinal directions */}
              {cardinals.map(([deg, label]) => {
                const rad = ((deg - 90) * Math.PI) / 180;
                return (
                  <text key={label}
                    x={50 + 22 * Math.cos(rad)} y={50 + 22 * Math.sin(rad) + 2.5}
                    textAnchor="middle" fontFamily="monospace" fontSize="7" fontWeight="800"
                    fill={label === 'N' ? X.red : X.text}
                  >
                    {label}
                  </text>
                );
              })}

              {/* Magnetic needle */}
              <line x1="50" y1="18" x2="50" y2="42" stroke={X.red} strokeWidth="1.2" strokeLinecap="round" />
              <line x1="50" y1="58" x2="50" y2="82" stroke={X.text} strokeWidth="1.2" strokeOpacity="0.4" strokeLinecap="round" />
              <polygon points="50,18 47.5,28 52.5,28" fill={X.red} fillOpacity="0.8" />
            </g>

            {/* Center cap */}
            <circle cx="50" cy="50" r="4" fill={X.surface} stroke={X.border} strokeWidth=".8" />
            <circle cx="50" cy="50" r="2" fill={X.textMut} />
          </svg>
        </div>
      </div>

      {/* Heading readout */}
      <div style={{
        padding: '8px 12px', borderRadius: 6,
        background: n.metal, boxShadow: n.concave,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Magnetic Heading</Lbl>
          <M style={{ fontSize: 22, fontWeight: 800, color: X.text, display: 'block', fontFamily: 'monospace' }}>
            {String(Math.round(heading) % 360).padStart(3, '0')}°
          </M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>Cardinal</Lbl>
          <M style={{ fontSize: 14, fontWeight: 700, color: X.indigo, display: 'block' }}>
            {heading >= 315 || heading < 45 ? 'N' : heading < 135 ? 'E' : heading < 225 ? 'S' : 'W'}
          </M>
        </div>
      </div>
    </Card>
  );
}

// ── Vertical Speed ──────────────────────────────────────────────────
export function VerticalSpeed({ title = 'Vertical Speed' }: { title?: string } = {}) {
  const X = getX();
  const n = neo();
  const vsi = useLive(500, 300, 2000);
  const animVsi = useAnim(vsi, 1000);

  const maxVsi = 2000;
  const clampedVsi = Math.max(-maxVsi, Math.min(maxVsi, animVsi));

  // Non-linear scale: compress extremes using sqrt-like mapping
  const nonLinear = (val: number) => {
    const sign = val >= 0 ? 1 : -1;
    const abs = Math.abs(val) / maxVsi;
    return sign * Math.pow(abs, 0.7);
  };

  // 180 degree sweep: top = max positive, bottom = max negative, left center = 0
  // Needle sweeps from -90 (top, max positive) to +90 (bottom, max negative)
  const needleAngle = -90 + (1 - nonLinear(clampedVsi)) * 90;

  const vsiColor = clampedVsi >= 0 ? X.teal : X.amber;

  // Scale marks with non-linear spacing
  const scaleMarks = [-2000, -1500, -1000, -500, 0, 500, 1000, 1500, 2000];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={vsiColor}>
          {Math.abs(vsi) < 100 ? 'Level' : vsi > 0 ? 'Climbing' : 'Descending'}
        </Badge>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        <div style={{
          width: 160, height: 160, borderRadius: '50%',
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, position: 'relative',
        }}>
          <svg viewBox="0 0 100 100" style={{ width: 140, height: 140, display: 'block' }}>
            <defs>
              <linearGradient id="avi-vsi-face" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={X.surface} />
                <stop offset="100%" stopColor={X.bgAlt} />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="url(#avi-vsi-face)" stroke={X.border} strokeWidth=".5" />

            {/* Scale marks on right half (180 degree sweep) */}
            {scaleMarks.map((val) => {
              const nlPos = nonLinear(val);
              // Map from [-1,1] to angle range: top (-90) to bottom (90) on the right side
              const angleDeg = -nlPos * 90;
              const angleRad = ((angleDeg - 90) * Math.PI) / 180;
              // Place marks on left side of dial (facing right)
              const markAngleRad = (angleDeg * Math.PI) / 180;
              const inner = 32;
              const outer = 40;
              const textR = 26;
              const isMajor = val % 1000 === 0;
              return (
                <g key={val}>
                  <line
                    x1={50 + inner * Math.sin(markAngleRad)} y1={50 - inner * Math.cos(markAngleRad)}
                    x2={50 + outer * Math.sin(markAngleRad)} y2={50 - outer * Math.cos(markAngleRad)}
                    stroke={val === 0 ? X.text : X.textMut} strokeWidth={isMajor ? '.8' : '.4'}
                  />
                  {isMajor && (
                    <text
                      x={50 + textR * Math.sin(markAngleRad)} y={50 - textR * Math.cos(markAngleRad) + 1.5}
                      textAnchor="middle" fontFamily="monospace"
                      fontSize={val === 0 ? '5' : '4'} fill={val === 0 ? X.text : X.textMut}
                    >
                      {Math.abs(val / 100)}
                    </text>
                  )}
                </g>
              );
            })}

            {/* UP / DN labels */}
            <text x="65" y="30" textAnchor="middle" fontFamily="monospace" fontSize="4.5" fill={X.teal} fontWeight="600">UP</text>
            <text x="65" y="75" textAnchor="middle" fontFamily="monospace" fontSize="4.5" fill={X.amber} fontWeight="600">DN</text>

            {/* Needle */}
            {(() => {
              const nlVal = nonLinear(clampedVsi);
              const nAngleRad = (nlVal * 90 * Math.PI) / 180;
              return (
                <>
                  <line
                    x1="50" y1="50"
                    x2={50 + 30 * Math.sin(nAngleRad)} y2={50 - 30 * Math.cos(nAngleRad)}
                    stroke={X.text} strokeWidth="1.2" strokeLinecap="round"
                    style={{ transition: `x2 600ms ${ease.o}, y2 600ms ${ease.o}` }}
                  />
                  <line
                    x1="50" y1="50"
                    x2={50 - 8 * Math.sin(nAngleRad)} y2={50 + 8 * Math.cos(nAngleRad)}
                    stroke={X.text} strokeWidth="2" strokeLinecap="round"
                    style={{ transition: `x2 600ms ${ease.o}, y2 600ms ${ease.o}` }}
                  />
                </>
              );
            })()}

            <circle cx="50" cy="50" r="3.5" fill={X.surface} stroke={X.border} strokeWidth=".8" />
            <circle cx="50" cy="50" r="1.5" fill={X.textMut} />
          </svg>
        </div>

        {/* Mechanical digit readout */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Lbl>Vertical Rate</Lbl>
          <div style={{
            padding: '10px 12px', borderRadius: 6,
            background: '#000', boxShadow: n.concave,
            textAlign: 'center', position: 'relative',
          }}>
            {/* Curved shadow overlay */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 6,
              boxShadow: `inset 0 4px 6px rgba(0,0,0,0.6), inset 0 -4px 6px rgba(0,0,0,0.6)`,
              pointerEvents: 'none',
            }} />
            <M style={{
              fontSize: 28, fontWeight: 800, fontFamily: 'monospace',
              color: vsiColor, display: 'block', letterSpacing: '.02em',
            }}>
              {vsi >= 0 ? '+' : ''}{Math.round(vsi)}
            </M>
            <M style={{ fontSize: 9, color: X.textMut }}>ft/min</M>
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{
              flex: 1, padding: '6px 8px', borderRadius: 6,
              background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
            }}>
              <Lbl style={{ marginBottom: 2 }}>Trend</Lbl>
              <M style={{ fontSize: 14, fontWeight: 700, color: vsiColor, display: 'block' }}>
                {vsi > 100 ? '\u2191' : vsi < -100 ? '\u2193' : '\u2192'}
              </M>
            </div>
            <div style={{
              flex: 1, padding: '6px 8px', borderRadius: 6,
              background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
            }}>
              <Lbl style={{ marginBottom: 2 }}>Scale</Lbl>
              <M style={{ fontSize: 10, fontWeight: 600, color: X.textSec, display: 'block' }}>
                {'\u00B1'}{maxVsi}
              </M>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Annunciator Panel ───────────────────────────────────────────────
export function AnnunciatorPanel({ title = 'Annunciator' }: { title?: string } = {}) {
  const X = getX();
  const n = neo();

  const tiles = [
    { icon: 'E', label: 'ENGINE', defaultState: 'off' as const },
    { icon: 'O', label: 'OIL PRESS', defaultState: 'off' as const },
    { icon: 'F', label: 'FUEL LOW', defaultState: 'caution' as const },
    { icon: 'V', label: 'VOLTAGE', defaultState: 'off' as const },
    { icon: 'H', label: 'HYDRAULIC', defaultState: 'off' as const },
    { icon: 'G', label: 'GEAR', defaultState: 'caution' as const },
    { icon: 'T', label: 'TRIM', defaultState: 'off' as const },
    { icon: 'A', label: 'AUTOPILOT', defaultState: 'warning' as const },
  ];

  const [states, setStates] = useState<('off' | 'caution' | 'warning')[]>(
    tiles.map((t) => t.defaultState)
  );

  const toggle = (i: number) => {
    setStates((prev) => {
      const next = [...prev];
      const cycle: ('off' | 'caution' | 'warning')[] = ['off', 'caution', 'warning'];
      const idx = cycle.indexOf(next[i]);
      next[i] = cycle[(idx + 1) % 3];
      return next;
    });
  };

  const hasWarning = states.some((s) => s === 'warning');
  const hasCaution = states.some((s) => s === 'caution');
  const tick = useTick(500);
  const masterPulse = hasWarning && tick % 2 === 0;

  const stateColor = (state: 'off' | 'caution' | 'warning') => {
    if (state === 'warning') return X.red;
    if (state === 'caution') return X.amber;
    return X.textMut;
  };

  return (
    <Card style={{ width: 350 }} glow={hasWarning ? X.red : undefined}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={hasWarning ? X.red : hasCaution ? X.amber : X.teal}>
          {hasWarning ? 'WARNING' : hasCaution ? 'Caution' : 'Normal'}
        </Badge>
      </div>

      {/* MASTER WARNING button */}
      <button
        onClick={() => setStates(states.map(() => 'off'))}
        style={{
          width: '100%', padding: '8px 0', marginBottom: 12,
          borderRadius: 6, border: `2px solid ${hasWarning ? X.red : X.border}`,
          background: hasWarning
            ? masterPulse
              ? `linear-gradient(180deg, ${X.red}cc, ${X.red})`
              : `linear-gradient(180deg, ${X.red}60, ${X.red}40)`
            : `linear-gradient(180deg, ${X.surface}, ${X.bgAlt})`,
          boxShadow: hasWarning
            ? `0 0 12px ${X.red}40, inset 0 1px 0 #ffffff15`
            : `0 2px 6px ${X.bg}40, inset 0 1px 0 #ffffff10`,
          cursor: 'pointer',
          transition: `background 250ms ${ease.mv}, box-shadow 250ms ${ease.mv}`,
        }}
      >
        <M style={{
          fontSize: 11, fontWeight: 800, letterSpacing: '.1em',
          color: hasWarning ? '#fff' : X.textMut,
          display: 'block', textAlign: 'center',
        }}>
          MASTER WARNING
        </M>
      </button>

      {/* 4x2 grid of warning tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
        {tiles.map((tile, i) => {
          const state = states[i];
          const color = stateColor(state);
          const isActive = state !== 'off';
          const isWarning = state === 'warning';

          return (
            <button
              key={i}
              onClick={() => toggle(i)}
              style={{
                padding: '8px 4px', borderRadius: 6,
                border: `1px solid ${isActive ? color + '60' : X.border}`,
                background: isActive
                  ? `linear-gradient(180deg, ${color}18, ${color}08)`
                  : `linear-gradient(180deg, ${X.surface}, ${X.bgAlt})`,
                boxShadow: isActive
                  ? `inset 0 2px 4px rgba(0,0,0,0.2)`
                  : `0 2px 4px ${X.bg}30, inset 0 1px 0 #ffffff08`,
                transform: isActive ? 'translateY(1px)' : 'translateY(0)',
                transition: `transform 80ms ${ease.mv}, box-shadow 80ms ${ease.mv}, background 150ms ${ease.mv}`,
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 4,
              }}
            >
              {/* LED lamp */}
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: isActive ? color : X.border,
                boxShadow: isActive ? `0 0 6px ${color}60` : 'none',
                animation: isWarning ? 'br 1s ease infinite' : 'none',
              }} />
              {/* Icon letter */}
              <M style={{
                fontSize: 14, fontWeight: 800, color: isActive ? color : X.textMut + '60',
                display: 'block', lineHeight: 1,
              }}>
                {tile.icon}
              </M>
              {/* Label */}
              <M style={{
                fontSize: 6, fontWeight: 600, color: isActive ? color : X.textMut,
                letterSpacing: '.05em', textAlign: 'center', lineHeight: 1.2,
              }}>
                {tile.label}
              </M>
            </button>
          );
        })}
      </div>

      {/* Status summary */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', marginTop: 10,
        padding: '6px 8px', borderRadius: 6,
        background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        <M style={{ fontSize: 8, color: X.textMut }}>
          {states.filter((s) => s === 'warning').length} warnings, {states.filter((s) => s === 'caution').length} cautions
        </M>
        <M style={{ fontSize: 8, color: X.teal, fontWeight: 600 }}>
          Click tiles to toggle
        </M>
      </div>
    </Card>
  );
}
