import { useState } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot, Prog, Btn } from '../primitives';
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

// ── Wellhead Pressure ────────────────────────────────────────────────
export function WellheadPressure({ title = 'Wellhead Pressure', maxPSI = 5000, psi, temp, flowRate }: { title?: string; maxPSI?: number; psi: number; temp: number; flowRate: number }) {
  const X = getX();
  const n = neo();
  const psiPct = Math.min(100, Math.max(0, (psi / maxPSI) * 100));
  const animPct = useAnim(psiPct, 1400);

  const psiColor = psiPct > 85 ? X.red : psiPct > 65 ? X.amber : X.teal;
  const status = psiPct > 85 ? 'Critical' : psiPct > 65 ? 'High' : 'Normal';

  // 270-degree sweep: starts at 135deg, sweeps 270deg
  const sweepStart = 135;
  const sweepTotal = 270;
  const needleAngle = sweepStart + (animPct / 100) * sweepTotal;
  const warningAngle = sweepStart + 0.65 * sweepTotal;

  const toRad = (d: number) => (d * Math.PI) / 180;
  const cx = 60, cy = 60, r = 44;

  // Arc path helper
  const arc = (startDeg: number, endDeg: number, radius: number) => {
    const s = toRad(startDeg);
    const e = toRad(endDeg);
    const x1 = cx + radius * Math.cos(s);
    const y1 = cy + radius * Math.sin(s);
    const x2 = cx + radius * Math.cos(e);
    const y2 = cy + radius * Math.sin(e);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M${x1},${y1} A${radius},${radius} 0 ${large} 1 ${x2},${y2}`;
  };

  return (
    <Card style={{ width: 350 }} glow={psiColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={psiColor}>{status}</Badge>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
        {/* Gauge bezel */}
        <div style={{
          width: 140, height: 140, borderRadius: '50%',
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg viewBox="0 0 120 120" style={{ width: 120, height: 120, display: 'block' }}>
            <defs>
              <radialGradient id="oil-rg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={X.surface} />
                <stop offset="100%" stopColor={X.bgAlt} />
              </radialGradient>
              <linearGradient id="oil-needle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={psiColor} />
                <stop offset="100%" stopColor={psiColor} stopOpacity=".4" />
              </linearGradient>
            </defs>
            {/* Gauge face */}
            <circle cx={cx} cy={cy} r="50" fill="url(#oil-rg)" />
            <circle cx={cx} cy={cy} r="50" fill="none" stroke={X.border} strokeWidth="1.5" />

            {/* Scale track (normal zone) */}
            <path d={arc(sweepStart, warningAngle, r)} fill="none"
              stroke={X.teal + '30'} strokeWidth="5" strokeLinecap="round" />
            {/* Warning zone arc */}
            <path d={arc(warningAngle, sweepStart + sweepTotal, r)} fill="none"
              stroke={X.red + '40'} strokeWidth="5" strokeLinecap="round" />

            {/* Scale markings */}
            {Array.from({ length: 11 }, (_, i) => {
              const angle = toRad(sweepStart + (i / 10) * sweepTotal);
              const inner = r - 6;
              const outer = r + 1;
              const x1 = cx + inner * Math.cos(angle);
              const y1 = cy + inner * Math.sin(angle);
              const x2 = cx + outer * Math.cos(angle);
              const y2 = cy + outer * Math.sin(angle);
              const tx = cx + (r - 14) * Math.cos(angle);
              const ty = cy + (r - 14) * Math.sin(angle);
              return (
                <g key={i}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke={X.textMut} strokeWidth={i % 5 === 0 ? '1.5' : '.6'} />
                  {i % 5 === 0 && (
                    <text x={tx} y={ty} textAnchor="middle" dominantBaseline="central"
                      fontFamily="monospace" fontSize="6" fill={X.textMut}>
                      {Math.round((i / 10) * maxPSI)}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Minor ticks */}
            {Array.from({ length: 51 }, (_, i) => {
              if (i % 5 === 0) return null;
              const angle = toRad(sweepStart + (i / 50) * sweepTotal);
              const inner = r - 2;
              const outer = r + 1;
              return (
                <line key={i}
                  x1={cx + inner * Math.cos(angle)} y1={cy + inner * Math.sin(angle)}
                  x2={cx + outer * Math.cos(angle)} y2={cy + outer * Math.sin(angle)}
                  stroke={X.textMut} strokeWidth=".3" />
              );
            })}

            {/* Needle */}
            <g style={{
              transformOrigin: `${cx}px ${cy}px`,
              transform: `rotate(${needleAngle}deg)`,
              transition: `transform 800ms ${ease.o}`,
            }}>
              <polygon
                points={`${cx},${cy - 2} ${cx + r - 8},${cy} ${cx},${cy + 2}`}
                fill="url(#oil-needle)"
              />
              <line x1={cx} y1={cy} x2={cx - 8} y2={cy}
                stroke={psiColor} strokeWidth="2" strokeLinecap="round" opacity=".4" />
            </g>

            {/* Center cap */}
            <circle cx={cx} cy={cy} r="5" fill={X.surface} stroke={X.border} strokeWidth="1" />
            <circle cx={cx} cy={cy} r="2.5" fill={psiColor} />

            {/* PSI readout */}
            <text x={cx} y={cy + 22} textAnchor="middle" fontFamily="monospace"
              fontSize="12" fontWeight="800" fill={psiColor}>
              {Math.round(psi)}
            </text>
            <text x={cx} y={cy + 30} textAnchor="middle" fontFamily="monospace"
              fontSize="5" fill={X.textMut}>PSI</text>
          </svg>
        </div>

        {/* Side readouts */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            padding: '10px 12px', borderRadius: 8, background: n.metal,
            boxShadow: n.concave, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 4 }}>Pressure</Lbl>
            <M style={{ fontSize: 28, fontWeight: 800, color: psiColor, display: 'block', letterSpacing: '-.02em' }}>
              {Math.round(psi)}
            </M>
            <M style={{ fontSize: 10, color: X.textMut }}>/ {maxPSI} PSI</M>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Lbl style={{ marginBottom: 2 }}>Temp</Lbl>
              <M style={{ fontSize: 11, fontWeight: 700, color: temp > 200 ? X.red : X.textSec }}>
                {temp.toFixed(0)}°F
              </M>
            </div>
            <div style={{ flex: 1 }}>
              <Lbl style={{ marginBottom: 2 }}>Flow</Lbl>
              <M style={{ fontSize: 11, fontWeight: 700, color: X.indigo }}>
                {Math.round(flowRate)} bbl/d
              </M>
            </div>
          </div>
          <Prog value={animPct} color={psiColor} h={4} />
        </div>
      </div>
    </Card>
  );
}

// ── BOP Status ───────────────────────────────────────────────────────
export function BOPStatus({ title = 'BOP Status', ramCount = 4, testPressure, annularPressure }: { title?: string; ramCount?: number; testPressure: number; annularPressure: number }) {
  const X = getX();
  const n = neo();
  const tick = useTick(3000);

  const ramLabels = ['Blind Ram', 'Pipe Ram', 'Shear Ram', 'Annular'].slice(0, ramCount);
  const [ramStates, setRamStates] = useState<boolean[]>(() => ramLabels.map((_, i) => i < 2));
  const allClosed = ramStates.every(Boolean);
  const anyOpen = ramStates.some(s => !s);
  const statusColor = allClosed ? X.teal : anyOpen ? X.amber : X.red;
  const status = allClosed ? 'Sealed' : 'Partial';

  const toggleRam = (idx: number) => {
    setRamStates(prev => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  return (
    <Card style={{ width: 350 }} glow={statusColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Dot c={statusColor} pulse={!allClosed} s={7} />
          <Badge color={statusColor}>{status}</Badge>
        </div>
      </div>

      {/* Toggle panel */}
      <div style={{
        padding: '10px 12px', borderRadius: 8,
        background: n.metal, boxShadow: n.raised,
        marginBottom: 10,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ramLabels.map((label, i) => {
            const closed = ramStates[i];
            const ledColor = closed ? X.teal : X.red;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '6px 10px', borderRadius: 6,
                background: X.bgAlt, border: `1px solid ${X.borderLight}`,
                animation: `fu 150ms ${ease.o} ${i * 40}ms both`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* LED cluster */}
                  <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: ledColor,
                      boxShadow: `0 0 6px ${ledColor}60, inset 0 1px 0 #ffffff30`,
                    }} />
                    <div style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: closed ? X.teal + '40' : X.textMut + '30',
                    }} />
                  </div>
                  <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{label}</M>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <M style={{ fontSize: 9, fontWeight: 700, color: closed ? X.teal : X.red }}>
                    {closed ? 'CLOSED' : 'OPEN'}
                  </M>
                  {/* Toggle switch */}
                  <div
                    onClick={() => toggleRam(i)}
                    style={{
                      width: 32, height: 16, borderRadius: 8,
                      background: closed ? X.teal + '30' : X.bgAlt,
                      border: `1px solid ${closed ? X.teal + '60' : X.border}`,
                      position: 'relative', cursor: 'pointer',
                      transition: `background 200ms ${ease.mv}, border-color 200ms ${ease.mv}`,
                      boxShadow: n.concave,
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: 2, left: closed ? 16 : 2,
                      width: 10, height: 10, borderRadius: '50%',
                      background: closed ? X.teal : X.textMut,
                      boxShadow: `0 1px 3px ${X.bg}60`,
                      transition: `left 200ms ${ease.sp}, background 200ms ${ease.mv}`,
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pressure readouts */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{
          flex: 1, padding: '6px 8px', borderRadius: 6,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 3 }}>Test Pressure</Lbl>
          <M style={{ fontSize: 12, fontWeight: 700, color: X.indigo, display: 'block' }}>
            {Math.round(testPressure)} PSI
          </M>
        </div>
        <div style={{
          flex: 1, padding: '6px 8px', borderRadius: 6,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 3 }}>Annular</Lbl>
          <M style={{ fontSize: 12, fontWeight: 700, color: X.purple, display: 'block' }}>
            {Math.round(annularPressure)} PSI
          </M>
        </div>
      </div>
    </Card>
  );
}

// ── Mud Weight ───────────────────────────────────────────────────────
export function MudWeight({ title = 'Mud Weight', weightUnit = 'ppg', weight, viscosity, pH, chlorides }: { title?: string; weightUnit?: string; weight: number; viscosity: number; pH: number; chlorides: number }) {
  const X = getX();
  const n = neo();

  const minW = 8, maxW = 18;
  const weightPct = Math.min(100, Math.max(0, ((weight - minW) / (maxW - minW)) * 100));
  const animPct = useAnim(weightPct, 1200);

  const weightColor = weight > 16 ? X.red : weight > 14 ? X.amber : X.teal;

  // Rotary dial: 300-degree sweep
  const dialSweep = 300;
  const dialStart = 120;
  const indicatorAngle = dialStart + (animPct / 100) * dialSweep;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const cx = 55, cy = 55, dr = 40;

  const arcPath = (sDeg: number, eDeg: number, radius: number) => {
    const s = toRad(sDeg);
    const e = toRad(eDeg);
    const x1 = cx + radius * Math.cos(s);
    const y1 = cy + radius * Math.sin(s);
    const x2 = cx + radius * Math.cos(e);
    const y2 = cy + radius * Math.sin(e);
    const large = eDeg - sDeg > 180 ? 1 : 0;
    return `M${x1},${y1} A${radius},${radius} 0 ${large} 1 ${x2},${y2}`;
  };

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={weightColor}>{weight > 16 ? 'Heavy' : weight > 14 ? 'Dense' : 'Normal'}</Badge>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
        {/* Neumorphic circular dial */}
        <div style={{
          width: 130, height: 130, borderRadius: '50%',
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg viewBox="0 0 110 110" style={{ width: 110, height: 110, display: 'block' }}>
            <defs>
              <linearGradient id="oil-mud-track" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={X.teal} stopOpacity=".2" />
                <stop offset="50%" stopColor={X.amber} stopOpacity=".2" />
                <stop offset="100%" stopColor={X.red} stopOpacity=".3" />
              </linearGradient>
            </defs>
            {/* Inner concave face */}
            <circle cx={cx} cy={cy} r="46" fill={X.bgAlt} stroke={X.border} strokeWidth="1" />

            {/* Track arc */}
            <path d={arcPath(dialStart, dialStart + dialSweep, dr)} fill="none"
              stroke={X.border} strokeWidth="6" strokeLinecap="round" />
            {/* Value arc fill */}
            <path d={arcPath(dialStart, indicatorAngle, dr)} fill="none"
              stroke={weightColor} strokeWidth="6" strokeLinecap="round"
              style={{ transition: `stroke-dashoffset 800ms ${ease.o}` }} />

            {/* Scale labels */}
            {[0, 25, 50, 75, 100].map((pct, i) => {
              const angle = toRad(dialStart + (pct / 100) * dialSweep);
              const tx = cx + (dr + 10) * Math.cos(angle);
              const ty = cy + (dr + 10) * Math.sin(angle);
              const val = minW + (pct / 100) * (maxW - minW);
              return (
                <text key={i} x={tx} y={ty} textAnchor="middle" dominantBaseline="central"
                  fontFamily="monospace" fontSize="5" fill={X.textMut}>
                  {val.toFixed(0)}
                </text>
              );
            })}

            {/* Tick marks */}
            {Array.from({ length: 21 }, (_, i) => {
              const angle = toRad(dialStart + (i / 20) * dialSweep);
              const inner = dr - 3;
              const outer = dr + (i % 5 === 0 ? 3 : 1);
              return (
                <line key={i}
                  x1={cx + inner * Math.cos(angle)} y1={cy + inner * Math.sin(angle)}
                  x2={cx + outer * Math.cos(angle)} y2={cy + outer * Math.sin(angle)}
                  stroke={X.textMut} strokeWidth={i % 5 === 0 ? '1' : '.4'} />
              );
            })}

            {/* Rotary indicator dot */}
            <circle
              cx={cx + dr * Math.cos(toRad(indicatorAngle))}
              cy={cy + dr * Math.sin(toRad(indicatorAngle))}
              r="4" fill={weightColor}
              style={{
                filter: `drop-shadow(0 0 4px ${weightColor}80)`,
                transition: `cx 800ms ${ease.o}, cy 800ms ${ease.o}`,
              }}
            />

            {/* Center readout */}
            <text x={cx} y={cy - 3} textAnchor="middle" fontFamily="monospace"
              fontSize="14" fontWeight="800" fill={weightColor}>
              {weight.toFixed(1)}
            </text>
            <text x={cx} y={cy + 8} textAnchor="middle" fontFamily="monospace"
              fontSize="5" fill={X.textMut}>{weightUnit}</text>
          </svg>
        </div>

        {/* Density readouts */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            padding: '8px 10px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          }}>
            <Lbl style={{ marginBottom: 3 }}>Viscosity</Lbl>
            <M style={{ fontSize: 16, fontWeight: 700, color: X.indigo, display: 'block' }}>
              {viscosity.toFixed(0)}
            </M>
            <M style={{ fontSize: 8, color: X.textMut }}>sec/qt (Marsh)</M>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Lbl style={{ marginBottom: 2 }}>pH</Lbl>
              <M style={{ fontSize: 11, fontWeight: 700, color: pH > 11 ? X.red : X.purple }}>
                {pH.toFixed(1)}
              </M>
            </div>
            <div style={{ flex: 1 }}>
              <Lbl style={{ marginBottom: 2 }}>Cl-</Lbl>
              <M style={{ fontSize: 11, fontWeight: 700, color: X.textSec }}>
                {(chlorides / 1000).toFixed(1)}k
              </M>
            </div>
          </div>
          <div style={{
            padding: '4px 6px', borderRadius: 4,
            background: weightColor + '10', border: `1px solid ${weightColor}25`,
          }}>
            <M style={{ fontSize: 8, color: weightColor, fontWeight: 600 }}>
              Range: {minW}–{maxW} {weightUnit}
            </M>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Drill Depth ──────────────────────────────────────────────────────
export function DrillDepth({ title = 'Drill Depth', depthUnit = 'ft', currentDepth, rop, wob, torque }: { title?: string; depthUnit?: string; currentDepth: number; rop: number; wob: number; torque: number }) {
  const X = getX();
  const n = neo();
  const maxDepth = 15000;

  const depthPct = Math.min(100, Math.max(0, (currentDepth / maxDepth) * 100));
  const animDepth = useAnim(depthPct, 1400);
  const depthColor = depthPct > 80 ? X.red : depthPct > 55 ? X.amber : X.teal;
  const status = depthPct > 80 ? 'Deep' : depthPct > 55 ? 'Active' : 'Shallow';

  return (
    <Card style={{ width: 350 }} glow={depthColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={depthColor}>{status}</Badge>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
        {/* Vertical depth bar with metallic track */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: 48, height: 160, borderRadius: 6,
            background: n.metal, boxShadow: n.bezel,
            padding: 4, position: 'relative',
          }}>
            <svg viewBox="0 0 40 152" style={{ width: 40, height: 152, display: 'block' }}>
              <defs>
                <linearGradient id="oil-depth-bg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={X.border} stopOpacity=".4" />
                  <stop offset="50%" stopColor={X.bgAlt} stopOpacity=".7" />
                  <stop offset="100%" stopColor={X.border} stopOpacity=".4" />
                </linearGradient>
                <linearGradient id="oil-depth-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={depthColor} stopOpacity=".2" />
                  <stop offset="100%" stopColor={depthColor} stopOpacity=".9" />
                </linearGradient>
              </defs>
              {/* Track */}
              <rect x="6" y="2" width="28" height="148" rx="4" fill="url(#oil-depth-bg)"
                stroke={X.border} strokeWidth=".8" />
              {/* Depth fill from top */}
              <rect x="8" y="4" width="24"
                height={Math.max(0, (animDepth / 100) * 144)} rx="3" fill="url(#oil-depth-fill)"
                style={{ transition: `height 800ms ${ease.o}` }} />

              {/* Depth markers */}
              {[0, 25, 50, 75, 100].map((pct, i) => {
                const y = 4 + (pct / 100) * 144;
                return (
                  <g key={i}>
                    <line x1="4" y1={y} x2="8" y2={y} stroke={X.textMut} strokeWidth=".5" />
                    <text x="2" y={y + 1.5} textAnchor="end" fontFamily="monospace"
                      fontSize="4" fill={X.textMut}>
                      {Math.round((pct / 100) * maxDepth)}
                    </text>
                  </g>
                );
              })}

              {/* Drill bit indicator */}
              <rect x="10" y={Math.max(4, (animDepth / 100) * 144) - 2} width="20" height="5"
                rx="1.5" fill={X.surface} stroke={depthColor} strokeWidth=".8"
                style={{
                  transition: `y 800ms ${ease.o}`,
                  filter: `drop-shadow(0 1px 3px ${depthColor}50)`,
                }} />
              {/* Drill string line */}
              <line x1="20" y1="2" x2="20"
                y2={Math.max(4, (animDepth / 100) * 144) - 2}
                stroke={X.textMut} strokeWidth=".6" strokeDasharray="2,1"
                style={{ transition: `y2 800ms ${ease.o}` }} />
            </svg>
          </div>
          <Lbl>Depth ({depthUnit})</Lbl>
        </div>

        {/* Readouts panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            padding: '10px 12px', borderRadius: 8, background: n.metal,
            boxShadow: n.concave, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 4 }}>Current Depth</Lbl>
            <M style={{ fontSize: 28, fontWeight: 800, color: depthColor, display: 'block', letterSpacing: '-.02em' }}>
              {Math.round(currentDepth).toLocaleString()}
            </M>
            <M style={{ fontSize: 10, color: X.textMut }}>{depthUnit}</M>
          </div>

          <div style={{
            padding: '8px 10px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Lbl>Progress</Lbl>
              <M style={{ fontSize: 9, fontWeight: 700, color: X.textSec }}>{depthPct.toFixed(0)}%</M>
            </div>
            <Prog value={animDepth} color={depthColor} h={4} />
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {([
              ['ROP', `${rop.toFixed(0)} ft/h`, X.teal],
              ['WOB', `${wob.toFixed(0)} klb`, X.indigo],
              ['Torque', `${(torque / 1000).toFixed(1)}k`, X.purple],
            ] as [string, string, string][]).map(([label, val, c], i) => (
              <div key={i} style={{
                flex: 1, padding: '5px 6px', borderRadius: 6,
                background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
                animation: `fu 150ms ${ease.o} ${i * 30}ms both`,
              }}>
                <Lbl style={{ marginBottom: 2 }}>{label}</Lbl>
                <M style={{ fontSize: 10, fontWeight: 700, color: c, display: 'block' }}>{val}</M>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Gas Separator ────────────────────────────────────────────────────
export function GasSeparator({ title = 'Gas Separator', flowUnit = 'MCF/d', gasFlow, liquidFlow, pressure, efficiency }: { title?: string; flowUnit?: string; gasFlow: number; liquidFlow: number; pressure: number; efficiency: number }) {
  const X = getX();
  const n = neo();
  const tick = useTick(80);

  const effColor = efficiency > 92 ? X.teal : efficiency > 85 ? X.amber : X.red;
  const animEff = useAnim(efficiency, 1200);

  // Bubble positions for animation
  const bubbles = Array.from({ length: 6 }, (_, i) => ({
    x: 22 + (i % 3) * 16,
    y: 90 - ((tick * 2 + i * 18) % 60),
    r: 1.5 + (i % 3) * 0.6,
    o: 0.3 + (i % 3) * 0.15,
  }));

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={effColor}>{efficiency > 92 ? 'Optimal' : efficiency > 85 ? 'Moderate' : 'Low'}</Badge>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
        {/* Separator chamber SVG */}
        <div style={{
          width: 110, height: 150, borderRadius: 8,
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg viewBox="0 0 80 120" style={{ width: 80, height: 120, display: 'block' }}>
            <defs>
              <linearGradient id="oil-sep-chamber" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={X.border} stopOpacity=".5" />
                <stop offset="30%" stopColor={X.bgAlt} stopOpacity=".8" />
                <stop offset="70%" stopColor={X.bgAlt} stopOpacity=".8" />
                <stop offset="100%" stopColor={X.border} stopOpacity=".5" />
              </linearGradient>
              <linearGradient id="oil-sep-liquid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={X.indigo} stopOpacity=".3" />
                <stop offset="100%" stopColor={X.indigo} stopOpacity=".7" />
              </linearGradient>
              <linearGradient id="oil-sep-gas" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={X.amber} stopOpacity=".1" />
                <stop offset="100%" stopColor={X.amber} stopOpacity=".3" />
              </linearGradient>
            </defs>

            {/* Chamber body */}
            <rect x="15" y="10" width="50" height="95" rx="6" fill="url(#oil-sep-chamber)"
              stroke={X.border} strokeWidth="1.2" />

            {/* Liquid section (bottom) */}
            <rect x="17" y="60" width="46" height="43" rx="4" fill="url(#oil-sep-liquid)" />

            {/* Gas section (top) */}
            <rect x="17" y="12" width="46" height="48" rx="4" fill="url(#oil-sep-gas)" />

            {/* Separation line */}
            <line x1="17" y1="60" x2="63" y2="60" stroke={X.textMut} strokeWidth=".8"
              strokeDasharray="3,2" />

            {/* Rising bubbles */}
            {bubbles.map((b, i) => (
              <circle key={i} cx={b.x} cy={b.y} r={b.r}
                fill={X.amber} opacity={b.o} />
            ))}

            {/* Inlet arrow (left) */}
            <line x1="2" y1="50" x2="15" y2="50" stroke={X.teal} strokeWidth="1.5"
              markerEnd="none" />
            <polygon points="13,47 18,50 13,53" fill={X.teal} opacity=".8" />
            <text x="4" y="46" fontFamily="monospace" fontSize="4" fill={X.teal}>IN</text>

            {/* Gas outlet (top right) */}
            <line x1="63" y1="25" x2="76" y2="25" stroke={X.amber} strokeWidth="1.5" />
            <polygon points="74,22 78,25 74,28" fill={X.amber} opacity=".8" />
            <text x="65" y="20" fontFamily="monospace" fontSize="4" fill={X.amber}>GAS</text>

            {/* Liquid outlet (bottom right) */}
            <line x1="63" y1="85" x2="76" y2="85" stroke={X.indigo} strokeWidth="1.5" />
            <polygon points="74,82 78,85 74,88" fill={X.indigo} opacity=".8" />
            <text x="65" y="95" fontFamily="monospace" fontSize="4" fill={X.indigo}>LIQ</text>

            {/* Bevel highlights */}
            <rect x="15" y="10" width="50" height="95" rx="6" fill="none"
              stroke="#ffffff08" strokeWidth="1" />
          </svg>
        </div>

        {/* Readings */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            padding: '8px 10px', borderRadius: 6,
            background: n.metal, boxShadow: n.concave, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 3 }}>Efficiency</Lbl>
            <M style={{ fontSize: 24, fontWeight: 800, color: effColor, display: 'block' }}>
              {efficiency.toFixed(1)}%
            </M>
            <Prog value={animEff} color={effColor} h={3} style={{ marginTop: 6 }} />
          </div>

          <div style={{
            padding: '6px 8px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Dot c={X.amber} s={5} />
                <Lbl style={{ marginBottom: 0 }}>Gas Out</Lbl>
              </div>
              <M style={{ fontSize: 11, fontWeight: 700, color: X.amber }}>
                {Math.round(gasFlow)} {flowUnit}
              </M>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Dot c={X.indigo} s={5} />
                <Lbl style={{ marginBottom: 0 }}>Liquid Out</Lbl>
              </div>
              <M style={{ fontSize: 11, fontWeight: 700, color: X.indigo }}>
                {Math.round(liquidFlow)} bbl/d
              </M>
            </div>
          </div>

          <div style={{
            padding: '5px 8px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <Lbl style={{ marginBottom: 0 }}>Vessel PSI</Lbl>
            <M style={{ fontSize: 11, fontWeight: 700, color: pressure > 95 ? X.red : X.textSec }}>
              {pressure.toFixed(0)} psi
            </M>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Rig Tension ──────────────────────────────────────────────────────
export function RigTension({ title = 'Rig Tension', loadLimit = 500, hookLoad, torque, rpm, standpipe }: { title?: string; loadLimit?: number; hookLoad: number; torque: number; rpm: number; standpipe: number }) {
  const X = getX();
  const n = neo();

  const hookPct = Math.min(100, Math.max(0, (hookLoad / loadLimit) * 100));
  const torquePct = Math.min(100, Math.max(0, (torque / 30000) * 100));
  const rpmPct = Math.min(100, Math.max(0, (rpm / 200) * 100));

  const animHook = useAnim(hookPct, 1200);
  const animTorque = useAnim(torquePct, 1300);
  const animRpm = useAnim(rpmPct, 1100);

  const hookColor = hookPct > 85 ? X.red : hookPct > 65 ? X.amber : X.teal;

  const gauges = [
    { label: 'Hook Load', value: Math.round(hookLoad), unit: 'klb', pct: animHook, color: hookColor, max: loadLimit },
    { label: 'Torque', value: Math.round(torque), unit: 'ft-lb', pct: animTorque, color: X.indigo, max: 30000 },
    { label: 'RPM', value: Math.round(rpm), unit: 'rpm', pct: animRpm, color: X.purple, max: 200 },
  ];

  // Mini gauge component
  const miniGaugeSweep = 240;
  const miniGaugeStart = 150;
  const gcx = 35, gcy = 35, gr = 26;
  const toRad = (d: number) => (d * Math.PI) / 180;

  const miniArcPath = (sDeg: number, eDeg: number, radius: number) => {
    const s = toRad(sDeg);
    const e = toRad(eDeg);
    const x1 = gcx + radius * Math.cos(s);
    const y1 = gcy + radius * Math.sin(s);
    const x2 = gcx + radius * Math.cos(e);
    const y2 = gcy + radius * Math.sin(e);
    const large = eDeg - sDeg > 180 ? 1 : 0;
    return `M${x1},${y1} A${radius},${radius} 0 ${large} 1 ${x2},${y2}`;
  };

  return (
    <Card style={{ width: 350 }} glow={hookColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={hookColor}>{hookPct > 85 ? 'Overload' : hookPct > 65 ? 'Warning' : 'Normal'}</Badge>
      </div>

      {/* Metallic gauge panel */}
      <div style={{
        padding: '12px 8px', borderRadius: 10,
        background: n.metal, boxShadow: n.raised,
        marginBottom: 10,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {gauges.map((g, i) => {
            const needleAngle = miniGaugeStart + (g.pct / 100) * miniGaugeSweep;
            return (
              <div key={i} style={{ textAlign: 'center', animation: `fu 150ms ${ease.o} ${i * 50}ms both` }}>
                <div style={{
                  width: 80, height: 80, borderRadius: '50%',
                  background: X.bgAlt, boxShadow: n.concave,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 4px',
                }}>
                  <svg viewBox="0 0 70 70" style={{ width: 70, height: 70, display: 'block' }}>
                    {/* Track */}
                    <path d={miniArcPath(miniGaugeStart, miniGaugeStart + miniGaugeSweep, gr)}
                      fill="none" stroke={X.border} strokeWidth="3" strokeLinecap="round" />
                    {/* Value arc */}
                    <path d={miniArcPath(miniGaugeStart, needleAngle, gr)}
                      fill="none" stroke={g.color} strokeWidth="3" strokeLinecap="round"
                      style={{ transition: `d 800ms ${ease.o}` }} />

                    {/* Tick marks */}
                    {Array.from({ length: 9 }, (_, j) => {
                      const angle = toRad(miniGaugeStart + (j / 8) * miniGaugeSweep);
                      const inner = gr - 3;
                      const outer = gr + 1;
                      return (
                        <line key={j}
                          x1={gcx + inner * Math.cos(angle)} y1={gcy + inner * Math.sin(angle)}
                          x2={gcx + outer * Math.cos(angle)} y2={gcy + outer * Math.sin(angle)}
                          stroke={X.textMut} strokeWidth={j % 4 === 0 ? '.8' : '.3'} />
                      );
                    })}

                    {/* Needle */}
                    <g style={{
                      transformOrigin: `${gcx}px ${gcy}px`,
                      transform: `rotate(${needleAngle}deg)`,
                      transition: `transform 800ms ${ease.o}`,
                    }}>
                      <line x1={gcx - 4} y1={gcy} x2={gcx + gr - 6} y2={gcy}
                        stroke={g.color} strokeWidth="1.2" strokeLinecap="round" />
                    </g>

                    {/* Center */}
                    <circle cx={gcx} cy={gcy} r="3" fill={X.surface} stroke={X.border} strokeWidth=".6" />
                    <circle cx={gcx} cy={gcy} r="1.5" fill={g.color} />

                    {/* Value text */}
                    <text x={gcx} y={gcy + 14} textAnchor="middle" fontFamily="monospace"
                      fontSize="7" fontWeight="700" fill={g.color}>
                      {g.value > 999 ? (g.value / 1000).toFixed(1) + 'k' : g.value}
                    </text>
                  </svg>
                </div>
                <Lbl style={{ marginBottom: 1 }}>{g.label}</Lbl>
                <M style={{ fontSize: 8, color: X.textMut }}>{g.unit}</M>
              </div>
            );
          })}
        </div>
      </div>

      {/* Standpipe pressure bar */}
      <div style={{
        padding: '8px 10px', borderRadius: 6,
        background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <Lbl style={{ marginBottom: 0 }}>Standpipe Pressure</Lbl>
          <M style={{ fontSize: 10, fontWeight: 700, color: standpipe > 4000 ? X.red : X.textSec }}>
            {Math.round(standpipe)} PSI
          </M>
        </div>
        <Prog value={Math.min(100, (standpipe / 5000) * 100)} color={standpipe > 4000 ? X.red : X.teal} h={4} />
      </div>
    </Card>
  );
}
