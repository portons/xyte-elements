import { useState, useEffect } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { useAnim, useLive, useTick } from '../hooks';

// ── Threat Map ───────────────────────────────────────────────────────
export function ThreatMap({ title = 'Threat Map', refreshInterval = 3000 }: { title?: string; refreshInterval?: number }) {
  const X = getX();
  const tick = useTick(refreshInterval);
  const regions: { name: string; code: string; threats: number; sev: 'critical' | 'high' | 'medium' | 'low' }[] = [
    { name: 'North America', code: 'US', threats: 14, sev: 'high' },
    { name: 'Europe', code: 'EU', threats: 9, sev: 'medium' },
    { name: 'Asia Pacific', code: 'APAC', threats: 22, sev: 'critical' },
    { name: 'Latin America', code: 'LATAM', threats: 3, sev: 'low' },
    { name: 'Middle East', code: 'ME', threats: 7, sev: 'medium' },
    { name: 'Africa', code: 'AF', threats: 2, sev: 'low' },
  ];
  const sevColor: Record<string, string> = { critical: X.red, high: X.amber, medium: X.purple, low: X.teal };
  const [selected, setSelected] = useState<number | null>(null);
  const liveThreats = useLive(57, 8, 4000);

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.red}><Dot c={X.red} pulse s={4} />{Math.round(liveThreats)} Active</Badge>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, marginBottom: 10 }}>
        {regions.map((r, i) => (
          <div
            key={i}
            onClick={() => setSelected(selected === i ? null : i)}
            style={{
              padding: '6px 4px',
              borderRadius: X.rs,
              background: selected === i ? sevColor[r.sev] + '15' : X.bgAlt,
              border: `1px solid ${selected === i ? sevColor[r.sev] + '40' : X.borderLight}`,
              cursor: 'pointer',
              textAlign: 'center',
              transition: `background-color 150ms ${ease.mv}, border-color 150ms ${ease.mv}`,
              animation: `fu 150ms ${ease.o} ${i * 25}ms both`,
            }}
          >
            <M style={{ fontSize: 10, fontWeight: 700, color: X.text, display: 'block', marginBottom: 2 }}>{r.code}</M>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
              <Dot c={sevColor[r.sev]} pulse={r.sev === 'critical'} s={5} />
              <M style={{ fontSize: 8, fontWeight: 600, color: sevColor[r.sev] }}>{r.threats}</M>
            </div>
          </div>
        ))}
      </div>
      {selected !== null && (
        <div style={{ padding: '6px 8px', borderRadius: X.rs, background: X.bg, border: `1px solid ${X.borderLight}`, animation: `fu 150ms ${ease.o}` }}>
          <M style={{ fontSize: 10, fontWeight: 600, color: X.text, display: 'block', marginBottom: 2 }}>{regions[selected].name}</M>
          <div style={{ display: 'flex', gap: 8 }}>
            <M style={{ fontSize: 8, color: X.textMut }}>Threats: <span style={{ color: sevColor[regions[selected].sev], fontWeight: 600 }}>{regions[selected].threats}</span></M>
            <Badge color={sevColor[regions[selected].sev]}>{regions[selected].sev}</Badge>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        {(['critical', 'high', 'medium', 'low'] as const).map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Dot c={sevColor[s]} s={4} />
            <M style={{ fontSize: 7, color: X.textMut, textTransform: 'capitalize' }}>{s}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Access Log ───────────────────────────────────────────────────────
export function AccessLog({ title = 'Access Log', maxEntries = 8 }: { title?: string; maxEntries?: number }) {
  const X = getX();
  const tick = useTick(5000);
  const initialEntries = [
    { time: '10:42:15', user: 'admin@corp.io', action: 'SSH Login', status: 'granted' },
    { time: '10:41:58', user: 'sensor-hub-04', action: 'API Access', status: 'granted' },
    { time: '10:41:30', user: '192.168.1.99', action: 'Port Scan', status: 'denied' },
    { time: '10:40:12', user: 'deploy-bot', action: 'FW Update', status: 'granted' },
    { time: '10:39:45', user: 'unknown-mac', action: 'DHCP Req', status: 'denied' },
    { time: '10:38:22', user: 'ops@corp.io', action: 'Dashboard', status: 'granted' },
    { time: '10:37:10', user: 'cam-controller', action: 'RTSP Stream', status: 'granted' },
    { time: '10:36:05', user: '10.0.0.55', action: 'Brute Force', status: 'denied' },
  ];
  const [entries, setEntries] = useState(initialEntries);
  const [filter, setFilter] = useState<'all' | 'granted' | 'denied'>('all');

  const filtered = (filter === 'all' ? entries : entries.filter(e => e.status === filter)).slice(0, maxEntries);
  const denied = entries.filter(e => e.status === 'denied').length;

  return (
    <Card noPad style={{ width: 370 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={denied > 0 ? X.red : X.teal}>{denied} Denied</Badge>
      </div>
      <div style={{ padding: '0 14px 6px', display: 'flex', gap: 2 }}>
        {(['all', 'granted', 'denied'] as const).map(f => (
          <Btn key={f} small ghost active={filter === f} onClick={() => setFilter(f)} color={f === 'denied' ? X.red : f === 'granted' ? X.teal : X.purple}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Btn>
        ))}
      </div>
      <div style={{ padding: '0 6px 8px', maxHeight: 180, overflowY: 'auto' }}>
        {filtered.map((e, i) => (
          <div key={i} style={{
            display: 'flex', gap: 6, padding: '4px 6px', borderRadius: 3, fontFamily: X.m, fontSize: 9,
            animation: `sr 150ms ${ease.o} ${i * 20}ms both`,
            background: i % 2 === 0 ? X.bgAlt : 'transparent',
            borderLeft: `2px solid ${e.status === 'granted' ? X.teal : X.red}`,
          }}>
            <span style={{ color: X.textMut, minWidth: 44 }}>{e.time}</span>
            <span style={{ color: X.text, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.user}</span>
            <span style={{ color: X.purple, minWidth: 56 }}>{e.action}</span>
            <span style={{ color: e.status === 'granted' ? X.teal : X.red, fontWeight: 600, minWidth: 40, textAlign: 'right' }}>
              {e.status === 'granted' ? '✓ OK' : '✕ Deny'}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Vulnerability Scanner ────────────────────────────────────────────
export function VulnerabilityScanner({ title = 'Vuln Scanner', scanSpeed = 80 }: { title?: string; scanSpeed?: number }) {
  const X = getX();
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(100);
  const [vulns, setVulns] = useState({ critical: 2, high: 5, medium: 12, low: 23 });
  const total = vulns.critical + vulns.high + vulns.medium + vulns.low;
  const sevColor: Record<string, string> = { critical: X.red, high: X.amber, medium: X.purple, low: X.teal };

  const startScan = () => {
    setScanning(true);
    setProgress(0);
    setVulns({ critical: 0, high: 0, medium: 0, low: 0 });
  };

  useEffect(() => {
    if (!scanning) return;
    const i = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setScanning(false);
          setVulns({ critical: Math.floor(Math.random() * 4), high: Math.floor(Math.random() * 8) + 2, medium: Math.floor(Math.random() * 15) + 5, low: Math.floor(Math.random() * 30) + 10 });
          clearInterval(i);
          return 100;
        }
        return p + Math.random() * 3 + 0.5;
      });
    }, scanSpeed);
    return () => clearInterval(i);
  }, [scanning, scanSpeed]);

  const animTotal = useAnim(total, 800);
  // Donut segments
  const categories = [
    { label: 'Critical', count: vulns.critical, color: sevColor.critical },
    { label: 'High', count: vulns.high, color: sevColor.high },
    { label: 'Medium', count: vulns.medium, color: sevColor.medium },
    { label: 'Low', count: vulns.low, color: sevColor.low },
  ];
  let offset = 0;
  const donutSegs = categories.map(c => {
    const pct = total > 0 ? (c.count / total) * 100 : 0;
    const seg = { ...c, pct, offset };
    offset += pct;
    return seg;
  });

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Btn small onClick={startScan} color={X.purple} disabled={scanning}>{scanning ? 'Scanning…' : 'Scan'}</Btn>
      </div>
      {scanning && <Prog value={Math.min(progress, 100)} color={X.purple} h={3} style={{ marginBottom: 8 }} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <svg viewBox="0 0 36 36" style={{ width: 64, height: 64, transform: 'rotate(-90deg)' }}>
          <circle cx="18" cy="18" r="14" fill="none" stroke={X.borderLight} strokeWidth="4" />
          {donutSegs.map((s, i) => (
            <circle
              key={i}
              cx="18" cy="18" r="14"
              fill="none"
              stroke={s.color}
              strokeWidth="4"
              strokeDasharray={`${(s.pct / 100) * 87.96} ${87.96}`}
              strokeDashoffset={`${-(s.offset / 100) * 87.96}`}
              style={{ transition: `stroke-dasharray 500ms ${ease.sp}, stroke-dashoffset 500ms ${ease.sp}` }}
            />
          ))}
          <text x="18" y="19" textAnchor="middle" dominantBaseline="central" fontFamily={X.m} fontSize="8" fontWeight="800" fill={X.text} style={{ transform: 'rotate(90deg)', transformOrigin: '18px 18px' }}>
            {Math.round(animTotal)}
          </text>
        </svg>
        <div style={{ flex: 1 }}>
          {categories.map((c, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0', animation: `sr 150ms ${ease.o} ${i * 20}ms both` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Dot c={c.color} s={5} />
                <M style={{ fontSize: 9, color: X.textMut }}>{c.label}</M>
              </div>
              <M style={{ fontSize: 10, fontWeight: 700, color: c.color }}>{c.count}</M>
            </div>
          ))}
        </div>
      </div>
      <Lbl style={{ textAlign: 'center' }}>{scanning ? `Scanning… ${Math.min(Math.round(progress), 100)}%` : 'Last scan: 4m ago'}</Lbl>
    </Card>
  );
}

// ── Firewall Rules ───────────────────────────────────────────────────
export function FirewallRules({ title = 'Firewall Rules', defaultAction = 'deny' }: { title?: string; defaultAction?: 'allow' | 'deny' }) {
  const X = getX();
  const initialRules: { port: number; proto: string; action: 'allow' | 'deny'; label: string; active: boolean }[] = [
    { port: 443, proto: 'TCP', action: 'allow', label: 'HTTPS', active: true },
    { port: 22, proto: 'TCP', action: 'allow', label: 'SSH', active: true },
    { port: 80, proto: 'TCP', action: 'deny', label: 'HTTP', active: true },
    { port: 3389, proto: 'TCP', action: 'deny', label: 'RDP', active: true },
    { port: 8554, proto: 'UDP', action: 'allow', label: 'RTSP', active: false },
    { port: 161, proto: 'UDP', action: 'allow', label: 'SNMP', active: true },
    { port: 23, proto: 'TCP', action: 'deny', label: 'Telnet', active: true },
  ];
  const [rules, setRules] = useState(initialRules);

  const toggleRule = (idx: number) => {
    setRules(r => r.map((rule, i) => i === idx ? { ...rule, active: !rule.active } : rule));
  };

  const allowed = rules.filter(r => r.active && r.action === 'allow').length;
  const denied = rules.filter(r => r.active && r.action === 'deny').length;

  return (
    <Card noPad style={{ width: 350 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 4 }}>
          <Badge color={X.teal}>{allowed} Allow</Badge>
          <Badge color={X.red}>{denied} Deny</Badge>
        </div>
      </div>
      <div style={{ padding: '2px 6px 8px' }}>
        {rules.map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '5px 6px', borderRadius: 3,
            background: i % 2 === 0 ? X.bgAlt : 'transparent',
            opacity: r.active ? 1 : 0.4,
            animation: `sr 150ms ${ease.o} ${i * 15}ms both`,
            transition: `opacity 200ms ${ease.mv}`,
          }}>
            <Dot c={r.action === 'allow' ? X.teal : X.red} s={5} />
            <M style={{ fontSize: 9, fontWeight: 600, color: X.text, minWidth: 44 }}>{r.label}</M>
            <M style={{ fontSize: 8, color: X.textMut, minWidth: 28 }}>{r.proto}</M>
            <M style={{ fontSize: 9, color: X.purple, minWidth: 30 }}>:{r.port}</M>
            <Badge color={r.action === 'allow' ? X.teal : X.red} style={{ marginLeft: 'auto' }}>{r.action.toUpperCase()}</Badge>
            <button
              onClick={() => toggleRule(i)}
              style={{
                width: 28, height: 14, borderRadius: 7, border: 'none', cursor: 'pointer',
                background: r.active ? X.teal : X.border,
                position: 'relative',
                transition: `background-color 200ms ${ease.mv}`,
                flexShrink: 0,
              }}
            >
              <div style={{
                width: 10, height: 10, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 2,
                left: r.active ? 16 : 2,
                transition: `left 200ms ${ease.sp}`,
              }} />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Encryption Status ────────────────────────────────────────────────
export function EncryptionStatus({ title = 'Encryption', minKeyBits = 256 }: { title?: string; minKeyBits?: number }) {
  const X = getX();
  const channels: { name: string; algo: string; keyBits: number; status: 'active' | 'rotating' | 'error' }[] = [
    { name: 'Data at Rest', algo: 'AES-256-GCM', keyBits: 256, status: 'active' },
    { name: 'In Transit', algo: 'TLS 1.3', keyBits: 256, status: 'active' },
    { name: 'Backup', algo: 'AES-256-CBC', keyBits: 256, status: 'rotating' },
    { name: 'API Tokens', algo: 'RSA-4096', keyBits: 4096, status: 'active' },
    { name: 'Device Auth', algo: 'Ed25519', keyBits: 256, status: 'error' },
  ];
  const statusColor: Record<string, string> = { active: X.teal, rotating: X.amber, error: X.red };
  const statusLabel: Record<string, string> = { active: 'Secure', rotating: 'Rotating', error: 'Alert' };
  const [expanded, setExpanded] = useState<number | null>(null);
  const activeCount = channels.filter(c => c.status === 'active').length;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={activeCount === channels.length ? X.teal : X.amber}>{activeCount}/{channels.length} Secure</Badge>
      </div>
      {channels.map((ch, i) => (
        <div
          key={i}
          onClick={() => setExpanded(expanded === i ? null : i)}
          style={{
            padding: '6px 8px', borderRadius: X.rs, marginBottom: 3, cursor: 'pointer',
            background: expanded === i ? statusColor[ch.status] + '08' : (i % 2 === 0 ? X.bgAlt : 'transparent'),
            border: `1px solid ${expanded === i ? statusColor[ch.status] + '25' : 'transparent'}`,
            transition: `background-color 150ms ${ease.mv}, border-color 150ms ${ease.mv}`,
            animation: `fu 150ms ${ease.o} ${i * 20}ms both`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Dot c={statusColor[ch.status]} pulse={ch.status === 'rotating'} s={6} />
            <M style={{ fontSize: 10, fontWeight: 600, color: X.text, flex: 1 }}>{ch.name}</M>
            <Badge color={statusColor[ch.status]}>{statusLabel[ch.status]}</Badge>
          </div>
          {expanded === i && (
            <div style={{ marginTop: 6, paddingLeft: 12, animation: `fu 150ms ${ease.o}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                <M style={{ fontSize: 8, color: X.textMut }}>Algorithm</M>
                <M style={{ fontSize: 8, fontWeight: 600, color: X.purple }}>{ch.algo}</M>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <M style={{ fontSize: 8, color: X.textMut }}>Key Strength</M>
                <M style={{ fontSize: 8, fontWeight: 600, color: X.teal }}>{ch.keyBits}-bit</M>
              </div>
            </div>
          )}
        </div>
      ))}
    </Card>
  );
}

// ── Compliance Checker ───────────────────────────────────────────────
export function ComplianceChecker({ title = 'Compliance', threshold = 90 }: { title?: string; threshold?: number }) {
  const X = getX();
  const standards: { name: string; status: 'pass' | 'fail' | 'warning'; score: number; items: number; passed: number }[] = [
    { name: 'SOC 2', status: 'pass', score: 98, items: 64, passed: 63 },
    { name: 'HIPAA', status: 'warning', score: 87, items: 42, passed: 37 },
    { name: 'GDPR', status: 'pass', score: 95, items: 38, passed: 36 },
    { name: 'ISO 27001', status: 'fail', score: 72, items: 114, passed: 82 },
    { name: 'PCI DSS', status: 'pass', score: 100, items: 28, passed: 28 },
  ];
  const statusColor: Record<string, string> = { pass: X.teal, fail: X.red, warning: X.amber };
  const statusIcon: Record<string, string> = { pass: '✓', fail: '✕', warning: '!' };
  const overall = Math.round(standards.reduce((a, s) => a + s.score, 0) / standards.length);
  const overallAnim = useAnim(overall, 1000);
  const [showDetail, setShowDetail] = useState<number | null>(null);

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <M style={{ fontSize: 16, fontWeight: 800, color: overall >= threshold ? X.teal : overall >= threshold * 0.83 ? X.amber : X.red }}>{Math.round(overallAnim)}%</M>
      </div>
      <Prog value={overallAnim} color={overall >= threshold ? X.teal : overall >= threshold * 0.83 ? X.amber : X.red} h={3} style={{ marginBottom: 10 }} />
      {standards.map((s, i) => (
        <div
          key={i}
          onClick={() => setShowDetail(showDetail === i ? null : i)}
          style={{
            padding: '5px 0', borderBottom: i < standards.length - 1 ? `1px solid ${X.borderLight}` : 'none',
            cursor: 'pointer', animation: `sr 150ms ${ease.o} ${i * 20}ms both`,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: statusColor[s.status] + '18', color: statusColor[s.status], fontSize: 9, fontWeight: 700, fontFamily: X.m,
            }}>
              {statusIcon[s.status]}
            </div>
            <M style={{ fontSize: 10, fontWeight: 600, color: X.text, flex: 1 }}>{s.name}</M>
            <M style={{ fontSize: 10, fontWeight: 700, color: statusColor[s.status] }}>{s.score}%</M>
          </div>
          {showDetail === i && (
            <div style={{ marginTop: 4, marginLeft: 22, animation: `fu 150ms ${ease.o}` }}>
              <Prog value={s.score} color={statusColor[s.status]} h={2} style={{ marginBottom: 3 }} />
              <M style={{ fontSize: 8, color: X.textMut }}>{s.passed}/{s.items} controls passed</M>
            </div>
          )}
        </div>
      ))}
    </Card>
  );
}

// ── Security Score ───────────────────────────────────────────────────
export function SecurityScore({ title = 'Security Score', targetScore = 80 }: { title?: string; targetScore?: number }) {
  const X = getX();
  const score = 78;
  const animScore = useAnim(score, 1200);
  const categories: { name: string; value: number; color: string }[] = [
    { name: 'Network', value: 85, color: X.teal },
    { name: 'Identity', value: 72, color: X.purple },
    { name: 'Data', value: 80, color: X.indigo },
    { name: 'Endpoint', value: 65, color: X.amber },
  ];
  const [hovered, setHovered] = useState<number | null>(null);
  const scoreColor = score >= targetScore ? X.teal : score >= targetScore * 0.75 ? X.amber : X.red;

  // Radial segments: each category occupies 90 degrees of the circle
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const segmentGap = 2; // degrees of gap
  const segmentArc = (360 - segmentGap * categories.length) / categories.length;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 8, textAlign: 'center' }}>{title}</div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <svg viewBox="0 0 36 36" style={{ width: 100, height: 100 }}>
          {/* Background track */}
          <circle cx="18" cy="18" r={radius} fill="none" stroke={X.borderLight} strokeWidth="3.5" />
          {/* Category segments */}
          {categories.map((cat, i) => {
            const segFraction = segmentArc / 360;
            const valueFraction = (cat.value / 100) * segFraction;
            const startAngle = i * (segmentArc + segmentGap);
            const dashLen = valueFraction * circumference;
            const gapLen = circumference - dashLen;
            return (
              <circle
                key={i}
                cx="18" cy="18" r={radius}
                fill="none"
                stroke={cat.color}
                strokeWidth={hovered === i ? 4.5 : 3.5}
                strokeDasharray={`${dashLen} ${gapLen}`}
                strokeDashoffset={`${-(startAngle / 360) * circumference}`}
                strokeLinecap="round"
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: '18px 18px',
                  transition: `stroke-width 200ms ${ease.mv}, stroke-dasharray 600ms ${ease.sp}`,
                  filter: hovered === i ? `drop-shadow(0 0 3px ${cat.color}50)` : 'none',
                }}
                opacity={hovered !== null && hovered !== i ? 0.3 : 1}
              />
            );
          })}
          {/* Center text */}
          <text x="18" y="17" textAnchor="middle" dominantBaseline="central" fontFamily={X.m} fontSize="9" fontWeight="800" fill={scoreColor}>
            {Math.round(animScore)}
          </text>
          <text x="18" y="23" textAnchor="middle" fontFamily={X.m} fontSize="3.5" fill={X.textMut}>
            / 100
          </text>
        </svg>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {categories.map((cat, i) => (
          <div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '3px 6px', borderRadius: X.rs,
              background: hovered === i ? cat.color + '0c' : 'transparent',
              cursor: 'pointer',
              transition: `background-color 150ms ${ease.mv}`,
              animation: `sr 150ms ${ease.o} ${i * 20}ms both`,
            }}
          >
            <Dot c={cat.color} s={5} />
            <M style={{ fontSize: 9, color: X.text, flex: 1 }}>{cat.name}</M>
            <Prog value={cat.value} color={cat.color} h={2} style={{ flex: 1 }} />
            <M style={{ fontSize: 9, fontWeight: 700, color: cat.color, minWidth: 22, textAlign: 'right' }}>{cat.value}</M>
          </div>
        ))}
      </div>
      <Lbl style={{ textAlign: 'center', marginTop: 8 }}>Updated 2m ago</Lbl>
    </Card>
  );
}
