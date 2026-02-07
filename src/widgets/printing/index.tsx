import { useState } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { useAnim, useLive, useTick } from '../hooks';

function neo() { const X = getX(); const dark = X.bg + '40'; const light = '#ffffff12'; return { raised: '4px 4px 10px ' + dark + ', -2px -2px 6px ' + light, concave: 'inset 3px 3px 8px ' + dark + ', inset -2px -2px 5px ' + light, bezel: 'inset 0 1px 0 ' + light + ', inset 0 -1px 0 rgba(0,0,0,0.3), 0 2px 8px ' + dark, metal: 'linear-gradient(135deg, ' + X.surface + ', ' + X.bgAlt + ' 40%, ' + X.surface + ' 60%, ' + X.bgAlt + ')' }; }

// ── Ink Density Meter ────────────────────────────────────────────────
export function InkDensityMeter({ title = 'Ink Density' } = {}) {
  const X = getX();
  const n = neo();
  const colors = [
    { name: 'C', fill: '#00bcd4', base: 1.45 },
    { name: 'M', fill: '#e91e63', base: 1.52 },
    { name: 'Y', fill: '#ffc107', base: 1.08 },
    { name: 'K', fill: '#424242', base: 1.78 },
  ];
  const densities = [
    useLive(1.45, 0.06, 1800),
    useLive(1.52, 0.05, 2000),
    useLive(1.08, 0.04, 2200),
    useLive(1.78, 0.07, 1600),
  ];
  const tick = useTick(80);
  const dripWell = 2;
  const dripY = (tick * 1.5) % 40;

  const renderDigit = (value: number, idx: number) => {
    const str = value.toFixed(2);
    const digits = str.replace('.', '').split('');
    return (
      <div style={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
        {digits.map((d, di) => (
          <div key={di} style={{
            width: 10, height: 14, overflow: 'hidden', borderRadius: 2,
            background: X.bgAlt, position: 'relative',
            boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.3), inset 0 -4px 6px rgba(0,0,0,0.15)',
          }}>
            <div style={{
              position: 'absolute', left: 0, right: 0,
              transform: `translateY(${-parseInt(d) * 14}px)`,
              transition: `transform 400ms ${ease.sp}`,
            }}>
              {[0,1,2,3,4,5,6,7,8,9].map(n => (
                <div key={n} style={{
                  height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: X.m, fontSize: 9, fontWeight: 700, color: colors[idx].fill,
                }}>{n}</div>
              ))}
            </div>
            {di === 0 && (
              <div style={{
                position: 'absolute', bottom: -1, right: -2,
                fontFamily: X.m, fontSize: 5, color: X.textMut,
              }}>.</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card style={{ width: 350 }} glow={X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>CMYK</Badge>
      </div>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 12 }}>
        {colors.map((c, i) => {
          const level = 40 + densities[i] * 20;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, animation: `fu 180ms ${ease.o} ${i * 40}ms both` }}>
              <Lbl>{c.name}</Lbl>
              <div style={{ position: 'relative' }}>
                <svg width="50" height="70" viewBox="0 0 50 70">
                  <rect id={`print-well-${c.name}`} x="5" y="5" width="40" height="60" rx="5" ry="5"
                    fill={X.bgAlt} stroke={X.borderLight} strokeWidth="1" />
                  <rect x="5" y={70 - level} width="40" height={level - 5} rx="0" ry="0"
                    fill={c.fill + '60'} />
                  <path d={`M5,${70 - level} Q15,${70 - level + 4} 25,${70 - level} Q35,${70 - level - 3} 45,${70 - level}`}
                    fill={c.fill + '90'} />
                  <rect x="5" y="5" width="40" height="60" rx="5" ry="5"
                    fill="none" stroke={c.fill + '40'} strokeWidth="1.5" />
                  {i === dripWell && (
                    <circle cx="25" cy={65 + dripY} r="2.5" fill={c.fill} opacity={dripY < 35 ? 0.8 : 0}>
                    </circle>
                  )}
                </svg>
              </div>
              {renderDigit(densities[i], i)}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Dot c={X.teal} pulse s={5} />
          <M style={{ fontSize: 8, color: X.textMut }}>Densitometer Active</M>
        </div>
        <M style={{ fontSize: 8, color: X.textMut }}>Target: 1.40 - 1.80</M>
      </div>
    </Card>
  );
}

// ── CMYK Registration ────────────────────────────────────────────────
export function CMYKRegistration({ title = 'Registration' } = {}) {
  const X = getX();
  const n = neo();
  const offset = useLive(0.3, 0.2, 3000);
  const quality = Math.max(0, 100 - offset * 200);
  const qualityLabel = quality > 90 ? 'Excellent' : quality > 70 ? 'Good' : 'Poor';
  const qualityColor = quality > 90 ? X.teal : quality > 70 ? X.amber : X.red;

  const layers = [
    { name: 'C', color: '#00bcd4', dx: -offset * 0.8, dy: offset * 0.5 },
    { name: 'M', color: '#e91e63', dx: offset * 0.6, dy: -offset * 0.4 },
    { name: 'Y', color: '#ffc107', dx: offset * 0.3, dy: offset * 0.7 },
    { name: 'K', color: '#424242', dx: 0, dy: 0 },
  ];

  const targetSize = 120;
  const cx = targetSize / 2;
  const cy = targetSize / 2;

  const loupeX = cx - 15;
  const loupeY = cy - 15;
  const loupeR = 28;

  return (
    <Card style={{ width: 350 }} glow={X.purple}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={qualityColor} solid>{qualityLabel}</Badge>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12, position: 'relative' }}>
        <svg id="print-reg-target" width={targetSize} height={targetSize} viewBox={`0 0 ${targetSize} ${targetSize}`}
          style={{ background: X.bgAlt, borderRadius: X.rs, border: `1px solid ${X.borderLight}` }}>
          {[30, 20, 10].map((r, i) => (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={X.borderLight} strokeWidth="0.5" />
          ))}
          {layers.map((l, i) => (
            <g key={i} transform={`translate(${l.dx * 8}, ${l.dy * 8})`} opacity="0.7">
              <line x1={cx - 25} y1={cy} x2={cx + 25} y2={cy} stroke={l.color} strokeWidth="1.2" />
              <line x1={cx} y1={cy - 25} x2={cx} y2={cy + 25} stroke={l.color} strokeWidth="1.2" />
            </g>
          ))}
        </svg>
        <div style={{
          position: 'absolute',
          left: `calc(50% - ${targetSize / 2 - loupeX + loupeR}px)`,
          top: loupeY - loupeR + 4,
          width: loupeR * 2, height: loupeR * 2,
          borderRadius: '50%', overflow: 'hidden',
          border: `2px solid ${X.textMut}`,
          boxShadow: n.raised,
          pointerEvents: 'none',
        }}>
          <svg width={loupeR * 2} height={loupeR * 2}
            viewBox={`${loupeX - loupeR / 2} ${loupeY - loupeR / 2} ${loupeR} ${loupeR}`}
            style={{ transform: 'scale(2)', transformOrigin: 'center' }}>
            {layers.map((l, i) => (
              <g key={i} transform={`translate(${l.dx * 8}, ${l.dy * 8})`} opacity="0.85">
                <line x1={cx - 25} y1={cy} x2={cx + 25} y2={cy} stroke={l.color} strokeWidth="1.2" />
                <line x1={cx} y1={cy - 25} x2={cx} y2={cy + 25} stroke={l.color} strokeWidth="1.2" />
              </g>
            ))}
          </svg>
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'radial-gradient(circle, transparent 40%, #4488ff08 100%)',
            pointerEvents: 'none',
          }} />
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {([
          ['Offset', `${(offset * 100).toFixed(0)} \u00b5m`, qualityColor],
          ['Score', `${quality.toFixed(1)}%`, qualityColor],
          ['LPI', '175', X.purple],
        ] as [string, string, string][]).map(([l, v, c], i) => (
          <div key={i} style={{ padding: '5px 6px', borderRadius: X.rs, background: X.bgAlt, textAlign: 'center', animation: `fu 150ms ${ease.o} ${i * 25}ms both` }}>
            <Lbl style={{ marginBottom: 3 }}>{l}</Lbl>
            <M style={{ fontSize: 11, fontWeight: 700, color: c }}>{v}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Paper Tension ────────────────────────────────────────────────────
export function PaperTension({ title = 'Paper Tension', maxTension = 100 } = {}) {
  const X = getX();
  const n = neo();
  const tension = useLive(65, 8, 2000);
  const tensionPct = Math.min(100, Math.max(0, (tension / maxTension) * 100));
  const sagAmount = Math.max(2, 30 - (tension / maxTension) * 28);
  const isLow = tension < maxTension * 0.3;
  const isHigh = tension > maxTension * 0.85;
  const statusColor = isLow || isHigh ? X.amber : X.teal;
  const statusLabel = isLow ? 'Too Loose' : isHigh ? 'Too Tight' : 'Optimal';

  const rollers = [
    { cx: 50, cy: 55 },
    { cx: 150, cy: 40 },
    { cx: 250, cy: 55 },
  ];
  const rRadius = 14;

  const pathD = `M${rollers[0].cx},${rollers[0].cy - rRadius} C${rollers[0].cx + 30},${rollers[0].cy + sagAmount} ${rollers[1].cx - 30},${rollers[1].cy - sagAmount * 0.6} ${rollers[1].cx},${rollers[1].cy - rRadius} C${rollers[1].cx + 30},${rollers[1].cy + sagAmount * 0.4} ${rollers[2].cx - 30},${rollers[2].cy + sagAmount} ${rollers[2].cx},${rollers[2].cy - rRadius}`;

  return (
    <Card style={{ width: 350 }} glow={statusColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={statusColor} solid>{statusLabel}</Badge>
      </div>
      <svg id="print-tension" width="100%" viewBox="0 0 300 90" style={{ display: 'block', marginBottom: 10 }}>
        <defs>
          <linearGradient id="print-roller-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={X.textSec} />
            <stop offset="40%" stopColor={X.bgAlt} />
            <stop offset="60%" stopColor={X.textSec} />
            <stop offset="100%" stopColor={X.bgAlt} />
          </linearGradient>
        </defs>
        <path d={pathD} fill="none" stroke={X.textSec + '50'} strokeWidth="3"
          style={{ transition: `d 500ms ${ease.mv}` }} />
        <path d={pathD} fill="none" stroke={statusColor + '30'} strokeWidth="6"
          style={{ transition: `d 500ms ${ease.mv}` }} />
        {rollers.map((r, i) => (
          <g key={i}>
            <circle cx={r.cx} cy={r.cy} r={rRadius} fill="url(#print-roller-grad)"
              stroke={X.borderLight} strokeWidth="1" />
            <circle cx={r.cx} cy={r.cy} r={3} fill={X.borderLight} />
            <line x1={r.cx} y1={r.cy + rRadius} x2={r.cx} y2={r.cy + rRadius + 10}
              stroke={X.borderLight} strokeWidth="2" />
            <text x={r.cx} y={r.cy + rRadius + 20} textAnchor="middle"
              fontFamily={X.m} fontSize="7" fill={X.textMut}>R{i + 1}</text>
          </g>
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Tension</Lbl>
          <M style={{ fontSize: 18, fontWeight: 800, color: statusColor }}>
            {tension.toFixed(1)} <span style={{ fontSize: 9, color: X.textMut }}>N/m</span>
          </M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>Range</Lbl>
          <M style={{ fontSize: 10, fontWeight: 600, color: X.textMut }}>
            {(maxTension * 0.3).toFixed(0)} - {(maxTension * 0.85).toFixed(0)} N/m
          </M>
        </div>
      </div>
      <Prog value={tensionPct} color={statusColor} h={3} />
      {(isLow || isHigh) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, padding: '4px 8px', borderRadius: X.rs, background: X.amber + '12', border: `1px solid ${X.amber}25` }}>
          <Dot c={X.amber} pulse s={5} />
          <M style={{ fontSize: 8, fontWeight: 600, color: X.amber }}>
            {isLow ? 'Tension below minimum - risk of paper wander' : 'Tension above maximum - risk of web break'}
          </M>
        </div>
      )}
    </Card>
  );
}

// ── Press Cylinder ───────────────────────────────────────────────────
export function PressCylinder({ title = 'Press Cylinder' } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(40);
  const speed = useLive(8500, 200, 2500);
  const pressure = useLive(4.2, 0.3, 3000);
  const sheetCount = Math.floor(tick * (speed / 3600));
  const digits = String(Math.min(sheetCount, 999999)).padStart(6, '0').split('');

  const cylRadius = 30;
  const impAngle = (tick * 9) % 360;
  const blnAngle = (-tick * 9) % 360;
  const pressureOk = pressure > 3.5 && pressure < 5.0;

  return (
    <Card style={{ width: 350 }} glow={X.indigo}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>Offset</Badge>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <svg id="print-cylinders" width="220" height="100" viewBox="0 0 220 100">
          <defs>
            <linearGradient id="print-cyl-imp" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={X.textSec} />
              <stop offset="35%" stopColor={X.bgAlt} />
              <stop offset="55%" stopColor={X.textSec} />
              <stop offset="100%" stopColor={X.bgAlt} />
            </linearGradient>
            <linearGradient id="print-cyl-bln" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={X.indigo + '60'} />
              <stop offset="40%" stopColor={X.bgAlt} />
              <stop offset="65%" stopColor={X.indigo + '40'} />
              <stop offset="100%" stopColor={X.bgAlt} />
            </linearGradient>
          </defs>
          <g transform={`rotate(${impAngle}, 75, 50)`}>
            <circle cx="75" cy="50" r={cylRadius} fill="url(#print-cyl-imp)" stroke={X.borderLight} strokeWidth="1" />
            <line x1="75" y1={50 - cylRadius} x2="75" y2={50 + cylRadius} stroke={X.borderLight} strokeWidth="0.5" opacity="0.4" />
            <line x1={75 - cylRadius} y1="50" x2={75 + cylRadius} y2="50" stroke={X.borderLight} strokeWidth="0.5" opacity="0.4" />
          </g>
          <circle cx="75" cy="50" r="4" fill={X.bgAlt} stroke={X.borderLight} strokeWidth="1" />
          <g transform={`rotate(${blnAngle}, 145, 50)`}>
            <circle cx="145" cy="50" r={cylRadius} fill="url(#print-cyl-bln)" stroke={X.borderLight} strokeWidth="1" />
            <line x1="145" y1={50 - cylRadius} x2="145" y2={50 + cylRadius} stroke={X.borderLight} strokeWidth="0.5" opacity="0.4" />
            <line x1={145 - cylRadius} y1="50" x2={145 + cylRadius} y2="50" stroke={X.borderLight} strokeWidth="0.5" opacity="0.4" />
          </g>
          <circle cx="145" cy="50" r="4" fill={X.bgAlt} stroke={X.borderLight} strokeWidth="1" />
          <text x="75" y="92" textAnchor="middle" fontFamily={X.m} fontSize="7" fill={X.textMut}>Impression</text>
          <text x="145" y="92" textAnchor="middle" fontFamily={X.m} fontSize="7" fill={X.textMut}>Blanket</text>
          <line x1={75 + cylRadius + 2} y1="44" x2={145 - cylRadius - 2} y2="44" stroke={pressureOk ? X.teal : X.amber} strokeWidth="2" strokeDasharray="3,2" />
          <line x1={75 + cylRadius + 2} y1="56" x2={145 - cylRadius - 2} y2="56" stroke={pressureOk ? X.teal : X.amber} strokeWidth="2" strokeDasharray="3,2" />
          <text x="110" y="52" textAnchor="middle" fontFamily={X.m} fontSize="6" fill={pressureOk ? X.teal : X.amber} fontWeight="700">
            {pressure.toFixed(1)} bar
          </text>
        </svg>
      </div>
      <Lbl style={{ marginBottom: 4 }}>Sheet Counter</Lbl>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 10 }}>
        {digits.map((d, i) => (
          <div key={i} style={{
            width: 22, height: 28, overflow: 'hidden', borderRadius: 3,
            background: X.bgAlt, position: 'relative',
            boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.3), inset 0 -4px 6px rgba(0,0,0,0.15)',
            border: `1px solid ${X.borderLight}`,
          }}>
            <div style={{
              position: 'absolute', left: 0, right: 0,
              transform: `translateY(${-parseInt(d) * 28}px)`,
              transition: `transform 300ms ${ease.sp}`,
            }}>
              {[0,1,2,3,4,5,6,7,8,9].map(n => (
                <div key={n} style={{
                  height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: X.m, fontSize: 16, fontWeight: 800, color: X.indigo,
                }}>{n}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Speed</Lbl>
          <M style={{ fontSize: 12, fontWeight: 800, color: X.text }}>
            {Math.round(speed).toLocaleString()} <span style={{ fontSize: 8, color: X.textMut }}>sph</span>
          </M>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Lbl style={{ marginBottom: 2 }}>Pressure</Lbl>
          <M style={{ fontSize: 12, fontWeight: 700, color: pressureOk ? X.teal : X.amber }}>
            {pressure.toFixed(1)} bar
          </M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>Status</Lbl>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, justifyContent: 'flex-end' }}>
            <Dot c={X.teal} pulse s={5} />
            <M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>Running</M>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Color Separation ─────────────────────────────────────────────────
export function ColorSeparation({ title = 'Color Separation' } = {}) {
  const X = getX();
  const n = neo();
  const [plates, setPlates] = useState({ C: true, M: true, Y: true, K: true });
  const lpi = 175;

  const cmykLayers = [
    { key: 'C' as const, color: '#00bcd4', angle: 15 },
    { key: 'M' as const, color: '#e91e63', angle: 75 },
    { key: 'Y' as const, color: '#ffc107', angle: 0 },
    { key: 'K' as const, color: '#424242', angle: 45 },
  ];

  const dotSpacing = 10;
  const gridSize = 140;
  const dotR = 2.2;

  const renderHalftone = (color: string, angle: number, opacity: number) => {
    const dots: { x: number; y: number }[] = [];
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    for (let row = -5; row < gridSize / dotSpacing + 5; row++) {
      for (let col = -5; col < gridSize / dotSpacing + 5; col++) {
        const bx = col * dotSpacing;
        const by = row * dotSpacing;
        const rx = bx * cos - by * sin + gridSize / 2;
        const ry = bx * sin + by * cos + gridSize / 2;
        if (rx > -dotR && rx < gridSize + dotR && ry > -dotR && ry < gridSize + dotR) {
          dots.push({ x: rx, y: ry });
        }
      }
    }
    return dots.map((d, i) => (
      <circle key={i} cx={d.x} cy={d.y} r={dotR + Math.sin(d.x * 0.1 + d.y * 0.07) * 0.8}
        fill={color} opacity={opacity} />
    ));
  };

  const activeCount = Object.values(plates).filter(Boolean).length;

  return (
    <Card style={{ width: 350 }} glow={X.pink}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.pink}>{activeCount}/4 Plates</Badge>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <svg id="print-separation" width={gridSize} height={gridSize} viewBox={`0 0 ${gridSize} ${gridSize}`}
          style={{ background: '#ffffff', borderRadius: X.rs, border: `1px solid ${X.borderLight}`, overflow: 'hidden' }}>
          {cmykLayers.map(l => plates[l.key] && (
            <g key={l.key}>
              {renderHalftone(l.color, l.angle, 0.45)}
            </g>
          ))}
        </svg>
      </div>
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 10 }}>
        {cmykLayers.map(l => (
          <Btn key={l.key} small ghost active={plates[l.key]} color={l.color}
            onClick={() => setPlates(p => ({ ...p, [l.key]: !p[l.key] }))}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: plates[l.key] ? l.color : X.borderLight, marginRight: 2 }} />
            {l.key}
          </Btn>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 4 }}>
        {cmykLayers.map((l, i) => (
          <div key={i} style={{ padding: '4px 5px', borderRadius: X.rs, background: X.bgAlt, textAlign: 'center', opacity: plates[l.key] ? 1 : 0.3, transition: `opacity 200ms ${ease.mv}` }}>
            <Lbl style={{ marginBottom: 2 }}>{l.key} Angle</Lbl>
            <M style={{ fontSize: 10, fontWeight: 700, color: l.color }}>{l.angle}°</M>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Screen Ruling: {lpi} LPI</M>
        <M style={{ fontSize: 8, color: activeCount === 4 ? X.teal : X.textMut }}>
          {activeCount === 4 ? 'Composite View' : `${activeCount} plate${activeCount !== 1 ? 's' : ''} visible`}
        </M>
      </div>
    </Card>
  );
}

// ── Drying Oven ──────────────────────────────────────────────────────
export function DryingOven({ title = 'Drying Oven' } = {}) {
  const X = getX();
  const n = neo();
  const temp = useLive(185, 5, 3000);
  const feedSpeed = useLive(12.5, 0.8, 2000);
  const [power, setPower] = useState(true);
  const tick = useTick(50);
  const fanAngle = power ? (tick * 15) % 360 : 0;

  const tempPct = Math.min(100, (temp / 250) * 100);
  const tempOk = temp > 170 && temp < 200;
  const tempColor = !power ? X.textMut : tempOk ? X.teal : temp > 200 ? X.red : X.amber;

  const shimmerOffset = Math.sin(tick * 0.15) * 2;
  const shimmerOffset2 = Math.sin(tick * 0.15 + 2) * 1.5;
  const shimmerOffset3 = Math.sin(tick * 0.15 + 4) * 2.5;

  return (
    <Card style={{ width: 350 }} glow={power ? X.red : undefined}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Dot c={power ? X.red : X.textMut} pulse={power} s={7} />
          <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        </div>
        <Btn small color={power ? X.red : X.teal} onClick={() => setPower(!power)}>
          {power ? 'Shutdown' : 'Start'}
        </Btn>
      </div>
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <svg id="print-oven" width="100%" viewBox="0 0 310 110" style={{ display: 'block' }}>
          <rect x="10" y="20" width="290" height="75" rx="6" ry="6"
            fill={X.bgAlt} stroke={X.borderLight} strokeWidth="1" />
          {power && [0, 1, 2].map(i => {
            const y = 40 + i * 18;
            return (
              <g key={i}>
                <rect x="30" y={y} width="250" height="6" rx="3"
                  fill={X.red} opacity="0.8" />
                <rect x="30" y={y - 4} width="250" height="14" rx="5"
                  fill={X.amber} opacity="0.15" />
                <rect x="50" y={y - 8} width="210" height="22" rx="8"
                  fill={X.red} opacity="0.05" />
              </g>
            );
          })}
          {power && (
            <g>
              <rect x="30" y="25" width="250" height="10" rx="3"
                fill="transparent" opacity="0.06"
                style={{ transform: `translateY(${shimmerOffset}px)` }} />
              <line x1="60" y1={28 + shimmerOffset} x2="250" y2={28 + shimmerOffset}
                stroke={X.red} strokeWidth="0.5" opacity="0.12" />
              <line x1="80" y1={32 + shimmerOffset2} x2="230" y2={32 + shimmerOffset2}
                stroke={X.amber} strokeWidth="0.4" opacity="0.1" />
              <line x1="70" y1={35 + shimmerOffset3} x2="240" y2={35 + shimmerOffset3}
                stroke={X.red} strokeWidth="0.3" opacity="0.08" />
            </g>
          )}
          <g transform={`translate(155, 10)`}>
            <circle cx="0" cy="0" r="8" fill={X.bgAlt} stroke={X.borderLight} strokeWidth="1" />
            {[0, 1, 2, 3].map(i => {
              const a = (fanAngle + i * 90) * (Math.PI / 180);
              return (
                <line key={i} x1={Math.cos(a) * -5} y1={Math.sin(a) * -5}
                  x2={Math.cos(a) * 5} y2={Math.sin(a) * 5}
                  stroke={power ? X.teal : X.textMut} strokeWidth="2" strokeLinecap="round"
                  style={{ transition: power ? 'none' : `stroke 300ms ${ease.mv}` }} />
              );
            })}
            <circle cx="0" cy="0" r="2" fill={power ? X.teal : X.textMut} />
          </g>
          <text x="155" y="108" textAnchor="middle" fontFamily={X.m} fontSize="6" fill={X.textMut}>
            Exhaust Fan {power ? '(Active)' : '(Idle)'}
          </text>
          <line x1="0" y1="57" x2="10" y2="57" stroke={X.textMut} strokeWidth="2" />
          <line x1="300" y1="57" x2="310" y2="57" stroke={X.textMut} strokeWidth="2" />
          <text x="5" y="52" fontFamily={X.m} fontSize="5" fill={X.textMut} textAnchor="middle">IN</text>
          <text x="305" y="52" fontFamily={X.m} fontSize="5" fill={X.textMut} textAnchor="middle">OUT</text>
        </svg>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
        <div style={{ padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt }}>
          <Lbl style={{ marginBottom: 2 }}>Temperature</Lbl>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <M style={{ fontSize: 20, fontWeight: 800, color: tempColor }}>{power ? temp.toFixed(0) : '--'}</M>
            <M style={{ fontSize: 9, color: X.textMut }}>{'\u00b0C'}</M>
          </div>
          <Prog value={power ? tempPct : 0} color={tempColor} h={2} style={{ marginTop: 4 }} />
        </div>
        <div style={{ padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt }}>
          <Lbl style={{ marginBottom: 2 }}>Feed Speed</Lbl>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <M style={{ fontSize: 20, fontWeight: 800, color: power ? X.purple : X.textMut }}>
              {power ? feedSpeed.toFixed(1) : '--'}
            </M>
            <M style={{ fontSize: 9, color: X.textMut }}>m/min</M>
          </div>
          <Prog value={power ? (feedSpeed / 20) * 100 : 0} color={X.purple} h={2} style={{ marginTop: 4 }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Dot c={power ? (tempOk ? X.teal : X.amber) : X.textMut} pulse={power} s={5} />
          <M style={{ fontSize: 8, color: X.textMut }}>
            {power ? (tempOk ? 'Operating Normally' : 'Temperature Warning') : 'Oven Offline'}
          </M>
        </div>
        <M style={{ fontSize: 8, color: X.textMut }}>IR Zone 1-3</M>
      </div>
    </Card>
  );
}
