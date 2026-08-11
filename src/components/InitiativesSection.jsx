import { ArrowRight } from 'lucide-react';
import { useSiteContent } from '../context/siteContent.js';

export default function InitiativesSection() {
  const { initiatives } = useSiteContent();

  return (
    <section id="initiatives" className="initiatives-section" aria-labelledby="initiatives-title">
      <div className="section-shell initiatives-heading" data-reveal>
        <div>
          <p className="section-kicker">Our initiatives</p>
          <h2 id="initiatives-title" className="section-title">Small experiences.<br />Lasting confidence.</h2>
        </div>
        <a href="#contact">Plan a campus visit <ArrowRight size={18} /></a>
      </div>
      <div className="initiatives-marquee" aria-label="Oriental Public School initiatives gallery">
        <div className="initiatives-track">
          {[...initiatives, ...initiatives].map((image, index) => (
            <figure className={`initiative-frame frame-${(index % 4) + 1}`} key={`${image}-${index}`} aria-hidden={index >= initiatives.length ? 'true' : undefined}>
              <img src={image} alt={index < initiatives.length ? `Oriental Public School initiative ${index + 1}` : ''} />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
