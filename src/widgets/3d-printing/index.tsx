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

// ── Print Progress ──────────────────────────────────────────────────
export function PrintProgress({ title = 'Print Progress', layerCurrent = 142, layerTotal = 380, etaMinutes = 47 }: { title?: string; layerCurrent?: number; layerTotal?: number; etaMinutes?: number }) {
  const X = getX();
  const n = neo();

  const pct = layerTotal > 0 ? (layerCurrent / layerTotal) * 100 : 0;
  const pctAnim = useAnim(pct, 800);
  const progressColor = pct > 90 ? X.teal : pct > 50 ? X.indigo : X.purple;

  const etaH = Math.floor(etaMinutes / 60);
  const etaM = etaMinutes % 60;
  const etaStr = etaH > 0 ? `${etaH}h ${etaM}m` : `${etaM}m`;

  const barH = 120;
  const fillH = (pct / 100) * barH;

  // Layer lines for visual effect
  const layerLines = 12;

  return (
    <Card style={{ width: 350 }} glow={progressColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={progressColor}>{pct.toFixed(0)}%</Badge>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 14 }}>
        {/* Vertical progress tower */}
        <div style={{
          width: 60, height: barH + 16, borderRadius: '4px 4px 6px 6px',
          background: X.bg, boxShadow: n.bezel,
          position: 'relative', overflow: 'hidden',
          border: `1px solid ${X.borderLight}`,
        }}>
          {/* Build plate */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 8,
            background: n.metal, borderTop: `1px solid ${X.borderLight}`,
          }} />

          {/* Fill (layers built so far) */}
          <div style={{
            position: 'absolute', bottom: 8, left: 2, right: 2,
            height: `${(fillH / (barH + 8)) * 100}%`,
            transition: `height 600ms ${ease.sp}`,
            borderRadius: '2px 2px 0 0',
            overflow: 'hidden',
          }}>
            <svg viewBox={`0 0 56 ${barH}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
              <defs>
                <linearGradient id="print-fill-grad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor={progressColor} stopOpacity=".25" />
                  <stop offset="100%" stopColor={progressColor} stopOpacity=".1" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="56" height={barH} fill={`url(#print-fill-grad)`} />
              {/* Layer lines */}
              {Array.from({ length: layerLines }, (_, i) => {
                const y = (i / layerLines) * barH;
                return <line key={i} x1="0" y1={y} x2="56" y2={y} stroke={progressColor} strokeWidth=".3" opacity=".5" />;
              })}
            </svg>
            {/* Top edge glow */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 3,
              background: `linear-gradient(90deg, transparent, ${progressColor}80, transparent)`,
            }} />
          </div>

          {/* Percentage overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <M style={{ fontSize: 16, fontWeight: 800, color: progressColor, textShadow: `0 1px 3px ${X.bg}` }}>
              {pct.toFixed(0)}%
            </M>
          </div>
        </div>

        {/* Stats panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <Lbl style={{ marginBottom: 3 }}>Layer</Lbl>
            <M style={{ fontSize: 18, fontWeight: 800, color: X.text }}>
              {layerCurrent} <span style={{ fontSize: 10, color: X.textMut, fontWeight: 400 }}>/ {layerTotal}</span>
            </M>
          </div>
          <div>
            <Lbl style={{ marginBottom: 3 }}>Progress</Lbl>
            <Prog value={pctAnim} color={progressColor} h={4} />
          </div>
          <div>
            <Lbl style={{ marginBottom: 3 }}>ETA Remaining</Lbl>
            <M style={{ fontSize: 14, fontWeight: 700, color: X.amber }}>{etaStr}</M>
          </div>
          <div>
            <Lbl style={{ marginBottom: 3 }}>Status</Lbl>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Dot c={X.teal} pulse s={5} />
              <M style={{ fontSize: 10, fontWeight: 600, color: X.teal }}>Printing</M>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Nozzle Temp ─────────────────────────────────────────────────────
export function NozzleTemp({ title = 'Nozzle Temp', actualTemp = 205, targetTemp = 210, maxTemp = 280 }: { title?: string; actualTemp?: number; targetTemp?: number; maxTemp?: number }) {
  const X = getX();
  const n = neo();

  const actualPct = Math.min(actualTemp / maxTemp, 1);
  const targetPct = Math.min(targetTemp / maxTemp, 1);
  const actualAnim = useAnim(actualPct * 100, 800);

  const delta = actualTemp - targetTemp;
  const tempColor = Math.abs(delta) > 10 ? X.red : Math.abs(delta) > 5 ? X.amber : X.teal;

  const gaugeH = 110;
  const gaugeW = 24;
  const svgW = 80, svgH = 140;
  const gx = svgW / 2 - gaugeW / 2;
  const gy = 10;

  return (
    <Card style={{ width: 350 }} glow={tempColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={tempColor}>{actualTemp}\u00B0C</Badge>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 12 }}>
        {/* Thermometer gauge */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: 80, height: 140, display: 'block' }}>
            {/* Thermometer body */}
            <rect x={gx} y={gy} width={gaugeW} height={gaugeH} rx="12"
              fill={X.bg} stroke={X.borderLight} strokeWidth="1" />

            {/* Bulb at bottom */}
            <circle cx={svgW / 2} cy={gy + gaugeH + 4} r="14" fill={X.bg} stroke={X.borderLight} strokeWidth="1" />

            {/* Fill level */}
            {(() => {
              const fillTop = gy + gaugeH * (1 - actualPct);
              return (
                <>
                  <rect x={gx + 4} y={fillTop} width={gaugeW - 8} height={gy + gaugeH - fillTop} rx="6"
                    fill={tempColor} opacity=".6" />
                  <circle cx={svgW / 2} cy={gy + gaugeH + 4} r="10" fill={tempColor} opacity=".7" />
                </>
              );
            })()}

            {/* Target indicator line */}
            {(() => {
              const ty = gy + gaugeH * (1 - targetPct);
              return (
                <>
                  <line x1={gx - 6} y1={ty} x2={gx + gaugeW + 6} y2={ty}
                    stroke={X.purple} strokeWidth="1.5" strokeDasharray="3 1" />
                  <text x={gx + gaugeW + 9} y={ty + 1} dominantBaseline="central"
                    fontFamily={X.m} fontSize="5" fill={X.purple}>TGT</text>
                </>
              );
            })()}

            {/* Scale ticks */}
            {[0, 50, 100, 150, 200, 250].filter(v => v <= maxTemp).map(v => {
              const y = gy + gaugeH * (1 - v / maxTemp);
              return (
                <g key={v}>
                  <line x1={gx - 2} y1={y} x2={gx} y2={y} stroke={X.textMut} strokeWidth=".5" />
                  <text x={gx - 5} y={y} textAnchor="end" dominantBaseline="central"
                    fontFamily={X.m} fontSize="4" fill={X.textMut}>{v}</text>
                </g>
              );
            })}

            {/* Readout */}
            <text x={svgW / 2} y={gy + gaugeH + 5} textAnchor="middle" dominantBaseline="central"
              fontFamily={X.m} fontSize="7" fontWeight="800" fill={X.text}>{actualTemp}\u00B0</text>
          </svg>
        </div>

        {/* Stats */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <Lbl style={{ marginBottom: 3 }}>Actual Temperature</Lbl>
            <M style={{ fontSize: 22, fontWeight: 800, color: tempColor }}>{actualTemp}\u00B0C</M>
          </div>
          <div>
            <Lbl style={{ marginBottom: 3 }}>Target</Lbl>
            <M style={{ fontSize: 14, fontWeight: 700, color: X.purple }}>{targetTemp}\u00B0C</M>
          </div>
          <div>
            <Lbl style={{ marginBottom: 3 }}>Delta</Lbl>
            <M style={{ fontSize: 14, fontWeight: 700, color: tempColor }}>
              {delta > 0 ? '+' : ''}{delta}\u00B0C
            </M>
          </div>
          <div>
            <Lbl style={{ marginBottom: 3 }}>Heating</Lbl>
            <Prog value={actualAnim} color={tempColor} h={3} />
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Bed Level ───────────────────────────────────────────────────────
export function BedLevel({ title = 'Bed Level', meshSize = 5 }: { title?: string; meshSize?: number }) {
  const X = getX();
  const n = neo();

  const gridSize = Math.min(Math.max(meshSize, 3), 7);

  // Generate deterministic Z-offsets from a seed-like pattern
  const offsets = Array.from({ length: gridSize * gridSize }, (_, i) => {
    const row = Math.floor(i / gridSize);
    const col = i % gridSize;
    // Bowl-shaped base + some variation
    const centerR = Math.floor(gridSize / 2);
    const centerC = Math.floor(gridSize / 2);
    const dist = Math.sqrt((row - centerR) ** 2 + (col - centerC) ** 2);
    return (dist * 0.08 - 0.15) + Math.sin(row * 1.7 + col * 2.3) * 0.06;
  });

  const minOff = Math.min(...offsets);
  const maxOff = Math.max(...offsets);
  const range = maxOff - minOff || 0.01;

  // Map offset to color: blue (low) -> green (center) -> red (high)
  const offsetColor = (val: number) => {
    const t = (val - minOff) / range;
    if (t < 0.3) return X.indigo;
    if (t < 0.7) return X.teal;
    return X.red;
  };

  const cellSize = Math.min(40, 240 / gridSize);

  return (
    <Card style={{ width: 350 }} glow={X.indigo}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>{gridSize}x{gridSize} Mesh</Badge>
      </div>

      {/* Heatmap grid */}
      <div style={{
        display: 'flex', justifyContent: 'center', marginBottom: 14,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
          gap: 2,
          padding: 8,
          borderRadius: X.rs,
          background: X.bg,
          boxShadow: n.concave,
        }}>
          {offsets.map((val, i) => {
            const c = offsetColor(val);
            const t = (val - minOff) / range;
            return (
              <div key={i} style={{
                width: cellSize, height: cellSize,
                borderRadius: 3,
                background: `${c}${Math.round(20 + t * 35).toString(16).padStart(2, '0')}`,
                border: `1px solid ${c}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: `fu 100ms ${ease.o} ${i * 10}ms both`,
              }}>
                <M style={{ fontSize: cellSize > 30 ? 8 : 6, fontWeight: 600, color: c }}>
                  {val >= 0 ? '+' : ''}{val.toFixed(2)}
                </M>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: `${X.indigo}50` }} />
          <M style={{ fontSize: 8, color: X.textMut }}>Low</M>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: `${X.teal}50` }} />
          <M style={{ fontSize: 8, color: X.textMut }}>Level</M>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 10, height: 10, borderRadius: 2, background: `${X.red}50` }} />
          <M style={{ fontSize: 8, color: X.textMut }}>High</M>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Min Z</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.indigo }}>{minOff.toFixed(3)} mm</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Max Z</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.red }}>{maxOff.toFixed(3)} mm</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Range</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.amber }}>{range.toFixed(3)} mm</M></div>
      </div>
    </Card>
  );
}

// ── Filament Tracker ────────────────────────────────────────────────
export function FilamentTracker({ title = 'Filament Tracker', remainingG = 480, totalG = 1000, materialType = 'PLA' }: { title?: string; remainingG?: number; totalG?: number; materialType?: string }) {
  const X = getX();
  const n = neo();

  const pct = totalG > 0 ? (remainingG / totalG) * 100 : 0;
  const pctAnim = useAnim(pct, 800);
  const fillColor = pct < 15 ? X.red : pct < 30 ? X.amber : X.teal;

  const cx = 50, cy = 50;
  const outerR = 38, innerR = 16;

  // Spool arc: full circle, fill proportional to remaining
  const fillAngle = (pct / 100) * 360;

  const arcPath = (r: number, startDeg: number, endDeg: number) => {
    const s = polarToCartesian(cx, cy, r, startDeg);
    const e = polarToCartesian(cx, cy, r, endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  const wedgePath = (startDeg: number, endDeg: number) => {
    const s1 = polarToCartesian(cx, cy, innerR, startDeg);
    const e1 = polarToCartesian(cx, cy, outerR, startDeg);
    const s2 = polarToCartesian(cx, cy, outerR, endDeg);
    const e2 = polarToCartesian(cx, cy, innerR, endDeg);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s1.x} ${s1.y} L ${e1.x} ${e1.y} A ${outerR} ${outerR} 0 ${large} 1 ${s2.x} ${s2.y} L ${e2.x} ${e2.y} A ${innerR} ${innerR} 0 ${large} 0 ${s1.x} ${s1.y} Z`;
  };

  const matColors: Record<string, string> = { PLA: X.teal, ABS: X.amber, PETG: X.indigo, TPU: X.purple, Nylon: X.pink };
  const matColor = matColors[materialType] ?? X.teal;

  return (
    <Card style={{ width: 350 }} glow={fillColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={matColor}>{materialType}</Badge>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 12 }}>
        {/* Spool visualization */}
        <div style={{
          width: 130, height: 130, borderRadius: '50%',
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg viewBox="0 0 100 100" style={{ width: 120, height: 120, display: 'block' }}>
            {/* Empty spool ring */}
            <circle cx={cx} cy={cy} r={outerR} fill="none" stroke={X.borderLight} strokeWidth="1" />
            <circle cx={cx} cy={cy} r={innerR} fill={X.bg} stroke={X.borderLight} strokeWidth="1" />

            {/* Filament remaining (wedge fill) */}
            {fillAngle > 1 && (
              <path d={wedgePath(-90, -90 + Math.min(fillAngle, 359.9))}
                fill={fillColor} opacity=".35" />
            )}

            {/* Spool spokes */}
            {[0, 90, 180, 270].map(a => {
              const rad = (a - 90) * Math.PI / 180;
              return (
                <line key={a}
                  x1={cx + Math.cos(rad) * (innerR + 1)} y1={cy + Math.sin(rad) * (innerR + 1)}
                  x2={cx + Math.cos(rad) * (outerR - 1)} y2={cy + Math.sin(rad) * (outerR - 1)}
                  stroke={X.borderLight} strokeWidth=".5" />
              );
            })}

            {/* Center hub */}
            <circle cx={cx} cy={cy} r="8" fill={X.surface} stroke={X.borderLight} strokeWidth=".5" />

            {/* Center text */}
            <text x={cx} y={cy - 2} textAnchor="middle" fontFamily={X.m}
              fontSize="8" fontWeight="800" fill={fillColor}>{pct.toFixed(0)}%</text>
            <text x={cx} y={cy + 5} textAnchor="middle" fontFamily={X.m}
              fontSize="4" fill={X.textMut}>remaining</text>
          </svg>
        </div>

        {/* Stats */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <Lbl style={{ marginBottom: 3 }}>Remaining</Lbl>
            <M style={{ fontSize: 18, fontWeight: 800, color: fillColor }}>{remainingG}g</M>
          </div>
          <div>
            <Lbl style={{ marginBottom: 3 }}>Spool Total</Lbl>
            <M style={{ fontSize: 12, fontWeight: 600, color: X.textSec }}>{totalG}g</M>
          </div>
          <div>
            <Lbl style={{ marginBottom: 3 }}>Used</Lbl>
            <Prog value={100 - pctAnim} color={X.purple} h={3} />
            <M style={{ fontSize: 9, color: X.textMut, marginTop: 2 }}>{totalG - remainingG}g consumed</M>
          </div>
        </div>
      </div>
    </Card>
  );
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// ── GCode Preview ───────────────────────────────────────────────────
export function GCodePreview({ title = 'GCode Preview', layerNumber = 42 }: { title?: string; layerNumber?: number }) {
  const X = getX();
  const n = neo();
  const tick = useTick(150);

  // Generate a toolpath that looks like perimeter + infill
  const svgSize = 200;
  const pad = 20;
  const area = svgSize - pad * 2;

  // Perimeter path (outer wall)
  const perimeterPath = `M${pad},${pad} L${pad + area},${pad} L${pad + area},${pad + area} L${pad},${pad + area} Z`;

  // Inner perimeter
  const inset = 8;
  const innerPath = `M${pad + inset},${pad + inset} L${pad + area - inset},${pad + inset} L${pad + area - inset},${pad + area - inset} L${pad + inset},${pad + area - inset} Z`;

  // Infill: diagonal lines (rectilinear pattern)
  const infillLines: string[] = [];
  const infillInset = 14;
  const spacing = 10;
  const x0 = pad + infillInset, y0 = pad + infillInset;
  const x1 = pad + area - infillInset, y1 = pad + area - infillInset;

  // Alternate direction infill based on layer parity
  const isEven = layerNumber % 2 === 0;
  for (let i = 0; i * spacing <= (y1 - y0); i++) {
    if (isEven) {
      const y = y0 + i * spacing;
      if (y <= y1) {
        infillLines.push(i % 2 === 0 ? `M${x0},${y} L${x1},${y}` : `M${x1},${y} L${x0},${y}`);
      }
    } else {
      const x = x0 + i * spacing;
      if (x <= x1) {
        infillLines.push(i % 2 === 0 ? `M${x},${y0} L${x},${y1}` : `M${x},${y1} L${x},${y0}`);
      }
    }
  }

  // Animated print head position along infill
  const totalSegments = infillLines.length;
  const activeSegment = tick % (totalSegments + 4);

  return (
    <Card style={{ width: 350 }} glow={X.purple}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}>Layer {layerNumber}</Badge>
      </div>

      {/* GCode visualization */}
      <div style={{
        borderRadius: X.rs, background: X.bg, boxShadow: n.concave,
        padding: 6, marginBottom: 12,
      }}>
        <svg viewBox={`0 0 ${svgSize} ${svgSize}`} style={{ width: '100%', height: 200, display: 'block' }}>
          {/* Build plate grid */}
          {Array.from({ length: 11 }, (_, i) => {
            const pos = pad + (i / 10) * area;
            return (
              <g key={i}>
                <line x1={pos} y1={pad} x2={pos} y2={pad + area} stroke={X.borderLight} strokeWidth=".2" />
                <line x1={pad} y1={pos} x2={pad + area} y2={pos} stroke={X.borderLight} strokeWidth=".2" />
              </g>
            );
          })}

          {/* Perimeter walls */}
          <path d={perimeterPath} fill="none" stroke={X.teal} strokeWidth="1.5" opacity=".7" />
          <path d={innerPath} fill="none" stroke={X.teal} strokeWidth="1" opacity=".5" />

          {/* Infill */}
          {infillLines.map((d, i) => (
            <path key={i} d={d} fill="none"
              stroke={i < activeSegment ? X.purple : X.indigo}
              strokeWidth={i < activeSegment ? '1' : '.5'}
              opacity={i < activeSegment ? 0.8 : 0.3} />
          ))}

          {/* Print head indicator */}
          {activeSegment < totalSegments && (() => {
            // Parse the active line to get endpoint
            const parts = infillLines[activeSegment].split(/[ML,\s]+/).filter(Boolean);
            const hx = parseFloat(parts[parts.length - 2]);
            const hy = parseFloat(parts[parts.length - 1]);
            return (
              <g>
                <circle cx={hx} cy={hy} r="4" fill="none" stroke={X.amber} strokeWidth="1" />
                <circle cx={hx} cy={hy} r="1.5" fill={X.amber} />
              </g>
            );
          })()}

          {/* Axis labels */}
          <text x={svgSize / 2} y={svgSize - 4} textAnchor="middle" fontFamily={X.m} fontSize="5" fill={X.textMut}>X</text>
          <text x={6} y={svgSize / 2} textAnchor="middle" fontFamily={X.m} fontSize="5" fill={X.textMut}>Y</text>
        </svg>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Layer</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.purple }}>{layerNumber}</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Pattern</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.indigo }}>{isEven ? 'Horizontal' : 'Vertical'}</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Lines</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.teal }}>{infillLines.length}</M></div>
      </div>
    </Card>
  );
}

// ── Print Farm ──────────────────────────────────────────────────────
export function PrintFarm({ title = 'Print Farm', printerCount = 4 }: { title?: string; printerCount?: number }) {
  const X = getX();
  const n = neo();

  const count = Math.min(Math.max(printerCount, 2), 8);

  const printers = [
    { name: 'Printer 01', model: 'Prusa MK4', progress: 87, temp: 210, bedTemp: 60, status: 'printing' as const, file: 'bracket_v3.gcode' },
    { name: 'Printer 02', model: 'Bambu X1C', progress: 42, temp: 215, bedTemp: 55, status: 'printing' as const, file: 'housing_top.gcode' },
    { name: 'Printer 03', model: 'Voron 2.4', progress: 100, temp: 25, bedTemp: 25, status: 'idle' as const, file: '' },
    { name: 'Printer 04', model: 'Ender 3 V3', progress: 63, temp: 200, bedTemp: 65, status: 'printing' as const, file: 'gear_set.gcode' },
    { name: 'Printer 05', model: 'Prusa XL', progress: 0, temp: 195, bedTemp: 58, status: 'error' as const, file: 'panel.gcode' },
    { name: 'Printer 06', model: 'Bambu P1S', progress: 15, temp: 220, bedTemp: 70, status: 'printing' as const, file: 'mount_arm.gcode' },
    { name: 'Printer 07', model: 'Prusa MK4', progress: 100, temp: 24, bedTemp: 22, status: 'idle' as const, file: '' },
    { name: 'Printer 08', model: 'Voron 0.2', progress: 91, temp: 245, bedTemp: 100, status: 'printing' as const, file: 'shroud.gcode' },
  ].slice(0, count);

  const sc: Record<string, string> = { printing: X.teal, idle: X.textMut, error: X.red };
  const activeCount = printers.filter(p => p.status === 'printing').length;
  const errorCount = printers.filter(p => p.status === 'error').length;

  return (
    <Card style={{ width: 350 }} glow={errorCount > 0 ? X.red : X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Badge color={X.teal}>{activeCount} Active</Badge>
          {errorCount > 0 && <Badge color={X.red}>{errorCount} Error</Badge>}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
        {printers.map((p, i) => {
          const statusColor = sc[p.status] ?? X.textMut;
          return (
            <div key={i} style={{
              padding: '8px 10px', borderRadius: X.rs,
              background: X.bgAlt,
              border: `1px solid ${statusColor}15`,
              boxShadow: `inset 0 1px 0 #ffffff06`,
              animation: `fu 100ms ${ease.o} ${i * 30}ms both`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Dot c={statusColor} pulse={p.status === 'printing'} s={5} />
                  <M style={{ fontSize: 9, fontWeight: 700, color: X.text }}>{p.name}</M>
                </div>
              </div>

              <M style={{ fontSize: 7, color: X.textMut, marginBottom: 4, display: 'block' }}>{p.model}</M>

              {p.status === 'printing' ? (
                <>
                  <Prog value={p.progress} color={X.teal} h={3} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                    <M style={{ fontSize: 8, fontWeight: 600, color: X.teal }}>{p.progress}%</M>
                    <M style={{ fontSize: 8, color: X.textMut }}>{p.temp}\u00B0 / {p.bedTemp}\u00B0</M>
                  </div>
                  <M style={{ fontSize: 7, color: X.textMut, marginTop: 2, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.file}</M>
                </>
              ) : p.status === 'error' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <M style={{ fontSize: 9, fontWeight: 700, color: X.red }}>ERROR</M>
                  <M style={{ fontSize: 7, color: X.textMut }}>{p.file}</M>
                </div>
              ) : (
                <M style={{ fontSize: 9, color: X.textMut, marginTop: 4, display: 'block' }}>Ready</M>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTop: `1px solid ${X.borderLight}` }}>
        <div><Lbl style={{ marginBottom: 1 }}>Fleet</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.indigo }}>{count} Printers</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 1 }}>Utilization</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>{count > 0 ? Math.round((activeCount / count) * 100) : 0}%</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 1 }}>Status</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: errorCount > 0 ? X.red : X.teal }}>{errorCount > 0 ? 'Attention' : 'Normal'}</M></div>
      </div>
    </Card>
  );
}
