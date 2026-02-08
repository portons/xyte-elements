import { useState, useMemo } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot, Prog } from '../primitives';
import { useAnim, useTick } from '../hooks';

// ── Site Progress ────────────────────────────────────────────────────
export function SiteProgress({ title = 'Site Progress', targetDate = 'Jan 2026' }: { title?: string; targetDate?: string }) {
  const X = getX();
  const milestones = useMemo(() => [
    { name: 'Foundation', pct: 100, status: 'complete' as const, target: '2025-01-15' },
    { name: 'Structural', pct: 100, status: 'complete' as const, target: '2025-04-20' },
    { name: 'MEP Rough-In', pct: 78, status: 'in-progress' as const, target: '2025-07-10' },
    { name: 'Envelope', pct: 34, status: 'in-progress' as const, target: '2025-09-01' },
    { name: 'Interior', pct: 0, status: 'upcoming' as const, target: '2025-11-15' },
    { name: 'Punch List', pct: 0, status: 'upcoming' as const, target: '2026-01-30' },
  ], []);

  const animPcts = [
    useAnim(milestones[0].pct, 1000),
    useAnim(milestones[1].pct, 1100),
    useAnim(milestones[2].pct, 1200),
    useAnim(milestones[3].pct, 1300),
    useAnim(milestones[4].pct, 1400),
    useAnim(milestones[5].pct, 1500),
  ];

  const overall = milestones.reduce((a, m) => a + m.pct, 0) / milestones.length;
  const animOverall = useAnim(overall, 1400);

  const sc: Record<string, string> = { complete: X.teal, 'in-progress': X.amber, upcoming: X.textMut };

  return (
    <Card style={{ width: 420 }} glow={X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={overall >= 80 ? X.teal : overall >= 40 ? X.amber : X.red} solid>{Math.round(overall)}% Complete</Badge>
      </div>
      <div style={{ textAlign: 'center', padding: '8px 0 14px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}`, marginBottom: 12 }}>
        <Lbl style={{ marginBottom: 4 }}>Overall Completion</Lbl>
        <M style={{ fontSize: 36, fontWeight: 800, color: X.teal, display: 'block', letterSpacing: '-.02em' }}>{animOverall.toFixed(1)}%</M>
        <M style={{ fontSize: 9, color: X.textMut }}>Target Delivery: {targetDate}</M>
      </div>
      {milestones.map((m, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: X.rs, marginBottom: i < milestones.length - 1 ? 3 : 0,
          background: m.status === 'in-progress' ? X.amber + '08' : 'transparent',
          animation: `fu 150ms ${ease.o} ${i * 25}ms both`,
        }}>
          <Dot c={sc[m.status]} pulse={m.status === 'in-progress'} s={7} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
              <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{m.name}</M>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <M style={{ fontSize: 8, color: X.textMut }}>{m.target}</M>
                <M style={{ fontSize: 9, fontWeight: 700, color: sc[m.status], minWidth: 28, textAlign: 'right' }}>{Math.round(animPcts[i])}%</M>
              </div>
            </div>
            <Prog value={animPcts[i]} color={sc[m.status]} h={3} />
          </div>
        </div>
      ))}
    </Card>
  );
}

// ── Crane Monitor ────────────────────────────────────────────────────
export function CraneMonitor({ title = 'Crane Monitor', windLimit = 25 }: { title?: string; windLimit?: number }) {
  const X = getX();
  const cranes = useMemo(() => [
    { id: 'TC-01', status: 'operating' as const, maxCap: 12, height: 65 },
    { id: 'TC-02', status: 'standby' as const, maxCap: 10, height: 52 },
    { id: 'TC-03', status: 'maintenance' as const, maxCap: 15, height: 70 },
  ], []);

  const loads = [
    8.4,
    0,
    0,
  ];

  const winds = [
    14.2,
    13.8,
    15.1,
  ];

  const sc: Record<string, string> = { operating: X.teal, standby: X.amber, maintenance: X.red };

  return (
    <Card style={{ width: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{cranes.filter(c => c.status === 'operating').length}/{cranes.length} Active</Badge>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        {cranes.map((cr, i) => {
          const loadPct = cr.status === 'operating' ? (Math.max(0, loads[i]) / cr.maxCap) * 100 : 0;
          const loadColor = loadPct > 80 ? X.red : loadPct > 60 ? X.amber : X.teal;
          return (
            <div key={i} style={{
              padding: '8px 10px', borderRadius: X.rs,
              background: X.bgAlt, border: `1px solid ${sc[cr.status]}25`,
              animation: `fu 150ms ${ease.o} ${i * 40}ms both`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <M style={{ fontSize: 11, fontWeight: 700, color: X.purple }}>{cr.id}</M>
                <Dot c={sc[cr.status]} pulse={cr.status === 'operating'} s={6} />
              </div>
              <Badge color={sc[cr.status]} style={{ marginBottom: 8, display: 'inline-flex' }}>{cr.status}</Badge>
              <div style={{ marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                  <Lbl>Load</Lbl>
                  <M style={{ fontSize: 8, fontWeight: 600, color: loadColor }}>
                    {cr.status === 'operating' ? `${Math.max(0, loads[i]).toFixed(1)}t` : '--'}
                  </M>
                </div>
                <Prog value={loadPct} color={loadColor} h={3} />
                <M style={{ fontSize: 7, color: X.textMut, display: 'block', textAlign: 'right', marginTop: 1 }}>Max: {cr.maxCap}t</M>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <Lbl>Wind</Lbl>
                <M style={{ fontSize: 8, fontWeight: 600, color: winds[i] > windLimit ? X.red : X.textSec }}>{winds[i].toFixed(1)} mph</M>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Lbl>Height</Lbl>
                <M style={{ fontSize: 8, fontWeight: 600, color: X.textSec }}>{cr.height}m</M>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Materials Tracker ────────────────────────────────────────────────
export function MaterialsTracker({ title = 'Materials Tracker', statusFilter = 'all' }: { title?: string; statusFilter?: string }) {
  const X = getX();
  const materials = useMemo(() => [
    { name: 'Steel Rebar', qty: 4200, unit: 'lbs', reorder: 1000, status: 'adequate' as const },
    { name: 'Portland Cement', qty: 320, unit: 'bags', reorder: 200, status: 'adequate' as const },
    { name: 'Lumber (4x8)', qty: 85, unit: 'sheets', reorder: 100, status: 'low' as const },
    { name: 'Concrete Mix', qty: 180, unit: 'cu yd', reorder: 50, status: 'adequate' as const },
    { name: 'Copper Wire', qty: 12, unit: 'spools', reorder: 15, status: 'critical' as const },
    { name: 'Drywall Sheets', qty: 540, unit: 'pcs', reorder: 200, status: 'adequate' as const },
  ], []);

  const sc: Record<string, string> = { adequate: X.teal, low: X.amber, critical: X.red };

  return (
    <Card noPad style={{ width: 380 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.red}>{materials.filter(m => m.status === 'critical').length} Critical</Badge>
      </div>
      <div style={{ padding: '0 6px 6px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 52px 40px 52px 56px', gap: 4, padding: '4px 8px', borderBottom: `1px solid ${X.borderLight}` }}>
          {['Material', 'Qty', 'Unit', 'Reorder', 'Status'].map(h => <Lbl key={h}>{h}</Lbl>)}
        </div>
        {materials.map((m, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 52px 40px 52px 56px', gap: 4, padding: '5px 8px', borderRadius: 3,
            background: i % 2 === 0 ? X.bgAlt : 'transparent', alignItems: 'center',
            animation: `sr 120ms ${ease.o} ${i * 15}ms both`,
          }}>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</M>
            <M style={{ fontSize: 9, fontWeight: 600, color: sc[m.status] }}>{m.qty.toLocaleString()}</M>
            <M style={{ fontSize: 8, color: X.textMut }}>{m.unit}</M>
            <M style={{ fontSize: 8, color: X.textMut }}>{m.reorder.toLocaleString()}</M>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Dot c={sc[m.status]} pulse={m.status === 'critical'} s={5} />
              <M style={{ fontSize: 8, color: sc[m.status] }}>{m.status}</M>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Weather Site ─────────────────────────────────────────────────────
export function WeatherSite({ title = 'Site Weather', tempUnit = 'F', temp, wind, gusts, humidity, precip }: { title?: string; tempUnit?: string; temp: number; wind: number; gusts: number; humidity: number; precip: number }) {
  const X = getX();

  const forecast = useMemo(() => [
    { hour: '+1h', temp: 84, wind: 20, icon: 'Partly Cloudy' },
    { hour: '+2h', temp: 85, wind: 22, icon: 'Cloudy' },
    { hour: '+3h', temp: 83, wind: 19, icon: 'Partly Cloudy' },
  ], []);

  const windDanger = wind > 25 || gusts > 35;
  const lightningRisk = precip > 40;
  const safeColor = windDanger || lightningRisk ? (windDanger && lightningRisk ? X.red : X.amber) : X.teal;
  const safeLabel = windDanger || lightningRisk ? (windDanger && lightningRisk ? 'STOP WORK' : 'CAUTION') : 'WORK SAFE';

  return (
    <Card style={{ width: 370 }} glow={X.amber}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={safeColor} solid>{safeLabel}</Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
        <div style={{ animation: `fu 200ms ${ease.o} both` }}>
          <M style={{ fontSize: 42, fontWeight: 800, color: X.text, lineHeight: 1, display: 'block' }}>{Math.round(temp)}</M>
          <M style={{ fontSize: 11, color: X.textMut }}>°{tempUnit}</M>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            {([
              ['Wind', `${wind.toFixed(1)} mph`, wind > 25 ? X.red : X.textSec],
              ['Gusts', `${gusts.toFixed(1)} mph`, gusts > 35 ? X.red : X.textSec],
              ['Humidity', `${humidity.toFixed(0)}%`, X.indigo],
              ['Precip %', `${Math.max(0, precip).toFixed(0)}%`, precip > 40 ? X.red : X.textSec],
            ] as [string, string, string][]).map(([label, val, c], i) => (
              <div key={i} style={{ animation: `fu 150ms ${ease.o} ${(i + 1) * 30}ms both` }}>
                <Lbl style={{ marginBottom: 2 }}>{label}</Lbl>
                <M style={{ fontSize: 10, fontWeight: 600, color: c }}>{val}</M>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Lbl style={{ marginBottom: 6 }}>3-Hour Forecast</Lbl>
      <div style={{ display: 'flex', gap: 6 }}>
        {forecast.map((f, i) => (
          <div key={i} style={{
            flex: 1, padding: '6px 8px', borderRadius: X.rs,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
            animation: `fu 150ms ${ease.o} ${(i + 5) * 25}ms both`,
          }}>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.purple, display: 'block', marginBottom: 3 }}>{f.hour}</M>
            <M style={{ fontSize: 14, fontWeight: 800, color: X.text, display: 'block' }}>{f.temp}°</M>
            <M style={{ fontSize: 7, color: X.textMut, display: 'block', marginBottom: 2 }}>{f.icon}</M>
            <M style={{ fontSize: 8, color: f.wind > 25 ? X.red : X.textMut }}>{f.wind} mph</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Safety Board ─────────────────────────────────────────────────────
export function SafetyBoard({ title = 'Safety Board', incidentGoal = 0, workersOnSite }: { title?: string; incidentGoal?: number; workersOnSite: number }) {
  const X = getX();
  const daysWithout = useAnim(147, 1600);
  const totalIncidents = 3;
  const nearMisses = 11;

  const categories = useMemo(() => [
    { label: 'Falls', count: 1, color: X.red },
    { label: 'Struck-by', count: 1, color: X.amber },
    { label: 'Electrical', count: 0, color: X.indigo },
    { label: 'Other', count: 1, color: X.textMut },
  ], []);

  const oshaCompliant = true;

  return (
    <Card style={{ width: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={oshaCompliant ? X.teal : X.red} solid>{oshaCompliant ? 'OSHA COMPLIANT' : 'NON-COMPLIANT'}</Badge>
      </div>
      <div style={{ textAlign: 'center', padding: '10px 0 12px', borderRadius: X.rs, background: X.teal + '0a', border: `1px solid ${X.teal}20`, marginBottom: 12, animation: `fu 200ms ${ease.o} both` }}>
        <Lbl style={{ marginBottom: 4 }}>Days Without Incident</Lbl>
        <M style={{ fontSize: 44, fontWeight: 800, color: X.teal, display: 'block', letterSpacing: '-.02em' }}>{Math.round(daysWithout)}</M>
        <M style={{ fontSize: 9, color: X.textMut }}>Last incident: Sep 12, 2025</M>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {([
          ['Incidents YTD', totalIncidents, X.red],
          ['Near Misses', nearMisses, X.amber],
          ['Workers On Site', Math.round(workersOnSite), X.indigo],
        ] as [string, number, string][]).map(([label, val, c], i) => (
          <div key={i} style={{
            flex: 1, padding: '6px 8px', borderRadius: X.rs,
            background: c + '10', border: `1px solid ${c}20`, textAlign: 'center',
            animation: `fu 150ms ${ease.o} ${(i + 1) * 30}ms both`,
          }}>
            <Lbl style={{ marginBottom: 3 }}>{label}</Lbl>
            <M style={{ fontSize: 18, fontWeight: 800, color: c, display: 'block' }}>{val}</M>
          </div>
        ))}
      </div>
      <Lbl style={{ marginBottom: 6 }}>Incident Breakdown</Lbl>
      <div style={{ display: 'flex', gap: 6 }}>
        {categories.map((cat, i) => (
          <div key={i} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '6px 4px', borderRadius: X.rs,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
            animation: `fu 150ms ${ease.o} ${(i + 4) * 25}ms both`,
          }}>
            <Dot c={cat.color} s={8} />
            <M style={{ fontSize: 16, fontWeight: 800, color: cat.count > 0 ? cat.color : X.textMut }}>{cat.count}</M>
            <M style={{ fontSize: 7, color: X.textMut, textAlign: 'center' }}>{cat.label}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Concrete Monitor ─────────────────────────────────────────────────
export function ConcreteMonitor({ title = 'Concrete Monitor', targetPSI = 4000, slump, airContent, concreteTemp }: { title?: string; targetPSI?: number; slump: number; airContent: number; concreteTemp: number }) {
  const X = getX();

  const curePoints = useMemo(() => [
    { id: 'CP-A', loc: 'Column A3', target28: 4000 },
    { id: 'CP-B', loc: 'Beam B7', target28: 4000 },
    { id: 'CP-C', loc: 'Slab S2', target28: 4000 },
    { id: 'CP-D', loc: 'Footing F1', target28: 4000 },
  ], []);

  const cureStrengths = [
    useAnim(68, 1400),
    useAnim(54, 1500),
    useAnim(82, 1300),
    useAnim(91, 1200),
  ];

  const cureColor = (v: number) => v >= 80 ? X.teal : v >= 50 ? X.amber : X.red;

  return (
    <Card style={{ width: 380 }} glow={X.purple}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}>Active Pour</Badge>
      </div>
      <div style={{ padding: '8px 10px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.purple}20`, marginBottom: 12, animation: `fu 200ms ${ease.o} both` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div>
            <Lbl style={{ marginBottom: 2 }}>Batch ID</Lbl>
            <M style={{ fontSize: 12, fontWeight: 700, color: X.purple }}>BX-20260206-04</M>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Lbl style={{ marginBottom: 2 }}>Mix Design</Lbl>
            <M style={{ fontSize: 12, fontWeight: 700, color: X.text }}>{targetPSI} PSI</M>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Lbl style={{ marginBottom: 2 }}>Slump</Lbl>
            <M style={{ fontSize: 16, fontWeight: 800, color: slump > 5.5 || slump < 3 ? X.red : X.teal }}>{slump.toFixed(1)}<span style={{ fontSize: 8, color: X.textMut }}> in</span></M>
          </div>
          <div style={{ flex: 1 }}>
            <Lbl style={{ marginBottom: 2 }}>Air Content</Lbl>
            <M style={{ fontSize: 16, fontWeight: 800, color: airContent > 7 || airContent < 4 ? X.amber : X.teal }}>{airContent.toFixed(1)}<span style={{ fontSize: 8, color: X.textMut }}> %</span></M>
          </div>
          <div style={{ flex: 1 }}>
            <Lbl style={{ marginBottom: 2 }}>Temp</Lbl>
            <M style={{ fontSize: 16, fontWeight: 800, color: concreteTemp > 90 ? X.red : X.text }}>{Math.round(concreteTemp)}<span style={{ fontSize: 8, color: X.textMut }}> °F</span></M>
          </div>
        </div>
      </div>
      <Lbl style={{ marginBottom: 6 }}>Cure Monitoring — 28-Day Strength</Lbl>
      {curePoints.map((cp, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0',
          borderBottom: i < curePoints.length - 1 ? `1px solid ${X.borderLight}` : 'none',
          animation: `fu 150ms ${ease.o} ${(i + 2) * 25}ms both`,
        }}>
          <div style={{ width: 44 }}>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.purple }}>{cp.id}</M>
          </div>
          <div style={{ flex: 1 }}>
            <M style={{ fontSize: 8, color: X.textMut, display: 'block', marginBottom: 2 }}>{cp.loc}</M>
            <Prog value={cureStrengths[i]} color={cureColor(cureStrengths[i])} h={3} />
          </div>
          <M style={{ fontSize: 10, fontWeight: 700, color: cureColor(cureStrengths[i]), minWidth: 32, textAlign: 'right' }}>{Math.round(cureStrengths[i])}%</M>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Target: {targetPSI} PSI @ 28 days</M>
        <M style={{ fontSize: 8, color: X.textMut }}>Spec: ACI 318</M>
      </div>
    </Card>
  );
}

// ── Equipment Fleet ──────────────────────────────────────────────────
export function EquipmentFleet({ title = 'Equipment Fleet', lowFuelThreshold = 25 }: { title?: string; lowFuelThreshold?: number }) {
  const X = getX();
  const machines = useMemo(() => [
    { name: 'Excavator', operator: 'J. Martinez', fuel: 72, hours: 6.4, status: 'active' as const },
    { name: 'Bulldozer', operator: 'R. Thompson', fuel: 45, hours: 5.1, status: 'active' as const },
    { name: 'Crane #1', operator: 'M. O\'Brien', fuel: 88, hours: 7.2, status: 'idle' as const },
    { name: 'Loader', operator: 'S. Kim', fuel: 33, hours: 4.8, status: 'active' as const },
    { name: 'Concrete Pump', operator: 'A. Rivera', fuel: 61, hours: 3.5, status: 'active' as const },
    { name: 'Generator', operator: 'D. Nguyen', fuel: 19, hours: 8.0, status: 'maintenance' as const },
  ], []);

  const fuelAnims = [
    useAnim(machines[0].fuel, 1200),
    useAnim(machines[1].fuel, 1200),
    useAnim(machines[2].fuel, 1200),
    useAnim(machines[3].fuel, 1200),
    useAnim(machines[4].fuel, 1200),
    useAnim(machines[5].fuel, 1200),
  ];

  const sc: Record<string, string> = { active: X.teal, idle: X.amber, maintenance: X.red };
  const fuelColor = (v: number) => v >= 50 ? X.teal : v >= lowFuelThreshold ? X.amber : X.red;

  return (
    <Card noPad style={{ width: 440 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{machines.filter(m => m.status === 'active').length}/{machines.length} Active</Badge>
      </div>
      <div style={{ padding: '0 6px 6px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 80px 1fr 46px 62px', gap: 4, padding: '4px 8px', borderBottom: `1px solid ${X.borderLight}` }}>
          {['Equipment', 'Operator', 'Fuel', 'Hours', 'Status'].map(h => <Lbl key={h}>{h}</Lbl>)}
        </div>
        {machines.map((m, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '80px 80px 1fr 46px 62px', gap: 4, padding: '5px 8px', borderRadius: 3,
            background: i % 2 === 0 ? X.bgAlt : 'transparent', alignItems: 'center',
            animation: `sr 120ms ${ease.o} ${i * 15}ms both`,
          }}>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</M>
            <M style={{ fontSize: 8, color: X.textSec, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.operator}</M>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Prog value={fuelAnims[i]} color={fuelColor(m.fuel)} h={3} style={{ flex: 1 }} />
              <M style={{ fontSize: 8, fontWeight: 600, color: fuelColor(m.fuel), minWidth: 22, textAlign: 'right' }}>{m.fuel}%</M>
            </div>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.textSec }}>{m.hours}h</M>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Dot c={sc[m.status]} pulse={m.status === 'active'} s={5} />
              <M style={{ fontSize: 8, color: sc[m.status] }}>{m.status}</M>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
