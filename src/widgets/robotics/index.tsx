import { useState } from 'react';
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

// ── Robot Arm Pose ───────────────────────────────────────────────────
export function RobotArmPose({ title = 'Robot Arm', joints = 6, angles }: {
  title?: string; joints?: number; angles: number[];
}) {
  const X = getX();
  const n = neo();

  const jointNames = ['Base', 'Shoulder', 'Elbow', 'Wrist 1', 'Wrist 2', 'Wrist 3', 'Tool', 'Aux'];
  const visibleJoints = jointNames.slice(0, joints);

  const statuses = ['ok', 'ok', 'ok', 'warn', 'ok', 'ok', 'ok', 'ok'];
  const statusColor = (s: string) => s === 'ok' ? X.teal : s === 'warn' ? X.amber : X.red;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}><Dot c={X.teal} pulse s={4} />{joints}J Active</Badge>
      </div>
      <div style={{
        padding: 14, borderRadius: X.rs,
        background: n.metal,
        boxShadow: n.bezel,
        marginBottom: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
          {visibleJoints.map((name, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: n.metal,
                  boxShadow: n.raised,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `1px solid ${X.border}`,
                  position: 'relative',
                }}>
                  <Dot c={statusColor(statuses[i])} pulse={statuses[i] === 'warn'} s={8} />
                  <div style={{
                    position: 'absolute', top: -2, right: -2, width: 6, height: 6,
                    borderRadius: '50%', background: statusColor(statuses[i]),
                    boxShadow: `0 0 4px ${statusColor(statuses[i])}60`,
                  }} />
                </div>
                <M style={{ fontSize: 7, fontWeight: 600, color: X.textMut }}>{name}</M>
                <M style={{
                  fontSize: 9, fontWeight: 700,
                  color: Math.abs(angles[i]) > 150 ? X.amber : X.text,
                }}>{angles[i].toFixed(1)}&deg;</M>
              </div>
              {i < visibleJoints.length - 1 && (
                <div style={{
                  width: 16, height: 2, background: X.border,
                  margin: '0 3px', marginBottom: 24,
                  borderRadius: 1,
                  boxShadow: `0 1px 2px ${X.bg}40`,
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Mode</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>Auto</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Speed</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.purple }}>80%</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Payload</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.text }}>4.2 kg</M></div>
      </div>
    </Card>
  );
}

// ── Joint Torque ────────────────────────────────────────────────────
export function JointTorque({ title = 'Joint Torque', torqueLimit = 100, torques }: {
  title?: string; torqueLimit?: number; torques: number[];
}) {
  const X = getX();
  const n = neo();

  const jointData = [
    { name: 'J1', base: 62 },
    { name: 'J2', base: 78 },
    { name: 'J3', base: 45 },
    { name: 'J4', base: 91 },
  ];

  const torqueColor = (pct: number) => pct > 90 ? X.red : pct > 70 ? X.amber : X.teal;

  const renderArc = (value: number, color: string, idx: number) => {
    const r = 26;
    const cx = 35;
    const cy = 35;
    const startAngle = 135;
    const sweepAngle = 270;
    const circumference = 2 * Math.PI * r;
    const trackLen = (sweepAngle / 360) * circumference;
    const fillLen = (Math.min(value, 100) / 100) * trackLen;
    const gapLen = circumference - fillLen;
    const trackGap = circumference - trackLen;

    return (
      <div key={idx} style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        flex: 1,
      }}>
        <div style={{
          borderRadius: '50%',
          boxShadow: n.bezel,
          background: n.metal,
          padding: 3,
        }}>
          <svg viewBox="0 0 70 70" style={{ width: 68, height: 68, display: 'block' }}>
            <defs>
              <linearGradient id={`robot-torque-${idx}`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                <stop offset="100%" stopColor={color} stopOpacity="0.5" />
              </linearGradient>
            </defs>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={X.borderLight}
              strokeWidth="5" strokeDasharray={`${trackLen} ${trackGap}`}
              strokeLinecap="round" transform={`rotate(${startAngle} ${cx} ${cy})`} />
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={`url(#robot-torque-${idx})`}
              strokeWidth="5" strokeDasharray={`${fillLen} ${gapLen}`}
              strokeLinecap="round" transform={`rotate(${startAngle} ${cx} ${cy})`}
              style={{ transition: `stroke-dasharray 500ms ${ease.sp}`, filter: `drop-shadow(0 0 3px ${color}40)` }} />
            <text x={cx} y={cy - 2} textAnchor="middle" fontFamily={X.m}
              fontSize="12" fontWeight="800" fill={color}>
              {Math.round(value)}%
            </text>
            <text x={cx} y={cy + 10} textAnchor="middle" fontFamily={X.m}
              fontSize="6" fill={X.textMut}>
              {Math.round(value / 100 * torqueLimit)} Nm
            </text>
          </svg>
        </div>
        <M style={{ fontSize: 9, fontWeight: 700, color: X.text }}>{jointData[idx].name}</M>
      </div>
    );
  };

  const avgTorque = torques.reduce((a, t) => a + t, 0) / torques.length;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={torqueColor(Math.max(...torques))} solid>
          Max {Math.round(Math.max(...torques))}%
        </Badge>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {torques.map((t, i) => renderArc(t, torqueColor(t), i))}
      </div>
      <Prog value={avgTorque} color={torqueColor(avgTorque)} h={3} style={{ marginBottom: 4 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Lbl>Avg Load</Lbl>
        <M style={{ fontSize: 9, fontWeight: 700, color: torqueColor(avgTorque) }}>
          {avgTorque.toFixed(1)}% / {torqueLimit} Nm
        </M>
      </div>
    </Card>
  );
}

// ── Vision Feed ─────────────────────────────────────────────────────
export function VisionFeed({ title = 'Vision Feed', conf, fps, detections }: {
  title?: string; conf: number; fps: number; detections: number;
}) {
  const X = getX();
  const n = neo();
  const tick = useTick(2000);

  const confColor = conf > 80 ? X.teal : conf > 60 ? X.amber : X.red;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <Badge color={X.purple}>1920x1080</Badge>
          <Badge color={X.teal}><Dot c={X.teal} pulse s={4} />Live</Badge>
        </div>
      </div>
      <div style={{
        borderRadius: X.rs,
        boxShadow: n.concave,
        background: X.bgAlt,
        padding: 3,
        marginBottom: 12,
      }}>
        <div style={{
          position: 'relative',
          height: 140,
          borderRadius: 6,
          overflow: 'hidden',
          background: `linear-gradient(160deg, ${X.bg}, ${X.purple}12, ${X.indigo}10, ${X.bg})`,
        }}>
          {/* Scan lines */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${X.text}05 2px, ${X.text}05 3px)`,
            pointerEvents: 'none',
          }} />
          {/* Moving scan beam */}
          <div style={{
            position: 'absolute', left: 0, right: 0,
            height: 2, background: `linear-gradient(90deg, transparent, ${X.teal}40, transparent)`,
            top: `${(tick * 17) % 100}%`,
            transition: 'top 1800ms linear',
            boxShadow: `0 0 8px ${X.teal}30`,
          }} />
          {/* Detection boxes */}
          <div style={{
            position: 'absolute', top: 20, left: 30,
            width: 60, height: 45,
            border: `1px solid ${X.teal}60`,
            borderRadius: 2,
          }}>
            <div style={{
              position: 'absolute', top: -8, left: 0,
              fontSize: 6, fontFamily: X.m, fontWeight: 600,
              color: X.teal, background: X.teal + '20',
              padding: '1px 3px', borderRadius: 2,
            }}>Part A</div>
          </div>
          <div style={{
            position: 'absolute', top: 55, left: 150,
            width: 50, height: 55,
            border: `1px solid ${X.amber}60`,
            borderRadius: 2,
          }}>
            <div style={{
              position: 'absolute', top: -8, left: 0,
              fontSize: 6, fontFamily: X.m, fontWeight: 600,
              color: X.amber, background: X.amber + '20',
              padding: '1px 3px', borderRadius: 2,
            }}>Part B</div>
          </div>
          {/* Crosshair */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            width: 20, height: 20,
            transform: 'translate(-50%, -50%)',
            border: `1px solid ${X.text}30`,
            borderRadius: '50%',
          }}>
            <div style={{ position: 'absolute', top: '50%', left: -6, width: 5, height: 1, background: X.text + '40' }} />
            <div style={{ position: 'absolute', top: '50%', right: -6, width: 5, height: 1, background: X.text + '40' }} />
            <div style={{ position: 'absolute', left: '50%', top: -6, width: 1, height: 5, background: X.text + '40' }} />
            <div style={{ position: 'absolute', left: '50%', bottom: -6, width: 1, height: 5, background: X.text + '40' }} />
          </div>
          {/* Timestamp overlay */}
          <div style={{
            position: 'absolute', bottom: 4, right: 6,
            fontSize: 7, fontFamily: X.m, fontWeight: 600,
            color: X.text + '80',
          }}>
            CAM-01 {fps.toFixed(1)} FPS
          </div>
          <div style={{
            position: 'absolute', top: 4, left: 6,
            fontSize: 7, fontFamily: X.m, fontWeight: 600,
            color: X.red, animation: 'br 2s ease infinite',
          }}>
            REC
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Confidence</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: confColor }}>{conf.toFixed(1)}%</M>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Lbl style={{ marginBottom: 2 }}>Detections</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: X.purple }}>{Math.max(0, Math.round(detections))}</M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>FPS</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: fps > 25 ? X.teal : X.amber }}>{fps.toFixed(1)}</M>
        </div>
      </div>
    </Card>
  );
}

// ── Task Queue ──────────────────────────────────────────────────────
export function TaskQueue({ title = 'Task Queue', maxTasks = 8 }: {
  title?: string; maxTasks?: number;
} = {}) {
  const X = getX();
  const n = neo();

  const tasks = [
    { name: 'Pick & Place #47', status: 'Running', priority: 'High', progress: 72 },
    { name: 'Weld Seam B-12', status: 'Running', priority: 'High', progress: 38 },
    { name: 'Inspect Surface', status: 'Queued', priority: 'Med', progress: 0 },
    { name: 'Palletize Row 3', status: 'Queued', priority: 'Low', progress: 0 },
    { name: 'Calibrate J3', status: 'Done', priority: 'Med', progress: 100 },
  ];

  const statusColor: Record<string, string> = {
    Running: X.teal,
    Queued: X.amber,
    Done: X.textMut,
  };

  const priorityColor: Record<string, string> = {
    High: X.red,
    Med: X.amber,
    Low: X.indigo,
  };

  const running = tasks.filter(t => t.status === 'Running').length;
  const queued = tasks.filter(t => t.status === 'Queued').length;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}>{tasks.length}/{maxTasks} Slots</Badge>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
        {tasks.map((task, i) => {
          const isActive = task.status === 'Running';
          const isDone = task.status === 'Done';
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px', borderRadius: X.rs,
              background: isActive ? n.metal : isDone ? X.bgAlt : X.surface,
              boxShadow: isActive ? n.raised : isDone ? 'none' : `2px 2px 6px ${X.bg}30, -1px -1px 3px #ffffff08`,
              border: `1px solid ${isActive ? X.teal + '30' : isDone ? X.borderLight : X.border}`,
              opacity: isDone ? 0.6 : 1,
              transition: `opacity 200ms ${ease.o}, box-shadow 200ms ${ease.o}`,
              animation: `fu 150ms ${ease.o} ${i * 30}ms both`,
            }}>
              <Dot c={statusColor[task.status]} pulse={isActive} s={7} />
              <div style={{ flex: 1 }}>
                <M style={{
                  fontSize: 10, fontWeight: 600, color: isDone ? X.textMut : X.text,
                  display: 'block',
                  textDecoration: isDone ? 'line-through' : 'none',
                }}>{task.name}</M>
                {isActive && (
                  <Prog value={task.progress} color={X.teal} h={2} style={{ marginTop: 4 }} />
                )}
              </div>
              <Badge color={priorityColor[task.priority]}>{task.priority}</Badge>
              <M style={{
                fontSize: 8, fontWeight: 600,
                color: statusColor[task.status],
                minWidth: 40, textAlign: 'right',
              }}>{task.status}</M>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Dot c={X.teal} s={4} />
          <M style={{ fontSize: 8, color: X.textMut }}>{running} Running</M>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Dot c={X.amber} s={4} />
          <M style={{ fontSize: 8, color: X.textMut }}>{queued} Queued</M>
        </div>
        <M style={{ fontSize: 8, color: X.textMut }}>Avg cycle: 14.2s</M>
      </div>
    </Card>
  );
}

// ── Gripper Status ──────────────────────────────────────────────────
export function GripperStatus({ title = 'Gripper', forceUnit = 'N', force }: {
  title?: string; forceUnit?: string; force: number;
}) {
  const X = getX();
  const n = neo();
  const [gripState] = useState<'Open' | 'Closed' | 'Gripping'>('Gripping');
  const tick = useTick(800);

  const stateColor: Record<string, string> = {
    Open: X.textMut,
    Closed: X.indigo,
    Gripping: X.teal,
  };

  // 4x3 LED grid pattern for grip contact map
  const ledPattern = [
    [false, true,  true,  false],
    [true,  true,  true,  true ],
    [false, true,  true,  false],
  ];

  // Animate some LEDs based on tick
  const animatedPattern = ledPattern.map((row, ri) =>
    row.map((on, ci) => {
      if (!on) return false;
      if (gripState === 'Open') return false;
      if (gripState === 'Gripping') return on;
      return on;
    })
  );

  const activeLeds = animatedPattern.flat().filter(Boolean).length;
  const totalLeds = animatedPattern.flat().length;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={stateColor[gripState]} solid>{gripState}</Badge>
      </div>
      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        {/* LED Matrix Panel */}
        <div style={{
          padding: 12, borderRadius: X.rs,
          background: n.metal,
          boxShadow: n.bezel,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        }}>
          <Lbl style={{ marginBottom: 2 }}>Contact Map</Lbl>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {animatedPattern.map((row, ri) => (
              <div key={ri} style={{ display: 'flex', gap: 4 }}>
                {row.map((on, ci) => (
                  <div key={ci} style={{
                    width: 16, height: 16, borderRadius: '50%',
                    background: on
                      ? `radial-gradient(circle at 40% 35%, ${X.teal}, ${X.teal}80)`
                      : X.bgAlt,
                    boxShadow: on
                      ? `0 0 6px ${X.teal}50, 0 0 2px ${X.teal}30`
                      : n.concave,
                    border: `1px solid ${on ? X.teal + '40' : X.border}`,
                    transition: `background 300ms ${ease.o}, box-shadow 300ms ${ease.o}`,
                  }} />
                ))}
              </div>
            ))}
          </div>
          <M style={{ fontSize: 7, color: X.textMut, marginTop: 2 }}>{activeLeds}/{totalLeds} Active</M>
        </div>
        {/* Readouts */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center' }}>
          <div>
            <Lbl style={{ marginBottom: 3 }}>Grip Force</Lbl>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
              <M style={{ fontSize: 22, fontWeight: 800, color: X.text }}>{force.toFixed(1)}</M>
              <M style={{ fontSize: 10, color: X.textMut }}>{forceUnit}</M>
            </div>
            <Prog value={force / 50 * 100} color={force > 40 ? X.red : force > 25 ? X.amber : X.teal} h={3} style={{ marginTop: 4 }} />
          </div>
          <div style={{
            padding: '6px 8px', borderRadius: X.rs,
            background: stateColor[gripState] + '10',
            border: `1px solid ${stateColor[gripState]}25`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <Lbl>Width</Lbl>
              <M style={{ fontSize: 9, fontWeight: 700, color: X.text }}>12.4 mm</M>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Lbl>Temp</Lbl>
              <M style={{ fontSize: 9, fontWeight: 700, color: X.text }}>34.1 &deg;C</M>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            <Btn small ghost color={X.teal}>Open</Btn>
            <Btn small ghost color={X.indigo} active>Close</Btn>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Schunk PGN-plus 80</M>
        <M style={{ fontSize: 8, color: X.textMut }}>Cycles: 142,847</M>
      </div>
    </Card>
  );
}

// ── Cycle Counter ───────────────────────────────────────────────────
export function CycleCounter({ title = 'Cycle Counter', targetCycles = 10000, cycleRate, uptime }: {
  title?: string; targetCycles?: number; cycleRate: number; uptime: number;
}) {
  const X = getX();
  const n = neo();

  const currentCycles = 7842;
  const animCycles = useAnim(currentCycles, 1800);
  const displayCycles = Math.round(animCycles);
  const completion = (displayCycles / targetCycles) * 100;
  const animCompletion = useAnim(completion, 1400);

  // Format number into individual digit cells
  const digits = String(displayCycles).padStart(6, '0').split('');

  const completionColor = completion >= 100 ? X.teal : completion >= 75 ? X.amber : X.purple;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={completionColor}>{animCompletion.toFixed(1)}% Complete</Badge>
      </div>
      {/* Mechanical counter display */}
      <div style={{
        padding: '12px 14px', borderRadius: X.rs,
        background: n.metal,
        boxShadow: n.bezel,
        marginBottom: 12,
      }}>
        <Lbl style={{ marginBottom: 6, textAlign: 'center' }}>Total Cycles</Lbl>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
          {digits.map((d, i) => (
            <div key={i} style={{
              width: 32, height: 42,
              borderRadius: 4,
              background: X.bgAlt,
              boxShadow: n.concave,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${X.border}`,
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Horizontal divider line for mechanical look */}
              <div style={{
                position: 'absolute', left: 0, right: 0,
                top: '50%', height: 1,
                background: X.border,
                opacity: 0.4,
              }} />
              <M style={{
                fontSize: 22, fontWeight: 800,
                color: i < 6 - String(currentCycles).length ? X.textMut + '40' : X.text,
                lineHeight: 1,
                position: 'relative',
              }}>{d}</M>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
          <M style={{ fontSize: 9, color: X.textMut }}>
            Target: {targetCycles.toLocaleString()} cycles
          </M>
        </div>
      </div>
      <Prog value={Math.min(animCompletion, 100)} color={completionColor} h={4} style={{ marginBottom: 8 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Cycle Rate</Lbl>
          <M style={{ fontSize: 12, fontWeight: 800, color: X.purple }}>
            {cycleRate.toFixed(1)} <span style={{ fontSize: 8, color: X.textMut }}>/min</span>
          </M>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Lbl style={{ marginBottom: 2 }}>Remaining</Lbl>
          <M style={{ fontSize: 12, fontWeight: 800, color: X.text }}>
            {Math.max(0, targetCycles - displayCycles).toLocaleString()}
          </M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>Uptime</Lbl>
          <M style={{ fontSize: 12, fontWeight: 800, color: uptime > 95 ? X.teal : X.amber }}>
            {uptime.toFixed(1)}%
          </M>
        </div>
      </div>
    </Card>
  );
}
