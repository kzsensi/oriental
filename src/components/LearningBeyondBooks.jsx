import { useEffect, useRef } from 'react';
import { useSiteContent } from '../context/siteContent.js';

export default function LearningBeyondBooks() {
  const { learningMoments } = useSiteContent();
  const stageRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const onScroll = () => {
      const rect = stage.getBoundingClientRect();
      const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - rect.top - rect.height / 2) / window.innerHeight));
      stage.style.setProperty('--parallax', progress.toFixed(3));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section id="learning" className="learning-section" aria-labelledby="learning-title">
      <div className="learning-stage" ref={stageRef}>
        <div className="learning-copy" data-reveal>
          <p className="section-kicker">Beyond the timetable</p>
          <h2 id="learning-title">Where possibility<br /><strong>feels endless.</strong></h2>
          <p>Children discover their voice through sport, culture, creative work, teamwork and shared school experiences.</p>
        </div>
        <div className="learning-orbit" data-stagger>
          {[...learningMoments, ...learningMoments].map((moment, index) => {
            const isClone = index >= learningMoments.length;
            const momentIndex = index % learningMoments.length;

            return (
              <figure
                className={`learning-bubble bubble-${momentIndex + 1} ${isClone ? 'is-clone' : ''}`}
                key={`${moment.label}-${index}`}
                aria-hidden={isClone ? 'true' : undefined}
              >
                <img src={moment.image} alt={isClone ? '' : `${moment.label} at Oriental Public School`} />
                <figcaption>{moment.label}</figcaption>
              </figure>
            );
          })}
          <span className="learning-dot dot-red" /><span className="learning-dot dot-blue" />
          <span className="learning-dot dot-gold" /><span className="learning-dot dot-cyan" />
        </div>
      </div>
    </section>
  );
}
