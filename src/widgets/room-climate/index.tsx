import { useState, useCallback } from 'react';
import { getX, ease, Card, Badge, Btn, Slider, Lbl, M, Dot } from '../primitives';

// ── Scene Presets ─────────────────────────────────────────────────────
export function ScenePresets({ title = 'Room Presets', switchDelay = 600 }: { title?: string; switchDelay?: number }) {
  const X = getX();
  const scenes = [{ n: 'Presentation', d: 'Projector + screens + dim lights' }, { n: 'Video Call', d: 'Camera + display + auto-frame' }, { n: 'Standby', d: 'Low power, displays off' }, { n: 'All On', d: 'Full brightness, all sources' }];
  const [active, setActive] = useState(0);
  const [sw, setSw] = useState(false);
  const go = (i: number) => { if (i === active || sw) return; setSw(true); setTimeout(() => { setActive(i); setSw(false); }, switchDelay); };
  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        {sw && <M style={{ fontSize: 9, color: X.amber, animation: 'br 800ms ease infinite' }}>Switching…</M>}
      </div>
      {scenes.map((sc, i) => (
        <button key={i} onClick={() => go(i)} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
          borderRadius: X.rs, border: `1px solid ${active === i ? X.purple + '25' : 'transparent'}`,
          background: active === i ? X.purple + '0c' : 'transparent', cursor: 'pointer', textAlign: 'left',
          marginBottom: 1, transition: 'background-color 180ms, border-color 180ms, transform 180ms', animation: `sr 180ms ${ease.o} ${i * 30}ms both`,
        }}>
          <div style={{ width: 3, height: 24, borderRadius: 2, background: active === i ? X.purple : X.border, transition: 'background 200ms' }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: active === i ? X.text : X.textSec }}>{sc.n}</div>
            <M style={{ fontSize: 8, color: X.textMut }}>{sc.d}</M>
          </div>
          {active === i && <Badge color={X.teal} solid>Active</Badge>}
        </button>
      ))}
    </Card>
  );
}

// ── Power Sequencer ───────────────────────────────────────────────────
export function PowerSequencer({ title = 'Power Sequencer', deviceCount = 6 }: { title?: string; deviceCount?: number }) {
  const X = getX();
  const allDevs = [{ n: 'Amplifier', del: 0 }, { n: 'Processor', del: 2 }, { n: 'Projector', del: 5 }, { n: 'Display A', del: 5 }, { n: 'Display B', del: 5 }, { n: 'Lighting', del: 8 }];
  const devs = allDevs.slice(0, deviceCount);
  const [states, setStates] = useState(() => devs.map(() => false));
  const [running, setRunning] = useState(false);
  const run = (target: boolean) => {
    setRunning(true);
    devs.forEach((d, i) => {
      setTimeout(() => {
        setStates(prev => { const n = [...prev]; n[i] = target; return n; });
        if (i === devs.length - 1) setTimeout(() => setRunning(false), 500);
      }, d.del * 200);
    });
  };
  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        {running && <M style={{ fontSize: 9, color: X.amber, animation: 'br 800ms ease infinite' }}>Running…</M>}
      </div>
      {devs.map((d, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: i < devs.length - 1 ? `1px solid ${X.borderLight}` : 'none', animation: `sr 150ms ${ease.o} ${i * 20}ms both` }}>
          <Dot c={states[i] ? X.teal : X.textMut} pulse={states[i]} s={6} />
          <M style={{ fontSize: 10, flex: 1, color: X.text }}>{d.n}</M>
          <M style={{ fontSize: 8, color: X.textMut }}>+{d.del}s</M>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 4, marginTop: 10 }}>
        <Btn onClick={() => run(true)} color={X.teal} style={{ flex: 1 }}>Power On</Btn>
        <Btn onClick={() => run(false)} color={X.red} style={{ flex: 1 }}>Power Off</Btn>
      </div>
    </Card>
  );
}

// ── Macro Builder ─────────────────────────────────────────────────────
export function MacroBuilder({ title = 'Macro: Startup', stepCount = 4 }: { title?: string; stepCount?: number }) {
  const X = getX();
  const allSteps = [{ a: 'Power On Projector', d: 0 }, { a: 'Set Input HDMI 1', d: 2 }, { a: 'Set Volume 60%', d: 3 }, { a: 'Lower Screen', d: 4 }, { a: 'Dim Lights', d: 5 }, { a: 'Start Recording', d: 7 }];
  const [steps] = useState(allSteps.slice(0, stepCount));
  const [running, setRunning] = useState(false);
  const [current, setCurrent] = useState(-1);
  const run = () => {
    setRunning(true); setCurrent(0);
    steps.forEach((s, i) => setTimeout(() => { setCurrent(i); if (i === steps.length - 1) setTimeout(() => { setRunning(false); setCurrent(-1); }, 600); }, s.d * 200));
  };
  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Btn small onClick={run} color={running ? X.amber : X.teal} disabled={running}>{running ? 'Running…' : '▶ Run'}</Btn>
      </div>
      {steps.map((s, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: i < steps.length - 1 ? `1px solid ${X.borderLight}` : 'none' }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', border: `1px solid ${current === i ? X.teal : current > i ? X.teal + '40' : X.border}`, background: current > i ? X.teal + '15' : current === i ? X.teal + '20' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 200ms, border-color 200ms, transform 200ms' }}>
            {current > i ? <M style={{ fontSize: 8, color: X.teal }}>✓</M> : <M style={{ fontSize: 8, color: current === i ? X.teal : X.textMut }}>{i + 1}</M>}
          </div>
          <M style={{ fontSize: 10, flex: 1, color: current >= i ? X.text : X.textSec }}>{s.a}</M>
          <M style={{ fontSize: 8, color: X.textMut }}>+{s.d}s</M>
        </div>
      ))}
    </Card>
  );
}

// ── Thermostat Control ────────────────────────────────────────────────
export function ThermostatControl({ form = 'hybrid', unit = 'celsius', ambientC }: { form?: string; unit?: string; ambientC: number }) {
  const X = getX();
  const [activeForm, setActiveForm] = useState(form);
  const [activeUnit, setActiveUnit] = useState(unit);
  const [hvacMode, setHvacMode] = useState('auto');
  const [setpointC, setSetpointC] = useState(22);

  const toDisplay = useCallback((valueC: number) => (activeUnit === 'fahrenheit' ? valueC * 9 / 5 + 32 : valueC), [activeUnit]);
  const fromDisplay = useCallback((value: number) => (activeUnit === 'fahrenheit' ? (value - 32) * 5 / 9 : value), [activeUnit]);

  const setpointDisplay = toDisplay(setpointC);
  const ambientDisplay = toDisplay(ambientC);
  const minDisplay = activeUnit === 'fahrenheit' ? 60 : 16;
  const maxDisplay = activeUnit === 'fahrenheit' ? 82 : 28;
  const unitMark = activeUnit === 'fahrenheit' ? 'F' : 'C';

  const updateSetpointDisplay = (value: number) => {
    const clamped = Math.max(minDisplay, Math.min(maxDisplay, value));
    setSetpointC(fromDisplay(clamped));
  };

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>Thermostat</div>
        <Badge color={X.indigo}>{activeForm}</Badge>
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
        {['rotary', 'digital', 'hybrid'].map(f => <Btn key={f} small ghost active={activeForm === f} onClick={() => setActiveForm(f)} color={X.indigo}>{f}</Btn>)}
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
        <Btn small ghost active={activeUnit === 'celsius'} onClick={() => setActiveUnit('celsius')} color={X.teal}>C</Btn>
        <Btn small ghost active={activeUnit === 'fahrenheit'} onClick={() => setActiveUnit('fahrenheit')} color={X.teal}>F</Btn>
      </div>
      {(activeForm === 'rotary' || activeForm === 'hybrid') && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <div style={{ width: 104, height: 104, borderRadius: '50%', border: `1px solid ${X.borderLight}`, background: X.bgAlt, boxShadow: X.sh, display: 'grid', placeItems: 'center', position: 'relative' }}>
            <div style={{ textAlign: 'center' }}>
              <M style={{ fontSize: 24, fontWeight: 800, color: X.text }}>{Math.round(setpointDisplay)}°</M>
              <M style={{ fontSize: 9, color: X.textMut }}>{unitMark}</M>
            </div>
            <button onClick={() => updateSetpointDisplay(setpointDisplay + 1)} aria-label="Increase" style={{ position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)', border: `1px solid ${X.border}`, background: X.surface, color: X.text, borderRadius: '50%', width: 22, height: 22, cursor: 'pointer' }}>+</button>
            <button onClick={() => updateSetpointDisplay(setpointDisplay - 1)} aria-label="Decrease" style={{ position: 'absolute', left: -6, top: '50%', transform: 'translateY(-50%)', border: `1px solid ${X.border}`, background: X.surface, color: X.text, borderRadius: '50%', width: 22, height: 22, cursor: 'pointer' }}>-</button>
          </div>
        </div>
      )}
      {(activeForm === 'digital' || activeForm === 'hybrid') && (
        <div style={{ marginBottom: 10 }}>
          <Slider label="Setpoint" value={Math.round(setpointDisplay)} min={minDisplay} max={maxDisplay} onChange={updateSetpointDisplay} color={X.indigo} unit={`°${unitMark}`} />
        </div>
      )}
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
        {['off', 'heat', 'cool', 'auto'].map(m => <Btn key={m} small ghost active={hvacMode === m} onClick={() => setHvacMode(m)} color={X.purple}>{m}</Btn>)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Lbl>Ambient</Lbl>
        <M style={{ fontSize: 11, fontWeight: 700, color: X.teal }}>{ambientDisplay.toFixed(1)}°{unitMark}</M>
      </div>
    </Card>
  );
}

// ── Climate Card ──────────────────────────────────────────────────────
export function Climate({ title = 'Climate', defaultTarget = 22, temp, hum }: { title?: string; defaultTarget?: number; temp: number; hum: number }) {
  const X = getX();
  const [target, setTarget] = useState(defaultTarget);
  return (
    <Card style={{ width: 190 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <M style={{ fontSize: 36, fontWeight: 800, color: temp > target + 2 ? X.amber : temp < target - 2 ? X.indigo : X.text }}>{temp.toFixed(1)}°</M>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 10 }}>
        <Btn small ghost onClick={() => setTarget(t => t - 1)}>−</Btn>
        <M style={{ fontSize: 11, color: X.textSec, display: 'flex', alignItems: 'center' }}>Target: {target}°C</M>
        <Btn small ghost onClick={() => setTarget(t => t + 1)}>+</Btn>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Humidity</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.teal }}>{Math.round(hum)}%</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>CO₂</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.teal }}>420 ppm</M></div>
      </div>
    </Card>
  );
}

// ── Occupancy ─────────────────────────────────────────────────────────
export function Occupancy({ title = 'Occupancy', capacity = 30, occ }: { title?: string; capacity?: number; occ: number }) {
  const X = getX();
  const max = capacity;
  const pct = (Math.round(occ) / max) * 100;
  return (
    <Card style={{ width: 180 }}>
      <Lbl style={{ marginBottom: 6 }}>{title}</Lbl>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
        <M style={{ fontSize: 28, fontWeight: 800, color: X.text }}>{Math.max(0, Math.round(occ))}</M>
        <M style={{ fontSize: 12, color: X.textMut }}>/ {max}</M>
      </div>
      <Prog value={pct} color={pct > 85 ? X.red : pct > 60 ? X.amber : X.teal} h={4} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginTop: 8 }}>
        {Array.from({ length: max }, (_, i) => <div key={i} style={{ width: 7, height: 7, borderRadius: 2, background: i < Math.round(occ) ? X.teal : X.borderLight, transition: 'background 400ms' }} />)}
      </div>
    </Card>
  );
}

// ── Schedule ──────────────────────────────────────────────────────────
export function Schedule({ title = 'Room Schedule', maxEvents = 4 }: { title?: string; maxEvents?: number }) {
  const X = getX();
  const allEvents = [{ t: '09:00–10:00', n: 'All Hands', st: 'done' }, { t: '10:30–11:30', n: 'Client Presentation', st: 'live' }, { t: '13:00–14:00', n: 'Design Review', st: 'next' }, { t: '15:00–16:30', n: 'Board Meeting', st: 'next' }, { t: '17:00–18:00', n: 'AV Setup', st: 'next' }, { t: '18:30–19:30', n: 'Evening Session', st: 'next' }];
  const events = allEvents.slice(0, maxEvents);
  const sc: Record<string, string> = { done: X.textMut, live: X.teal, next: X.purple };
  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>{title}</div>
      {events.map((ev, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, padding: '7px 0', borderLeft: `2px solid ${sc[ev.st]}`, paddingLeft: 10, marginLeft: 2, opacity: ev.st === 'done' ? 0.35 : 1, animation: `sr 180ms ${ease.o} ${i * 30}ms both` }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: X.text }}>{ev.n}</div>
            <M style={{ fontSize: 8, color: X.textMut }}>{ev.t}</M>
          </div>
          {ev.st === 'live' && <Badge color={X.teal} solid>Live</Badge>}
        </div>
      ))}
    </Card>
  );
}

import { Prog } from '../primitives';
