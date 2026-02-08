import { useState } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { useAnim, useTick } from '../hooks';

function neo() {
  const X = getX();
  const dark = X.bg + '40';
  const light = '#ffffff12';
  return {
    raised: '4px 4px 10px ' + dark + ', -2px -2px 6px ' + light,
    concave: 'inset 3px 3px 8px ' + dark + ', inset -2px -2px 5px ' + light,
    bezel: 'inset 0 1px 0 ' + light + ', inset 0 -1px 0 rgba(0,0,0,0.3), 0 2px 8px ' + dark,
    metal: 'linear-gradient(135deg, ' + X.surface + ', ' + X.bgAlt + ' 40%, ' + X.surface + ' 60%, ' + X.bgAlt + ')',
  };
}

// ── Mercury Barometer ──────────────────────────────────────────────
export function MercuryBarometer({ title = 'Barometer', maxHPa = 1050, pressure, prevPressure }: { title?: string; maxHPa?: number; pressure: number; prevPressure: number }) {
  const X = getX();
  const n = neo();
  const trend = pressure > prevPressure + 1 ? 'rising' : pressure < prevPressure - 1 ? 'falling' : 'steady';
  const trendArrow = trend === 'rising' ? '\u2191' : trend === 'falling' ? '\u2193' : '\u2192';
  const trendColor = trend === 'rising' ? X.teal : trend === 'falling' ? X.red : X.amber;

  const minHPa = 950;
  const fillPct = Math.min(100, Math.max(0, ((pressure - minHPa) / (maxHPa - minHPa)) * 100));
  const tubeTop = 15;
  const tubeBot = 195;
  const tubeH = tubeBot - tubeTop;
  const mercuryH = (fillPct / 100) * tubeH;
  const mercuryY = tubeBot - mercuryH;

  // Scale markings
  const marks = [960, 980, 1000, 1013, 1020, 1040];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={trendColor}>{trendArrow} {trend}</Badge>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <svg viewBox="0 0 90 220" style={{ width: 90, height: 220, display: 'block' }}>
          <defs>
            <linearGradient id="wx-baro-wood" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8B6914" />
              <stop offset="25%" stopColor="#A0784C" />
              <stop offset="50%" stopColor="#7B5B3A" />
              <stop offset="75%" stopColor="#9C7A50" />
              <stop offset="100%" stopColor="#6B4E2E" />
            </linearGradient>
            <linearGradient id="wx-baro-glass" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity=".06" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity=".02" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity=".02" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity=".06" />
            </linearGradient>
            <linearGradient id="wx-baro-mercury" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#d0d0d0" />
              <stop offset="50%" stopColor="#c0c0c0" />
              <stop offset="100%" stopColor="#b0b0b0" />
            </linearGradient>
          </defs>

          {/* Wooden backboard */}
          <rect x="20" y="5" width="40" height="210" rx="6" fill="url(#wx-baro-wood)" opacity=".7" />
          <rect x="20" y="5" width="40" height="210" rx="6" fill="none" stroke={X.border} strokeWidth=".5" />

          {/* Glass tube */}
          <rect x="35" y={tubeTop} width="12" height={tubeH} rx="6" fill={X.bgAlt} stroke={X.border} strokeWidth=".6" opacity=".9" />
          <rect x="35" y={tubeTop} width="12" height={tubeH} rx="6" fill="url(#wx-baro-glass)" />

          {/* Mercury column */}
          <rect x="36.5" y={mercuryY} width="9" height={mercuryH}
            rx="4.5" fill="url(#wx-baro-mercury)"
            style={{ transition: `y 800ms ${ease.o}, height 800ms ${ease.o}` }} />

          {/* Concave meniscus at top of mercury */}
          <path d={`M36.5 ${mercuryY} Q41 ${mercuryY + 3} 45.5 ${mercuryY}`}
            fill="#a8a8a8" opacity=".6"
            style={{ transition: `d 800ms ${ease.o}` }} />

          {/* Specular highlight on mercury */}
          <rect x="39" y={mercuryY + 4} width="1.5" height={Math.max(0, mercuryH - 8)}
            rx=".75" fill="#ffffff" opacity=".07"
            style={{ transition: `y 800ms ${ease.o}, height 800ms ${ease.o}` }} />

          {/* Bulb at bottom */}
          <circle cx="41" cy={tubeBot + 8} r="10" fill="#c0c0c0" opacity=".85" />
          <circle cx="41" cy={tubeBot + 8} r="10" fill="none" stroke={X.border} strokeWidth=".5" />
          <circle cx="39" cy={tubeBot + 6} r="3" fill="#ffffff" opacity=".06" />

          {/* Scale markings on right side */}
          {marks.map(hpa => {
            const yPos = tubeBot - ((hpa - minHPa) / (maxHPa - minHPa)) * tubeH;
            return (
              <g key={hpa}>
                <line x1="48" y1={yPos} x2="54" y2={yPos} stroke={X.textMut} strokeWidth=".5" />
                <text x="56" y={yPos + 3} fill={X.textMut} fontSize="6" fontFamily="monospace">{hpa}</text>
              </g>
            );
          })}
        </svg>

        <div style={{ flex: 1 }}>
          {/* Digital readout */}
          <div style={{
            padding: '12px 14px', borderRadius: 8,
            background: n.metal, boxShadow: n.concave, marginBottom: 10,
          }}>
            <Lbl>Pressure</Lbl>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <M style={{ fontSize: 28, fontWeight: 800, color: X.text }}>{pressure.toFixed(1)}</M>
              <M style={{ fontSize: 10, color: X.textMut }}>hPa</M>
            </div>
          </div>

          <div style={{
            padding: '8px 14px', borderRadius: 8,
            background: n.metal, boxShadow: n.concave, marginBottom: 10,
          }}>
            <Lbl>Trend</Lbl>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <M style={{ fontSize: 20, fontWeight: 800, color: trendColor }}>{trendArrow}</M>
              <M style={{ fontSize: 11, fontWeight: 600, color: trendColor, textTransform: 'capitalize' }}>{trend}</M>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Lbl>inHg</Lbl>
              <M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{(pressure * 0.02953).toFixed(2)}</M>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Lbl>mmHg</Lbl>
              <M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{(pressure * 0.75006).toFixed(0)}</M>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Anemometer ─────────────────────────────────────────────────────
export function Anemometer({ title = 'Wind Speed', windSpeed }: { title?: string; windSpeed: number }) {
  const X = getX();
  const n = neo();
  const tick = useTick(40);
  const safeWind = Math.max(0, windSpeed);

  // Rotation: speed proportional to wind speed
  const rotationDeg = (tick * safeWind * 0.8) % 360;
  const blurAmount = Math.min(1.5, safeWind / 50);

  // Beaufort scale classification
  const beaufort = safeWind < 1 ? { scale: 0, label: 'Calm' }
    : safeWind < 6 ? { scale: 1, label: 'Light Air' }
    : safeWind < 12 ? { scale: 2, label: 'Light Breeze' }
    : safeWind < 20 ? { scale: 3, label: 'Gentle Breeze' }
    : safeWind < 29 ? { scale: 4, label: 'Moderate Breeze' }
    : safeWind < 39 ? { scale: 5, label: 'Fresh Breeze' }
    : safeWind < 50 ? { scale: 6, label: 'Strong Breeze' }
    : safeWind < 62 ? { scale: 7, label: 'High Wind' }
    : { scale: 8, label: 'Gale' };

  const beaufortColor = beaufort.scale <= 2 ? X.teal : beaufort.scale <= 4 ? X.amber : X.red;

  // Cup positions at 120 degree intervals
  const arms = [0, 120, 240];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={beaufortColor}>Beaufort {beaufort.scale}</Badge>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <svg viewBox="0 0 140 140" style={{ width: 140, height: 140, display: 'block' }}>
          <defs>
            <radialGradient id="wx-anemo-hub">
              <stop offset="0%" stopColor={X.surface} />
              <stop offset="100%" stopColor={X.bgAlt} />
            </radialGradient>
          </defs>

          {/* Background circle */}
          <circle cx="70" cy="70" r="65" fill="none" stroke={X.borderLight} strokeWidth=".5" strokeDasharray="2 3" />

          {/* Rotating cup assembly */}
          <g transform={`rotate(${rotationDeg} 70 70)`}
            style={{ filter: `blur(${blurAmount}px)` }}>
            {arms.map((angle, i) => {
              const rad = (angle * Math.PI) / 180;
              const armLen = 40;
              const ex = 70 + Math.cos(rad) * armLen;
              const ey = 70 + Math.sin(rad) * armLen;
              // Cup semicircle perpendicular to arm
              const cupRad = (angle + 90) * Math.PI / 180;
              const cpx1 = ex + Math.cos(cupRad) * 8;
              const cpy1 = ey + Math.sin(cupRad) * 8;
              const cpx2 = ex - Math.cos(cupRad) * 8;
              const cpy2 = ey - Math.sin(cupRad) * 8;
              return (
                <g key={i}>
                  {/* Arm */}
                  <line x1="70" y1="70" x2={ex} y2={ey} stroke={X.textMut} strokeWidth="1.5" />
                  {/* Cup (semicircle) */}
                  <path d={`M${cpx1} ${cpy1} A8 8 0 0 1 ${cpx2} ${cpy2}`}
                    fill={X.surface} stroke={X.border} strokeWidth=".8" />
                </g>
              );
            })}
          </g>

          {/* Central hub (on top, not blurred) */}
          <circle cx="70" cy="70" r="8" fill="url(#wx-anemo-hub)" stroke={X.border} strokeWidth=".8" />
          <circle cx="70" cy="70" r="3" fill={X.textMut} />
        </svg>

        <div style={{ flex: 1 }}>
          {/* Digital speed readout */}
          <div style={{
            padding: '12px 14px', borderRadius: 8,
            background: n.metal, boxShadow: n.concave, marginBottom: 10,
          }}>
            <Lbl>Speed</Lbl>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <M style={{ fontSize: 28, fontWeight: 800, color: X.text }}>{safeWind.toFixed(1)}</M>
              <M style={{ fontSize: 10, color: X.textMut }}>km/h</M>
            </div>
          </div>

          <div style={{
            padding: '8px 14px', borderRadius: 8,
            background: n.metal, boxShadow: n.concave, marginBottom: 10,
          }}>
            <Lbl>Beaufort Classification</Lbl>
            <M style={{ fontSize: 11, fontWeight: 700, color: beaufortColor, marginTop: 3, display: 'block' }}>
              {beaufort.label}
            </M>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Lbl>m/s</Lbl>
              <M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{(safeWind / 3.6).toFixed(1)}</M>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Lbl>knots</Lbl>
              <M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{(safeWind / 1.852).toFixed(1)}</M>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Rain Gauge ─────────────────────────────────────────────────────
export function RainGauge({ title = 'Rain Gauge', rainfall, rate }: { title?: string; rainfall: number; rate: number }) {
  const X = getX();
  const n = neo();
  const tick = useTick(60);
  const safeRain = Math.max(0, rainfall);
  const safeRate = Math.max(0, rate);

  const vesselTop = 20;
  const vesselBot = 180;
  const vesselH = vesselBot - vesselTop;
  const maxMm = 50;
  const fillPct = Math.min(100, (safeRain / maxMm) * 100);
  const waterH = (fillPct / 100) * vesselH;
  const waterY = vesselBot - waterH;

  // Drip animation: 3 drops cycling
  const drops = [0, 1, 2].map(i => {
    const cycle = (tick + i * 20) % 60;
    const dropY = vesselTop - 10 + (cycle / 60) * (waterY - vesselTop + 10);
    const visible = cycle < 55 && dropY < waterY - 2;
    return { y: dropY, opacity: visible ? 0.7 : 0, x: 52 + (i - 1) * 6 };
  });

  // Splash ripple
  const splashPhase = (tick % 30) / 30;
  const splashR = 3 + splashPhase * 8;
  const splashOpacity = Math.max(0, 0.5 - splashPhase * 0.5);

  // Wave on water surface
  const waveOffset = tick * 0.15;

  // Measurement markings
  const marksMm = [0, 10, 20, 30, 40, 50];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={safeRate > 4 ? X.red : safeRate > 2 ? X.amber : X.teal}>
          {safeRate > 4 ? 'Heavy' : safeRate > 2 ? 'Moderate' : 'Light'}
        </Badge>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <svg viewBox="0 0 100 200" style={{ width: 100, height: 200, display: 'block' }}>
          <defs>
            <linearGradient id="wx-rain-water" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity=".6" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity=".2" />
            </linearGradient>
            <clipPath id="wx-rain-clip">
              <rect x="35" y={vesselTop + 2} width="32" height={vesselH - 4} rx="2" />
            </clipPath>
          </defs>

          {/* Cylindrical vessel */}
          <rect x="34" y={vesselTop} width="34" height={vesselH} rx="4"
            fill={X.bgAlt} stroke={X.border} strokeWidth=".8" opacity=".9" />
          {/* Rounded top funnel */}
          <path d={`M28 ${vesselTop} Q28 ${vesselTop - 8} 34 ${vesselTop - 8} L68 ${vesselTop - 8} Q74 ${vesselTop - 8} 74 ${vesselTop} L68 ${vesselTop} L34 ${vesselTop} Z`}
            fill={X.surface} stroke={X.border} strokeWidth=".6" opacity=".7" />

          {/* Collected water with wave surface */}
          <g clipPath="url(#wx-rain-clip)">
            <rect x="35" y={waterY} width="32" height={waterH}
              fill="url(#wx-rain-water)"
              style={{ transition: `y 1200ms ${ease.o}, height 1200ms ${ease.o}` }} />
            {/* Wave surface */}
            <path d={`M35 ${waterY} Q43 ${waterY + Math.sin(waveOffset) * 2} 51 ${waterY} Q59 ${waterY - Math.sin(waveOffset) * 2} 67 ${waterY}`}
              fill="#60a5fa" opacity=".25"
              style={{ transition: `d 400ms linear` }} />
          </g>

          {/* Falling drops */}
          {drops.map((d, i) => (
            <ellipse key={i} cx={d.x} cy={d.y} rx="1.5" ry="2.5"
              fill="#60a5fa" opacity={d.opacity} />
          ))}

          {/* Splash ripple at water surface */}
          <ellipse cx="51" cy={waterY} rx={splashR} ry={splashR * 0.3}
            fill="none" stroke="#60a5fa" strokeWidth=".5" opacity={splashOpacity} />

          {/* Measurement markings on vessel side */}
          {marksMm.map(mm => {
            const yPos = vesselBot - (mm / maxMm) * vesselH;
            return (
              <g key={mm}>
                <line x1="68" y1={yPos} x2="74" y2={yPos} stroke={X.textMut} strokeWidth=".4" />
                <text x="76" y={yPos + 2.5} fill={X.textMut} fontSize="5.5" fontFamily="monospace">{mm}</text>
              </g>
            );
          })}
        </svg>

        <div style={{ flex: 1 }}>
          <div style={{
            padding: '12px 14px', borderRadius: 8,
            background: n.metal, boxShadow: n.concave, marginBottom: 10,
          }}>
            <Lbl>Accumulated</Lbl>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <M style={{ fontSize: 28, fontWeight: 800, color: X.text }}>{safeRain.toFixed(1)}</M>
              <M style={{ fontSize: 10, color: X.textMut }}>mm</M>
            </div>
          </div>

          <div style={{
            padding: '8px 14px', borderRadius: 8,
            background: n.metal, boxShadow: n.concave, marginBottom: 10,
          }}>
            <Lbl>Rate</Lbl>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <M style={{ fontSize: 18, fontWeight: 800, color: safeRate > 4 ? X.red : safeRate > 2 ? X.amber : X.teal }}>
                {safeRate.toFixed(1)}
              </M>
              <M style={{ fontSize: 9, color: X.textMut }}>mm/hr</M>
            </div>
          </div>

          <Prog value={fillPct} color="#3b82f6" h={4} style={{ marginBottom: 6 }} />
          <M style={{ fontSize: 8, color: X.textMut }}>{fillPct.toFixed(0)}% of {maxMm}mm capacity</M>
        </div>
      </div>
    </Card>
  );
}

// ── Wind Vane ──────────────────────────────────────────────────────
export function WindVane({ title = 'Wind Direction', direction }: { title?: string; direction: number }) {
  const X = getX();
  const n = neo();
  const safeDir = ((direction % 360) + 360) % 360;

  const cardinals16 = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
  ];

  const cardinalIdx = Math.round(safeDir / 22.5) % 16;
  const cardinalLabel = cardinals16[cardinalIdx];

  // Drum counter digits for degrees
  const degStr = String(Math.round(safeDir)).padStart(3, '0');

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>{cardinalLabel}</Badge>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <svg viewBox="0 0 160 160" style={{ width: 160, height: 160, display: 'block' }}>
          <defs>
            <radialGradient id="wx-vane-bg">
              <stop offset="0%" stopColor={X.surface} stopOpacity=".5" />
              <stop offset="100%" stopColor={X.bgAlt} stopOpacity=".8" />
            </radialGradient>
          </defs>

          {/* Compass rose background */}
          <circle cx="80" cy="80" r="74" fill="url(#wx-vane-bg)" stroke={X.border} strokeWidth=".6" />
          <circle cx="80" cy="80" r="68" fill="none" stroke={X.borderLight} strokeWidth=".3" />

          {/* 16-point labels around the ring */}
          {cardinals16.map((label, i) => {
            const angle = (i * 22.5 - 90) * Math.PI / 180;
            const r = 60;
            const tx = 80 + Math.cos(angle) * r;
            const ty = 80 + Math.sin(angle) * r;
            const isPrimary = i % 4 === 0;
            const isSecondary = i % 2 === 0;
            return (
              <text key={i} x={tx} y={ty + 1.5}
                textAnchor="middle" dominantBaseline="middle"
                fill={isPrimary ? X.text : isSecondary ? X.textSec : X.textMut}
                fontSize={isPrimary ? 8 : isSecondary ? 6 : 4.5}
                fontFamily="monospace"
                fontWeight={isPrimary ? 700 : 500}>
                {label}
              </text>
            );
          })}

          {/* Tick marks */}
          {Array.from({ length: 72 }).map((_, i) => {
            const angle = (i * 5 - 90) * Math.PI / 180;
            const r1 = i % 9 === 0 ? 44 : i % 2 === 0 ? 48 : 50;
            const r2 = 52;
            return (
              <line key={i}
                x1={80 + Math.cos(angle) * r1} y1={80 + Math.sin(angle) * r1}
                x2={80 + Math.cos(angle) * r2} y2={80 + Math.sin(angle) * r2}
                stroke={i % 18 === 0 ? X.textSec : X.borderLight} strokeWidth={i % 18 === 0 ? .8 : .3} />
            );
          })}

          {/* Arrow pointer with spring wobble easing */}
          <g style={{
            transform: `rotate(${safeDir}deg)`,
            transformOrigin: '80px 80px',
            transition: 'transform 800ms cubic-bezier(.34,1.56,.64,1)',
          }}>
            {/* Arrow body */}
            <polygon points="80,20 85,75 80,70 75,75" fill={X.red} opacity=".85" />
            <polygon points="80,140 85,85 80,90 75,85" fill={X.textMut} opacity=".5" />
          </g>

          {/* Center hub */}
          <circle cx="80" cy="80" r="6" fill={X.surface} stroke={X.border} strokeWidth=".6" />
          <circle cx="80" cy="80" r="2.5" fill={X.textMut} />
        </svg>

        <div style={{ flex: 1 }}>
          {/* Drum counter window for degrees */}
          <div style={{
            padding: '10px 14px', borderRadius: 8,
            background: n.metal, boxShadow: n.concave, marginBottom: 10,
          }}>
            <Lbl>Heading</Lbl>
            <div style={{ display: 'flex', gap: 2, marginTop: 6 }}>
              {degStr.split('').map((digit, i) => (
                <div key={i} style={{
                  width: 24, height: 32, borderRadius: 4,
                  background: X.bgAlt, border: `1px solid ${X.borderLight}`,
                  boxShadow: n.concave, overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    transform: `translateY(${-parseInt(digit) * 32}px)`,
                    transition: `transform 600ms ${ease.sp}`,
                  }}>
                    {Array.from({ length: 10 }).map((_, d) => (
                      <div key={d} style={{
                        width: 24, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <M style={{ fontSize: 18, fontWeight: 800, color: X.text, fontFamily: 'monospace' }}>{d}</M>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <M style={{ fontSize: 16, fontWeight: 700, color: X.textMut, display: 'flex', alignItems: 'center', marginLeft: 2 }}>deg</M>
            </div>
          </div>

          <div style={{
            padding: '8px 14px', borderRadius: 8,
            background: n.metal, boxShadow: n.concave,
          }}>
            <Lbl>Cardinal</Lbl>
            <M style={{ fontSize: 16, fontWeight: 800, color: X.indigo, marginTop: 3, display: 'block' }}>
              {cardinalLabel}
            </M>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Hygrometer ─────────────────────────────────────────────────────
export function Hygrometer({ title = 'Humidity', dryTemp, wetTemp }: { title?: string; dryTemp: number; wetTemp: number }) {
  const X = getX();
  const n = neo();
  const safeDry = Math.max(0, dryTemp);
  const safeWet = Math.min(safeDry, Math.max(0, wetTemp));

  // Approximate relative humidity from wet/dry bulb difference
  const diff = safeDry - safeWet;
  const humidity = Math.max(0, Math.min(100, 100 - 5 * diff));

  const humStr = String(Math.round(humidity)).padStart(2, '0');

  const minT = 10;
  const maxT = 40;

  // Thermometer rendering helper
  const renderThermo = (temp: number, label: string, mercuryColor: string, bulbColor: string, xOffset: number) => {
    const fillPct = Math.min(100, Math.max(0, ((temp - minT) / (maxT - minT)) * 100));
    const tubeTop = 20;
    const tubeBot = 155;
    const tubeH = tubeBot - tubeTop;
    const mercuryH = (fillPct / 100) * tubeH;
    const mercuryY = tubeBot - mercuryH;
    const marks = [10, 15, 20, 25, 30, 35, 40];

    return (
      <g>
        {/* Glass tube */}
        <rect x={xOffset} y={tubeTop} width="10" height={tubeH} rx="5"
          fill={X.bgAlt} stroke={X.border} strokeWidth=".5" opacity=".9" />

        {/* Mercury fill */}
        <rect x={xOffset + 1.5} y={mercuryY} width="7" height={mercuryH}
          rx="3.5" fill={mercuryColor} opacity=".8"
          style={{ transition: `y 800ms ${ease.o}, height 800ms ${ease.o}` }} />

        {/* Bulb at bottom */}
        <circle cx={xOffset + 5} cy={tubeBot + 9} r="9" fill={bulbColor} opacity=".85" />
        <circle cx={xOffset + 5} cy={tubeBot + 9} r="9" fill="none" stroke={X.border} strokeWidth=".4" />
        <circle cx={xOffset + 3} cy={tubeBot + 7} r="2.5" fill="#ffffff" opacity=".05" />

        {/* Scale markings */}
        {marks.map(t => {
          const yPos = tubeBot - ((t - minT) / (maxT - minT)) * tubeH;
          return (
            <g key={t}>
              <line x1={xOffset + 10} y1={yPos} x2={xOffset + 14} y2={yPos}
                stroke={X.textMut} strokeWidth=".3" />
              <text x={xOffset + 16} y={yPos + 2} fill={X.textMut} fontSize="4.5" fontFamily="monospace">{t}</text>
            </g>
          );
        })}

        {/* Label */}
        <text x={xOffset + 5} y={tubeTop - 6} textAnchor="middle"
          fill={X.textMut} fontSize="5" fontFamily="monospace">{label}</text>
      </g>
    );
  };

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={humidity > 70 ? X.amber : humidity < 30 ? X.red : X.teal}>
          {humidity > 70 ? 'High' : humidity < 30 ? 'Low' : 'Comfortable'}
        </Badge>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <svg viewBox="0 0 90 190" style={{ width: 90, height: 190, display: 'block' }}>
          {/* Dry bulb (silver mercury) */}
          {renderThermo(safeDry, 'DRY', '#c0c0c0', '#c0c0c0', 10)}
          {/* Wet bulb (blue-tinted mercury) */}
          {renderThermo(safeWet, 'WET', '#8ab4d6', '#7da8c8', 50)}
        </svg>

        <div style={{ flex: 1 }}>
          {/* Humidity drum counter */}
          <div style={{
            padding: '10px 14px', borderRadius: 8,
            background: n.metal, boxShadow: n.concave, marginBottom: 10,
          }}>
            <Lbl>Relative Humidity</Lbl>
            <div style={{ display: 'flex', gap: 2, marginTop: 6, alignItems: 'center' }}>
              {humStr.split('').map((digit, i) => (
                <div key={i} style={{
                  width: 24, height: 32, borderRadius: 4,
                  background: X.bgAlt, border: `1px solid ${X.borderLight}`,
                  boxShadow: n.concave, overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{
                    transform: `translateY(${-parseInt(digit) * 32}px)`,
                    transition: `transform 600ms ${ease.sp}`,
                  }}>
                    {Array.from({ length: 10 }).map((_, d) => (
                      <div key={d} style={{
                        width: 24, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <M style={{ fontSize: 18, fontWeight: 800, color: X.text, fontFamily: 'monospace' }}>{d}</M>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <M style={{ fontSize: 16, fontWeight: 700, color: X.textMut, marginLeft: 2 }}>%</M>
            </div>
          </div>

          {/* Temperature readings */}
          <div style={{
            padding: '8px 14px', borderRadius: 8,
            background: n.metal, boxShadow: n.concave, marginBottom: 10,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div>
                <Lbl>Dry Bulb</Lbl>
                <M style={{ fontSize: 14, fontWeight: 800, color: X.text }}>{safeDry.toFixed(1)}<span style={{ fontSize: 8, color: X.textMut }}> C</span></M>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Lbl>Wet Bulb</Lbl>
                <M style={{ fontSize: 14, fontWeight: 800, color: '#7da8c8' }}>{safeWet.toFixed(1)}<span style={{ fontSize: 8, color: X.textMut }}> C</span></M>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Lbl>Depression</Lbl>
              <M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{diff.toFixed(1)} C</M>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Lbl>Dew Point</Lbl>
              <M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>{(safeDry - ((100 - humidity) / 5)).toFixed(1)} C</M>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Storm Glass ────────────────────────────────────────────────────
export function StormGlass({ title = 'Storm Glass', temp }: { title?: string; temp: number }) {
  const X = getX();
  const n = neo();
  const [mode, setMode] = useState<'Clear' | 'Cloudy' | 'Storm' | 'Snow'>('Clear');
  const tick = useTick(200);

  const modes: Array<'Clear' | 'Cloudy' | 'Storm' | 'Snow'> = ['Clear', 'Cloudy', 'Storm', 'Snow'];
  const modeColors: Record<string, string> = { Clear: X.teal, Cloudy: X.amber, Storm: X.red, Snow: X.indigo };

  // Crystal formation parameters based on weather mode
  const crystalConfig = {
    Clear: { count: 4, spread: 0.3, size: 2, yBias: 0.8 },
    Cloudy: { count: 8, spread: 0.5, size: 2.5, yBias: 0.5 },
    Storm: { count: 16, spread: 0.8, size: 3.5, yBias: 0.3 },
    Snow: { count: 12, spread: 0.6, size: 3, yBias: 0.2 },
  };
  const cfg = crystalConfig[mode];

  // Generate crystal positions (deterministic from mode)
  const crystals = Array.from({ length: cfg.count }).map((_, i) => {
    const seed = i * 137.508 + modes.indexOf(mode) * 42;
    const px = 0.25 + (((Math.sin(seed) + 1) / 2) * cfg.spread * 0.5);
    const py = cfg.yBias - 0.05 + (((Math.cos(seed * 1.3) + 1) / 2) * (1 - cfg.yBias) * 0.6);
    const rot = (seed * 57.3) % 360;
    const wobble = Math.sin(tick * 0.05 + i) * 0.5;
    return { x: 50 + (px - 0.5) * 40, y: 30 + py * 140 + wobble, rot, size: cfg.size * (0.7 + ((Math.sin(seed * 2.1) + 1) / 2) * 0.6) };
  });

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={modeColors[mode]}>{mode}</Badge>
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <svg viewBox="0 0 100 200" style={{ width: 100, height: 200, display: 'block' }}>
          <defs>
            <linearGradient id="wx-storm-liquid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e8e8f0" stopOpacity=".15" />
              <stop offset="50%" stopColor="#d0d0e0" stopOpacity=".1" />
              <stop offset="100%" stopColor="#c0c0d8" stopOpacity=".2" />
            </linearGradient>
            <radialGradient id="wx-storm-refract" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="60%" stopColor="#4488ff" stopOpacity=".03" />
              <stop offset="100%" stopColor="#ffaa00" stopOpacity=".03" />
            </radialGradient>
            <clipPath id="wx-storm-clip">
              <ellipse cx="50" cy="105" rx="22" ry="80" />
            </clipPath>
          </defs>

          {/* Sealed glass vessel - elongated oval */}
          <ellipse cx="50" cy="105" rx="24" ry="82"
            fill={X.bgAlt} stroke={X.border} strokeWidth=".7" opacity=".85" />

          {/* Liquid fill */}
          <ellipse cx="50" cy="105" rx="22" ry="80"
            fill="url(#wx-storm-liquid)" />

          {/* Crystal formations inside vessel */}
          <g clipPath="url(#wx-storm-clip)">
            {crystals.map((c, i) => (
              <g key={i} transform={`translate(${c.x} ${c.y}) rotate(${c.rot})`}>
                <rect x={-c.size / 2} y={-c.size / 2} width={c.size} height={c.size}
                  fill={mode === 'Snow' ? '#e0e8ff' : '#d0d0d0'}
                  opacity={mode === 'Storm' ? .6 : .4}
                  transform={`rotate(45)`}
                  style={{ transition: `opacity 400ms ${ease.o}` }} />
                {c.size > 2.5 && (
                  <rect x={-c.size * 0.3} y={-c.size * 0.3} width={c.size * 0.6} height={c.size * 0.6}
                    fill="#ffffff" opacity=".15" transform="rotate(45)" />
                )}
              </g>
            ))}
          </g>

          {/* Glass refraction overlay */}
          <ellipse cx="50" cy="105" rx="22" ry="80"
            fill="url(#wx-storm-refract)" />

          {/* Specular highlight on glass */}
          <ellipse cx="40" cy="70" rx="5" ry="30"
            fill="#ffffff" opacity=".04" />

          {/* Seal at top */}
          <ellipse cx="50" cy="23" rx="10" ry="3"
            fill={X.surface} stroke={X.border} strokeWidth=".4" />
        </svg>

        <div style={{ flex: 1 }}>
          {/* Weather mode selector */}
          <div style={{ display: 'flex', gap: 3, marginBottom: 10, flexWrap: 'wrap' }}>
            {modes.map(m => (
              <Btn key={m} small ghost active={mode === m} onClick={() => setMode(m)} color={modeColors[m]}>
                {m}
              </Btn>
            ))}
          </div>

          <div style={{
            padding: '12px 14px', borderRadius: 8,
            background: n.metal, boxShadow: n.concave, marginBottom: 10,
          }}>
            <Lbl>Forecast</Lbl>
            <M style={{ fontSize: 14, fontWeight: 800, color: modeColors[mode], marginTop: 3, display: 'block' }}>
              {mode === 'Clear' ? 'Fair Weather' : mode === 'Cloudy' ? 'Overcast Expected' : mode === 'Storm' ? 'Storms Approaching' : 'Snowfall Likely'}
            </M>
          </div>

          <div style={{
            padding: '8px 14px', borderRadius: 8,
            background: n.metal, boxShadow: n.concave, marginBottom: 10,
          }}>
            <Lbl>Temperature</Lbl>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <M style={{ fontSize: 22, fontWeight: 800, color: X.text }}>{temp.toFixed(1)}</M>
              <M style={{ fontSize: 10, color: X.textMut }}>C</M>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Lbl>Crystals</Lbl>
              <M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{cfg.count} visible</M>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Lbl>Pattern</Lbl>
              <M style={{ fontSize: 10, fontWeight: 700, color: modeColors[mode] }}>
                {mode === 'Clear' ? 'Settled' : mode === 'Cloudy' ? 'Dispersed' : mode === 'Storm' ? 'Feathered' : 'Fern-like'}
              </M>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
