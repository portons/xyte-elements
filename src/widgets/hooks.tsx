import { useState, useEffect } from "react";

export function useAnim(t: number, d = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => { let s: number | null = null; const f = (ts: number) => { if (!s) s = ts; const p = Math.min((ts - s) / d, 1); setV(t * (1 - Math.pow(1 - p, 4))); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); }, [t, d]);
  return v;
}

export function useLive(b: number, vr = 3, iv = 1200) {
  const [v, setV] = useState(b);
  useEffect(() => { const i = setInterval(() => setV(b + (Math.random() - .5) * vr * 2), iv); return () => clearInterval(i); }, [b, vr, iv]);
  return v;
}

export function useTick(iv = 1000) {
  const [t, setT] = useState(0);
  useEffect(() => { const i = setInterval(() => setT(c => c + 1), iv); return () => clearInterval(i); }, [iv]);
  return t;
}
