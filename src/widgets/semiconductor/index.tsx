import { useState } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot, Prog } from '../primitives';
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

// ── Fab Clean Room ───────────────────────────────────────────────────
export function FabCleanRoom({ title = 'Clean Room', isoClass = 5, temp, humidity, pressure }: { title?: string; isoClass?: number; temp: number; humidity: number; pressure: number } = {} as any) {
  const X = getX();
  const n = neo();
  const particleCount = isoClass <= 3 ? 35 : isoClass <= 5 ? 3520 : 352000;
  const animParticle = useAnim(Math.min(100, (particleCount / (isoClass <= 3 ? 100 : isoClass <= 5 ? 10000 : 1000000)) * 100), 1200);

  const pColor = animParticle > 80 ? X.red : animParticle > 55 ? X.amber : X.teal;
  const status = animParticle > 80 ? 'Alert' : animParticle > 55 ? 'Marginal' : 'Nominal';

  return (
    <Card style={{ width: 350 }} glow={pColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={pColor}>{status}</Badge>
      </div>

      {/* Recessed clean room panel */}
      <div style={{
        padding: 14, borderRadius: 10, background: n.metal,
        boxShadow: n.concave, marginBottom: 12, position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle grid overlay for "clean room" feel */}
        <svg viewBox="0 0 200 80" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.06, pointerEvents: 'none' }}>
          {Array.from({ length: 21 }, (_, i) => (
            <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="80" stroke={X.text} strokeWidth="0.5" />
          ))}
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 10} x2="200" y2={i * 10} stroke={X.text} strokeWidth="0.5" />
          ))}
        </svg>

        <div style={{ display: 'flex', gap: 14, position: 'relative', zIndex: 1 }}>
          {/* Particle gauge */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <svg viewBox="0 0 80 80" style={{ width: 80, height: 80, display: 'block' }}>
              <defs>
                <linearGradient id="semi-cr-gauge" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor={pColor} stopOpacity=".9" />
                  <stop offset="100%" stopColor={pColor} stopOpacity=".2" />
                </linearGradient>
              </defs>
              {/* Gauge background ring */}
              <circle cx="40" cy="40" r="34" fill="none" stroke={X.borderLight} strokeWidth="6" />
              {/* Gauge fill ring */}
              <circle cx="40" cy="40" r="34" fill="none" stroke="url(#semi-cr-gauge)" strokeWidth="6"
                strokeDasharray={`${animParticle * 2.136} 213.6`}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '40px 40px', transition: `stroke-dasharray 800ms ${ease.o}` }} />
              {/* Center readout */}
              <text x="40" y="36" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="800" fill={pColor}>
                ISO
              </text>
              <text x="40" y="48" textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight="800" fill={X.text}>
                {isoClass}
              </text>
            </svg>
            <Lbl>Class Level</Lbl>
          </div>

          {/* Readings */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{
              padding: '8px 10px', borderRadius: 6,
              background: X.bgAlt, border: `1px solid ${X.borderLight}`,
            }}>
              <Lbl style={{ marginBottom: 3 }}>Particles / m³</Lbl>
              <M style={{ fontSize: 20, fontWeight: 800, color: pColor, display: 'block' }}>
                {Math.round(particleCount).toLocaleString()}
              </M>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <div style={{ flex: 1, padding: '5px 7px', borderRadius: 5, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
                <Lbl style={{ marginBottom: 2 }}>Temp</Lbl>
                <M style={{ fontSize: 11, fontWeight: 700, color: temp > 23 ? X.amber : X.textSec }}>{temp.toFixed(1)}°C</M>
              </div>
              <div style={{ flex: 1, padding: '5px 7px', borderRadius: 5, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
                <Lbl style={{ marginBottom: 2 }}>RH</Lbl>
                <M style={{ fontSize: 11, fontWeight: 700, color: humidity > 50 ? X.amber : X.textSec }}>{humidity.toFixed(0)}%</M>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Differential pressure bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '6px 10px', borderRadius: 6,
        background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Diff. Pressure</Lbl>
          <M style={{ fontSize: 11, fontWeight: 700, color: pressure > 1.5 ? X.amber : X.teal }}>{pressure.toFixed(2)} Pa</M>
        </div>
        <div style={{ width: 100 }}>
          <Prog value={Math.min(100, (pressure / 2) * 100)} color={pressure > 1.5 ? X.amber : X.teal} h={4} />
        </div>
      </div>
    </Card>
  );
}

// ── Wafer Yield ──────────────────────────────────────────────────────
export function WaferYield({ title = 'Wafer Yield', targetYield = 95, waferTemp }: { title?: string; targetYield?: number; waferTemp: number } = {} as any) {
  const X = getX();
  const n = neo();

  // Generate a static die map with pass/fail using seeded random
  const [dieMap] = useState<boolean[]>(() => {
    const dies: boolean[] = [];
    for (let i = 0; i < 120; i++) {
      dies.push(Math.random() > 0.08);
    }
    return dies;
  });

  const passCount = dieMap.filter(Boolean).length;
  const totalDies = dieMap.length;
  const yieldPct = (passCount / totalDies) * 100;
  const animYield = useAnim(yieldPct, 1400);
  const yieldColor = yieldPct >= targetYield ? X.teal : yieldPct >= targetYield - 5 ? X.amber : X.red;

  // Build die positions inside a circle
  const rows = 10;
  const cols = 12;
  const cx = 50, cy = 50, waferR = 42;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={yieldColor}>{yieldPct.toFixed(1)}% Yield</Badge>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        {/* Wafer with metallic frame */}
        <div style={{
          width: 140, height: 140, borderRadius: '50%',
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg viewBox="0 0 100 100" style={{ width: 126, height: 126, display: 'block' }}>
            <defs>
              <radialGradient id="semi-wf">
                <stop offset="0%" stopColor={X.surface} />
                <stop offset="85%" stopColor={X.bgAlt} />
                <stop offset="100%" stopColor={X.border} />
              </radialGradient>
              <clipPath id="semi-wclip">
                <circle cx={cx} cy={cy} r={waferR} />
              </clipPath>
            </defs>
            {/* Wafer background */}
            <circle cx={cx} cy={cy} r={waferR} fill="url(#semi-wf)" stroke={X.border} strokeWidth=".5" />
            {/* Notch */}
            <circle cx={cx} cy={cy + waferR - 1} r="2.5" fill={X.bgAlt} stroke={X.border} strokeWidth=".3" />
            {/* Die grid */}
            <g clipPath="url(#semi-wclip)">
              {dieMap.map((pass, i) => {
                const row = Math.floor(i / cols);
                const col = i % cols;
                const dx = (col - cols / 2 + 0.5) * (waferR * 2 / cols);
                const dy = (row - rows / 2 + 0.5) * (waferR * 2 / rows);
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > waferR - 3) return null;
                return (
                  <rect key={i}
                    x={cx + dx - 2.8} y={cy + dy - 3.2}
                    width="5.2" height="5.8" rx=".5"
                    fill={pass ? X.teal + '50' : X.red + '90'}
                    stroke={pass ? X.teal + '30' : X.red + '50'}
                    strokeWidth=".3"
                  />
                );
              })}
            </g>
          </svg>
        </div>

        {/* Yield info panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{
            padding: '10px 12px', borderRadius: 8,
            background: n.metal, boxShadow: n.concave, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 4 }}>Die Yield</Lbl>
            <M style={{ fontSize: 30, fontWeight: 800, color: yieldColor, display: 'block', letterSpacing: '-.02em' }}>
              {animYield.toFixed(1)}%
            </M>
            <M style={{ fontSize: 9, color: X.textMut }}>Target: {targetYield}%</M>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ flex: 1, padding: '5px 7px', borderRadius: 5, background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center' }}>
              <Lbl style={{ marginBottom: 2 }}>Pass</Lbl>
              <M style={{ fontSize: 12, fontWeight: 700, color: X.teal, display: 'block' }}>{passCount}</M>
            </div>
            <div style={{ flex: 1, padding: '5px 7px', borderRadius: 5, background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center' }}>
              <Lbl style={{ marginBottom: 2 }}>Fail</Lbl>
              <M style={{ fontSize: 12, fontWeight: 700, color: X.red, display: 'block' }}>{totalDies - passCount}</M>
            </div>
          </div>
          <div style={{ padding: '5px 7px', borderRadius: 5, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
            <Lbl style={{ marginBottom: 2 }}>Wafer Temp</Lbl>
            <M style={{ fontSize: 11, fontWeight: 700, color: X.textSec }}>{waferTemp.toFixed(1)}°C</M>
          </div>
        </div>
      </div>

      {/* Yield progress vs target */}
      <div style={{
        padding: '6px 10px', borderRadius: 6,
        background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <Lbl style={{ marginBottom: 0 }}>Yield vs Target</Lbl>
          <M style={{ fontSize: 8, color: yieldColor, fontWeight: 600 }}>
            {yieldPct >= targetYield ? 'On Target' : `${(targetYield - yieldPct).toFixed(1)}% below`}
          </M>
        </div>
        <Prog value={Math.min(100, animYield)} color={yieldColor} h={4} />
      </div>
    </Card>
  );
}

// ── Lithography Step ─────────────────────────────────────────────────
export function LithographyStep({ title = 'Lithography', layerCount = 7, exposureDose, alignOffset, focusDepth }: { title?: string; layerCount?: number; exposureDose: number; alignOffset: number; focusDepth: number } = {} as any) {
  const X = getX();
  const n = neo();
  const currentLayer = Math.ceil(layerCount * 0.6);
  const clampedLayer = Math.max(1, Math.min(layerCount, Math.round(currentLayer)));
  const progressPct = (clampedLayer / layerCount) * 100;
  const animProgress = useAnim(progressPct, 1000);

  const layerColors = [X.teal, X.indigo, X.purple, X.amber, X.pink, X.red, X.teal];
  const statusColor = clampedLayer >= layerCount ? X.teal : clampedLayer >= layerCount * 0.7 ? X.amber : X.indigo;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={statusColor}>Layer {clampedLayer}/{layerCount}</Badge>
      </div>

      {/* Stacked beveled layers with depth shadows */}
      <div style={{
        padding: '16px 14px', borderRadius: 10, background: n.metal,
        boxShadow: n.concave, marginBottom: 12, position: 'relative',
      }}>
        <svg viewBox="0 0 280 110" style={{ width: '100%', height: 110, display: 'block' }}>
          <defs>
            <linearGradient id="semi-lith-base" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={X.surface} />
              <stop offset="100%" stopColor={X.bgAlt} />
            </linearGradient>
            {layerColors.map((c, i) => (
              <linearGradient key={i} id={`semi-lith-l${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c} stopOpacity=".7" />
                <stop offset="100%" stopColor={c} stopOpacity=".3" />
              </linearGradient>
            ))}
          </defs>

          {/* Substrate base */}
          <rect x="40" y="88" width="200" height="14" rx="3"
            fill="url(#semi-lith-base)" stroke={X.border} strokeWidth=".5" />
          <text x="140" y="97" textAnchor="middle" fontFamily="monospace" fontSize="6" fill={X.textMut}>
            SUBSTRATE
          </text>

          {/* Stacked layers */}
          {Array.from({ length: layerCount }, (_, i) => {
            const layerH = 9;
            const y = 88 - (i + 1) * layerH;
            const isActive = i < clampedLayer;
            const isCurrent = i === clampedLayer - 1;
            const colorIdx = i % layerColors.length;
            const indent = i * 2;

            return (
              <g key={i} style={{
                opacity: isActive ? 1 : 0.2,
                transition: `opacity 400ms ${ease.o}`,
              }}>
                {/* Layer shadow */}
                {isActive && (
                  <rect x={44 + indent} y={y + 2} width={192 - indent * 2} height={layerH}
                    rx="2" fill="rgba(0,0,0,0.15)" />
                )}
                {/* Layer body */}
                <rect x={42 + indent} y={y} width={196 - indent * 2} height={layerH}
                  rx="2"
                  fill={isActive ? `url(#semi-lith-l${colorIdx})` : X.borderLight}
                  stroke={isActive ? layerColors[colorIdx] + '50' : X.border}
                  strokeWidth={isCurrent ? '1' : '.3'}
                />
                {/* Layer label */}
                <text x={140} y={y + layerH - 2.5} textAnchor="middle"
                  fontFamily="monospace" fontSize="5"
                  fill={isActive ? '#ffffffcc' : X.textMut}>
                  L{i + 1}
                </text>
                {/* Current layer glow */}
                {isCurrent && (
                  <rect x={42 + indent} y={y} width={196 - indent * 2} height={layerH}
                    rx="2" fill="none" stroke={layerColors[colorIdx]}
                    strokeWidth="1.2"
                    style={{ filter: `drop-shadow(0 0 4px ${layerColors[colorIdx]}60)` }} />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <Lbl style={{ marginBottom: 0 }}>Layer Progress</Lbl>
          <M style={{ fontSize: 9, fontWeight: 700, color: statusColor }}>{animProgress.toFixed(0)}%</M>
        </div>
        <Prog value={animProgress} color={statusColor} h={5} />
      </div>

      {/* Metrics row */}
      <div style={{ display: 'flex', gap: 6 }}>
        {([
          ['Dose', `${exposureDose.toFixed(0)} mJ`, X.indigo],
          ['Align', `${alignOffset.toFixed(2)} nm`, alignOffset > 1.2 ? X.red : X.teal],
          ['Focus', `${focusDepth.toFixed(0)} nm`, X.purple],
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

// ── Defect Map ───────────────────────────────────────────────────────
export function DefectMap({ title = 'Defect Map', dpiThreshold = 15 }: { title?: string; dpiThreshold?: number } = {}) {
  const X = getX();
  const n = neo();

  // Generate defect grid
  const gridSize = 8;
  const [defects] = useState<{ x: number; y: number; count: number }[]>(() => {
    const d: { x: number; y: number; count: number }[] = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        d.push({ x: c, y: r, count: Math.random() < 0.15 ? Math.floor(Math.random() * 30) + 1 : 0 });
      }
    }
    return d;
  });

  const totalDefects = defects.reduce((s, d) => s + d.count, 0);
  const failZones = defects.filter(d => d.count > dpiThreshold).length;
  const passZones = defects.filter(d => d.count === 0 || d.count <= dpiThreshold).length;
  const liveDefects = totalDefects;
  const animDefects = useAnim(Math.min(100, (liveDefects / (gridSize * gridSize * 10)) * 100), 1200);

  const overallColor = failZones > 5 ? X.red : failZones > 2 ? X.amber : X.teal;
  const status = failZones > 5 ? 'Critical' : failZones > 2 ? 'Warning' : 'Pass';

  return (
    <Card style={{ width: 350 }} glow={failZones > 5 ? X.red : undefined}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={overallColor}>{status}</Badge>
      </div>

      {/* Defect grid with beveled cells */}
      <div style={{
        padding: 10, borderRadius: 10, background: n.metal,
        boxShadow: n.concave, marginBottom: 12,
      }}>
        <svg viewBox="0 0 200 200" style={{ width: '100%', height: 200, display: 'block' }}>
          <defs>
            <radialGradient id="semi-def-glow">
              <stop offset="0%" stopColor={X.red} stopOpacity=".9" />
              <stop offset="100%" stopColor={X.red} stopOpacity="0" />
            </radialGradient>
            <filter id="semi-def-blur">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>

          {defects.map((d, i) => {
            const cellSize = 200 / gridSize;
            const px = d.x * cellSize;
            const py = d.y * cellSize;
            const hasFail = d.count > dpiThreshold;
            const hasDefect = d.count > 0;
            const cellColor = hasFail ? X.red + '30' : hasDefect ? X.amber + '15' : X.teal + '08';
            const borderColor = hasFail ? X.red + '60' : hasDefect ? X.amber + '30' : X.border;

            return (
              <g key={i}>
                {/* Cell background with bevel */}
                <rect x={px + 1} y={py + 1} width={cellSize - 2} height={cellSize - 2}
                  rx="2" fill={cellColor} stroke={borderColor} strokeWidth=".5" />
                {/* Defect dots */}
                {hasDefect && (
                  <>
                    {/* Glow layer */}
                    {hasFail && (
                      <circle cx={px + cellSize / 2} cy={py + cellSize / 2} r="8"
                        fill="url(#semi-def-glow)" filter="url(#semi-def-blur)" />
                    )}
                    {/* Defect LED */}
                    <circle cx={px + cellSize / 2} cy={py + cellSize / 2}
                      r={hasFail ? 4 : 2.5}
                      fill={hasFail ? X.red : X.amber}
                      style={{ filter: `drop-shadow(0 0 3px ${hasFail ? X.red : X.amber}60)` }}
                    />
                    {/* Count label */}
                    <text x={px + cellSize / 2} y={py + cellSize - 3}
                      textAnchor="middle" fontFamily="monospace" fontSize="5.5"
                      fill={hasFail ? X.red : X.textMut} fontWeight={hasFail ? '700' : '400'}>
                      {d.count}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        {([
          ['Defects', `${Math.round(liveDefects)}`, overallColor],
          ['Pass Zones', `${passZones}`, X.teal],
          ['Fail Zones', `${failZones}`, failZones > 0 ? X.red : X.teal],
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

      <div style={{
        display: 'flex', justifyContent: 'space-between', padding: '5px 8px',
        borderRadius: 6, background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        <M style={{ fontSize: 8, color: X.textMut }}>DPI Threshold: {dpiThreshold} defects/zone</M>
        <M style={{ fontSize: 8, color: overallColor, fontWeight: 600 }}>
          Density: {animDefects.toFixed(1)}%
        </M>
      </div>
    </Card>
  );
}

// ── Etch Chamber ─────────────────────────────────────────────────────
export function EtchChamber({ title = 'Etch Chamber', pressureUnit = 'mTorr', chamberPressure, gasFlow, rfPower, etchRate }: { title?: string; pressureUnit?: string; chamberPressure: number; gasFlow: number; rfPower: number; etchRate: number } = {} as any) {
  const X = getX();
  const n = neo();

  const maxPressure = 200;
  const maxGas = 250;
  const maxRF = 1200;
  const maxEtch = 5;

  const gauges = [
    { label: 'Pressure', value: chamberPressure, max: maxPressure, unit: pressureUnit, color: X.teal, warn: 150 },
    { label: 'Gas Flow', value: gasFlow, max: maxGas, unit: 'sccm', color: X.indigo, warn: 200 },
    { label: 'RF Power', value: rfPower, max: maxRF, unit: 'W', color: X.purple, warn: 1000 },
    { label: 'Etch Rate', value: etchRate, max: maxEtch, unit: 'nm/s', color: X.amber, warn: 4 },
  ];

  const animNeedles = [
    useAnim(-135 + Math.min(1, chamberPressure / maxPressure) * 270, 900),
    useAnim(-135 + Math.min(1, gasFlow / maxGas) * 270, 950),
    useAnim(-135 + Math.min(1, rfPower / maxRF) * 270, 1000),
    useAnim(-135 + Math.min(1, etchRate / maxEtch) * 270, 850),
  ];

  const overallStatus = gauges.some(g => g.value > g.warn) ? 'Warning' : 'Nominal';
  const overallColor = gauges.some(g => g.value > g.warn) ? X.amber : X.teal;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Dot c={overallColor} pulse s={7} />
          <Badge color={overallColor}>{overallStatus}</Badge>
        </div>
      </div>

      {/* 2x2 gauge cluster */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
        marginBottom: 10,
      }}>
        {gauges.map((g, i) => {
          const pct = Math.min(1, g.value / g.max);
          const isWarn = g.value > g.warn;
          const gaugeColor = isWarn ? X.red : g.color;

          return (
            <div key={i} style={{
              padding: '8px 6px 6px', borderRadius: 8,
              background: n.metal, boxShadow: n.raised,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              animation: `fu 150ms ${ease.o} ${i * 40}ms both`,
            }}>
              {/* Mini gauge */}
              <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: X.bgAlt, boxShadow: n.concave,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 4,
              }}>
                <svg viewBox="0 0 60 60" style={{ width: 65, height: 65, display: 'block' }}>
                  <defs>
                    <linearGradient id={`semi-eg-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={X.surface} />
                      <stop offset="100%" stopColor={X.bgAlt} />
                    </linearGradient>
                  </defs>
                  {/* Face */}
                  <circle cx="30" cy="30" r="28" fill={`url(#semi-eg-${i})`} stroke={X.border} strokeWidth=".3" />

                  {/* Scale arc bg */}
                  <path
                    d={`M ${30 + 22 * Math.cos((-135 * Math.PI) / 180)} ${30 + 22 * Math.sin((-135 * Math.PI) / 180)} A 22 22 0 1 1 ${30 + 22 * Math.cos((135 * Math.PI) / 180)} ${30 + 22 * Math.sin((135 * Math.PI) / 180)}`}
                    fill="none" stroke={X.borderLight} strokeWidth="2.5" strokeLinecap="round"
                  />

                  {/* Warning zone arc */}
                  {(() => {
                    const warnAngle = -135 + (g.warn / g.max) * 270;
                    return (
                      <path
                        d={`M ${30 + 22 * Math.cos(((warnAngle - 90) * Math.PI) / 180)} ${30 + 22 * Math.sin(((warnAngle - 90) * Math.PI) / 180)} A 22 22 0 0 1 ${30 + 22 * Math.cos((135 * Math.PI) / 180)} ${30 + 22 * Math.sin((135 * Math.PI) / 180)}`}
                        fill="none" stroke={X.red + '30'} strokeWidth="2.5" strokeLinecap="round"
                      />
                    );
                  })()}

                  {/* Scale markings */}
                  {[0, 0.25, 0.5, 0.75, 1].map((p, j) => {
                    const a = (-135 + p * 270 - 90) * (Math.PI / 180);
                    return (
                      <line key={j}
                        x1={30 + 18 * Math.cos(a)} y1={30 + 18 * Math.sin(a)}
                        x2={30 + 22 * Math.cos(a)} y2={30 + 22 * Math.sin(a)}
                        stroke={X.textMut} strokeWidth=".5" />
                    );
                  })}

                  {/* Needle */}
                  <line
                    x1="30" y1="30"
                    x2={30 + 17 * Math.cos(((animNeedles[i] - 90) * Math.PI) / 180)}
                    y2={30 + 17 * Math.sin(((animNeedles[i] - 90) * Math.PI) / 180)}
                    stroke={gaugeColor} strokeWidth=".8" strokeLinecap="round"
                    style={{ transition: `x2 800ms ${ease.o}, y2 800ms ${ease.o}`, filter: `drop-shadow(0 0 2px ${gaugeColor}40)` }}
                  />
                  {/* Center cap */}
                  <circle cx="30" cy="30" r="2.5" fill={X.surface} stroke={X.border} strokeWidth=".4" />
                  <circle cx="30" cy="30" r="1" fill={gaugeColor} />

                  {/* Value */}
                  <text x="30" y="43" textAnchor="middle" fontFamily="monospace" fontSize="6" fontWeight="800" fill={gaugeColor}>
                    {g.value < 10 ? g.value.toFixed(1) : Math.round(g.value)}
                  </text>
                  <text x="30" y="49" textAnchor="middle" fontFamily="monospace" fontSize="3.5" fill={X.textMut}>
                    {g.unit}
                  </text>
                </svg>
              </div>
              <Lbl style={{ textAlign: 'center', marginBottom: 0 }}>{g.label}</Lbl>
              {isWarn && (
                <span style={{
                  display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                  background: X.red, boxShadow: `0 0 6px ${X.red}50`,
                  animation: `br 2s ease infinite`, marginTop: 2,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Status bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', padding: '6px 8px',
        borderRadius: 6, background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Chamber Status</M>
        <M style={{ fontSize: 8, color: overallColor, fontWeight: 600 }}>
          {gauges.filter(g => g.value > g.warn).length > 0
            ? `${gauges.filter(g => g.value > g.warn).length} param(s) in warning`
            : 'All parameters nominal'}
        </M>
      </div>
    </Card>
  );
}

// ── Wafer Transport ──────────────────────────────────────────────────
export function WaferTransport({ title = 'Wafer Transport', lotSize = 25, speed }: { title?: string; lotSize?: number; speed: number } = {} as any) {
  const X = getX();
  const n = neo();
  const tick = useTick(80);
  const processed = Math.floor(lotSize * 0.64);
  const clampedProcessed = Math.max(0, Math.min(lotSize, Math.round(processed)));
  const progressPct = (clampedProcessed / lotSize) * 100;
  const animProgress = useAnim(progressPct, 1200);

  const stations = [
    { name: 'LOAD', color: X.teal },
    { name: 'LITHO', color: X.indigo },
    { name: 'ETCH', color: X.purple },
    { name: 'DEPO', color: X.amber },
    { name: 'UNLOAD', color: X.teal },
  ];

  const activeStation = Math.floor(tick / 40) % stations.length;

  const statusColor = progressPct >= 90 ? X.teal : progressPct >= 50 ? X.indigo : X.amber;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={statusColor}>Lot {clampedProcessed}/{lotSize}</Badge>
      </div>

      {/* Conveyor track visualization */}
      <div style={{
        padding: '14px 10px', borderRadius: 10, background: n.metal,
        boxShadow: n.concave, marginBottom: 12, position: 'relative', overflow: 'hidden',
      }}>
        {/* Track rail */}
        <svg viewBox="0 0 300 70" style={{ width: '100%', height: 70, display: 'block' }}>
          <defs>
            <linearGradient id="semi-trk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={X.surface} />
              <stop offset="40%" stopColor={X.borderLight} />
              <stop offset="60%" stopColor={X.borderLight} />
              <stop offset="100%" stopColor={X.bgAlt} />
            </linearGradient>
            <linearGradient id="semi-wfr" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={X.indigo} stopOpacity=".7" />
              <stop offset="100%" stopColor={X.purple} stopOpacity=".4" />
            </linearGradient>
          </defs>

          {/* Main rail */}
          <rect x="10" y="32" width="280" height="8" rx="4" fill="url(#semi-trk)"
            stroke={X.border} strokeWidth=".5" />

          {/* Rail ridges (moving conveyor) */}
          {Array.from({ length: 20 }, (_, i) => {
            const baseX = i * 15;
            const offset = (tick * 2) % 15;
            const rx = baseX + offset;
            if (rx > 295 || rx < 5) return null;
            return (
              <rect key={i} x={rx} y="34" width="2" height="4" rx="1"
                fill={X.textMut} opacity=".3" />
            );
          })}

          {/* Station markers */}
          {stations.map((s, i) => {
            const sx = 30 + i * 60;
            const isActive = i === activeStation;

            return (
              <g key={i}>
                {/* Station pillar */}
                <rect x={sx - 8} y="44" width="16" height="16" rx="3"
                  fill={isActive ? s.color + '25' : X.bgAlt}
                  stroke={isActive ? s.color : X.border} strokeWidth={isActive ? '1' : '.5'}
                />
                {/* Station label */}
                <text x={sx} y="55" textAnchor="middle" fontFamily="monospace" fontSize="4.5"
                  fontWeight="700" fill={isActive ? s.color : X.textMut}>
                  {s.name}
                </text>
                {/* Active LED */}
                {isActive && (
                  <circle cx={sx} cy="65" r="2" fill={s.color}
                    style={{ filter: `drop-shadow(0 0 3px ${s.color}60)` }} />
                )}
              </g>
            );
          })}

          {/* Moving wafer carrier */}
          {(() => {
            const carrierX = 30 + activeStation * 60;
            return (
              <g style={{ transition: `transform 400ms ${ease.o}`, transform: `translateX(${carrierX - 150}px)` }}>
                {/* Carrier body */}
                <rect x="144" y="20" width="12" height="14" rx="2"
                  fill="url(#semi-wfr)" stroke={X.indigo} strokeWidth=".6" />
                {/* Wafer disk */}
                <circle cx="150" cy="24" r="4" fill={X.surface}
                  stroke={X.indigo + '80'} strokeWidth=".4" />
                <circle cx="150" cy="24" r="2" fill={X.indigo + '30'} />
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Lot progress */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <Lbl style={{ marginBottom: 0 }}>Lot Progress</Lbl>
          <M style={{ fontSize: 9, fontWeight: 700, color: statusColor }}>{clampedProcessed}/{lotSize} wafers</M>
        </div>
        <div style={{
          height: 10, borderRadius: 5, boxShadow: n.concave,
          background: X.bgAlt, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 1, bottom: 1, left: 1,
            width: `${Math.min(100, Math.max(0, animProgress))}%`,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${statusColor}80, ${statusColor})`,
            boxShadow: `0 0 8px ${statusColor}30, inset 0 1px 0 #ffffff15`,
            transition: `width 500ms ${ease.sp}`,
          }} />
        </div>
      </div>

      {/* Bottom metrics */}
      <div style={{ display: 'flex', gap: 6 }}>
        {([
          ['Speed', `${speed.toFixed(1)} m/s`, X.indigo],
          ['Station', stations[activeStation].name, stations[activeStation].color],
          ['Remaining', `${lotSize - clampedProcessed}`, X.textSec],
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
