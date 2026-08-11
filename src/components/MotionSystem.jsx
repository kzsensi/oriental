import { useLayoutEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function MotionSystem({ routeKey }) {
  const progressRef = useRef(null);

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    });

    const updateLenis = (time) => lenis.raf(time * 1000);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const context = gsap.context(() => {
      const introTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
      introTimeline
        .from('.school-logo', { opacity: 0, y: -12, duration: 0.55 })
        .from('.school-copy > *', { opacity: 0, y: -10, duration: 0.45, stagger: 0.06 }, '-=0.32')
        .from('.nav-bar, .announcement-strip', { opacity: 0, y: -8, duration: 0.42, stagger: 0.08 }, '-=0.2')
        .from('.hero-eyebrow', { opacity: 0, x: -20, duration: 0.5 }, '-=0.15')
        .from('.hero-clean-title span', { opacity: 0, y: 42, duration: 0.72, stagger: 0.1 }, '-=0.32')
        .from('.hero-clean-subtitle, .hero-clean-actions', { opacity: 0, y: 22, duration: 0.55, stagger: 0.1 }, '-=0.4');

      const revealGroups = gsap.utils.toArray('[data-reveal]');
      revealGroups.forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 44 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: { trigger: element, start: 'top 88%', once: true },
          },
        );
      });

      const staggerGroups = gsap.utils.toArray('[data-stagger]');
      staggerGroups.forEach((group) => {
        gsap.fromTo(
          group.children,
          { opacity: 0, y: 34 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: group, start: 'top 86%', once: true },
          },
        );
      });

      gsap.utils.toArray('[data-parallax]').forEach((element) => {
        const speed = Number(element.dataset.parallax || 12);
        gsap.fromTo(
          element,
          { yPercent: -speed },
          {
            yPercent: speed,
            ease: 'none',
            scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
          },
        );
      });

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`;
        },
      });
    });

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 250);

    return () => {
      window.clearTimeout(refreshTimer);
      context.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, [routeKey]);

  return <div className="site-scroll-progress" aria-hidden="true"><span ref={progressRef} /></div>;
}
