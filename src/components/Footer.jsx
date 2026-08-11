import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react';
import { routeLinks, useSiteContent } from '../context/siteContent.js';

export default function Footer() {
  const { school } = useSiteContent();

  return (
    <footer id="contact" className="site-footer">
      <div className="footer-main section-shell">
        <div className="footer-brand">
          <img src={school.logo} alt="The Oriental Public School logo" />
          <h2>{school.name}</h2>
          <p>{school.rte}</p>
        </div>
        <div className="footer-column">
          <h3>Explore</h3>
          <a href={routeLinks.about}>About Us</a>
          <a href={routeLinks.principal}>Principal's Desk</a>
          <a href={routeLinks.toppers}>School Toppers</a>
          <a href={routeLinks.facilities}>Facilities</a>
        </div>
        <div className="footer-column footer-contact">
          <h3>Contact</h3>
          <p><MapPin size={17} />{school.addressLine}</p>
          <a href={`tel:${school.phone}`}><Phone size={17} />{school.phone}</a>
          <a href={`mailto:${school.email}`}><Mail size={17} />{school.email}</a>
        </div>
        <div className="footer-column">
          <h3>School Access</h3>
          <a href={routeLinks.notices}>Notice Board</a>
          <a href={routeLinks.gallery}>Photo Gallery</a>
          <a href={routeLinks.admin}>Admin Portal</a>
          <div className="footer-socials">
            <a href="https://facebook.com" aria-label="Facebook"><Facebook size={18} /></a>
            <a href="https://instagram.com" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="https://youtube.com" aria-label="YouTube"><Youtube size={19} /></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom section-shell"><span>Copyright {new Date().getFullYear()} The Oriental Public School</span><span>Jainamore / Bandhdih, Bokaro</span></div>
    </footer>
  );
}
