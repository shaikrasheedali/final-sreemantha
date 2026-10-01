import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const { settings } = useSettings();
  const info = settings.hospital_info || {};
  const phone = info.phone || '+91 96667 81779';
  const phoneHref = `tel:${phone.replace(/[^+\d]/g, '')}`;

  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !consent) return;
    setSubscribed(true);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" aria-label="Sreemantha Hospital Home">
              <BrandLogo theme="dark" className="footer-brand" />
            </Link>
            <p>
              Advanced fertility, women and child care — thoughtfully connected for every family in Khammam.
            </p>
            <address>
              {info.address || 'Near Priyadarshini Degree College, Nehru Nagar, Wyra Road, Khammam, Telangana 507001'}
              <br />
              <a href={phoneHref}>{phone}</a>
              <br />
              Open 24 hours · 7 days a week
            </address>
          </div>

          <div>
            <h4>Explore</h4>
            <div className="footer-links">
              <Link to="/about">About us</Link>
              <Link to="/specialties">Specialities</Link>
              <Link to="/doctors">Our doctors</Link>
              <Link to="/facilities">Facilities</Link>
              <Link to="/gallery">Visual Gallery</Link>
              <Link to="/insights">Health Insights</Link>
            </div>
          </div>

          <div>
            <h4>Care</h4>
            <div className="footer-links">
              <Link to="/specialties/fertility-reproductive-medicine">Fertility &amp; IVF</Link>
              <Link to="/specialties/obstetrics-high-risk-pregnancy">Women’s health</Link>
              <Link to="/specialties/pediatrics-neonatal-care">Pediatrics</Link>
              <Link to="/facilities/level-iii-nicu">NICU &amp; PICU</Link>
              <Link to="/treatments">All Treatments</Link>
              <Link to="/book-appointment">Book appointment</Link>
            </div>
          </div>

          <div>
            <h4>Stay informed</h4>
            <p>Health guidance, hospital news and family wellness.</p>

            {subscribed ? (
              <p className="text-[var(--lime)] font-bold py-2">
                ✓ Thank you for subscribing.
              </p>
            ) : (
              <form onSubmit={handleSubscribe}>
                <div className="newsletter">
                  <input
                    aria-label="Your email address"
                    type="email"
                    required
                    placeholder="Your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" aria-label="Subscribe">
                    <ArrowRight size={18} />
                  </button>
                </div>
                <label className="checkbox newsletter-consent">
                  <input
                    type="checkbox"
                    checked={consent}
                    required
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  <span>I agree to receive hospital updates by email.</span>
                </label>
              </form>
            )}
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Sreemantha Hospital. All rights reserved.</span>
          <div className="footer-legal">
            <Link to="/staff-login">Staff Login / Admin Portal</Link>
            <Link to="/about">Privacy</Link>
            <Link to="/contact">Terms &amp; Directions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
