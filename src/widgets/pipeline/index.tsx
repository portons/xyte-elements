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

/** Utility: describe an SVG arc path */
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// ── Pipe Segment ────────────────────────────────────────────────────
export function PipeSegment({ title = 'Pipe Segment', flowRate = 42.5, pressurePSI = 65, direction = 'right' as 'left' | 'right' }: { title?: string; flowRate?: number; pressurePSI?: number; direction?: 'left' | 'right' }) {
  const X = getX();
  const n = neo();
  const tick = useTick(80);
  const pressAnim = useAnim(Math.min(pressurePSI / 120, 1) * 100, 800);

  const pColor = pressurePSI > 90 ? X.red : pressurePSI > 70 ? X.amber : X.teal;
  const particleCount = 8;
  const pipeY = 40;
  const pipeH = 24;

  return (
    <Card style={{ width: 350 }} glow={X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={pColor}>{pressurePSI.toFixed(0)} PSI</Badge>
      </div>

      {/* Pipe visualization */}
      <div style={{ marginBottom: 12 }}>
        <svg viewBox="0 0 310 80" style={{ width: '100%', height: 80, display: 'block' }}>
          <defs>
            <linearGradient id="pipe-body-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={X.surface} />
              <stop offset="40%" stopColor={X.bgAlt} />
              <stop offset="100%" stopColor={X.bg} />
            </linearGradient>
            <clipPath id="pipe-clip">
              <rect x="20" y={pipeY - pipeH / 2} width="270" height={pipeH} rx="6" />
            </clipPath>
          </defs>

          {/* Pipe outer shell */}
          <rect x="10" y={pipeY - pipeH / 2 - 3} width="290" height={pipeH + 6} rx="9" fill={X.surface} opacity=".3" />
          <rect x="15" y={pipeY - pipeH / 2 - 1} width="280" height={pipeH + 2} rx="7"
            fill="url(#pipe-body-grad)" stroke={X.borderLight} strokeWidth=".5" />

          {/* Inner pipe channel */}
          <rect x="20" y={pipeY - pipeH / 2 + 2} width="270" height={pipeH - 4} rx="4"
            fill={X.bg} opacity=".6" />

          {/* Flow particles */}
          <g clipPath="url(#pipe-clip)">
            {Array.from({ length: particleCount }, (_, i) => {
              const spacing = 310 / particleCount;
              const dir = direction === 'right' ? 1 : -1;
              const rawX = (i * spacing + tick * 4 * dir) % 310;
              const px = rawX < 0 ? rawX + 310 : rawX;
              const yOff = Math.sin(i * 1.8 + tick * 0.3) * 4;
              return (
                <circle key={i} cx={px} cy={pipeY + yOff} r={3}
                  fill={X.teal} opacity={0.5 + Math.sin(i + tick * 0.2) * 0.3} />
              );
            })}
          </g>

          {/* Flanges */}
          <rect x="8" y={pipeY - pipeH / 2 - 5} width="8" height={pipeH + 10} rx="2"
            fill={X.surface} stroke={X.borderLight} strokeWidth=".5" />
          <rect x="294" y={pipeY - pipeH / 2 - 5} width="8" height={pipeH + 10} rx="2"
            fill={X.surface} stroke={X.borderLight} strokeWidth=".5" />

          {/* Direction arrow */}
          <polygon
            points={direction === 'right' ? '260,40 275,33 275,47' : '50,40 35,33 35,47'}
            fill={X.teal} opacity=".6" />
        </svg>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Flow Rate</Lbl>
          <M style={{ fontSize: 11, fontWeight: 700, color: X.teal }}>{flowRate.toFixed(1)} m\u00B3/h</M>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Lbl style={{ marginBottom: 2 }}>Pressure</Lbl>
          <div style={{ width: 80 }}><Prog value={pressAnim} color={pColor} h={3} /></div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>Direction</Lbl>
          <M style={{ fontSize: 11, fontWeight: 700, color: X.purple }}>{direction === 'right' ? '\u2192 FWD' : '\u2190 REV'}</M>
        </div>
      </div>
    </Card>
  );
}

// ── Leak Detector ───────────────────────────────────────────────────
export function LeakDetector({ title = 'Leak Detector', anomalyLevel = 0.3, threshold = 0.6, status = 'normal' as 'normal' | 'warning' | 'alarm' }: { title?: string; anomalyLevel?: number; threshold?: number; status?: 'normal' | 'warning' | 'alarm' }) {
  const X = getX();
  const n = neo();
  const tick = useTick(120);

  const sc: Record<string, string> = { normal: X.teal, warning: X.amber, alarm: X.red };
  const statusColor = sc[status] ?? X.teal;
  const anomalyPct = useAnim(Math.min(anomalyLevel / 1.0, 1) * 100, 700);

  // Generate waveform points
  const wavePoints = 60;
  const svgW = 300, svgH = 80;
  const baseline = svgH / 2;
  const thresholdY = baseline - (threshold / 1.0) * (baseline - 8);
  const thresholdYLow = baseline + (threshold / 1.0) * (baseline - 8);

  const wavePath = Array.from({ length: wavePoints }, (_, i) => {
    const x = (i / (wavePoints - 1)) * svgW;
    const freq1 = Math.sin((i * 0.3) + tick * 0.15) * 12;
    const freq2 = Math.sin((i * 0.7) + tick * 0.08) * 6;
    const anomalyBump = (i > wavePoints * 0.35 && i < wavePoints * 0.65)
      ? Math.sin((i - wavePoints * 0.35) * 0.15) * anomalyLevel * 30
      : 0;
    const y = baseline + freq1 + freq2 + anomalyBump;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');

  return (
    <Card style={{ width: 350 }} glow={statusColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={statusColor}><Dot c={statusColor} pulse={status !== 'normal'} s={4} />{status.toUpperCase()}</Badge>
      </div>

      {/* Waveform */}
      <div style={{
        borderRadius: X.rs, background: X.bg, boxShadow: n.concave,
        padding: 8, marginBottom: 12,
      }}>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', height: 80, display: 'block' }}>
          {/* Threshold band */}
          <rect x="0" y={thresholdY} width={svgW} height={thresholdYLow - thresholdY}
            fill={X.teal} opacity=".06" />
          <line x1="0" y1={thresholdY} x2={svgW} y2={thresholdY}
            stroke={X.red} strokeWidth=".5" strokeDasharray="4 2" opacity=".5" />
          <line x1="0" y1={thresholdYLow} x2={svgW} y2={thresholdYLow}
            stroke={X.red} strokeWidth=".5" strokeDasharray="4 2" opacity=".5" />

          {/* Anomaly zone highlight */}
          <rect x={svgW * 0.35} y="0" width={svgW * 0.3} height={svgH}
            fill={X.red} opacity={anomalyLevel > threshold ? 0.08 : 0} />

          {/* Signal waveform */}
          <path d={wavePath} fill="none" stroke={statusColor} strokeWidth="1.5" strokeLinecap="round" />

          {/* Labels */}
          <text x="4" y={thresholdY - 2} fontFamily={X.m} fontSize="5" fill={X.red} opacity=".7">THRESH</text>
        </svg>
      </div>

      {/* Bottom stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Anomaly Level</Lbl>
          <M style={{ fontSize: 11, fontWeight: 700, color: statusColor }}>{(anomalyLevel * 100).toFixed(0)}%</M>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Lbl style={{ marginBottom: 2 }}>Threshold</Lbl>
          <M style={{ fontSize: 11, fontWeight: 700, color: X.red }}>{(threshold * 100).toFixed(0)}%</M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>Margin</Lbl>
          <M style={{ fontSize: 11, fontWeight: 700, color: anomalyLevel > threshold ? X.red : X.teal }}>
            {((threshold - anomalyLevel) * 100).toFixed(0)}%
          </M>
        </div>
      </div>
    </Card>
  );
}

// ── Pump Station ────────────────────────────────────────────────────
export function PumpStation({ title = 'Pump Station', rpmValue = 1450, flowGPM = 320, inletPSI = 15, outletPSI = 65 }: { title?: string; rpmValue?: number; flowGPM?: number; inletPSI?: number; outletPSI?: number }) {
  const X = getX();
  const n = neo();
  const tick = useTick(60);

  const rpmPct = Math.min(rpmValue / 3000, 1);
  const rpmColor = rpmValue > 2400 ? X.red : rpmValue > 1800 ? X.amber : X.teal;
  const rpmAnim = useAnim(rpmPct * 100, 800);
  const bladeAngle = tick * 18;

  const pressureDiff = outletPSI - inletPSI;
  const pressColor = pressureDiff > 60 ? X.amber : X.teal;

  // Mini gauge helper
  const miniGauge = (value: number, max: number, label: string, color: string) => {
    const pct = Math.min(value / max, 1);
    const arcR = 18, cx = 22, cy = 22;
    return (
      <svg viewBox="0 0 44 44" style={{ width: 44, height: 44 }}>
        <path d={describeArc(cx, cy, arcR, -120, 120)} fill="none" stroke={X.borderLight} strokeWidth="3" strokeLinecap="round" />
        <path d={describeArc(cx, cy, arcR, -120, -120 + pct * 240)} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" />
        <text x={cx} y={cy - 1} textAnchor="middle" fontFamily={X.m} fontSize="7" fontWeight="800" fill={color}>{Math.round(value)}</text>
        <text x={cx} y={cy + 6} textAnchor="middle" fontFamily={X.m} fontSize="3.5" fill={X.textMut}>{label}</text>
      </svg>
    );
  };

  return (
    <Card style={{ width: 350 }} glow={X.purple}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={rpmColor}>{rpmValue} RPM</Badge>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 14 }}>
        {/* Spinning impeller */}
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: X.bg, boxShadow: n.concave,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 60 60" style={{ width: 80, height: 80 }}>
              <g transform={`rotate(${bladeAngle}, 30, 30)`}>
                {/* 6 impeller blades */}
                {Array.from({ length: 6 }, (_, i) => {
                  const angle = i * 60;
                  return (
                    <g key={i} transform={`rotate(${angle}, 30, 30)`}>
                      <path d="M30,30 L30,10 Q34,14 32,22 Z" fill={X.purple} opacity=".7" />
                    </g>
                  );
                })}
                <circle cx="30" cy="30" r="5" fill={X.surface} stroke={X.borderLight} strokeWidth=".5" />
                <circle cx="30" cy="30" r="2" fill={X.purple} />
              </g>
            </svg>
          </div>
        </div>

        {/* Mini gauges */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {miniGauge(inletPSI, 80, 'IN', X.indigo)}
            <div><Lbl>Inlet</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.indigo }}>{inletPSI} PSI</M></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {miniGauge(outletPSI, 120, 'OUT', pressColor)}
            <div><Lbl>Outlet</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: pressColor }}>{outletPSI} PSI</M></div>
          </div>
        </div>
      </div>

      {/* Bottom stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${X.borderLight}`, paddingTop: 8 }}>
        <div><Lbl style={{ marginBottom: 2 }}>Flow</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.teal }}>{flowGPM} GPM</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>RPM</Lbl>
          <div style={{ width: 60 }}><Prog value={rpmAnim} color={rpmColor} h={3} /></div>
        </div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>\u0394P</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: pressColor }}>{pressureDiff} PSI</M></div>
      </div>
    </Card>
  );
}

// ── Valve Control ───────────────────────────────────────────────────
export function ValveControl({ title = 'Valve Control', position = 75, state = 'partial' as 'open' | 'closed' | 'partial' }: { title?: string; position?: number; state?: 'open' | 'closed' | 'partial' }) {
  const X = getX();
  const n = neo();
  const posAnim = useAnim(position, 600);

  const sc: Record<string, string> = { open: X.teal, closed: X.red, partial: X.amber };
  const stateColor = sc[state] ?? X.amber;
  const wheelRotation = (position / 100) * 270;

  return (
    <Card style={{ width: 350 }} glow={stateColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={stateColor}>{state.toUpperCase()} {position}%</Badge>
      </div>

      {/* Valve wheel */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        <div style={{
          width: 140, height: 140, borderRadius: '50%',
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 120, height: 120, borderRadius: '50%',
            background: X.bg, boxShadow: n.concave,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 80 80" style={{ width: 110, height: 110 }}>
              <g transform={`rotate(${wheelRotation}, 40, 40)`}>
                {/* Wheel rim */}
                <circle cx="40" cy="40" r="30" fill="none" stroke={stateColor} strokeWidth="4" opacity=".3" />
                <circle cx="40" cy="40" r="28" fill="none" stroke={stateColor} strokeWidth="1" opacity=".6" />

                {/* Spokes */}
                {Array.from({ length: 8 }, (_, i) => {
                  const angle = i * 45 * Math.PI / 180;
                  return (
                    <line key={i}
                      x1={40 + Math.cos(angle) * 8} y1={40 + Math.sin(angle) * 8}
                      x2={40 + Math.cos(angle) * 28} y2={40 + Math.sin(angle) * 28}
                      stroke={stateColor} strokeWidth="2" strokeLinecap="round" opacity=".5" />
                  );
                })}

                {/* Handle knobs at rim */}
                {Array.from({ length: 8 }, (_, i) => {
                  const angle = i * 45 * Math.PI / 180;
                  return (
                    <circle key={i}
                      cx={40 + Math.cos(angle) * 30} cy={40 + Math.sin(angle) * 30}
                      r="3" fill={X.surface} stroke={stateColor} strokeWidth=".5" />
                  );
                })}

                {/* Center hub */}
                <circle cx="40" cy="40" r="8" fill={X.surface} stroke={X.borderLight} strokeWidth=".5" />
                <circle cx="40" cy="40" r="3" fill={stateColor} />
              </g>

              {/* Position indicator (does not rotate) */}
              <text x="40" y="40" textAnchor="middle" dominantBaseline="central"
                fontFamily={X.m} fontSize="0" fill="transparent">{/* spacer */}</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Position bar */}
      <div style={{ marginBottom: 10 }}>
        <Lbl style={{ marginBottom: 4 }}>Position</Lbl>
        <Prog value={posAnim} color={stateColor} h={4} />
      </div>

      {/* Bottom stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>State</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: stateColor }}>{state.toUpperCase()}</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Opening</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.text }}>{position}%</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Type</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.purple }}>Gate Valve</M></div>
      </div>
    </Card>
  );
}

// ── Corrosion Monitor ───────────────────────────────────────────────
export function CorrosionMonitor({ title = 'Corrosion Monitor', wallThicknessMM = 8.2, minThreshold = 5.0 }: { title?: string; wallThicknessMM?: number; minThreshold?: number }) {
  const X = getX();
  const n = neo();
  const thicknessAnim = useAnim(wallThicknessMM, 700);

  const maxThickness = 12;
  const pct = wallThicknessMM / maxThickness;
  const thicknessColor = wallThicknessMM < minThreshold ? X.red : wallThicknessMM < minThreshold * 1.3 ? X.amber : X.teal;

  // Simulated historical data (trending down slightly)
  const dataPoints = 20;
  const svgW = 280, svgH = 90;
  const padL = 28, padR = 8, padT = 8, padB = 20;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;

  const trendData = Array.from({ length: dataPoints }, (_, i) => {
    const base = maxThickness - (i / dataPoints) * (maxThickness - wallThicknessMM);
    const noise = Math.sin(i * 2.1) * 0.3 + Math.cos(i * 0.7) * 0.2;
    return Math.max(0, base + noise);
  });

  const toX = (i: number) => padL + (i / (dataPoints - 1)) * chartW;
  const toY = (v: number) => padT + (1 - v / maxThickness) * chartH;

  const linePath = trendData.map((v, i) => `${i === 0 ? 'M' : 'L'}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
  const areaPath = linePath + ` L${toX(dataPoints - 1).toFixed(1)},${toY(0).toFixed(1)} L${toX(0).toFixed(1)},${toY(0).toFixed(1)} Z`;

  const threshY = toY(minThreshold);

  return (
    <Card style={{ width: 350 }} glow={thicknessColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={thicknessColor}>{wallThicknessMM.toFixed(1)} mm</Badge>
      </div>

      {/* Trend chart */}
      <div style={{
        borderRadius: X.rs, background: X.bg, boxShadow: n.concave,
        padding: 6, marginBottom: 12,
      }}>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', height: 90, display: 'block' }}>
          {/* Y-axis labels */}
          {[0, 4, 8, 12].map(v => (
            <text key={v} x={padL - 4} y={toY(v)} textAnchor="end" dominantBaseline="central"
              fontFamily={X.m} fontSize="4" fill={X.textMut}>{v}</text>
          ))}

          {/* Grid lines */}
          {[0, 4, 8, 12].map(v => (
            <line key={v} x1={padL} y1={toY(v)} x2={svgW - padR} y2={toY(v)}
              stroke={X.borderLight} strokeWidth=".3" />
          ))}

          {/* Danger threshold */}
          <line x1={padL} y1={threshY} x2={svgW - padR} y2={threshY}
            stroke={X.red} strokeWidth="1" strokeDasharray="4 2" />
          <text x={svgW - padR + 2} y={threshY} dominantBaseline="central"
            fontFamily={X.m} fontSize="3.5" fill={X.red}>MIN</text>

          {/* Danger zone fill */}
          <rect x={padL} y={threshY} width={chartW} height={toY(0) - threshY}
            fill={X.red} opacity=".04" />

          {/* Area fill */}
          <path d={areaPath} fill={thicknessColor} opacity=".1" />

          {/* Trend line */}
          <path d={linePath} fill="none" stroke={thicknessColor} strokeWidth="1.5" strokeLinecap="round" />

          {/* Current value dot */}
          <circle cx={toX(dataPoints - 1)} cy={toY(trendData[dataPoints - 1])} r="3"
            fill={thicknessColor} stroke={X.bg} strokeWidth="1" />

          {/* X-axis label */}
          <text x={padL + chartW / 2} y={svgH - 2} textAnchor="middle"
            fontFamily={X.m} fontSize="3.5" fill={X.textMut}>Time (months)</text>
        </svg>
      </div>

      {/* Bottom stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Wall Thickness</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: thicknessColor }}>{wallThicknessMM.toFixed(1)} mm</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Min Threshold</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.red }}>{minThreshold.toFixed(1)} mm</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Margin</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: thicknessColor }}>{(wallThicknessMM - minThreshold).toFixed(1)} mm</M></div>
      </div>
    </Card>
  );
}

// ── Pipe Network ────────────────────────────────────────────────────
export function PipeNetwork({ title = 'Pipe Network', nodeCount = 6 }: { title?: string; nodeCount?: number }) {
  const X = getX();
  const n = neo();
  const tick = useTick(200);

  const maxNodes = Math.min(Math.max(nodeCount, 3), 8);

  // Pre-defined node positions for aesthetic layout
  const allPositions = [
    { x: 40, y: 25 }, { x: 160, y: 20 }, { x: 280, y: 30 },
    { x: 90, y: 70 }, { x: 200, y: 65 }, { x: 270, y: 75 },
    { x: 50, y: 110 }, { x: 180, y: 115 },
  ];

  const nodes = allPositions.slice(0, maxNodes);

  // Pre-defined connections
  const allEdges = [
    [0, 1], [1, 2], [0, 3], [1, 4], [2, 5],
    [3, 4], [4, 5], [3, 6], [4, 7], [6, 7],
  ].filter(([a, b]) => a < maxNodes && b < maxNodes);

  const nodeLabels = ['S1', 'J1', 'S2', 'J2', 'J3', 'S3', 'T1', 'T2'];
  const nodeTypes: Record<string, string> = { S: X.teal, J: X.purple, T: X.indigo };
  const getNodeColor = (label: string) => nodeTypes[label[0]] ?? X.teal;

  const activeEdge = tick % allEdges.length;

  return (
    <Card style={{ width: 350 }} glow={X.indigo}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>{maxNodes} Nodes</Badge>
      </div>

      {/* Network graph */}
      <div style={{
        borderRadius: X.rs, background: X.bg, boxShadow: n.concave,
        padding: 8, marginBottom: 12,
      }}>
        <svg viewBox="0 0 310 140" style={{ width: '100%', height: 130, display: 'block' }}>
          {/* Pipes (edges) */}
          {allEdges.map(([a, b], i) => {
            const na = nodes[a], nb = nodes[b];
            const isActive = i === activeEdge;
            // Direction arrow midpoint
            const mx = (na.x + nb.x) / 2;
            const my = (na.y + nb.y) / 2;
            const angle = Math.atan2(nb.y - na.y, nb.x - na.x);
            const arrowSize = 4;
            return (
              <g key={i}>
                <line x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                  stroke={isActive ? X.teal : X.borderLight}
                  strokeWidth={isActive ? 2 : 1}
                  opacity={isActive ? 1 : 0.5}
                  strokeLinecap="round" />
                {/* Flow arrow */}
                <polygon
                  points={`${mx + Math.cos(angle) * arrowSize},${my + Math.sin(angle) * arrowSize} ${mx + Math.cos(angle + 2.5) * arrowSize},${my + Math.sin(angle + 2.5) * arrowSize} ${mx + Math.cos(angle - 2.5) * arrowSize},${my + Math.sin(angle - 2.5) * arrowSize}`}
                  fill={isActive ? X.teal : X.textMut}
                  opacity={isActive ? 0.8 : 0.3} />
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((pos, i) => {
            const c = getNodeColor(nodeLabels[i]);
            return (
              <g key={i}>
                <circle cx={pos.x} cy={pos.y} r="12" fill={X.bgAlt} stroke={c} strokeWidth="1.5"
                  opacity={i === (tick % maxNodes) ? 1 : 0.7} />
                <circle cx={pos.x} cy={pos.y} r="4" fill={c} opacity=".5" />
                <text x={pos.x} y={pos.y + 0.5} textAnchor="middle" dominantBaseline="central"
                  fontFamily={X.m} fontSize="5" fontWeight="700" fill={X.text}>
                  {nodeLabels[i]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Dot c={X.teal} s={5} /><M style={{ fontSize: 8, color: X.textMut }}>Source</M></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Dot c={X.purple} s={5} /><M style={{ fontSize: 8, color: X.textMut }}>Junction</M></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Dot c={X.indigo} s={5} /><M style={{ fontSize: 8, color: X.textMut }}>Terminal</M></div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <M style={{ fontSize: 9, fontWeight: 700, color: X.teal }}>{allEdges.length} Pipes</M>
        </div>
      </div>
    </Card>
  );
}
