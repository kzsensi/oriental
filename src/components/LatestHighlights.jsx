import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useSiteContent } from '../context/siteContent.js';

export default function LatestHighlights() {
  const { highlights } = useSiteContent();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || highlights.length < 2) return undefined;
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % highlights.length), 1900);
    return () => window.clearInterval(timer);
  }, [highlights.length, paused]);

  return (
    <section className="highlights-section" aria-labelledby="highlights-title">
      <div className="section-shell highlights-heading-row" data-reveal>
        <div>
          <p className="section-kicker">Life at Oriental</p>
          <h2 id="highlights-title" className="section-title">What's happening<br />at our school.</h2>
        </div>
        <p className="section-intro">A living view of the moments that shape learning, character and confidence across the campus.</p>
      </div>

      <div
        className="section-shell highlights-grid"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div className="highlight-image-stage" aria-hidden="true" data-reveal>
          {highlights.map((item, index) => (
            <figure
              className={`highlight-image-card ${index === activeIndex ? 'active' : ''}`}
              key={item.title}
              style={{ '--item-index': index }}
            >
              <img src={item.image} alt="" />
              <figcaption>{String(index + 1).padStart(2, '0')} / {String(highlights.length).padStart(2, '0')}</figcaption>
            </figure>
          ))}
        </div>

        <div className="highlight-story-list" data-stagger>
          {highlights.map((item, index) => (
            <a
              className={`highlight-story ${index === activeIndex ? 'active' : ''}`}
              href={item.href}
              key={item.title}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
            >
              <span className="highlight-number">{String(index + 1).padStart(2, '0')}</span>
              <span className="highlight-copy"><small>{item.label}</small><strong>{item.title}</strong></span>
              <ArrowRight size={20} />
              {index === activeIndex && <span className={`highlight-progress ${paused ? 'paused' : ''}`} />}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
