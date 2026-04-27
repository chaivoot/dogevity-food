import { useState, useEffect, useRef } from 'react';

export default function Counter({ target, suffix }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let v = 0;
      const step = target / 60;
      const t = setInterval(() => {
        v += step;
        if (v >= target) { setVal(target); clearInterval(t); }
        else setVal(Math.floor(v));
      }, 16);
      obs.disconnect();
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <div className="stat-num" ref={ref}>{val}{suffix}</div>;
}
