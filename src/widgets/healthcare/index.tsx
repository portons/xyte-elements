import { useState, useMemo } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot, Prog } from '../primitives';
import { useAnim, useLive, useTick } from '../hooks';

// ── Patient Monitor ─────────────────────────────────────────────────
export function PatientMonitor({ title = 'Patient Monitor', hr = 72, spo2 = 98, bpSys = 120, bpDia = 80, resp = 16, delay = 0 }: {
  title?: string; hr?: number; spo2?: number; bpSys?: number; bpDia?: number; resp?: number; delay?: number;
}) {
  const X = getX();
  const liveHr = useLive(hr, 4, 1000);
  const liveSpo2 = useLive(spo2, 1, 1500);
  const liveResp = useLive(resp, 2, 2000);
  const animHr = useAnim(hr, 800);

  const hrColor = liveHr > 100 || liveHr < 50 ? X.red : liveHr > 90 ? X.amber : X.teal;
  const spo2Color = liveSpo2 < 92 ? X.red : liveSpo2 < 95 ? X.amber : X.teal;
  const bpColor = bpSys > 140 || bpDia > 90 ? X.red : bpSys > 130 ? X.amber : X.teal;
  const respColor = liveResp > 20 || liveResp < 12 ? X.amber : X.teal;

  // ECG waveform: PQRST-like morphology
  const ecg = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < 60; i++) {
      const t = i / 60;
      const cycle = t % 0.5;
      let y = 50;
      if (cycle > 0.05 && cycle < 0.08) y = 40; // P wave
      else if (cycle > 0.12 && cycle < 0.14) y = 65; // Q
      else if (cycle > 0.14 && cycle < 0.18) y = 8;  // R peak
      else if (cycle > 0.18 && cycle < 0.21) y = 72; // S
      else if (cycle > 0.25 && cycle < 0.32) y = 38; // T wave
      else y = 50 + (Math.random() - 0.5) * 3;       // baseline noise
      pts.push(y);
    }
    return pts;
  }, []);

  const ecgPts = ecg.map((y, i) => `${(i / 59) * 100},${y}`).join(' ');

  return (
    <Card delay={delay} glow={X.teal} style={{ width: 420 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}><Dot c={X.teal} pulse s={4} />Live</Badge>
      </div>

      {/* ECG Waveform */}
      <div style={{ marginBottom: 10, padding: '4px 0', borderRadius: X.rs, background: X.bg, border: `1px solid ${X.borderLight}` }}>
        <svg viewBox="0 0 100 80" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 36, overflow: 'hidden' }}>
          <polyline points={ecgPts} fill="none" stroke={X.teal} strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={{ filter: `drop-shadow(0 0 2px ${X.teal}60)` }} />
        </svg>
      </div>

      {/* Vitals Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {/* Heart Rate */}
        <div style={{ padding: '8px 10px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
          <Lbl style={{ marginBottom: 4 }}>Heart Rate</Lbl>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <M style={{ fontSize: 22, fontWeight: 800, color: hrColor, letterSpacing: '-.02em' }}>{Math.round(liveHr)}</M>
            <M style={{ fontSize: 8, color: X.textMut }}>BPM</M>
          </div>
          <Dot c={hrColor} pulse s={5} />
        </div>

        {/* SpO2 */}
        <div style={{ padding: '8px 10px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
          <Lbl style={{ marginBottom: 4 }}>SpO2</Lbl>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <M style={{ fontSize: 22, fontWeight: 800, color: spo2Color, letterSpacing: '-.02em' }}>{Math.round(liveSpo2)}</M>
            <M style={{ fontSize: 8, color: X.textMut }}>%</M>
          </div>
          <Badge color={spo2Color}>{liveSpo2 >= 95 ? 'Normal' : 'Low'}</Badge>
        </div>

        {/* Blood Pressure */}
        <div style={{ padding: '8px 10px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
          <Lbl style={{ marginBottom: 4 }}>Blood Pressure</Lbl>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <M style={{ fontSize: 18, fontWeight: 800, color: bpColor }}>{bpSys}</M>
            <M style={{ fontSize: 10, color: X.textMut }}>/</M>
            <M style={{ fontSize: 14, fontWeight: 700, color: bpColor }}>{bpDia}</M>
            <M style={{ fontSize: 8, color: X.textMut, marginLeft: 2 }}>mmHg</M>
          </div>
        </div>

        {/* Resp Rate */}
        <div style={{ padding: '8px 10px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
          <Lbl style={{ marginBottom: 4 }}>Resp Rate</Lbl>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <M style={{ fontSize: 22, fontWeight: 800, color: respColor, letterSpacing: '-.02em' }}>{Math.round(liveResp)}</M>
            <M style={{ fontSize: 8, color: X.textMut }}>br/min</M>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Vitals Chart ────────────────────────────────────────────────────
export function VitalsChart({ title = 'Vitals Trend - 24h', delay = 0 }: { title?: string; delay?: number }) {
  const X = getX();
  const tick = useTick(3000);

  const hrData = useMemo(() => Array.from({ length: 24 }, () => 65 + Math.random() * 30), []);
  const spo2Data = useMemo(() => Array.from({ length: 24 }, () => 93 + Math.random() * 6), []);
  const tempData = useMemo(() => Array.from({ length: 24 }, () => 36.2 + Math.random() * 1.8), []);

  const makePts = (data: number[], min: number, max: number) =>
    data.map((v, i) => `${(i / 23) * 100},${100 - ((v - min) / (max - min)) * 80 - 10}`).join(' ');

  const hrPts = makePts(hrData, 50, 110);
  const spo2Pts = makePts(spo2Data, 88, 100);
  const tempPts = makePts(tempData, 35.5, 39);

  const series: { label: string; color: string; pts: string; last: string }[] = [
    { label: 'HR', color: X.red, pts: hrPts, last: Math.round(hrData[23]) + ' BPM' },
    { label: 'SpO2', color: X.teal, pts: spo2Pts, last: hrData[23] > 0 ? Math.round(spo2Data[23]) + '%' : '' },
    { label: 'Temp', color: X.amber, pts: tempPts, last: tempData[23].toFixed(1) + ' C' },
  ];

  return (
    <Card delay={delay} style={{ width: 440 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}>Live</Badge>
      </div>

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 80, overflow: 'hidden', marginBottom: 8 }}>
        {/* Grid lines */}
        {[25, 50, 75].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke={X.borderLight} strokeWidth=".3" vectorEffect="non-scaling-stroke" />
        ))}
        {series.map((s, i) => (
          <polyline key={i} points={s.pts} fill="none" stroke={s.color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" opacity={0.85} style={{ filter: `drop-shadow(0 0 2px ${s.color}30)` }} />
        ))}
      </svg>

      {/* Time axis labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        {['00:00', '06:00', '12:00', '18:00', '24:00'].map(t => (
          <M key={t} style={{ fontSize: 7, color: X.textMut }}>{t}</M>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 12 }}>
        {series.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Dot c={s.color} s={5} />
            <M style={{ fontSize: 8, color: X.textMut }}>{s.label}</M>
            <M style={{ fontSize: 8, fontWeight: 700, color: s.color }}>{s.last}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Bed Manager ─────────────────────────────────────────────────────
export function BedManager({ title = 'Bed Occupancy', delay = 0 }: { title?: string; delay?: number }) {
  const X = getX();

  const beds = useMemo(() => {
    const statuses: ('occupied' | 'available' | 'cleaning' | 'reserved')[] = ['occupied', 'available', 'cleaning', 'reserved'];
    return Array.from({ length: 12 }, (_, i) => ({
      id: `${Math.floor(i / 4) + 2}${String.fromCharCode(65 + (i % 4))}`,
      status: i < 7 ? 'occupied' : i < 9 ? 'available' : i < 11 ? 'cleaning' : 'reserved' as typeof statuses[number],
      patient: i < 7 ? ['J. Smith', 'M. Chen', 'R. Patel', 'S. Kim', 'A. Garcia', 'L. Brown', 'T. Wilson'][i] : null,
    }));
  }, []);

  const statusColor: Record<string, string> = { occupied: X.red, available: X.teal, cleaning: X.amber, reserved: X.purple };
  const occupied = beds.filter(b => b.status === 'occupied').length;
  const pct = Math.round((occupied / beds.length) * 100);

  return (
    <Card delay={delay} style={{ width: 370 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <M style={{ fontSize: 16, fontWeight: 800, color: pct > 85 ? X.red : pct > 70 ? X.amber : X.teal }}>{pct}%</M>
      </div>

      <Prog value={pct} color={pct > 85 ? X.red : pct > 70 ? X.amber : X.teal} h={3} style={{ marginBottom: 10 }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginBottom: 10 }}>
        {beds.map((b, i) => (
          <div key={i} style={{
            padding: '6px 4px', borderRadius: X.rs, textAlign: 'center',
            background: statusColor[b.status] + '10',
            border: `1px solid ${statusColor[b.status]}25`,
            animation: `fu 150ms ${ease.o} ${i * 20}ms both`,
          }}>
            <M style={{ fontSize: 10, fontWeight: 700, color: X.text, display: 'block', marginBottom: 2 }}>{b.id}</M>
            <Dot c={statusColor[b.status]} pulse={b.status === 'occupied'} s={5} />
            {b.patient && <M style={{ fontSize: 6, color: X.textSec, display: 'block', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.patient}</M>}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(['occupied', 'available', 'cleaning', 'reserved'] as const).map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Dot c={statusColor[s]} s={4} />
            <M style={{ fontSize: 7, color: X.textMut, textTransform: 'capitalize' }}>{s}</M>
            <M style={{ fontSize: 7, fontWeight: 700, color: statusColor[s] }}>{beds.filter(b => b.status === s).length}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Nurse Call Board ────────────────────────────────────────────────
export function NurseCallBoard({ title = 'Nurse Call Board', delay = 0 }: { title?: string; delay?: number }) {
  const X = getX();
  const tick = useTick(1000);

  const calls = useMemo(() => [
    { room: '3A', patient: 'J. Smith', priority: 'urgent', elapsed: 45, status: 'active' },
    { room: '2C', patient: 'M. Chen', priority: 'normal', elapsed: 180, status: 'active' },
    { room: '4B', patient: 'R. Patel', priority: 'urgent', elapsed: 12, status: 'responding' },
    { room: '2A', patient: 'S. Kim', priority: 'low', elapsed: 420, status: 'active' },
    { room: '3D', patient: 'L. Brown', priority: 'normal', elapsed: 90, status: 'responding' },
    { room: '5A', patient: 'A. Garcia', priority: 'urgent', elapsed: 8, status: 'active' },
  ], []);

  const prioColor: Record<string, string> = { urgent: X.red, normal: X.amber, low: X.teal };
  const statusColor: Record<string, string> = { active: X.red, responding: X.purple };

  const formatElapsed = (s: number) => {
    const total = s + tick;
    if (total < 60) return `${total}s`;
    return `${Math.floor(total / 60)}m ${total % 60}s`;
  };

  const urgentCount = calls.filter(c => c.priority === 'urgent').length;

  return (
    <Card delay={delay} noPad style={{ width: 400 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.red}><Dot c={X.red} pulse s={4} />{urgentCount} Urgent</Badge>
      </div>
      <div style={{ padding: '0 6px 8px' }}>
        {calls.map((c, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 3,
            borderLeft: `2px solid ${prioColor[c.priority]}`,
            background: i % 2 === 0 ? X.bgAlt : 'transparent',
            marginBottom: 2,
            animation: `sr 150ms ${ease.o} ${i * 25}ms both`,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: X.rs,
              background: prioColor[c.priority] + '15',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${prioColor[c.priority]}25`,
            }}>
              <M style={{ fontSize: 10, fontWeight: 800, color: prioColor[c.priority] }}>{c.room}</M>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <M style={{ fontSize: 10, fontWeight: 600, color: X.text, display: 'block' }}>{c.patient}</M>
              <M style={{ fontSize: 8, color: X.textMut }}>{formatElapsed(c.elapsed)}</M>
            </div>
            <Badge color={prioColor[c.priority]}>{c.priority}</Badge>
            <Dot c={statusColor[c.status]} pulse={c.status === 'active'} s={6} />
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Lab Results ─────────────────────────────────────────────────────
export function LabResults({ title = 'Lab Results', panelType = 'CBC + Chem', delay = 0 }: { title?: string; panelType?: string; delay?: number }) {
  const X = getX();

  const results = useMemo(() => [
    { test: 'Hemoglobin', value: 14.2, unit: 'g/dL', range: '12.0-17.5', status: 'normal' },
    { test: 'WBC Count', value: 11.8, unit: 'K/uL', range: '4.5-11.0', status: 'high' },
    { test: 'Platelets', value: 245, unit: 'K/uL', range: '150-400', status: 'normal' },
    { test: 'Glucose', value: 68, unit: 'mg/dL', range: '70-100', status: 'low' },
    { test: 'Creatinine', value: 1.1, unit: 'mg/dL', range: '0.7-1.3', status: 'normal' },
    { test: 'Potassium', value: 5.6, unit: 'mEq/L', range: '3.5-5.0', status: 'high' },
  ], []);

  const statusColor: Record<string, string> = { normal: X.teal, high: X.red, low: X.amber };
  const abnormal = results.filter(r => r.status !== 'normal').length;

  return (
    <Card delay={delay} noPad style={{ width: 460 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {abnormal > 0 && <Badge color={X.red}>{abnormal} Abnormal</Badge>}
          <Badge color={X.purple}>{panelType}</Badge>
        </div>
      </div>

      <div style={{ padding: '0 6px 4px' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '90px 60px 44px 72px 54px', gap: 4, padding: '4px 8px', borderBottom: `1px solid ${X.borderLight}` }}>
          {['Test', 'Value', 'Unit', 'Ref Range', 'Status'].map(h => <Lbl key={h}>{h}</Lbl>)}
        </div>

        {/* Rows */}
        {results.map((r, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '90px 60px 44px 72px 54px', gap: 4,
            padding: '5px 8px', borderRadius: 3,
            background: i % 2 === 0 ? X.bgAlt : 'transparent',
            borderLeft: r.status !== 'normal' ? `2px solid ${statusColor[r.status]}` : '2px solid transparent',
            animation: `sr 120ms ${ease.o} ${i * 15}ms both`,
          }}>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.text }}>{r.test}</M>
            <M style={{ fontSize: 10, fontWeight: 700, color: statusColor[r.status] }}>{r.value}</M>
            <M style={{ fontSize: 8, color: X.textMut }}>{r.unit}</M>
            <M style={{ fontSize: 8, color: X.textMut }}>{r.range}</M>
            <Badge color={statusColor[r.status]}>{r.status}</Badge>
          </div>
        ))}
      </div>

      <div style={{ padding: '6px 14px 10px', borderTop: `1px solid ${X.borderLight}` }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Collected 08:15 AM  |  Reported 09:42 AM</M>
      </div>
    </Card>
  );
}

// ── Pharmacy Queue ──────────────────────────────────────────────────
export function PharmacyQueue({ title = 'Pharmacy Queue', delay = 0 }: { title?: string; delay?: number }) {
  const X = getX();
  const tick = useTick(5000);

  const prescriptions = useMemo(() => [
    { initials: 'JS', medication: 'Amoxicillin 500mg', status: 'ready', pos: 1 },
    { initials: 'MC', medication: 'Metformin 1000mg', status: 'dispensing', pos: 2 },
    { initials: 'RP', medication: 'Lisinopril 10mg', status: 'dispensing', pos: 3 },
    { initials: 'SK', medication: 'Omeprazole 20mg', status: 'pending', pos: 4 },
    { initials: 'AG', medication: 'Atorvastatin 40mg', status: 'pending', pos: 5 },
    { initials: 'LB', medication: 'Sertraline 50mg', status: 'pending', pos: 6 },
    { initials: 'TW', medication: 'Amlodipine 5mg', status: 'pending', pos: 7 },
    { initials: 'DN', medication: 'Gabapentin 300mg', status: 'pending', pos: 8 },
  ], []);

  const statusColor: Record<string, string> = { ready: X.teal, dispensing: X.purple, pending: X.textMut };
  const statusLabel: Record<string, string> = { ready: 'Ready', dispensing: 'Dispensing', pending: 'Pending' };
  const ready = prescriptions.filter(p => p.status === 'ready').length;
  const dispensing = prescriptions.filter(p => p.status === 'dispensing').length;

  return (
    <Card delay={delay} noPad style={{ width: 370 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <Badge color={X.teal}>{ready} Ready</Badge>
          <Badge color={X.purple}>{dispensing} Active</Badge>
        </div>
      </div>

      <div style={{ padding: '0 6px 8px' }}>
        {prescriptions.map((p, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 3,
            background: i % 2 === 0 ? X.bgAlt : 'transparent',
            animation: `sr 120ms ${ease.o} ${i * 15}ms both`,
          }}>
            {/* Position */}
            <M style={{ fontSize: 9, fontWeight: 700, color: X.textMut, minWidth: 14, textAlign: 'center' }}>#{p.pos}</M>

            {/* Initials Avatar */}
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: statusColor[p.status] + '18',
              border: `1px solid ${statusColor[p.status]}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <M style={{ fontSize: 8, fontWeight: 700, color: statusColor[p.status] }}>{p.initials}</M>
            </div>

            {/* Medication */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <M style={{ fontSize: 9, fontWeight: 600, color: X.text, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.medication}</M>
            </div>

            {/* Status */}
            <Dot c={statusColor[p.status]} pulse={p.status === 'dispensing'} s={5} />
            <Badge color={statusColor[p.status]}>{statusLabel[p.status]}</Badge>
          </div>
        ))}
      </div>

      <div style={{ padding: '6px 14px 10px', borderTop: `1px solid ${X.borderLight}`, display: 'flex', justifyContent: 'space-between' }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Avg wait: 12 min</M>
        <M style={{ fontSize: 8, color: X.textMut }}>{prescriptions.length} in queue</M>
      </div>
    </Card>
  );
}

// ── Triage Status ───────────────────────────────────────────────────
export function TriageStatus({ title = 'Triage Status', maxBeds = 30, delay = 0 }: { title?: string; maxBeds?: number; delay?: number }) {
  const X = getX();

  const levels = useMemo(() => [
    { esi: 1, label: 'Resuscitation', count: 1, color: X.red, wait: '0 min', desc: 'Immediate' },
    { esi: 2, label: 'Emergent', count: 4, color: '#e85d3a', wait: '8 min', desc: 'High urgency' },
    { esi: 3, label: 'Urgent', count: 12, color: X.amber, wait: '35 min', desc: 'Moderate' },
    { esi: 4, label: 'Less Urgent', count: 8, color: X.purple, wait: '1h 15m', desc: 'Low urgency' },
    { esi: 5, label: 'Non-Urgent', count: 3, color: X.teal, wait: '2h 30m', desc: 'Minor' },
  ], [X]);

  const totalPatients = levels.reduce((a, l) => a + l.count, 0);
  const maxCount = Math.max(...levels.map(l => l.count));
  const animTotal = useAnim(totalPatients, 800);

  return (
    <Card delay={delay} style={{ width: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <M style={{ fontSize: 18, fontWeight: 800, color: X.text }}>{Math.round(animTotal)}</M>
          <M style={{ fontSize: 8, color: X.textMut }}>patients</M>
        </div>
      </div>

      {levels.map((l, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
          borderBottom: i < levels.length - 1 ? `1px solid ${X.borderLight}` : 'none',
          animation: `sr 150ms ${ease.o} ${i * 25}ms both`,
        }}>
          {/* ESI Badge */}
          <div style={{
            width: 22, height: 22, borderRadius: '50%',
            background: l.color + '18', border: `1px solid ${l.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <M style={{ fontSize: 10, fontWeight: 800, color: l.color }}>{l.esi}</M>
          </div>

          {/* Label + description */}
          <div style={{ minWidth: 80 }}>
            <M style={{ fontSize: 9, fontWeight: 700, color: X.text, display: 'block' }}>{l.label}</M>
            <M style={{ fontSize: 7, color: X.textMut }}>{l.desc}</M>
          </div>

          {/* Bar */}
          <div style={{ flex: 1, height: 8, borderRadius: 4, background: X.borderLight, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 4,
              width: `${(l.count / maxCount) * 100}%`,
              background: l.color,
              transition: `width 500ms ${ease.sp}`,
              boxShadow: `0 0 6px ${l.color}30`,
            }} />
          </div>

          {/* Count */}
          <M style={{ fontSize: 11, fontWeight: 800, color: l.color, minWidth: 18, textAlign: 'right' }}>{l.count}</M>

          {/* Wait Time */}
          <div style={{ minWidth: 44, textAlign: 'right' }}>
            <M style={{ fontSize: 8, fontWeight: 600, color: l.esi <= 2 ? l.color : X.textSec }}>{l.wait}</M>
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <Lbl>ED Capacity</Lbl>
        <M style={{ fontSize: 9, fontWeight: 700, color: totalPatients > (maxBeds * 0.83) ? X.red : X.teal }}>{totalPatients}/{maxBeds} beds</M>
      </div>
      <Prog value={(totalPatients / maxBeds) * 100} color={totalPatients > (maxBeds * 0.83) ? X.red : totalPatients > (maxBeds * 0.67) ? X.amber : X.teal} h={2} style={{ marginTop: 4 }} />
    </Card>
  );
}
