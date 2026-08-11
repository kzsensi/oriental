import { ArrowLeft, Compass, Quote, Target } from 'lucide-react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { useSiteContent } from '../context/siteContent.js';

function InnerHero({ eyebrow, title, image, position = 'center' }) {
  return (
    <section className="inner-hero">
      <img src={image} alt="" style={{ objectPosition: position }} />
      <div className="inner-hero-shade" />
      <div className="section-shell inner-hero-copy">
        <a href="/"><ArrowLeft size={17} />Back to home</a>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
      </div>
    </section>
  );
}

export function AboutPage() {
  const { about, school, faculty } = useSiteContent();

  return (
    <>
      <Header />
      <main>
        <InnerHero eyebrow={about.eyebrow} title={about.title} image="/oriental/ops3d.jpg" position="center 46%" />

        <section className="about-story section-shell">
          <div className="about-story-lead">
            <p className="section-kicker">Our school</p>
            <h2>{about.intro}</h2>
          </div>
          <div className="about-story-body">
            {about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </section>

        <section className="about-values">
          <div className="section-shell">
            <p className="section-kicker light">What guides us</p>
            <h2 className="section-title light-title">Learning with purpose.<br />Growing with values.</h2>
            <div className="values-grid">
              {about.values.map(([title, body], index) => (
                <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{body}</p></article>
              ))}
            </div>
          </div>
        </section>

        <section id="leadership" className="faculty-section section-shell">
          <header>
            <div><p className="section-kicker">Faculty</p><h2 className="section-title">Experience in<br />every classroom.</h2></div>
            <p>Subject specialists listed by the school bring years of classroom experience to the senior learning journey.</p>
          </header>
          <div className="faculty-grid">
            {faculty.map((person) => (
              <article key={person.name}>
                <img src={person.image} alt={`${person.name}, ${person.subject} faculty`} />
                <span>{person.subject}</span><h3>{person.name}</h3><p>{person.qualification} · {person.experience}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="about-location">
          <div className="section-shell">
            <div><p className="section-kicker light">School identity</p><h2>{school.addressLine}</h2></div>
            <dl><div><dt>RTE Code</dt><dd>BOK/2022-23/13</dd></div><div><dt>UDISE</dt><dd>20130702412</dd></div><div><dt>Office</dt><dd>{school.phone}</dd></div></dl>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export function PrincipalPage() {
  const { principal } = useSiteContent();

  return (
    <>
      <Header />
      <main className="principal-page">
        <InnerHero eyebrow="Leadership at Oriental" title="From the Principal's Desk" image="/oriental/specialday.jpg" position="center 35%" />
        <section className="principal-editorial section-shell">
          <div className="principal-editorial-copy">
            <p className="section-kicker">A message to students and parents</p>
            <Quote size={34} />
            <h2>{principal.quote}</h2>
            <div className="principal-long-message">
              {principal.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="principal-page-signoff"><strong>{principal.name}</strong><span>{principal.role}<br />The Oriental Public School, Bandhdih</span></div>
          </div>
          <aside className="principal-editorial-media">
            <figure><img src={principal.image} alt={`${principal.name}, ${principal.role}`} /><figcaption><strong>{principal.name}</strong><span>{principal.role}</span></figcaption></figure>
            <div className="vision-mission">
              <article><Compass size={22} /><div><h3>Our Vision</h3><p>To nurture confident learners with strong values, curiosity and a sense of responsibility to their community.</p></div></article>
              <article><Target size={22} /><div><h3>Our Mission</h3><p>To combine purposeful academics, participation and personal guidance in a healthy learning environment.</p></div></article>
            </div>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
