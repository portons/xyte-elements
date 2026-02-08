import { useState, useMemo } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot, Prog } from '../primitives';
import { useAnim, useTick } from '../hooks';

// ── Clean Room ─────────────────────────────────────────────────────
export function CleanRoom({ title = 'Clean Room Monitor', particleLimit = 100, particleCount, diffPressure, temperature, humidity, prevParticle }: {
  title?: string; particleLimit?: number; particleCount: number; diffPressure: number; temperature: number; humidity: number; prevParticle: number;
}) {
  const X = getX();
  const tick = useTick(2000);

  const isoClass = particleCount < particleLimit ? 'ISO 5' : particleCount < 1000 ? 'ISO 6' : 'ISO 7';
  const classLabel = particleCount < particleLimit ? `Class ${particleLimit}` : particleCount < 1000 ? 'Class 1,000' : 'Class 10,000';
  const compliant = particleCount < particleLimit;
  const particleColor = particleCount < particleLimit * 0.8 ? X.teal : particleCount < particleLimit ? X.amber : X.red;
  const trending = particleCount < prevParticle ? 'down' : 'up';

  return (
    <Card style={{ width: 380 }} glow={X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={compliant ? X.teal : X.red} solid>{isoClass}</Badge>
      </div>

      {/* Particle count hero */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div>
          <Lbl style={{ marginBottom: 3 }}>Particle Count</Lbl>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <M style={{ fontSize: 32, fontWeight: 800, color: particleColor }}>{Math.round(particleCount)}</M>
            <M style={{ fontSize: 9, color: X.textMut }}>ct/ft&sup3;</M>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
            <M style={{ fontSize: 9, color: trending === 'down' ? X.teal : X.amber }}>{trending === 'down' ? '\u2193' : '\u2191'}</M>
            <M style={{ fontSize: 8, color: X.textMut }}>{classLabel}</M>
          </div>
        </div>
        <div style={{ flex: 1, padding: '6px 10px', borderRadius: X.rs, background: X.bgAlt }}>
          <Badge color={compliant ? X.teal : X.red}>{compliant ? 'Compliant' : 'Non-Compliant'}</Badge>
        </div>
      </div>

      {/* Environmental grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        <div style={{ padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}`, animation: `fu 150ms ${ease.o} 0ms both` }}>
          <Lbl style={{ marginBottom: 2 }}>Diff. Pressure</Lbl>
          <M style={{ fontSize: 14, fontWeight: 700, color: diffPressure > 10 ? X.teal : X.amber }}>{diffPressure.toFixed(1)}</M>
          <M style={{ fontSize: 8, color: X.textMut, display: 'block' }}>Pa</M>
        </div>
        <div style={{ padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}`, animation: `fu 150ms ${ease.o} 30ms both` }}>
          <Lbl style={{ marginBottom: 2 }}>Temperature</Lbl>
          <M style={{ fontSize: 14, fontWeight: 700, color: temperature > 22 || temperature < 19 ? X.amber : X.teal }}>{temperature.toFixed(1)}</M>
          <M style={{ fontSize: 8, color: X.textMut, display: 'block' }}>&deg;C</M>
        </div>
        <div style={{ padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}`, animation: `fu 150ms ${ease.o} 60ms both` }}>
          <Lbl style={{ marginBottom: 2 }}>Humidity</Lbl>
          <M style={{ fontSize: 14, fontWeight: 700, color: humidity > 55 || humidity < 35 ? X.amber : X.teal }}>{humidity.toFixed(0)}</M>
          <M style={{ fontSize: 8, color: X.textMut, display: 'block' }}>% RH</M>
        </div>
      </div>
    </Card>
  );
}

// ── Batch Reactor ──────────────────────────────────────────────────
export function BatchReactor({ title = 'Batch Reactors', tempWarning = 60 }: {
  title?: string; tempWarning?: number;
}) {
  const X = getX();

  const reactors = useMemo(() => [
    { id: 'RX-101', product: 'Amoxicillin API', phase: 'reacting' as const, baseProgress: 67, baseTemp: 78, timeRemaining: '2h 15m' },
    { id: 'RX-102', product: 'Ibuprofen Intermediate', phase: 'cooling' as const, baseProgress: 91, baseTemp: 42, timeRemaining: '0h 35m' },
    { id: 'RX-103', product: 'Metformin HCl', phase: 'charging' as const, baseProgress: 18, baseTemp: 24, timeRemaining: '4h 40m' },
    { id: 'RX-104', product: 'Omeprazole Base', phase: 'discharging' as const, baseProgress: 98, baseTemp: 30, timeRemaining: '0h 10m' },
  ], []);

  const progValues = [
    useAnim(reactors[0].baseProgress, 1200),
    useAnim(reactors[1].baseProgress, 1000),
    useAnim(reactors[2].baseProgress, 1400),
    useAnim(reactors[3].baseProgress, 800),
  ];
  const temps = [
    reactors[0].baseTemp,
    reactors[1].baseTemp,
    reactors[2].baseTemp,
    reactors[3].baseTemp,
  ];

  const phaseColor: Record<string, string> = { charging: X.indigo, reacting: X.amber, cooling: X.teal, discharging: X.purple };

  return (
    <Card style={{ width: 420 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.amber}>{reactors.filter(r => r.phase === 'reacting').length} Reacting</Badge>
      </div>

      {reactors.map((r, i) => {
        const c = phaseColor[r.phase];
        return (
          <div key={i} style={{
            padding: '8px 10px', borderRadius: X.rs, marginBottom: 4,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
            animation: `fu 150ms ${ease.o} ${i * 30}ms both`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <M style={{ fontSize: 10, fontWeight: 800, color: X.text }}>{r.id}</M>
                <M style={{ fontSize: 8, color: X.textSec }}>{r.product}</M>
              </div>
              <Badge color={c}>{r.phase}</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <Prog value={progValues[i]} color={c} h={4} />
              </div>
              <M style={{ fontSize: 10, fontWeight: 700, color: c, minWidth: 30, textAlign: 'right' }}>{Math.round(progValues[i])}%</M>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Lbl>Temp</Lbl>
                <M style={{ fontSize: 9, fontWeight: 600, color: temps[i] > tempWarning ? X.amber : X.teal }}>{temps[i].toFixed(1)}&deg;C</M>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Lbl>ETA</Lbl>
                <M style={{ fontSize: 9, fontWeight: 600, color: X.textSec }}>{r.timeRemaining}</M>
              </div>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// ── Chromatograph ──────────────────────────────────────────────────
export function Chromatograph({ title = 'HPLC Chromatogram', method = 'USP-42', runTime }: {
  title?: string; method?: string; runTime: number;
}) {
  const X = getX();

  const peaks = useMemo(() => [
    { name: 'Impurity A', rt: 3.2, purity: 99.1, area: 12.4 },
    { name: 'API Peak', rt: 7.8, purity: 99.8, area: 68.2 },
    { name: 'Degradant B', rt: 11.5, purity: 97.4, area: 8.7 },
    { name: 'Impurity C', rt: 15.1, purity: 98.9, area: 5.3 },
  ], []);

  // Generate chromatogram SVG path
  const chromatogram = useMemo(() => {
    const pts: [number, number][] = [];
    const totalX = 200;
    for (let x = 0; x <= totalX; x++) {
      const t = (x / totalX) * 20; // 0-20 min timescale
      let y = 2 + Math.random() * 1; // baseline noise
      // Add Gaussian-like peaks
      const addPeak = (center: number, height: number, width: number) => {
        y += height * Math.exp(-Math.pow(t - center, 2) / (2 * width * width));
      };
      addPeak(3.2, 18, 0.25);
      addPeak(7.8, 75, 0.35);
      addPeak(11.5, 12, 0.3);
      addPeak(15.1, 8, 0.2);
      // Minor shoulders
      addPeak(5.0, 4, 0.15);
      addPeak(9.2, 3, 0.12);
      pts.push([x, y]);
    }
    return pts;
  }, []);

  const maxY = Math.max(...chromatogram.map(p => p[1]));
  const svgPts = chromatogram.map(([x, y]) => `${(x / 200) * 100},${100 - (y / maxY) * 85 - 5}`).join(' ');

  return (
    <Card style={{ width: 400 }} glow={X.purple}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}>Method: {method}</Badge>
      </div>

      {/* Chromatogram SVG */}
      <div style={{ marginBottom: 8, padding: '4px 0', borderRadius: X.rs, background: X.bg, border: `1px solid ${X.borderLight}` }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 80, overflow: 'hidden' }}>
          <defs>
            <linearGradient id="chrom-g" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={X.purple} stopOpacity=".15" />
              <stop offset="100%" stopColor={X.purple} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[25, 50, 75].map(y => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke={X.borderLight} strokeWidth=".3" vectorEffect="non-scaling-stroke" />
          ))}
          <polygon points={`0,100 ${svgPts} 100,100`} fill="url(#chrom-g)" />
          <polyline points={svgPts} fill="none" stroke={X.purple} strokeWidth="1.2" vectorEffect="non-scaling-stroke" style={{ filter: `drop-shadow(0 0 2px ${X.purple}40)` }} />
          {/* Peak markers */}
          {peaks.map((p, i) => {
            const xPos = (p.rt / 20) * 100;
            return (
              <line key={i} x1={xPos} y1="0" x2={xPos} y2="100" stroke={X.textMut} strokeWidth=".3" vectorEffect="non-scaling-stroke" strokeDasharray="2,2" />
            );
          })}
        </svg>
      </div>

      {/* Time axis */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        {['0', '5', '10', '15', '20 min'].map(t => (
          <M key={t} style={{ fontSize: 7, color: X.textMut }}>{t}</M>
        ))}
      </div>

      {/* Peak table */}
      <Lbl style={{ marginBottom: 4 }}>Identified Peaks</Lbl>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
        {peaks.map((p, i) => (
          <div key={i} style={{
            padding: '4px 6px', borderRadius: X.rs, background: X.bgAlt,
            border: `1px solid ${X.borderLight}`, textAlign: 'center',
            animation: `fu 150ms ${ease.o} ${i * 25}ms both`,
          }}>
            <M style={{ fontSize: 7, fontWeight: 700, color: X.text, display: 'block', marginBottom: 2 }}>{p.name}</M>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.purple, display: 'block' }}>{p.rt} min</M>
            <M style={{ fontSize: 7, color: p.purity > 99 ? X.teal : X.amber }}>{p.purity}%</M>
          </div>
        ))}
      </div>

      {/* Footer stats */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Run Time: {runTime.toFixed(1)} min</M>
        <M style={{ fontSize: 8, color: X.textMut }}>Column: C18, 250mm</M>
      </div>
    </Card>
  );
}

// ── Cold Chain ─────────────────────────────────────────────────────
export function ColdChain({ title = 'Cold Chain Monitor', tempUnit = 'C' }: {
  title?: string; tempUnit?: string;
}) {
  const X = getX();

  const units = useMemo(() => [
    { name: 'Freezer F-01', setpoint: -20, status: 'normal' as const },
    { name: 'Freezer F-02', setpoint: -80, status: 'normal' as const },
    { name: 'Fridge R-01', setpoint: 4, status: 'warning' as const },
    { name: 'Cryo C-01', setpoint: -196, status: 'normal' as const },
    { name: 'Fridge R-02', setpoint: 4, status: 'alarm' as const },
  ], []);

  const temps = [
    -20,
    -79,
    6.2,
    -195,
    8.5,
  ];

  const getStatusFromDelta = (temp: number, setpoint: number): { status: string; color: string } => {
    const delta = Math.abs(temp - setpoint);
    const tolerance = Math.abs(setpoint) > 50 ? 3 : 2;
    if (delta <= tolerance) return { status: 'Normal', color: X.teal };
    if (delta <= tolerance * 2) return { status: 'Warning', color: X.amber };
    return { status: 'Alarm', color: X.red };
  };

  const alarmCount = temps.reduce((a, t, i) => {
    const { status } = getStatusFromDelta(t, units[i].setpoint);
    return a + (status === 'Alarm' ? 1 : 0);
  }, 0);

  return (
    <Card style={{ width: 370 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        {alarmCount > 0 ? (
          <Badge color={X.red}><Dot c={X.red} pulse s={4} />{alarmCount} Alarm</Badge>
        ) : (
          <Badge color={X.teal}>All Normal</Badge>
        )}
      </div>

      {units.map((u, i) => {
        const temp = temps[i];
        const delta = temp - u.setpoint;
        const { status, color } = getStatusFromDelta(temp, u.setpoint);
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px',
            borderRadius: X.rs, marginBottom: 3,
            background: X.bgAlt, border: `1px solid ${status === 'Alarm' ? X.red + '30' : X.borderLight}`,
            borderLeft: `3px solid ${color}`,
            animation: `sr 150ms ${ease.o} ${i * 25}ms both`,
          }}>
            <Dot c={color} pulse={status === 'Alarm'} s={6} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <M style={{ fontSize: 9, fontWeight: 600, color: X.text, display: 'block' }}>{u.name}</M>
              <M style={{ fontSize: 7, color: X.textMut }}>Setpoint: {u.setpoint}&deg;C</M>
            </div>
            <div style={{ textAlign: 'right', minWidth: 56 }}>
              <M style={{ fontSize: 14, fontWeight: 800, color: color }}>{temp.toFixed(1)}</M>
              <M style={{ fontSize: 8, color: X.textMut }}>&deg;C</M>
            </div>
            <div style={{ textAlign: 'right', minWidth: 40 }}>
              <M style={{ fontSize: 10, fontWeight: 600, color: delta > 0 ? X.red : delta < -1 ? X.amber : X.teal }}>
                {delta > 0 ? '+' : ''}{delta.toFixed(1)}
              </M>
              <M style={{ fontSize: 7, color: X.textMut, display: 'block' }}>{'\u0394'}T</M>
            </div>
            <Badge color={color}>{status}</Badge>
          </div>
        );
      })}
    </Card>
  );
}

// ── Quality Lab ────────────────────────────────────────────────────
export function QualityLab({ title = 'Quality Lab Results', maxSamples = 6 }: {
  title?: string; maxSamples?: number;
}) {
  const X = getX();

  const samples = useMemo(() => [
    { id: 'QC-2024-0891', test: 'Dissolution', result: '98.2%', spec: '95-105%', status: 'pass' as const },
    { id: 'QC-2024-0892', test: 'Assay', result: '101.3%', spec: '98-102%', status: 'pass' as const },
    { id: 'QC-2024-0893', test: 'Impurity', result: '0.32%', spec: '<0.50%', status: 'pass' as const },
    { id: 'QC-2024-0894', test: 'Moisture', result: '3.8%', spec: '<3.0%', status: 'fail' as const },
    { id: 'QC-2024-0895', test: 'Dissolution', result: '—', spec: '95-105%', status: 'pending' as const },
    { id: 'QC-2024-0896', test: 'Assay', result: '99.7%', spec: '98-102%', status: 'pass' as const },
  ], []);

  const visibleSamples = samples.slice(0, maxSamples);
  const statusColor: Record<string, string> = { pass: X.teal, fail: X.red, pending: X.textMut };
  const statusLabel: Record<string, string> = { pass: 'Pass', fail: 'Fail', pending: 'Pending' };
  const passCount = visibleSamples.filter(s => s.status === 'pass').length;
  const failCount = visibleSamples.filter(s => s.status === 'fail').length;

  return (
    <Card noPad style={{ width: 400 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <Badge color={X.teal}>{passCount} Pass</Badge>
          {failCount > 0 && <Badge color={X.red}>{failCount} Fail</Badge>}
        </div>
      </div>

      <div style={{ padding: '0 6px 4px' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '90px 64px 50px 58px 52px', gap: 4, padding: '4px 8px', borderBottom: `1px solid ${X.borderLight}` }}>
          {['Sample ID', 'Test', 'Result', 'Spec', 'Status'].map(h => <Lbl key={h}>{h}</Lbl>)}
        </div>

        {visibleSamples.map((s, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '90px 64px 50px 58px 52px', gap: 4,
            padding: '5px 8px', borderRadius: 3, alignItems: 'center',
            background: i % 2 === 0 ? X.bgAlt : 'transparent',
            borderLeft: s.status === 'fail' ? `2px solid ${X.red}` : '2px solid transparent',
            animation: `sr 120ms ${ease.o} ${i * 15}ms both`,
          }}>
            <M style={{ fontSize: 8, fontWeight: 600, color: X.text }}>{s.id}</M>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.textSec }}>{s.test}</M>
            <M style={{ fontSize: 10, fontWeight: 700, color: statusColor[s.status] }}>{s.result}</M>
            <M style={{ fontSize: 8, color: X.textMut }}>{s.spec}</M>
            <Badge color={statusColor[s.status]}>{statusLabel[s.status]}</Badge>
          </div>
        ))}
      </div>

      <div style={{ padding: '6px 14px 10px', borderTop: `1px solid ${X.borderLight}`, display: 'flex', justifyContent: 'space-between' }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Batch: LOT-2024-Q4-0128</M>
        <M style={{ fontSize: 8, color: X.textMut }}>Analyst: J. Patel</M>
      </div>
    </Card>
  );
}

// ── Compliance Tracker ─────────────────────────────────────────────
export function ComplianceTracker({ title = 'GxP Compliance', passThreshold = 95 }: {
  title?: string; passThreshold?: number;
}) {
  const X = getX();
  const overallScore = 94.2;
  const animOverall = useAnim(overallScore, 1200);

  const areas = useMemo(() => [
    { name: 'GMP', fullName: 'Good Manufacturing', score: 96, lastAudit: '2024-10-15', nextAudit: '2025-04-15' },
    { name: 'GLP', fullName: 'Good Laboratory', score: 92, lastAudit: '2024-09-20', nextAudit: '2025-03-20' },
    { name: 'GDP', fullName: 'Good Distribution', score: 98, lastAudit: '2024-11-02', nextAudit: '2025-05-02' },
    { name: 'GCP', fullName: 'Good Clinical', score: 89, lastAudit: '2024-08-10', nextAudit: '2025-02-10' },
  ], []);

  const animScores = [
    useAnim(areas[0].score, 1000),
    useAnim(areas[1].score, 1100),
    useAnim(areas[2].score, 900),
    useAnim(areas[3].score, 1200),
  ];

  const scoreColor = (s: number) => s >= passThreshold ? X.teal : s >= 85 ? X.amber : X.red;
  const overallColor = scoreColor(overallScore);

  return (
    <Card style={{ width: 380 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={overallColor} solid>{overallScore >= passThreshold ? 'Excellent' : overallScore >= 85 ? 'Good' : 'At Risk'}</Badge>
      </div>

      {/* Overall score */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <svg viewBox="0 0 120 80" style={{ width: 160, height: 108 }}>
          {/* Background arc */}
          {(() => {
            const cx = 60, cy = 60, r = 44;
            const startAngle = 180, endAngle = 360;
            const range = endAngle - startAngle;
            const filledAngle = startAngle + (animOverall / 100) * range;
            const toRad = (deg: number) => (deg * Math.PI) / 180;
            const arcX = (a: number) => cx + r * Math.cos(toRad(a));
            const arcY = (a: number) => cy + r * Math.sin(toRad(a));
            const bgArc = `M ${arcX(startAngle)} ${arcY(startAngle)} A ${r} ${r} 0 0 1 ${arcX(endAngle)} ${arcY(endAngle)}`;
            const largeFlag = (filledAngle - startAngle) > 180 ? 1 : 0;
            const fillArc = `M ${arcX(startAngle)} ${arcY(startAngle)} A ${r} ${r} 0 ${largeFlag} 1 ${arcX(filledAngle)} ${arcY(filledAngle)}`;
            return (
              <>
                <path d={bgArc} fill="none" stroke={X.borderLight} strokeWidth="7" strokeLinecap="round" />
                <path d={fillArc} fill="none" stroke={overallColor} strokeWidth="7" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${overallColor}40)` }} />
                <text x={cx} y={cy - 6} textAnchor="middle" fontFamily={X.m} fontSize="22" fontWeight="800" fill={overallColor}>{animOverall.toFixed(1)}%</text>
                <text x={cx} y={cy + 8} textAnchor="middle" fontFamily={X.m} fontSize="7" fill={X.textMut}>OVERALL</text>
              </>
            );
          })()}
        </svg>
      </div>

      {/* GxP Areas */}
      {areas.map((a, i) => {
        const c = scoreColor(a.score);
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
            borderBottom: i < areas.length - 1 ? `1px solid ${X.borderLight}` : 'none',
            animation: `sr 150ms ${ease.o} ${i * 25}ms both`,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: c + '18', border: `1px solid ${c}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <M style={{ fontSize: 8, fontWeight: 800, color: c }}>{a.name}</M>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <M style={{ fontSize: 9, fontWeight: 600, color: X.text, display: 'block' }}>{a.fullName}</M>
              <M style={{ fontSize: 7, color: X.textMut }}>Next: {a.nextAudit}</M>
            </div>
            <div style={{ flex: 1, maxWidth: 100 }}>
              <Prog value={animScores[i]} color={c} h={4} />
            </div>
            <M style={{ fontSize: 12, fontWeight: 800, color: c, minWidth: 30, textAlign: 'right' }}>{Math.round(animScores[i])}%</M>
          </div>
        );
      })}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Last Audit: 2024-11-02</M>
        <M style={{ fontSize: 8, color: X.textMut }}>Next Audit: 2025-02-10</M>
      </div>
    </Card>
  );
}
