import { useState } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { useAnim, useLive, useTick } from '../hooks';

function neo() {
  const X = getX();
  const dark = X.bg + '40';
  const light = '#ffffff12';
  return {
    raised: '4px 4px 10px ' + dark + ', -2px -2px 6px ' + light,
    concave: 'inset 3px 3px 8px ' + dark + ', inset -2px -2px 5px ' + light,
    bezel: 'inset 0 1px 0 ' + light + ', inset 0 -1px 0 rgba(0,0,0,0.3), 0 2px 8px ' + dark,
    metal: 'linear-gradient(135deg, ' + X.surface + ', ' + X.bgAlt + ' 40%, ' + X.surface + ' 60%, ' + X.bgAlt + ')',
  };
}

// ── Chronograph ───────────────────────────────────────────────────
export function Chronograph({ title = 'Chronograph' }: { title?: string } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(1000);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const now = new Date();
  const hours = now.getHours() % 12;
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hourAngle = (hours + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  // Chrono subdial values
  const chronoSec = elapsed % 60;
  const chronoMin = Math.floor(elapsed / 60) % 30;
  const chronoHr = Math.floor(elapsed / 3600) % 12;

  if (running && tick > 0) {
    // We use a side effect guard via key to advance elapsed
  }

  const handleStartStop = () => {
    if (!running) {
      setRunning(true);
      setElapsed(prev => prev);
    } else {
      setRunning(false);
    }
    if (running) {
      // stop
    } else {
      setElapsed(prev => prev + 1);
    }
  };

  // Advance elapsed when running
  const displayElapsed = running ? elapsed + tick : elapsed;
  const dSec = displayElapsed % 60;
  const dMin = Math.floor(displayElapsed / 60) % 30;
  const dHr = Math.floor(displayElapsed / 3600) % 12;

  const lumGlow = '0 0 4px ' + X.teal + '60';

  // Helper to draw a hand
  const hand = (cx: number, cy: number, angle: number, len: number, w: number, color: string) => {
    const rad = (angle - 90) * Math.PI / 180;
    const x2 = cx + len * Math.cos(rad);
    const y2 = cy + len * Math.sin(rad);
    return <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeLinecap="round"
      style={{ transition: 'x2 200ms ' + ease.mv + ', y2 200ms ' + ease.mv, filter: 'drop-shadow(0 0 2px ' + color + '40)' }} />;
  };

  // Helper for subdial hand
  const subHand = (cx: number, cy: number, angle: number, len: number, color: string) => {
    const rad = (angle - 90) * Math.PI / 180;
    const x2 = cx + len * Math.cos(rad);
    const y2 = cy + len * Math.sin(rad);
    return <line x1={cx} y1={cy} x2={x2} y2={y2} stroke={color} strokeWidth={0.6} strokeLinecap="round" />;
  };

  return (
    <Card style={{ width: 350 }} glow={X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={running ? X.teal : X.textMut}>{running ? 'Running' : 'Stopped'}</Badge>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: 12 }}>
        {/* Case */}
        <div style={{ width: 200, height: 200, borderRadius: '50%', background: n.metal, boxShadow: n.bezel, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Dial */}
          <div style={{ width: 180, height: 180, borderRadius: '50%', background: X.bg, boxShadow: n.concave, position: 'relative' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              {/* Minute track */}
              <circle cx="50" cy="50" r="46" fill="none" stroke={X.borderLight} strokeWidth="0.3" />
              <circle cx="50" cy="50" r="44" fill="none" stroke={X.borderLight} strokeWidth="0.3" />

              {/* Concentric circles */}
              <circle cx="50" cy="50" r="40" fill="none" stroke={X.borderLight} strokeWidth="0.2" />
              <circle cx="50" cy="50" r="30" fill="none" stroke={X.borderLight} strokeWidth="0.15" />

              {/* Minute ticks */}
              {Array.from({ length: 60 }, (_, i) => {
                const a = (i * 6) * Math.PI / 180;
                const isHour = i % 5 === 0;
                const r1 = isHour ? 40 : 43;
                const r2 = 45;
                return <line key={'mt' + i} x1={50 + r1 * Math.sin(a)} y1={50 - r1 * Math.cos(a)}
                  x2={50 + r2 * Math.sin(a)} y2={50 - r2 * Math.cos(a)}
                  stroke={isHour ? X.text : X.textMut} strokeWidth={isHour ? 1 : 0.3} />;
              })}

              {/* Luminous indices at hour positions */}
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i * 30) * Math.PI / 180;
                const cx = 50 + 38 * Math.sin(a);
                const cy = 50 - 38 * Math.cos(a);
                return <circle key={'li' + i} cx={cx} cy={cy} r={1.2} fill={X.teal}
                  style={{ filter: 'drop-shadow(0 0 2px ' + X.teal + '80)' }} />;
              })}

              {/* Subdial: seconds at 9 o'clock */}
              <circle cx="32" cy="50" r="10" fill="none" stroke={X.borderLight} strokeWidth="0.4" />
              <circle cx="32" cy="50" r="0.6" fill={X.textMut} />
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i * 30) * Math.PI / 180;
                return <line key={'s9' + i} x1={32 + 8 * Math.sin(a)} y1={50 - 8 * Math.cos(a)}
                  x2={32 + 9.5 * Math.sin(a)} y2={50 - 9.5 * Math.cos(a)}
                  stroke={X.textMut} strokeWidth="0.3" />;
              })}
              {subHand(32, 50, dSec * 6, 7.5, X.red)}

              {/* Subdial: minutes at 12 o'clock */}
              <circle cx="50" cy="34" r="10" fill="none" stroke={X.borderLight} strokeWidth="0.4" />
              <circle cx="50" cy="34" r="0.6" fill={X.textMut} />
              {Array.from({ length: 6 }, (_, i) => {
                const a = (i * 60) * Math.PI / 180;
                return <line key={'s12' + i} x1={50 + 8 * Math.sin(a)} y1={34 - 8 * Math.cos(a)}
                  x2={50 + 9.5 * Math.sin(a)} y2={34 - 9.5 * Math.cos(a)}
                  stroke={X.textMut} strokeWidth="0.3" />;
              })}
              {subHand(50, 34, dMin * 12, 7.5, X.indigo)}

              {/* Subdial: hours at 6 o'clock */}
              <circle cx="50" cy="66" r="10" fill="none" stroke={X.borderLight} strokeWidth="0.4" />
              <circle cx="50" cy="66" r="0.6" fill={X.textMut} />
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i * 30) * Math.PI / 180;
                return <line key={'s6' + i} x1={50 + 8 * Math.sin(a)} y1={66 - 8 * Math.cos(a)}
                  x2={50 + 9.5 * Math.sin(a)} y2={66 - 9.5 * Math.cos(a)}
                  stroke={X.textMut} strokeWidth="0.3" />;
              })}
              {subHand(50, 66, dHr * 30, 7.5, X.amber)}

              {/* Hour hand */}
              {hand(50, 50, hourAngle, 22, 2, X.text)}
              {/* Minute hand */}
              {hand(50, 50, minuteAngle, 32, 1.3, X.text)}
              {/* Second hand */}
              {hand(50, 50, secondAngle, 38, 0.5, X.red)}

              {/* Center cap */}
              <circle cx="50" cy="50" r="2.5" fill={X.surface} stroke={X.text} strokeWidth="0.5" />
              <circle cx="50" cy="50" r="1" fill={X.red} />
            </svg>
          </div>
        </div>

        {/* Pusher buttons on right side */}
        <div style={{ position: 'absolute', right: 30, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 40 }}>
          <div onClick={() => { if (running) { setRunning(false); } else { setRunning(true); setElapsed(running ? elapsed : elapsed); } }}
            style={{
              width: 14, height: 28, borderRadius: '0 4px 4px 0', background: n.metal, boxShadow: n.raised,
              cursor: 'pointer', border: '1px solid ' + X.borderLight, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <div style={{ width: 3, height: 10, borderRadius: 1, background: running ? X.teal : X.textMut }} />
          </div>
          <div onClick={() => { setRunning(false); setElapsed(0); }}
            style={{
              width: 14, height: 28, borderRadius: '0 4px 4px 0', background: n.metal, boxShadow: n.raised,
              cursor: 'pointer', border: '1px solid ' + X.borderLight, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: X.textMut }} />
          </div>
        </div>
      </div>

      {/* Elapsed display */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 8 }}>
        <div style={{ textAlign: 'center' }}>
          <Lbl style={{ marginBottom: 2 }}>Hours</Lbl>
          <M style={{ fontSize: 16, fontWeight: 800, color: X.amber }}>{String(dHr).padStart(2, '0')}</M>
        </div>
        <M style={{ fontSize: 16, fontWeight: 800, color: X.textMut, alignSelf: 'flex-end' }}>:</M>
        <div style={{ textAlign: 'center' }}>
          <Lbl style={{ marginBottom: 2 }}>Minutes</Lbl>
          <M style={{ fontSize: 16, fontWeight: 800, color: X.indigo }}>{String(dMin).padStart(2, '0')}</M>
        </div>
        <M style={{ fontSize: 16, fontWeight: 800, color: X.textMut, alignSelf: 'flex-end' }}>:</M>
        <div style={{ textAlign: 'center' }}>
          <Lbl style={{ marginBottom: 2 }}>Seconds</Lbl>
          <M style={{ fontSize: 16, fontWeight: 800, color: X.red }}>{String(dSec).padStart(2, '0')}</M>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        <Btn onClick={() => { setRunning(!running); }} color={running ? X.amber : X.teal} small>{running ? 'Stop' : 'Start'}</Btn>
        <Btn onClick={() => { setRunning(false); setElapsed(0); }} color={X.textMut} small ghost>Reset</Btn>
      </div>
    </Card>
  );
}

// ── Moon Phase ────────────────────────────────────────────────────
export function MoonPhase({ title = 'Moon Phase', day = 14 }: { title?: string; day?: number } = {}) {
  const X = getX();
  const n = neo();
  const liveDay = useLive(day, 1, 5000);
  const currentDay = Math.max(0, Math.min(29.5, liveDay));

  const phaseNames = [
    'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
    'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent',
  ];

  const phaseIndex = Math.floor((currentDay / 29.5) * 8) % 8;
  const phaseName = phaseNames[phaseIndex];
  const discRotation = (currentDay / 29.5) * 360;
  const illumination = Math.round((1 - Math.cos(currentDay / 29.5 * 2 * Math.PI)) / 2 * 100);

  return (
    <Card style={{ width: 350 }} glow="#ffd700">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color="#ffd700">Day {currentDay.toFixed(1)}</Badge>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        {/* Outer case */}
        <div style={{ width: 180, height: 100, borderRadius: '90px 90px 10px 10px', background: n.metal, boxShadow: n.bezel, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {/* Moon window */}
          <div style={{ width: 160, height: 80, borderRadius: '80px 80px 6px 6px', overflow: 'hidden', position: 'relative', background: '#0a0e1a' }}>
            {/* Rotating disc with moons and stars */}
            <div style={{
              position: 'absolute', width: 320, height: 320, top: -120, left: -80,
              transform: 'rotate(' + discRotation + 'deg)',
              transition: 'transform 800ms ' + ease.sp,
            }}>
              <svg viewBox="0 0 320 320" style={{ width: '100%', height: '100%' }}>
                {/* Stars */}
                {Array.from({ length: 60 }, (_, i) => {
                  const sx = 20 + (i * 47) % 280;
                  const sy = 20 + (i * 73) % 280;
                  const r = 0.3 + (i % 3) * 0.3;
                  return <circle key={'star' + i} cx={sx} cy={sy} r={r} fill="#ffffff" opacity={0.3 + (i % 4) * 0.15} />;
                })}
                {/* Two gold moons on opposite sides */}
                <circle cx="160" cy="40" r="22" fill="#ffd700" />
                <circle cx="160" cy="280" r="22" fill="#ffd700" />
                {/* Moon craters on first */}
                <circle cx="152" cy="35" r="3" fill="#e6c200" opacity="0.5" />
                <circle cx="168" cy="42" r="2" fill="#e6c200" opacity="0.4" />
                <circle cx="158" cy="48" r="1.5" fill="#e6c200" opacity="0.3" />
                {/* Moon craters on second */}
                <circle cx="152" cy="275" r="3" fill="#e6c200" opacity="0.5" />
                <circle cx="168" cy="282" r="2" fill="#e6c200" opacity="0.4" />
              </svg>
            </div>

            {/* Glass refraction overlay */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 'inherit',
              background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, #4488ff08 60%, #ffaa0008 100%)',
              pointerEvents: 'none',
            }} />
            {/* Glass highlight */}
            <div style={{
              position: 'absolute', top: 2, left: '20%', right: '20%', height: 12,
              borderRadius: '50%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
              pointerEvents: 'none',
            }} />
          </div>
        </div>
      </div>

      {/* Phase info */}
      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <M style={{ fontSize: 16, fontWeight: 800, color: '#ffd700', display: 'block', marginBottom: 4 }}>{phaseName}</M>
        <M style={{ fontSize: 10, color: X.textMut }}>{illumination}% illuminated</M>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Lunar Day</Lbl>
          <M style={{ fontSize: 10, fontWeight: 700, color: X.text }}>{currentDay.toFixed(1)}</M>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Lbl style={{ marginBottom: 2 }}>Phase</Lbl>
          <M style={{ fontSize: 10, fontWeight: 700, color: '#ffd700' }}>{phaseIndex + 1}/8</M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>Cycle</Lbl>
          <M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>29.5 days</M>
        </div>
      </div>
    </Card>
  );
}

// ── Power Reserve ─────────────────────────────────────────────────
export function PowerReserve({ title = 'Power Reserve', hours = 72 }: { title?: string; hours?: number } = {}) {
  const X = getX();
  const n = neo();
  const liveHours = useLive(48, 3, 3000);
  const reserve = Math.max(0, Math.min(hours, liveHours));
  const pct = reserve / hours;
  const animPct = useAnim(pct * 100);
  const sweepAngle = (animPct / 100) * 180;
  const c = pct > 0.5 ? X.teal : pct > 0.25 ? X.amber : X.red;

  // Archimedean spiral path
  const spiralPoints = (() => {
    const pts: string[] = [];
    const turns = 5;
    const maxR = 22;
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * turns * 2 * Math.PI;
      const r = (i / steps) * maxR;
      const x = 50 + r * Math.cos(t);
      const y = 70 + r * Math.sin(t);
      pts.push((i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1));
    }
    return pts.join(' ');
  })();

  const spiralLength = 400;
  const springOffset = spiralLength * (1 - pct);

  return (
    <Card style={{ width: 350 }} glow={c}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={c}>{reserve.toFixed(0)}h / {hours}h</Badge>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <div style={{ width: 200, height: 200, borderRadius: '50%', background: n.metal, boxShadow: n.bezel, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 180, height: 180, borderRadius: '50%', background: X.bg, boxShadow: n.concave, position: 'relative' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              {/* Retrograde arc background */}
              <path d="M 15 45 A 35 35 0 0 1 85 45" fill="none" stroke={X.borderLight} strokeWidth="3" strokeLinecap="round" />

              {/* Arc colored fill */}
              <path d="M 15 45 A 35 35 0 0 1 85 45" fill="none" stroke={c} strokeWidth="3" strokeLinecap="round"
                strokeDasharray={110} strokeDashoffset={110 - (animPct / 100) * 110}
                style={{ transition: 'stroke-dashoffset 600ms ' + ease.sp + ', stroke 400ms', filter: 'drop-shadow(0 0 3px ' + c + '50)' }} />

              {/* Arc tick marks */}
              {Array.from({ length: 9 }, (_, i) => {
                const a = (180 + i * 22.5) * Math.PI / 180;
                const x1 = 50 + 32 * Math.cos(a);
                const y1 = 45 + 32 * Math.sin(a);
                const x2 = 50 + 35 * Math.cos(a);
                const y2 = 45 + 35 * Math.sin(a);
                return <line key={'at' + i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={X.textMut} strokeWidth="0.5" />;
              })}

              {/* Needle */}
              {(() => {
                const needleAngle = 180 + sweepAngle;
                const rad = needleAngle * Math.PI / 180;
                const nx = 50 + 30 * Math.cos(rad);
                const ny = 45 + 30 * Math.sin(rad);
                return <line x1="50" y1="45" x2={nx} y2={ny} stroke={c} strokeWidth="1.2" strokeLinecap="round"
                  style={{ transition: 'x2 600ms ' + ease.sp + ', y2 600ms ' + ease.sp, filter: 'drop-shadow(0 0 2px ' + c + '60)' }} />;
              })()}
              <circle cx="50" cy="45" r="2" fill={X.surface} stroke={c} strokeWidth="0.5" />

              {/* Labels on arc */}
              <text x="18" y="40" fontFamily={X.m} fontSize="4" fill={X.textMut} textAnchor="middle">E</text>
              <text x="82" y="40" fontFamily={X.m} fontSize="4" fill={X.textMut} textAnchor="middle">F</text>

              {/* Mainspring spiral */}
              <path d={spiralPoints} fill="none" stroke={c} strokeWidth="0.8" strokeLinecap="round"
                strokeDasharray={spiralLength} strokeDashoffset={springOffset}
                style={{ transition: 'stroke-dashoffset 800ms ' + ease.sp + ', stroke 400ms', opacity: 0.6 }} />

              {/* Center text */}
              <text x="50" y="55" textAnchor="middle" fontFamily={X.m} fontSize="4" fill={X.textMut}>RESERVE</text>
            </svg>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Remaining</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: c }}>{reserve.toFixed(0)}<span style={{ fontSize: 9, color: X.textMut }}> hrs</span></M>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Lbl style={{ marginBottom: 2 }}>Capacity</Lbl>
          <M style={{ fontSize: 10, fontWeight: 700, color: X.text }}>{hours}h</M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>Level</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: c }}>{Math.round(pct * 100)}%</M>
        </div>
      </div>
    </Card>
  );
}

// ── Tourbillon Cage ───────────────────────────────────────────────
export function TourbillonCage({ title = 'Tourbillon' }: { title?: string } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(50);
  const cageAngle = tick * 3;
  const balanceAngle = Math.sin(tick * 0.3) * 30;
  const gearAngle = -(tick * 6);
  const oscillationRate = useLive(28800, 200, 2000);

  // Gear teeth path for outer cage
  const gearTeeth = (() => {
    const teeth = 24;
    const innerR = 38;
    const outerR = 42;
    const pts: string[] = [];
    for (let i = 0; i < teeth; i++) {
      const a1 = (i / teeth) * 360;
      const a2 = a1 + (360 / teeth) * 0.3;
      const a3 = a1 + (360 / teeth) * 0.5;
      const a4 = a1 + (360 / teeth) * 0.7;
      const toRad = (a: number) => a * Math.PI / 180;
      const p = (r: number, a: number) => (50 + r * Math.cos(toRad(a))).toFixed(1) + ' ' + (50 + r * Math.sin(toRad(a))).toFixed(1);
      pts.push((i === 0 ? 'M' : 'L') + p(innerR, a1));
      pts.push('L' + p(outerR, a2));
      pts.push('L' + p(outerR, a3));
      pts.push('L' + p(innerR, a4));
    }
    return pts.join(' ') + ' Z';
  })();

  // Small interlocking gear
  const smallGearTeeth = (() => {
    const teeth = 12;
    const innerR = 8;
    const outerR = 11;
    const cx = 72;
    const cy = 50;
    const pts: string[] = [];
    for (let i = 0; i < teeth; i++) {
      const a1 = (i / teeth) * 360;
      const a2 = a1 + (360 / teeth) * 0.3;
      const a3 = a1 + (360 / teeth) * 0.5;
      const a4 = a1 + (360 / teeth) * 0.7;
      const toRad = (a: number) => a * Math.PI / 180;
      const p = (r: number, a: number) => (cx + r * Math.cos(toRad(a))).toFixed(1) + ' ' + (cy + r * Math.sin(toRad(a))).toFixed(1);
      pts.push((i === 0 ? 'M' : 'L') + p(innerR, a1));
      pts.push('L' + p(outerR, a2));
      pts.push('L' + p(outerR, a3));
      pts.push('L' + p(innerR, a4));
    }
    return pts.join(' ') + ' Z';
  })();

  return (
    <Card style={{ width: 350 }} glow={X.amber}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.amber} solid>Active</Badge>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <div style={{ width: 200, height: 200, borderRadius: '50%', background: n.metal, boxShadow: n.bezel, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 180, height: 180, borderRadius: '50%', background: X.bg, boxShadow: n.concave, position: 'relative', overflow: 'hidden' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              {/* Rotating cage group */}
              <g transform={'rotate(' + cageAngle + ' 50 50)'}>
                {/* Outer cage with gear teeth */}
                <path d={gearTeeth} fill="none" stroke={X.amber} strokeWidth="0.6" opacity="0.7" />
                <circle cx="50" cy="50" r="36" fill="none" stroke={X.amber} strokeWidth="0.8" opacity="0.5" />

                {/* Y-shaped bridge */}
                <line x1="50" y1="16" x2="50" y2="50" stroke={X.text} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                <line x1="50" y1="50" x2="32" y2="72" stroke={X.text} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
                <line x1="50" y1="50" x2="68" y2="72" stroke={X.text} strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

                {/* Bridge jewels */}
                <circle cx="50" cy="16" r="1.5" fill={X.red} opacity="0.7" />
                <circle cx="32" cy="72" r="1.5" fill={X.red} opacity="0.7" />
                <circle cx="68" cy="72" r="1.5" fill={X.red} opacity="0.7" />

                {/* Balance wheel - oscillating inside cage */}
                <g transform={'rotate(' + balanceAngle + ' 50 50)'}>
                  <circle cx="50" cy="50" r="18" fill="none" stroke={X.teal} strokeWidth="0.8"
                    style={{ filter: 'drop-shadow(0 0 2px ' + X.teal + '40)' }} />
                  {/* Rim weights */}
                  <circle cx="50" cy="32" r="2" fill={X.teal} opacity="0.8" />
                  <circle cx="68" cy="50" r="2" fill={X.teal} opacity="0.8" />
                  <circle cx="50" cy="68" r="2" fill={X.teal} opacity="0.8" />
                  <circle cx="32" cy="50" r="2" fill={X.teal} opacity="0.8" />
                  {/* Spokes */}
                  <line x1="50" y1="32" x2="50" y2="68" stroke={X.teal} strokeWidth="0.5" opacity="0.5" />
                  <line x1="32" y1="50" x2="68" y2="50" stroke={X.teal} strokeWidth="0.5" opacity="0.5" />
                  {/* Center */}
                  <circle cx="50" cy="50" r="2.5" fill={X.surface} stroke={X.teal} strokeWidth="0.5" />
                </g>
              </g>

              {/* Interlocking small gear - rotates opposite at 2x speed */}
              <g transform={'rotate(' + gearAngle + ' 72 50)'}>
                <path d={smallGearTeeth} fill="none" stroke={X.indigo} strokeWidth="0.5" opacity="0.6" />
                <circle cx="72" cy="50" r="6" fill="none" stroke={X.indigo} strokeWidth="0.4" opacity="0.5" />
                <circle cx="72" cy="50" r="1.5" fill={X.surface} stroke={X.indigo} strokeWidth="0.4" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Oscillation</Lbl>
          <M style={{ fontSize: 10, fontWeight: 700, color: X.amber }}>{Math.round(oscillationRate).toLocaleString()}<span style={{ fontSize: 7, color: X.textMut }}> vph</span></M>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Lbl style={{ marginBottom: 2 }}>Frequency</Lbl>
          <M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>{(oscillationRate / 3600).toFixed(1)}<span style={{ fontSize: 7, color: X.textMut }}> Hz</span></M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>Rotation</Lbl>
          <M style={{ fontSize: 10, fontWeight: 700, color: X.indigo }}>60<span style={{ fontSize: 7, color: X.textMut }}> sec</span></M>
        </div>
      </div>
    </Card>
  );
}

// ── Date Wheel ────────────────────────────────────────────────────
export function DateWheel({ title = 'Date', currentDate = 15 }: { title?: string; currentDate?: number } = {}) {
  const X = getX();
  const n = neo();
  const liveDateRaw = useLive(currentDate, 2, 8000);
  const [manualDate, setManualDate] = useState<number | null>(null);
  const liveDate = manualDate !== null ? manualDate : Math.max(1, Math.min(31, Math.round(liveDateRaw)));

  const dates = Array.from({ length: 31 }, (_, i) => i + 1);
  const dateHeight = 28;
  const visibleDates = 5;
  const offset = (liveDate - 1) * dateHeight;

  const handleAdvance = () => {
    const next = liveDate >= 31 ? 1 : liveDate + 1;
    setManualDate(next);
    setTimeout(() => setManualDate(null), 2000);
  };

  return (
    <Card style={{ width: 350 }} glow={X.indigo}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>Day {liveDate}</Badge>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        <div style={{ width: 180, height: 180, borderRadius: '50%', background: n.metal, boxShadow: n.bezel, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 160, height: 160, borderRadius: '50%', background: X.bg, boxShadow: n.concave, position: 'relative', overflow: 'hidden' }}>
            {/* Date disc background */}
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              {/* Decorative dial elements */}
              <circle cx="50" cy="50" r="46" fill="none" stroke={X.borderLight} strokeWidth="0.3" />
              {Array.from({ length: 60 }, (_, i) => {
                const a = (i * 6) * Math.PI / 180;
                const r1 = 43;
                const r2 = 45;
                return <line key={'dt' + i} x1={50 + r1 * Math.sin(a)} y1={50 - r1 * Math.cos(a)}
                  x2={50 + r2 * Math.sin(a)} y2={50 - r2 * Math.cos(a)}
                  stroke={X.textMut} strokeWidth="0.2" />;
              })}
              <text x="50" y="30" textAnchor="middle" fontFamily={X.m} fontSize="4" fill={X.textMut}>DATE</text>
            </svg>

            {/* Cyclops magnifying window at 3 o'clock */}
            <div style={{
              position: 'absolute', top: '50%', right: 12, transform: 'translateY(-50%)',
              width: 44, height: 34, borderRadius: 6, overflow: 'hidden',
              border: '1px solid ' + X.borderLight,
              boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.3), inset -2px 0 4px rgba(0,0,0,0.3), 0 0 8px ' + X.bg + '80',
            }}>
              {/* Date disc behind window */}
              <div style={{
                position: 'absolute', left: 0, right: 0,
                top: -(offset - (visibleDates / 2 - 0.5) * dateHeight),
                transition: 'top 400ms ' + ease.sp,
              }}>
                {dates.map(d => (
                  <div key={d} style={{
                    height: dateHeight, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: X.m, fontSize: 18, fontWeight: 800,
                    color: d === liveDate ? X.text : X.textMut + '60',
                    transform: d === liveDate ? 'scale(1.5)' : 'scale(1)',
                    transition: 'transform 300ms ' + ease.sp + ', color 300ms',
                  }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Glass convex overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.06) 0%, transparent 60%)',
                pointerEvents: 'none',
              }} />

              {/* Curvature shadow at edges */}
              <div style={{
                position: 'absolute', inset: 0,
                boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.4), inset 0 -4px 6px rgba(0,0,0,0.4)',
                pointerEvents: 'none', borderRadius: 'inherit',
              }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <Btn onClick={handleAdvance} color={X.indigo} small>Advance Date</Btn>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Current</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: X.indigo }}>{liveDate}</M>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Lbl style={{ marginBottom: 2 }}>Month</Lbl>
          <M style={{ fontSize: 10, fontWeight: 700, color: X.text }}>1-31</M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>Type</Lbl>
          <M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>Quick-Set</M>
        </div>
      </div>
    </Card>
  );
}

// ── Balance Wheel ─────────────────────────────────────────────────
export function BalanceWheel({ title = 'Balance Wheel', frequency = 28800 }: { title?: string; frequency?: number } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(30);
  const currentAngle = Math.sin(tick * 2) * 180;
  const liveFreq = useLive(frequency, 100, 2000);
  const amplitude = useLive(300, 8, 1500);

  // Trail angles for persistence-of-vision
  const trailOpacities = [0.4, 0.25, 0.15, 0.08, 0.03];
  const trailAngles = trailOpacities.map((_, i) => {
    return Math.sin((tick - (i + 1) * 2) * 2) * 180;
  });

  // Hairspring spiral path
  const hairspring = (() => {
    const pts: string[] = [];
    const turns = 6;
    const steps = 150;
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * turns * 2 * Math.PI;
      const r = 3 + (i / steps) * 14;
      const x = 50 + r * Math.cos(t);
      const y = 50 + r * Math.sin(t);
      pts.push((i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1));
    }
    return pts.join(' ');
  })();

  const renderWheel = (angle: number, opacity: number, isMain: boolean) => (
    <g transform={'rotate(' + angle + ' 50 50)'} opacity={opacity} key={'wheel-' + opacity}>
      {/* Main wheel circle */}
      <circle cx="50" cy="50" r="24" fill="none" stroke={isMain ? X.teal : X.teal} strokeWidth={isMain ? 1 : 0.5} />

      {/* 4 spokes */}
      <line x1="50" y1="26" x2="50" y2="74" stroke={isMain ? X.teal : X.teal} strokeWidth={isMain ? 0.8 : 0.4} />
      <line x1="26" y1="50" x2="74" y2="50" stroke={isMain ? X.teal : X.teal} strokeWidth={isMain ? 0.8 : 0.4} />

      {/* Rim weights */}
      <circle cx="50" cy="26" r={isMain ? 2.5 : 1.5} fill={isMain ? X.amber : X.amber} />
      <circle cx="74" cy="50" r={isMain ? 2.5 : 1.5} fill={isMain ? X.amber : X.amber} />
      <circle cx="50" cy="74" r={isMain ? 2.5 : 1.5} fill={isMain ? X.amber : X.amber} />
      <circle cx="26" cy="50" r={isMain ? 2.5 : 1.5} fill={isMain ? X.amber : X.amber} />
    </g>
  );

  return (
    <Card style={{ width: 350 }} glow={X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal} solid>Oscillating</Badge>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
        <div style={{ width: 200, height: 200, borderRadius: '50%', background: n.metal, boxShadow: n.bezel, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 180, height: 180, borderRadius: '50%', background: X.bg, boxShadow: n.concave, position: 'relative', overflow: 'hidden' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
              {/* Hairspring spiral */}
              <path d={hairspring} fill="none" stroke={X.purple} strokeWidth="0.4" opacity="0.5"
                style={{ filter: 'drop-shadow(0 0 1px ' + X.purple + '40)' }} />

              {/* Persistence-of-vision trail copies (rendered first, behind main) */}
              {trailAngles.map((angle, i) => renderWheel(angle, trailOpacities[i], false))}

              {/* Main balance wheel */}
              {renderWheel(currentAngle, 1, true)}

              {/* Center jewel */}
              <circle cx="50" cy="50" r="3" fill={X.surface} stroke={X.teal} strokeWidth="0.6" />
              <circle cx="50" cy="50" r="1.2" fill={X.red} opacity="0.8" />

              {/* Outer reference markers */}
              {Array.from({ length: 8 }, (_, i) => {
                const a = (i * 45) * Math.PI / 180;
                const x1 = 50 + 42 * Math.cos(a);
                const y1 = 50 + 42 * Math.sin(a);
                const x2 = 50 + 45 * Math.cos(a);
                const y2 = 50 + 45 * Math.sin(a);
                return <line key={'rm' + i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={X.textMut} strokeWidth="0.5" />;
              })}
            </svg>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Frequency</Lbl>
          <M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>{Math.round(liveFreq).toLocaleString()}<span style={{ fontSize: 7, color: X.textMut }}> bph</span></M>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Lbl style={{ marginBottom: 2 }}>Amplitude</Lbl>
          <M style={{ fontSize: 10, fontWeight: 700, color: X.amber }}>{Math.round(amplitude)}<span style={{ fontSize: 7, color: X.textMut }}>&deg;</span></M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>Hz</Lbl>
          <M style={{ fontSize: 10, fontWeight: 700, color: X.purple }}>{(liveFreq / 3600).toFixed(1)}</M>
        </div>
      </div>
    </Card>
  );
}
