import { useEffect, useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { useSiteContent } from '../context/siteContent.js';

export default function AdmissionPopup() {
  const { popup } = useSiteContent();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!popup.enabled || window.sessionStorage.getItem('oriental-popup-dismissed')) return undefined;

    let revealed = false;
    const isCompactViewport = window.matchMedia('(max-width: 680px)').matches;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      setOpen(true);
      window.removeEventListener('scroll', revealOnScroll);
      if (timer) window.clearTimeout(timer);
    };
    const revealOnScroll = () => {
      if (window.scrollY > 320) reveal();
    };
    const timer = isCompactViewport ? null : window.setTimeout(reveal, 4500);

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', revealOnScroll);
      if (timer) window.clearTimeout(timer);
    };
  }, [popup.enabled]);

  const close = () => {
    setOpen(false);
    window.sessionStorage.setItem('oriental-popup-dismissed', 'true');
  };

  if (!open) return null;

  return (
    <div className="admission-popup-backdrop" role="presentation" onMouseDown={close}>
      <section className="admission-popup" role="dialog" aria-modal="true" aria-labelledby="admission-popup-title" onMouseDown={(event) => event.stopPropagation()}>
        <button className="popup-close" onClick={close} aria-label="Close admission announcement"><X size={21} /></button>
        <div className="popup-media"><img src={popup.image} alt="Students of The Oriental Public School" /></div>
        <div className="popup-copy">
          <p className="section-kicker">{popup.eyebrow}</p>
          <h2 id="admission-popup-title">{popup.title}</h2>
          <p>{popup.body}</p>
          <a href={popup.actionHref}>{popup.actionLabel}<ArrowUpRight size={18} /></a>
          <button className="popup-secondary" onClick={close}>Continue to website</button>
        </div>
      </section>
    </div>
  );
}
