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

// ── Fermentation Vessel ──────────────────────────────────────────────
export function FermentationVessel({ title = 'Fermentation', vesselCount = 3 }: { title?: string; vesselCount?: number } = {}) {
  const X = getX();
  const n = neo();
  const count = Math.min(Math.max(vesselCount, 1), 4);

  const temps = [18.5, 20.1, 16.4, 19.8];
  const pressures = [14.2, 12.8, 15.1, 13.5];
  const fills = [72, 88, 45, 61];
  const animFills = [useAnim(fills[0], 1200), useAnim(fills[1], 1300), useAnim(fills[2], 1100), useAnim(fills[3], 1400)];

  const statuses: Array<{ label: string; color: string }> = [];
  for (let i = 0; i < count; i++) {
    const t = temps[i];
    statuses.push(
      t > 22 ? { label: 'Hot', color: X.red } :
      t > 20 ? { label: 'Warm', color: X.amber } :
      { label: 'Optimal', color: X.teal }
    );
  }

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.amber}>{count} Vessel{count > 1 ? 's' : ''}</Badge>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {Array.from({ length: count }).map((_, i) => {
          const fillPct = Math.min(100, Math.max(0, animFills[i]));
          const vesselColor = statuses[i].color;
          return (
            <div key={i} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              animation: `fu 150ms ${ease.o} ${i * 40}ms both`,
            }}>
              <svg viewBox="0 0 60 100" style={{ width: 54, height: 90, display: 'block' }}>
                <defs>
                  <linearGradient id={`brew-vessel-m${i}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={X.surface} stopOpacity=".9" />
                    <stop offset="40%" stopColor={X.bgAlt} stopOpacity=".7" />
                    <stop offset="60%" stopColor={X.surface} stopOpacity=".8" />
                    <stop offset="100%" stopColor={X.bgAlt} stopOpacity=".6" />
                  </linearGradient>
                  <linearGradient id={`brew-vessel-f${i}`} x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor={vesselColor} stopOpacity=".7" />
                    <stop offset="100%" stopColor={vesselColor} stopOpacity=".2" />
                  </linearGradient>
                </defs>
                {/* Vessel body — rounded tank */}
                <path d="M12 15 Q12 8 20 5 L40 5 Q48 8 48 15 L48 75 Q48 90 30 92 Q12 90 12 75 Z"
                  fill={`url(#brew-vessel-m${i})`} stroke={X.border} strokeWidth=".8" />
                {/* Fill level */}
                <clipPath id={`brew-vc${i}`}>
                  <path d="M13 16 Q13 9 20 6 L40 6 Q47 9 47 16 L47 74 Q47 89 30 91 Q13 89 13 74 Z" />
                </clipPath>
                <rect x="13" y={6 + (85 - (fillPct / 100) * 85)} width="34"
                  height={(fillPct / 100) * 85} fill={`url(#brew-vessel-f${i})`}
                  clipPath={`url(#brew-vc${i})`}
                  style={{ transition: `y 800ms ${ease.o}, height 800ms ${ease.o}` }} />
                {/* Cap / top valve */}
                <rect x="24" y="1" width="12" height="5" rx="2" fill={X.surface} stroke={X.border} strokeWidth=".5" />
                {/* Pressure gauge small */}
                <circle cx="48" cy="30" r="5" fill={X.surface} stroke={X.border} strokeWidth=".5" />
                <circle cx="48" cy="30" r="2" fill={vesselColor} opacity=".6" />
              </svg>
              <div style={{ textAlign: 'center' }}>
                <Dot c={vesselColor} s={5} pulse={statuses[i].label === 'Optimal'} />
                <M style={{ fontSize: 8, color: X.textMut, display: 'block', marginTop: 2 }}>V{i + 1}</M>
              </div>
            </div>
          );
        })}
      </div>

      {/* Readings table */}
      <div style={{
        padding: '8px 10px', borderRadius: 6,
        background: n.metal, boxShadow: n.concave,
      }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <Lbl style={{ flex: 1 }}>Vessel</Lbl>
          <Lbl style={{ flex: 1, textAlign: 'right' }}>Temp</Lbl>
          <Lbl style={{ flex: 1, textAlign: 'right' }}>PSI</Lbl>
          <Lbl style={{ flex: 1, textAlign: 'right' }}>Fill</Lbl>
        </div>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} style={{
            display: 'flex', gap: 6, padding: '3px 0',
            borderTop: i > 0 ? `1px solid ${X.borderLight}` : 'none',
          }}>
            <M style={{ flex: 1, fontSize: 9, fontWeight: 600, color: X.text }}>V{i + 1}</M>
            <M style={{ flex: 1, fontSize: 9, fontWeight: 700, color: statuses[i].color, textAlign: 'right' }}>
              {temps[i].toFixed(1)}°C
            </M>
            <M style={{ flex: 1, fontSize: 9, fontWeight: 700, color: X.textSec, textAlign: 'right' }}>
              {pressures[i].toFixed(1)}
            </M>
            <M style={{ flex: 1, fontSize: 9, fontWeight: 700, color: fills[i] > 85 ? X.amber : X.textSec, textAlign: 'right' }}>
              {Math.round(fills[i])}%
            </M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Brew Temp Curve ──────────────────────────────────────────────────
export function BrewTempCurve({ title = 'Temp Curve', targetTemp = 20 }: { title?: string; targetTemp?: number } = {}) {
  const X = getX();
  const n = neo();
  const currentTemp = targetTemp;
  const animTemp = useAnim(currentTemp, 1000);
  const tick = useTick(2000);

  // Build a rolling history of 12 data points
  const [history, setHistory] = useState<number[]>(() =>
    Array.from({ length: 12 }, (_, i) => targetTemp + (Math.random() - 0.5) * 4)
  );
  useState(() => {
    // This runs once to seed; subsequent updates via tick effect below
  });

  // Shift history on each tick
  const lastTick = useState({ v: tick })[0];
  if (lastTick.v !== tick) {
    lastTick.v = tick;
    history.shift();
    history.push(currentTemp);
  }

  const minT = Math.min(...history, targetTemp - 4);
  const maxT = Math.max(...history, targetTemp + 4);
  const range = maxT - minT || 1;

  // Build SVG polyline points
  const points = history.map((t, i) => {
    const px = 8 + (i / 11) * 184;
    const py = 8 + ((maxT - t) / range) * 64;
    return `${px},${py}`;
  }).join(' ');

  const diffFromTarget = currentTemp - targetTemp;
  const tempColor = Math.abs(diffFromTarget) > 3 ? X.red : Math.abs(diffFromTarget) > 1.5 ? X.amber : X.teal;

  // Needle position for current temp
  const needleX = 8 + 184;
  const needleY = 8 + ((maxT - animTemp) / range) * 64;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={tempColor}>{Math.abs(diffFromTarget) < 1 ? 'On Target' : diffFromTarget > 0 ? 'Above' : 'Below'}</Badge>
      </div>

      {/* Neumorphic chart well */}
      <div style={{
        padding: 10, borderRadius: 8,
        background: X.bgAlt, boxShadow: n.concave,
        marginBottom: 12, position: 'relative',
      }}>
        <svg viewBox="0 0 200 80" style={{ width: '100%', height: 120, display: 'block' }}>
          <defs>
            <linearGradient id="brew-tcg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={tempColor} stopOpacity=".25" />
              <stop offset="100%" stopColor={tempColor} stopOpacity=".02" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
            <line key={i} x1="8" y1={8 + p * 64} x2="192" y2={8 + p * 64}
              stroke={X.borderLight} strokeWidth=".3" strokeDasharray="2,2" />
          ))}

          {/* Target temp line */}
          <line x1="8" y1={8 + ((maxT - targetTemp) / range) * 64}
            x2="192" y2={8 + ((maxT - targetTemp) / range) * 64}
            stroke={X.amber} strokeWidth=".6" strokeDasharray="4,3" opacity=".7" />
          <text x="194" y={8 + ((maxT - targetTemp) / range) * 64 + 2}
            fontSize="4" fill={X.amber} fontFamily="monospace">{targetTemp}°</text>

          {/* Area fill below curve */}
          <polygon points={`8,${8 + 64} ${points} 192,${8 + 64}`}
            fill="url(#brew-tcg)" />

          {/* Curve line */}
          <polyline points={points} fill="none" stroke={tempColor} strokeWidth="1.2"
            strokeLinejoin="round" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 2px ${tempColor}40)` }} />

          {/* Data point dots */}
          {history.map((t, i) => {
            const px = 8 + (i / 11) * 184;
            const py = 8 + ((maxT - t) / range) * 64;
            return <circle key={i} cx={px} cy={py} r={i === 11 ? 2.5 : 1}
              fill={i === 11 ? tempColor : tempColor + '60'}
              style={i === 11 ? { filter: `drop-shadow(0 0 3px ${tempColor}60)` } : undefined} />;
          })}

          {/* Needle pointer triangle on the right edge */}
          <polygon
            points={`196,${needleY} 192,${needleY - 3} 192,${needleY + 3}`}
            fill={X.red}
            style={{ transition: `all 800ms ${ease.o}` }}
          />

          {/* Y-axis labels */}
          <text x="4" y="12" fontSize="4" fill={X.textMut} fontFamily="monospace" textAnchor="end">{maxT.toFixed(0)}°</text>
          <text x="4" y="74" fontSize="4" fill={X.textMut} fontFamily="monospace" textAnchor="end">{minT.toFixed(0)}°</text>
        </svg>
      </div>

      {/* Current reading */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{
          flex: 1, padding: '8px 10px', borderRadius: 6,
          background: n.metal, boxShadow: n.raised, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 3 }}>Current</Lbl>
          <M style={{ fontSize: 22, fontWeight: 800, color: tempColor, display: 'block' }}>
            {currentTemp.toFixed(1)}°C
          </M>
        </div>
        <div style={{
          flex: 1, padding: '8px 10px', borderRadius: 6,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 3 }}>Target</Lbl>
          <M style={{ fontSize: 22, fontWeight: 800, color: X.textSec, display: 'block' }}>
            {targetTemp.toFixed(1)}°C
          </M>
        </div>
        <div style={{
          flex: 1, padding: '8px 10px', borderRadius: 6,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 3 }}>Delta</Lbl>
          <M style={{ fontSize: 22, fontWeight: 800, color: tempColor, display: 'block' }}>
            {diffFromTarget > 0 ? '+' : ''}{diffFromTarget.toFixed(1)}°
          </M>
        </div>
      </div>
    </Card>
  );
}

// ── Carbonation Level ────────────────────────────────────────────────
export function CarbonationLevel({ title = 'CO\u2082 Level', co2Unit = 'psi', pressure, volumes, temp }: { title?: string; co2Unit?: string; pressure: number; volumes: number; temp: number }) {
  const X = getX();
  const n = neo();

  const maxPressure = 30;
  const normalizedP = Math.min(1, Math.max(0, pressure / maxPressure));
  // Needle angle: -135 to +135 (270 deg sweep)
  const needleAngle = useAnim(-135 + normalizedP * 270, 900);

  const pColor = pressure > 25 ? X.red : pressure > 18 ? X.amber : X.teal;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={pColor}>{pressure > 25 ? 'High' : pressure > 18 ? 'Elevated' : 'Normal'}</Badge>
      </div>

      {/* Circular pressure gauge with metallic bezel */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <div style={{
          width: 170, height: 170, borderRadius: '50%',
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <svg viewBox="0 0 100 100" style={{ width: 150, height: 150, display: 'block' }}>
            <defs>
              <linearGradient id="brew-gauge-face" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={X.surface} />
                <stop offset="100%" stopColor={X.bgAlt} />
              </linearGradient>
              <radialGradient id="brew-rg" cx="50%" cy="40%" r="50%">
                <stop offset="0%" stopColor={X.surface} />
                <stop offset="100%" stopColor={X.bgAlt} />
              </radialGradient>
            </defs>
            {/* Gauge face */}
            <circle cx="50" cy="50" r="46" fill="url(#brew-rg)" stroke={X.border} strokeWidth=".5" />

            {/* Scale arc background */}
            <path
              d={`M ${50 + 38 * Math.cos((-135 * Math.PI) / 180)} ${50 + 38 * Math.sin((-135 * Math.PI) / 180)} A 38 38 0 1 1 ${50 + 38 * Math.cos(((-135 + 270) * Math.PI) / 180)} ${50 + 38 * Math.sin(((-135 + 270) * Math.PI) / 180)}`}
              fill="none" stroke={X.borderLight} strokeWidth="3" strokeLinecap="round"
            />

            {/* Colored arc */}
            {normalizedP > 0.01 && <path
              d={`M ${50 + 38 * Math.cos((-135 * Math.PI) / 180)} ${50 + 38 * Math.sin((-135 * Math.PI) / 180)} A 38 38 0 ${needleAngle > 0 ? 1 : 0} 1 ${50 + 38 * Math.cos(((needleAngle - 90) * Math.PI) / 180)} ${50 + 38 * Math.sin(((needleAngle - 90) * Math.PI) / 180)}`}
              fill="none" stroke={pColor} strokeWidth="3" strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 3px ${pColor}40)` }}
            />}

            {/* Zone coloring — green/amber/red zones */}
            {([
              { start: 0, end: 18 / 30, color: X.teal },
              { start: 18 / 30, end: 25 / 30, color: X.amber },
              { start: 25 / 30, end: 1, color: X.red },
            ]).map((zone, zi) => {
              const a1 = (-135 + zone.start * 270 - 90) * (Math.PI / 180);
              const a2 = (-135 + zone.end * 270 - 90) * (Math.PI / 180);
              return (
                <path key={zi}
                  d={`M ${50 + 42 * Math.cos(a1)} ${50 + 42 * Math.sin(a1)} A 42 42 0 0 1 ${50 + 42 * Math.cos(a2)} ${50 + 42 * Math.sin(a2)}`}
                  fill="none" stroke={zone.color} strokeWidth="1.5" opacity=".25" strokeLinecap="round"
                />
              );
            })}

            {/* Scale markings */}
            {[0, 5, 10, 15, 20, 25, 30].map((val, i) => {
              const pct = val / maxPressure;
              const angle = (-135 + pct * 270 - 90) * (Math.PI / 180);
              const inner = 32, outer = 36, textR = 27;
              return (
                <g key={i}>
                  <line
                    x1={50 + inner * Math.cos(angle)} y1={50 + inner * Math.sin(angle)}
                    x2={50 + outer * Math.cos(angle)} y2={50 + outer * Math.sin(angle)}
                    stroke={X.textMut} strokeWidth=".6"
                  />
                  <text
                    x={50 + textR * Math.cos(angle)} y={50 + textR * Math.sin(angle) + 1.5}
                    textAnchor="middle" fontFamily="monospace" fontSize="4.5" fill={X.textMut}
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
              stroke={X.red} strokeWidth="1" strokeLinecap="round"
              style={{ transition: `x2 900ms ${ease.o}, y2 900ms ${ease.o}`, filter: `drop-shadow(0 0 2px ${X.red}40)` }}
            />
            {/* Counterweight */}
            <line
              x1="50" y1="50"
              x2={50 - 8 * Math.cos(((needleAngle - 90) * Math.PI) / 180)}
              y2={50 - 8 * Math.sin(((needleAngle - 90) * Math.PI) / 180)}
              stroke={X.red} strokeWidth="1.8" strokeLinecap="round"
              style={{ transition: `x2 900ms ${ease.o}, y2 900ms ${ease.o}` }}
            />
            {/* Center cap */}
            <circle cx="50" cy="50" r="4" fill={X.surface} stroke={X.border} strokeWidth=".8" />
            <circle cx="50" cy="50" r="2" fill={X.textMut} />

            {/* Readout */}
            <text x="50" y="70" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill={pColor}>
              {pressure.toFixed(1)}
            </text>
            <text x="50" y="76" textAnchor="middle" fontFamily="monospace" fontSize="4.5" fill={X.textMut}>
              {co2Unit}
            </text>
          </svg>
        </div>
      </div>

      {/* Bottom metrics */}
      <div style={{ display: 'flex', gap: 6 }}>
        {([
          ['Volumes', `${volumes.toFixed(1)} vol`, X.indigo],
          ['Pressure', `${pressure.toFixed(1)} ${co2Unit}`, pColor],
          ['Carb Temp', `${temp.toFixed(1)}°C`, temp > 6 ? X.amber : X.teal],
        ] as [string, string, string][]).map(([label, val, c], i) => (
          <div key={i} style={{
            flex: 1, padding: '6px 8px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
            animation: `fu 150ms ${ease.o} ${i * 30}ms both`,
          }}>
            <Lbl style={{ marginBottom: 3 }}>{label}</Lbl>
            <M style={{ fontSize: 12, fontWeight: 700, color: c, display: 'block' }}>{val}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Mash Tun Control ─────────────────────────────────────────────────
export function MashTunControl({ title = 'Mash Tun', recipeSteps = 4, temp }: { title?: string; recipeSteps?: number; temp: number }) {
  const X = getX();
  const n = neo();
  const steps = Math.min(Math.max(recipeSteps, 2), 6);
  const [currentStep, setCurrentStep] = useState(0);
  const [running, setRunning] = useState(false);
  const elapsed = useTick(1000);

  const stepNames = ['Mash In', 'Protein Rest', 'Sacch Rest', 'Mash Out', 'Sparge', 'Vorlauf'].slice(0, steps);
  const stepTemps = [52, 55, 67, 72, 76, 68].slice(0, steps);

  // Rotary knob angle: distribute steps evenly across 270 degrees
  const stepAngle = (currentStep / (steps - 1)) * 270 - 135;
  const animAngle = useAnim(stepAngle, 600);

  const isComplete = currentStep >= steps - 1;
  const stepColor = isComplete ? X.teal : running ? X.amber : X.textMut;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={stepColor}>{running ? stepNames[currentStep] : isComplete ? 'Complete' : 'Idle'}</Badge>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        {/* Rotary knob */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 110, height: 110, borderRadius: '50%',
            background: n.metal, boxShadow: n.bezel,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', flexShrink: 0,
          }}>
            <svg viewBox="0 0 100 100" style={{ width: 96, height: 96, display: 'block' }}>
              <defs>
                <radialGradient id="brew-knob-g" cx="40%" cy="35%" r="55%">
                  <stop offset="0%" stopColor={X.surface} />
                  <stop offset="70%" stopColor={X.bgAlt} />
                  <stop offset="100%" stopColor={X.surface} />
                </radialGradient>
              </defs>
              {/* Knob body */}
              <circle cx="50" cy="50" r="34" fill="url(#brew-knob-g)" stroke={X.border} strokeWidth=".6" />
              {/* Grip notches */}
              {Array.from({ length: 12 }).map((_, i) => {
                const a = (i * 30 * Math.PI) / 180;
                return (
                  <line key={i}
                    x1={50 + 30 * Math.cos(a)} y1={50 + 30 * Math.sin(a)}
                    x2={50 + 33 * Math.cos(a)} y2={50 + 33 * Math.sin(a)}
                    stroke={X.textMut} strokeWidth=".5" opacity=".4"
                  />
                );
              })}
              {/* Step tick marks around the knob */}
              {stepNames.map((_, i) => {
                const pct = i / (steps - 1);
                const angle = (-135 + pct * 270 - 90) * (Math.PI / 180);
                const isActive = i <= currentStep;
                return (
                  <g key={i}>
                    <circle
                      cx={50 + 42 * Math.cos(angle)} cy={50 + 42 * Math.sin(angle)}
                      r={2} fill={isActive ? X.amber : X.border}
                      style={{ filter: isActive ? `drop-shadow(0 0 3px ${X.amber}50)` : 'none' }}
                    />
                    <text
                      x={50 + 46 * Math.cos(angle)} y={50 + 46 * Math.sin(angle) + 1}
                      textAnchor="middle" fontSize="3.5" fontFamily="monospace"
                      fill={isActive ? X.amber : X.textMut}
                    >
                      {i + 1}
                    </text>
                  </g>
                );
              })}
              {/* Indicator line on the knob */}
              <line
                x1="50" y1="50"
                x2={50 + 24 * Math.cos(((animAngle - 90) * Math.PI) / 180)}
                y2={50 + 24 * Math.sin(((animAngle - 90) * Math.PI) / 180)}
                stroke={X.amber} strokeWidth="2" strokeLinecap="round"
                style={{
                  transition: `x2 600ms ${ease.sp}, y2 600ms ${ease.sp}`,
                  filter: `drop-shadow(0 0 3px ${X.amber}50)`,
                }}
              />
              {/* Center */}
              <circle cx="50" cy="50" r="6" fill={X.surface} stroke={X.border} strokeWidth=".6" />
              <circle cx="50" cy="50" r="2.5" fill={X.textMut} />
            </svg>
          </div>

          {/* Current temp display */}
          <div style={{
            padding: '4px 10px', borderRadius: 6,
            background: n.metal, boxShadow: n.concave, textAlign: 'center',
          }}>
            <M style={{ fontSize: 16, fontWeight: 800, color: temp > 70 ? X.red : X.amber }}>{temp.toFixed(1)}°C</M>
          </div>
        </div>

        {/* Step list + buttons */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Step list */}
          <div style={{
            flex: 1, padding: '6px 8px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          }}>
            {stepNames.map((name, i) => {
              const isCurrent = i === currentStep;
              const isDone = i < currentStep;
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0',
                  opacity: isDone ? 0.5 : 1,
                }}>
                  <Dot c={isDone ? X.teal : isCurrent ? X.amber : X.border} s={5}
                    pulse={isCurrent && running} />
                  <M style={{
                    fontSize: 9, fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent ? X.text : X.textMut, flex: 1,
                  }}>
                    {name}
                  </M>
                  <M style={{ fontSize: 8, color: X.textMut, fontFamily: 'monospace' }}>
                    {stepTemps[i]}°C
                  </M>
                </div>
              );
            })}
          </div>

          {/* Physical action buttons */}
          <div style={{ display: 'flex', gap: 6 }}>
            <Btn small color={running ? X.red : X.teal} onClick={() => setRunning(!running)}
              style={{ flex: 1, justifyContent: 'center' }}>
              {running ? 'Pause' : 'Start'}
            </Btn>
            <Btn small ghost color={X.amber}
              disabled={!running || isComplete}
              onClick={() => { if (currentStep < steps - 1) setCurrentStep(currentStep + 1); }}
              style={{ flex: 1, justifyContent: 'center' }}>
              Next Step
            </Btn>
          </div>
          <Btn small ghost color={X.textMut}
            onClick={() => { setCurrentStep(0); setRunning(false); }}
            style={{ justifyContent: 'center' }}>
            Reset
          </Btn>
        </div>
      </div>

      {/* Elapsed time footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', padding: '5px 8px',
        borderRadius: 6, background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        <M style={{ fontSize: 8, color: X.textMut }}>
          Step {currentStep + 1}/{steps}
        </M>
        <M style={{ fontSize: 8, fontFamily: 'monospace', color: running ? X.amber : X.textMut }}>
          {running ? `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}` : '--:--'}
        </M>
      </div>
    </Card>
  );
}

// ── Gravity Reading ──────────────────────────────────────────────────
export function GravityReading({ title = 'Gravity', ogTarget = 1.055, sg }: { title?: string; ogTarget?: number; sg: number }) {
  const X = getX();
  const n = neo();
  const fgTarget = 1.012;
  const animSg = useAnim(sg, 1000);

  // Map SG to vertical position in tube (1.000 = bottom, 1.080 = top)
  const sgMin = 1.000;
  const sgMax = 1.080;
  const sgPct = Math.min(100, Math.max(0, ((sg - sgMin) / (sgMax - sgMin)) * 100));
  const ogPct = ((ogTarget - sgMin) / (sgMax - sgMin)) * 100;
  const fgPct = ((fgTarget - sgMin) / (sgMax - sgMin)) * 100;

  const attenuation = ogTarget > fgTarget ? ((ogTarget - sg) / (ogTarget - fgTarget)) * 100 : 0;
  const attColor = attenuation > 100 ? X.purple : attenuation > 75 ? X.teal : attenuation > 40 ? X.amber : X.red;
  const sgColor = sg > ogTarget ? X.red : sg < fgTarget ? X.purple : X.teal;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={sgColor}>
          {sg > ogTarget ? 'Pre-Pitch' : sg > fgTarget + 0.005 ? 'Fermenting' : 'Terminal'}
        </Badge>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        {/* Hydrometer tube */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <svg viewBox="0 0 50 140" style={{ width: 60, height: 160, display: 'block' }}>
            <defs>
              <linearGradient id="brew-tube-bg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={X.border} stopOpacity=".2" />
                <stop offset="30%" stopColor={X.bgAlt} stopOpacity=".1" />
                <stop offset="70%" stopColor={X.bgAlt} stopOpacity=".1" />
                <stop offset="100%" stopColor={X.border} stopOpacity=".2" />
              </linearGradient>
              <linearGradient id="brew-liquid" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={X.amber} stopOpacity=".4" />
                <stop offset="100%" stopColor={X.amber} stopOpacity=".15" />
              </linearGradient>
            </defs>

            {/* Glass tube */}
            <rect x="14" y="5" width="22" height="125" rx="8" fill="url(#brew-tube-bg)"
              stroke={X.border} strokeWidth=".6" opacity=".8" />

            {/* Liquid fill */}
            <clipPath id="brew-tube-clip">
              <rect x="15" y="6" width="20" height="123" rx="7" />
            </clipPath>
            <rect x="15" y={6 + 123 * 0.15} width="20" height={123 * 0.85}
              fill="url(#brew-liquid)" clipPath="url(#brew-tube-clip)" />

            {/* Scale markings */}
            {[1.000, 1.010, 1.020, 1.030, 1.040, 1.050, 1.060, 1.070, 1.080].map((val, i) => {
              const pct = (val - sgMin) / (sgMax - sgMin);
              const y = 128 - pct * 118;
              return (
                <g key={i}>
                  <line x1="36" y1={y} x2="39" y2={y} stroke={X.textMut} strokeWidth=".4" />
                  <text x="41" y={y + 1.5} fontSize="3.5" fill={X.textMut} fontFamily="monospace">
                    {val.toFixed(3)}
                  </text>
                </g>
              );
            })}

            {/* OG target marker */}
            <line x1="12" y1={128 - ogPct / 100 * 118} x2="38" y2={128 - ogPct / 100 * 118}
              stroke={X.amber} strokeWidth=".6" strokeDasharray="2,1" />
            <text x="10" y={128 - ogPct / 100 * 118 - 2} fontSize="3.5" fill={X.amber}
              fontFamily="monospace" textAnchor="end">OG</text>

            {/* FG target marker */}
            <line x1="12" y1={128 - fgPct / 100 * 118} x2="38" y2={128 - fgPct / 100 * 118}
              stroke={X.teal} strokeWidth=".6" strokeDasharray="2,1" />
            <text x="10" y={128 - fgPct / 100 * 118 - 2} fontSize="3.5" fill={X.teal}
              fontFamily="monospace" textAnchor="end">FG</text>

            {/* Floating hydrometer bulb */}
            <g style={{ transition: `transform 800ms ${ease.o}` }}
              transform={`translate(0, ${128 - (sgPct / 100) * 118 - 20})`}>
              {/* Stem */}
              <rect x="23" y="2" width="4" height="18" rx="1.5"
                fill={X.surface} stroke={X.border} strokeWidth=".4" />
              {/* Bulb */}
              <ellipse cx="25" cy="22" rx="6" ry="8"
                fill={X.surface} stroke={sgColor} strokeWidth=".6"
                style={{ filter: `drop-shadow(0 1px 2px ${sgColor}30)` }} />
              {/* Reading line on stem */}
              <line x1="23" y1="10" x2="27" y2="10" stroke={X.red} strokeWidth=".6" />
            </g>
          </svg>
          <Lbl>Hydrometer</Lbl>
        </div>

        {/* Gravity data */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* SG display */}
          <div style={{
            padding: '10px 12px', borderRadius: 8,
            background: n.metal, boxShadow: n.concave, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 4 }}>Specific Gravity</Lbl>
            <M style={{ fontSize: 30, fontWeight: 800, color: sgColor, display: 'block', letterSpacing: '-.01em' }}>
              {sg.toFixed(3)}
            </M>
            <M style={{ fontSize: 9, color: X.textMut }}>SG</M>
          </div>

          {/* OG / FG comparison */}
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{
              flex: 1, padding: '6px 8px', borderRadius: 6,
              background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
            }}>
              <Lbl style={{ marginBottom: 2 }}>OG Target</Lbl>
              <M style={{ fontSize: 13, fontWeight: 700, color: X.amber, display: 'block' }}>
                {ogTarget.toFixed(3)}
              </M>
            </div>
            <div style={{
              flex: 1, padding: '6px 8px', borderRadius: 6,
              background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
            }}>
              <Lbl style={{ marginBottom: 2 }}>FG Target</Lbl>
              <M style={{ fontSize: 13, fontWeight: 700, color: X.teal, display: 'block' }}>
                {fgTarget.toFixed(3)}
              </M>
            </div>
          </div>

          {/* Attenuation */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Lbl>Attenuation</Lbl>
              <M style={{ fontSize: 10, fontWeight: 700, color: attColor }}>
                {Math.max(0, attenuation).toFixed(0)}%
              </M>
            </div>
            <Prog value={Math.min(100, Math.max(0, attenuation))} color={attColor} h={5} />
          </div>

          {/* Estimated ABV */}
          <div style={{
            padding: '5px 8px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <Lbl style={{ marginBottom: 0 }}>Est. ABV</Lbl>
            <M style={{ fontSize: 12, fontWeight: 800, color: X.purple }}>
              {((ogTarget - sg) * 131.25).toFixed(1)}%
            </M>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Batch Tracker ────────────────────────────────────────────────────
export function BatchTracker({ title = 'Batch Tracker', maxBatches = 6 }: { title?: string; maxBatches?: number } = {}) {
  const X = getX();
  const n = neo();
  const batchCount = Math.min(Math.max(maxBatches, 2), 8);

  const batchDefs = [
    { name: 'IPA #47', style: 'American IPA', status: 'Fermenting' as const },
    { name: 'Stout #12', style: 'Oatmeal Stout', status: 'Conditioning' as const },
    { name: 'Pilsner #8', style: 'Czech Pilsner', status: 'Packaging' as const },
    { name: 'Wheat #21', style: 'Hefeweizen', status: 'Mashing' as const },
    { name: 'Sour #5', style: 'Berliner Weisse', status: 'Aging' as const },
    { name: 'Porter #33', style: 'Robust Porter', status: 'Complete' as const },
    { name: 'Lager #19', style: 'Vienna Lager', status: 'Fermenting' as const },
    { name: 'Pale #41', style: 'English Bitter', status: 'Conditioning' as const },
  ].slice(0, batchCount);

  const statusColors: Record<string, string> = {
    Mashing: X.amber,
    Fermenting: X.teal,
    Conditioning: X.indigo,
    Packaging: X.purple,
    Aging: X.pink,
    Complete: X.textMut,
  };

  const progValues = [
    45,
    72,
    88,
    18,
    35,
    100,
    55,
    68,
  ];

  const days = [7, 14, 21, 2, 30, 28, 10, 16];
  const activeBatches = batchDefs.filter(b => b.status !== 'Complete').length;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{activeBatches} Active</Badge>
      </div>

      {/* Batch grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 8, marginBottom: 12,
      }}>
        {batchDefs.map((batch, i) => {
          const color = statusColors[batch.status] || X.textMut;
          const prog = Math.min(100, Math.max(0, progValues[i]));
          const isComplete = batch.status === 'Complete';

          return (
            <div key={i} style={{
              padding: '10px 10px 8px', borderRadius: 8,
              background: n.metal, boxShadow: n.raised,
              opacity: isComplete ? 0.6 : 1,
              animation: `fu 150ms ${ease.o} ${i * 40}ms both`,
              position: 'relative', overflow: 'hidden',
            }}>
              {/* Beveled top edge highlight */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                background: `linear-gradient(90deg, transparent, #ffffff10, transparent)`,
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div>
                  <M style={{ fontSize: 10, fontWeight: 700, color: X.text, display: 'block' }}>{batch.name}</M>
                  <M style={{ fontSize: 8, color: X.textMut }}>{batch.style}</M>
                </div>
                <Dot c={color} s={6} pulse={!isComplete} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Badge color={color} style={{ fontSize: 7, padding: '1px 5px' }}>{batch.status}</Badge>
                <M style={{ fontSize: 8, color: X.textMut }}>Day {days[i]}</M>
              </div>

              <Prog value={prog} color={color} h={3} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
                <M style={{ fontSize: 7, color: X.textMut }}>Progress</M>
                <M style={{ fontSize: 7, fontWeight: 700, color: color }}>{Math.round(prog)}%</M>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary footer */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', padding: '6px 8px',
        borderRadius: 6, background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        <M style={{ fontSize: 8, color: X.textMut }}>{batchCount} total batches</M>
        <div style={{ display: 'flex', gap: 8 }}>
          {Object.entries(statusColors).map(([status, color]) => {
            const count = batchDefs.filter(b => b.status === status).length;
            if (count === 0) return null;
            return (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Dot c={color} s={4} />
                <M style={{ fontSize: 7, color: X.textMut }}>{count}</M>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
