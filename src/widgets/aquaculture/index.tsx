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

// ── Tank Ecosystem ──────────────────────────────────────────────────
export function TankEcosystem({ title = 'Tank Ecosystem', waterTemp = 24.5, pH = 7.2, dissolvedO2 = 6.8, ammonia = 0.02 }: { title?: string; waterTemp?: number; pH?: number; dissolvedO2?: number; ammonia?: number } = {}) {
  const X = getX();
  const n = neo();
  const animTemp = useAnim(waterTemp, 1000);
  const animPH = useAnim(pH, 1000);
  const animO2 = useAnim(dissolvedO2, 1000);
  const tick = useTick(800);

  const tempColor = waterTemp > 30 ? X.red : waterTemp > 28 ? X.amber : X.teal;
  const phColor = pH < 6.5 || pH > 8.5 ? X.red : pH < 7 || pH > 8 ? X.amber : X.teal;
  const o2Color = dissolvedO2 < 4 ? X.red : dissolvedO2 < 5.5 ? X.amber : X.teal;
  const ammoniaColor = ammonia > 0.1 ? X.red : ammonia > 0.05 ? X.amber : X.teal;

  // Fish silhouette positions, gently moving with tick
  const fishPositions = [
    { x: 55 + Math.sin(tick * 0.3) * 8, y: 60, flip: false, size: 1 },
    { x: 130 + Math.sin(tick * 0.25 + 1) * 10, y: 75, flip: true, size: 0.8 },
    { x: 90 + Math.sin(tick * 0.35 + 2) * 6, y: 90, flip: false, size: 0.7 },
    { x: 160 + Math.sin(tick * 0.2 + 3) * 7, y: 55, flip: true, size: 0.9 },
  ];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={ammoniaColor}>{ammonia > 0.1 ? 'Warning' : ammonia > 0.05 ? 'Caution' : 'Healthy'}</Badge>
      </div>

      {/* Tank cross-section SVG */}
      <div style={{
        padding: 8, borderRadius: 8,
        background: X.bgAlt, boxShadow: n.concave, marginBottom: 12,
      }}>
        <svg viewBox="0 0 220 120" style={{ width: '100%', height: 130, display: 'block' }}>
          <defs>
            <linearGradient id="aq-water" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={X.teal} stopOpacity=".08" />
              <stop offset="100%" stopColor={X.teal} stopOpacity=".25" />
            </linearGradient>
            <linearGradient id="aq-tank-wall" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={X.border} stopOpacity=".5" />
              <stop offset="50%" stopColor={X.surface} stopOpacity=".3" />
              <stop offset="100%" stopColor={X.border} stopOpacity=".5" />
            </linearGradient>
          </defs>

          {/* Tank outline — rounded rectangle */}
          <rect x="15" y="10" width="190" height="100" rx="14"
            fill="url(#aq-water)" stroke={X.border} strokeWidth=".8" />

          {/* Water surface wavy line */}
          <path d={`M20 25 Q55 ${22 + Math.sin(tick * 0.4) * 2} 90 25 Q125 ${28 - Math.sin(tick * 0.4) * 2} 160 25 Q180 ${23 + Math.sin(tick * 0.4) * 1.5} 200 25`}
            fill="none" stroke={X.teal} strokeWidth=".6" opacity=".5" />

          {/* Bubbles */}
          {[0, 1, 2, 3, 4].map(i => {
            const bx = 40 + i * 35;
            const by = 95 - ((tick * 3 + i * 20) % 70);
            return <circle key={i} cx={bx} cy={by} r={1.2 + (i % 3) * 0.4}
              fill={X.teal} opacity={0.15 + (i % 3) * 0.08} />;
          })}

          {/* Fish silhouettes */}
          {fishPositions.map((f, i) => (
            <g key={i} transform={`translate(${f.x}, ${f.y}) scale(${f.flip ? -f.size : f.size}, ${f.size})`}>
              <path d="M0 0 L-12 -4 L-12 4 Z M-12 0 L-16 -3 L-16 3 Z"
                fill={X.teal} opacity=".3" />
            </g>
          ))}

          {/* Bottom substrate */}
          <path d="M20 105 Q60 100 110 103 Q160 100 200 105 L200 108 Q160 106 110 108 Q60 106 20 108 Z"
            fill={X.border} opacity=".3" />

          {/* Parameter labels around tank */}
          <text x="20" y="8" fontSize="5" fill={X.textMut} fontFamily="monospace">TEMP</text>
          <text x="20" y="118" fontSize="5" fill={X.textMut} fontFamily="monospace">NH\u2083</text>
          <text x="175" y="8" fontSize="5" fill={X.textMut} fontFamily="monospace">pH</text>
          <text x="175" y="118" fontSize="5" fill={X.textMut} fontFamily="monospace">O\u2082</text>
        </svg>
      </div>

      {/* Parameter readouts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
        {([
          ['Water Temp', `${animTemp.toFixed(1)}\u00b0C`, tempColor],
          ['pH Level', animPH.toFixed(2), phColor],
          ['Dissolved O\u2082', `${animO2.toFixed(1)} mg/L`, o2Color],
          ['Ammonia', `${ammonia.toFixed(3)} ppm`, ammoniaColor],
        ] as [string, string, string][]).map(([label, val, c], i) => (
          <div key={i} style={{
            padding: '6px 8px', borderRadius: 6,
            background: n.metal, boxShadow: n.raised, textAlign: 'center',
            animation: `fu 150ms ${ease.o} ${i * 30}ms both`,
          }}>
            <Lbl style={{ marginBottom: 2 }}>{label}</Lbl>
            <M style={{ fontSize: 14, fontWeight: 700, color: c, display: 'block' }}>{val}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Feeding Schedule ────────────────────────────────────────────────
export function FeedingSchedule({ title = 'Feeding Schedule', feedsPerDay = 4 }: { title?: string; feedsPerDay?: number } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(1000);
  const feeds = Math.min(Math.max(feedsPerDay, 1), 8);

  // Generate feed times evenly spaced across 24h
  const feedTimes = Array.from({ length: feeds }, (_, i) => {
    const h = Math.round((i / feeds) * 24 + 6) % 24;
    return { hour: h, dispensed: 125 + (i * 30) % 100, done: i < Math.floor(feeds * 0.6) };
  });

  const completedFeeds = feedTimes.filter(f => f.done).length;
  const nextFeed = feedTimes.find(f => !f.done);
  const countdown = nextFeed ? `${nextFeed.hour}:00` : 'All done';

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{completedFeeds}/{feeds} Fed</Badge>
      </div>

      {/* Timeline */}
      <div style={{
        padding: '12px 10px', borderRadius: 8,
        background: X.bgAlt, boxShadow: n.concave, marginBottom: 12,
      }}>
        <svg viewBox="0 0 220 50" style={{ width: '100%', height: 55, display: 'block' }}>
          {/* Time axis */}
          <line x1="10" y1="30" x2="210" y2="30" stroke={X.borderLight} strokeWidth=".6" />

          {/* Hour markers */}
          {[0, 6, 12, 18, 24].map((h, i) => {
            const px = 10 + (h / 24) * 200;
            return (
              <g key={i}>
                <line x1={px} y1="28" x2={px} y2="32" stroke={X.textMut} strokeWidth=".4" />
                <text x={px} y="38" textAnchor="middle" fontSize="4" fill={X.textMut} fontFamily="monospace">
                  {String(h % 24).padStart(2, '0')}:00
                </text>
              </g>
            );
          })}

          {/* Feed event dots */}
          {feedTimes.map((f, i) => {
            const px = 10 + (f.hour / 24) * 200;
            const color = f.done ? X.teal : X.amber;
            return (
              <g key={i}>
                <line x1={px} y1="20" x2={px} y2="30" stroke={color} strokeWidth=".4" opacity=".5" />
                <circle cx={px} cy="18" r={4} fill={f.done ? color : 'none'}
                  stroke={color} strokeWidth=".8"
                  style={{ filter: !f.done ? `drop-shadow(0 0 3px ${X.amber}40)` : 'none' }} />
                <text x={px} y="19.5" textAnchor="middle" fontSize="3.5"
                  fill={f.done ? X.bg : color} fontFamily="monospace" fontWeight="700">
                  {i + 1}
                </text>
                {/* Dispensed amount label */}
                <text x={px} y="11" textAnchor="middle" fontSize="3" fill={X.textMut} fontFamily="monospace">
                  {f.dispensed}g
                </text>
              </g>
            );
          })}

          {/* Current time indicator */}
          {(() => {
            const nowH = (tick * 0.05) % 24;
            const nowPx = 10 + (nowH / 24) * 200;
            return (
              <g>
                <line x1={nowPx} y1="25" x2={nowPx} y2="35" stroke={X.red} strokeWidth=".8" />
                <polygon points={`${nowPx - 2},44 ${nowPx + 2},44 ${nowPx},40`} fill={X.red} />
                <text x={nowPx} y="48" textAnchor="middle" fontSize="3.5" fill={X.red} fontFamily="monospace">
                  NOW
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 6 }}>
        <div style={{
          flex: 1, padding: '6px 8px', borderRadius: 6,
          background: n.metal, boxShadow: n.raised, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 2 }}>Next Feed</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: X.amber, display: 'block' }}>{countdown}</M>
        </div>
        <div style={{
          flex: 1, padding: '6px 8px', borderRadius: 6,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 2 }}>Total Today</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: X.teal, display: 'block' }}>
            {feedTimes.filter(f => f.done).reduce((s, f) => s + f.dispensed, 0)}g
          </M>
        </div>
        <div style={{
          flex: 1, padding: '6px 8px', borderRadius: 6,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 2 }}>Feeds/Day</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: X.indigo, display: 'block' }}>{feeds}</M>
        </div>
      </div>
    </Card>
  );
}

// ── Water Chemistry ─────────────────────────────────────────────────
export function WaterChemistry({ title = 'Water Chemistry', pH = 7.1, ammonia = 0.03, nitrite = 0.15, nitrate = 22, oxygen = 7.2 }: { title?: string; pH?: number; ammonia?: number; nitrite?: number; nitrate?: number; oxygen?: number } = {}) {
  const X = getX();
  const n = neo();

  // Normalize each param to 0-1 for radar chart
  const params = [
    { label: 'pH', value: pH, max: 14, color: X.teal },
    { label: 'NH\u2083', value: ammonia, max: 0.5, color: X.red },
    { label: 'NO\u2082', value: nitrite, max: 1, color: X.amber },
    { label: 'NO\u2083', value: nitrate, max: 80, color: X.purple },
    { label: 'O\u2082', value: oxygen, max: 12, color: X.indigo },
  ];
  const count = params.length;
  const cx = 100, cy = 65, radius = 45;

  // Helper to get polygon point for a given axis index and normalized value
  const getPoint = (i: number, norm: number) => {
    const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * radius * norm,
      y: cy + Math.sin(angle) * radius * norm,
    };
  };

  const dataPoints = params.map((p, i) =>
    getPoint(i, Math.min(1, p.value / p.max))
  );
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Status determination
  const phOk = pH >= 6.5 && pH <= 8.5;
  const ammoniaOk = ammonia <= 0.05;
  const nitriteOk = nitrite <= 0.25;
  const allOk = phOk && ammoniaOk && nitriteOk;
  const statusColor = allOk ? X.teal : X.amber;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={statusColor}>{allOk ? 'Normal' : 'Attention'}</Badge>
      </div>

      {/* Radar chart */}
      <div style={{
        padding: 8, borderRadius: 8,
        background: X.bgAlt, boxShadow: n.concave, marginBottom: 12,
      }}>
        <svg viewBox="0 0 200 130" style={{ width: '100%', height: 150, display: 'block' }}>
          <defs>
            <linearGradient id="aq-radar-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={X.teal} stopOpacity=".2" />
              <stop offset="100%" stopColor={X.teal} stopOpacity=".05" />
            </linearGradient>
          </defs>

          {/* Grid rings */}
          {[0.25, 0.5, 0.75, 1].map((ring, ri) => {
            const ringPoints = Array.from({ length: count }, (_, i) => {
              const pt = getPoint(i, ring);
              return `${pt.x},${pt.y}`;
            }).join(' ');
            return <polygon key={ri} points={ringPoints}
              fill="none" stroke={X.borderLight} strokeWidth=".3" />;
          })}

          {/* Axis lines */}
          {params.map((_, i) => {
            const pt = getPoint(i, 1);
            return <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y}
              stroke={X.borderLight} strokeWidth=".3" />;
          })}

          {/* Data polygon */}
          <polygon points={dataPolygon} fill="url(#aq-radar-fill)"
            stroke={X.teal} strokeWidth="1" strokeLinejoin="round"
            style={{ filter: `drop-shadow(0 0 4px ${X.teal}30)` }} />

          {/* Data points and labels */}
          {params.map((p, i) => {
            const pt = dataPoints[i];
            const labelPt = getPoint(i, 1.22);
            return (
              <g key={i}>
                <circle cx={pt.x} cy={pt.y} r="2.5" fill={p.color}
                  style={{ filter: `drop-shadow(0 0 2px ${p.color}40)` }} />
                <text x={labelPt.x} y={labelPt.y - 3} textAnchor="middle"
                  fontSize="4.5" fontWeight="700" fill={p.color} fontFamily="monospace">
                  {p.label}
                </text>
                <text x={labelPt.x} y={labelPt.y + 3} textAnchor="middle"
                  fontSize="3.5" fill={X.textMut} fontFamily="monospace">
                  {p.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Parameter bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {params.map((p, i) => {
          const pct = Math.min(100, (p.value / p.max) * 100);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <M style={{ fontSize: 8, color: X.textMut, width: 24, textAlign: 'right' }}>{p.label}</M>
              <div style={{ flex: 1 }}>
                <Prog value={pct} color={p.color} h={3} />
              </div>
              <M style={{ fontSize: 8, fontWeight: 700, color: p.color, width: 35, textAlign: 'right' }}>
                {p.value}
              </M>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Stock Density ───────────────────────────────────────────────────
export function StockDensity({ title = 'Stock Density', fishCount = 2400, volumeM3 = 50, mortalityPct = 1.2 }: { title?: string; fishCount?: number; volumeM3?: number; mortalityPct?: number } = {}) {
  const X = getX();
  const n = neo();
  const animCount = useAnim(fishCount, 1200);
  const animMortality = useAnim(mortalityPct, 1000);

  const density = volumeM3 > 0 ? fishCount / volumeM3 : 0;
  const densityColor = density > 60 ? X.red : density > 40 ? X.amber : X.teal;
  const mortalityColor = mortalityPct > 5 ? X.red : mortalityPct > 2 ? X.amber : X.teal;

  // Trend arrow
  const trendUp = mortalityPct > 2;

  // Population bar segments
  const maxFish = 5000;
  const fishPct = Math.min(100, (fishCount / maxFish) * 100);
  const deadPct = Math.min(100, mortalityPct);

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={densityColor}>{density.toFixed(0)} fish/m\u00b3</Badge>
      </div>

      {/* Main metrics */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <div style={{
          flex: 1, padding: '10px 12px', borderRadius: 8,
          background: n.metal, boxShadow: n.concave, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 4 }}>Population</Lbl>
          <M style={{ fontSize: 26, fontWeight: 800, color: X.teal, display: 'block' }}>
            {Math.round(animCount).toLocaleString()}
          </M>
          <M style={{ fontSize: 8, color: X.textMut }}>live fish</M>
        </div>
        <div style={{
          flex: 1, padding: '10px 12px', borderRadius: 8,
          background: n.metal, boxShadow: n.concave, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 4 }}>Volume</Lbl>
          <M style={{ fontSize: 26, fontWeight: 800, color: X.indigo, display: 'block' }}>
            {volumeM3}
          </M>
          <M style={{ fontSize: 8, color: X.textMut }}>m\u00b3</M>
        </div>
      </div>

      {/* Population bar */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <Lbl>Population Level</Lbl>
          <M style={{ fontSize: 9, fontWeight: 700, color: densityColor }}>{fishPct.toFixed(0)}%</M>
        </div>
        <Prog value={fishPct} color={densityColor} h={6} />
      </div>

      {/* Mortality with trend */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 10px', borderRadius: 6,
        background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Dot c={mortalityColor} s={6} pulse={mortalityPct > 3} />
          <div>
            <Lbl style={{ marginBottom: 0 }}>Mortality Rate</Lbl>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <M style={{ fontSize: 16, fontWeight: 800, color: mortalityColor }}>
            {animMortality.toFixed(1)}%
          </M>
          <svg viewBox="0 0 12 12" style={{ width: 14, height: 14 }}>
            <path d={trendUp ? 'M6 2 L10 8 L2 8 Z' : 'M6 10 L10 4 L2 4 Z'}
              fill={trendUp ? X.red : X.teal} opacity=".8" />
          </svg>
        </div>
      </div>
    </Card>
  );
}

// ── Aeration Status ─────────────────────────────────────────────────
export function AerationStatus({ title = 'Aeration', pumpRunning = true, o2Saturation = 82 }: { title?: string; pumpRunning?: boolean; o2Saturation?: number } = {}) {
  const X = getX();
  const n = neo();
  const animO2 = useAnim(o2Saturation, 1000);
  const tick = useTick(300);

  const statusColor = pumpRunning ? X.teal : X.red;
  const satColor = o2Saturation < 60 ? X.red : o2Saturation < 75 ? X.amber : X.teal;

  // Generate bubble positions that rise upward
  const bubbles = Array.from({ length: 12 }, (_, i) => {
    const phase = (tick * 4 + i * 25) % 100;
    return {
      x: 25 + (i % 4) * 16 + Math.sin(i * 1.3) * 5,
      y: 90 - phase * 0.8,
      r: 1 + (i % 3) * 0.8,
      opacity: pumpRunning ? Math.max(0, 0.4 - phase * 0.004) : 0.05,
    };
  });

  // O2 saturation curve data (12 points)
  const history = Array.from({ length: 12 }, (_, i) =>
    o2Saturation - 8 + (i / 11) * 8 + Math.sin(i * 0.7) * 3
  );
  const minV = Math.min(...history) - 2;
  const maxV = Math.max(...history) + 2;
  const rangeV = maxV - minV || 1;

  const curvePoints = history.map((v, i) => {
    const px = 110 + (i / 11) * 80;
    const py = 15 + ((maxV - v) / rangeV) * 65;
    return `${px},${py}`;
  }).join(' ');

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={statusColor}>{pumpRunning ? 'Running' : 'Stopped'}</Badge>
      </div>

      <div style={{
        padding: 8, borderRadius: 8,
        background: X.bgAlt, boxShadow: n.concave, marginBottom: 12,
      }}>
        <svg viewBox="0 0 200 100" style={{ width: '100%', height: 120, display: 'block' }}>
          <defs>
            <linearGradient id="aq-aer-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={satColor} stopOpacity=".15" />
              <stop offset="100%" stopColor={satColor} stopOpacity=".02" />
            </linearGradient>
          </defs>

          {/* Bubble column area (left side) */}
          <rect x="10" y="5" width="85" height="90" rx="8"
            fill={X.teal} opacity=".04" stroke={X.borderLight} strokeWidth=".3" />

          {/* Aerator pump icon at bottom */}
          <rect x="35" y="82" width="20" height="10" rx="3"
            fill={n.metal.includes('linear') ? X.surface : X.surface}
            stroke={statusColor} strokeWidth=".6" />
          <circle cx="45" cy="87" r="2.5" fill={statusColor} opacity={pumpRunning ? '.8' : '.2'}>
            {pumpRunning && <animate attributeName="opacity" values=".8;.4;.8" dur="1.5s" repeatCount="indefinite" />}
          </circle>

          {/* Rising bubbles */}
          {bubbles.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r={b.r}
              fill={X.teal} opacity={b.opacity}
              style={{ transition: `cy 250ms ${ease.o}` }} />
          ))}

          {/* Pump label */}
          <text x="45" y="78" textAnchor="middle" fontSize="4" fill={X.textMut} fontFamily="monospace">
            AERATOR
          </text>

          {/* O2 saturation curve (right side) */}
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
            <line key={i} x1="110" y1={15 + p * 65} x2="195" y2={15 + p * 65}
              stroke={X.borderLight} strokeWidth=".2" strokeDasharray="2,2" />
          ))}

          {/* Area fill */}
          <polygon points={`110,${15 + 65} ${curvePoints} 190,${15 + 65}`}
            fill="url(#aq-aer-fill)" />

          {/* Curve line */}
          <polyline points={curvePoints} fill="none" stroke={satColor}
            strokeWidth="1" strokeLinejoin="round" strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 2px ${satColor}30)` }} />

          {/* Data point dots */}
          {history.map((v, i) => {
            const px = 110 + (i / 11) * 80;
            const py = 15 + ((maxV - v) / rangeV) * 65;
            return <circle key={i} cx={px} cy={py} r={i === 11 ? 2 : 0.8}
              fill={i === 11 ? satColor : satColor + '60'} />;
          })}

          {/* Y-axis labels */}
          <text x="108" y="18" fontSize="3.5" fill={X.textMut} fontFamily="monospace" textAnchor="end">
            {maxV.toFixed(0)}%
          </text>
          <text x="108" y="82" fontSize="3.5" fill={X.textMut} fontFamily="monospace" textAnchor="end">
            {minV.toFixed(0)}%
          </text>
          <text x="150" y="10" textAnchor="middle" fontSize="4" fill={X.textMut} fontFamily="monospace">
            O\u2082 SATURATION
          </text>
        </svg>
      </div>

      {/* Bottom stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        <div style={{
          flex: 1, padding: '8px 10px', borderRadius: 6,
          background: n.metal, boxShadow: n.raised, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 3 }}>O\u2082 Saturation</Lbl>
          <M style={{ fontSize: 20, fontWeight: 800, color: satColor, display: 'block' }}>
            {animO2.toFixed(1)}%
          </M>
        </div>
        <div style={{
          flex: 1, padding: '8px 10px', borderRadius: 6,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 3 }}>Pump Status</Lbl>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            <Dot c={statusColor} s={7} pulse={pumpRunning} />
            <M style={{ fontSize: 12, fontWeight: 700, color: statusColor }}>
              {pumpRunning ? 'ON' : 'OFF'}
            </M>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Harvest Planner ─────────────────────────────────────────────────
export function HarvestPlanner({ title = 'Harvest Planner', currentWeightG = 320, targetWeightG = 500, daysToHarvest = 45 }: { title?: string; currentWeightG?: number; targetWeightG?: number; daysToHarvest?: number } = {}) {
  const X = getX();
  const n = neo();
  const animWeight = useAnim(currentWeightG, 1200);

  const progressPct = targetWeightG > 0 ? Math.min(100, (currentWeightG / targetWeightG) * 100) : 0;
  const animProgress = useAnim(progressPct, 1000);
  const progressColor = progressPct > 90 ? X.teal : progressPct > 60 ? X.indigo : X.amber;

  // Growth curve data (simulated: 20 points from start to now + projected)
  const totalDays = daysToHarvest + 30; // assume we're 30 days in
  const currentDay = 30;
  const growthData = Array.from({ length: 20 }, (_, i) => {
    const day = (i / 19) * totalDays;
    // Sigmoid-ish growth curve
    const t = day / totalDays;
    const weight = targetWeightG * (1 / (1 + Math.exp(-8 * (t - 0.4))));
    return { day, weight, isPast: day <= currentDay };
  });

  const chartW = 190, chartH = 70, padL = 10, padT = 8;
  const maxW = targetWeightG * 1.1;

  const allPoints = growthData.map((d, i) => {
    const px = padL + (d.day / totalDays) * chartW;
    const py = padT + chartH - (d.weight / maxW) * chartH;
    return `${px},${py}`;
  });

  const pastPoints = growthData.filter(d => d.isPast).map((d) => {
    const px = padL + (d.day / totalDays) * chartW;
    const py = padT + chartH - (d.weight / maxW) * chartH;
    return `${px},${py}`;
  });

  // Target line y position
  const targetY = padT + chartH - (targetWeightG / maxW) * chartH;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={progressColor}>{daysToHarvest}d to Harvest</Badge>
      </div>

      {/* Growth chart */}
      <div style={{
        padding: 8, borderRadius: 8,
        background: X.bgAlt, boxShadow: n.concave, marginBottom: 12,
      }}>
        <svg viewBox="0 0 210 95" style={{ width: '100%', height: 120, display: 'block' }}>
          <defs>
            <linearGradient id="aq-growth-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={X.teal} stopOpacity=".2" />
              <stop offset="100%" stopColor={X.teal} stopOpacity=".02" />
            </linearGradient>
          </defs>

          {/* Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
            <line key={i} x1={padL} y1={padT + p * chartH} x2={padL + chartW} y2={padT + p * chartH}
              stroke={X.borderLight} strokeWidth=".2" strokeDasharray="2,2" />
          ))}

          {/* Target weight line */}
          <line x1={padL} y1={targetY} x2={padL + chartW} y2={targetY}
            stroke={X.amber} strokeWidth=".6" strokeDasharray="4,3" opacity=".7" />
          <text x={padL + chartW + 2} y={targetY + 1.5} fontSize="3.5" fill={X.amber} fontFamily="monospace">
            {targetWeightG}g
          </text>

          {/* Projected curve (dashed, full) */}
          <polyline points={allPoints.join(' ')} fill="none" stroke={X.textMut}
            strokeWidth=".6" strokeDasharray="3,2" opacity=".4" />

          {/* Area fill for actual growth */}
          {pastPoints.length > 1 && (
            <polygon
              points={`${padL},${padT + chartH} ${pastPoints.join(' ')} ${pastPoints[pastPoints.length - 1].split(',')[0]},${padT + chartH}`}
              fill="url(#aq-growth-fill)"
            />
          )}

          {/* Actual growth curve (solid) */}
          {pastPoints.length > 1 && (
            <polyline points={pastPoints.join(' ')} fill="none" stroke={X.teal}
              strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 2px ${X.teal}30)` }} />
          )}

          {/* Current position dot */}
          {(() => {
            const lastPast = pastPoints[pastPoints.length - 1];
            if (!lastPast) return null;
            const [cpx, cpy] = lastPast.split(',').map(Number);
            return (
              <g>
                <circle cx={cpx} cy={cpy} r="3" fill={X.teal}
                  style={{ filter: `drop-shadow(0 0 4px ${X.teal}50)` }} />
                <text x={cpx} y={cpy - 5} textAnchor="middle" fontSize="4"
                  fontWeight="700" fill={X.teal} fontFamily="monospace">
                  {currentWeightG}g
                </text>
              </g>
            );
          })()}

          {/* X-axis labels */}
          <text x={padL} y={padT + chartH + 8} fontSize="3.5" fill={X.textMut} fontFamily="monospace">Day 0</text>
          <text x={padL + chartW} y={padT + chartH + 8} fontSize="3.5" fill={X.textMut} fontFamily="monospace" textAnchor="end">
            Day {Math.round(totalDays)}
          </text>

          {/* Harvest marker */}
          {(() => {
            const hx = padL + (totalDays / totalDays) * chartW;
            return (
              <g>
                <line x1={hx - 1} y1={padT} x2={hx - 1} y2={padT + chartH}
                  stroke={X.purple} strokeWidth=".4" strokeDasharray="2,2" opacity=".5" />
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <Lbl>Growth Progress</Lbl>
          <M style={{ fontSize: 9, fontWeight: 700, color: progressColor }}>{animProgress.toFixed(0)}%</M>
        </div>
        <Prog value={progressPct} color={progressColor} h={5} />
      </div>

      {/* Bottom stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {([
          ['Current', `${Math.round(animWeight)}g`, X.teal],
          ['Target', `${targetWeightG}g`, X.amber],
          ['Remaining', `${daysToHarvest}d`, X.purple],
        ] as [string, string, string][]).map(([label, val, c], i) => (
          <div key={i} style={{
            flex: 1, padding: '6px 8px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
            animation: `fu 150ms ${ease.o} ${i * 30}ms both`,
          }}>
            <Lbl style={{ marginBottom: 2 }}>{label}</Lbl>
            <M style={{ fontSize: 13, fontWeight: 700, color: c, display: 'block' }}>{val}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}
