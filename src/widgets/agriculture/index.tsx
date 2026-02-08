import { useState, useMemo } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot, Prog } from '../primitives';

// ── Soil Moisture ────────────────────────────────────────────────────
export function SoilMoisture({ title = 'Soil Moisture', zoneCount = 4 }: { title?: string; zoneCount?: number }) {
  const X = getX();
  const zones = useMemo(() => [
    { name: 'Zone A — North Field', depth: '15 cm', moisture: 68, optimal: [55, 75] },
    { name: 'Zone B — East Beds', depth: '30 cm', moisture: 42, optimal: [50, 70] },
    { name: 'Zone C — Greenhouse 1', depth: '10 cm', moisture: 81, optimal: [60, 80] },
    { name: 'Zone D — Orchard Row', depth: '45 cm', moisture: 53, optimal: [45, 65] },
  ], []);

  const visibleZones = zones.slice(0, zoneCount);

  const liveZones = visibleZones.map((z, i) => {
    const m = z.moisture;
    return { ...z, live: Math.max(0, Math.min(100, Math.round(m))) };
  });

  const statusFor = (v: number, opt: number[]) =>
    v < opt[0] ? { label: 'Dry', color: X.amber } : v > opt[1] ? { label: 'Wet', color: X.indigo } : { label: 'Optimal', color: X.teal };

  return (
    <Card style={{ width: 380 }} glow={X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{liveZones.length} Zones</Badge>
      </div>
      {liveZones.map((z, i) => {
        const st = statusFor(z.live, z.optimal);
        return (
          <div key={i} style={{ marginBottom: i < liveZones.length - 1 ? 8 : 0, animation: `sr 150ms ${ease.o} ${i * 30}ms both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
              <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{z.name}</M>
              <Badge color={st.color}>{st.label}</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <div style={{ flex: 1 }}>
                <Prog value={z.live} color={st.color} h={4} />
              </div>
              <M style={{ fontSize: 11, fontWeight: 800, color: st.color, minWidth: 32, textAlign: 'right' }}>{z.live}%</M>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <M style={{ fontSize: 8, color: X.textMut }}>Depth: {z.depth}</M>
              <M style={{ fontSize: 8, color: X.textMut }}>Range: {z.optimal[0]}–{z.optimal[1]}%</M>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// ── Irrigation Control ───────────────────────────────────────────────
export function IrrigationControl({ title = 'Irrigation Control', volumeUnit = 'gal' }: { title?: string; volumeUnit?: string }) {
  const X = getX();
  const zones = useMemo(() => [
    { name: 'Drip — Tomatoes', on: true, schedule: '05:30', dur: 25, vol: 120, next: '17:30' },
    { name: 'Sprinkler — Corn', on: false, schedule: '06:00', dur: 40, vol: 340, next: '06:00' },
    { name: 'Drip — Peppers', on: true, schedule: '05:45', dur: 20, vol: 95, next: '17:45' },
    { name: 'Flood — Rice Pad', on: false, schedule: '04:00', dur: 120, vol: 1800, next: '04:00' },
    { name: 'Mist — Greenhouse', on: true, schedule: '07:00', dur: 10, vol: 30, next: '13:00' },
    { name: 'Drip — Orchard', on: false, schedule: '06:30', dur: 60, vol: 520, next: '06:30' },
  ], []);
  const [states, setStates] = useState(() => zones.map(z => z.on));
  const activeCount = states.filter(Boolean).length;

  return (
    <Card style={{ width: 420 }} glow={X.indigo}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>{activeCount} Active</Badge>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 42px 38px 50px 44px', gap: 4, padding: '4px 0', borderBottom: `1px solid ${X.borderLight}`, marginBottom: 2 }}>
        {['Zone', 'Time', 'Dur', 'Volume', 'Next'].map(h => <Lbl key={h}>{h}</Lbl>)}
      </div>
      {zones.map((z, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 42px 38px 50px 44px', gap: 4, padding: '5px 0', alignItems: 'center', borderBottom: i < zones.length - 1 ? `1px solid ${X.borderLight}` : 'none', animation: `sr 120ms ${ease.o} ${i * 20}ms both` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Dot c={states[i] ? X.teal : X.textMut} pulse={states[i]} s={6} />
            <M style={{ fontSize: 9, fontWeight: 600, color: X.text }}>{z.name}</M>
          </div>
          <M style={{ fontSize: 8, color: X.textSec }}>{z.schedule}</M>
          <M style={{ fontSize: 8, color: X.textMut }}>{z.dur}m</M>
          <M style={{ fontSize: 8, color: X.indigo, fontWeight: 600 }}>{z.vol}{volumeUnit}</M>
          <M style={{ fontSize: 8, color: X.textMut }}>{z.next}</M>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <Lbl>Total Daily Volume</Lbl>
        <M style={{ fontSize: 9, fontWeight: 700, color: X.indigo }}>{zones.reduce((s, z) => s + z.vol, 0).toLocaleString()} {volumeUnit}</M>
      </div>
    </Card>
  );
}

// ── Weather Station ──────────────────────────────────────────────────
export function WeatherStation({ title = 'Weather Station', tempUnit = 'C', temp, humidity, windSpeed, rainfall, uvIndex, pressure }: { title?: string; tempUnit?: string; temp: number; humidity: number; windSpeed: number; rainfall: number; uvIndex: number; pressure: number }) {
  const X = getX();

  const windDirs = useMemo(() => ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'], []);
  const windDir = useMemo(() => windDirs[Math.floor(Math.random() * windDirs.length)], []);
  const trend = pressure > 1013 ? '\u2197' : pressure < 1012 ? '\u2198' : '\u2192';
  const uvColor = uvIndex > 8 ? X.red : uvIndex > 5 ? X.amber : X.teal;

  return (
    <Card style={{ width: 350 }} glow={X.amber}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.amber} solid>Live</Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
        <M style={{ fontSize: 32, fontWeight: 800, color: X.text }}>{tempUnit === 'F' ? (temp * 9 / 5 + 32).toFixed(1) : temp.toFixed(1)}</M>
        <M style={{ fontSize: 13, color: X.textMut }}>\u00b0{tempUnit}</M>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Humidity</Lbl>
          <M style={{ fontSize: 11, fontWeight: 700, color: X.indigo }}>{Math.round(humidity)}%</M>
        </div>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Wind</Lbl>
          <M style={{ fontSize: 11, fontWeight: 700, color: X.teal }}>{windSpeed.toFixed(1)}<span style={{ fontSize: 8, color: X.textMut }}> km/h {windDir}</span></M>
        </div>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Rainfall</Lbl>
          <M style={{ fontSize: 11, fontWeight: 700, color: X.indigo }}>{rainfall.toFixed(1)}<span style={{ fontSize: 8, color: X.textMut }}> mm</span></M>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: `1px solid ${X.borderLight}` }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>UV Index</Lbl>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Dot c={uvColor} s={5} />
            <M style={{ fontSize: 10, fontWeight: 700, color: uvColor }}>{uvIndex.toFixed(1)}</M>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>Barometric</Lbl>
          <M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{pressure.toFixed(1)} hPa <span style={{ color: X.amber }}>{trend}</span></M>
        </div>
      </div>
    </Card>
  );
}

// ── Crop Health ──────────────────────────────────────────────────────
export function CropHealth({ title = 'Crop Health', ndviThreshold = 0.5 }: { title?: string; ndviThreshold?: number }) {
  const X = getX();
  const fields = useMemo(() => [
    { name: 'Field 1 — Wheat', crop: 'Winter Wheat', ndvi: 0.82, stage: 'Heading', acres: 120 },
    { name: 'Field 2 — Soybean', crop: 'Soybean', ndvi: 0.68, stage: 'Flowering', acres: 85 },
    { name: 'Field 3 — Corn', crop: 'Sweet Corn', ndvi: 0.45, stage: 'Silking', acres: 200 },
    { name: 'Field 4 — Alfalfa', crop: 'Alfalfa', ndvi: 0.31, stage: 'Regrowth', acres: 60 },
  ], []);

  const ndviColor = (v: number) => v >= 0.7 ? X.teal : v >= ndviThreshold ? X.amber : X.red;

  const liveFields = fields.map((f, i) => {
    const n = f.ndvi;
    return { ...f, liveNdvi: Math.max(0, Math.min(1, n)) };
  });

  return (
    <Card style={{ width: 400 }} glow={X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{fields.reduce((s, f) => s + f.acres, 0)} acres</Badge>
      </div>
      {liveFields.map((f, i) => {
        const c = ndviColor(f.liveNdvi);
        return (
          <div key={i} style={{ marginBottom: i < liveFields.length - 1 ? 8 : 0, animation: `sr 150ms ${ease.o} ${i * 30}ms both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
              <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{f.name}</M>
              <Badge color={X.purple}>{f.stage}</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
              <Lbl style={{ minWidth: 28 }}>NDVI</Lbl>
              <div style={{ flex: 1 }}>
                <Prog value={f.liveNdvi * 100} color={c} h={4} />
              </div>
              <M style={{ fontSize: 11, fontWeight: 800, color: c, minWidth: 32, textAlign: 'right' }}>{f.liveNdvi.toFixed(2)}</M>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <M style={{ fontSize: 8, color: X.textMut }}>{f.crop}</M>
              <M style={{ fontSize: 8, color: X.textMut }}>{f.acres} acres</M>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// ── Drone View ───────────────────────────────────────────────────────
export function DroneView({ title = 'Drone Fleet', lowBatteryThreshold = 20 }: { title?: string; lowBatteryThreshold?: number }) {
  const X = getX();
  const drones = useMemo(() => [
    { id: 'DJI-AG01', mission: 'Surveying', battery: 78, alt: 45, coverage: 62 },
    { id: 'DJI-AG02', mission: 'Spraying', battery: 54, alt: 8, coverage: 38 },
    { id: 'DJI-AG03', mission: 'Idle', battery: 96, alt: 0, coverage: 100 },
    { id: 'DJI-AG04', mission: 'Charging', battery: 23, alt: 0, coverage: 0 },
  ], []);

  const missionColor: Record<string, string> = { Surveying: X.indigo, Spraying: X.teal, Idle: X.textMut, Charging: X.amber };

  const liveDrones = drones.map((d, i) => {
    const b = d.battery;
    const cov = d.coverage;
    return { ...d, liveBat: Math.max(0, Math.min(100, Math.round(b))), liveCov: Math.max(0, Math.min(100, Math.round(cov))) };
  });

  return (
    <Card style={{ width: 370 }} glow={X.indigo}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>{drones.filter(d => d.mission !== 'Idle' && d.mission !== 'Charging').length} Active</Badge>
      </div>
      {liveDrones.map((d, i) => {
        const mc = missionColor[d.mission] || X.textMut;
        const bc = d.liveBat > 50 ? X.teal : d.liveBat > lowBatteryThreshold ? X.amber : X.red;
        return (
          <div key={i} style={{ padding: '6px 0', borderBottom: i < liveDrones.length - 1 ? `1px solid ${X.borderLight}` : 'none', animation: `sr 150ms ${ease.o} ${i * 30}ms both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Dot c={mc} pulse={d.mission === 'Surveying' || d.mission === 'Spraying'} s={6} />
                <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{d.id}</M>
              </div>
              <Badge color={mc}>{d.mission}</Badge>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              <div>
                <Lbl style={{ marginBottom: 2 }}>Battery</Lbl>
                <Prog value={d.liveBat} color={bc} h={3} style={{ marginBottom: 2 }} />
                <M style={{ fontSize: 9, fontWeight: 700, color: bc }}>{d.liveBat}%</M>
              </div>
              <div>
                <Lbl style={{ marginBottom: 2 }}>Altitude</Lbl>
                <M style={{ fontSize: 10, fontWeight: 700, color: d.alt > 0 ? X.text : X.textMut }}>{d.alt}<span style={{ fontSize: 8, color: X.textMut }}> m</span></M>
              </div>
              <div>
                <Lbl style={{ marginBottom: 2 }}>Coverage</Lbl>
                <Prog value={d.liveCov} color={X.purple} h={3} style={{ marginBottom: 2 }} />
                <M style={{ fontSize: 9, fontWeight: 700, color: X.purple }}>{d.liveCov}%</M>
              </div>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// ── Harvest Tracker ──────────────────────────────────────────────────
export function HarvestTracker({ title = 'Harvest Tracker', yieldUnit = 'tons' }: { title?: string; yieldUnit?: string }) {
  const X = getX();
  const crops = useMemo(() => [
    { name: 'Winter Wheat', yield: 4.8, target: 5.2, grade: 'A', complete: 92 },
    { name: 'Sweet Corn', yield: 9.1, target: 10.0, grade: 'B', complete: 74 },
    { name: 'Soybean', yield: 2.9, target: 3.5, grade: 'A', complete: 65 },
    { name: 'Alfalfa', yield: 7.4, target: 8.0, grade: 'B', complete: 88 },
    { name: 'Barley', yield: 3.1, target: 4.0, grade: 'C', complete: 41 },
  ], []);

  const gradeColor: Record<string, string> = { A: X.teal, B: X.amber, C: X.red };

  const liveCrops = crops.map((c, i) => {
    const comp = c.complete;
    return { ...c, liveComplete: Math.max(0, Math.min(100, Math.round(comp))) };
  });

  const totalYield = crops.reduce((s, c) => s + c.yield, 0);
  const totalTarget = crops.reduce((s, c) => s + c.target, 0);

  return (
    <Card style={{ width: 420 }} glow={X.amber}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.amber}>{totalYield.toFixed(1)} / {totalTarget.toFixed(1)} {yieldUnit}</Badge>
      </div>
      {liveCrops.map((c, i) => {
        const pctOfTarget = Math.min(100, (c.yield / c.target) * 100);
        const gc = gradeColor[c.grade] || X.textMut;
        return (
          <div key={i} style={{ marginBottom: i < liveCrops.length - 1 ? 7 : 0, animation: `sr 150ms ${ease.o} ${i * 25}ms both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
              <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{c.name}</M>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Badge color={gc}>Grade {c.grade}</Badge>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
              <div style={{ flex: 1 }}>
                <Lbl style={{ marginBottom: 2 }}>Yield vs Target</Lbl>
                <Prog value={pctOfTarget} color={pctOfTarget >= 90 ? X.teal : pctOfTarget >= 70 ? X.amber : X.red} h={3} />
              </div>
              <M style={{ fontSize: 9, fontWeight: 700, color: X.textSec, minWidth: 60, textAlign: 'right' }}>{c.yield}t / {c.target}t</M>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <M style={{ fontSize: 8, color: X.textMut }}>Harvest completion</M>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Prog value={c.liveComplete} color={X.purple} h={2} style={{ width: 50 }} />
                <M style={{ fontSize: 9, fontWeight: 700, color: X.purple }}>{c.liveComplete}%</M>
              </div>
            </div>
          </div>
        );
      })}
    </Card>
  );
}
