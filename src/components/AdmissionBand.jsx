import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useSiteContent } from '../context/siteContent.js';

export default function AdmissionBand() {
  const { school } = useSiteContent();
  const [submitted, setSubmitted] = useState(false);

  const submitEnquiry = (event) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <section id="admissions" className="admission-band" aria-labelledby="admission-title">
      <div className="admission-band-copy" data-reveal>
        <p className="section-kicker light">Admissions at Oriental</p>
        <h2 id="admission-title">A thoughtful beginning<br />starts with a conversation.</h2>
        <p>Share a few details and the school office can guide you through availability, documents and the next campus visit.</p>
        <div className="admission-direct-contact">
          <a href={`tel:${school.phone}`}><span>Call</span><strong>{school.phone}</strong></a>
          <a href={`mailto:${school.email}`}><span>Email</span><strong>{school.email}</strong></a>
        </div>
      </div>

      <form className="admission-enquiry-form" onSubmit={submitEnquiry} data-reveal>
        <div className="enquiry-field">
          <label htmlFor="enquiry-name">Parent / Student name</label>
          <input id="enquiry-name" name="name" type="text" required autoComplete="name" />
        </div>
        <div className="enquiry-field">
          <label htmlFor="enquiry-email">Email address</label>
          <input id="enquiry-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="enquiry-field">
          <label htmlFor="enquiry-phone">Contact number</label>
          <input id="enquiry-phone" name="phone" type="tel" required autoComplete="tel" />
        </div>
        <div className="enquiry-field enquiry-field-wide">
          <label htmlFor="enquiry-comment">Comment or class applying for</label>
          <textarea id="enquiry-comment" name="comment" rows="2" />
        </div>
        <button type="submit">Submit your query <ArrowUpRight aria-hidden="true" /></button>
        <p className="enquiry-status" aria-live="polite">{submitted ? 'Thank you. Your enquiry has been recorded for the school office.' : 'All fields marked by the form are handled as an admission enquiry.'}</p>
      </form>
    </section>
  );
}
