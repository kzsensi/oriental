import { useState } from 'react';
import { useSiteContent } from '../context/siteContent.js';

export default function ToppersSection() {
  const { toppers } = useSiteContent();
  const [activeClass, setActiveClass] = useState('classXII');
  const students = toppers[activeClass];

  return (
    <section id="toppers" className="toppers-section" aria-labelledby="toppers-title">
      <div className="section-shell toppers-header" data-reveal>
        <div>
          <p className="section-kicker">Academic distinction</p>
          <h2 id="toppers-title" className="section-title">Results worth<br />celebrating.</h2>
        </div>
        <div className="class-switch" aria-label="Select topper class">
          <button className={activeClass === 'classX' ? 'active' : ''} onClick={() => setActiveClass('classX')}>Class X</button>
          <button className={activeClass === 'classXII' ? 'active' : ''} onClick={() => setActiveClass('classXII')}>Class XII</button>
        </div>
      </div>

      <div className="section-shell topper-grid" key={activeClass} data-stagger>
        {students.map((student, index) => (
          <article className="topper-card" key={student.name} style={{ '--delay': `${index * 55}ms` }}>
            <div className="topper-photo"><img src={student.image} alt={`${student.name}, Oriental Public School topper`} /></div>
            <div className="topper-copy">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div><h3>{student.name}</h3><p>{student.marks}</p></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
