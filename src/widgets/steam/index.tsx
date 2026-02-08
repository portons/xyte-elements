import { useState } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { useTick } from '../hooks';

function neo() { const X = getX(); const dark = X.bg + '40'; const light = '#ffffff12'; return { raised: '4px 4px 10px ' + dark + ', -2px -2px 6px ' + light, concave: 'inset 3px 3px 8px ' + dark + ', inset -2px -2px 5px ' + light, bezel: 'inset 0 1px 0 ' + light + ', inset 0 -1px 0 rgba(0,0,0,0.3), 0 2px 8px ' + dark, metal: 'linear-gradient(135deg, ' + X.surface + ', ' + X.bgAlt + ' 40%, ' + X.surface + ' 60%, ' + X.bgAlt + ')' }; }

// ── Boiler Pressure ─────────────────────────────────────────────────
export function BoilerPressure({ title = 'Boiler Pressure', maxPSI = 200, psi }: {
  title?: string; maxPSI?: number; psi: number;
}) {
  const X = getX();
  const n = neo();
  const tick = useTick(80);
  const psiPct = Math.min(psi / maxPSI, 1);
  const highPressure = psiPct > 0.8;

  const cx = 100, cy = 100, r = 70;
  const startAngle = -225, endAngle = 45;
  const needleAngle = startAngle + psiPct * (endAngle - startAngle);
  const needleRad = (needleAngle * Math.PI) / 180;

  // Steam puff particles
  const puffs = highPressure ? Array.from({ length: 5 }, (_, i) => {
    const seed = (tick + i * 7) % 40;
    const progress = seed / 40;
    const xOff = Math.sin((i * 2.3 + tick * 0.3) * 0.5) * 12;
    return { x: cx + xOff, y: cy - r - 10 - progress * 35, opacity: 1 - progress, size: 3 + progress * 4 };
  }) : [];

  // Tick marks
  const ticks = Array.from({ length: 11 }, (_, i) => {
    const frac = i / 10;
    const ang = ((startAngle + frac * (endAngle - startAngle)) * Math.PI) / 180;
    const x1 = cx + (r - 6) * Math.cos(ang);
    const y1 = cy + (r - 6) * Math.sin(ang);
    const x2 = cx + (r - 14) * Math.cos(ang);
    const y2 = cy + (r - 14) * Math.sin(ang);
    const lx = cx + (r - 22) * Math.cos(ang);
    const ly = cy + (r - 22) * Math.sin(ang);
    return { x1, y1, x2, y2, lx, ly, label: Math.round(frac * maxPSI) };
  });

  // Rivets
  const rivets = Array.from({ length: 8 }, (_, i) => {
    const ang = (i / 8) * Math.PI * 2;
    return { x: cx + (r + 12) * Math.cos(ang), y: cy + (r + 12) * Math.sin(ang) };
  });

  return (
    <Card style={{ width: 350 }} glow={highPressure ? X.red : X.amber}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={highPressure ? X.red : X.teal}>{Math.round(psi)} PSI</Badge>
      </div>
      <svg viewBox="0 0 200 200" style={{ display: 'block', width: '100%', height: 180 }}>
        <defs>
          <radialGradient id="steam-rivet-grad">
            <stop offset="0%" stopColor="#ffffff" stopOpacity=".6" />
            <stop offset="50%" stopColor="#aaaaaa" stopOpacity=".4" />
            <stop offset="100%" stopColor="#666666" stopOpacity=".8" />
          </radialGradient>
          <radialGradient id="steam-gauge-face">
            <stop offset="0%" stopColor="#f5f0e0" />
            <stop offset="80%" stopColor="#e8dfc8" />
            <stop offset="100%" stopColor="#d4c9a8" />
          </radialGradient>
        </defs>
        {/* Metallic bezel */}
        <circle cx={cx} cy={cy} r={r + 18} fill="none" stroke={X.textMut} strokeWidth="8"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
        <circle cx={cx} cy={cy} r={r + 14} fill="none" stroke={X.border} strokeWidth="2" />
        {/* Rivets */}
        {rivets.map((rv, i) => (
          <circle key={i} cx={rv.x} cy={rv.y} r={4} fill="url(#steam-rivet-grad)" stroke={X.textMut + '60'} strokeWidth=".5" />
        ))}
        {/* Gauge face */}
        <circle cx={cx} cy={cy} r={r - 2} fill="url(#steam-gauge-face)" />
        {/* Tick marks */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#444" strokeWidth={i % 5 === 0 ? 2 : 1} />
            {i % 2 === 0 && (
              <text x={t.lx} y={t.ly + 3} textAnchor="middle" fontSize="7" fontWeight="700" fill="#555" fontFamily="monospace">{t.label}</text>
            )}
          </g>
        ))}
        {/* Danger zone arc */}
        {(() => {
          const dangerStart = ((startAngle + 0.8 * (endAngle - startAngle)) * Math.PI) / 180;
          const dangerEnd = (endAngle * Math.PI) / 180;
          const x1 = cx + (r - 8) * Math.cos(dangerStart);
          const y1 = cy + (r - 8) * Math.sin(dangerStart);
          const x2 = cx + (r - 8) * Math.cos(dangerEnd);
          const y2 = cy + (r - 8) * Math.sin(dangerEnd);
          return <path d={`M ${x1} ${y1} A ${r - 8} ${r - 8} 0 0 1 ${x2} ${y2}`} fill="none" stroke="#cc3333" strokeWidth="3" opacity=".5" />;
        })()}
        {/* Needle */}
        <line
          x1={cx - 8 * Math.cos(needleRad)} y1={cy - 8 * Math.sin(needleRad)}
          x2={cx + (r - 18) * Math.cos(needleRad)} y2={cy + (r - 18) * Math.sin(needleRad)}
          stroke={highPressure ? '#cc3333' : '#333'} strokeWidth="2.5" strokeLinecap="round"
          style={{ transition: `x2 500ms ${ease.sp}, y2 500ms ${ease.sp}, x1 500ms ${ease.sp}, y1 500ms ${ease.sp}` }}
        />
        {/* Center cap */}
        <circle cx={cx} cy={cy} r={6} fill="#555" stroke="#333" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={3} fill="#888" />
        {/* Steam puffs */}
        {puffs.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.size} fill={X.textMut} opacity={p.opacity * 0.5}
            style={{ transition: 'cx 80ms linear, cy 80ms linear, opacity 80ms linear' }} />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <div><Lbl style={{ marginBottom: 2 }}>Pressure</Lbl><M style={{ fontSize: 16, fontWeight: 800, color: highPressure ? X.red : X.teal }}>{psi.toFixed(1)} <span style={{ fontSize: 8, color: X.textMut }}>PSI</span></M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Max Rated</Lbl><M style={{ fontSize: 12, fontWeight: 700, color: X.textSec }}>{maxPSI} PSI</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Status</Lbl><M style={{ fontSize: 12, fontWeight: 700, color: highPressure ? X.red : X.teal }}>{highPressure ? 'HIGH' : 'Normal'}</M></div>
      </div>
      <Prog value={psiPct * 100} color={highPressure ? X.red : X.teal} h={3} style={{ marginTop: 6 }} />
    </Card>
  );
}

// ── Steam Valve ─────────────────────────────────────────────────────
export function SteamValve({ title = 'Steam Valve', flow }: {
  title?: string; flow: number;
}) {
  const X = getX();
  const n = neo();
  const [angle, setAngle] = useState(0);
  const tick = useTick(60);
  const valveOpen = Math.min(100, (angle % 360) / 3.6);
  const dashOffset = -(tick * 2);

  const spokeCount = 8;
  const wheelCx = 100, wheelCy = 60, wheelR = 28, hubR = 8;

  return (
    <Card style={{ width: 350 }} glow={X.amber}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={valveOpen > 50 ? X.teal : X.amber}>{Math.round(valveOpen)}% Open</Badge>
      </div>
      <svg viewBox="0 0 200 130" style={{ display: 'block', width: '100%', height: 130, cursor: 'pointer' }}
        onClick={() => setAngle(prev => prev + 45)}>
        {/* Pipe left */}
        <rect x="0" y="50" width="70" height="20" rx="2" fill={X.bgAlt} stroke={X.border} strokeWidth="1.5" />
        {/* Bolted flange left */}
        <rect x="62" y="44" width="12" height="32" rx="2" fill={X.surface} stroke={X.textMut} strokeWidth="1" />
        {[48, 56, 64, 72].map((yy, i) => (
          <circle key={'bl' + i} cx="68" cy={yy} r="2" fill={X.textMut + '80'} stroke={X.border} strokeWidth=".5" />
        ))}
        {/* Pipe right */}
        <rect x="130" y="50" width="70" height="20" rx="2" fill={X.bgAlt} stroke={X.border} strokeWidth="1.5" />
        {/* Bolted flange right */}
        <rect x="126" y="44" width="12" height="32" rx="2" fill={X.surface} stroke={X.textMut} strokeWidth="1" />
        {[48, 56, 64, 72].map((yy, i) => (
          <circle key={'br' + i} cx="132" cy={yy} r="2" fill={X.textMut + '80'} stroke={X.border} strokeWidth=".5" />
        ))}
        {/* Valve body */}
        <rect x="74" y="46" width="52" height="28" rx="3" fill={X.surface} stroke={X.textMut} strokeWidth="1.5" />
        {/* Stem */}
        <rect x="96" y="20" width="8" height="26" rx="2" fill={X.textMut} stroke={X.border} strokeWidth=".5" />
        {/* Handwheel group - rotates on click */}
        <g transform={`rotate(${angle} ${wheelCx} ${wheelCy})`} style={{ transition: `transform 400ms ${ease.sp}` }}>
          {/* Rim */}
          <circle cx={wheelCx} cy={wheelCy} r={wheelR} fill="none" stroke={X.text} strokeWidth="4" />
          {/* Spokes */}
          {Array.from({ length: spokeCount }, (_, i) => {
            const a = (i / spokeCount) * Math.PI * 2;
            return <line key={i} x1={wheelCx + hubR * Math.cos(a)} y1={wheelCy + hubR * Math.sin(a)}
              x2={wheelCx + (wheelR - 2) * Math.cos(a)} y2={wheelCy + (wheelR - 2) * Math.sin(a)}
              stroke={X.text} strokeWidth="2" strokeLinecap="round" />;
          })}
          {/* Hub */}
          <circle cx={wheelCx} cy={wheelCy} r={hubR} fill={X.surface} stroke={X.text} strokeWidth="2" />
          <circle cx={wheelCx} cy={wheelCy} r={3} fill={X.textMut} />
        </g>
        {/* Flow dashes through pipe */}
        {valveOpen > 5 && (
          <>
            <line x1="10" y1="60" x2="190" y2="60" stroke={X.teal} strokeWidth="2"
              strokeDasharray="6 4" strokeDashoffset={dashOffset}
              opacity={valveOpen / 120}
              style={{ transition: 'opacity 300ms ease' }} />
          </>
        )}
        {/* Click hint */}
        <text x={wheelCx} y={wheelCy + wheelR + 16} textAnchor="middle" fontSize="7" fill={X.textMut} fontFamily={X.m}>Click to turn</text>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <div><Lbl style={{ marginBottom: 2 }}>Flow Rate</Lbl><M style={{ fontSize: 14, fontWeight: 800, color: X.teal }}>{Math.round(flow * (valveOpen / 100))} <span style={{ fontSize: 8, color: X.textMut }}>kg/hr</span></M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Valve Pos</Lbl><M style={{ fontSize: 14, fontWeight: 800, color: X.amber }}>{Math.round(valveOpen)}%</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Turns</Lbl><M style={{ fontSize: 14, fontWeight: 700, color: X.textSec }}>{Math.round(angle / 45)}</M></div>
      </div>
      <Prog value={valveOpen} color={valveOpen > 50 ? X.teal : X.amber} h={3} style={{ marginTop: 6 }} />
    </Card>
  );
}

// ── Flywheel ────────────────────────────────────────────────────────
export function Flywheel({ title = 'Flywheel' }: {
  title?: string;
} = {}) {
  const X = getX();
  const n = neo();
  const maxRPM = 3000;
  const [rpm, setRpm] = useState(0);
  const [running, setRunning] = useState(false);
  const tick = useTick(30);
  const [rotation, setRotation] = useState(0);

  // Physics: accelerate when running, decelerate with momentum decay
  useState(() => { /* init */ });
  const prevTick = useState({ v: tick })[0];
  if (tick !== prevTick.v) {
    prevTick.v = tick;
    if (running && rpm < maxRPM) {
      const newRpm = Math.min(rpm + 40, maxRPM);
      setRpm(newRpm);
    } else if (!running && rpm > 0) {
      const newRpm = rpm * 0.98;
      setRpm(newRpm < 5 ? 0 : newRpm);
    }
    setRotation(prev => prev + rpm * 0.004);
  }

  const blurAmount = Math.min(1.5, rpm / maxRPM * 1.5);
  const kineticEnergy = 0.5 * 12 * Math.pow((rpm * 2 * Math.PI / 60), 2); // ½Iw²
  const rpmPct = rpm / maxRPM;

  const cx = 100, cy = 85, wr = 50;

  return (
    <Card style={{ width: 350 }} glow={X.purple}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={rpm > 0 ? X.teal : X.textMut}>{rpm > 0 ? 'Spinning' : 'Stopped'}</Badge>
      </div>
      <svg viewBox="0 0 200 170" style={{ display: 'block', width: '100%', height: 150 }}>
        {/* Axle mount */}
        <rect x={cx - 4} y={cy - 65} width="8" height="70" rx="2" fill={X.bgAlt} stroke={X.border} strokeWidth="1" />
        {/* Flywheel group with motion blur */}
        <g transform={`rotate(${rotation} ${cx} ${cy})`}
          style={{ filter: `blur(${blurAmount}px)`, transition: 'filter 100ms linear' }}>
          {/* Heavy rim */}
          <circle cx={cx} cy={cy} r={wr} fill="none" stroke={X.textMut} strokeWidth="10" />
          <circle cx={cx} cy={cy} r={wr + 5} fill="none" stroke={X.border} strokeWidth="1" />
          <circle cx={cx} cy={cy} r={wr - 5} fill="none" stroke={X.border} strokeWidth="1" />
          {/* Cross spokes */}
          {[0, 45, 90, 135].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            return <line key={i}
              x1={cx + 10 * Math.cos(rad)} y1={cy + 10 * Math.sin(rad)}
              x2={cx + (wr - 6) * Math.cos(rad)} y2={cy + (wr - 6) * Math.sin(rad)}
              stroke={X.textSec} strokeWidth="3" strokeLinecap="round" />;
          })}
          {[0, 45, 90, 135].map((a, i) => {
            const rad = ((a + 180) * Math.PI) / 180;
            return <line key={'b' + i}
              x1={cx + 10 * Math.cos(rad)} y1={cy + 10 * Math.sin(rad)}
              x2={cx + (wr - 6) * Math.cos(rad)} y2={cy + (wr - 6) * Math.sin(rad)}
              stroke={X.textSec} strokeWidth="3" strokeLinecap="round" />;
          })}
          {/* Center hub */}
          <circle cx={cx} cy={cy} r={10} fill={X.surface} stroke={X.textMut} strokeWidth="2" />
          <circle cx={cx} cy={cy} r={4} fill={X.textMut} />
        </g>
      </svg>
      {/* RPM gauge bar */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <Lbl>RPM</Lbl>
          <M style={{ fontSize: 10, fontWeight: 800, color: rpmPct > 0.8 ? X.red : rpmPct > 0.5 ? X.amber : X.teal }}>{Math.round(rpm)}</M>
        </div>
        <Prog value={rpmPct * 100} color={rpmPct > 0.8 ? X.red : rpmPct > 0.5 ? X.amber : X.teal} h={4} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div><Lbl style={{ marginBottom: 2 }}>Kinetic Energy</Lbl><M style={{ fontSize: 12, fontWeight: 800, color: X.purple }}>{kineticEnergy > 1000 ? (kineticEnergy / 1000).toFixed(1) + ' kJ' : Math.round(kineticEnergy) + ' J'}</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Momentum</Lbl><M style={{ fontSize: 12, fontWeight: 700, color: X.textSec }}>{running ? 'Powered' : rpm > 0 ? 'Coasting' : 'Idle'}</M></div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <Btn onClick={() => setRunning(true)} color={X.teal} small active={running}>Start</Btn>
        <Btn onClick={() => setRunning(false)} color={X.amber} small active={!running && rpm > 0}>Release</Btn>
        <Btn onClick={() => { setRunning(false); setRpm(0); }} color={X.red} small ghost>Brake</Btn>
      </div>
    </Card>
  );
}

// ── Governor ────────────────────────────────────────────────────────
export function Governor({ title = 'Governor', speed }: {
  title?: string; speed: number;
}) {
  const X = getX();
  const n = neo();
  const tick = useTick(60);

  const armAngle = 15 + (speed / 100) * 60; // degrees from vertical
  const armRad = (armAngle * Math.PI) / 180;
  const collarY = 90 - (armAngle - 15) * 0.6; // rises as balls swing out
  const estimatedRPM = Math.round(300 + speed * 15);

  const cx = 100, spindleTop = 30, spindleBot = 140;
  const armLen = 40, ballR = 7;

  // Left arm: swings left
  const leftBallX = cx - armLen * Math.sin(armRad);
  const leftBallY = collarY + armLen * Math.cos(armRad);
  // Right arm: swings right
  const rightBallX = cx + armLen * Math.sin(armRad);
  const rightBallY = collarY + armLen * Math.cos(armRad);

  // Spindle rotation hint
  const spinAngle = (tick * 6) % 360;

  return (
    <Card style={{ width: 350 }} glow={X.indigo}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={speed > 80 ? X.red : speed > 50 ? X.amber : X.teal}>{Math.round(speed)}% Speed</Badge>
      </div>
      <svg viewBox="0 0 200 160" style={{ display: 'block', width: '100%', height: 150 }}>
        {/* Base pedestal */}
        <rect x="80" y="135" width="40" height="10" rx="3" fill={X.bgAlt} stroke={X.border} strokeWidth="1" />
        <rect x="70" y="142" width="60" height="6" rx="2" fill={X.surface} stroke={X.border} strokeWidth="1" />
        {/* Vertical spindle */}
        <line x1={cx} y1={spindleTop} x2={cx} y2={spindleBot} stroke={X.textMut} strokeWidth="4" strokeLinecap="round" />
        {/* Rotation marks on spindle */}
        {[0, 1, 2].map((_, i) => {
          const sy = spindleTop + 10 + i * 12;
          const rotX = Math.sin(((spinAngle + i * 120) * Math.PI) / 180) * 2;
          return <ellipse key={i} cx={cx + rotX} cy={sy} rx="3" ry="1" fill={X.text + '40'} />;
        })}
        {/* Throttle collar */}
        <rect x={cx - 8} y={collarY - 4} width="16" height="8" rx="2" fill={X.amber} stroke={X.amber + '80'} strokeWidth="1"
          style={{ transition: `y 500ms ${ease.sp}` }} />
        {/* Left arm */}
        <line x1={cx} y1={collarY} x2={leftBallX} y2={leftBallY} stroke={X.textSec} strokeWidth="2.5" strokeLinecap="round"
          style={{ transition: `x2 500ms ${ease.sp}, y2 500ms ${ease.sp}` }} />
        {/* Left ball */}
        <circle cx={leftBallX} cy={leftBallY} r={ballR} fill={X.textMut} stroke={X.text} strokeWidth="1.5"
          style={{ transition: `cx 500ms ${ease.sp}, cy 500ms ${ease.sp}` }} />
        <circle cx={leftBallX - 2} cy={leftBallY - 2} r={2} fill="#ffffff20"
          style={{ transition: `cx 500ms ${ease.sp}, cy 500ms ${ease.sp}` }} />
        {/* Right arm */}
        <line x1={cx} y1={collarY} x2={rightBallX} y2={rightBallY} stroke={X.textSec} strokeWidth="2.5" strokeLinecap="round"
          style={{ transition: `x2 500ms ${ease.sp}, y2 500ms ${ease.sp}` }} />
        {/* Right ball */}
        <circle cx={rightBallX} cy={rightBallY} r={ballR} fill={X.textMut} stroke={X.text} strokeWidth="1.5"
          style={{ transition: `cx 500ms ${ease.sp}, cy 500ms ${ease.sp}` }} />
        <circle cx={rightBallX - 2} cy={rightBallY - 2} r={2} fill="#ffffff20"
          style={{ transition: `cx 500ms ${ease.sp}, cy 500ms ${ease.sp}` }} />
        {/* Top cap */}
        <circle cx={cx} cy={spindleTop} r={5} fill={X.surface} stroke={X.textMut} strokeWidth="1.5" />
        {/* Connecting linkages to collar */}
        <line x1={leftBallX + ballR * 0.7} y1={leftBallY - ballR * 0.7} x2={cx - 3} y2={collarY + 8} stroke={X.textMut + '80'} strokeWidth="1" strokeDasharray="2 2"
          style={{ transition: `x1 500ms ${ease.sp}, y1 500ms ${ease.sp}` }} />
        <line x1={rightBallX - ballR * 0.7} y1={rightBallY - ballR * 0.7} x2={cx + 3} y2={collarY + 8} stroke={X.textMut + '80'} strokeWidth="1" strokeDasharray="2 2"
          style={{ transition: `x1 500ms ${ease.sp}, y1 500ms ${ease.sp}` }} />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <div><Lbl style={{ marginBottom: 2 }}>RPM</Lbl><M style={{ fontSize: 16, fontWeight: 800, color: speed > 80 ? X.red : X.teal }}>{estimatedRPM}</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Throttle</Lbl><M style={{ fontSize: 14, fontWeight: 700, color: X.amber }}>{Math.round(100 - speed)}%</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Arm Angle</Lbl><M style={{ fontSize: 14, fontWeight: 700, color: X.indigo }}>{Math.round(armAngle)}&deg;</M></div>
      </div>
      <Prog value={speed} color={speed > 80 ? X.red : speed > 50 ? X.amber : X.teal} h={3} style={{ marginTop: 6 }} />
    </Card>
  );
}

// ── Piston Indicator ────────────────────────────────────────────────
export function PistonIndicator({ title = 'Piston' }: {
  title?: string;
} = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(30);
  const [rpmState] = useState(240);

  const crankRadius = 20;
  const rodLength = 55;
  const crankCx = 60, crankCy = 90;

  // Crank angle from tick
  const crankAngle = (tick * 6 * Math.PI) / 180;

  // Crank pin position
  const pinX = crankCx + crankRadius * Math.cos(crankAngle);
  const pinY = crankCy + crankRadius * Math.sin(crankAngle);

  // Piston position (crank-slider geometry)
  const pistonX = crankCx + crankRadius * Math.cos(crankAngle) + rodLength * Math.cos(Math.asin(crankRadius * Math.sin(crankAngle) / rodLength));
  const pistonY = crankCy;

  // Stroke position percentage (0 = TDC, 100 = BDC in horizontal terms)
  const strokeMin = crankCx + rodLength - crankRadius;
  const strokeMax = crankCx + rodLength + crankRadius;
  const strokePct = ((pistonX - strokeMin) / (strokeMax - strokeMin)) * 100;

  const cylLeft = strokeMin - 5;
  const cylRight = strokeMax + 20;
  const cylTop = crankCy - 20;
  const cylBot = crankCy + 20;

  return (
    <Card style={{ width: 350 }} glow={X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{rpmState} RPM</Badge>
      </div>
      <svg viewBox="0 0 200 140" style={{ display: 'block', width: '100%', height: 130 }}>
        {/* Cylinder walls */}
        <line x1={cylLeft} y1={cylTop} x2={cylRight} y2={cylTop} stroke={X.textMut} strokeWidth="2" />
        <line x1={cylLeft} y1={cylBot} x2={cylRight} y2={cylBot} stroke={X.textMut} strokeWidth="2" />
        {/* Cylinder end cap */}
        <line x1={cylRight} y1={cylTop} x2={cylRight} y2={cylBot} stroke={X.textMut} strokeWidth="3" />
        {/* Valve ports at top */}
        <rect x={cylLeft + 10} y={cylTop - 8} width="8" height="8" rx="1" fill={crankAngle % (2 * Math.PI) < Math.PI ? X.teal + '60' : X.bgAlt} stroke={X.border} strokeWidth="1" />
        <rect x={cylLeft + 25} y={cylTop - 8} width="8" height="8" rx="1" fill={crankAngle % (2 * Math.PI) >= Math.PI ? X.red + '60' : X.bgAlt} stroke={X.border} strokeWidth="1" />
        <text x={cylLeft + 14} y={cylTop - 10} textAnchor="middle" fontSize="5" fill={X.textMut} fontFamily={X.m}>IN</text>
        <text x={cylLeft + 29} y={cylTop - 10} textAnchor="middle" fontSize="5" fill={X.textMut} fontFamily={X.m}>EX</text>
        {/* Piston */}
        <rect x={pistonX - 3} y={crankCy - 16} width="12" height="32" rx="2"
          fill={X.surface} stroke={X.textMut} strokeWidth="1.5" />
        {/* Piston rings */}
        <line x1={pistonX - 1} y1={crankCy - 10} x2={pistonX + 7} y2={crankCy - 10} stroke={X.textMut} strokeWidth="1" />
        <line x1={pistonX - 1} y1={crankCy - 6} x2={pistonX + 7} y2={crankCy - 6} stroke={X.textMut} strokeWidth="1" />
        {/* Connecting rod */}
        <line x1={pinX} y1={pinY} x2={pistonX + 2} y2={pistonY} stroke={X.textSec} strokeWidth="3" strokeLinecap="round" />
        {/* Wrist pin */}
        <circle cx={pistonX + 2} cy={pistonY} r="3" fill={X.textMut} stroke={X.border} strokeWidth=".5" />
        {/* Crankshaft circle */}
        <circle cx={crankCx} cy={crankCy} r={crankRadius + 3} fill="none" stroke={X.borderLight} strokeWidth="1" strokeDasharray="3 3" />
        {/* Crank arm */}
        <line x1={crankCx} y1={crankCy} x2={pinX} y2={pinY} stroke={X.text} strokeWidth="3" strokeLinecap="round" />
        {/* Crank pin */}
        <circle cx={pinX} cy={pinY} r="4" fill={X.amber} stroke={X.text} strokeWidth="1" />
        {/* Crank center */}
        <circle cx={crankCx} cy={crankCy} r="5" fill={X.surface} stroke={X.textMut} strokeWidth="2" />
        <circle cx={crankCx} cy={crankCy} r="2" fill={X.textMut} />
        {/* Rotation arrow hint */}
        <path d={`M ${crankCx - 12} ${crankCy - crankRadius - 8} A 10 10 0 0 1 ${crankCx + 5} ${crankCy - crankRadius - 10}`}
          fill="none" stroke={X.teal + '60'} strokeWidth="1" markerEnd="none" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <div><Lbl style={{ marginBottom: 2 }}>RPM</Lbl><M style={{ fontSize: 16, fontWeight: 800, color: X.teal }}>{rpmState}</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Stroke</Lbl><M style={{ fontSize: 14, fontWeight: 700, color: X.amber }}>{Math.round(strokePct)}%</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Crank</Lbl><M style={{ fontSize: 14, fontWeight: 700, color: X.purple }}>{Math.round(((crankAngle * 180 / Math.PI) % 360))}&deg;</M></div>
      </div>
      <Prog value={strokePct} color={X.teal} h={3} style={{ marginTop: 6 }} />
    </Card>
  );
}

// ── Steam Whistle ───────────────────────────────────────────────────
export function SteamWhistle({ title = 'Steam Whistle' }: {
  title?: string;
} = {}) {
  const X = getX();
  const n = neo();
  const [active, setActive] = useState(false);
  const tick = useTick(50);

  const cx = 80, pipeTop = 30, pipeBot = 130, pipeW = 16;
  const bellMouth = 28;

  // Steam particles when active
  const particles = active ? Array.from({ length: 8 }, (_, i) => {
    const seed = (tick + i * 5) % 30;
    const progress = seed / 30;
    const xOff = (Math.sin(i * 1.7 + tick * 0.4) * 15) * progress;
    return {
      x: cx + xOff,
      y: pipeTop - 8 - progress * 50,
      r: 2 + progress * 5,
      opacity: (1 - progress) * 0.6,
    };
  }) : [];

  // Sound wave arcs when active
  const waves = active ? Array.from({ length: 3 }, (_, i) => {
    const seed = (tick + i * 10) % 30;
    const progress = seed / 30;
    const waveR = 10 + progress * 30;
    return {
      r: waveR,
      opacity: (1 - progress) * 0.4,
    };
  }) : [];

  // Chain curve (changes when pulled)
  const chainAnchorX = 130, chainTopY = 50, chainBotY = 130;
  const chainBulge = active ? 8 : 20;
  const chainPath = `M ${chainAnchorX} ${chainTopY} Q ${chainAnchorX + chainBulge} ${(chainTopY + chainBotY) / 2} ${chainAnchorX + 3} ${chainBotY}`;

  return (
    <Card style={{ width: 350 }} glow={active ? X.amber : undefined}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={active ? X.amber : X.textMut} solid={active}>{active ? 'BLOWING' : 'Silent'}</Badge>
      </div>
      <svg viewBox="0 0 180 160" style={{ display: 'block', width: '100%', height: 150 }}>
        {/* Steam pipe body */}
        <rect x={cx - pipeW / 2} y={pipeTop + 10} width={pipeW} height={pipeBot - pipeTop - 10} rx="2"
          fill={X.bgAlt} stroke={X.textMut} strokeWidth="1.5" />
        {/* Pipe highlight */}
        <rect x={cx - pipeW / 2 + 2} y={pipeTop + 12} width="3" height={pipeBot - pipeTop - 14} rx="1"
          fill="#ffffff08" />
        {/* Bell mouth at top */}
        <path d={`M ${cx - bellMouth / 2} ${pipeTop + 10} Q ${cx - bellMouth / 2 - 4} ${pipeTop} ${cx - bellMouth / 2 + 2} ${pipeTop - 5} L ${cx + bellMouth / 2 - 2} ${pipeTop - 5} Q ${cx + bellMouth / 2 + 4} ${pipeTop} ${cx + bellMouth / 2} ${pipeTop + 10} Z`}
          fill={X.surface} stroke={X.textMut} strokeWidth="1.5" />
        {/* Bell rim */}
        <ellipse cx={cx} cy={pipeTop - 5} rx={bellMouth / 2} ry="3" fill="none" stroke={X.textMut} strokeWidth="1.5" />
        {/* Mounting bracket */}
        <rect x={cx - pipeW / 2 - 6} y={pipeBot - 20} width={pipeW + 12} height="6" rx="2"
          fill={X.surface} stroke={X.border} strokeWidth="1" />
        {/* Base flange */}
        <rect x={cx - pipeW / 2 - 3} y={pipeBot} width={pipeW + 6} height="8" rx="2"
          fill={X.surface} stroke={X.textMut} strokeWidth="1" />
        {/* Chain pull */}
        <path d={chainPath} fill="none" stroke={X.amber} strokeWidth="2" strokeLinecap="round"
          style={{ transition: `d 300ms ${ease.sp}` }} />
        {/* Chain handle */}
        <circle cx={chainAnchorX + 3} cy={chainBotY + 5} r="5" fill={X.amber + '40'} stroke={X.amber} strokeWidth="1.5" />
        {/* Chain link dots */}
        {Array.from({ length: 5 }, (_, i) => {
          const t = (i + 1) / 6;
          const ly = chainTopY + t * (chainBotY - chainTopY);
          const lx = chainAnchorX + Math.sin(t * Math.PI) * (active ? 4 : chainBulge * 0.8);
          return <circle key={i} cx={lx} cy={ly} r="1.5" fill={X.amber} opacity=".6" />;
        })}
        {/* Steam particles */}
        {particles.map((p, i) => (
          <circle key={'p' + i} cx={p.x} cy={p.y} r={p.r} fill="#ffffff" opacity={p.opacity} />
        ))}
        {/* Sound wave arcs */}
        {waves.map((w, i) => (
          <path key={'w' + i}
            d={`M ${cx - w.r} ${pipeTop - 8} A ${w.r} ${w.r} 0 0 1 ${cx + w.r} ${pipeTop - 8}`}
            fill="none" stroke={X.amber} strokeWidth="1.5" opacity={w.opacity} />
        ))}
        {/* Activation zone label */}
        <text x={chainAnchorX + 3} y={chainBotY + 20} textAnchor="middle" fontSize="6" fill={X.textMut} fontFamily={X.m}>Pull chain</text>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
        <div><Lbl style={{ marginBottom: 2 }}>Status</Lbl><M style={{ fontSize: 14, fontWeight: 800, color: active ? X.amber : X.textMut }}>{active ? 'Active' : 'Idle'}</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Pressure</Lbl><M style={{ fontSize: 12, fontWeight: 700, color: X.teal }}>85 PSI</M></div>
        <Btn onClick={() => setActive(!active)} color={active ? X.red : X.amber} small>
          {active ? 'Stop' : 'Whistle'}
        </Btn>
      </div>
    </Card>
  );
}
