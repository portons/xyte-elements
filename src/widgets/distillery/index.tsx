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

// ── Fermentation Curve ─────────────────────────────────────────────
export function FermentationCurve({ title = 'Fermentation', currentSG = 1.032, targetSG = 1.010, startSG = 1.055 }: { title?: string; currentSG?: number; targetSG?: number; startSG?: number }) {
  const X = getX();
  const n = neo();
  const animSG = useAnim(currentSG * 1000, 1200);

  const range = startSG - targetSG;
  const progress = range > 0 ? Math.min(((startSG - currentSG) / range) * 100, 100) : 0;
  const animProg = useAnim(progress, 1000);

  // Curve points - descending S-curve from startSG to currentSG
  const points: [number, number][] = [];
  const chartW = 280;
  const chartH = 80;
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const curveT = t * (progress / 100);
    // Exponential decay curve
    const sg = startSG - (startSG - targetSG) * (1 - Math.exp(-3 * curveT)) / (1 - Math.exp(-3));
    const x = 15 + t * chartW;
    const y = 10 + ((startSG - sg) / range) * chartH;
    points.push([x, y]);
  }
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

  const sgColor = currentSG <= targetSG * 1.05 ? X.teal : currentSG > startSG * 0.8 ? X.amber : X.purple;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={sgColor}>
          {currentSG <= targetSG * 1.05 ? 'Complete' : 'Fermenting'}
        </Badge>
      </div>

      {/* SG reading */}
      <div style={{
        padding: '10px 14px', borderRadius: 8, marginBottom: 12,
        background: '#000', boxShadow: n.concave, textAlign: 'center',
      }}>
        <Lbl style={{ marginBottom: 4 }}>Specific Gravity</Lbl>
        <M style={{ fontSize: 32, fontWeight: 800, color: sgColor, display: 'block', letterSpacing: '.02em' }}>
          {(animSG / 1000).toFixed(3)}
        </M>
      </div>

      {/* Curve chart */}
      <div style={{
        padding: '8px', borderRadius: 8,
        background: X.bgAlt, boxShadow: n.concave, marginBottom: 12,
      }}>
        <svg viewBox="0 0 310 110" style={{ width: '100%', height: 110, display: 'block' }}>
          {/* Target band */}
          <rect x="15" y={10 + ((startSG - targetSG * 1.05) / range) * chartH}
            width={chartW} height={((targetSG * 1.05 - targetSG * 0.95) / range) * chartH}
            fill={X.teal} fillOpacity="0.08" rx="2" />
          {/* Target line */}
          <line x1="15" y1={10 + chartH} x2={15 + chartW} y2={10 + chartH}
            stroke={X.teal} strokeWidth="0.5" strokeDasharray="4,3" strokeOpacity="0.4" />
          <text x={15 + chartW + 4} y={10 + chartH + 3} fontSize="5" fill={X.teal} fillOpacity="0.6" fontFamily="monospace">
            FG
          </text>
          {/* Start line */}
          <line x1="15" y1="10" x2={15 + chartW} y2="10"
            stroke={X.amber} strokeWidth="0.5" strokeDasharray="4,3" strokeOpacity="0.3" />
          <text x={15 + chartW + 4} y="13" fontSize="5" fill={X.amber} fillOpacity="0.6" fontFamily="monospace">
            OG
          </text>

          {/* Curve path */}
          <path d={pathD} fill="none" stroke={X.purple} strokeWidth="2"
            style={{ filter: `drop-shadow(0 0 3px ${X.purple}40)` }} />

          {/* Current point */}
          {points.length > 0 && (
            <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="4"
              fill={sgColor} stroke="#fff" strokeWidth="1"
              style={{ filter: `drop-shadow(0 0 4px ${sgColor}80)` }}
            />
          )}

          {/* Y-axis labels */}
          <text x="12" y="13" textAnchor="end" fontSize="5" fill={X.textMut} fontFamily="monospace">{startSG.toFixed(3)}</text>
          <text x="12" y={13 + chartH} textAnchor="end" fontSize="5" fill={X.textMut} fontFamily="monospace">{targetSG.toFixed(3)}</text>

          {/* X-axis */}
          <line x1="15" y1="95" x2={15 + chartW} y2="95" stroke={X.border} strokeWidth="0.5" />
          <text x={15 + chartW / 2} y="104" textAnchor="middle" fontSize="5" fill={X.textMut} fontFamily="monospace">Time</text>
        </svg>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'OG', val: startSG.toFixed(3), color: X.amber },
          { label: 'Current', val: currentSG.toFixed(3), color: sgColor },
          { label: 'Target', val: targetSG.toFixed(3), color: X.teal },
          { label: 'Atten.', val: `${Math.round(animProg)}%`, color: X.purple },
        ].map((s) => (
          <div key={s.label} style={{
            flex: 1, padding: '5px 4px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 2 }}>{s.label}</Lbl>
            <M style={{ fontSize: 10, fontWeight: 700, color: s.color, display: 'block' }}>{s.val}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Still Diagram ──────────────────────────────────────────────────
export function StillDiagram({ title = 'Still', headTemp = 78.3, bodyTemp = 92.1, tailTemp = 68.5 }: { title?: string; headTemp?: number; bodyTemp?: number; tailTemp?: number }) {
  const X = getX();
  const n = neo();
  const animHead = useAnim(headTemp, 1000);
  const animBody = useAnim(bodyTemp, 1000);
  const animTail = useAnim(tailTemp, 1000);
  const tick = useTick(800);

  const tempColor = (t: number) => t > 90 ? X.red : t > 78 ? X.amber : t > 60 ? X.teal : X.indigo;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={bodyTemp > 95 ? X.red : X.amber}>
          {bodyTemp > 95 ? 'Overheat' : 'Distilling'}
        </Badge>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        {/* Still silhouette */}
        <div style={{
          width: 140, height: 200, borderRadius: 10,
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg viewBox="0 0 80 120" style={{ width: 120, height: 180, display: 'block' }}>
            <defs>
              <linearGradient id="dist-head" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={tempColor(headTemp)} stopOpacity=".6" />
                <stop offset="100%" stopColor={tempColor(headTemp)} stopOpacity=".2" />
              </linearGradient>
              <linearGradient id="dist-body" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={tempColor(bodyTemp)} stopOpacity=".5" />
                <stop offset="100%" stopColor={tempColor(bodyTemp)} stopOpacity=".7" />
              </linearGradient>
              <linearGradient id="dist-tail" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={tempColor(tailTemp)} stopOpacity=".5" />
                <stop offset="100%" stopColor={tempColor(tailTemp)} stopOpacity=".2" />
              </linearGradient>
            </defs>

            {/* Pot body (bottom) */}
            <path d="M15,65 Q15,105 40,108 Q65,105 65,65 Z" fill="url(#dist-body)" stroke={X.border} strokeWidth="1" />

            {/* Neck (swan neck curve) */}
            <path d="M30,65 Q30,30 35,20 Q38,12 40,12 Q42,12 45,20 Q50,30 50,40 Q50,45 55,45 L72,45"
              fill="none" stroke={X.border} strokeWidth="1.5" />
            {/* Head zone fill */}
            <path d="M32,60 Q32,35 36,22 Q38,15 40,15 Q42,15 44,22 Q48,35 48,45 Q48,42 55,42 L55,48 Q48,48 48,50 L48,60 Z"
              fill="url(#dist-head)" />

            {/* Condenser (lyne arm) */}
            <line x1="55" y1="45" x2="72" y2="45" stroke={X.border} strokeWidth="2" />
            {/* Condenser coil */}
            <path d="M72,45 L72,90" fill="none" stroke={X.border} strokeWidth="1.5" />
            {[55, 65, 75, 85].map((y) => (
              <ellipse key={y} cx="72" cy={y} rx="4" ry="2" fill="none" stroke={tempColor(tailTemp)} strokeWidth="0.8" strokeOpacity="0.6" />
            ))}

            {/* Drip/output */}
            <line x1="72" y1="90" x2="72" y2="100" stroke={tempColor(tailTemp)} strokeWidth="1" strokeDasharray={tick % 2 === 0 ? '2,3' : '3,2'} />
            <rect x="66" y="100" width="12" height="10" rx="2" fill="url(#dist-tail)" stroke={X.border} strokeWidth="0.8" />

            {/* Temperature labels on still */}
            <text x="40" y="90" textAnchor="middle" fontSize="6" fill="#fff" fontWeight="700" fontFamily="monospace">
              {animBody.toFixed(0)}\u00B0
            </text>
            <text x="40" y="38" textAnchor="middle" fontSize="5" fill="#fff" fontWeight="600" fontFamily="monospace">
              {animHead.toFixed(0)}\u00B0
            </text>

            {/* Steam bubbles */}
            {[0, 1, 2].map((i) => (
              <circle key={i}
                cx={35 + i * 5} cy={75 - (tick + i * 3) % 10 * 2}
                r={1 + (i % 2)} fill="#fff" fillOpacity={0.15}
              />
            ))}
          </svg>
        </div>

        {/* Temperature readouts */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Head (Vapor)', temp: headTemp, anim: animHead },
            { label: 'Body (Pot)', temp: bodyTemp, anim: animBody },
            { label: 'Tail (Condenser)', temp: tailTemp, anim: animTail },
          ].map((zone) => (
            <div key={zone.label} style={{
              padding: '8px 10px', borderRadius: 6,
              background: n.metal, boxShadow: n.concave,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Lbl>{zone.label}</Lbl>
                <Dot c={tempColor(zone.temp)} pulse={zone.temp > 85} s={5} />
              </div>
              <M style={{ fontSize: 20, fontWeight: 800, color: tempColor(zone.temp), display: 'block', marginTop: 2 }}>
                {zone.anim.toFixed(1)}\u00B0C
              </M>
            </div>
          ))}

          <div style={{
            padding: '4px 8px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          }}>
            <M style={{ fontSize: 8, color: X.textMut }}>
              Ethanol BP: 78.37\u00B0C
            </M>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Barrel Aging ───────────────────────────────────────────────────
export function BarrelAging({ title = 'Barrel Aging', ageDays = 730, targetDays = 1095, angelSharePct = 4.2 }: { title?: string; ageDays?: number; targetDays?: number; angelSharePct?: number }) {
  const X = getX();
  const n = neo();
  const progress = Math.min((ageDays / targetDays) * 100, 100);
  const animProg = useAnim(progress, 1200);
  const animAngel = useAnim(angelSharePct, 800);
  const fillPct = 100 - angelSharePct;

  const years = Math.floor(ageDays / 365);
  const months = Math.floor((ageDays % 365) / 30);
  const remaining = targetDays - ageDays;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={progress >= 100 ? X.teal : X.amber}>
          {progress >= 100 ? 'Ready' : 'Aging'}
        </Badge>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        {/* Barrel SVG */}
        <div style={{
          width: 130, height: 160, borderRadius: 10,
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg viewBox="0 0 70 100" style={{ width: 100, height: 140, display: 'block' }}>
            <defs>
              <linearGradient id="dist-barrel" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={X.amber} stopOpacity=".3" />
                <stop offset="30%" stopColor={X.amber} stopOpacity=".5" />
                <stop offset="70%" stopColor={X.amber} stopOpacity=".5" />
                <stop offset="100%" stopColor={X.amber} stopOpacity=".3" />
              </linearGradient>
              <clipPath id="dist-barrel-clip">
                <path d="M15,15 Q10,50 15,85 L55,85 Q60,50 55,15 Z" />
              </clipPath>
            </defs>

            {/* Barrel outline - bowed staves */}
            <path d="M15,15 Q10,50 15,85 L55,85 Q60,50 55,15 Z"
              fill={X.bgAlt} stroke={X.border} strokeWidth="1.2" />

            {/* Liquid fill level */}
            <g clipPath="url(#dist-barrel-clip)">
              <rect x="10" y={15 + (1 - fillPct / 100) * 70}
                width="50" height={fillPct / 100 * 70}
                fill="url(#dist-barrel)" />
              {/* Angel's share evaporation zone */}
              <rect x="10" y="15"
                width="50" height={(1 - fillPct / 100) * 70}
                fill={X.textMut} fillOpacity="0.05" />
            </g>

            {/* Barrel hoops */}
            {[22, 40, 58, 78].map((y) => (
              <ellipse key={y} cx="35" cy={y} rx={y < 30 || y > 70 ? 18 : 22} ry="1.5"
                fill="none" stroke={X.textMut} strokeWidth="1.2" strokeOpacity="0.4" />
            ))}

            {/* Bung hole */}
            <ellipse cx="35" cy="48" rx="4" ry="2" fill={X.bgAlt} stroke={X.border} strokeWidth="0.8" />

            {/* Angel's share wisps */}
            <text x="35" y="12" textAnchor="middle" fontSize="4" fill={X.textMut} fillOpacity="0.5" fontFamily="monospace">
              ~{animAngel.toFixed(1)}% angel
            </text>
          </svg>
        </div>

        {/* Aging info */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            padding: '10px 12px', borderRadius: 6,
            background: '#000', boxShadow: n.concave, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 4 }}>Age</Lbl>
            <M style={{ fontSize: 24, fontWeight: 800, color: X.amber, display: 'block' }}>
              {years}y {months}m
            </M>
            <M style={{ fontSize: 9, color: X.textMut }}>{ageDays.toLocaleString()} days</M>
          </div>

          {/* Progress ring */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg viewBox="0 0 80 80" style={{ width: 80, height: 80 }}>
              <circle cx="40" cy="40" r="32" fill="none" stroke={X.border} strokeWidth="4" strokeOpacity="0.2" />
              <circle cx="40" cy="40" r="32" fill="none" stroke={X.amber} strokeWidth="4"
                strokeDasharray={`${animProg / 100 * 201} 201`}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '40px 40px', transition: `stroke-dasharray 800ms ${ease.o}` }}
              />
              <text x="40" y="38" textAnchor="middle" fontSize="10" fontWeight="800" fill={X.text} fontFamily="monospace">
                {Math.round(animProg)}%
              </text>
              <text x="40" y="48" textAnchor="middle" fontSize="5" fill={X.textMut} fontFamily="monospace">aged</text>
            </svg>
          </div>

          <div style={{
            padding: '4px 8px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
            display: 'flex', justifyContent: 'space-between',
          }}>
            <M style={{ fontSize: 8, color: X.textMut }}>Remaining</M>
            <M style={{ fontSize: 8, fontWeight: 600, color: remaining > 0 ? X.textSec : X.teal }}>
              {remaining > 0 ? `${remaining}d` : 'Ready'}
            </M>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Mash Tun ───────────────────────────────────────────────────────
export function MashTun({ title = 'Mash Tun', mashTemp = 65, restMinutes = 12, targetTemp = 67 }: { title?: string; mashTemp?: number; restMinutes?: number; targetTemp?: number }) {
  const X = getX();
  const n = neo();
  const animTemp = useAnim(mashTemp, 800);
  const animTarget = useAnim(targetTemp, 800);
  const tick = useTick(1000);

  const tempDiff = Math.abs(mashTemp - targetTemp);
  const tempColor = tempDiff < 2 ? X.teal : tempDiff < 5 ? X.amber : X.red;

  // Mash schedule steps
  const steps = [
    { name: 'Acid Rest', temp: 45, dur: 10 },
    { name: 'Protein Rest', temp: 52, dur: 15 },
    { name: 'Sacch. Rest', temp: 67, dur: 60 },
    { name: 'Mash Out', temp: 76, dur: 10 },
  ];

  const activeStep = steps.reduce((best, s, i) => Math.abs(s.temp - targetTemp) < Math.abs(steps[best].temp - targetTemp) ? i : best, 0);

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={tempColor}>
          {tempDiff < 2 ? 'On Target' : 'Adjusting'}
        </Badge>
      </div>

      {/* Temperature display */}
      <div style={{
        padding: '12px 14px', borderRadius: 8, marginBottom: 12,
        background: '#000', boxShadow: n.concave,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <Lbl style={{ marginBottom: 3 }}>Current</Lbl>
          <M style={{ fontSize: 28, fontWeight: 800, color: tempColor, display: 'block' }}>
            {animTemp.toFixed(1)}\u00B0C
          </M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 3 }}>Target</Lbl>
          <M style={{ fontSize: 20, fontWeight: 700, color: X.textSec, display: 'block' }}>
            {animTarget.toFixed(0)}\u00B0C
          </M>
        </div>
      </div>

      {/* Step chart */}
      <div style={{
        padding: '8px', borderRadius: 8,
        background: X.bgAlt, boxShadow: n.concave, marginBottom: 12,
      }}>
        <svg viewBox="0 0 310 70" style={{ width: '100%', height: 70, display: 'block' }}>
          {/* Step rectangles */}
          {steps.map((s, i) => {
            const x = 10 + i * 74;
            const w = 68;
            const normalizedH = (s.temp / 80) * 50;
            const y = 60 - normalizedH;
            const isActive = i === activeStep;
            return (
              <g key={i}>
                <rect x={x} y={y} width={w} height={normalizedH}
                  fill={isActive ? X.amber + '30' : X.surface}
                  stroke={isActive ? X.amber : X.border}
                  strokeWidth={isActive ? '1.5' : '0.5'}
                  rx="3"
                />
                <text x={x + w / 2} y={y + normalizedH / 2 + 2} textAnchor="middle"
                  fontSize="6" fontWeight="700" fill={isActive ? X.amber : X.textMut} fontFamily="monospace">
                  {s.temp}\u00B0
                </text>
                <text x={x + w / 2} y="68" textAnchor="middle"
                  fontSize="4.5" fill={isActive ? X.text : X.textMut} fontFamily="monospace">
                  {s.name}
                </text>
              </g>
            );
          })}

          {/* Current temp line */}
          <line x1="5" y1={60 - (mashTemp / 80) * 50} x2="305" y2={60 - (mashTemp / 80) * 50}
            stroke={tempColor} strokeWidth="0.8" strokeDasharray="3,2" strokeOpacity="0.6" />
        </svg>
      </div>

      {/* Rest timer */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{
          flex: 1, padding: '8px 10px', borderRadius: 6,
          background: n.metal, boxShadow: n.concave, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 3 }}>Rest Timer</Lbl>
          <M style={{ fontSize: 20, fontWeight: 800, color: X.text, display: 'block' }}>
            {restMinutes}:{String(tick % 60).padStart(2, '0')}
          </M>
        </div>
        <div style={{
          flex: 1, padding: '8px 10px', borderRadius: 6,
          background: n.metal, boxShadow: n.concave, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 3 }}>Step</Lbl>
          <M style={{ fontSize: 12, fontWeight: 700, color: X.amber, display: 'block' }}>
            {steps[activeStep].name}
          </M>
        </div>
      </div>
    </Card>
  );
}

// ── Spirit Safe ────────────────────────────────────────────────────
export function SpiritSafe({ title = 'Spirit Safe', abvPercent = 72, cutPoint = 'hearts' as 'heads' | 'hearts' | 'tails' }: { title?: string; abvPercent?: number; cutPoint?: 'heads' | 'hearts' | 'tails' }) {
  const X = getX();
  const n = neo();
  const animAbv = useAnim(abvPercent, 800);

  const cuts = [
    { name: 'heads', start: 0, end: 25, color: X.red, label: 'Heads' },
    { name: 'hearts', start: 25, end: 70, color: X.teal, label: 'Hearts' },
    { name: 'tails', start: 70, end: 100, color: X.amber, label: 'Tails' },
  ];

  const activeCut = cuts.find((c) => c.name === cutPoint) || cuts[1];
  const abvPosition = Math.min(Math.max(abvPercent / 100, 0), 1);

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={activeCut.color}>{activeCut.label}</Badge>
      </div>

      {/* ABV display */}
      <div style={{
        padding: '10px 14px', borderRadius: 8, marginBottom: 12,
        background: '#000', boxShadow: n.concave, textAlign: 'center',
      }}>
        <Lbl style={{ marginBottom: 4 }}>Alcohol by Volume</Lbl>
        <M style={{ fontSize: 36, fontWeight: 800, color: activeCut.color, display: 'block' }}>
          {animAbv.toFixed(1)}%
        </M>
      </div>

      {/* Cut point range */}
      <div style={{
        padding: '10px 12px', borderRadius: 8, marginBottom: 12,
        background: X.bgAlt, boxShadow: n.concave,
      }}>
        <Lbl style={{ marginBottom: 8 }}>Cut Zones</Lbl>
        <svg viewBox="0 0 290 40" style={{ width: '100%', height: 40, display: 'block' }}>
          {/* Zone bars */}
          {cuts.map((cut) => (
            <rect key={cut.name}
              x={10 + cut.start * 2.7} y="5"
              width={(cut.end - cut.start) * 2.7} height="16"
              fill={cut.color} fillOpacity={cut.name === cutPoint ? 0.5 : 0.15}
              stroke={cut.name === cutPoint ? cut.color : 'none'} strokeWidth="1"
              rx="3"
            />
          ))}

          {/* Zone labels */}
          {cuts.map((cut) => (
            <text key={`label-${cut.name}`}
              x={10 + ((cut.start + cut.end) / 2) * 2.7} y="15"
              textAnchor="middle" fontSize="5" fontWeight="700"
              fill={cut.name === cutPoint ? '#fff' : cut.color}
              fontFamily="monospace"
            >
              {cut.label}
            </text>
          ))}

          {/* ABV marker */}
          <line x1={10 + abvPosition * 270} y1="3" x2={10 + abvPosition * 270} y2="24"
            stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <polygon
            points={`${10 + abvPosition * 270},26 ${7 + abvPosition * 270},32 ${13 + abvPosition * 270},32`}
            fill="#fff"
          />
          <text x={10 + abvPosition * 270} y="39" textAnchor="middle" fontSize="5" fill={X.text} fontWeight="700" fontFamily="monospace">
            {abvPercent}%
          </text>
        </svg>
      </div>

      {/* Cut info */}
      <div style={{ display: 'flex', gap: 6 }}>
        {cuts.map((cut) => (
          <div key={cut.name} style={{
            flex: 1, padding: '6px', borderRadius: 6,
            background: cut.name === cutPoint ? `${cut.color}15` : X.bgAlt,
            border: `1px solid ${cut.name === cutPoint ? cut.color + '40' : X.borderLight}`,
            textAlign: 'center',
          }}>
            <Dot c={cut.color} pulse={cut.name === cutPoint} s={5} />
            <M style={{ fontSize: 8, fontWeight: 600, color: cut.color, display: 'block', marginTop: 3 }}>
              {cut.label}
            </M>
            <M style={{ fontSize: 7, color: X.textMut }}>{cut.start}-{cut.end}%</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Bottling Line ──────────────────────────────────────────────────
export function BottlingLine({ title = 'Bottling Line', bottlesPerHour = 240, fillAccuracy = 98.5, targetBPH = 300 }: { title?: string; bottlesPerHour?: number; fillAccuracy?: number; targetBPH?: number }) {
  const X = getX();
  const n = neo();
  const tick = useTick(400);
  const animBPH = useAnim(bottlesPerHour, 1000);
  const animAcc = useAnim(fillAccuracy, 800);

  const efficiency = Math.min((bottlesPerHour / targetBPH) * 100, 100);
  const effColor = efficiency > 80 ? X.teal : efficiency > 50 ? X.amber : X.red;
  const accColor = fillAccuracy > 98 ? X.teal : fillAccuracy > 95 ? X.amber : X.red;

  // Bottle positions on conveyor
  const bottleCount = 8;
  const conveyorW = 290;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={effColor}>
          {efficiency > 80 ? 'Running' : 'Slow'}
        </Badge>
      </div>

      {/* Conveyor animation */}
      <div style={{
        padding: '8px', borderRadius: 8, marginBottom: 12,
        background: X.bgAlt, boxShadow: n.concave, overflow: 'hidden',
      }}>
        <svg viewBox="0 0 300 65" style={{ width: '100%', height: 65, display: 'block' }}>
          {/* Conveyor belt */}
          <rect x="5" y="48" width={conveyorW} height="6" rx="3" fill={X.surface} stroke={X.border} strokeWidth="0.5" />
          {/* Belt segments moving */}
          {Array.from({ length: 15 }, (_, i) => {
            const x = ((i * 20 + tick * 4) % (conveyorW + 20)) - 10;
            return (
              <line key={i} x1={x} y1="49" x2={x} y2="53" stroke={X.textMut} strokeWidth="0.5" strokeOpacity="0.3" />
            );
          })}

          {/* Bottles moving along conveyor */}
          {Array.from({ length: bottleCount }, (_, i) => {
            const baseX = ((i * 36 + tick * 6) % (conveyorW + 40)) - 20;
            const fillH = 22 + Math.random() * 0; // consistent fill
            return (
              <g key={i}>
                {/* Bottle shape */}
                <path d={`M${baseX},47 L${baseX},30 Q${baseX},25 ${baseX + 3},22 L${baseX + 3},15 Q${baseX + 5},12 ${baseX + 7},12 Q${baseX + 9},12 ${baseX + 11},15 L${baseX + 11},22 Q${baseX + 14},25 ${baseX + 14},30 L${baseX + 14},47 Z`}
                  fill="none" stroke={X.textMut} strokeWidth="0.8" strokeOpacity="0.6" />
                {/* Liquid fill */}
                <rect x={baseX + 2} y={47 - fillH} width="10" height={fillH}
                  fill={X.amber} fillOpacity="0.3" rx="1" />
                {/* Cap */}
                <rect x={baseX + 4} y="11" width="6" height="3" rx="1" fill={X.textMut} fillOpacity="0.4" />
              </g>
            );
          })}

          {/* Filler nozzle */}
          <rect x="140" y="2" width="20" height="10" rx="2" fill={X.surface} stroke={X.border} strokeWidth="0.8" />
          <line x1="150" y1="12" x2="150" y2={18 + (tick % 3) * 2}
            stroke={X.amber} strokeWidth="1.5" strokeOpacity={tick % 2 === 0 ? 0.8 : 0.3}
            strokeDasharray="2,1" />
        </svg>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <div style={{
          flex: 1, padding: '10px 12px', borderRadius: 6,
          background: '#000', boxShadow: n.concave, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 3 }}>Bottles/hr</Lbl>
          <M style={{ fontSize: 24, fontWeight: 800, color: effColor, display: 'block' }}>
            {Math.round(animBPH)}
          </M>
          <M style={{ fontSize: 8, color: X.textMut }}>target: {targetBPH}</M>
        </div>
        <div style={{
          flex: 1, padding: '10px 12px', borderRadius: 6,
          background: '#000', boxShadow: n.concave, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 3 }}>Fill Accuracy</Lbl>
          <M style={{ fontSize: 24, fontWeight: 800, color: accColor, display: 'block' }}>
            {animAcc.toFixed(1)}%
          </M>
          <M style={{ fontSize: 8, color: X.textMut }}>tolerance: \u00B12%</M>
        </div>
      </div>

      {/* Efficiency bar */}
      <div style={{
        padding: '6px 10px', borderRadius: 6,
        background: n.metal, boxShadow: n.concave,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <Lbl>Line Efficiency</Lbl>
          <M style={{ fontSize: 9, fontWeight: 700, color: effColor }}>{Math.round(efficiency)}%</M>
        </div>
        <Prog value={efficiency} color={effColor} h={4} />
      </div>
    </Card>
  );
}
