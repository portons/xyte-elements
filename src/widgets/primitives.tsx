import React from "react";
import { useState, useEffect, useRef } from "react";
import { buildRuntimeX } from "../theme/themes";
import type { ThemeId } from "../explorer/types";
import type { XyteWidgetMode } from "../explorer/types";

let X = buildRuntimeX("xyte_classic_dark", "modern");

export function setWidgetRuntimeTheme(themeId: ThemeId, mode: XyteWidgetMode = "modern") {
  X = buildRuntimeX(themeId, mode);
}

export function getX() { return X; }

export const ease = { o: "cubic-bezier(0,0,.2,1)", sp: "cubic-bezier(.34,1.56,.64,1)", mv: "cubic-bezier(.4,0,.2,1)" };

export function normalizeCardWidth(width: string | number | undefined) {
  if (typeof width === "number") return `min(100%, ${width}px)`;
  if (typeof width === "string" && /^[0-9.]+px$/.test(width.trim())) {
    return `min(100%, ${width.trim()})`;
  }
  return width;
}

export function Card({ children, style, delay = 0, glow, noPad, onClick }: {
  children?: React.ReactNode; style?: React.CSSProperties; delay?: number; glow?: string; noPad?: boolean; onClick?: () => void;
}) {
  const [h, setH] = useState(false);
  const resolvedStyle: React.CSSProperties = { ...(style || {}) };
  if (resolvedStyle.width) {
    resolvedStyle.width = normalizeCardWidth(resolvedStyle.width as string | number);
  }
  resolvedStyle.maxWidth = "100%";
  resolvedStyle.minWidth = resolvedStyle.minWidth ?? 0;

  return (
    <div onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} onClick={onClick} style={{
      background: X.gradCard, borderRadius: X.r, border: `1px solid ${h ? X.borderHov : X.border}`,
      boxShadow: h ? X.shHov : X.sh,
      padding: noPad ? 0 : 20,
      transition: `border-color 200ms ${ease.o}, box-shadow 200ms ${ease.o}, transform 200ms ${ease.o}`,
      position: "relative",
      overflow: "hidden",
      cursor: onClick ? "pointer" : "default",
      animation: `si 300ms ${ease.o} ${delay}ms both`,
      ...resolvedStyle,
    }}>
      {glow && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${glow}60, transparent)` }} />}
      {children}
    </div>
  );
}

export const Lbl = ({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) => <div style={{ fontFamily: X.m, fontSize: 10, color: X.textMut, textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 600, lineHeight: 1, marginBottom: 3, ...style }}>{children}</div>;
export const M = ({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) => <span style={{ fontFamily: X.m, lineHeight: 1.3, ...style }}>{children}</span>;
export const Dot = ({ c, pulse, s = 6 }: { c: string; pulse?: boolean; s?: number }) => <span style={{ display: "inline-block", width: s, height: s, borderRadius: "50%", background: c, flexShrink: 0, animation: pulse ? "br 2s ease infinite" : "none", boxShadow: pulse ? `0 0 6px ${c}50` : "none" }} />;

export function Badge({ children, color, solid, style: s }: {
  children?: React.ReactNode; color?: string; solid?: boolean; style?: React.CSSProperties;
}) {
  const c = color || X.purple;
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: solid ? "3px 8px" : "2px 7px", borderRadius: 16, background: solid ? c : c + "18", color: solid ? "#fff" : c, fontFamily: X.m, fontSize: 10, fontWeight: 600, lineHeight: 1, ...s }}>{children}</span>;
}

export function Btn({ children, onClick, color, small, ghost, active, disabled, style: s }: {
  children?: React.ReactNode; onClick?: () => void; color?: string; small?: boolean; ghost?: boolean; active?: boolean; disabled?: boolean; style?: React.CSSProperties;
}) {
  const c = color || X.purple;
  const [hov, setHov] = useState(false);
  const bg = ghost ? (active ? c + "15" : hov ? c + "0a" : "transparent") : (disabled ? X.border : c);
  const clr = ghost ? (active ? c : X.textMut) : "#fff";
  const brd = ghost ? `1px solid ${active ? c + "30" : X.border}` : "none";
  return (
    <button onClick={disabled ? undefined : onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      padding: small ? "3px 8px" : "6px 14px", borderRadius: small ? 12 : X.rs,
      border: brd, background: bg, color: clr, fontFamily: X.m, fontSize: small ? 9 : 10,
      fontWeight: 600, cursor: disabled ? "default" : "pointer", opacity: disabled ? .4 : 1,
      transition: `background-color 150ms ${ease.mv}, border-color 150ms ${ease.mv}, color 150ms ${ease.mv}, box-shadow 150ms ${ease.mv}, transform 150ms ${ease.mv}`, display: "inline-flex", alignItems: "center", gap: 4, ...s,
    }}>{children}</button>
  );
}

export function Prog({ value = 0, color, h = 3, style: s }: {
  value?: number; color?: string; h?: number; style?: React.CSSProperties;
}) {
  const c = color || X.purple;
  return (
    <div style={{ height: h, borderRadius: h, background: X.borderLight, overflow: "hidden", ...s }}>
      <div style={{ height: "100%", borderRadius: h, width: `${Math.min(Math.max(value, 0), 100)}%`, background: c, transition: `width 500ms ${ease.sp}` }} />
    </div>
  );
}

export function Slider({ value, onChange, min = 0, max = 100, color, label, unit = "" }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; color?: string; label?: string; unit?: string;
}) {
  const c = color || X.purple;
  const pct = ((value - min) / (max - min)) * 100;
  const ref = useRef<HTMLDivElement>(null);
  const handle = (e: React.MouseEvent | MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    onChange(Math.round(min + p * (max - min)));
  };
  const [drag, setDrag] = useState(false);
  useEffect(() => {
    if (!drag) return;
    const mv = (e: MouseEvent) => handle(e);
    const up = () => setDrag(false);
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up); };
  }, [drag]);
  return (
    <div>
      {label && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}><Lbl>{label}</Lbl><M style={{ fontSize: 10, color: c, fontWeight: 700 }}>{value}{unit}</M></div>}
      <div ref={ref} onMouseDown={(e) => { setDrag(true); handle(e as any); }} style={{ height: 20, display: "flex", alignItems: "center", cursor: "pointer" }}>
        <div style={{ flex: 1, height: 3, borderRadius: 2, background: X.borderLight, position: "relative" }}>
          <div style={{ height: "100%", borderRadius: 2, width: `${pct}%`, background: c, transition: drag ? "none" : `width 200ms ${ease.mv}` }} />
          <div style={{ position: "absolute", top: -5, left: `calc(${pct}% - 6px)`, width: 12, height: 12, borderRadius: "50%", background: c, boxShadow: `0 0 8px ${c}40`, transition: drag ? "none" : `left 200ms ${ease.mv}` }} />
        </div>
      </div>
    </div>
  );
}

export function XyteLogo({ s = 16 }: { s?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <svg width={s * 4} height={s} viewBox="0 0 82 21" fill="none" style={{ display: "block" }}>
        <path d="M13.6 12.8c-.5.52-.79 1.22-.79 1.95s.29 1.43.79 1.95l3.93 4 .04.04 2.92-2.98-5.89-5.99-1.01 1.03z" fill={X.text}/>
        <path d="M17.52.25l-7.27 7.27L3.03.3 2.98.26 0 3.24l7.27 7.26L.01 17.77l2.98 2.98L20.5 3.23 17.52.25z" fill={X.text}/>
        <path d="M32.67 7.58L25.8.26l-2.74 2.92 7.7 8.21v9.36h3.87V11.33L42.28 3.17 39.54.25l-6.87 7.33z" fill={X.text}/>
        <path d="M46.13 4.41h6.42v16.34h3.81V4.41h6.42V.25H46.13v4.16z" fill={X.text}/>
        <path d="M82 4.41V.25H67.91v20.5H82v-4.16H71.82v-4.01h6.55V8.42h-6.55V4.41H82z" fill={X.text}/>
      </svg>
      <div style={{ padding: "2px 5px", borderRadius: 5, background: `linear-gradient(135deg, ${X.purple}25, ${X.pink}18)`, border: `1px solid ${X.purple}30`, display: "flex", alignItems: "center", gap: 2 }}>
        <span style={{ fontSize: 8, fontWeight: 800, background: X.gradPrimary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span>
        <svg width="7" height="7" viewBox="0 0 16 16" style={{ display: "block" }}><path d="M8 0l1.8 6.2L16 8l-6.2 1.8L8 16l-1.8-6.2L0 8l6.2-1.8z" fill={X.purple} opacity=".7"/></svg>
      </div>
    </div>
  );
}

export function Section({ title, desc, children, cols }: {
  title: string; desc: string; children?: React.ReactNode; cols?: number;
}) {
  return (
    <section style={{ marginBottom: 32 }}>
      <div style={{ marginBottom: 6 }}><h2 style={{ fontSize: 16, fontWeight: 800, color: X.text, letterSpacing: "-.01em" }}>{title}</h2></div>
      <p style={{ fontSize: 11, color: X.textMut, marginBottom: 14, fontFamily: X.m }}>{desc}</p>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-start" }}>{children}</div>
    </section>
  );
}

export const CardTitle = ({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) => <div style={{ fontSize: 14, fontWeight: 700, color: X.text, fontFamily: X.m, lineHeight: 1.3, ...style }}>{children}</div>;
