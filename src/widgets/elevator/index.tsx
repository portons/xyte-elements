import { useState, useEffect } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { useAnim, useTick } from '../hooks';

function neo() {
  const X = getX();
  const dark = X.bg + '40';
  const light = '#ffffff12';
  return {
    raised: `4px 4px 10px ${dark}, -2px -2px 6px ${light}`,
    concave: `inset 3px 3px 8px ${dark}, inset -2px -2px 5px ${light}`,
    bezel: `inset 0 1px 0 ${light}, inset 0 -1px 0 rgba(0,0,0,0.3), 0 2px 8px ${dark}`,
    metal: `linear-gradient(135deg, ${X.surface}, ${X.bgAlt} 40%, ${X.surface} 60%, ${X.bgAlt})`,
  };
}

// ── Shaft View ──────────────────────────────────────────────────────
export function ShaftView({ title = 'Elevator Shaft', floors = 10, currentFloor = 4, direction = 'up' as 'up' | 'down' | 'idle' }: { title?: string; floors?: number; currentFloor?: number; direction?: 'up' | 'down' | 'idle' }) {
  const X = getX();
  const n = neo();
  const dirColor = direction === 'up' ? X.teal : direction === 'down' ? X.amber : X.textMut;
  const dirLabel = direction === 'up' ? 'Going Up' : direction === 'down' ? 'Going Down' : 'Idle';
  const animFloor = useAnim(currentFloor);

  const shaftH = 160;
  const floorH = shaftH / floors;
  // Car position: floor 1 at bottom, floor N at top
  const carY = shaftH - (animFloor / floors) * shaftH - floorH + 8;

  return (
    <Card style={{ width: 350 }} glow={dirColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={dirColor}>{dirLabel}</Badge>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
        {/* Floor labels */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: shaftH }}>
          {Array.from({ length: floors }, (_, i) => floors - i).map(f => (
            <M key={f} style={{
              fontSize: 8, fontWeight: f === Math.round(animFloor) ? 700 : 400,
              color: f === Math.round(animFloor) ? dirColor : X.textMut,
              textAlign: 'right', width: 16,
              transition: 'color 200ms',
            }}>{f}</M>
          ))}
        </div>
        {/* Shaft */}
        <div style={{ position: 'relative', width: 50, height: shaftH, boxShadow: n.concave, borderRadius: X.rs, overflow: 'hidden' }}>
          {/* Floor lines */}
          {Array.from({ length: floors }, (_, i) => (
            <div key={i} style={{
              position: 'absolute', top: (i / floors) * shaftH, width: '100%', height: 1,
              background: X.borderLight + '40',
            }} />
          ))}
          {/* Guide rails */}
          <div style={{ position: 'absolute', left: 4, top: 0, width: 1, height: '100%', background: X.borderLight + '60' }} />
          <div style={{ position: 'absolute', right: 4, top: 0, width: 1, height: '100%', background: X.borderLight + '60' }} />
          {/* Elevator car */}
          <div style={{
            position: 'absolute', left: 6, right: 6, top: carY, height: floorH - 2,
            background: dirColor + '30', border: `1.5px solid ${dirColor}`,
            borderRadius: 3, transition: `top 800ms ${ease.mv}`,
            boxShadow: `0 0 8px ${dirColor}40`,
          }}>
            {/* Door line */}
            <div style={{ position: 'absolute', left: '50%', top: 2, bottom: 2, width: 1, background: dirColor + '60' }} />
          </div>
        </div>
        {/* Info panel */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 }}>
          <div style={{ textAlign: 'center' }}>
            <M style={{ fontSize: 42, fontWeight: 800, color: dirColor, lineHeight: 1 }}>{Math.round(animFloor)}</M>
            <Lbl style={{ marginTop: 2 }}>Current Floor</Lbl>
          </div>
          <div style={{ textAlign: 'center' }}>
            <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, margin: '0 auto', display: 'block' }}>
              {direction === 'up' && <path d="M12,4 L18,14 L14,14 L14,20 L10,20 L10,14 L6,14 Z" fill={dirColor} />}
              {direction === 'down' && <path d="M12,20 L18,10 L14,10 L14,4 L10,4 L10,10 L6,10 Z" fill={dirColor} />}
              {direction === 'idle' && <>
                <rect x="4" y="10" width="16" height="4" rx="2" fill={X.textMut} />
              </>}
            </svg>
            <M style={{ fontSize: 9, color: X.textMut, marginTop: 2 }}>{dirLabel}</M>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div><Lbl style={{ marginBottom: 2 }}>Floors</Lbl><M style={{ fontSize: 10, fontWeight: 600, color: X.textSec }}>{floors}</M></div>
            <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Speed</Lbl><M style={{ fontSize: 10, fontWeight: 600, color: X.textSec }}>{direction === 'idle' ? '0' : '1.6'} m/s</M></div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Floor Indicator ─────────────────────────────────────────────────
export function FloorIndicator({ title = 'Floor Indicator', currentFloor = 7, direction = 'up' as 'up' | 'down' | 'idle', maxFloor = 20 }: { title?: string; currentFloor?: number; direction?: 'up' | 'down' | 'idle'; maxFloor?: number }) {
  const X = getX();
  const n = neo();
  const dirColor = direction === 'up' ? X.teal : direction === 'down' ? X.amber : X.textMut;
  const animFloor = useAnim(currentFloor);

  // 7-segment digit rendering
  const segs: Record<number, number[]> = {
    0: [1,1,1,0,1,1,1], 1: [0,0,1,0,0,1,0], 2: [1,0,1,1,1,0,1], 3: [1,0,1,1,0,1,1],
    4: [0,1,1,1,0,1,0], 5: [1,1,0,1,0,1,1], 6: [1,1,0,1,1,1,1], 7: [1,0,1,0,0,1,0],
    8: [1,1,1,1,1,1,1], 9: [1,1,1,1,0,1,1],
  };
  const floorVal = Math.round(animFloor);
  const d1 = Math.floor(floorVal / 10);
  const d2 = floorVal % 10;

  const renderDigit = (digit: number, ox: number) => {
    const s = segs[digit] || segs[0];
    const on = dirColor;
    const off = X.borderLight + '30';
    // [top, topLeft, topRight, mid, botLeft, botRight, bot]
    return (
      <g>
        <rect x={ox + 4} y={2} width={14} height={3} rx={1} fill={s[0] ? on : off} />
        <rect x={ox} y={6} width={3} height={14} rx={1} fill={s[1] ? on : off} />
        <rect x={ox + 19} y={6} width={3} height={14} rx={1} fill={s[2] ? on : off} />
        <rect x={ox + 4} y={21} width={14} height={3} rx={1} fill={s[3] ? on : off} />
        <rect x={ox} y={25} width={3} height={14} rx={1} fill={s[4] ? on : off} />
        <rect x={ox + 19} y={25} width={3} height={14} rx={1} fill={s[5] ? on : off} />
        <rect x={ox + 4} y={40} width={14} height={3} rx={1} fill={s[6] ? on : off} />
      </g>
    );
  };

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Dot c={dirColor} pulse={direction !== 'idle'} s={7} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        {/* Direction chevrons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <svg viewBox="0 0 20 12" style={{ width: 20, height: 12 }}>
            <path d="M10,2 L18,10 L2,10 Z" fill={direction === 'up' ? X.teal : X.borderLight + '30'} />
          </svg>
          <svg viewBox="0 0 20 12" style={{ width: 20, height: 12 }}>
            <path d="M10,10 L18,2 L2,2 Z" fill={direction === 'down' ? X.amber : X.borderLight + '30'} />
          </svg>
        </div>
        {/* 7-segment display */}
        <div style={{ padding: '8px 12px', borderRadius: X.rs, boxShadow: n.concave, background: X.bg + '80' }}>
          <svg viewBox="0 0 56 45" style={{ width: 70, height: 56 }}>
            {d1 > 0 && renderDigit(d1, 0)}
            {renderDigit(d2, d1 > 0 ? 28 : 14)}
          </svg>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Direction</Lbl><M style={{ fontSize: 10, fontWeight: 600, color: dirColor }}>{direction === 'up' ? 'UP' : direction === 'down' ? 'DOWN' : 'IDLE'}</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Max Floor</Lbl><M style={{ fontSize: 10, fontWeight: 600, color: X.textSec }}>{maxFloor}</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Zone</Lbl><M style={{ fontSize: 10, fontWeight: 600, color: X.textSec }}>{currentFloor <= 5 ? 'Low' : currentFloor <= 14 ? 'Mid' : 'High'}</M></div>
      </div>
    </Card>
  );
}

// ── Door Status ─────────────────────────────────────────────────────
export function DoorStatus({ title = 'Door Control', doorState = 'closed' as 'open' | 'closed' | 'opening' | 'closing', doorPercent = 0 }: { title?: string; doorState?: 'open' | 'closed' | 'opening' | 'closing'; doorPercent?: number }) {
  const X = getX();
  const n = neo();
  const isMoving = doorState === 'opening' || doorState === 'closing';
  const stateColor = doorState === 'open' ? X.teal : doorState === 'closed' ? X.textMut : X.amber;
  const animPct = useAnim(doorPercent);
  const tick = useTick(150);

  // Door opening = 0 (closed) to 100 (open)
  const openPct = doorState === 'open' ? 100 : doorState === 'closed' ? 0 : animPct;
  const doorGap = (openPct / 100) * 36;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={stateColor} solid>{doorState.toUpperCase()}</Badge>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <svg viewBox="0 0 120 100" style={{ width: 200, height: 'auto' }}>
          {/* Door frame */}
          <rect x="15" y="5" width="90" height="90" rx="3" fill="none" stroke={X.borderLight} strokeWidth="1.5" />
          {/* Frame top */}
          <rect x="15" y="5" width="90" height="8" rx="2" fill={X.bgAlt} stroke={X.borderLight} strokeWidth="0.5" />
          {/* Left door panel */}
          <rect
            x="18" y="14"
            width={Math.max(0, 42 - doorGap)}
            height="78" rx="1"
            fill={stateColor + '18'} stroke={stateColor} strokeWidth="1"
            style={{ transition: `width 400ms ${ease.mv}` }}
          />
          {/* Right door panel */}
          <rect
            x={60 + doorGap} y="14"
            width={Math.max(0, 42 - doorGap)}
            height="78" rx="1"
            fill={stateColor + '18'} stroke={stateColor} strokeWidth="1"
            style={{ transition: `x 400ms ${ease.mv}, width 400ms ${ease.mv}` }}
          />
          {/* Door handles */}
          {openPct < 80 && <>
            <rect x={56 - doorGap} y="45" width="2" height="12" rx="1" fill={stateColor} style={{ transition: `x 400ms ${ease.mv}` }} />
            <rect x={62 + doorGap} y="45" width="2" height="12" rx="1" fill={stateColor} style={{ transition: `x 400ms ${ease.mv}` }} />
          </>}
          {/* Motion arrows */}
          {isMoving && (
            <g style={{ opacity: (tick % 6) > 3 ? 0.3 : 0.8 }}>
              {doorState === 'opening' ? <>
                <path d="M35,50 L25,45 L25,55 Z" fill={X.amber} />
                <path d="M85,50 L95,45 L95,55 Z" fill={X.amber} />
              </> : <>
                <path d="M30,50 L40,45 L40,55 Z" fill={X.amber} />
                <path d="M90,50 L80,45 L80,55 Z" fill={X.amber} />
              </>}
            </g>
          )}
          {/* Safety sensor beam */}
          <line x1={18 + (42 - doorGap)} y1="85" x2={60 + doorGap} y2="85"
            stroke={X.red + '60'} strokeWidth="0.5" strokeDasharray="2 2"
            style={{ transition: `x1 400ms ${ease.mv}, x2 400ms ${ease.mv}` }} />
        </svg>
      </div>
      <Prog value={openPct} color={stateColor} h={3} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <div><Lbl style={{ marginBottom: 2 }}>Open %</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: stateColor }}>{openPct.toFixed(0)}%</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Sensor</Lbl><M style={{ fontSize: 10, fontWeight: 600, color: X.teal }}>Clear</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Cycles</Lbl><M style={{ fontSize: 10, fontWeight: 600, color: X.textSec }}>12,847</M></div>
      </div>
    </Card>
  );
}

// ── Load Cell ───────────────────────────────────────────────────────
export function LoadCell({ title = 'Cabin Load', loadKg = 320, maxKg = 1000, passengers = 4 }: { title?: string; loadKg?: number; maxKg?: number; passengers?: number }) {
  const X = getX();
  const pct = Math.min(100, (loadKg / maxKg) * 100);
  const animPct = useAnim(pct);
  const loadColor = pct > 90 ? X.red : pct > 70 ? X.amber : X.teal;
  const maxPassengers = 8;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={loadColor}>{pct > 90 ? 'OVERLOAD' : pct > 70 ? 'Heavy' : 'Normal'}</Badge>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
        {/* Circular gauge */}
        <svg viewBox="0 0 100 100" style={{ width: 90, height: 90, flexShrink: 0 }}>
          <circle cx="50" cy="50" r="42" fill="none" stroke={X.borderLight} strokeWidth="5" />
          <circle cx="50" cy="50" r="42" fill="none" stroke={loadColor} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={`${(animPct / 100) * 264} 264`}
            transform="rotate(-90 50 50)"
            style={{ transition: `stroke-dasharray 600ms ${ease.mv}, stroke 400ms`, filter: `drop-shadow(0 0 4px ${loadColor}50)` }} />
          <text x="50" y="44" textAnchor="middle" fontFamily={X.m} fontSize="16" fontWeight="800" fill={loadColor}>{loadKg}</text>
          <text x="50" y="56" textAnchor="middle" fontFamily={X.m} fontSize="7" fill={X.textMut}>kg</text>
          <text x="50" y="68" textAnchor="middle" fontFamily={X.m} fontSize="6" fill={X.textMut}>of {maxKg}</text>
        </svg>
        {/* Passenger icons */}
        <div style={{ flex: 1 }}>
          <Lbl style={{ marginBottom: 6 }}>Passengers</Lbl>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
            {Array.from({ length: maxPassengers }, (_, i) => {
              const active = i < passengers;
              return (
                <svg key={i} viewBox="0 0 20 28" style={{ width: 18, height: 25 }}>
                  <circle cx="10" cy="7" r="4" fill={active ? loadColor : X.borderLight + '40'} />
                  <path d="M4,28 L4,16 C4,13 7,11 10,11 C13,11 16,13 16,16 L16,28" fill={active ? loadColor + '60' : X.borderLight + '20'} />
                </svg>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <M style={{ fontSize: 10, fontWeight: 700, color: X.text }}>{passengers} / {maxPassengers}</M>
            <M style={{ fontSize: 10, color: X.textMut }}>{animPct.toFixed(0)}% capacity</M>
          </div>
        </div>
      </div>
      <Prog value={pct} color={loadColor} h={4} />
    </Card>
  );
}

// ── Maintenance Timer ───────────────────────────────────────────────
export function MaintenanceTimer({ title = 'Maintenance', hoursUntilService = 342, tripCount = 14823, totalTrips = 50000 }: { title?: string; hoursUntilService?: number; tripCount?: number; totalTrips?: number }) {
  const X = getX();
  const n = neo();
  const maxHours = 500;
  const pct = Math.min(100, (hoursUntilService / maxHours) * 100);
  const animPct = useAnim(pct);
  const urgency = hoursUntilService < 50 ? X.red : hoursUntilService < 150 ? X.amber : X.teal;
  const tripPct = (tripCount / totalTrips) * 100;
  const animTrips = useAnim(tripCount);

  // Format odometer digits
  const odometerStr = String(Math.round(animTrips)).padStart(6, '0');

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={urgency}>{hoursUntilService < 50 ? 'URGENT' : hoursUntilService < 150 ? 'Soon' : 'OK'}</Badge>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
        {/* Countdown ring */}
        <svg viewBox="0 0 100 100" style={{ width: 85, height: 85, flexShrink: 0 }}>
          <circle cx="50" cy="50" r="42" fill="none" stroke={X.borderLight} strokeWidth="4" />
          <circle cx="50" cy="50" r="42" fill="none" stroke={urgency} strokeWidth="4" strokeLinecap="round"
            strokeDasharray={`${(animPct / 100) * 264} 264`}
            transform="rotate(-90 50 50)"
            style={{ transition: `stroke-dasharray 600ms ${ease.mv}, stroke 400ms`, filter: `drop-shadow(0 0 3px ${urgency}40)` }} />
          <text x="50" y="44" textAnchor="middle" fontFamily={X.m} fontSize="14" fontWeight="800" fill={urgency}>{hoursUntilService}</text>
          <text x="50" y="56" textAnchor="middle" fontFamily={X.m} fontSize="6" fill={X.textMut}>hours left</text>
          <text x="50" y="66" textAnchor="middle" fontFamily={X.m} fontSize="5" fill={X.textMut}>until service</text>
        </svg>
        {/* Odometer */}
        <div style={{ flex: 1 }}>
          <Lbl style={{ marginBottom: 6 }}>Trip Odometer</Lbl>
          <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
            {odometerStr.split('').map((d, i) => (
              <div key={i} style={{
                width: 22, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 3, boxShadow: n.concave, background: X.bg + '80',
              }}>
                <M style={{ fontSize: 16, fontWeight: 800, color: i < 3 ? X.textMut : X.text }}>{d}</M>
              </div>
            ))}
          </div>
          <Lbl style={{ marginBottom: 3 }}>Lifetime ({tripPct.toFixed(0)}%)</Lbl>
          <Prog value={tripPct} color={urgency} h={3} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <div><Lbl style={{ marginBottom: 2 }}>Last Service</Lbl><M style={{ fontSize: 10, fontWeight: 600, color: X.textSec }}>2024-11-15</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Interval</Lbl><M style={{ fontSize: 10, fontWeight: 600, color: X.textSec }}>{maxHours}h</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Type</Lbl><M style={{ fontSize: 10, fontWeight: 600, color: X.textSec }}>Full Inspection</M></div>
      </div>
    </Card>
  );
}

// ── Call Queue ───────────────────────────────────────────────────────
export function CallQueue({ title = 'Call Queue', maxFloors = 12 }: { title?: string; maxFloors?: number }) {
  const X = getX();
  const n = neo();
  const [calls, setCalls] = useState<{ floor: number; dir: 'up' | 'down' }[]>(() => {
    const initial: { floor: number; dir: 'up' | 'down' }[] = [];
    for (let i = 0; i < 4; i++) {
      initial.push({
        floor: 1 + Math.floor(Math.random() * maxFloors),
        dir: Math.random() > 0.5 ? 'up' : 'down',
      });
    }
    return initial;
  });

  const isActive = (floor: number, dir: 'up' | 'down') =>
    calls.some(c => c.floor === floor && c.dir === dir);

  const toggleCall = (floor: number, dir: 'up' | 'down') => {
    setCalls(prev => {
      const idx = prev.findIndex(c => c.floor === floor && c.dir === dir);
      if (idx >= 0) return prev.filter((_, i) => i !== idx);
      return [...prev, { floor, dir }];
    });
  };

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>{calls.length} pending</Badge>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 200, overflowY: 'auto' }}>
        {Array.from({ length: maxFloors }, (_, i) => maxFloors - i).map(floor => {
          const upActive = isActive(floor, 'up');
          const downActive = isActive(floor, 'down');
          return (
            <div key={floor} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '3px 4px',
              borderRadius: X.rs,
              background: (upActive || downActive) ? X.indigo + '08' : 'transparent',
            }}>
              <M style={{
                fontSize: 10, fontWeight: 600, width: 24, textAlign: 'right',
                color: (upActive || downActive) ? X.text : X.textMut,
              }}>{floor}</M>
              {/* Up button */}
              <button onClick={() => toggleCall(floor, 'up')} style={{
                width: 26, height: 22, borderRadius: 4, border: 'none', cursor: 'pointer',
                background: upActive ? X.teal + '30' : X.borderLight + '20',
                boxShadow: upActive ? `0 0 8px ${X.teal}40, ${n.bezel}` : n.raised,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: `background 200ms, box-shadow 200ms`,
              }}>
                <svg viewBox="0 0 12 8" style={{ width: 10, height: 7 }}>
                  <path d="M6,1 L11,7 L1,7 Z" fill={upActive ? X.teal : X.textMut + '60'} />
                </svg>
              </button>
              {/* Down button */}
              <button onClick={() => toggleCall(floor, 'down')} style={{
                width: 26, height: 22, borderRadius: 4, border: 'none', cursor: 'pointer',
                background: downActive ? X.amber + '30' : X.borderLight + '20',
                boxShadow: downActive ? `0 0 8px ${X.amber}40, ${n.bezel}` : n.raised,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: `background 200ms, box-shadow 200ms`,
              }}>
                <svg viewBox="0 0 12 8" style={{ width: 10, height: 7 }}>
                  <path d="M6,7 L11,1 L1,1 Z" fill={downActive ? X.amber : X.textMut + '60'} />
                </svg>
              </button>
              {/* Active indicator bar */}
              <div style={{ flex: 1, height: 4, borderRadius: 2, background: X.borderLight + '20', overflow: 'hidden' }}>
                {(upActive || downActive) && (
                  <div style={{
                    width: '100%', height: '100%',
                    background: upActive ? X.teal : X.amber,
                    borderRadius: 2,
                    boxShadow: `0 0 4px ${upActive ? X.teal : X.amber}60`,
                  }} />
                )}
              </div>
              {(upActive || downActive) && <Dot c={upActive ? X.teal : X.amber} pulse s={5} />}
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <M style={{ fontSize: 9, color: X.textMut }}>{calls.filter(c => c.dir === 'up').length} up calls</M>
        <M style={{ fontSize: 9, color: X.textMut }}>{calls.filter(c => c.dir === 'down').length} down calls</M>
      </div>
    </Card>
  );
}
