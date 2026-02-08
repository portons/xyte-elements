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

// ── Mine Shaft Depth ─────────────────────────────────────────────────
export function MineShaftDepth({ title = 'Mine Shaft', maxDepth = 800, currentDepth, temperature, humidity }: { title?: string; maxDepth?: number; currentDepth: number; temperature: number; humidity: number }) {
  const X = getX();
  const n = neo();
  const depthPct = Math.min(100, Math.max(0, (currentDepth / maxDepth) * 100));
  const animDepth = useAnim(depthPct, 1400);
  const depthColor = depthPct > 85 ? X.red : depthPct > 60 ? X.amber : X.teal;
  const status = depthPct > 85 ? 'Critical' : depthPct > 60 ? 'Deep' : 'Normal';

  return (
    <Card style={{ width: 350 }} glow={depthColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={depthColor}>{status}</Badge>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        {/* Vertical shaft well */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <svg viewBox="0 0 100 100" style={{ width: 56, height: 140, display: 'block' }}>
            <defs>
              <linearGradient id="mine-shaft-bg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={X.border} stopOpacity=".3" />
                <stop offset="50%" stopColor={X.bgAlt} stopOpacity=".6" />
                <stop offset="100%" stopColor={X.border} stopOpacity=".3" />
              </linearGradient>
              <linearGradient id="mine-shaft-fill" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={depthColor} stopOpacity=".8" />
                <stop offset="100%" stopColor={depthColor} stopOpacity=".2" />
              </linearGradient>
            </defs>
            {/* Shaft outline with concave effect */}
            <rect x="20" y="2" width="60" height="96" rx="4" fill="url(#mine-shaft-bg)"
              stroke={X.border} strokeWidth="1" />
            {/* Depth fill from bottom */}
            <rect x="22" y={4 + (92 - (animDepth / 100) * 92)} width="56"
              height={(animDepth / 100) * 92} rx="3" fill="url(#mine-shaft-fill)"
              style={{ transition: `y 800ms ${ease.o}, height 800ms ${ease.o}` }} />
            {/* Depth markers */}
            {[0, 25, 50, 75, 100].map((pct, i) => (
              <g key={i}>
                <line x1="18" y1={4 + (92 * (1 - pct / 100))} x2="22" y2={4 + (92 * (1 - pct / 100))}
                  stroke={X.textMut} strokeWidth=".5" />
                <text x="14" y={7 + (92 * (1 - pct / 100))} textAnchor="end"
                  fontFamily="monospace" fontSize="5" fill={X.textMut}>
                  {Math.round(maxDepth * (pct / 100))}
                </text>
              </g>
            ))}
            {/* Cage indicator */}
            <rect x="30" y={4 + (92 - (animDepth / 100) * 92) - 4} width="40" height="6"
              rx="1" fill={X.surface} stroke={depthColor} strokeWidth=".8"
              style={{ transition: `y 800ms ${ease.o}`, filter: `drop-shadow(0 1px 2px ${depthColor}40)` }} />
          </svg>
          <Lbl>Depth (m)</Lbl>
        </div>

        {/* Depth info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            padding: '10px 12px', borderRadius: 8, background: n.metal,
            boxShadow: n.concave, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 4 }}>Current Depth</Lbl>
            <M style={{ fontSize: 32, fontWeight: 800, color: depthColor, display: 'block', letterSpacing: '-.02em' }}>
              {Math.round(currentDepth)}
            </M>
            <M style={{ fontSize: 10, color: X.textMut }}>meters</M>
          </div>
          <div style={{
            padding: '8px 10px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Lbl style={{ marginBottom: 2 }}>Max Depth</Lbl>
              <M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{maxDepth}m</M>
            </div>
            <Prog value={animDepth} color={depthColor} h={4} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Lbl style={{ marginBottom: 2 }}>Temp</Lbl>
              <M style={{ fontSize: 11, fontWeight: 700, color: temperature > 38 ? X.red : X.textSec }}>
                {temperature.toFixed(1)}°C
              </M>
            </div>
            <div style={{ flex: 1 }}>
              <Lbl style={{ marginBottom: 2 }}>Humidity</Lbl>
              <M style={{ fontSize: 11, fontWeight: 700, color: humidity > 85 ? X.amber : X.textSec }}>
                {humidity.toFixed(0)}%
              </M>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Ore Grade Analyzer ───────────────────────────────────────────────
export function OreGradeAnalyzer({ title = 'Ore Grade', gradeThreshold = 65, goldGrade, copperGrade, ironGrade, lithiumGrade }: { title?: string; gradeThreshold?: number; goldGrade: number; copperGrade: number; ironGrade: number; lithiumGrade: number }) {
  const X = getX();
  const n = neo();

  const ores = [
    { name: 'Gold', grade: goldGrade, color: X.amber, unit: 'g/t' },
    { name: 'Copper', grade: copperGrade, color: X.teal, unit: '%' },
    { name: 'Iron', grade: ironGrade, color: X.red, unit: '%' },
    { name: 'Lithium', grade: lithiumGrade, color: X.purple, unit: 'ppm' },
  ];

  const animGrades = [
    useAnim(ores[0].grade, 1200),
    useAnim(ores[1].grade, 1300),
    useAnim(ores[2].grade, 1100),
    useAnim(ores[3].grade, 1400),
  ];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>Analysis</Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ores.map((ore, i) => {
          const aboveThreshold = ore.grade >= gradeThreshold;
          return (
            <div key={i} style={{ animation: `fu 150ms ${ease.o} ${i * 30}ms both` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Dot c={ore.color} s={6} />
                  <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{ore.name}</M>
                </div>
                <M style={{ fontSize: 10, fontWeight: 700, color: aboveThreshold ? ore.color : X.textMut }}>
                  {ore.grade.toFixed(1)} {ore.unit}
                </M>
              </div>
              {/* Metallic bar container */}
              <div style={{
                height: 10, borderRadius: 5, background: n.metal,
                boxShadow: n.concave, position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', top: 1, bottom: 1, left: 1,
                  width: `${Math.min(100, Math.max(0, animGrades[i]))}%`,
                  borderRadius: 4,
                  background: `linear-gradient(90deg, ${ore.color}60, ${ore.color})`,
                  transition: `width 600ms ${ease.sp}`,
                  boxShadow: `0 0 6px ${ore.color}30`,
                }} />
                {/* Threshold line */}
                <div style={{
                  position: 'absolute', top: 0, bottom: 0,
                  left: `${gradeThreshold}%`, width: 2,
                  background: X.text, opacity: 0.4,
                  borderRadius: 1,
                }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 10, padding: '6px 8px', borderRadius: 6,
        background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Threshold: {gradeThreshold}%</M>
        <M style={{ fontSize: 8, color: X.teal, fontWeight: 600 }}>
          {ores.filter(o => o.grade >= gradeThreshold).length}/{ores.length} above target
        </M>
      </div>
    </Card>
  );
}

// ── Ventilation Fan ──────────────────────────────────────────────────
export function VentilationFan({ title = 'Ventilation', rpmTarget = 1200, rpm, airflow, power }: { title?: string; rpmTarget?: number; rpm: number; airflow: number; power: number }) {
  const X = getX();
  const n = neo();
  const tick = useTick(50);
  const [running, setRunning] = useState(true);

  const rotation = running ? tick * 12 : 0;
  const rpmPct = Math.min(100, (rpm / (rpmTarget * 1.2)) * 100);
  const statusColor = !running ? X.textMut : rpmPct > 90 ? X.red : rpmPct > 70 ? X.amber : X.teal;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Dot c={running ? X.teal : X.textMut} pulse={running} s={7} />
          <Badge color={running ? X.teal : X.textMut}>{running ? 'Running' : 'Stopped'}</Badge>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        {/* Fan SVG with metallic bezel */}
        <div style={{
          width: 100, height: 100, borderRadius: '50%',
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg viewBox="0 0 100 100" style={{ width: 80, height: 80, display: 'block' }}>
            <defs>
              <linearGradient id="mine-fan-blade" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={X.teal} stopOpacity=".8" />
                <stop offset="100%" stopColor={X.teal} stopOpacity=".3" />
              </linearGradient>
            </defs>
            {/* Hub background */}
            <circle cx="50" cy="50" r="44" fill={X.bgAlt} stroke={X.border} strokeWidth="1" />
            {/* Rotating blades */}
            <g style={{
              transformOrigin: '50px 50px',
              transform: `rotate(${rotation}deg)`,
              transition: running ? 'none' : `transform 800ms ${ease.o}`,
            }}>
              {[0, 72, 144, 216, 288].map((angle, i) => (
                <path key={i}
                  d={`M50,50 C${50 + 8},${50 - 6} ${50 + 20},${50 - 30} ${50 + 5},${50 - 40} C${50 - 2},${50 - 32} ${50 - 4},${50 - 10} 50,50`}
                  fill="url(#mine-fan-blade)" stroke={X.teal} strokeWidth=".5"
                  style={{ transformOrigin: '50px 50px', transform: `rotate(${angle}deg)` }}
                />
              ))}
              {/* Center hub */}
              <circle cx="50" cy="50" r="8" fill={X.surface} stroke={X.border} strokeWidth="1" />
              <circle cx="50" cy="50" r="3" fill={X.textMut} />
            </g>
          </svg>
        </div>

        {/* Readouts */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{
            padding: '8px 10px', borderRadius: 6,
            background: n.metal, boxShadow: n.concave,
          }}>
            <Lbl style={{ marginBottom: 3 }}>RPM</Lbl>
            <M style={{ fontSize: 24, fontWeight: 800, color: running ? statusColor : X.textMut, display: 'block' }}>
              {running ? Math.round(rpm) : 0}
            </M>
            <M style={{ fontSize: 8, color: X.textMut }}>Target: {rpmTarget}</M>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Lbl style={{ marginBottom: 2 }}>Airflow</Lbl>
              <M style={{ fontSize: 11, fontWeight: 700, color: X.textSec }}>
                {running ? airflow.toFixed(1) : '0.0'} m³/s
              </M>
            </div>
            <div style={{ flex: 1 }}>
              <Lbl style={{ marginBottom: 2 }}>Power</Lbl>
              <M style={{ fontSize: 11, fontWeight: 700, color: X.amber }}>
                {running ? power.toFixed(1) : '0.0'} kW
              </M>
            </div>
          </div>
        </div>
      </div>

      <Btn small ghost={!running} color={running ? X.red : X.teal} onClick={() => setRunning(!running)}>
        {running ? 'Stop Fan' : 'Start Fan'}
      </Btn>
    </Card>
  );
}

// ── Conveyor Load ────────────────────────────────────────────────────
export function ConveyorLoad({ title = 'Conveyor Load', capacityWarning = 80, loadPct, speed, throughput, motorTemp }: { title?: string; capacityWarning?: number; loadPct: number; speed: number; throughput: number; motorTemp: number }) {
  const X = getX();
  const n = neo();
  const animLoad = useAnim(loadPct, 1200);

  const loadColor = loadPct >= 90 ? X.red : loadPct >= capacityWarning ? X.amber : X.teal;
  const material = loadPct > 70 ? 'Ore (Dense)' : loadPct > 40 ? 'Mixed Ore' : 'Tailings';
  const status = loadPct >= 90 ? 'Overload' : loadPct >= capacityWarning ? 'Warning' : 'Normal';

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={loadColor}>{status}</Badge>
      </div>

      {/* Load display with raised neumorphic bar */}
      <div style={{
        padding: '12px 14px', borderRadius: 8,
        background: n.metal, boxShadow: n.raised,
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <M style={{ fontSize: 28, fontWeight: 800, color: loadColor }}>{Math.round(loadPct)}</M>
            <M style={{ fontSize: 11, color: X.textMut }}>%</M>
          </div>
          <Badge color={X.indigo} style={{ fontSize: 8 }}>{material}</Badge>
        </div>

        {/* Progress bar with neo raised shadow */}
        <div style={{
          height: 12, borderRadius: 6,
          boxShadow: n.concave,
          background: X.bgAlt,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 1, bottom: 1, left: 1,
            width: `${Math.min(100, Math.max(0, animLoad))}%`,
            borderRadius: 5,
            background: `linear-gradient(90deg, ${loadColor}80, ${loadColor})`,
            boxShadow: `0 0 8px ${loadColor}30, inset 0 1px 0 #ffffff15`,
            transition: `width 500ms ${ease.sp}`,
          }} />
          {/* Warning threshold marker */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${capacityWarning}%`, width: 1.5,
            background: X.amber, opacity: 0.6,
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <M style={{ fontSize: 7, color: X.textMut }}>0%</M>
          <M style={{ fontSize: 7, color: X.amber }}>Warning: {capacityWarning}%</M>
          <M style={{ fontSize: 7, color: X.textMut }}>100%</M>
        </div>
      </div>

      {/* Metrics row */}
      <div style={{ display: 'flex', gap: 6 }}>
        {([
          ['Speed', `${speed.toFixed(1)} m/s`, X.indigo],
          ['Throughput', `${Math.round(throughput)} t/h`, X.purple],
          ['Motor Temp', `${motorTemp.toFixed(0)}°C`, motorTemp > 75 ? X.red : X.textSec],
        ] as [string, string, string][]).map(([label, val, c], i) => (
          <div key={i} style={{
            flex: 1, padding: '6px 8px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
            animation: `fu 150ms ${ease.o} ${i * 30}ms both`,
          }}>
            <Lbl style={{ marginBottom: 3 }}>{label}</Lbl>
            <M style={{ fontSize: 11, fontWeight: 700, color: c, display: 'block' }}>{val}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Blast Sequencer ──────────────────────────────────────────────────
export function BlastSequencer({ title = 'Blast Sequence', countdown = 30 }: { title?: string; countdown?: number } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(1000);
  const [armed, setArmed] = useState(false);
  const [sequence, setSequence] = useState([false, false, false, false]);
  const [firing, setFiring] = useState(false);
  const [timer, setTimer] = useState(countdown);

  const buttons = [
    { label: 'ARM', color: X.amber, idx: 0 },
    { label: 'ZONE A', color: X.teal, idx: 1 },
    { label: 'ZONE B', color: X.indigo, idx: 2 },
    { label: 'FIRE', color: X.red, idx: 3 },
  ];

  const allPressed = sequence.every(Boolean);
  const canFire = armed && allPressed && !firing;

  const handlePress = (idx: number) => {
    if (firing) return;
    if (idx === 0) {
      setArmed(!armed);
      if (armed) {
        setSequence([false, false, false, false]);
        setTimer(countdown);
      }
      return;
    }
    if (!armed) return;
    if (idx === 3) {
      if (canFire) {
        setFiring(true);
        setTimeout(() => {
          setFiring(false);
          setArmed(false);
          setSequence([false, false, false, false]);
          setTimer(countdown);
        }, 3000);
      }
      return;
    }
    const next = [...sequence];
    next[idx] = !next[idx];
    setSequence(next);
  };

  const displayTimer = firing ? Math.max(0, countdown - (tick % (countdown + 1))) : timer;

  return (
    <Card style={{ width: 350 }} glow={firing ? X.red : undefined}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={firing ? X.red : armed ? X.amber : X.textMut} solid={firing}>
          {firing ? 'FIRING' : armed ? 'ARMED' : 'SAFE'}
        </Badge>
      </div>

      {/* Countdown timer */}
      <div style={{
        textAlign: 'center', padding: '8px 0 10px', marginBottom: 12,
        borderRadius: 8, background: n.metal, boxShadow: n.concave,
      }}>
        <Lbl style={{ marginBottom: 4 }}>Countdown</Lbl>
        <M style={{
          fontSize: 36, fontWeight: 800, fontFamily: 'monospace',
          color: firing ? X.red : armed ? X.amber : X.textMut,
          display: 'block', letterSpacing: '.05em',
        }}>
          {String(Math.floor(displayTimer / 60)).padStart(2, '0')}:
          {String(displayTimer % 60).padStart(2, '0')}
        </M>
      </div>

      {/* Physical push buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 12 }}>
        {buttons.map((btn, i) => {
          const isPressed = i === 0 ? armed : i === 3 ? firing : sequence[i];
          const isDisabled = i !== 0 && !armed;
          const btnColor = isDisabled ? X.textMut : btn.color;

          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              {/* LED indicator */}
              <Dot c={isPressed ? btnColor : X.border} pulse={isPressed && (i === 3 ? firing : true)} s={6} />

              {/* Physical button */}
              <button
                onClick={() => handlePress(btn.idx)}
                style={{
                  width: 52, height: 38, borderRadius: 6, border: 'none',
                  background: isPressed
                    ? `linear-gradient(180deg, ${btnColor}cc, ${btnColor})`
                    : `linear-gradient(180deg, ${X.surface}, ${X.bgAlt})`,
                  boxShadow: isPressed
                    ? `inset 0 2px 4px rgba(0,0,0,0.3)`
                    : `0 3px 0 ${btnColor}88, 0 4px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)`,
                  transform: isPressed ? 'translateY(2px)' : 'translateY(0)',
                  transition: `transform 80ms ${ease.mv}, box-shadow 80ms ${ease.mv}, background 80ms ${ease.mv}`,
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.4 : 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <M style={{
                  fontSize: 8, fontWeight: 800, letterSpacing: '.05em',
                  color: isPressed ? '#fff' : btnColor,
                }}>{btn.label}</M>
              </button>
            </div>
          );
        })}
      </div>

      {/* Sequence status */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', padding: '6px 8px',
        borderRadius: 6, background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Sequence: {sequence.filter(Boolean).length}/4 steps</M>
        <M style={{ fontSize: 8, color: canFire ? X.teal : X.textMut, fontWeight: 600 }}>
          {canFire ? 'Ready to Fire' : firing ? 'Blast in progress...' : 'Complete sequence'}
        </M>
      </div>
    </Card>
  );
}

// ── Cage Winder ──────────────────────────────────────────────────────
export function CageWinder({ title = 'Cage Winder', speedUnit = 'm/s', speed, depth, loadWeight, ropeStress }: { title?: string; speedUnit?: string; speed: number; depth: number; loadWeight: number; ropeStress: number }) {
  const X = getX();
  const n = neo();

  const maxSpeed = 14;
  const normalizedSpeed = Math.min(1, Math.max(0, speed / maxSpeed));
  // Needle angle: -135 deg (left) to +135 deg (right), 270 deg sweep
  const needleAngle = useAnim(-135 + normalizedSpeed * 270, 800);

  const speedColor = speed > 12 ? X.red : speed > 9 ? X.amber : X.teal;
  const direction = speed > 0 ? 'Ascending' : 'Descending';

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={speedColor}>{direction}</Badge>
      </div>

      {/* Gauge with metallic bezel */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <div style={{
          width: 160, height: 160, borderRadius: '50%',
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <svg viewBox="0 0 100 100" style={{ width: 140, height: 140, display: 'block' }}>
            <defs>
              <linearGradient id="mine-gauge-face" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={X.surface} />
                <stop offset="100%" stopColor={X.bgAlt} />
              </linearGradient>
            </defs>
            {/* Gauge face */}
            <circle cx="50" cy="50" r="46" fill="url(#mine-gauge-face)" stroke={X.border} strokeWidth=".5" />

            {/* Scale arc background */}
            <path
              d={`M ${50 + 38 * Math.cos((-135 * Math.PI) / 180)} ${50 + 38 * Math.sin((-135 * Math.PI) / 180)} A 38 38 0 1 1 ${50 + 38 * Math.cos(((-135 + 270) * Math.PI) / 180)} ${50 + 38 * Math.sin(((-135 + 270) * Math.PI) / 180)}`}
              fill="none" stroke={X.borderLight} strokeWidth="3" strokeLinecap="round"
            />

            {/* Colored arc for current value */}
            <path
              d={`M ${50 + 38 * Math.cos((-135 * Math.PI) / 180)} ${50 + 38 * Math.sin((-135 * Math.PI) / 180)} A 38 38 0 ${needleAngle > 0 ? 1 : 0} 1 ${50 + 38 * Math.cos(((needleAngle - 90) * Math.PI) / 180)} ${50 + 38 * Math.sin(((needleAngle - 90) * Math.PI) / 180)}`}
              fill="none" stroke={speedColor} strokeWidth="3" strokeLinecap="round"
              style={{ transition: `d 800ms ${ease.o}`, filter: `drop-shadow(0 0 3px ${speedColor}40)` }}
            />

            {/* Scale markings */}
            {[0, 2, 4, 6, 8, 10, 12, 14].map((val, i) => {
              const pct = val / maxSpeed;
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
            {/* Needle counterweight */}
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

            {/* Speed readout */}
            <text x="50" y="70" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill={speedColor}>
              {speed.toFixed(1)}
            </text>
            <text x="50" y="76" textAnchor="middle" fontFamily="monospace" fontSize="4.5" fill={X.textMut}>
              {speedUnit}
            </text>
          </svg>
        </div>
      </div>

      {/* Bottom metrics */}
      <div style={{ display: 'flex', gap: 6 }}>
        {([
          ['Depth', `${Math.round(depth)}m`, X.indigo],
          ['Load', `${loadWeight.toFixed(1)}t`, X.amber],
          ['Rope Stress', `${ropeStress.toFixed(0)}%`, ropeStress > 80 ? X.red : X.teal],
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
