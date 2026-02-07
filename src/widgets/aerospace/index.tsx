import { useState, useMemo } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot, Prog } from '../primitives';
import { useAnim, useLive, useTick } from '../hooks';

// ── Flight Board ───────────────────────────────────────────────────
export function FlightBoard({ title = 'Departures', maxFlights = 6 }: {
  title?: string; maxFlights?: number;
}) {
  const X = getX();
  const tick = useTick(8000);

  const flights = useMemo(() => [
    { flight: 'UA 1842', city: 'San Francisco', time: '14:25', status: 'on-time' as const, gate: 'B22', terminal: 'T2' },
    { flight: 'DL 402', city: 'Atlanta', time: '14:40', status: 'boarding' as const, gate: 'C14', terminal: 'T3' },
    { flight: 'AA 1187', city: 'Dallas/Ft Worth', time: '15:05', status: 'delayed' as const, gate: 'A08', terminal: 'T1' },
    { flight: 'SW 3291', city: 'Denver', time: '15:15', status: 'on-time' as const, gate: 'D31', terminal: 'T4' },
    { flight: 'B6 724', city: 'Boston Logan', time: '15:30', status: 'departed' as const, gate: 'B18', terminal: 'T2' },
    { flight: 'UA 559', city: 'Chicago O\'Hare', time: '15:55', status: 'on-time' as const, gate: 'B24', terminal: 'T2' },
  ], []);

  const statusColor: Record<string, string> = { 'on-time': X.teal, boarding: X.purple, delayed: X.amber, departed: X.textMut };
  const statusLabel: Record<string, string> = { 'on-time': 'On Time', boarding: 'Boarding', delayed: 'Delayed', departed: 'Departed' };

  return (
    <Card noPad style={{ width: 460 }} glow={X.indigo}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo} solid>Live</Badge>
      </div>
      <div style={{ padding: '0 6px 8px' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '62px 1fr 44px 68px 34px 28px', gap: 4, padding: '4px 8px', borderBottom: `1px solid ${X.borderLight}` }}>
          {['Flight', 'Destination', 'Time', 'Status', 'Gate', 'Trm'].map(h => <Lbl key={h}>{h}</Lbl>)}
        </div>
        {flights.slice(0, maxFlights).map((f, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '62px 1fr 44px 68px 34px 28px', gap: 4,
            padding: '6px 8px', borderRadius: 3, alignItems: 'center',
            background: i % 2 === 0 ? X.bgAlt : 'transparent',
            opacity: f.status === 'departed' ? 0.5 : 1,
            animation: `sr 120ms ${ease.o} ${i * 15}ms both`,
          }}>
            <M style={{ fontSize: 10, fontWeight: 700, color: X.text }}>{f.flight}</M>
            <M style={{ fontSize: 9, fontWeight: 500, color: X.textSec, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.city}</M>
            <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{f.time}</M>
            <Badge color={statusColor[f.status]}>{statusLabel[f.status]}</Badge>
            <M style={{ fontSize: 10, fontWeight: 600, color: X.indigo }}>{f.gate}</M>
            <M style={{ fontSize: 9, color: X.textMut }}>{f.terminal}</M>
          </div>
        ))}
      </div>
      <div style={{ padding: '6px 14px 10px', borderTop: `1px solid ${X.borderLight}`, display: 'flex', justifyContent: 'space-between' }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</M>
        <M style={{ fontSize: 8, color: X.textMut }}>Terminal 1-4</M>
      </div>
    </Card>
  );
}

// ── Runway Status ──────────────────────────────────────────────────
export function RunwayStatus({ title = 'Runway Status', windUnit = 'kt' }: {
  title?: string; windUnit?: string;
}) {
  const X = getX();

  const runways = useMemo(() => [
    { designation: '09L/27R', status: 'active' as const, operation: 'Departures', baseWind: 12, visibility: 10 },
    { designation: '09R/27L', status: 'active' as const, operation: 'Arrivals', baseWind: 14, visibility: 8 },
    { designation: '04/22', status: 'closed' as const, operation: 'Maintenance', baseWind: 8, visibility: 10 },
  ], []);

  const windComponents = [
    useLive(runways[0].baseWind, 3, 2500),
    useLive(runways[1].baseWind, 4, 2800),
    useLive(runways[2].baseWind, 2, 3000),
  ];
  const visLive = [
    useLive(runways[0].visibility, 1.5, 4000),
    useLive(runways[1].visibility, 2, 3800),
    useLive(runways[2].visibility, 1, 4500),
  ];

  const statusColor: Record<string, string> = { active: X.teal, closed: X.red, maintenance: X.amber };
  const statusLabel: Record<string, string> = { active: 'Active', closed: 'Closed', maintenance: 'Maint.' };
  const activeCount = runways.filter(r => r.status === 'active').length;

  return (
    <Card style={{ width: 380 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={activeCount === runways.length ? X.teal : X.amber}>{activeCount}/{runways.length} Active</Badge>
      </div>
      {runways.map((r, i) => {
        const c = statusColor[r.status];
        const wind = Math.max(0, windComponents[i]);
        const vis = Math.max(0, visLive[i]);
        const windColor = wind > 20 ? X.red : wind > 15 ? X.amber : X.teal;
        return (
          <div key={i} style={{
            padding: '8px 10px', borderRadius: X.rs, marginBottom: 4,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
            borderLeft: `3px solid ${c}`,
            animation: `fu 150ms ${ease.o} ${i * 30}ms both`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <M style={{ fontSize: 12, fontWeight: 800, color: X.text }}>{r.designation}</M>
                <Badge color={c}>{statusLabel[r.status]}</Badge>
              </div>
              <Dot c={c} pulse={r.status === 'active'} s={6} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              <div>
                <Lbl style={{ marginBottom: 2 }}>Operation</Lbl>
                <M style={{ fontSize: 9, fontWeight: 600, color: r.status === 'closed' ? X.textMut : X.text }}>{r.operation}</M>
              </div>
              <div>
                <Lbl style={{ marginBottom: 2 }}>Crosswind</Lbl>
                <M style={{ fontSize: 10, fontWeight: 700, color: windColor }}>{wind.toFixed(0)}<span style={{ fontSize: 7, color: X.textMut }}> {windUnit}</span></M>
              </div>
              <div>
                <Lbl style={{ marginBottom: 2 }}>Visibility</Lbl>
                <M style={{ fontSize: 10, fontWeight: 700, color: vis < 5 ? X.red : vis < 8 ? X.amber : X.teal }}>{vis.toFixed(1)}<span style={{ fontSize: 7, color: X.textMut }}> SM</span></M>
              </div>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// ── Baggage Flow ───────────────────────────────────────────────────
export function BaggageFlow({ title = 'Baggage System', rateUnit = 'bags/min' }: {
  title?: string; rateUnit?: string;
}) {
  const X = getX();
  const totalBags = 18420;
  const animTotal = useAnim(totalBags, 1200);
  const currentRate = useLive(142, 18, 1800);

  const carousels = useMemo(() => [
    { id: 'C1', flight: 'UA 1842', status: 'active' as const, baseBags: 84 },
    { id: 'C2', flight: 'DL 402', status: 'active' as const, baseBags: 126 },
    { id: 'C3', flight: '—', status: 'idle' as const, baseBags: 0 },
    { id: 'C4', flight: 'AA 1187', status: 'active' as const, baseBags: 67 },
  ], []);

  const carouselBags = [
    useLive(carousels[0].baseBags, 8, 2500),
    useLive(carousels[1].baseBags, 12, 2200),
    useLive(0, 0, 5000),
    useLive(carousels[3].baseBags, 6, 2800),
  ];

  const sparkline = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < 20; i++) {
      const hour = i + 4;
      if (hour < 6) pts.push(20 + Math.random() * 15);
      else if (hour < 9) pts.push(80 + Math.random() * 40);
      else if (hour < 12) pts.push(120 + Math.random() * 30);
      else if (hour < 15) pts.push(140 + Math.random() * 25);
      else if (hour < 18) pts.push(130 + Math.random() * 30);
      else if (hour < 21) pts.push(90 + Math.random() * 20);
      else pts.push(40 + Math.random() * 15);
    }
    return pts;
  }, []);

  const maxSpark = Math.max(...sparkline, 1);
  const sparkPts = sparkline.map((v, i) => `${(i / 19) * 100},${100 - (v / maxSpark) * 80 - 10}`).join(' ');

  const statusColor: Record<string, string> = { active: X.teal, idle: X.textMut };

  return (
    <Card style={{ width: 400 }} glow={X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}><Dot c={X.teal} pulse s={4} />Live</Badge>
      </div>

      {/* Hero numbers */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 10 }}>
        <div>
          <Lbl style={{ marginBottom: 3 }}>Total Today</Lbl>
          <M style={{ fontSize: 24, fontWeight: 800, color: X.text }}>{Math.round(animTotal).toLocaleString()}</M>
        </div>
        <div>
          <Lbl style={{ marginBottom: 3 }}>Current Rate</Lbl>
          <M style={{ fontSize: 18, fontWeight: 700, color: X.teal }}>{Math.round(currentRate)}<span style={{ fontSize: 9, color: X.textMut }}> {rateUnit}</span></M>
        </div>
      </div>

      {/* Sparkline */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 32, overflow: 'hidden', marginBottom: 8 }}>
        <defs>
          <linearGradient id="bag-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={X.teal} stopOpacity=".2" />
            <stop offset="100%" stopColor={X.teal} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,100 ${sparkPts} 100,100`} fill="url(#bag-g)" />
        <polyline points={sparkPts} fill="none" stroke={X.teal} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>

      {/* Carousels */}
      <Lbl style={{ marginBottom: 5 }}>Carousels</Lbl>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
        {carousels.map((c, i) => {
          const bags = Math.max(0, Math.round(carouselBags[i]));
          return (
            <div key={i} style={{
              padding: '6px 4px', borderRadius: X.rs, background: X.bgAlt,
              border: `1px solid ${X.borderLight}`, textAlign: 'center',
              animation: `fu 150ms ${ease.o} ${i * 25}ms both`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, marginBottom: 3 }}>
                <Dot c={statusColor[c.status]} pulse={c.status === 'active'} s={5} />
                <M style={{ fontSize: 10, fontWeight: 700, color: X.text }}>{c.id}</M>
              </div>
              <M style={{ fontSize: 14, fontWeight: 800, color: c.status === 'active' ? X.teal : X.textMut, display: 'block', marginBottom: 2 }}>{bags}</M>
              <M style={{ fontSize: 7, color: X.textMut }}>{c.flight}</M>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Fuel Farm ──────────────────────────────────────────────────────
export function FuelFarm({ title = 'Fuel Farm', lowLevelThreshold = 30 }: {
  title?: string; lowLevelThreshold?: number;
}) {
  const X = getX();

  const tanks = useMemo(() => [
    { name: 'TK-01', fuel: 'Jet-A1', capacity: 50000, baseTemp: 14 },
    { name: 'TK-02', fuel: 'Jet-A1', capacity: 50000, baseTemp: 15 },
    { name: 'TK-03', fuel: 'Jet-A1', capacity: 75000, baseTemp: 13 },
    { name: 'TK-04', fuel: 'Jet-A1', capacity: 75000, baseTemp: 16 },
  ], []);

  const levels = [
    useLive(82, 3, 4000),
    useLive(54, 5, 3500),
    useLive(91, 2, 4500),
    useLive(38, 4, 3000),
  ];
  const temps = [
    useLive(tanks[0].baseTemp, 1, 5000),
    useLive(tanks[1].baseTemp, 1.2, 4800),
    useLive(tanks[2].baseTemp, 0.8, 5200),
    useLive(tanks[3].baseTemp, 1.5, 4500),
  ];

  const totalVolume = tanks.reduce((a, t, i) => a + (levels[i] / 100) * t.capacity, 0);
  const animVolume = useAnim(totalVolume / 1000, 1000);
  const dailyConsumption = useLive(42.5, 5, 6000);

  const levelColor = (pct: number) => pct > 60 ? X.teal : pct > lowLevelThreshold ? X.amber : X.red;

  return (
    <Card style={{ width: 370 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>{tanks.length} Tanks</Badge>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {tanks.map((t, i) => {
          const pct = Math.max(0, Math.min(100, levels[i]));
          const c = levelColor(pct);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, animation: `fu 200ms ${ease.o} ${i * 40}ms both` }}>
              <M style={{ fontSize: 8, fontWeight: 700, color: X.text }}>{t.name}</M>
              <div style={{
                width: '100%', height: 70, borderRadius: 4,
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
                  <M style={{ fontSize: 13, fontWeight: 800, color: c, textShadow: `0 0 4px ${X.bg}` }}>{Math.round(pct)}%</M>
                </div>
              </div>
              <M style={{ fontSize: 7, color: X.textMut }}>{t.fuel}</M>
              <M style={{ fontSize: 8, fontWeight: 600, color: temps[i] > 20 ? X.amber : X.textSec }}>{temps[i].toFixed(1)}&deg;C</M>
              <M style={{ fontSize: 6, color: X.textMut }}>{(t.capacity / 1000).toFixed(0)}kL</M>
            </div>
          );
        })}
      </div>

      <div style={{ borderTop: `1px solid ${X.borderLight}`, paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Total Volume</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: X.text }}>{animVolume.toFixed(0)}<span style={{ fontSize: 9, color: X.textMut }}> kL</span></M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>Daily Consumption</Lbl>
          <M style={{ fontSize: 14, fontWeight: 700, color: X.amber }}>{dailyConsumption.toFixed(1)}<span style={{ fontSize: 9, color: X.textMut }}> kL/day</span></M>
        </div>
      </div>
    </Card>
  );
}

// ── Aircraft Maintenance ───────────────────────────────────────────
export function AircraftMaintenance({ title = 'Maintenance Schedule', maxAircraft = 5 }: {
  title?: string; maxAircraft?: number;
}) {
  const X = getX();

  const aircraft = useMemo(() => [
    { tail: 'N841UA', type: 'B737-800', check: 'A-check', status: 'in-progress' as const, bay: 'H1', eta: '18:30' },
    { tail: 'N329DL', type: 'A320neo', check: 'Line', status: 'complete' as const, bay: 'H3', eta: '—' },
    { tail: 'N912AA', type: 'B787-9', check: 'B-check', status: 'in-progress' as const, bay: 'H2', eta: '06:00+1' },
    { tail: 'N517SW', type: 'B737MAX', check: 'A-check', status: 'scheduled' as const, bay: 'H4', eta: '22:00' },
    { tail: 'N684B6', type: 'A321XLR', check: 'Line', status: 'in-progress' as const, bay: 'H5', eta: '16:45' },
  ], []);

  const visibleAircraft = aircraft.slice(0, maxAircraft);
  const statusColor: Record<string, string> = { 'in-progress': X.amber, scheduled: X.indigo, complete: X.teal };
  const statusLabel: Record<string, string> = { 'in-progress': 'In Progress', scheduled: 'Scheduled', complete: 'Complete' };
  const inProgress = visibleAircraft.filter(a => a.status === 'in-progress').length;

  return (
    <Card noPad style={{ width: 420 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.amber}>{inProgress} Active</Badge>
      </div>
      <div style={{ padding: '0 6px 8px' }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '60px 62px 54px 72px 30px 48px', gap: 4, padding: '4px 8px', borderBottom: `1px solid ${X.borderLight}` }}>
          {['Tail #', 'Type', 'Check', 'Status', 'Bay', 'ETC'].map(h => <Lbl key={h}>{h}</Lbl>)}
        </div>
        {visibleAircraft.map((a, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '60px 62px 54px 72px 30px 48px', gap: 4,
            padding: '6px 8px', borderRadius: 3, alignItems: 'center',
            background: i % 2 === 0 ? X.bgAlt : 'transparent',
            animation: `sr 120ms ${ease.o} ${i * 15}ms both`,
          }}>
            <M style={{ fontSize: 10, fontWeight: 700, color: X.text }}>{a.tail}</M>
            <M style={{ fontSize: 9, color: X.textSec }}>{a.type}</M>
            <M style={{ fontSize: 9, fontWeight: 600, color: a.check === 'B-check' ? X.purple : a.check === 'A-check' ? X.indigo : X.textSec }}>{a.check}</M>
            <Badge color={statusColor[a.status]}>{statusLabel[a.status]}</Badge>
            <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{a.bay}</M>
            <M style={{ fontSize: 9, color: X.textMut }}>{a.eta}</M>
          </div>
        ))}
      </div>
      <div style={{ padding: '6px 14px 10px', borderTop: `1px solid ${X.borderLight}`, display: 'flex', justifyContent: 'space-between' }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Hangars H1-H5</M>
        <M style={{ fontSize: 8, color: X.textMut }}>{visibleAircraft.length} aircraft scheduled</M>
      </div>
    </Card>
  );
}

// ── Gate Assignment ────────────────────────────────────────────────
export function GateAssignment({ title = 'Gate Assignment', columns = 4 }: {
  title?: string; columns?: number;
}) {
  const X = getX();

  const gates = useMemo(() => [
    { gate: 'A1', flight: 'UA 1842', status: 'occupied' as const },
    { gate: 'A2', flight: '—', status: 'available' as const },
    { gate: 'A3', flight: 'DL 402', status: 'occupied' as const },
    { gate: 'A4', flight: '—', status: 'closed' as const },
    { gate: 'B1', flight: 'AA 1187', status: 'occupied' as const },
    { gate: 'B2', flight: 'SW 3291', status: 'occupied' as const },
    { gate: 'B3', flight: '—', status: 'available' as const },
    { gate: 'B4', flight: 'B6 724', status: 'occupied' as const },
    { gate: 'C1', flight: '—', status: 'available' as const },
    { gate: 'C2', flight: 'UA 559', status: 'occupied' as const },
    { gate: 'C3', flight: '—', status: 'available' as const },
    { gate: 'C4', flight: 'DL 890', status: 'occupied' as const },
  ], []);

  const statusColor: Record<string, string> = { occupied: X.indigo, available: X.teal, closed: X.red };
  const occupiedCount = gates.filter(g => g.status === 'occupied').length;

  return (
    <Card style={{ width: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={occupiedCount > 9 ? X.amber : X.teal}>{occupiedCount}/{gates.length} Occupied</Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 6 }}>
        {gates.map((g, i) => (
          <div key={i} style={{
            padding: '8px 6px', borderRadius: X.rs, textAlign: 'center',
            background: statusColor[g.status] + '10',
            border: `1px solid ${statusColor[g.status]}25`,
            animation: `fu 150ms ${ease.o} ${i * 20}ms both`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
              <Dot c={statusColor[g.status]} pulse={g.status === 'occupied'} s={5} />
              <M style={{ fontSize: 11, fontWeight: 800, color: X.text }}>{g.gate}</M>
            </div>
            <M style={{ fontSize: 8, fontWeight: 600, color: g.status === 'occupied' ? X.indigo : X.textMut, display: 'block', marginBottom: 2 }}>{g.flight}</M>
            <M style={{ fontSize: 7, color: statusColor[g.status], textTransform: 'capitalize' as const }}>{g.status}</M>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 10 }}>
        {(['occupied', 'available', 'closed'] as const).map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Dot c={statusColor[s]} s={4} />
            <M style={{ fontSize: 7, color: X.textMut, textTransform: 'capitalize' }}>{s}</M>
            <M style={{ fontSize: 7, fontWeight: 700, color: statusColor[s] }}>{gates.filter(g => g.status === s).length}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}
