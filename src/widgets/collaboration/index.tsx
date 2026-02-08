import { useState, useEffect } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { useTick } from '../hooks';

// ── Meeting Status ───────────────────────────────────────────────────
export function MeetingStatus({ title = 'Meeting Status', meetingName = 'Q1 AV Review' }: { title?: string; meetingName?: string }) {
  const X = getX();
  const tick = useTick(1000);
  const [joined, setJoined] = useState(true);
  const [timeLeft, setTimeLeft] = useState(1423);

  useEffect(() => {
    if (joined && timeLeft > 0) setTimeLeft(t => Math.max(0, t - 1));
  }, [tick, joined]);

  const mm = Math.floor(timeLeft / 60);
  const ss = String(timeLeft % 60).padStart(2, '0');

  const participants = [
    { initials: 'AL', color: X.purple },
    { initials: 'JK', color: X.teal },
    { initials: 'MR', color: X.pink },
    { initials: 'SD', color: X.amber },
    { initials: 'TP', color: X.indigo },
  ];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
          <M style={{ fontSize: 9, color: X.textSec }}>{meetingName}</M>
        </div>
        {joined
          ? <Badge color={X.teal}><Dot c={X.teal} pulse s={4} /> Live</Badge>
          : <Badge color={X.textMut}>Idle</Badge>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, padding: '8px 10px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
        <div>
          <Lbl style={{ marginBottom: 3 }}>Time Remaining</Lbl>
          <M style={{ fontSize: 18, fontWeight: 800, color: timeLeft < 300 ? X.amber : X.purple }}>{mm}:{ss}</M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 3 }}>Participants</Lbl>
          <M style={{ fontSize: 18, fontWeight: 800, color: X.text }}>{participants.length}</M>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: -4, marginBottom: 10 }}>
        {participants.map((p, i) => (
          <div key={i} style={{
            width: 26, height: 26, borderRadius: '50%', background: p.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: `2px solid ${X.bg}`, marginLeft: i > 0 ? -6 : 0,
            zIndex: participants.length - i,
            animation: `si 200ms ${ease.o} ${i * 40}ms both`,
          }}>
            <M style={{ fontSize: 8, fontWeight: 700, color: '#fff' }}>{p.initials}</M>
          </div>
        ))}
        <M style={{ fontSize: 9, color: X.textMut, marginLeft: 4 }}>+3 more</M>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        {joined
          ? <Btn onClick={() => setJoined(false)} color={X.red} small>Leave</Btn>
          : <Btn onClick={() => setJoined(true)} color={X.teal} small>Join</Btn>}
        <Btn ghost small color={X.purple} onClick={() => {}}>Extend 15m</Btn>
      </div>
    </Card>
  );
}

// ── Screen Share ─────────────────────────────────────────────────────
export function ScreenShare({ title = 'Screen Share', resolution = '1920x1080', fps }: { title?: string; resolution?: string; fps: number }) {
  const X = getX();
  const [sharing, setSharing] = useState(false);
  const [source, setSource] = useState<'desktop' | 'window' | 'tab'>('desktop');

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        {sharing
          ? <Badge color={X.red}><Dot c={X.red} pulse s={4} /> Sharing</Badge>
          : <Badge color={X.textMut}>Off</Badge>}
      </div>

      <div style={{
        width: '100%', height: 90, borderRadius: X.rs, background: X.bgAlt,
        border: `1px solid ${sharing ? X.purple + '40' : X.borderLight}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 10, position: 'relative', overflow: 'hidden',
        transition: `border-color 200ms ${ease.mv}`,
      }}>
        {sharing ? (
          <>
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(135deg, ${X.purple}08, ${X.indigo}08)`,
            }} />
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <M style={{ fontSize: 18, display: 'block', marginBottom: 2, opacity: 0.5 }}>&#9641;</M>
              <M style={{ fontSize: 8, color: X.textMut }}>Desktop Preview</M>
            </div>
          </>
        ) : (
          <M style={{ fontSize: 9, color: X.textMut }}>No active share</M>
        )}
      </div>

      <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
        {(['desktop', 'window', 'tab'] as const).map(s => (
          <Btn key={s} small ghost active={source === s} onClick={() => setSource(s)} color={X.indigo}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </Btn>
        ))}
      </div>

      {sharing && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, padding: '5px 8px', borderRadius: X.rs, background: X.bg, border: `1px solid ${X.borderLight}` }}>
          <div>
            <Lbl>Resolution</Lbl>
            <M style={{ fontSize: 10, color: X.text, fontWeight: 600 }}>{resolution}</M>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Lbl>FPS</Lbl>
            <M style={{ fontSize: 10, color: X.teal, fontWeight: 600 }}>{Math.round(fps)}</M>
          </div>
        </div>
      )}

      <Btn
        onClick={() => setSharing(!sharing)}
        color={sharing ? X.red : X.purple}
        small
        style={{ width: '100%', justifyContent: 'center' }}
      >
        {sharing ? 'Stop Sharing' : 'Start Sharing'}
      </Btn>
    </Card>
  );
}

// ── Chat Feed ────────────────────────────────────────────────────────
export function ChatFeed({ title = 'Chat', maxMessages = 5 }: { title?: string; maxMessages?: number }) {
  const X = getX();
  const tick = useTick(500);
  const [msgs] = useState([
    { sender: 'Alice L.', initials: 'AL', color: X.purple, text: 'Display 3 is showing wrong input', time: '10:42' },
    { sender: 'Jake K.', initials: 'JK', color: X.teal, text: 'Switching to HDMI 2 now', time: '10:43' },
    { sender: 'Maria R.', initials: 'MR', color: X.pink, text: 'Confirmed, audio routing is correct', time: '10:44' },
    { sender: 'Sam D.', initials: 'SD', color: X.amber, text: 'Can we test the mic array next?', time: '10:45' },
    { sender: 'Tom P.', initials: 'TP', color: X.indigo, text: 'PTZ cam preset loaded', time: '10:46' },
  ]);

  const typingDots = '.'.repeat((tick % 3) + 1);

  return (
    <Card noPad style={{ width: 350 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{msgs.length} messages</Badge>
      </div>

      <div style={{ padding: '0 6px 4px', maxHeight: maxMessages * 40, overflowY: 'auto' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{
            display: 'flex', gap: 6, padding: '5px 6px', borderRadius: X.rs,
            animation: `sr 180ms ${ease.o} ${i * 30}ms both`,
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%', background: m.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <M style={{ fontSize: 7, fontWeight: 700, color: '#fff' }}>{m.initials}</M>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 1 }}>
                <M style={{ fontSize: 9, fontWeight: 700, color: X.text }}>{m.sender}</M>
                <M style={{ fontSize: 7, color: X.textMut }}>{m.time}</M>
              </div>
              <div style={{ fontSize: 10, color: X.textSec, lineHeight: 1.3 }}>{m.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        padding: '6px 12px', borderTop: `1px solid ${X.borderLight}`,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <div style={{
          width: 16, height: 16, borderRadius: '50%', background: X.teal,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <M style={{ fontSize: 6, fontWeight: 700, color: '#fff' }}>JK</M>
        </div>
        <M style={{ fontSize: 9, color: X.textMut, fontStyle: 'italic' }}>
          Jake is typing{typingDots}
        </M>
      </div>
    </Card>
  );
}

// ── Whiteboard Mini ──────────────────────────────────────────────────
export function WhiteboardMini({ title = 'Whiteboard', activeUsers = 4 }: { title?: string; activeUsers?: number }) {
  const X = getX();
  const tick = useTick(1000);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'shape' | 'text'>('pen');
  const [duration] = useState(() => 754);

  const sessionMins = Math.floor((duration + tick) / 60);
  const sessionSecs = String((duration + tick) % 60).padStart(2, '0');

  const tools: { id: 'pen' | 'eraser' | 'shape' | 'text'; label: string; icon: string }[] = [
    { id: 'pen', label: 'Pen', icon: '\u270E' },
    { id: 'eraser', label: 'Eraser', icon: '\u2395' },
    { id: 'shape', label: 'Shapes', icon: '\u25A1' },
    { id: 'text', label: 'Text', icon: 'T' },
  ];

  const strokes = [
    { x1: '15%', y1: '25%', x2: '45%', y2: '60%', c: X.purple },
    { x1: '30%', y1: '70%', x2: '80%', y2: '30%', c: X.teal },
    { x1: '60%', y1: '15%', x2: '85%', y2: '75%', c: X.pink },
  ];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}><Dot c={X.teal} pulse s={4} /> {activeUsers} active</Badge>
      </div>

      <div style={{
        width: '100%', height: 100, borderRadius: X.rs,
        background: X.bgAlt, border: `1px solid ${X.borderLight}`,
        position: 'relative', overflow: 'hidden', marginBottom: 8,
      }}>
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
          {strokes.map((s, i) => (
            <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
              stroke={s.c} strokeWidth={2} strokeLinecap="round" opacity={0.6} />
          ))}
          <rect x="55%" y="45%" width="25%" height="18%" rx="3"
            fill="none" stroke={X.amber} strokeWidth={1.5} opacity={0.5} />
        </svg>
        <M style={{
          position: 'absolute', bottom: 4, right: 6,
          fontSize: 7, color: X.textMut, background: X.bg + 'cc', padding: '1px 4px', borderRadius: 3,
        }}>
          Session: {sessionMins}:{sessionSecs}
        </M>
      </div>

      <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
        {tools.map(t => (
          <Btn key={t.id} small ghost active={tool === t.id} onClick={() => setTool(t.id)} color={X.purple}>
            <span style={{ fontSize: 10, lineHeight: 1 }}>{t.icon}</span> {t.label}
          </Btn>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ display: 'flex' }}>
          {[X.purple, X.teal, X.pink, X.amber].map((c, i) => (
            <div key={i} style={{
              width: 18, height: 18, borderRadius: '50%', background: c,
              border: `2px solid ${X.bg}`, marginLeft: i > 0 ? -5 : 0,
              zIndex: 4 - i,
            }} />
          ))}
        </div>
        <M style={{ fontSize: 9, color: X.textMut }}>{activeUsers} users editing</M>
      </div>
    </Card>
  );
}

// ── Poll Widget ──────────────────────────────────────────────────────
export function PollWidget({ title = 'Live Poll', question = 'Preferred AV platform?' }: { title?: string; question?: string }) {
  const X = getX();
  const [votes, setVotes] = useState([
    { label: 'Crestron NVX', count: 14, color: X.purple },
    { label: 'Extron NAV', count: 9, color: X.teal },
    { label: 'QSC Q-SYS', count: 11, color: X.indigo },
    { label: 'Biamp TesiraFORTE', count: 5, color: X.amber },
  ]);
  const [voted, setVoted] = useState<number | null>(null);

  const total = votes.reduce((s, v) => s + v.count, 0);

  const castVote = (idx: number) => {
    if (voted !== null) return;
    setVoted(idx);
    setVotes(prev => prev.map((v, i) => i === idx ? { ...v, count: v.count + 1 } : v));
  };

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
          <M style={{ fontSize: 9, color: X.textSec }}>{question}</M>
        </div>
        <Badge color={X.purple}>{total} votes</Badge>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {votes.map((v, i) => {
          const pct = total > 0 ? Math.round((v.count / total) * 100) : 0;
          const isVoted = voted === i;
          return (
            <button key={i} onClick={() => castVote(i)} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 8px', borderRadius: X.rs,
              border: `1px solid ${isVoted ? v.color + '40' : X.borderLight}`,
              background: isVoted ? v.color + '0c' : X.bgAlt,
              cursor: voted !== null ? 'default' : 'pointer',
              transition: `all 150ms ${ease.mv}`, textAlign: 'left',
              width: '100%',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <M style={{ fontSize: 10, color: X.text, fontWeight: isVoted ? 700 : 500 }}>{v.label}</M>
                  <M style={{ fontSize: 9, color: v.color, fontWeight: 700 }}>{pct}%</M>
                </div>
                <div style={{ height: 3, borderRadius: 3, background: X.borderLight, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: voted !== null ? `${pct}%` : '0%',
                    background: v.color,
                    transition: `width 600ms ${ease.sp}`,
                  }} />
                </div>
              </div>
              <M style={{ fontSize: 8, color: X.textMut, minWidth: 16, textAlign: 'right' }}>{v.count}</M>
            </button>
          );
        })}
      </div>

      {voted !== null && (
        <M style={{ display: 'block', fontSize: 8, color: X.textMut, textAlign: 'center', marginTop: 6 }}>
          You voted for {votes[voted].label}
        </M>
      )}
    </Card>
  );
}

// ── Task Tracker ─────────────────────────────────────────────────────
export function TaskTracker({ title = 'Task Tracker', view = 'list' }: { title?: string; view?: 'list' | 'board' }) {
  const X = getX();
  const columns = [
    { name: 'To Do', color: X.textMut, count: 4 },
    { name: 'In Progress', color: X.amber, count: 3 },
    { name: 'Done', color: X.teal, count: 6 },
  ];
  const totalTasks = columns.reduce((s, c) => s + c.count, 0);
  const donePct = Math.round((columns[2].count / totalTasks) * 100);

  const [tasks, setTasks] = useState([
    { title: 'Configure display wall', status: 'progress' as const, assignee: 'AL', color: X.purple },
    { title: 'Test audio routing', status: 'todo' as const, assignee: 'JK', color: X.teal },
    { title: 'Update PTZ firmware', status: 'done' as const, assignee: 'MR', color: X.pink },
    { title: 'Calibrate mic array', status: 'progress' as const, assignee: 'SD', color: X.amber },
  ]);

  const statusColor: Record<string, string> = {
    todo: X.textMut,
    progress: X.amber,
    done: X.teal,
  };

  const statusLabel: Record<string, string> = {
    todo: 'To Do',
    progress: 'In Progress',
    done: 'Done',
  };

  const cycleStatus = (idx: number) => {
    setTasks(prev => prev.map((t, i) => {
      if (i !== idx) return t;
      const order = ['todo', 'progress', 'done'] as const;
      const next = order[(order.indexOf(t.status) + 1) % order.length];
      return { ...t, status: next };
    }));
  };

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{donePct}% done</Badge>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {columns.map((col, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center', padding: '6px 4px',
            borderRadius: X.rs, background: X.bgAlt,
            border: `1px solid ${X.borderLight}`,
          }}>
            <M style={{ fontSize: 16, fontWeight: 800, color: col.color, display: 'block' }}>{col.count}</M>
            <M style={{ fontSize: 7, color: X.textMut, fontWeight: 600 }}>{col.name}</M>
          </div>
        ))}
      </div>

      <Prog value={donePct} color={X.teal} h={3} style={{ marginBottom: 10 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {tasks.map((t, i) => (
          <button key={i} onClick={() => cycleStatus(i)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '5px 8px', borderRadius: X.rs,
            border: 'none', background: i % 2 === 0 ? X.bgAlt : 'transparent',
            cursor: 'pointer', textAlign: 'left', width: '100%',
            animation: `sr 150ms ${ease.o} ${i * 25}ms both`,
            transition: `background-color 150ms ${ease.mv}`,
          }}>
            <Dot c={statusColor[t.status]} s={6} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <M style={{
                fontSize: 10, color: X.text, fontWeight: 500, display: 'block',
                textDecoration: t.status === 'done' ? 'line-through' : 'none',
                opacity: t.status === 'done' ? 0.6 : 1,
              }}>{t.title}</M>
            </div>
            <div style={{
              width: 18, height: 18, borderRadius: '50%', background: t.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <M style={{ fontSize: 7, fontWeight: 700, color: '#fff' }}>{t.assignee}</M>
            </div>
            <M style={{ fontSize: 7, color: statusColor[t.status], fontWeight: 600, minWidth: 42 }}>
              {statusLabel[t.status]}
            </M>
          </button>
        ))}
      </div>
    </Card>
  );
}
