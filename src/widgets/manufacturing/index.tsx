import { useState, useMemo } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot, Prog } from '../primitives';
import { useAnim, useLive, useTick } from '../hooks';

// ── Assembly Line ───────────────────────────────────────────────────
export function AssemblyLine({ title = 'Assembly Line', targetThroughput = 150 }: {
  title?: string; targetThroughput?: number;
} = {}) {
  const X = getX();
  const throughput = useLive(142, 8, 2500);
  const tick = useTick(1500);
  const stations = useMemo(() => [
    { name: 'Intake', status: 'running' as const },
    { name: 'Weld', status: 'running' as const },
    { name: 'Assembly', status: 'running' as const },
    { name: 'QC Check', status: 'idle' as const },
    { name: 'Paint', status: 'fault' as const },
    { name: 'Pack', status: 'running' as const },
  ], []);
  const statusColor: Record<string, string> = { running: X.teal, idle: X.amber, fault: X.red };
  const running = stations.filter(s => s.status === 'running').length;

  return (
    <Card style={{ width: 440 }} glow={X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{running}/{stations.length} Running</Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12, position: 'relative' }}>
        {stations.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '6px 4px', borderRadius: X.rs, flex: 1,
              background: statusColor[s.status] + '10',
              border: `1px solid ${statusColor[s.status]}25`,
              animation: `fu 150ms ${ease.o} ${i * 30}ms both`,
            }}>
              <Dot c={statusColor[s.status]} pulse={s.status === 'running'} s={7} />
              <M style={{ fontSize: 7, fontWeight: 600, color: X.text, textAlign: 'center' }}>{s.name}</M>
              <M style={{ fontSize: 6, color: statusColor[s.status], textTransform: 'uppercase' }}>{s.status}</M>
            </div>
            {i < stations.length - 1 && (
              <div style={{ width: 12, height: 1, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  background: s.status === 'running' ? X.teal : X.border,
                }} />
                {s.status === 'running' && (
                  <div style={{
                    position: 'absolute', top: -1, width: 4, height: 3, borderRadius: 1,
                    background: X.teal, boxShadow: `0 0 4px ${X.teal}60`,
                    left: `${((tick * 20) % 100)}%`,
                    transition: `left 300ms linear`,
                  }} />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Throughput</Lbl><M style={{ fontSize: 12, fontWeight: 800, color: throughput >= targetThroughput ? X.teal : X.amber }}>{Math.round(throughput)} <span style={{ fontSize: 8, color: X.textMut }}>/ {targetThroughput} units/hr</span></M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Uptime</Lbl><M style={{ fontSize: 12, fontWeight: 700, color: X.text }}>96.4%</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Shift</Lbl><M style={{ fontSize: 12, fontWeight: 700, color: X.purple }}>Day A</M></div>
      </div>
    </Card>
  );
}

// ── OEE Gauge ───────────────────────────────────────────────────────
export function OEEGauge({ title = 'OEE Monitor', oeeTarget = 85 }: {
  title?: string; oeeTarget?: number;
} = {}) {
  const X = getX();
  const availability = useLive(91.2, 2, 4000);
  const performance = useLive(84.7, 3, 3500);
  const quality = useLive(97.3, 1, 5000);
  const oee = (availability / 100) * (performance / 100) * (quality / 100) * 100;
  const animOee = useAnim(oee, 1400);

  const gauges: { label: string; value: number; color: string }[] = [
    { label: 'Availability', value: availability, color: X.teal },
    { label: 'Performance', value: performance, color: X.amber },
    { label: 'Quality', value: quality, color: X.purple },
  ];

  const renderArc = (value: number, color: string, radius: number) => {
    const circumference = 2 * Math.PI * radius;
    const arcLen = 240;
    const dashLen = (Math.min(value, 100) / 100) * (arcLen / 360) * circumference;
    const gapLen = circumference - dashLen;
    return { dashLen, gapLen, circumference, arcLen };
  };

  return (
    <Card style={{ width: 370 }} glow={X.indigo}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={oee >= oeeTarget ? X.teal : oee >= oeeTarget - 20 ? X.amber : X.red} solid>{Math.round(oee)}% OEE</Badge>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: 10 }}>
        {gauges.map((g, i) => {
          const r = 28;
          const { dashLen, gapLen } = renderArc(g.value, g.color, r);
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <svg viewBox="0 0 70 70" style={{ width: 70, height: 70 }}>
                <circle cx="35" cy="35" r={r} fill="none" stroke={X.borderLight} strokeWidth="4"
                  strokeDasharray={`${(240 / 360) * 2 * Math.PI * r} ${(120 / 360) * 2 * Math.PI * r}`}
                  strokeLinecap="round" transform="rotate(150 35 35)" />
                <circle cx="35" cy="35" r={r} fill="none" stroke={g.color} strokeWidth="4"
                  strokeDasharray={`${dashLen} ${gapLen}`}
                  strokeLinecap="round" transform="rotate(150 35 35)"
                  style={{ transition: `stroke-dasharray 600ms ${ease.sp}`, filter: `drop-shadow(0 0 3px ${g.color}40)` }} />
                <text x="35" y="33" textAnchor="middle" fontFamily={X.m} fontSize="11" fontWeight="800" fill={g.color}>
                  {Math.round(g.value)}%
                </text>
                <text x="35" y="44" textAnchor="middle" fontFamily={X.m} fontSize="5" fill={X.textMut}>
                  {g.label.slice(0, 5).toUpperCase()}
                </text>
              </svg>
            </div>
          );
        })}
      </div>
      <div style={{ textAlign: 'center', padding: '6px 0', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
        <Lbl style={{ marginBottom: 2 }}>Combined OEE</Lbl>
        <M style={{ fontSize: 22, fontWeight: 800, color: oee >= oeeTarget ? X.teal : oee >= oeeTarget - 20 ? X.amber : X.red }}>{animOee.toFixed(1)}%</M>
      </div>
    </Card>
  );
}

// ── Quality Gate ────────────────────────────────────────────────────
export function QualityGate({ title = 'Quality Gate', defectTarget = 3 }: {
  title?: string; defectTarget?: number;
} = {}) {
  const X = getX();
  const pass = useAnim(1842, 1200);
  const fail = useAnim(47, 1000);
  const rework = useAnim(23, 1100);
  const defectRate = useLive(2.48, 0.5, 3000);
  const batches = useMemo(() => Array.from({ length: 10 }, () => ({
    pass: 70 + Math.random() * 28,
    fail: Math.random() * 8,
  })), []);
  const mx = Math.max(...batches.map(b => b.pass + b.fail), 1);

  return (
    <Card style={{ width: 370 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={defectRate < defectTarget ? X.teal : X.red}>{defectRate.toFixed(1)}% Defect</Badge>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        {([
          ['Passed', Math.round(pass), X.teal],
          ['Failed', Math.round(fail), X.red],
          ['Rework', Math.round(rework), X.amber],
        ] as [string, number, string][]).map(([label, val, c], i) => (
          <div key={i} style={{ flex: 1, padding: '6px 8px', borderRadius: X.rs, background: c + '10', border: `1px solid ${c}20`, animation: `fu 150ms ${ease.o} ${i * 30}ms both` }}>
            <Lbl style={{ marginBottom: 3 }}>{label}</Lbl>
            <M style={{ fontSize: 16, fontWeight: 800, color: c, display: 'block' }}>{val.toLocaleString()}</M>
          </div>
        ))}
      </div>
      <Lbl style={{ marginBottom: 4 }}>Recent Batches</Lbl>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 32 }}>
        {batches.map((b, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
              <div style={{ height: `${(b.fail / mx) * 32}px`, background: X.red, borderRadius: '2px 2px 0 0', minHeight: b.fail > 0.5 ? 1 : 0 }} />
              <div style={{ height: `${(b.pass / mx) * 32}px`, background: X.teal, borderRadius: '0 0 2px 2px', minHeight: 2 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Dot c={X.teal} s={4} /><M style={{ fontSize: 7, color: X.textMut }}>Pass</M></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Dot c={X.red} s={4} /><M style={{ fontSize: 7, color: X.textMut }}>Fail</M></div>
        <M style={{ fontSize: 7, color: X.textMut }}>Batch #1034 - #1043</M>
      </div>
    </Card>
  );
}

// ── PLC Status ──────────────────────────────────────────────────────
export function PLCStatus({ title = 'PLC Controller', plcModel = 'Siemens S7-1500' }: {
  title?: string; plcModel?: string;
} = {}) {
  const X = getX();
  const cycleTime = useLive(24.6, 2, 2000);
  const scanRate = useLive(4.2, 0.5, 1800);
  const [mode] = useState<'RUN' | 'PROG' | 'FAULT'>('RUN');
  const ioPoints = useMemo(() => [
    { label: 'DI-0', on: true },
    { label: 'DI-1', on: true },
    { label: 'DI-2', on: false },
    { label: 'DI-3', on: true },
    { label: 'DO-0', on: true },
    { label: 'DO-1', on: false },
    { label: 'DO-2', on: true },
    { label: 'DO-3', on: false },
  ], []);
  const modeColor: Record<string, string> = { RUN: X.teal, PROG: X.amber, FAULT: X.red };
  const activeIO = ioPoints.filter(p => p.on).length;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={modeColor[mode]} solid>{mode}</Badge>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div><Lbl style={{ marginBottom: 2 }}>Cycle Time</Lbl><M style={{ fontSize: 14, fontWeight: 800, color: X.text }}>{cycleTime.toFixed(1)}<span style={{ fontSize: 8, color: X.textMut }}> ms</span></M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Scan Rate</Lbl><M style={{ fontSize: 14, fontWeight: 800, color: X.purple }}>{scanRate.toFixed(1)}<span style={{ fontSize: 8, color: X.textMut }}> ms</span></M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>I/O Active</Lbl><M style={{ fontSize: 14, fontWeight: 800, color: X.teal }}>{activeIO}/{ioPoints.length}</M></div>
      </div>
      <Lbl style={{ marginBottom: 6 }}>I/O Points</Lbl>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
        {ioPoints.map((pt, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '5px 3px', borderRadius: X.rs,
            background: X.bgAlt, border: `1px solid ${pt.on ? X.teal + '25' : X.borderLight}`,
            animation: `fu 150ms ${ease.o} ${i * 20}ms both`,
          }}>
            <Dot c={pt.on ? X.teal : X.textMut} pulse={pt.on} s={6} />
            <M style={{ fontSize: 7, fontWeight: 600, color: pt.on ? X.text : X.textMut }}>{pt.label}</M>
            <M style={{ fontSize: 6, color: pt.on ? X.teal : X.textMut }}>{pt.on ? 'ON' : 'OFF'}</M>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Model: {plcModel}</M>
        <M style={{ fontSize: 8, color: X.textMut }}>FW v4.6.1</M>
      </div>
    </Card>
  );
}

// ── Tank Level ──────────────────────────────────────────────────────
export function TankLevel({ title = 'Tank Levels', lowLevelThreshold = 30 }: {
  title?: string; lowLevelThreshold?: number;
} = {}) {
  const X = getX();
  const tanks = useMemo(() => [
    { name: 'Tank A', fluid: 'Coolant', capacity: 500, temp: 22 },
    { name: 'Tank B', fluid: 'Solvent', capacity: 300, temp: 35 },
    { name: 'Tank C', fluid: 'Resin', capacity: 750, temp: 48 },
    { name: 'Tank D', fluid: 'DI Water', capacity: 1000, temp: 18 },
  ], []);
  const levels = [
    useLive(72, 5, 3000),
    useLive(45, 8, 3500),
    useLive(88, 3, 4000),
    useLive(31, 6, 2800),
  ];

  const levelColor = (pct: number) => pct > 70 ? X.teal : pct > lowLevelThreshold ? X.amber : X.red;

  return (
    <Card style={{ width: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>{tanks.length} Tanks</Badge>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        {tanks.map((t, i) => {
          const pct = Math.max(0, Math.min(100, levels[i]));
          const c = levelColor(pct);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, animation: `fu 200ms ${ease.o} ${i * 40}ms both` }}>
              <M style={{ fontSize: 8, fontWeight: 700, color: X.text }}>{t.name}</M>
              <div style={{
                width: '100%', height: 60, borderRadius: 4,
                background: X.bgAlt, border: `1px solid ${X.borderLight}`,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: `${pct}%`, background: `linear-gradient(0deg, ${c}40, ${c}20)`,
                  borderTop: `2px solid ${c}`,
                  transition: `height 800ms ${ease.sp}`,
                }} />
                <div style={{
                  position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <M style={{ fontSize: 12, fontWeight: 800, color: c, textShadow: `0 0 4px ${X.bg}` }}>{Math.round(pct)}%</M>
                </div>
              </div>
              <M style={{ fontSize: 6, color: X.textMut }}>{t.fluid}</M>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <M style={{ fontSize: 7, color: t.temp > 40 ? X.red : X.textSec }}>{t.temp}°C</M>
              </div>
              <M style={{ fontSize: 6, color: X.textMut }}>{t.capacity}L</M>
            </div>
          );
        })}
      </div>
      <Prog value={levels.reduce((a, l) => a + l, 0) / levels.length} color={X.indigo} h={2} style={{ marginTop: 4 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <Lbl>Avg Fill</Lbl>
        <M style={{ fontSize: 8, fontWeight: 600, color: X.indigo }}>{(levels.reduce((a, l) => a + l, 0) / levels.length).toFixed(1)}%</M>
      </div>
    </Card>
  );
}

// ── Conveyor Speed ──────────────────────────────────────────────────
export function ConveyorSpeed({ title = 'Conveyor Belt', targetSpeed = 2.0 }: {
  title?: string; targetSpeed?: number;
} = {}) {
  const X = getX();
  const speed = useLive(1.82, 0.15, 1200);
  const tension = useLive(342, 20, 3000);
  const itemsMin = useLive(48, 5, 2000);
  const [sparkData, setSparkData] = useState(() => Array.from({ length: 30 }, () => 1.6 + Math.random() * 0.5));

  const tick = useTick(800);
  useState(() => {
    // This is a static initializer pattern; sparkData updates via the effect below
  });

  // Update sparkline with live speed
  useMemo(() => {
    setSparkData(prev => [...prev.slice(1), speed]);
  }, [tick]);

  const mn = Math.min(...sparkData), mx = Math.max(...sparkData);
  const pts = sparkData.map((v, i) => `${(i / 29) * 100},${100 - ((v - mn) / (mx - mn || 1)) * 80}`).join(' ');
  const speedPct = (speed / targetSpeed) * 100;
  const speedOk = Math.abs(speed - targetSpeed) < 0.3;

  return (
    <Card style={{ width: 350 }} glow={X.purple}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Dot c={speedOk ? X.teal : X.amber} pulse s={7} />
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
        <M style={{ fontSize: 28, fontWeight: 800, color: speedOk ? X.teal : X.amber }}>{speed.toFixed(2)}</M>
        <M style={{ fontSize: 10, color: X.textMut }}>m/s</M>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        <Prog value={Math.min(speedPct, 100)} color={speedOk ? X.teal : X.amber} h={3} style={{ flex: 1 }} />
        <M style={{ fontSize: 8, color: X.textMut }}>Target: {targetSpeed.toFixed(1)}</M>
      </div>
      <Lbl style={{ marginBottom: 3 }}>Speed Trend</Lbl>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 30, overflow: 'hidden', marginBottom: 10 }}>
        <defs>
          <linearGradient id="conv-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={X.purple} stopOpacity=".2" />
            <stop offset="100%" stopColor={X.purple} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,100 ${pts} 100,100`} fill="url(#conv-g)" />
        <polyline points={pts} fill="none" stroke={X.purple} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Tension</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: tension > 380 ? X.red : X.text }}>{Math.round(tension)} N</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Throughput</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.purple }}>{Math.round(itemsMin)} items/min</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Status</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>Active</M></div>
      </div>
    </Card>
  );
}

// ── Shift Schedule ──────────────────────────────────────────────────
export function ShiftSchedule({ title = 'Shift Schedule', shiftCount = 3 }: {
  title?: string; shiftCount?: number;
} = {}) {
  const X = getX();
  const shifts = useMemo(() => [
    { name: 'Day', start: '06:00', end: '14:00', supervisor: 'M. Chen', crew: 12, active: true },
    { name: 'Swing', start: '14:00', end: '22:00', supervisor: 'R. Patel', crew: 10, active: false },
    { name: 'Night', start: '22:00', end: '06:00', supervisor: 'J. Silva', crew: 8, active: false },
  ], []);
  const visibleShifts = shifts.slice(0, shiftCount);
  const totalCrew = visibleShifts.reduce((a, s) => a + s.crew, 0);

  return (
    <Card style={{ width: 370 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}>{totalCrew} Total Crew</Badge>
      </div>
      {visibleShifts.map((s, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 10px', borderRadius: X.rs, marginBottom: i < visibleShifts.length - 1 ? 4 : 0,
          background: s.active ? X.teal + '0c' : X.bgAlt,
          border: `1px solid ${s.active ? X.teal + '30' : X.borderLight}`,
          animation: `fu 150ms ${ease.o} ${i * 30}ms both`,
        }}>
          <Dot c={s.active ? X.teal : X.textMut} pulse={s.active} s={7} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <M style={{ fontSize: 11, fontWeight: 700, color: X.text }}>{s.name} Shift</M>
              {s.active && <Badge color={X.teal} solid>Active</Badge>}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <M style={{ fontSize: 8, color: X.textMut }}>{s.start} - {s.end}</M>
              <M style={{ fontSize: 8, color: X.textSec }}>Sup: {s.supervisor}</M>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <M style={{ fontSize: 14, fontWeight: 800, color: s.active ? X.teal : X.textSec }}>{s.crew}</M>
            <Lbl>crew</Lbl>
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Current: Day Shift</M>
        <M style={{ fontSize: 8, color: X.textMut }}>Next rotation: 14:00</M>
      </div>
    </Card>
  );
}
