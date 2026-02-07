import { useState } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { useAnim, useLive, useTick } from '../hooks';

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

// -- Depth Gauge ---------------------------------------------------------------
export function DepthGauge({ title = 'Depth', maxDepth = 400 }: { title?: string; maxDepth?: number } = {}) {
  const X = getX();
  const n = neo();
  const depth = useLive(185, 15);

  const depthPct = Math.min(1, Math.max(0, depth / maxDepth));
  const animPct = useAnim(depthPct * 100, 1200);
  const depthColor = depthPct > 0.85 ? X.red : depthPct > 0.65 ? X.amber : X.teal;

  // SVG layout constants
  const tubeX = 55, tubeY = 14, tubeW = 24, tubeH = 160;
  const innerX = tubeX + 3, innerW = tubeW - 6;
  const innerY = tubeY + 3, innerH = tubeH - 6;
  const mercuryH = (animPct / 100) * innerH;
  const mercuryTop = innerY + innerH - mercuryH;

  // Markings
  const markCount = 5;
  const markings = Array.from({ length: markCount + 1 }, (_, i) => {
    const pct = i / markCount;
    const y = innerY + innerH - pct * innerH;
    const val = Math.round(pct * maxDepth);
    return { y, val };
  });

  return (
    <Card style={{ width: 350 }} glow={depthColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={depthColor}>{depthPct > 0.85 ? 'Critical' : depthPct > 0.65 ? 'Deep' : 'Normal'}</Badge>
      </div>

      <div style={{ display: 'flex', gap: 14 }}>
        {/* Glass tube SVG */}
        <div style={{
          width: 140, borderRadius: 8,
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, padding: '6px 0',
        }}>
          <svg viewBox="0 0 134 190" style={{ width: 134, height: 190, display: 'block' }}>
            <defs>
              <linearGradient id="sub-tube-glass" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={X.border} stopOpacity=".35" />
                <stop offset="30%" stopColor={X.bgAlt} stopOpacity=".6" />
                <stop offset="70%" stopColor={X.bgAlt} stopOpacity=".6" />
                <stop offset="100%" stopColor={X.border} stopOpacity=".35" />
              </linearGradient>
              <linearGradient id="sub-mercury" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c0c0c0" stopOpacity=".7" />
                <stop offset="40%" stopColor="#a0a0a0" stopOpacity=".85" />
                <stop offset="100%" stopColor="#808080" stopOpacity=".95" />
              </linearGradient>
            </defs>

            {/* Tube body (glass) */}
            <rect x={tubeX} y={tubeY} width={tubeW} height={tubeH} rx="12"
              fill="url(#sub-tube-glass)" stroke={X.border} strokeWidth="1.2" />

            {/* Mercury column (fills from bottom) */}
            {mercuryH > 0 && (
              <rect x={innerX} y={mercuryTop} width={innerW} height={mercuryH} rx="2"
                fill="url(#sub-mercury)"
                style={{ transition: `height 800ms ${ease.o}, y 800ms ${ease.o}` }} />
            )}

            {/* Concave meniscus at top of mercury */}
            {mercuryH > 4 && (
              <path
                d={`M ${innerX},${mercuryTop + 2} Q ${innerX + innerW / 2},${mercuryTop + 5} ${innerX + innerW},${mercuryTop + 2}`}
                fill={X.bgAlt} fillOpacity=".5"
                style={{ transition: `d 800ms ${ease.o}` }}
              />
            )}

            {/* Specular highlight (thin vertical strip offset from center) */}
            <rect x={innerX + 4} y={tubeY + 6} width={2} height={tubeH - 12} rx="1"
              fill="#ffffff12" />

            {/* Depth markings on left side */}
            {markings.map((mk, i) => (
              <g key={i}>
                <line x1={tubeX - 8} y1={mk.y} x2={tubeX - 1} y2={mk.y}
                  stroke={X.textMut} strokeWidth={i % 2 === 0 ? '1' : '.5'} />
                <text x={tubeX - 12} y={mk.y + 1.5} textAnchor="end" fontFamily="monospace"
                  fontSize="6" fill={X.textMut}>
                  {mk.val}
                </text>
              </g>
            ))}

            {/* Sub-markings */}
            {Array.from({ length: markCount * 4 + 1 }, (_, i) => {
              if (i % 4 === 0) return null;
              const pct = i / (markCount * 4);
              const y = innerY + innerH - pct * innerH;
              return (
                <line key={i} x1={tubeX - 4} y1={y} x2={tubeX - 1} y2={y}
                  stroke={X.textMut} strokeWidth=".3" />
              );
            })}

            {/* Unit label */}
            <text x={tubeX + tubeW / 2} y={tubeY + tubeH + 14} textAnchor="middle"
              fontFamily="monospace" fontSize="5" fill={X.textMut}>meters</text>
          </svg>
        </div>

        {/* Right side readouts */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Mechanical readout */}
          <div style={{
            padding: '10px 12px', borderRadius: 8,
            background: n.metal, boxShadow: n.concave, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 4 }}>Current Depth</Lbl>
            <M style={{ fontSize: 28, fontWeight: 800, color: depthColor, display: 'block', letterSpacing: '-.02em' }}>
              {depth.toFixed(1)}
            </M>
            <M style={{ fontSize: 10, color: X.textMut }}>/ {maxDepth} m</M>
          </div>

          <div style={{
            padding: '8px 10px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Lbl>Depth %</Lbl>
              <M style={{ fontSize: 9, fontWeight: 700, color: depthColor }}>{(depthPct * 100).toFixed(0)}%</M>
            </div>
            <Prog value={animPct} color={depthColor} h={4} />
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{
              flex: 1, padding: '5px 6px', borderRadius: 6,
              background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
            }}>
              <Lbl style={{ marginBottom: 2 }}>Max</Lbl>
              <M style={{ fontSize: 10, fontWeight: 700, color: X.purple }}>{maxDepth}m</M>
            </div>
            <div style={{
              flex: 1, padding: '5px 6px', borderRadius: 6,
              background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
            }}>
              <Lbl style={{ marginBottom: 2 }}>Rate</Lbl>
              <M style={{ fontSize: 10, fontWeight: 700, color: X.indigo }}>
                {(depth > 200 ? '+' : '-')}{Math.abs(depth - 185).toFixed(0)} m/min
              </M>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// -- Ballast Tank -------------------------------------------------------------
export function BallastTank({ title = 'Ballast' }: { title?: string } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(50);
  const fillPct = useLive(65, 5);
  const [flooding, setFlooding] = useState(false);
  const [draining, setDraining] = useState(false);

  const fillColor = fillPct > 85 ? X.red : fillPct > 60 ? X.amber : X.teal;

  // Tank SVG dimensions
  const tankX = 15, tankY = 15, tankW = 120, tankH = 100;
  const innerX = tankX + 3, innerY = tankY + 3;
  const innerW = tankW - 6, innerH = tankH - 6;

  // Sine-wave liquid surface
  const waterBaseY = innerY + innerH - (fillPct / 100) * innerH;
  const amplitude = 3;
  const wavePoints: string[] = [];
  for (let x = 0; x <= innerW; x += 2) {
    const y = waterBaseY + Math.sin((tick * 0.1) + x * 0.05) * amplitude;
    wavePoints.push(`${innerX + x},${y}`);
  }
  // Close the path along bottom and back up
  const wavePath = `M ${innerX},${innerY + innerH} L ${wavePoints.join(' L ')} L ${innerX + innerW},${innerY + innerH} Z`;

  // Rising bubbles
  const bubbles = Array.from({ length: 4 }, (_, i) => ({
    cx: innerX + 15 + i * 28,
    cy: waterBaseY + innerH * 0.5 - ((tick * 1.5 + i * 22) % (innerH * 0.7)),
    r: 1.8 + (i % 2) * 0.8,
    o: 0.25 + (i % 3) * 0.1,
  }));

  return (
    <Card style={{ width: 350 }} glow={fillColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Dot c={fillColor} pulse s={6} />
          <Badge color={fillColor}>{fillPct.toFixed(0)}% Full</Badge>
        </div>
      </div>

      {/* Tank cross-section SVG */}
      <div style={{
        borderRadius: 8, background: n.metal, boxShadow: n.bezel,
        padding: 6, marginBottom: 10,
      }}>
        <svg viewBox="0 0 150 130" style={{ width: '100%', height: 130, display: 'block' }}>
          <defs>
            <linearGradient id="sub-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={X.indigo} stopOpacity=".25" />
              <stop offset="100%" stopColor={X.indigo} stopOpacity=".65" />
            </linearGradient>
          </defs>

          {/* Tank outline (rounded rect) */}
          <rect x={tankX} y={tankY} width={tankW} height={tankH} rx="10"
            fill={X.bgAlt} stroke={X.border} strokeWidth="1.5" />

          {/* Clip for water inside tank */}
          <clipPath id="sub-tank-clip">
            <rect x={innerX} y={innerY} width={innerW} height={innerH} rx="7" />
          </clipPath>

          {/* Water with sine-wave surface */}
          <g clipPath="url(#sub-tank-clip)">
            <path d={wavePath} fill="url(#sub-water)" />
          </g>

          {/* Rising bubbles */}
          <g clipPath="url(#sub-tank-clip)">
            {bubbles.map((b, i) => (
              <circle key={i} cx={b.cx} cy={b.cy} r={b.r}
                fill="#ffffff" opacity={b.o} />
            ))}
          </g>

          {/* Tank outline bevel */}
          <rect x={tankX} y={tankY} width={tankW} height={tankH} rx="10"
            fill="none" stroke="#ffffff08" strokeWidth="1" />

          {/* Fill % label inside tank */}
          <text x={tankX + tankW / 2} y={tankY + tankH / 2 + 4} textAnchor="middle"
            fontFamily="monospace" fontSize="14" fontWeight="800" fill={X.text} opacity=".7">
            {fillPct.toFixed(0)}%
          </text>
        </svg>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <Btn onClick={() => { setFlooding(!flooding); setDraining(false); }}
          color={X.indigo} active={flooding} ghost small style={{ flex: 1 }}>
          {flooding ? 'Flooding...' : 'Flood'}
        </Btn>
        <Btn onClick={() => { setDraining(!draining); setFlooding(false); }}
          color={X.amber} active={draining} ghost small style={{ flex: 1 }}>
          {draining ? 'Draining...' : 'Drain'}
        </Btn>
      </div>

      <Prog value={fillPct} color={fillColor} h={4} />
    </Card>
  );
}

// -- Torpedo Status -----------------------------------------------------------
export function TorpedoStatus({ title = 'Torpedo Bay' }: { title?: string } = {}) {
  const X = getX();
  const n = neo();

  type TubeState = 'Ready' | 'Loading' | 'Flooded' | 'Empty';
  const [tubes, setTubes] = useState<TubeState[]>(['Ready', 'Flooded', 'Loading', 'Empty']);

  const stateColor: Record<TubeState, string> = {
    Ready: X.teal,
    Loading: X.amber,
    Flooded: X.indigo,
    Empty: X.textMut,
  };

  const cycleState = (idx: number) => {
    const order: TubeState[] = ['Empty', 'Loading', 'Flooded', 'Ready'];
    setTubes(prev => {
      const next = [...prev];
      const cur = order.indexOf(next[idx]);
      next[idx] = order[(cur + 1) % order.length];
      return next;
    });
  };

  const floodPct: Record<TubeState, number> = {
    Ready: 100,
    Loading: 45,
    Flooded: 100,
    Empty: 0,
  };

  const readyCount = tubes.filter(t => t === 'Ready').length;

  return (
    <Card style={{ width: 350 }} glow={X.indigo}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{readyCount}/4 Ready</Badge>
      </div>

      <div style={{
        padding: '10px 10px', borderRadius: 8,
        background: n.metal, boxShadow: n.raised,
        marginBottom: 10,
      }}>
        <svg viewBox="0 0 290 160" style={{ width: '100%', height: 160, display: 'block' }}>
          <defs>
            <linearGradient id="sub-tube-metal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={X.surface} />
              <stop offset="40%" stopColor={X.bgAlt} />
              <stop offset="60%" stopColor={X.surface} />
              <stop offset="100%" stopColor={X.bgAlt} />
            </linearGradient>
            <radialGradient id="sub-rivet">
              <stop offset="0%" stopColor="#ffffff30" />
              <stop offset="50%" stopColor={X.textMut} stopOpacity=".4" />
              <stop offset="100%" stopColor={X.border} stopOpacity=".6" />
            </radialGradient>
          </defs>

          {tubes.map((state, i) => {
            const y = 8 + i * 38;
            const sc = stateColor[state];
            const fp = floodPct[state];
            // Hatch indicator: open = 0deg, closed = 90deg
            const hatchAngle = state === 'Empty' ? 0 : state === 'Loading' ? 45 : 90;

            return (
              <g key={i} onClick={() => cycleState(i)} style={{ cursor: 'pointer' }}>
                {/* Torpedo tube body */}
                <rect x={40} y={y} width={210} height={28} rx="14"
                  fill="url(#sub-tube-metal)" stroke={X.border} strokeWidth="1" />

                {/* Flooding progress inside tube */}
                <rect x={44} y={y + 4} width={Math.max(0, (fp / 100) * 200)} height={20} rx="10"
                  fill={sc + '25'}
                  style={{ transition: `width 500ms ${ease.sp}` }} />

                {/* Rivet dome-heads */}
                {[52, 90, 130, 170, 210, 240].map((rx, ri) => (
                  <circle key={ri} cx={rx} cy={y + 14} r="3"
                    fill="url(#sub-rivet)" stroke={X.border} strokeWidth=".3" />
                ))}

                {/* Hatch door indicator (left side) */}
                <g transform={`translate(22, ${y + 14})`}>
                  <circle r="10" fill={X.bgAlt} stroke={X.border} strokeWidth=".8" />
                  <line x1="0" y1="0" x2="0" y2="-8"
                    stroke={sc} strokeWidth="2" strokeLinecap="round"
                    style={{
                      transformOrigin: '0px 0px',
                      transform: `rotate(${hatchAngle}deg)`,
                      transition: `transform 400ms ${ease.sp}`,
                    }} />
                  <circle r="2" fill={sc} />
                </g>

                {/* Tube number */}
                <text x={6} y={y + 18} fontFamily="monospace" fontSize="8" fontWeight="700"
                  fill={X.textMut}>T{i + 1}</text>

                {/* Status label */}
                <text x={260} y={y + 18} textAnchor="end" fontFamily="monospace"
                  fontSize="7" fontWeight="600" fill={sc}>
                  {state}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Flooding progress bars */}
      <div style={{ display: 'flex', gap: 6 }}>
        {tubes.map((state, i) => (
          <div key={i} style={{
            flex: 1, padding: '4px 6px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
            animation: `fu 150ms ${ease.o} ${i * 30}ms both`,
          }}>
            <Lbl style={{ marginBottom: 2 }}>Tube {i + 1}</Lbl>
            <Prog value={floodPct[state]} color={stateColor[state]} h={3} />
          </div>
        ))}
      </div>
    </Card>
  );
}

// -- Sonar Display ------------------------------------------------------------
export function SonarDisplay({ title = 'Sonar' }: { title?: string } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(40);

  const green = '#33ff33';
  const cx = 100, cy = 100, maxR = 85;

  // Sweep angle (degrees)
  const sweepAngle = (tick * 6) % 360;
  const toRad = (d: number) => (d * Math.PI) / 180;

  // Sweep beam: triangular wedge
  const beamLen = maxR;
  const beamSpread = 8; // degrees
  const makeWedge = (angleDeg: number) => {
    const a1 = toRad(angleDeg - beamSpread / 2);
    const a2 = toRad(angleDeg + beamSpread / 2);
    const x1 = cx + beamLen * Math.cos(a1);
    const y1 = cy + beamLen * Math.sin(a1);
    const x2 = cx + beamLen * Math.cos(a2);
    const y2 = cy + beamLen * Math.sin(a2);
    return `M ${cx},${cy} L ${x1},${y1} A ${beamLen},${beamLen} 0 0 1 ${x2},${y2} Z`;
  };

  // Trailing copies for phosphor persistence
  const trailOpacities = [0.5, 0.35, 0.25, 0.18, 0.12, 0.08, 0.05, 0.02];

  // Random blips (pseudo-random based on modular arithmetic)
  const blips = Array.from({ length: 5 }, (_, i) => {
    const seed = (i * 73 + 17) % 100;
    const angle = (seed * 3.6) + (tick * 0.3 + i * 12) % 360;
    const dist = 20 + (seed % 60);
    const bx = cx + dist * Math.cos(toRad(angle));
    const by = cy + dist * Math.sin(toRad(angle));
    // Fade based on angular distance from sweep
    const angleDiff = ((sweepAngle - angle) % 360 + 360) % 360;
    const opacity = angleDiff < 60 ? 0.8 - (angleDiff / 60) * 0.7 : 0.05;
    return { x: bx, y: by, o: Math.max(0.02, opacity) };
  });

  // Range rings at 25/50/75/100%
  const rings = [0.25, 0.5, 0.75, 1.0];

  return (
    <Card style={{ width: 350 }} glow={green}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={green}><Dot c={green} pulse s={4} />Active</Badge>
      </div>

      <div style={{
        borderRadius: '50%', overflow: 'hidden',
        boxShadow: n.concave,
        margin: '0 auto',
        width: 200, height: 200,
      }}>
        <svg viewBox="0 0 200 200" style={{ width: 200, height: 200, display: 'block', background: '#0a1a0a' }}>
          {/* Range rings */}
          {rings.map((pct, i) => (
            <circle key={i} cx={cx} cy={cy} r={maxR * pct}
              fill="none" stroke={green} strokeWidth=".4" opacity=".2" />
          ))}

          {/* Cross hairs */}
          <line x1={cx - maxR} y1={cy} x2={cx + maxR} y2={cy}
            stroke={green} strokeWidth=".3" opacity=".15" />
          <line x1={cx} y1={cy - maxR} x2={cx} y2={cy + maxR}
            stroke={green} strokeWidth=".3" opacity=".15" />

          {/* Range labels */}
          {rings.map((pct, i) => (
            <text key={i} x={cx + 3} y={cy - maxR * pct + 7}
              fontFamily="monospace" fontSize="5" fill={green} opacity=".3">
              {Math.round(pct * 100)}%
            </text>
          ))}

          {/* Trailing sweep beams (phosphor persistence) */}
          {trailOpacities.map((op, i) => {
            const trailAngle = sweepAngle - (i + 1) * 4;
            return (
              <path key={i} d={makeWedge(trailAngle)}
                fill={green} opacity={op} />
            );
          })}

          {/* Main sweep beam */}
          <path d={makeWedge(sweepAngle)} fill={green} opacity=".6" />

          {/* Blips */}
          {blips.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r="2.5"
              fill={green} opacity={b.o}
              style={{ filter: b.o > 0.3 ? `drop-shadow(0 0 3px ${green})` : 'none' }} />
          ))}

          {/* Center dot */}
          <circle cx={cx} cy={cy} r="2" fill={green} opacity=".6" />
        </svg>
      </div>

      {/* Bottom stats */}
      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
        {([
          { label: 'Bearing', value: `${sweepAngle.toFixed(0)}\u00B0`, color: green },
          { label: 'Contacts', value: `${blips.filter(b => b.o > 0.2).length}`, color: X.amber },
          { label: 'Range', value: '100%', color: X.indigo },
          { label: 'Mode', value: 'Active', color: X.purple },
        ] as const).map((s, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center',
            animation: `fu 150ms ${ease.o} ${i * 20}ms both`,
          }}>
            <Lbl style={{ marginBottom: 2 }}>{s.label}</Lbl>
            <M style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.value}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// -- Hull Pressure ------------------------------------------------------------
export function HullPressure({ title = 'Hull Pressure', maxPSI = 600 }: { title?: string; maxPSI?: number } = {}) {
  const X = getX();
  const n = neo();
  const psi = useLive(380, 25);

  const psiPct = Math.min(1, Math.max(0, psi / maxPSI));
  const animPct = useAnim(psiPct * 100, 1200);
  const psiColor = psiPct > 0.85 ? X.red : psiPct > 0.70 ? X.amber : X.teal;
  const status = psiPct > 0.85 ? 'Critical' : psiPct > 0.70 ? 'Warning' : 'Normal';

  // Gauge: 270-degree sweep
  const sweepStart = 135;
  const sweepTotal = 270;
  const needleAngle = sweepStart + (animPct / 100) * sweepTotal;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const gcx = 60, gcy = 60, gr = 44;

  const arc = (startDeg: number, endDeg: number, radius: number) => {
    const s = toRad(startDeg);
    const e = toRad(endDeg);
    const x1 = gcx + radius * Math.cos(s);
    const y1 = gcy + radius * Math.sin(s);
    const x2 = gcx + radius * Math.cos(e);
    const y2 = gcy + radius * Math.sin(e);
    const large = endDeg - startDeg > 180 ? 1 : 0;
    return `M${x1},${y1} A${radius},${radius} 0 ${large} 1 ${x2},${y2}`;
  };

  const warningAngle = sweepStart + 0.70 * sweepTotal;
  const criticalAngle = sweepStart + 0.85 * sweepTotal;

  // Hull cross-section: cubic bezier that bows outward proportional to pressure
  const maxBow = 15;
  const bow = (psi / maxPSI) * maxBow;
  const hullPath = `M 10,10 C ${10 + bow},40 ${10 + bow},70 10,100`;
  const hullPathR = `M 80,10 C ${80 - bow},40 ${80 - bow},70 80,100`;

  return (
    <Card style={{ width: 350 }} glow={psiColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={psiColor}>{status}</Badge>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
        {/* Riveted bezel gauge */}
        <div style={{
          width: 140, height: 140, borderRadius: '50%',
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg viewBox="0 0 120 120" style={{ width: 120, height: 120, display: 'block' }}>
            <defs>
              <radialGradient id="sub-hull-rg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={X.surface} />
                <stop offset="100%" stopColor={X.bgAlt} />
              </radialGradient>
              <linearGradient id="sub-hull-needle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={psiColor} />
                <stop offset="100%" stopColor={psiColor} stopOpacity=".4" />
              </linearGradient>
            </defs>

            {/* Gauge face */}
            <circle cx={gcx} cy={gcy} r="50" fill="url(#sub-hull-rg)" />
            <circle cx={gcx} cy={gcy} r="50" fill="none" stroke={X.border} strokeWidth="1.5" />

            {/* Scale: normal zone */}
            <path d={arc(sweepStart, warningAngle, gr)} fill="none"
              stroke={X.teal + '30'} strokeWidth="5" strokeLinecap="round" />
            {/* Warning zone */}
            <path d={arc(warningAngle, criticalAngle, gr)} fill="none"
              stroke={X.amber + '40'} strokeWidth="5" strokeLinecap="round" />
            {/* Critical zone */}
            <path d={arc(criticalAngle, sweepStart + sweepTotal, gr)} fill="none"
              stroke={X.red + '40'} strokeWidth="5" strokeLinecap="round" />

            {/* Scale markings */}
            {Array.from({ length: 11 }, (_, i) => {
              const angle = toRad(sweepStart + (i / 10) * sweepTotal);
              const inner = gr - 6;
              const outer = gr + 1;
              const x1 = gcx + inner * Math.cos(angle);
              const y1 = gcy + inner * Math.sin(angle);
              const x2 = gcx + outer * Math.cos(angle);
              const y2 = gcy + outer * Math.sin(angle);
              const tx = gcx + (gr - 14) * Math.cos(angle);
              const ty = gcy + (gr - 14) * Math.sin(angle);
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

            {/* Needle */}
            <g style={{
              transformOrigin: `${gcx}px ${gcy}px`,
              transform: `rotate(${needleAngle}deg)`,
              transition: `transform 800ms ${ease.o}`,
            }}>
              <polygon
                points={`${gcx},${gcy - 2} ${gcx + gr - 8},${gcy} ${gcx},${gcy + 2}`}
                fill="url(#sub-hull-needle)" />
              <line x1={gcx} y1={gcy} x2={gcx - 8} y2={gcy}
                stroke={psiColor} strokeWidth="2" strokeLinecap="round" opacity=".4" />
            </g>

            {/* Center cap */}
            <circle cx={gcx} cy={gcy} r="5" fill={X.surface} stroke={X.border} strokeWidth="1" />
            <circle cx={gcx} cy={gcy} r="2.5" fill={psiColor} />

            {/* PSI readout */}
            <text x={gcx} y={gcy + 22} textAnchor="middle" fontFamily="monospace"
              fontSize="12" fontWeight="800" fill={psiColor}>
              {Math.round(psi)}
            </text>
            <text x={gcx} y={gcy + 30} textAnchor="middle" fontFamily="monospace"
              fontSize="5" fill={X.textMut}>PSI</text>
          </svg>
        </div>

        {/* Hull cross-section + readouts */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Hull deformation SVG */}
          <div style={{
            padding: '6px', borderRadius: 8,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          }}>
            <Lbl style={{ marginBottom: 4, textAlign: 'center' }}>Hull Cross-Section</Lbl>
            <svg viewBox="0 0 90 110" style={{ width: '100%', height: 80, display: 'block' }}>
              {/* Left hull wall */}
              <path d={hullPath}
                fill="none" stroke={psiColor} strokeWidth="2.5" strokeLinecap="round"
                style={{ transition: `d 800ms ${ease.o}` }} />
              {/* Right hull wall */}
              <path d={hullPathR}
                fill="none" stroke={psiColor} strokeWidth="2.5" strokeLinecap="round"
                style={{ transition: `d 800ms ${ease.o}` }} />
              {/* Top/bottom connectors */}
              <line x1="10" y1="10" x2="80" y2="10" stroke={psiColor} strokeWidth="1.5" opacity=".5" />
              <line x1="10" y1="100" x2="80" y2="100" stroke={psiColor} strokeWidth="1.5" opacity=".5" />
              {/* Pressure arrows */}
              <polygon points="0,55 6,51 6,59" fill={psiColor} opacity=".5" />
              <polygon points="90,55 84,51 84,59" fill={psiColor} opacity=".5" />
              {/* Bow amount label */}
              <text x="45" y="58" textAnchor="middle" fontFamily="monospace"
                fontSize="7" fill={X.textMut}>
                {bow.toFixed(1)}mm
              </text>
            </svg>
          </div>

          {/* Pressure readout */}
          <div style={{
            padding: '6px 8px', borderRadius: 6,
            background: n.metal, boxShadow: n.concave, textAlign: 'center',
          }}>
            <M style={{ fontSize: 18, fontWeight: 800, color: psiColor, display: 'block' }}>
              {Math.round(psi)} PSI
            </M>
            <M style={{ fontSize: 8, color: X.textMut }}>/ {maxPSI} max</M>
          </div>

          <Prog value={animPct} color={psiColor} h={4} />
        </div>
      </div>
    </Card>
  );
}

// -- Dive Plane ---------------------------------------------------------------
export function DivePlane({ title = 'Dive Planes' }: { title?: string } = {}) {
  const X = getX();
  const n = neo();
  const planeAngle = useLive(12, 5, 2000);

  // Spring easing for bubble position
  const animAngle = useAnim(planeAngle, 1400);
  const trimStatus = Math.abs(planeAngle) < 3 ? 'Level' : planeAngle > 0 ? 'Bow Down' : 'Bow Up';
  const trimColor = Math.abs(planeAngle) < 3 ? X.teal : Math.abs(planeAngle) > 15 ? X.red : X.amber;

  // Submarine side-view SVG dimensions
  const subLen = 260, subH = 50;
  const subCx = 150, subCy = 60;

  // Dive plane dimensions
  const planeLen = 22, planeH = 3;

  // Forward plane position
  const fwdX = subCx - 80, fwdY = subCy;
  // Aft plane position
  const aftX = subCx + 70, aftY = subCy;

  // Bubble level: position based on trim angle
  const bubbleTubeX = 50, bubbleTubeY = 115, bubbleTubeW = 200, bubbleTubeH = 14;
  const bubbleR = 5;
  const maxBubbleOffset = (bubbleTubeW / 2) - bubbleR - 4;
  const bubbleOffset = -(animAngle / 25) * maxBubbleOffset;
  const bubbleCx = bubbleTubeX + bubbleTubeW / 2 + bubbleOffset;

  return (
    <Card style={{ width: 350 }} glow={trimColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Badge color={trimColor}>{trimStatus}</Badge>
        </div>
      </div>

      <div style={{
        borderRadius: 8, background: n.metal, boxShadow: n.bezel,
        padding: 6, marginBottom: 10,
      }}>
        <svg viewBox="0 0 300 145" style={{ width: '100%', height: 145, display: 'block' }}>
          <defs>
            <linearGradient id="sub-hull-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={X.surface} stopOpacity=".9" />
              <stop offset="50%" stopColor={X.bgAlt} />
              <stop offset="100%" stopColor={X.surface} stopOpacity=".7" />
            </linearGradient>
            <linearGradient id="sub-plane-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={trimColor} stopOpacity=".8" />
              <stop offset="100%" stopColor={trimColor} stopOpacity=".4" />
            </linearGradient>
          </defs>

          {/* Submarine body (side view) - elliptical */}
          <ellipse cx={subCx} cy={subCy} rx={subLen / 2} ry={subH / 2}
            fill="url(#sub-hull-grad)" stroke={X.border} strokeWidth="1.2" />

          {/* Conning tower */}
          <rect x={subCx - 15} y={subCy - subH / 2 - 18} width={30} height={20} rx="4"
            fill={X.surface} stroke={X.border} strokeWidth="1" />
          <rect x={subCx - 10} y={subCy - subH / 2 - 22} width={20} height={6} rx="3"
            fill={X.bgAlt} stroke={X.border} strokeWidth=".6" />

          {/* Forward dive plane */}
          <g transform={`translate(${fwdX}, ${fwdY})`}>
            <g style={{
              transformOrigin: '0px 0px',
              transform: `rotate(${animAngle}deg)`,
              transition: `transform 1200ms ${ease.sp}`,
            }}>
              <rect x={-planeLen} y={-planeH / 2} width={planeLen * 2} height={planeH} rx="1.5"
                fill="url(#sub-plane-grad)" stroke={trimColor} strokeWidth=".8" />
              {/* Pivot indicator */}
              <circle r="3" fill={X.surface} stroke={trimColor} strokeWidth=".8" />
            </g>
            <text x="0" y={-12} textAnchor="middle" fontFamily="monospace"
              fontSize="5" fill={X.textMut}>FWD</text>
          </g>

          {/* Aft dive plane */}
          <g transform={`translate(${aftX}, ${aftY})`}>
            <g style={{
              transformOrigin: '0px 0px',
              transform: `rotate(${animAngle}deg)`,
              transition: `transform 1200ms ${ease.sp}`,
            }}>
              <rect x={-planeLen} y={-planeH / 2} width={planeLen * 2} height={planeH} rx="1.5"
                fill="url(#sub-plane-grad)" stroke={trimColor} strokeWidth=".8" />
              <circle r="3" fill={X.surface} stroke={trimColor} strokeWidth=".8" />
            </g>
            <text x="0" y={-12} textAnchor="middle" fontFamily="monospace"
              fontSize="5" fill={X.textMut}>AFT</text>
          </g>

          {/* Propeller (aft) */}
          <g transform={`translate(${subCx + subLen / 2 - 5}, ${subCy})`}>
            <line x1="0" y1="-10" x2="0" y2="10" stroke={X.border} strokeWidth="1.5" />
            <line x1="-3" y1="-8" x2="3" y2="8" stroke={X.textMut} strokeWidth="1" />
            <line x1="3" y1="-8" x2="-3" y2="8" stroke={X.textMut} strokeWidth="1" />
          </g>

          {/* Angle readout on hull */}
          <text x={subCx} y={subCy + 5} textAnchor="middle" fontFamily="monospace"
            fontSize="10" fontWeight="700" fill={trimColor}>
            {planeAngle > 0 ? '+' : ''}{planeAngle.toFixed(1)}&deg;
          </text>

          {/* Bubble level tube */}
          <rect x={bubbleTubeX} y={bubbleTubeY} width={bubbleTubeW} height={bubbleTubeH} rx="7"
            fill={X.bgAlt} stroke={X.border} strokeWidth="1" />

          {/* Center marking on tube */}
          <line x1={bubbleTubeX + bubbleTubeW / 2} y1={bubbleTubeY + 1}
            x2={bubbleTubeX + bubbleTubeW / 2} y2={bubbleTubeY + bubbleTubeH - 1}
            stroke={X.teal} strokeWidth=".6" opacity=".4" />
          {/* Side markings */}
          {[-30, -15, 15, 30].map((off, i) => (
            <line key={i}
              x1={bubbleTubeX + bubbleTubeW / 2 + off} y1={bubbleTubeY + 2}
              x2={bubbleTubeX + bubbleTubeW / 2 + off} y2={bubbleTubeY + bubbleTubeH - 2}
              stroke={X.textMut} strokeWidth=".3" opacity=".4" />
          ))}

          {/* Bubble */}
          <circle cx={bubbleCx} cy={bubbleTubeY + bubbleTubeH / 2} r={bubbleR}
            fill={X.teal + '40'} stroke={X.teal} strokeWidth=".8"
            style={{ transition: `cx 1200ms ${ease.sp}` }}>
          </circle>
          {/* Bubble highlight */}
          <circle cx={bubbleCx - 1.5} cy={bubbleTubeY + bubbleTubeH / 2 - 1.5} r="1.5"
            fill="#ffffff20"
            style={{ transition: `cx 1200ms ${ease.sp}` }} />

          {/* Tube label */}
          <text x={bubbleTubeX + bubbleTubeW / 2} y={bubbleTubeY + bubbleTubeH + 10}
            textAnchor="middle" fontFamily="monospace" fontSize="5" fill={X.textMut}>
            BUBBLE LEVEL
          </text>
        </svg>
      </div>

      {/* Bottom readouts */}
      <div style={{ display: 'flex', gap: 6 }}>
        {([
          { label: 'Angle', value: `${planeAngle > 0 ? '+' : ''}${planeAngle.toFixed(1)}\u00B0`, color: trimColor },
          { label: 'Trim', value: trimStatus, color: trimColor },
          { label: 'FWD Plane', value: `${animAngle.toFixed(1)}\u00B0`, color: X.indigo },
          { label: 'AFT Plane', value: `${animAngle.toFixed(1)}\u00B0`, color: X.purple },
        ] as const).map((s, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center',
            animation: `fu 150ms ${ease.o} ${i * 20}ms both`,
          }}>
            <Lbl style={{ marginBottom: 2 }}>{s.label}</Lbl>
            <M style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.value}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}
