import { ArrowRight } from 'lucide-react';
import { routeLinks, useSiteContent } from '../context/siteContent.js';

export default function PrincipalPreview() {
  const { principal } = useSiteContent();

  return (
    <section className="principal-preview" aria-labelledby="principal-preview-title">
      <div className="principal-preview-media">
        <img src={principal.image} alt={`${principal.name}, ${principal.role}`} data-parallax="7" />
        <span>From the Principal's Desk</span>
      </div>
      <div className="principal-preview-copy" data-reveal>
        <p className="section-kicker light">A message to our community</p>
        <h2 id="principal-preview-title">Education should help every child recognise what they can become.</h2>
        <div className="principal-signoff"><strong>{principal.name}</strong><span>{principal.role}</span></div>
        <a href={routeLinks.principal}>Read the full message <ArrowRight size={18} /></a>
      </div>
    </section>
  );
}
