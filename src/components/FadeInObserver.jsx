import { useEffect } from 'react';

export default function FadeInObserver() {
  useEffect(() => {
    const fallback = setTimeout(() => {
      document.querySelectorAll('.fi').forEach(el => el.classList.add('v'));
    }, 400);
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('v');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0, rootMargin: '300px 0px 300px 0px' });
    document.querySelectorAll('.fi').forEach(el => obs.observe(el));
    return () => { clearTimeout(fallback); obs.disconnect(); };
  }, []);
  return null;
}
