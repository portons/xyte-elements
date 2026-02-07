import { useState } from 'react';
import { getX, ease, Card, Badge, Prog, Lbl, M, Dot } from '../primitives';
import { useAnim, useLive } from '../hooks';

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

// ── Water Flow Rate ───────────────────────────────────────────────
export function WaterFlowRate({ title = 'Flow Rate', flowUnit = 'L/min' }: { title?: string; flowUnit?: string } = {}) {
  const X = getX();
  const n = neo();

  const flowBase = 42.5;
  const flowMax = 80;
  const flow = useLive(flowBase, 6, 1400);
  const needleAngle = useAnim(Math.min(Math.max(flow / flowMax, 0), 1) * 240 - 120, 900);

  const ticks = Array.from({ length: 9 }, (_, i) => i);
  const arcRadius = 38;
  const cx = 50, cy = 52;

  const flowColor = flow > 65 ? X.red : flow > 50 ? X.amber : X.teal;

  return (
    <Card style={{ width: 350 }} glow={X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={flowColor}><Dot c={flowColor} pulse s={4} />Live</Badge>
      </div>

      {/* Gauge housing */}
      <div style={{
        display: 'flex', justifyContent: 'center', marginBottom: 12,
      }}>
        <div style={{
          width: 160, height: 160, borderRadius: '50%',
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 140, height: 140, borderRadius: '50%',
            boxShadow: n.concave,
            background: X.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <svg viewBox="0 0 100 100" style={{ width: 130, height: 130, display: 'block' }}>
              <defs>
                <linearGradient id="water-flow-arc" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor={X.teal} />
                  <stop offset="70%" stopColor={X.amber} />
                  <stop offset="100%" stopColor={X.red} />
                </linearGradient>
              </defs>

              {/* Dial arc (240 degrees, from -120 to +120) */}
              <path
                d={describeArc(cx, cy, arcRadius, -120, 120)}
                fill="none" stroke={X.borderLight} strokeWidth="3" strokeLinecap="round"
              />
              <path
                d={describeArc(cx, cy, arcRadius, -120, 120)}
                fill="none" stroke="url(#water-flow-arc)" strokeWidth="3" strokeLinecap="round"
                opacity=".5"
              />

              {/* Tick marks */}
              {ticks.map(i => {
                const angle = -120 + (i / 8) * 240;
                const rad = (angle - 90) * Math.PI / 180;
                const x1 = cx + Math.cos(rad) * (arcRadius - 4);
                const y1 = cy + Math.sin(rad) * (arcRadius - 4);
                const x2 = cx + Math.cos(rad) * (arcRadius + 1);
                const y2 = cy + Math.sin(rad) * (arcRadius + 1);
                const lx = cx + Math.cos(rad) * (arcRadius - 10);
                const ly = cy + Math.sin(rad) * (arcRadius - 10);
                const val = Math.round((i / 8) * flowMax);
                return (
                  <g key={i}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={X.textMut} strokeWidth=".8" />
                    <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central"
                      fontFamily={X.m} fontSize="4.5" fill={X.textMut}>{val}</text>
                  </g>
                );
              })}

              {/* Needle */}
              <g transform={`rotate(${needleAngle}, ${cx}, ${cy})`}>
                <line x1={cx} y1={cy} x2={cx} y2={cy - arcRadius + 6}
                  stroke={X.red} strokeWidth="1.5" strokeLinecap="round" />
                <circle cx={cx} cy={cy} r="3" fill={X.surface} stroke={X.borderLight} strokeWidth=".5" />
              </g>

              {/* Center readout */}
              <text x={cx} y={cy + 14} textAnchor="middle" fontFamily={X.m}
                fontSize="10" fontWeight="800" fill={flowColor}>
                {Math.max(0, flow).toFixed(1)}
              </text>
              <text x={cx} y={cy + 20} textAnchor="middle" fontFamily={X.m}
                fontSize="4" fill={X.textMut}>
                {flowUnit}
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Current</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: flowColor }}>{Math.max(0, flow).toFixed(1)} {flowUnit}</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Max Rating</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{flowMax} {flowUnit}</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Status</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>Normal</M></div>
      </div>
    </Card>
  );
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

// ── Chemical Dosing ───────────────────────────────────────────────
export function ChemicalDosing({ title = 'Chemical Dosing', phTarget = 7.0 }: { title?: string; phTarget?: number } = {}) {
  const X = getX();
  const n = neo();

  const phActual = useLive(phTarget, 0.4, 2000);
  const chlorine = useLive(1.2, 0.15, 2500);
  const fluoride = useLive(0.7, 0.08, 3000);

  const phDelta = Math.abs(phActual - phTarget);
  const phColor = phDelta > 0.5 ? X.red : phDelta > 0.25 ? X.amber : X.teal;

  // Knob rotation mapped to pH: 0-14 pH maps to 0-270 degrees
  const knobAngle = useAnim((phActual / 14) * 270, 800);

  const leds: { label: string; value: number; unit: string; ok: boolean; color: string }[] = [
    { label: 'pH', value: phActual, unit: '', ok: phDelta < 0.3, color: phColor },
    { label: 'Cl\u2082', value: chlorine, unit: 'ppm', ok: chlorine >= 0.8 && chlorine <= 1.5, color: chlorine >= 0.8 && chlorine <= 1.5 ? X.teal : X.amber },
    { label: 'F\u207B', value: fluoride, unit: 'ppm', ok: fluoride >= 0.5 && fluoride <= 1.0, color: fluoride >= 0.5 && fluoride <= 1.0 ? X.teal : X.amber },
  ];

  return (
    <Card style={{ width: 350 }} glow={X.purple}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={phColor}>pH {phActual.toFixed(1)}</Badge>
      </div>

      {/* Rotary knob */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        <div style={{ position: 'relative' }}>
          {/* Knob dial labels */}
          <svg viewBox="0 0 100 100" style={{ width: 120, height: 120, position: 'absolute', top: -5, left: -5 }}>
            {[0, 2, 4, 6, 7, 8, 10, 12, 14].map((v, i) => {
              const angle = (v / 14) * 270 - 135;
              const pt = polarToCartesian(50, 50, 46, angle);
              return (
                <text key={i} x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="central"
                  fontFamily={X.m} fontSize="5" fill={v === 7 ? X.teal : X.textMut}>{v}</text>
              );
            })}
          </svg>
          <div style={{
            width: 110, height: 110, borderRadius: '50%',
            background: `conic-gradient(from 225deg, ${X.red}60, ${X.amber}60, ${X.teal}60, ${X.teal}60, ${X.amber}60, ${X.red}60 75%, transparent 75%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: n.raised,
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: n.metal, boxShadow: n.bezel,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              {/* Knob indicator line */}
              <div style={{
                position: 'absolute', width: 2, height: 22,
                background: X.purple, borderRadius: 1,
                top: 8, left: '50%', marginLeft: -1,
                transformOrigin: 'bottom center',
                transform: `rotate(${knobAngle - 135}deg)`,
                transition: `transform 400ms ${ease.sp}`,
              }} />
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                background: X.surface, boxShadow: n.concave,
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* LED indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 14 }}>
        {leds.map((led, i) => (
          <div key={i} style={{ textAlign: 'center', animation: `fu 150ms ${ease.o} ${i * 30}ms both` }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%', margin: '0 auto 6px',
              boxShadow: led.ok
                ? `0 0 8px ${led.color}50, 0 0 2px ${led.color}`
                : n.concave,
              background: led.ok
                ? `radial-gradient(circle at 40% 35%, ${led.color}, ${led.color}90)`
                : X.bgAlt,
              animation: led.ok ? 'br 2s ease infinite' : 'none',
            }} />
            <Lbl style={{ marginBottom: 2 }}>{led.label}</Lbl>
            <M style={{ fontSize: 10, fontWeight: 700, color: led.color }}>{led.value.toFixed(led.unit ? 1 : 1)}{led.unit ? ` ${led.unit}` : ''}</M>
          </div>
        ))}
      </div>

      {/* Target vs actual */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 0', borderTop: `1px solid ${X.borderLight}` }}>
        <div><Lbl style={{ marginBottom: 2 }}>Target pH</Lbl><M style={{ fontSize: 12, fontWeight: 800, color: X.teal }}>{phTarget.toFixed(1)}</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Actual pH</Lbl><M style={{ fontSize: 12, fontWeight: 800, color: phColor }}>{phActual.toFixed(2)}</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Delta</Lbl><M style={{ fontSize: 12, fontWeight: 800, color: phColor }}>{phDelta > 0 ? '+' : ''}{phDelta.toFixed(2)}</M></div>
      </div>
    </Card>
  );
}

// ── Filtration Bank ───────────────────────────────────────────────
export function FiltrationBank({ title = 'Filtration Bank', stageCount = 4 }: { title?: string; stageCount?: number } = {}) {
  const X = getX();
  const n = neo();

  const stageData = [
    { name: 'Coarse Screen', pressureBase: 12.4, status: 'Clean' as const },
    { name: 'Sand Filter', pressureBase: 18.7, status: 'Clean' as const },
    { name: 'Carbon Bed', pressureBase: 24.1, status: 'Dirty' as const },
    { name: 'Membrane', pressureBase: 31.5, status: 'Clean' as const },
    { name: 'UV Reactor', pressureBase: 8.2, status: 'Clean' as const },
    { name: 'Polish Filter', pressureBase: 15.9, status: 'Dirty' as const },
  ].slice(0, stageCount);

  const pressures = [
    useLive(stageData[0]?.pressureBase ?? 0, 1.5, 2000),
    useLive(stageData[1]?.pressureBase ?? 0, 2.0, 2200),
    useLive(stageData[2]?.pressureBase ?? 0, 2.5, 1800),
    useLive(stageData[3]?.pressureBase ?? 0, 1.8, 2400),
    useLive(stageData[4]?.pressureBase ?? 0, 1.2, 2600),
    useLive(stageData[5]?.pressureBase ?? 0, 1.6, 2100),
  ];

  const cleanCount = stageData.filter(s => s.status === 'Clean').length;
  const sc: Record<string, string> = { Clean: X.teal, Dirty: X.amber };

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{cleanCount}/{stageData.length} Clean</Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {stageData.map((stage, i) => {
          const psi = pressures[i];
          const pColor = psi > 28 ? X.red : psi > 20 ? X.amber : X.teal;
          return (
            <div key={i} style={{
              padding: '10px 12px', borderRadius: X.rs,
              background: X.bgAlt,
              boxShadow: `inset 0 1px 0 #ffffff08, 0 1px 4px ${X.bg}30`,
              border: `1px solid ${sc[stage.status]}15`,
              animation: `fu 150ms ${ease.o} ${i * 30}ms both`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Dot c={sc[stage.status]} pulse={stage.status === 'Clean'} s={6} />
                  <M style={{ fontSize: 10, fontWeight: 700, color: X.text }}>{stage.name}</M>
                </div>
                <Badge color={sc[stage.status]}>{stage.status}</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Lbl style={{ marginBottom: 1 }}>Pressure</Lbl>
                  <M style={{ fontSize: 11, fontWeight: 700, color: pColor }}>{Math.max(0, psi).toFixed(1)} PSI</M>
                </div>
                <div style={{ width: 80 }}>
                  <Prog value={Math.min((psi / 40) * 100, 100)} color={pColor} h={3} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Lbl style={{ marginBottom: 1 }}>Stage {i + 1}</Lbl>
                  <M style={{ fontSize: 9, fontWeight: 600, color: X.textMut }}>of {stageData.length}</M>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Water Tank Level ──────────────────────────────────────────────
export function WaterTankLevel({ title = 'Tank Level', tankCount = 3 }: { title?: string; tankCount?: number } = {}) {
  const X = getX();
  const n = neo();

  const tankData = [
    { name: 'Primary', capacityL: 50000, levelBase: 72 },
    { name: 'Reserve', capacityL: 30000, levelBase: 45 },
    { name: 'Process', capacityL: 20000, levelBase: 88 },
    { name: 'Effluent', capacityL: 15000, levelBase: 34 },
  ].slice(0, tankCount);

  const levels = [
    useLive(tankData[0]?.levelBase ?? 0, 3, 2500),
    useLive(tankData[1]?.levelBase ?? 0, 4, 2800),
    useLive(tankData[2]?.levelBase ?? 0, 2, 3200),
    useLive(tankData[3]?.levelBase ?? 0, 5, 2200),
  ];

  const levelColor = (v: number) => v > 85 ? X.amber : v < 20 ? X.red : X.teal;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>{tankCount} Tanks</Badge>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 12 }}>
        {tankData.map((tank, i) => {
          const lv = Math.max(0, Math.min(100, levels[i]));
          const c = levelColor(lv);
          const fillH = (lv / 100) * 90;
          return (
            <div key={i} style={{ textAlign: 'center', flex: 1, animation: `fu 150ms ${ease.o} ${i * 40}ms both` }}>
              <Lbl style={{ marginBottom: 4 }}>{tank.name}</Lbl>
              {/* Tank visual */}
              <div style={{
                width: '100%', maxWidth: 70, height: 110, margin: '0 auto 6px',
                borderRadius: '4px 4px 8px 8px',
                background: X.bg,
                boxShadow: n.bezel,
                position: 'relative', overflow: 'hidden',
                border: `1px solid ${X.borderLight}`,
              }}>
                {/* Water fill */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: `${fillH}%`,
                  transition: `height 600ms ${ease.sp}`,
                  overflow: 'hidden',
                  borderRadius: '0 0 7px 7px',
                }}>
                  <svg viewBox="0 0 70 110" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
                    <defs>
                      <linearGradient id={`water-tank-fill-${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={c} stopOpacity=".35" />
                        <stop offset="100%" stopColor={c} stopOpacity=".15" />
                      </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="70" height="110" fill={`url(#water-tank-fill-${i})`} />
                  </svg>
                  {/* Surface line */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                    background: `linear-gradient(90deg, transparent, ${c}80, transparent)`,
                  }} />
                </div>

                {/* Level percentage overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <M style={{ fontSize: 14, fontWeight: 800, color: c, textShadow: `0 1px 3px ${X.bg}` }}>
                    {Math.round(lv)}%
                  </M>
                </div>
              </div>

              <M style={{ fontSize: 8, color: X.textMut }}>{(tank.capacityL / 1000).toFixed(0)}kL cap</M>
            </div>
          );
        })}
      </div>

      {/* Bottom summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${X.borderLight}`, paddingTop: 8 }}>
        <div><Lbl style={{ marginBottom: 1 }}>Total Capacity</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.indigo }}>{(tankData.reduce((a, t) => a + t.capacityL, 0) / 1000).toFixed(0)} kL</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 1 }}>Avg Level</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>{Math.round(levels.slice(0, tankCount).reduce((a, v) => a + v, 0) / tankCount)}%</M></div>
      </div>
    </Card>
  );
}

// ── Turbidity Meter ───────────────────────────────────────────────
export function TurbidityMeter({ title = 'Turbidity', ntuLimit = 4 }: { title?: string; ntuLimit?: number } = {}) {
  const X = getX();
  const n = neo();

  const ntu = useLive(2.1, 0.8, 1800);
  const ntuAnim = useAnim(Math.max(0, ntu), 700);
  const maxNTU = 10;
  const pct = Math.min(ntuAnim / maxNTU, 1);

  // Arc gauge: 260 degrees, from -130 to +130
  const arcStart = -130;
  const arcEnd = 130;
  const arcSpan = arcEnd - arcStart;
  const arcRadius = 36;
  const cx = 50, cy = 50;

  const circumference = 2 * Math.PI * arcRadius * (arcSpan / 360);
  const fillLen = pct * circumference;

  const ntuColor = ntu > ntuLimit ? X.red : ntu > ntuLimit * 0.7 ? X.amber : X.teal;
  const limitAngle = arcStart + (ntuLimit / maxNTU) * arcSpan;

  return (
    <Card style={{ width: 350 }} glow={ntuColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={ntu > ntuLimit ? X.red : X.teal}>{ntu > ntuLimit ? 'ALERT' : 'Normal'}</Badge>
      </div>

      {/* Gauge housing */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <div style={{
          width: 170, height: 170, borderRadius: '50%',
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 150, height: 150, borderRadius: '50%',
            background: X.bg, boxShadow: n.concave,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 100 100" style={{ width: 140, height: 140, display: 'block' }}>
              <defs>
                <linearGradient id="water-turb-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={X.teal} />
                  <stop offset="50%" stopColor={X.amber} />
                  <stop offset="100%" stopColor={X.red} />
                </linearGradient>
              </defs>

              {/* Background arc */}
              <path
                d={describeArc(cx, cy, arcRadius, arcStart, arcEnd)}
                fill="none" stroke={X.borderLight} strokeWidth="5" strokeLinecap="round"
              />

              {/* Fill arc */}
              <path
                d={describeArc(cx, cy, arcRadius, arcStart, arcEnd)}
                fill="none" stroke={ntuColor} strokeWidth="5" strokeLinecap="round"
                strokeDasharray={`${fillLen} ${circumference}`}
                style={{ transition: `stroke-dasharray 600ms ${ease.sp}, stroke 300ms` }}
              />

              {/* Limit marker */}
              {(() => {
                const pt = polarToCartesian(cx, cy, arcRadius + 5, limitAngle);
                const ptInner = polarToCartesian(cx, cy, arcRadius - 5, limitAngle);
                return (
                  <line x1={ptInner.x} y1={ptInner.y} x2={pt.x} y2={pt.y}
                    stroke={X.red} strokeWidth="1" strokeDasharray="2 1" opacity=".7" />
                );
              })()}

              {/* Scale labels */}
              {[0, 2, 4, 6, 8, 10].map((v, i) => {
                const angle = arcStart + (v / maxNTU) * arcSpan;
                const pt = polarToCartesian(cx, cy, arcRadius - 10, angle);
                return (
                  <text key={i} x={pt.x} y={pt.y} textAnchor="middle" dominantBaseline="central"
                    fontFamily={X.m} fontSize="4" fill={v === ntuLimit ? X.red : X.textMut}>{v}</text>
                );
              })}

              {/* Center display */}
              <text x={cx} y={cy - 2} textAnchor="middle" fontFamily={X.m}
                fontSize="14" fontWeight="800" fill={ntuColor}>
                {Math.max(0, ntu).toFixed(1)}
              </text>
              <text x={cx} y={cy + 8} textAnchor="middle" fontFamily={X.m}
                fontSize="5" fill={X.textMut}>NTU</text>

              {/* Limit label */}
              <text x={cx} y={cy + 18} textAnchor="middle" fontFamily={X.m}
                fontSize="3.5" fill={X.red}>Limit: {ntuLimit} NTU</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Current</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: ntuColor }}>{Math.max(0, ntu).toFixed(2)} NTU</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Limit</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.red }}>{ntuLimit} NTU</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Margin</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: ntu > ntuLimit ? X.red : X.teal }}>{(ntuLimit - ntu).toFixed(1)}</M></div>
      </div>
    </Card>
  );
}

// ── Pump Station ──────────────────────────────────────────────────
export function PumpStation({ title = 'Pump Station', pressureUnit = 'PSI' }: { title?: string; pressureUnit?: string } = {}) {
  const X = getX();
  const n = neo();

  const [pumpStates, setPumpStates] = useState([true, false, true]);

  const pressures = [
    useLive(45.2, 4, 1600),
    useLive(0, 0, 3000),
    useLive(38.7, 3.5, 1800),
  ];

  const flows = [
    useLive(28.4, 2.5, 1400),
    useLive(0, 0, 3000),
    useLive(22.1, 2.0, 1600),
  ];

  const rpms = [
    useLive(1750, 30, 2000),
    useLive(0, 0, 3000),
    useLive(1480, 25, 2200),
  ];

  const pumps = [
    { id: 'P-01', name: 'Main Intake' },
    { id: 'P-02', name: 'Booster' },
    { id: 'P-03', name: 'Distribution' },
  ];

  const togglePump = (i: number) => {
    setPumpStates(prev => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  const activeCount = pumpStates.filter(Boolean).length;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{activeCount}/{pumps.length} Running</Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {pumps.map((pump, i) => {
          const on = pumpStates[i];
          const psi = on ? pressures[i] : 0;
          const flowVal = on ? flows[i] : 0;
          const rpm = on ? rpms[i] : 0;
          const pColor = psi > 55 ? X.amber : X.teal;

          return (
            <div key={i} style={{
              padding: '10px 12px', borderRadius: X.rs,
              background: X.bgAlt, border: `1px solid ${on ? X.teal + '20' : X.borderLight}`,
              animation: `fu 150ms ${ease.o} ${i * 40}ms both`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <M style={{ fontSize: 11, fontWeight: 800, color: X.text }}>{pump.id}</M>
                  <M style={{ fontSize: 8, color: X.textMut }}>{pump.name}</M>
                </div>

                {/* Neumorphic toggle switch */}
                <button onClick={() => togglePump(i)} style={{
                  width: 44, height: 22, borderRadius: 11, border: 'none',
                  cursor: 'pointer', position: 'relative', padding: 0,
                  boxShadow: n.concave,
                  background: on ? `${X.teal}30` : X.bg,
                  transition: `background 200ms ${ease.mv}`,
                }}>
                  <div style={{
                    width: 18, height: 18, borderRadius: '50%',
                    position: 'absolute', top: 2,
                    left: on ? 23 : 3,
                    background: on ? X.teal : X.textMut,
                    boxShadow: n.raised,
                    transition: `left 200ms ${ease.sp}, background 200ms`,
                  }}>
                    <div style={{
                      position: 'absolute', inset: 3, borderRadius: '50%',
                      background: on
                        ? `radial-gradient(circle at 40% 35%, ${X.teal}, ${X.teal}cc)`
                        : `radial-gradient(circle at 40% 35%, ${X.textMut}, ${X.textMut}cc)`,
                      boxShadow: on ? `0 0 6px ${X.teal}40` : 'none',
                    }} />
                  </div>
                </button>
              </div>

              {on ? (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <Lbl style={{ marginBottom: 1 }}>Pressure</Lbl>
                    <M style={{ fontSize: 11, fontWeight: 700, color: pColor }}>{Math.max(0, psi).toFixed(1)} {pressureUnit}</M>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Lbl style={{ marginBottom: 1 }}>Flow</Lbl>
                    <M style={{ fontSize: 11, fontWeight: 700, color: X.indigo }}>{Math.max(0, flowVal).toFixed(1)} L/min</M>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <Lbl style={{ marginBottom: 1 }}>RPM</Lbl>
                    <M style={{ fontSize: 11, fontWeight: 700, color: X.purple }}>{Math.max(0, rpm).toFixed(0)}</M>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.5 }}>
                  <Dot c={X.textMut} s={5} />
                  <M style={{ fontSize: 9, color: X.textMut }}>Pump offline</M>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTop: `1px solid ${X.borderLight}` }}>
        <div><Lbl style={{ marginBottom: 1 }}>Total Flow</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.indigo }}>{pumpStates.reduce((a, on, i) => a + (on ? Math.max(0, flows[i]) : 0), 0).toFixed(1)} L/min</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 1 }}>Avg Pressure</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>{activeCount > 0 ? (pumpStates.reduce((a, on, i) => a + (on ? Math.max(0, pressures[i]) : 0), 0) / activeCount).toFixed(1) : '0.0'} {pressureUnit}</M></div>
      </div>
    </Card>
  );
}
