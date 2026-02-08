import { useState, useMemo } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot, Prog } from '../primitives';
import { useAnim, useTick } from '../hooks';

// ── Classroom AV ────────────────────────────────────────────────────
export function ClassroomAV({ title = 'Classroom AV', room = 'Room 204', projector = true, source = 'HDMI', screenPos = 85, recording = true, audioLevel }: {
  title?: string; room?: string; projector?: boolean; source?: string; screenPos?: number; recording?: boolean; audioLevel: number;
}) {
  const X = getX();
  const [src, setSrc] = useState(source);
  const sources = ['HDMI', 'Wireless', 'Doc Cam'];
  const srcColors: Record<string, string> = { HDMI: X.purple, Wireless: X.teal, 'Doc Cam': X.indigo };
  const [proj, setProj] = useState(projector);
  const [rec, setRec] = useState(recording);
  const [scrn, setScrn] = useState(screenPos);

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
          <M style={{ fontSize: 9, color: X.textSec }}>{room}</M>
        </div>
        {rec
          ? <Badge color={X.red}><Dot c={X.red} pulse s={4} /> REC</Badge>
          : <Badge color={X.textMut}>Idle</Badge>}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}`, marginBottom: 8 }}>
        <Dot c={proj ? X.teal : X.textMut} pulse={proj} s={7} />
        <M style={{ fontSize: 10, fontWeight: 600, color: X.text, flex: 1 }}>Projector</M>
        <M style={{ fontSize: 9, color: proj ? X.teal : X.textMut, fontWeight: 600 }}>{proj ? 'ON' : 'OFF'}</M>
        <button onClick={() => setProj(!proj)} style={{
          width: 28, height: 14, borderRadius: 7, border: 'none', cursor: 'pointer',
          background: proj ? X.teal : X.border, position: 'relative',
          transition: `background-color 200ms ${ease.mv}`, flexShrink: 0,
        }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, left: proj ? 16 : 2, transition: `left 200ms ${ease.sp}` }} />
        </button>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <Lbl>Audio Level</Lbl>
          <M style={{ fontSize: 9, fontWeight: 700, color: audioLevel > 85 ? X.red : audioLevel > 60 ? X.teal : X.textSec }}>{Math.round(audioLevel)}%</M>
        </div>
        <Prog value={Math.max(0, Math.min(100, audioLevel))} color={audioLevel > 85 ? X.red : audioLevel > 60 ? X.teal : X.amber} h={4} />
      </div>

      <div style={{ marginBottom: 8 }}>
        <Lbl style={{ marginBottom: 4 }}>Source</Lbl>
        <div style={{ display: 'flex', gap: 3 }}>
          {sources.map(s => (
            <button key={s} onClick={() => setSrc(s)} style={{
              flex: 1, padding: '4px 6px', borderRadius: X.rs, cursor: 'pointer',
              border: `1px solid ${src === s ? (srcColors[s] || X.purple) + '40' : X.borderLight}`,
              background: src === s ? (srcColors[s] || X.purple) + '10' : 'transparent',
              fontFamily: X.m, fontSize: 8, fontWeight: 600,
              color: src === s ? srcColors[s] || X.purple : X.textMut,
              transition: `all 150ms ${ease.mv}`,
            }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Screen</Lbl>
          <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{scrn}% down</M>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={() => setRec(!rec)} style={{
            padding: '3px 8px', borderRadius: 12, border: `1px solid ${rec ? X.red + '40' : X.borderLight}`,
            background: rec ? X.red + '10' : 'transparent', cursor: 'pointer',
            fontFamily: X.m, fontSize: 8, fontWeight: 600,
            color: rec ? X.red : X.textMut, transition: `all 150ms ${ease.mv}`,
          }}>
            {rec ? '⏹ Stop' : '⏺ Record'}
          </button>
        </div>
      </div>
    </Card>
  );
}

// ── Attendance Board ────────────────────────────────────────────────
export function AttendanceBoard({ title = 'Attendance Board', warningThreshold = 75 }: {
  title?: string; warningThreshold?: number;
}) {
  const X = getX();
  const classes = useMemo(() => [
    { name: 'Math 101', enrolled: 32, present: 28, late: 2 },
    { name: 'English 202', enrolled: 28, present: 25, late: 1 },
    { name: 'Physics 301', enrolled: 24, present: 22, late: 0 },
    { name: 'History 150', enrolled: 35, present: 30, late: 3 },
    { name: 'CS 110', enrolled: 40, present: 38, late: 1 },
    { name: 'Art 120', enrolled: 18, present: 14, late: 2 },
  ], []);
  const totalEnrolled = classes.reduce((s, c) => s + c.enrolled, 0);
  const totalPresent = classes.reduce((s, c) => s + c.present, 0);
  const overallPct = Math.round((totalPresent / totalEnrolled) * 100);
  const animPct = useAnim(overallPct, 1000);

  return (
    <Card style={{ width: 420 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={overallPct >= 90 ? X.teal : overallPct >= warningThreshold ? X.amber : X.red}>{Math.round(animPct)}% Overall</Badge>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 50px 46px 40px 1fr 30px', gap: 4, padding: '4px 0', borderBottom: `1px solid ${X.borderLight}`, marginBottom: 2 }}>
        <Lbl>Class</Lbl>
        <Lbl style={{ textAlign: 'right' }}>Enrl</Lbl>
        <Lbl style={{ textAlign: 'right' }}>Pres</Lbl>
        <Lbl style={{ textAlign: 'right' }}>Abs</Lbl>
        <Lbl>Rate</Lbl>
        <Lbl style={{ textAlign: 'center' }}>Late</Lbl>
      </div>

      {classes.map((c, i) => {
        const absent = c.enrolled - c.present;
        const pct = Math.round((c.present / c.enrolled) * 100);
        return (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 50px 46px 40px 1fr 30px', gap: 4, alignItems: 'center',
            padding: '5px 0', borderBottom: i < classes.length - 1 ? `1px solid ${X.borderLight}` : 'none',
            animation: `sr 150ms ${ease.o} ${i * 25}ms both`,
          }}>
            <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{c.name}</M>
            <M style={{ fontSize: 9, color: X.textSec, textAlign: 'right' }}>{c.enrolled}</M>
            <M style={{ fontSize: 9, color: X.teal, fontWeight: 600, textAlign: 'right' }}>{c.present}</M>
            <M style={{ fontSize: 9, color: absent > 0 ? X.red : X.textMut, fontWeight: 600, textAlign: 'right' }}>{absent}</M>
            <Prog value={pct} color={pct >= 90 ? X.teal : pct >= 75 ? X.amber : X.red} h={3} />
            {c.late > 0
              ? <Badge color={X.amber} style={{ justifyContent: 'center' }}>{c.late}</Badge>
              : <M style={{ fontSize: 8, color: X.textMut, textAlign: 'center' }}>—</M>}
          </div>
        );
      })}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Total Present</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: X.teal }}>{totalPresent}</M>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Lbl style={{ marginBottom: 2 }}>Enrolled</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: X.text }}>{totalEnrolled}</M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>Absent</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: X.red }}>{totalEnrolled - totalPresent}</M>
        </div>
      </div>
    </Card>
  );
}

// ── Digital Bulletin ────────────────────────────────────────────────
export function DigitalBulletin({ title = 'Digital Bulletin', maxPosts = 5 }: {
  title?: string; maxPosts?: number;
}) {
  const X = getX();
  const announcements = useMemo(() => [
    { title: 'Spring Break Schedule', category: 'Event', date: 'Feb 10', priority: 'high', reads: 342 },
    { title: 'Campus Power Outage — Bldg C', category: 'Alert', date: 'Feb 8', priority: 'urgent', reads: 518 },
    { title: 'Library Hours Extended', category: 'Info', date: 'Feb 7', priority: 'normal', reads: 189 },
    { title: 'Science Fair Registration Open', category: 'Event', date: 'Feb 5', priority: 'normal', reads: 267 },
    { title: 'Parking Lot B Closure', category: 'Alert', date: 'Feb 3', priority: 'high', reads: 412 },
  ], []);
  const catColor: Record<string, string> = { Event: X.purple, Alert: X.red, Info: X.teal };
  const prioColor: Record<string, string> = { urgent: X.red, high: X.amber, normal: X.textMut };

  return (
    <Card noPad style={{ width: 380 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}>{Math.min(announcements.length, maxPosts)} Posts</Badge>
      </div>
      <div style={{ padding: '0 6px 8px' }}>
        {announcements.slice(0, maxPosts).map((a, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 8, padding: '7px 8px', borderRadius: X.rs,
            background: i % 2 === 0 ? X.bgAlt : 'transparent',
            borderLeft: `2px solid ${prioColor[a.priority] || X.textMut}`,
            animation: `sr 150ms ${ease.o} ${i * 25}ms both`,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                <M style={{ fontSize: 10, fontWeight: 600, color: X.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{a.title}</M>
                <Badge color={catColor[a.category] || X.purple}>{a.category}</Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <M style={{ fontSize: 8, color: X.textMut }}>{a.date}</M>
                <M style={{ fontSize: 8, color: X.textMut }}>
                  <span style={{ color: prioColor[a.priority], fontWeight: 600 }}>{a.priority === 'urgent' ? '▲' : a.priority === 'high' ? '●' : '○'}</span>
                  {' '}{a.priority}
                </M>
                <M style={{ fontSize: 8, color: X.textMut, marginLeft: 'auto' }}>{a.reads} reads</M>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Bell Schedule ───────────────────────────────────────────────────
export function BellSchedule({ title = 'Bell Schedule', currentPeriod = 3 }: { title?: string; currentPeriod?: number }) {
  const X = getX();
  const tick = useTick(1000);
  const periods = useMemo(() => [
    { name: 'Period 1', start: '8:00', end: '8:50', passing: true },
    { name: 'Period 2', start: '8:55', end: '9:45', passing: true },
    { name: 'Period 3', start: '9:50', end: '10:40', passing: false },
    { name: 'Brunch', start: '10:40', end: '10:55', passing: true },
    { name: 'Period 4', start: '11:00', end: '11:50', passing: true },
    { name: 'Lunch', start: '11:50', end: '12:30', passing: true },
    { name: 'Period 5', start: '12:35', end: '1:25', passing: true },
    { name: 'Period 6', start: '1:30', end: '2:20', passing: false },
  ], []);

  const [timeRemaining] = useState(() => 1247);
  const remaining = Math.max(0, timeRemaining - tick);
  const mm = Math.floor(remaining / 60);
  const ss = String(remaining % 60).padStart(2, '0');
  const totalPeriodSec = 50 * 60;
  const elapsed = totalPeriodSec - remaining;
  const progressPct = Math.min(100, (elapsed / totalPeriodSec) * 100);

  return (
    <Card noPad style={{ width: 360 }}>
      <div style={{ padding: '12px 14px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}><Dot c={X.teal} pulse s={4} /> In Session</Badge>
      </div>

      <div style={{ padding: '0 14px 8px' }}>
        <div style={{ padding: '8px 10px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}`, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div>
              <Lbl style={{ marginBottom: 2 }}>Current</Lbl>
              <M style={{ fontSize: 12, fontWeight: 700, color: X.text }}>{periods[currentPeriod].name}</M>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Lbl style={{ marginBottom: 2 }}>Time Left</Lbl>
              <M style={{ fontSize: 18, fontWeight: 800, color: remaining < 300 ? X.red : remaining < 600 ? X.amber : X.purple }}>{mm}:{ss}</M>
            </div>
          </div>
          <Prog value={progressPct} color={remaining < 300 ? X.red : remaining < 600 ? X.amber : X.purple} h={3} />
        </div>
      </div>

      <div style={{ padding: '0 6px 8px' }}>
        {periods.map((p, i) => {
          const isCurrent = i === currentPeriod;
          const isDone = i < currentPeriod;
          const isBreak = p.name === 'Brunch' || p.name === 'Lunch';
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '4px 8px', borderRadius: 3,
              background: isCurrent ? X.purple + '0c' : (i % 2 === 0 ? X.bgAlt : 'transparent'),
              border: isCurrent ? `1px solid ${X.purple}20` : '1px solid transparent',
              opacity: isDone ? 0.4 : 1,
              animation: `sr 120ms ${ease.o} ${i * 15}ms both`,
            }}>
              <Dot c={isCurrent ? X.teal : isDone ? X.textMut : X.borderLight} pulse={isCurrent} s={5} />
              <M style={{ fontSize: 9, fontWeight: isCurrent ? 700 : 500, color: isCurrent ? X.text : X.textSec, flex: 1 }}>
                {p.name}
              </M>
              <M style={{ fontSize: 8, color: X.textMut, minWidth: 70, textAlign: 'right' }}>
                {p.start} – {p.end}
              </M>
              {isBreak && <Badge color={X.amber} style={{ fontSize: 7, padding: '1px 5px' }}>Break</Badge>}
              {isCurrent && !isBreak && <Badge color={X.teal} solid style={{ fontSize: 7, padding: '1px 5px' }}>Now</Badge>}
              {p.passing && !isCurrent && !isDone && !isBreak && (
                <M style={{ fontSize: 7, color: X.textMut, minWidth: 16 }}>5m</M>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Library Occupancy ───────────────────────────────────────────────
export function LibraryOccupancy({ title = 'Library Occupancy', capacity = 120, currentOcc, noiseLevel }: { title?: string; capacity?: number; currentOcc: number; noiseLevel: number }) {
  const X = getX();
  const occ = Math.max(0, Math.round(currentOcc));
  const pct = Math.min(100, (occ / capacity) * 100);
  const animOcc = useAnim(78, 1000);

  const rooms = useMemo(() => [
    { name: 'Study A', status: 'available' },
    { name: 'Study B', status: 'occupied' },
    { name: 'Study C', status: 'available' },
    { name: 'Media Lab', status: 'occupied' },
    { name: 'Group D', status: 'reserved' },
    { name: 'Group E', status: 'available' },
  ], []);
  const statusColor: Record<string, string> = { available: X.teal, occupied: X.red, reserved: X.amber };
  const statusLabel: Record<string, string> = { available: 'Open', occupied: 'In Use', reserved: 'Rsrvd' };

  const noiseVal = Math.max(0, Math.min(100, noiseLevel));
  const noiseTag = noiseVal > 60 ? 'Loud' : noiseVal > 35 ? 'Moderate' : 'Quiet';
  const noiseColor = noiseVal > 60 ? X.red : noiseVal > 35 ? X.amber : X.teal;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={pct > 85 ? X.red : pct > 60 ? X.amber : X.teal}>{Math.round(pct)}% Full</Badge>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
        <M style={{ fontSize: 28, fontWeight: 800, color: X.text }}>{Math.round(animOcc)}</M>
        <M style={{ fontSize: 12, color: X.textMut }}>/ {capacity}</M>
      </div>
      <Prog value={pct} color={pct > 85 ? X.red : pct > 60 ? X.amber : X.teal} h={5} style={{ marginBottom: 10 }} />

      <Lbl style={{ marginBottom: 5 }}>Study Rooms</Lbl>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, marginBottom: 10 }}>
        {rooms.map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '4px 6px', borderRadius: X.rs,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
            animation: `fu 150ms ${ease.o} ${i * 20}ms both`,
          }}>
            <Dot c={statusColor[r.status]} pulse={r.status === 'available'} s={5} />
            <M style={{ fontSize: 9, color: X.text, flex: 1 }}>{r.name}</M>
            <M style={{ fontSize: 7, color: statusColor[r.status], fontWeight: 600 }}>{statusLabel[r.status]}</M>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Dot c={noiseColor} s={6} />
          <Lbl>Noise Level</Lbl>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Prog value={noiseVal} color={noiseColor} h={3} style={{ width: 60 }} />
          <M style={{ fontSize: 9, fontWeight: 600, color: noiseColor }}>{noiseTag}</M>
        </div>
      </div>
    </Card>
  );
}

// ── Exam Timer ──────────────────────────────────────────────────────
export function ExamTimer({ title = 'Exam Timer', exam = 'Calculus II — Final', totalMin = 120, elapsedMin = 47, section = 'Section B: Integration', status = 'in_progress' }: {
  title?: string; exam?: string; totalMin?: number; elapsedMin?: number; section?: string; status?: string;
}) {
  const X = getX();
  const tick = useTick(1000);
  const [initialRemaining] = useState(() => (totalMin - elapsedMin) * 60);
  const remaining = Math.max(0, initialRemaining - tick);
  const totalSec = totalMin * 60;
  const elapsed = totalSec - remaining;
  const progressPct = Math.min(100, (elapsed / totalSec) * 100);

  const hrs = Math.floor(remaining / 3600);
  const mins = Math.floor((remaining % 3600) / 60);
  const secs = remaining % 60;
  const timeStr = hrs > 0
    ? `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    : `${mins}:${String(secs).padStart(2, '0')}`;

  const isLow = remaining < 600;
  const isCritical = remaining < 180;
  const isDone = remaining === 0;
  const displayStatus = isDone ? 'completed' : status;

  const statusColor: Record<string, string> = { in_progress: X.teal, not_started: X.textMut, completed: X.purple };
  const statusText: Record<string, string> = { in_progress: 'In Progress', not_started: 'Not Started', completed: 'Completed' };
  const timerColor = isDone ? X.purple : isCritical ? X.red : isLow ? X.amber : X.text;

  const animProgress = useAnim(progressPct, 800);

  return (
    <Card style={{ width: 370 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: X.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
          <M style={{ fontSize: 9, color: X.textSec }}>{exam}</M>
        </div>
        <Badge color={statusColor[displayStatus] || X.teal}>
          {!isDone && displayStatus === 'in_progress' && <Dot c={X.teal} pulse s={4} />}
          {statusText[displayStatus] || displayStatus}
        </Badge>
      </div>

      <div style={{ textAlign: 'center', padding: '12px 0 10px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}`, marginBottom: 10 }}>
        <Lbl style={{ marginBottom: 4 }}>Time Remaining</Lbl>
        <M style={{
          fontSize: 36, fontWeight: 800, color: timerColor, letterSpacing: '-.02em',
          animation: isCritical && !isDone ? 'br 1s ease infinite' : 'none',
        }}>
          {isDone ? '0:00' : timeStr}
        </M>
        <M style={{ fontSize: 9, color: X.textMut, display: 'block', marginTop: 2 }}>
          {totalMin} min exam
        </M>
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <Lbl>Progress</Lbl>
          <M style={{ fontSize: 9, fontWeight: 700, color: X.purple }}>{Math.round(animProgress)}%</M>
        </div>
        <Prog value={progressPct} color={isCritical ? X.red : isLow ? X.amber : X.purple} h={4} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Current Section</Lbl>
          <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{section}</M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>Elapsed</Lbl>
          <M style={{ fontSize: 10, fontWeight: 600, color: X.textSec }}>{Math.floor(elapsed / 60)}m</M>
        </div>
      </div>
    </Card>
  );
}
