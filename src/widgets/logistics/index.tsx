import { useState, useMemo } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot, Prog } from '../primitives';
import { useAnim, useLive, useTick } from '../hooks';

// ── Fleet GPS ────────────────────────────────────────────────────────
export function FleetGPS({ title = 'Fleet GPS', speedUnit = 'mph' }: {
  title?: string; speedUnit?: 'mph' | 'km/h';
} = {}) {
  const X = getX();
  const tick = useTick(2000);
  const vehicles = useMemo(() => [
    { id: 'TRK-4801', loc: 'I-95 N, Baltimore MD', spd: 62, hdg: 'NNE', status: 'moving' },
    { id: 'TRK-4802', loc: 'US-1, Newark NJ', spd: 0, hdg: 'E', status: 'stopped' },
    { id: 'TRK-4803', loc: 'I-76 W, King of Prussia PA', spd: 58, hdg: 'W', status: 'moving' },
    { id: 'VAN-1120', loc: 'Depot A — Bay 3', spd: 0, hdg: '—', status: 'idle' },
    { id: 'TRK-4805', loc: 'I-278 E, Brooklyn NY', spd: 34, hdg: 'ESE', status: 'moving' },
    { id: 'VAN-1122', loc: 'SR-30 W, Lancaster PA', spd: 45, hdg: 'WSW', status: 'moving' },
  ], []);

  const sc: Record<string, string> = { moving: X.teal, idle: X.amber, stopped: X.red };

  const speeds = [
    useLive(vehicles[0].spd, 5, 2500),
    useLive(vehicles[1].spd, 0, 2500),
    useLive(vehicles[2].spd, 4, 2500),
    useLive(vehicles[3].spd, 0, 2500),
    useLive(vehicles[4].spd, 6, 2500),
    useLive(vehicles[5].spd, 4, 2500),
  ];

  const moving = vehicles.filter(v => v.status === 'moving').length;

  return (
    <Card noPad style={{ width: 470 }} glow={X.teal}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{moving}/{vehicles.length} Moving</Badge>
      </div>
      <div style={{ padding: '0 6px 6px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr 50px 36px 56px', gap: 4, padding: '4px 8px', borderBottom: `1px solid ${X.borderLight}` }}>
          {['Vehicle', 'Location', 'Speed', 'Hdg', 'Status'].map(h => <Lbl key={h}>{h}</Lbl>)}
        </div>
        {vehicles.map((v, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '70px 1fr 50px 36px 56px', gap: 4, padding: '5px 8px', borderRadius: 3, background: i % 2 === 0 ? X.bgAlt : 'transparent', alignItems: 'center', animation: `sr 120ms ${ease.o} ${i * 15}ms both` }}>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.purple }}>{v.id}</M>
            <M style={{ fontSize: 8, color: X.textSec, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.loc}</M>
            <M style={{ fontSize: 9, fontWeight: 600, color: v.status === 'moving' ? X.text : X.textMut }}>{Math.max(0, Math.round(speedUnit === 'km/h' ? speeds[i] * 1.609 : speeds[i]))} {speedUnit}</M>
            <M style={{ fontSize: 8, color: X.textMut }}>{v.hdg}</M>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Dot c={sc[v.status]} pulse={v.status === 'moving'} s={5} />
              <M style={{ fontSize: 8, color: sc[v.status] }}>{v.status}</M>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Route Optimizer ──────────────────────────────────────────────────
export function RouteOptimizer({ title = 'Route Optimizer', efficiencyThreshold = 85 }: {
  title?: string; efficiencyThreshold?: number;
} = {}) {
  const X = getX();
  const routes = useMemo(() => [
    { origin: 'Newark NJ', dest: 'Baltimore MD', dist: 172, eta: '2h 48m', fuel: 28.40, eff: 91 },
    { origin: 'Philadelphia PA', dest: 'Boston MA', dist: 308, eta: '5h 12m', fuel: 51.20, eff: 78 },
    { origin: 'Harrisburg PA', dest: 'Pittsburgh PA', dist: 197, eta: '3h 05m', fuel: 32.80, eff: 85 },
    { origin: 'Baltimore MD', dest: 'Richmond VA', dist: 110, eta: '1h 52m', fuel: 18.60, eff: 94 },
  ], []);

  const effAnims = [
    useAnim(routes[0].eff, 1400),
    useAnim(routes[1].eff, 1400),
    useAnim(routes[2].eff, 1400),
    useAnim(routes[3].eff, 1400),
  ];

  const effColor = (v: number) => v >= efficiencyThreshold + 5 ? X.teal : v >= efficiencyThreshold ? X.amber : X.pink;

  return (
    <Card style={{ width: 440 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>4 Active</Badge>
      </div>
      {routes.map((r, i) => (
        <div key={i} style={{ padding: '8px 0', borderBottom: i < routes.length - 1 ? `1px solid ${X.borderLight}` : 'none', animation: `fu 150ms ${ease.o} ${i * 20}ms both` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{r.origin} → {r.dest}</M>
            <M style={{ fontSize: 9, fontWeight: 700, color: effColor(r.eff) }}>{Math.round(effAnims[i])}%</M>
          </div>
          <div style={{ display: 'flex', gap: 12, marginBottom: 4 }}>
            <div><Lbl style={{ marginBottom: 1 }}>Dist</Lbl><M style={{ fontSize: 9, fontWeight: 600, color: X.textSec }}>{r.dist} mi</M></div>
            <div><Lbl style={{ marginBottom: 1 }}>ETA</Lbl><M style={{ fontSize: 9, fontWeight: 600, color: X.purple }}>{r.eta}</M></div>
            <div><Lbl style={{ marginBottom: 1 }}>Fuel</Lbl><M style={{ fontSize: 9, fontWeight: 600, color: X.amber }}>${r.fuel.toFixed(2)}</M></div>
          </div>
          <Prog value={r.eff} color={effColor(r.eff)} h={2} />
        </div>
      ))}
    </Card>
  );
}

// ── Warehouse Map ────────────────────────────────────────────────────
export function WarehouseMap({ title = 'Warehouse Zones', capacityWarning = 70 }: {
  title?: string; capacityWarning?: number;
} = {}) {
  const X = getX();
  const zones = useMemo(() => [
    { name: 'Receiving', items: 142, cap: 68, activity: 'high' },
    { name: 'Staging', items: 87, cap: 54, activity: 'medium' },
    { name: 'Storage A', items: 1240, cap: 82, activity: 'low' },
    { name: 'Storage B', items: 980, cap: 65, activity: 'low' },
    { name: 'Storage C', items: 410, cap: 34, activity: 'medium' },
    { name: 'Shipping', items: 63, cap: 45, activity: 'high' },
  ], []);

  const capAnims = [
    useAnim(zones[0].cap, 1200),
    useAnim(zones[1].cap, 1200),
    useAnim(zones[2].cap, 1200),
    useAnim(zones[3].cap, 1200),
    useAnim(zones[4].cap, 1200),
    useAnim(zones[5].cap, 1200),
  ];

  const actColor: Record<string, string> = { high: X.teal, medium: X.amber, low: X.textMut };
  const capColor = (v: number) => v >= capacityWarning + 10 ? X.red : v >= capacityWarning ? X.amber : X.teal;

  return (
    <Card noPad style={{ width: 420 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}>{zones.reduce((a, z) => a + z.items, 0).toLocaleString()} Items</Badge>
      </div>
      <div style={{ padding: '0 6px 8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '72px 56px 1fr 44px', gap: 4, padding: '4px 8px', borderBottom: `1px solid ${X.borderLight}` }}>
          {['Zone', 'Items', 'Capacity', 'Activity'].map(h => <Lbl key={h}>{h}</Lbl>)}
        </div>
        {zones.map((z, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '72px 56px 1fr 44px', gap: 4, padding: '6px 8px', borderRadius: 3, background: i % 2 === 0 ? X.bgAlt : 'transparent', alignItems: 'center', animation: `sr 120ms ${ease.o} ${i * 15}ms both` }}>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.text }}>{z.name}</M>
            <M style={{ fontSize: 9, color: X.textSec }}>{z.items.toLocaleString()}</M>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Prog value={capAnims[i]} color={capColor(z.cap)} h={3} style={{ flex: 1 }} />
              <M style={{ fontSize: 8, fontWeight: 600, color: capColor(z.cap), minWidth: 24, textAlign: 'right' }}>{z.cap}%</M>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Dot c={actColor[z.activity]} pulse={z.activity === 'high'} s={5} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Delivery Tracker ─────────────────────────────────────────────────
export function DeliveryTracker({ title = 'Delivery Tracker', statusFilter = 'all' }: {
  title?: string; statusFilter?: 'all' | 'in-transit' | 'delayed';
} = {}) {
  const X = getX();
  const parcels = useMemo(() => [
    { id: 'PKG-90241', dest: 'Chicago IL', status: 'in-transit', progress: 72, eta: '14:30' },
    { id: 'PKG-90242', dest: 'Detroit MI', status: 'delivered', progress: 100, eta: '—' },
    { id: 'PKG-90243', dest: 'Columbus OH', status: 'delayed', progress: 38, eta: '18:15' },
    { id: 'PKG-90244', dest: 'Indianapolis IN', status: 'in-transit', progress: 55, eta: '16:05' },
    { id: 'PKG-90245', dest: 'Milwaukee WI', status: 'pending', progress: 0, eta: '09:00 +1' },
    { id: 'PKG-90246', dest: 'Cleveland OH', status: 'in-transit', progress: 89, eta: '13:10' },
  ], []);

  const sc: Record<string, string> = { 'in-transit': X.indigo, delivered: X.teal, delayed: X.red, pending: X.textMut };
  const filtered = statusFilter === 'all' ? parcels : parcels.filter(p => p.status === statusFilter);

  const progAnims = [
    useAnim(parcels[0].progress, 1400),
    useAnim(parcels[1].progress, 1400),
    useAnim(parcels[2].progress, 1400),
    useAnim(parcels[3].progress, 1400),
    useAnim(parcels[4].progress, 1400),
    useAnim(parcels[5].progress, 1400),
  ];

  return (
    <Card noPad style={{ width: 460 }} glow={X.indigo}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>{parcels.filter(p => p.status === 'in-transit').length} In Transit</Badge>
      </div>
      <div style={{ padding: '0 6px 6px' }}>
        {filtered.map((p, fi) => {
          const oi = parcels.indexOf(p);
          return (
          <div key={fi} style={{ padding: '7px 8px', borderRadius: 3, background: fi % 2 === 0 ? X.bgAlt : 'transparent', animation: `sr 120ms ${ease.o} ${fi * 15}ms both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <M style={{ fontSize: 9, fontWeight: 600, color: X.purple }}>{p.id}</M>
                <M style={{ fontSize: 8, color: X.textSec }}>{p.dest}</M>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {p.eta !== '—' && <M style={{ fontSize: 8, color: X.textMut }}>ETA {p.eta}</M>}
                <Badge color={sc[p.status]}>{p.status}</Badge>
              </div>
            </div>
            <Prog value={progAnims[oi]} color={sc[p.status]} h={2} />
          </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Dock Schedule ────────────────────────────────────────────────────
export function DockSchedule({ title = 'Dock Schedule', dockCount = 6 }: {
  title?: string; dockCount?: number;
} = {}) {
  const X = getX();
  const docks = useMemo(() => [
    { dock: 'Dock 1', carrier: 'FedEx Freight', time: '08:00–09:30', status: 'loading', truck: 'FX-4410' },
    { dock: 'Dock 2', carrier: 'XPO Logistics', time: '08:30–10:00', status: 'unloading', truck: 'XP-8822' },
    { dock: 'Dock 3', carrier: '—', time: '10:00–11:30', status: 'available', truck: '—' },
    { dock: 'Dock 4', carrier: 'UPS Freight', time: '07:45–09:15', status: 'delayed', truck: 'UP-3301' },
    { dock: 'Dock 5', carrier: 'Old Dominion', time: '09:00–10:30', status: 'loading', truck: 'OD-7756' },
    { dock: 'Dock 6', carrier: 'Estes Express', time: '09:15–11:00', status: 'unloading', truck: 'ES-2209' },
  ], []);

  const sc: Record<string, string> = { loading: X.indigo, unloading: X.amber, available: X.teal, delayed: X.red };
  const visibleDocks = docks.slice(0, dockCount);

  return (
    <Card noPad style={{ width: 500 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.amber}>{visibleDocks.filter(d => d.status === 'delayed').length} Delayed</Badge>
      </div>
      <div style={{ padding: '0 6px 6px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr 90px 68px 60px', gap: 4, padding: '4px 8px', borderBottom: `1px solid ${X.borderLight}` }}>
          {['Dock', 'Carrier', 'Scheduled', 'Status', 'Truck'].map(h => <Lbl key={h}>{h}</Lbl>)}
        </div>
        {visibleDocks.map((d, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '52px 1fr 90px 68px 60px', gap: 4, padding: '5px 8px', borderRadius: 3, background: i % 2 === 0 ? X.bgAlt : 'transparent', alignItems: 'center', animation: `sr 120ms ${ease.o} ${i * 15}ms both` }}>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.text }}>{d.dock}</M>
            <M style={{ fontSize: 9, color: d.carrier === '—' ? X.textMut : X.textSec, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.carrier}</M>
            <M style={{ fontSize: 8, color: X.textMut }}>{d.time}</M>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Dot c={sc[d.status]} pulse={d.status === 'loading' || d.status === 'unloading'} s={5} />
              <M style={{ fontSize: 8, color: sc[d.status] }}>{d.status}</M>
            </div>
            <M style={{ fontSize: 9, fontWeight: 600, color: d.truck === '—' ? X.textMut : X.purple }}>{d.truck}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Fuel Monitor ─────────────────────────────────────────────────────
export function FuelMonitor({ title = 'Fuel Monitor', lowThreshold = 25 }: {
  title?: string; lowThreshold?: number;
} = {}) {
  const X = getX();
  const vehicles = useMemo(() => [
    { id: 'TRK-4801', tank: 74, mpg: 6.8, dte: 312, cpm: 0.52 },
    { id: 'TRK-4803', tank: 41, mpg: 5.9, dte: 168, cpm: 0.61 },
    { id: 'VAN-1120', tank: 92, mpg: 14.2, dte: 486, cpm: 0.24 },
    { id: 'TRK-4805', tank: 18, mpg: 6.1, dte: 72, cpm: 0.58 },
  ], []);

  const tankAnims = [
    useAnim(vehicles[0].tank, 1200),
    useAnim(vehicles[1].tank, 1200),
    useAnim(vehicles[2].tank, 1200),
    useAnim(vehicles[3].tank, 1200),
  ];

  const mpgLive = [
    useLive(vehicles[0].mpg, 0.4, 3000),
    useLive(vehicles[1].mpg, 0.3, 3000),
    useLive(vehicles[2].mpg, 0.6, 3000),
    useLive(vehicles[3].mpg, 0.3, 3000),
  ];

  const tankColor = (v: number) => v >= 60 ? X.teal : v >= 30 ? X.amber : X.red;

  return (
    <Card style={{ width: 380 }} glow={X.amber}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.red}>{vehicles.filter(v => v.tank < lowThreshold).length} Low</Badge>
      </div>
      {vehicles.map((v, i) => (
        <div key={i} style={{ padding: '8px 0', borderBottom: i < vehicles.length - 1 ? `1px solid ${X.borderLight}` : 'none', animation: `fu 150ms ${ease.o} ${i * 20}ms both` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <M style={{ fontSize: 10, fontWeight: 600, color: X.purple }}>{v.id}</M>
            <M style={{ fontSize: 10, fontWeight: 700, color: tankColor(v.tank) }}>{Math.round(tankAnims[i])}%</M>
          </div>
          <Prog value={tankAnims[i]} color={tankColor(v.tank)} h={3} style={{ marginBottom: 5 }} />
          <div style={{ display: 'flex', gap: 12 }}>
            <div><Lbl style={{ marginBottom: 1 }}>Efficiency</Lbl><M style={{ fontSize: 9, fontWeight: 600, color: X.teal }}>{mpgLive[i].toFixed(1)} mpg</M></div>
            <div><Lbl style={{ marginBottom: 1 }}>DTE</Lbl><M style={{ fontSize: 9, fontWeight: 600, color: v.dte < 100 ? X.red : X.textSec }}>{v.dte} mi</M></div>
            <div><Lbl style={{ marginBottom: 1 }}>Cost/Mi</Lbl><M style={{ fontSize: 9, fontWeight: 600, color: X.amber }}>${v.cpm.toFixed(2)}</M></div>
          </div>
        </div>
      ))}
    </Card>
  );
}
