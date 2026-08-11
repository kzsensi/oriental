import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSiteContent } from '../context/siteContent.js';

gsap.registerPlugin(ScrollTrigger);

export default function SchoolProfileShowcase() {
  const { legacyProfile } = useSiteContent();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return undefined;

    const media = gsap.matchMedia();
    media.add('(min-width: 961px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      return () => tween.kill();
    });

    return () => media.revert();
  }, []);

  return (
    <section ref={sectionRef} className="profile-story" aria-labelledby="profile-story-title">
      <div ref={trackRef} className="profile-story-track">
        <header className="profile-story-intro">
          <img className="profile-story-mark" src="/image/logo.png" alt="" data-parallax="7" />
          <p className="section-kicker light">The school profile</p>
          <h2 id="profile-story-title">Four chapters.<br />One shared purpose.</h2>
          <p>Education, opportunity, senior learning and the school's published board profile, presented as one continuous story.</p>
          <span>Scroll to explore</span>
        </header>

        {legacyProfile.items.map((item, index) => (
          <article className={`profile-story-panel profile-tone-${index + 1}`} key={item.title}>
            <div className="profile-panel-number">0{index + 1}</div>
            <figure>
              <img src={item.image} alt={item.title} />
              <span className="profile-image-index">OPS / 0{index + 1}</span>
            </figure>
            <div className="profile-panel-copy">
              <p>{item.eyebrow}</p>
              <h3>{item.title}</h3>
              {item.stat && <strong>{item.stat}</strong>}
              <div>{item.body}</div>
            </div>
          </article>
        ))}
      </div>
      <p className="profile-source-note">{legacyProfile.sourceNote}</p>
    </section>
  );
}
