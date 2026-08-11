import { ArrowRight } from 'lucide-react';
import { useSiteContent } from '../context/siteContent.js';

export default function ManagementSection() {
  const { management } = useSiteContent();

  return (
    <section className="management-section" aria-labelledby="management-title">
      <div className="section-shell management-heading" data-reveal>
        <div>
          <p className="section-kicker">School leadership</p>
          <h2 id="management-title" className="section-title">People who guide<br />the community.</h2>
        </div>
        <p className="section-intro">Leadership across academic and school operations works together to create a disciplined, encouraging environment for every learner.</p>
      </div>

      <div className="section-shell management-rail" data-stagger>
        {management.map((person, index) => (
          <article className={`management-person person-${index + 1}`} key={person.name}>
            <div className="management-photo"><img src={person.image} alt={`${person.name}, ${person.role}`} /></div>
            <p>{person.role}</p>
            <h3>{person.name}</h3>
          </article>
        ))}
      </div>
      <div className="section-shell management-action"><a href="/about-us#leadership">Meet our faculty <ArrowRight size={18} /></a></div>
    </section>
  );
}
