import { useEffect, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSiteContent } from '../context/siteContent.js';

export default function HeroSlideshow() {
  const { hero, school } = useSiteContent();
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = Array.isArray(hero.slides) && hero.slides.length > 0 ? hero.slides : [];

  useEffect(() => {
    if (heroSlides.length < 2) return undefined;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="hero-slideshow-section" aria-label="Oriental Public School hero slideshow">
      <div className="hero-slides-wrapper">
        {heroSlides.map((slideObj, index) => {
          const desktopImg = typeof slideObj === 'string' ? slideObj : slideObj.desktop || slideObj.image;
          const mobileImg = typeof slideObj === 'object' && slideObj.mobile ? slideObj.mobile : desktopImg;

          return (
            <div
              key={`${desktopImg}-${index}`}
              className={`hero-slide-bg ${index === currentSlide ? 'active' : ''}`}
              style={{
                '--hero-bg-desktop': `url('${desktopImg}')`,
                '--hero-bg-mobile': `url('${mobileImg}')`,
                '--hero-position': slideObj.position || 'center',
              }}
            />
          );
        })}
      </div>

      <div className="hero-clean-container">
        <div className="hero-clean-content">
          <p className="hero-eyebrow">{hero.eyebrow}</p>
          <h1 className="hero-clean-title">
            <span>{school.shortName}</span>
            {' '}
            <span>Bokaro.</span>
          </h1>

          <p className="hero-clean-subtitle">{hero.body}</p>

          <div className="hero-clean-actions">
            <a href={hero.primaryHref} className="hero-btn-primary">
              <span>{hero.primaryLabel}</span>
              <ArrowRight size={18} className="hero-btn-arrow" />
            </a>

            <a href={hero.secondaryHref} className="hero-btn-secondary">
              <span>{hero.secondaryLabel}</span>
              <ArrowRight size={18} className="hero-btn-arrow" />
            </a>
          </div>
        </div>
      </div>

      <div className="hero-slide-nav">
        <button onClick={goToPrev} className="hero-nav-arrow" aria-label="Previous slide">
          <ChevronLeft size={18} />
        </button>
        <div className="hero-slide-dots">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <button onClick={goToNext} className="hero-nav-arrow" aria-label="Next slide">
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
