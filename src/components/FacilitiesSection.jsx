import { ArrowUpRight } from 'lucide-react';
import { useSiteContent } from '../context/siteContent.js';

export default function FacilitiesSection() {
  const { facilities } = useSiteContent();

  return (
    <section id="facilities" className="facilities-section" aria-labelledby="facilities-title">
      <div className="section-shell facilities-heading" data-reveal>
        <div>
          <p className="section-kicker light">Learning environment</p>
          <h2 id="facilities-title" className="section-title light-title">A school day with<br />room to grow.</h2>
        </div>
        <p>Classroom learning, opportunity, campus life and participation come together as one connected student experience.</p>
      </div>
      <div className="facilities-grid" data-stagger>
        {facilities.map((facility) => (
          <article className="facility-panel" key={facility.title}>
            <img src={facility.image} alt={facility.title} />
            <div className="facility-shade" />
            <span>{facility.number}</span>
            <div><h3>{facility.title}</h3><p>{facility.body}</p></div>
            <ArrowUpRight size={22} />
          </article>
        ))}
      </div>
    </section>
  );
}
