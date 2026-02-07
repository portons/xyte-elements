import { useState, useMemo } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot, Prog } from '../primitives';
import { useAnim, useLive, useTick } from '../hooks';

// ── Room Status ─────────────────────────────────────────────────────
export function RoomStatus({ title = 'Room Status', floorFilter = 'all' }: {
  title?: string; floorFilter?: string;
}) {
  const X = getX();
  const rooms = useMemo(() => [
    { num: '101', status: 'occupied', guest: 'Chen', checkout: '11:00' },
    { num: '102', status: 'vacant', guest: '', checkout: '' },
    { num: '103', status: 'cleaning', guest: '', checkout: '' },
    { num: '104', status: 'occupied', guest: 'Müller', checkout: '12:00' },
    { num: '105', status: 'maintenance', guest: '', checkout: '' },
    { num: '106', status: 'occupied', guest: 'Tanaka', checkout: '10:00' },
    { num: '201', status: 'vacant', guest: '', checkout: '' },
    { num: '202', status: 'occupied', guest: 'Smith', checkout: '14:00' },
    { num: '203', status: 'occupied', guest: 'Rossi', checkout: '11:00' },
    { num: '204', status: 'cleaning', guest: '', checkout: '' },
    { num: '205', status: 'vacant', guest: '', checkout: '' },
    { num: '206', status: 'occupied', guest: 'Park', checkout: '13:00' },
  ], []);
  const statusColor: Record<string, string> = { occupied: X.teal, vacant: X.purple, cleaning: X.amber, maintenance: X.red };
  const statusLabel: Record<string, string> = { occupied: 'OCC', vacant: 'VAC', cleaning: 'CLN', maintenance: 'MNT' };
  const occupied = rooms.filter(r => r.status === 'occupied').length;
  const total = rooms.length;

  return (
    <Card noPad style={{ width: 440 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <Badge color={X.teal}>{occupied}/{total} Occ</Badge>
        </div>
      </div>
      <div style={{ padding: '2px 6px 8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
          {rooms.map((r, i) => (
            <div key={i} style={{
              padding: '6px 5px', borderRadius: X.rs, textAlign: 'center',
              background: statusColor[r.status] + '0a',
              border: `1px solid ${statusColor[r.status]}20`,
              animation: `fu 150ms ${ease.o} ${i * 20}ms both`,
            }}>
              <M style={{ fontSize: 11, fontWeight: 700, color: X.text, display: 'block', marginBottom: 3 }}>{r.num}</M>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, marginBottom: 2 }}>
                <Dot c={statusColor[r.status]} pulse={r.status === 'occupied'} s={4} />
                <M style={{ fontSize: 7, fontWeight: 600, color: statusColor[r.status] }}>{statusLabel[r.status]}</M>
              </div>
              {r.guest && <M style={{ fontSize: 7, color: X.textMut, display: 'block' }}>{r.guest}</M>}
              {r.checkout && <M style={{ fontSize: 7, color: X.textSec, display: 'block' }}>C/O {r.checkout}</M>}
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '0 14px 8px', display: 'flex', justifyContent: 'space-between' }}>
        {(['occupied', 'vacant', 'cleaning', 'maintenance'] as const).map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Dot c={statusColor[s]} s={4} />
            <M style={{ fontSize: 7, color: X.textMut, textTransform: 'capitalize' }}>{s}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Minibar Tracker ─────────────────────────────────────────────────
export function MinibarTracker({ title = 'Minibar Inventory', currency = '$' }: {
  title?: string; currency?: string;
}) {
  const X = getX();
  const items = useMemo(() => [
    { name: 'Still Water', stock: 18, max: 24, consumed: 42, revenue: 126, alert: false },
    { name: 'Sparkling', stock: 6, max: 24, consumed: 58, revenue: 174, alert: true },
    { name: 'Craft Beer', stock: 3, max: 12, consumed: 31, revenue: 248, alert: true },
    { name: 'Red Wine', stock: 8, max: 12, consumed: 14, revenue: 350, alert: false },
    { name: 'Chocolate', stock: 10, max: 18, consumed: 27, revenue: 135, alert: false },
    { name: 'Mixed Nuts', stock: 2, max: 18, consumed: 44, revenue: 220, alert: true },
  ], []);
  const totalRevenue = useAnim(items.reduce((a, it) => a + it.revenue, 0), 1000);

  return (
    <Card noPad style={{ width: 400 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <M style={{ fontSize: 12, fontWeight: 800, color: X.teal }}>{currency}{Math.round(totalRevenue)}</M>
      </div>
      <div style={{ padding: '0 6px 8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 70px 50px 50px', gap: 4, padding: '4px 8px', borderBottom: `1px solid ${X.borderLight}` }}>
          {['Item', 'Stock', 'Sold', 'Rev'].map(h => <Lbl key={h}>{h}</Lbl>)}
        </div>
        {items.map((it, i) => {
          const pct = (it.stock / it.max) * 100;
          const c = pct < 25 ? X.red : pct < 50 ? X.amber : X.teal;
          return (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '1fr 70px 50px 50px', gap: 4, padding: '5px 8px',
              alignItems: 'center', borderRadius: 3, background: i % 2 === 0 ? X.bgAlt : 'transparent',
              animation: `sr 120ms ${ease.o} ${i * 15}ms both`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <M style={{ fontSize: 9, fontWeight: 600, color: X.text }}>{it.name}</M>
                {it.alert && <Badge color={X.red} style={{ padding: '1px 4px', fontSize: 7 }}>Low</Badge>}
              </div>
              <div>
                <Prog value={pct} color={c} h={3} style={{ marginBottom: 1 }} />
                <M style={{ fontSize: 7, color: X.textMut }}>{it.stock}/{it.max}</M>
              </div>
              <M style={{ fontSize: 9, fontWeight: 600, color: X.purple }}>{it.consumed}</M>
              <M style={{ fontSize: 9, fontWeight: 600, color: X.teal }}>{currency}{it.revenue}</M>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Guest Services ──────────────────────────────────────────────────
export function GuestServices({ title = 'Guest Services', priorityFilter = 'all' }: {
  title?: string; priorityFilter?: string;
}) {
  const X = getX();
  const tick = useTick(8000);
  const requests = useMemo(() => [
    { type: 'Room Service', room: '206', time: '2m ago', priority: 'high', status: 'pending' },
    { type: 'Extra Towels', room: '104', time: '8m ago', priority: 'normal', status: 'in-progress' },
    { type: 'Concierge', room: '202', time: '12m ago', priority: 'vip', status: 'pending' },
    { type: 'Housekeeping', room: '101', time: '18m ago', priority: 'normal', status: 'done' },
    { type: 'Room Service', room: '203', time: '25m ago', priority: 'high', status: 'in-progress' },
    { type: 'Wake-Up Call', room: '106', time: '30m ago', priority: 'normal', status: 'done' },
  ], []);
  const prioColor: Record<string, string> = { vip: X.pink, high: X.red, normal: X.purple };
  const statColor: Record<string, string> = { pending: X.amber, 'in-progress': X.indigo, done: X.teal };
  const statLabel: Record<string, string> = { pending: 'Pending', 'in-progress': 'Active', done: 'Done' };
  const pending = requests.filter(r => r.status === 'pending').length;

  return (
    <Card noPad style={{ width: 420 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={pending > 0 ? X.amber : X.teal}>{pending} Pending</Badge>
      </div>
      <div style={{ padding: '0 6px 8px' }}>
        {requests.map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 3,
            borderLeft: `2px solid ${statColor[r.status]}`,
            background: i % 2 === 0 ? X.bgAlt : 'transparent',
            opacity: r.status === 'done' ? 0.4 : 1,
            animation: `sr 150ms ${ease.o} ${i * 20}ms both`,
            transition: `opacity 200ms ${ease.mv}`,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{r.type}</M>
                {r.priority === 'vip' && <Badge color={X.pink} solid style={{ fontSize: 7, padding: '1px 5px' }}>VIP</Badge>}
                {r.priority === 'high' && <Badge color={X.red} style={{ fontSize: 7, padding: '1px 5px' }}>Urgent</Badge>}
              </div>
              <M style={{ fontSize: 8, color: X.textMut }}>Room {r.room} · {r.time}</M>
            </div>
            <Badge color={statColor[r.status]}>{statLabel[r.status]}</Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Housekeeping Board ──────────────────────────────────────────────
export function HousekeepingBoard({ title = 'Housekeeping', targetMinutes = 30 }: {
  title?: string; targetMinutes?: number;
}) {
  const X = getX();
  const assignments = useMemo(() => [
    { room: '101', cleaner: 'MR', status: 'done', mins: 28 },
    { room: '102', cleaner: 'AL', status: 'inspected', mins: 32 },
    { room: '103', cleaner: 'MR', status: 'in-progress', mins: 15 },
    { room: '104', cleaner: 'JD', status: 'pending', mins: 0 },
    { room: '201', cleaner: 'AL', status: 'done', mins: 25 },
    { room: '204', cleaner: 'JD', status: 'in-progress', mins: 22 },
    { room: '205', cleaner: 'KS', status: 'pending', mins: 0 },
    { room: '206', cleaner: 'KS', status: 'pending', mins: 0 },
  ], []);
  const statusColor: Record<string, string> = { pending: X.textMut, 'in-progress': X.amber, done: X.teal, inspected: X.indigo };
  const statusIcon: Record<string, string> = { pending: '○', 'in-progress': '◐', done: '●', inspected: '✓' };
  const doneCount = assignments.filter(a => a.status === 'done' || a.status === 'inspected').length;
  const total = assignments.length;
  const pct = (doneCount / total) * 100;

  return (
    <Card noPad style={{ width: 370 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>{doneCount}/{total}</M>
      </div>
      <div style={{ padding: '0 14px 6px' }}>
        <Prog value={pct} color={X.teal} h={3} />
      </div>
      <div style={{ padding: '0 6px 8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '50px 36px 1fr 46px', gap: 4, padding: '4px 8px', borderBottom: `1px solid ${X.borderLight}` }}>
          {['Room', 'Staff', 'Status', 'Time'].map(h => <Lbl key={h}>{h}</Lbl>)}
        </div>
        {assignments.map((a, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '50px 36px 1fr 46px', gap: 4, padding: '5px 8px',
            alignItems: 'center', borderRadius: 3, background: i % 2 === 0 ? X.bgAlt : 'transparent',
            animation: `sr 120ms ${ease.o} ${i * 15}ms both`,
          }}>
            <M style={{ fontSize: 10, fontWeight: 700, color: X.text }}>{a.room}</M>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: X.purple + '15', border: `1px solid ${X.purple}25`,
            }}>
              <M style={{ fontSize: 7, fontWeight: 700, color: X.purple }}>{a.cleaner}</M>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <M style={{ fontSize: 10, color: statusColor[a.status] }}>{statusIcon[a.status]}</M>
              <M style={{ fontSize: 9, fontWeight: 500, color: statusColor[a.status], textTransform: 'capitalize' }}>{a.status.replace('-', ' ')}</M>
            </div>
            <M style={{ fontSize: 9, color: a.mins > 0 ? X.textSec : X.textMut, textAlign: 'right' }}>{a.mins > 0 ? `${a.mins}m` : '--'}</M>
          </div>
        ))}
      </div>
      <div style={{ padding: '0 14px 8px', display: 'flex', justifyContent: 'space-between' }}>
        {(['pending', 'in-progress', 'done', 'inspected'] as const).map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Dot c={statusColor[s]} s={4} />
            <M style={{ fontSize: 7, color: X.textMut, textTransform: 'capitalize' }}>{s.replace('-', ' ')}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Check-In Kiosk ──────────────────────────────────────────────────
export function CheckInKiosk({ title = 'Check-In / Out', vipCount = 6 }: {
  title?: string; vipCount?: number;
}) {
  const X = getX();
  const arrivals = useAnim(34, 1200);
  const departures = useAnim(28, 1200);
  const queueLen = useLive(5, 2, 3000);
  const avgTime = useLive(4.2, 1, 4000);

  const metrics: { label: string; value: string; color: string; sub?: string }[] = useMemo(() => [
    { label: 'Arrivals Today', value: '34', color: X.teal, sub: '18 checked in' },
    { label: 'Departures Today', value: '28', color: X.purple, sub: '22 checked out' },
  ], [X.teal, X.purple]);

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.pink} solid>VIP {vipCount}</Badge>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        <div style={{ textAlign: 'center', padding: '8px 4px', borderRadius: X.rs, background: X.teal + '08', border: `1px solid ${X.teal}15` }}>
          <M style={{ fontSize: 24, fontWeight: 800, color: X.teal, display: 'block' }}>{Math.round(arrivals)}</M>
          <Lbl style={{ marginTop: 2 }}>Arrivals</Lbl>
          <M style={{ fontSize: 8, color: X.textMut, display: 'block', marginTop: 1 }}>18 checked in</M>
        </div>
        <div style={{ textAlign: 'center', padding: '8px 4px', borderRadius: X.rs, background: X.purple + '08', border: `1px solid ${X.purple}15` }}>
          <M style={{ fontSize: 24, fontWeight: 800, color: X.purple, display: 'block' }}>{Math.round(departures)}</M>
          <Lbl style={{ marginTop: 2 }}>Departures</Lbl>
          <M style={{ fontSize: 8, color: X.textMut, display: 'block', marginTop: 1 }}>22 checked out</M>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <div style={{ flex: 1, padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
          <Lbl style={{ marginBottom: 3 }}>Queue</Lbl>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <M style={{ fontSize: 16, fontWeight: 800, color: Math.round(queueLen) > 6 ? X.amber : X.text }}>{Math.max(0, Math.round(queueLen))}</M>
            <M style={{ fontSize: 8, color: X.textMut }}>guests</M>
          </div>
        </div>
        <div style={{ flex: 1, padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
          <Lbl style={{ marginBottom: 3 }}>Avg Time</Lbl>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
            <M style={{ fontSize: 16, fontWeight: 800, color: avgTime > 5 ? X.amber : X.teal }}>{avgTime.toFixed(1)}</M>
            <M style={{ fontSize: 8, color: X.textMut }}>min</M>
          </div>
        </div>
      </div>
      <Prog value={(Math.round(arrivals) / 34) * 100} color={X.teal} h={2} style={{ marginBottom: 2 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <M style={{ fontSize: 7, color: X.textMut }}>Check-in progress</M>
        <M style={{ fontSize: 7, color: X.teal }}>53%</M>
      </div>
    </Card>
  );
}

// ── Pool Sensors ────────────────────────────────────────────────────
export function PoolSensors({ title = 'Pool & Spa', targetTemp = 28 }: {
  title?: string; targetTemp?: number;
}) {
  const X = getX();
  const waterTemp = useLive(28.2, 0.8, 2000);
  const pH = useLive(7.3, 0.15, 3000);
  const chlorine = useLive(1.4, 0.3, 2500);
  const filterPressure = useLive(12, 2, 4000);

  const tempColor = waterTemp < 25 ? X.indigo : waterTemp > 31 ? X.red : X.teal;
  const phColor = pH < 7.0 ? X.amber : pH > 7.6 ? X.amber : X.teal;
  const clColor = chlorine < 1.0 ? X.red : chlorine > 2.0 ? X.amber : X.teal;
  const filterOk = filterPressure >= 8 && filterPressure <= 18;

  const readings: { label: string; value: string; unit: string; color: string; lo: number; hi: number; current: number }[] = [
    { label: 'Water Temp', value: waterTemp.toFixed(1), unit: '°C', color: tempColor, lo: 25, hi: 31, current: waterTemp },
    { label: 'pH Level', value: pH.toFixed(2), unit: 'pH', color: phColor, lo: 7.0, hi: 7.6, current: pH },
    { label: 'Chlorine', value: chlorine.toFixed(1), unit: 'ppm', color: clColor, lo: 1.0, hi: 2.0, current: chlorine },
    { label: 'Filter PSI', value: filterPressure.toFixed(0), unit: 'psi', color: filterOk ? X.teal : X.amber, lo: 8, hi: 18, current: filterPressure },
  ];

  return (
    <Card style={{ width: 350 }} glow={X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal} solid><Dot c="#fff" pulse s={4} /> Live</Badge>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <M style={{ fontSize: 32, fontWeight: 800, color: tempColor }}>{waterTemp.toFixed(1)}°</M>
      </div>
      {readings.map((r, i) => {
        const rangePct = Math.max(0, Math.min(100, ((r.current - r.lo) / (r.hi - r.lo)) * 100));
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0',
            borderBottom: i < readings.length - 1 ? `1px solid ${X.borderLight}` : 'none',
            animation: `fu 150ms ${ease.o} ${i * 20}ms both`,
          }}>
            <div style={{ width: 60 }}>
              <Lbl>{r.label}</Lbl>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ height: 4, borderRadius: 2, background: X.borderLight, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${rangePct}%`, borderRadius: 2, background: r.color, transition: `width 500ms ${ease.sp}` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 1 }}>
                <M style={{ fontSize: 6, color: X.textMut }}>{r.lo}</M>
                <M style={{ fontSize: 6, color: X.textMut }}>{r.hi}</M>
              </div>
            </div>
            <div style={{ textAlign: 'right', minWidth: 42 }}>
              <M style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{r.value}</M>
              <M style={{ fontSize: 7, color: X.textMut, display: 'block' }}>{r.unit}</M>
            </div>
          </div>
        );
      })}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Dot c={filterOk ? X.teal : X.amber} pulse={!filterOk} s={5} />
          <M style={{ fontSize: 8, color: X.textMut }}>Filter {filterOk ? 'Normal' : 'Check'}</M>
        </div>
        <Lbl>Updated live</Lbl>
      </div>
    </Card>
  );
}
