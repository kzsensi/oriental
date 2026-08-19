import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Facebook,
  Instagram,
  Mail,
  Menu,
  Phone,
  Search,
  X,
  Youtube,
} from 'lucide-react';
import { routeLinks, useSiteContent } from '../context/siteContent.js';

export default function Header() {
  const { school, nav, announcements } = useSiteContent();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('menu-is-open', menuOpen || searchOpen);
    return () => document.body.classList.remove('menu-is-open');
  }, [menuOpen, searchOpen]);

  return (
    <header className="site-header">
      <div className="utility-bar">
        <div className="utility-inner">
          <a href="#admissions" className="utility-admission">Admission enquiries open</a>
          <div className="utility-contact">
            <a href={`tel:${school.phone}`}><Phone size={13} />{school.callLabel}</a>
            <a href={`mailto:${school.email}`}><Mail size={14} />{school.email}</a>
          </div>
        </div>
      </div>

      <div className="identity-header">
        <a href={routeLinks.home} className="identity-left" aria-label="The Oriental Public School home">
          <img src={school.logo} alt="The Oriental Public School logo" className="school-logo" />
          <div className="school-copy">
            <span className="school-title">{school.name}</span>
            <div className="school-meta-lines">
              <p className="rte-line">{school.rte}</p>
              <p className="affiliation-line">{school.affiliation}</p>
              <p className="address-line">{school.addressLine} <span>Ph: {school.officePhone}</span></p>
            </div>
          </div>
        </a>

        <div className="identity-right" aria-label="School quick links">
          <a href={routeLinks.principal} className="header-quick-link">
            <span>Leadership</span>
            <strong>Principal's Desk</strong>
          </a>
          <a href="#admissions" className="header-quick-link">
            <span>2026-27</span>
            <strong>Admission Enquiry</strong>
          </a>
          <div className="header-socials" aria-label="Social media">
            <a href="https://facebook.com" aria-label="Facebook" title="Facebook"><Facebook size={17} /></a>
            <a href="https://instagram.com" aria-label="Instagram" title="Instagram"><Instagram size={17} /></a>
            <a href="https://youtube.com" aria-label="YouTube" title="YouTube"><Youtube size={18} /></a>
          </div>
        </div>
      </div>

      <nav className="nav-bar" aria-label="Main navigation">
        <div className="nav-inner">
          <div className="nav-links">
            {nav.map(([label, href]) => (
              <a href={href} key={label} className={window.location.pathname === href ? 'active' : ''}>
                {label}
              </a>
            ))}
          </div>
          <div className="nav-tools">
            <button onClick={() => setSearchOpen(true)} aria-label="Search website" title="Search"><Search size={18} /></button>
            <button onClick={() => setMenuOpen(true)} aria-label="Open menu" title="Menu"><Menu size={20} /></button>
          </div>
        </div>
      </nav>

      <div className="announcement-strip">
        <span className="announcement-label">School updates</span>
        <div className="announcement-viewport">
          <div className="announcement-track">
            {[...announcements, ...announcements].map((item, index) => (
              <a href={item.href || routeLinks.notices} key={`${item.text}-${index}`}>{item.text}</a>
            ))}
          </div>
        </div>
      </div>

      <div className={`drawer-backdrop ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)} />
      <aside className={`mobile-drawer ${menuOpen ? 'open' : ''}`} aria-hidden={!menuOpen}>
        <div className="drawer-head">
          <img src={school.logo} alt="" />
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={22} /></button>
        </div>
        <p className="drawer-eyebrow">Main navigation</p>
        <nav>
          {nav.map(([label, href]) => <a href={href} key={label} onClick={() => setMenuOpen(false)}>{label}<ArrowRight size={16} /></a>)}
          <a href={routeLinks.admin}>Admin Portal<ArrowRight size={16} /></a>
        </nav>
        <div className="drawer-contact">
          <a href={`tel:${school.phone}`}><Phone size={16} />{school.phone}</a>
          <a href={`mailto:${school.email}`}><Mail size={16} />{school.email}</a>
        </div>
      </aside>

      {searchOpen && (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search Oriental website">
          <button className="search-overlay-close" onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={25} /></button>
          <div className="search-overlay-inner">
            <p>Search Oriental</p>
            <div className="search-field">
              <Search size={24} />
              <input autoFocus type="search" placeholder="Search notices, facilities, people..." />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
