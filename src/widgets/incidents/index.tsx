import { useState, useEffect } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { CmdBtn } from '../av-controls';

// ── Alert Feed ────────────────────────────────────────────────────────
export function AlertFeed({ title = 'Alerts', maxAlerts = 4 }: {
  title?: string; maxAlerts?: number;
}) {
  const X = getX();
  const init = [
    { t: '2m ago', msg: 'HDMI 4 — HDCP handshake failed', sev: 'error' },
    { t: '15m ago', msg: 'Samsung QM85R — Temp 72°C', sev: 'warning' },
    { t: '1h ago', msg: 'FW v4.3.0 available for NEC PA804UL', sev: 'info' },
    { t: '3h ago', msg: 'PTZ — Auto-tracking re-enabled', sev: 'success' },
  ].slice(0, maxAlerts);
  const [alerts, setAlerts] = useState(init);
  const sc: Record<string, string> = { error: X.red, warning: X.amber, info: X.purple, success: X.teal };
  return (
    <Card noPad style={{ width: 410 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.red}>{alerts.filter(a => a.sev === 'error').length} Critical</Badge>
      </div>
      <div style={{ padding: '0 6px 8px' }}>
        {alerts.map((a, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, padding: '6px', borderRadius: X.rs, borderLeft: `2px solid ${sc[a.sev]}`, marginBottom: 2, background: sc[a.sev] + '08', animation: `sr 180ms ${ease.o} ${i * 30}ms both` }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: X.text, marginBottom: 1 }}>{a.msg}</div>
              <M style={{ fontSize: 8, color: X.textMut }}>{a.t}</M>
            </div>
            <button onClick={() => setAlerts(alerts.filter((_, j) => j !== i))} style={{ width: 18, height: 18, borderRadius: '50%', border: 'none', background: X.bgAlt, color: X.textMut, fontSize: 10, cursor: 'pointer', flexShrink: 0 }}>✕</button>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Command Log ───────────────────────────────────────────────────────
export function CommandLog({ title = 'Command Log', protocol = 'RS-232' }: {
  title?: string; protocol?: string;
}) {
  const X = getX();
  const logs = [
    { t: '10:42:15', cmd: 'SET input HDMI1', res: 'OK', ms: 12 },
    { t: '10:42:03', cmd: 'GET power.status', res: 'ON', ms: 8 },
    { t: '10:41:58', cmd: 'SET volume 72', res: 'OK', ms: 15 },
    { t: '10:41:45', cmd: 'GET lamp.hours', res: '12400', ms: 22 },
    { t: '10:41:30', cmd: 'SET aspect 16:9', res: 'OK', ms: 11 },
    { t: '10:40:12', cmd: 'SET mute true', res: 'ERR', ms: 145 },
  ];
  return (
    <Card noPad style={{ width: 420 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}><Dot c={X.teal} pulse s={4} />{protocol}</Badge>
      </div>
      <div style={{ padding: '0 6px 8px' }}>
        {logs.map((l, i) => {
          const ok = l.res === 'OK' || l.res === 'ON';
          return (
            <div key={i} style={{ display: 'flex', gap: 6, padding: '3px 6px', borderRadius: 3, fontFamily: X.m, fontSize: 9, animation: `sr 150ms ${ease.o} ${i * 20}ms both`, background: i % 2 === 0 ? X.bgAlt : 'transparent' }}>
              <span style={{ color: X.textMut, minWidth: 48 }}>{l.t}</span>
              <span style={{ color: X.purple, flex: 1 }}>{l.cmd}</span>
              <span style={{ color: ok ? X.teal : X.red, minWidth: 34, fontWeight: 600 }}>{l.res}</span>
              <span style={{ color: l.ms > 50 ? X.amber : X.textMut, minWidth: 28, textAlign: 'right' }}>{l.ms}ms</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Bulk Actions ──────────────────────────────────────────────────────
export function BulkActions({ title = 'Bulk Actions', maxDevices = 5 }: {
  title?: string; maxDevices?: number;
}) {
  const X = getX();
  const allDevs = ['NEC PA804UL', 'Samsung QM85R', 'Shure MXA920', 'QSC Core 110f', 'PTZ Optics 30X'];
  const devs = allDevs.slice(0, maxDevices);
  const [sel, setSel] = useState(new Set([0, 2, 4].filter(i => i < maxDevices)));
  const toggle = (i: number) => { const n = new Set(sel); n.has(i) ? n.delete(i) : n.add(i); setSel(n); };
  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}>{sel.size} selected</Badge>
      </div>
      {devs.map((d, i) => (
        <button key={i} onClick={() => toggle(i)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: X.rs, border: 'none', background: sel.has(i) ? X.purple + '0c' : 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'background-color 150ms, color 150ms, transform 150ms' }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, border: `1px solid ${sel.has(i) ? X.purple : X.border}`, background: sel.has(i) ? X.purple : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {sel.has(i) && <M style={{ fontSize: 8, color: '#fff' }}>✓</M>}
          </div>
          <M style={{ fontSize: 10, color: X.text }}>{d}</M>
        </button>
      ))}
      <div style={{ display: 'flex', gap: 3, marginTop: 8 }}>
        <CmdBtn label="Reboot All" color={X.purple} />
        <CmdBtn label="Update FW" color={X.indigo} />
      </div>
    </Card>
  );
}

// ── Code Tester ───────────────────────────────────────────────────────
export function CodeTester({ title = 'Command Tester', defaultProtocol = 'rs232' }: {
  title?: string; defaultProtocol?: string;
}) {
  const X = getX();
  const [proto, setProto] = useState(defaultProtocol);
  const [cmd, setCmd] = useState('POWR ON');
  const [resp, setResp] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const send = () => { setSending(true); setTimeout(() => { setResp(Math.random() > 0.2 ? 'ACK' : 'NAK'); setSending(false); }, 500 + Math.random() * 500); };
  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 8 }}>{title}</div>
      <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
        {['rs232', 'ir', 'tcp'].map(p => <Btn key={p} small ghost active={proto === p} onClick={() => setProto(p)} color={X.indigo}>{p.toUpperCase()}</Btn>)}
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        <input value={cmd} onChange={e => setCmd(e.target.value)} style={{ flex: 1, padding: '5px 8px', borderRadius: X.rs, border: `1px solid ${X.border}`, background: X.bgAlt, color: X.text, fontFamily: X.m, fontSize: 10, outline: 'none' }} />
        <Btn onClick={send} color={X.purple} disabled={sending}>{sending ? '…' : 'Send'}</Btn>
      </div>
      {resp && (
        <div style={{ fontFamily: X.m, fontSize: 9, padding: '4px 8px', borderRadius: X.rs, background: X.bg, border: `1px solid ${X.borderLight}`, color: resp === 'ACK' ? X.teal : X.red, animation: `fu 150ms ${ease.o}` }}>
          Response: <span style={{ fontWeight: 700 }}>{resp}</span> <span style={{ color: X.textMut }}>({proto.toUpperCase()} · 12ms)</span>
        </div>
      )}
    </Card>
  );
}

// ── Firmware Update ───────────────────────────────────────────────────
export function FirmwareUpdate({ title = 'Firmware Update', targetVersion = 'v4.3.0' }: {
  title?: string; targetVersion?: string;
}) {
  const X = getX();
  const [phase, setPhase] = useState(0);
  const [prog, setProg] = useState(0);
  const [done, setDone] = useState(false);
  const phases = ['Download', 'Verify', 'Install', 'Reboot'];
  useEffect(() => {
    const i = setInterval(() => setProg(p => {
      if (p >= 100) { if (phase < 3) { setPhase(c => c + 1); return 0; } else { setDone(true); clearInterval(i); return 100; } }
      return p + Math.random() * 3 + 0.4;
    }), 100);
    return () => clearInterval(i);
  }, [phase]);
  return (
    <Card style={{ width: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div><div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div><M style={{ fontSize: 9, color: X.textSec }}>v4.2.1 → {targetVersion}</M></div>
        {done ? <Badge color={X.teal} solid>✓ Done</Badge> : <M style={{ fontSize: 16, fontWeight: 800, color: X.purple }}>{Math.round(((phase * 100 + prog) / 400) * 100)}%</M>}
      </div>
      <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
        {phases.map((ph, i) => (
          <div key={i} style={{ flex: 1 }}>
            <Prog value={i < phase ? 100 : i === phase ? Math.min(prog, 100) : 0} color={i < phase ? X.teal : X.purple} h={2} />
            <M style={{ fontSize: 7, color: i <= phase ? (i < phase ? X.teal : X.purple) : X.textMut, marginTop: 2, display: 'block' }}>{ph}</M>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: X.m, fontSize: 9, color: X.teal, padding: '6px 8px', background: X.bg, borderRadius: X.rs, border: `1px solid ${X.borderLight}`, lineHeight: 1.4 }}>
        <span style={{ color: X.textMut }}>$</span> ota-update --target NEC-PA804UL{'\n'}
        {!done && <span style={{ color: X.purple, animation: 'bl 1s step-end infinite' }}>▌</span>}
        {done ? <span style={{ color: X.teal }}>✓ All phases complete</span> : <span>{phases[phase]}… {Math.min(Math.round(prog), 100)}%</span>}
      </div>
    </Card>
  );
}
