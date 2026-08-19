import { Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { useSiteContent } from '../context/siteContent.js';

export default function QuickAnswersSection() {
  const { school } = useSiteContent();
  const answers = [
    {
      icon: MapPin,
      question: 'Where is Oriental Public School located?',
      answer: `${school.shortName} is located at ${school.addressLine}.`,
    },
    {
      icon: Phone,
      question: 'How can parents contact Oriental Public School Bokaro?',
      answer: `Call ${school.phone} or email ${school.email} for school office and admission enquiries.`,
    },
    {
      icon: UserRound,
      question: 'Who is the Principal of The Oriental Public School?',
      answer: `${school.principal} is the Director and Principal of The Oriental Public School, Bandhdih, Bokaro.`,
    },
  ];

  return (
    <section className="quick-answers-section" aria-labelledby="quick-answers-title">
      <div className="section-shell">
        <div className="quick-answers-heading" data-reveal>
          <p className="section-kicker">Quick answers</p>
          <h2 id="quick-answers-title" className="section-title">Oriental Public School Bokaro</h2>
          <p>Essential school details for parents searching for The Oriental Public School in Jainamore, Bandhdih and Bokaro.</p>
        </div>
        <div className="quick-answers-grid" data-stagger>
          {answers.map(({ icon: Icon, question, answer }) => (
            <article key={question}>
              <Icon size={22} aria-hidden="true" />
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
          <article>
            <Mail size={22} aria-hidden="true" />
            <h3>What can families find on this website?</h3>
            <p>Families can view notices, toppers, facilities, the Principal's Desk, school profile and admission enquiry details.</p>
          </article>
        </div>
      </div>
    </section>
  );
}
