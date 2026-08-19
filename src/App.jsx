import { lazy, Suspense } from 'react';
import { Agentation } from 'agentation';
import Header from './components/Header.jsx';
import SEO from './components/SEO.jsx';
import HeroSlideshow from './components/HeroSlideshow.jsx';
import AdmissionPopup from './components/AdmissionPopup.jsx';
import LatestHighlights from './components/LatestHighlights.jsx';
import NoticesSection from './components/NoticesSection.jsx';
import ToppersSection from './components/ToppersSection.jsx';
import PrincipalPreview from './components/PrincipalPreview.jsx';
import ManagementSection from './components/ManagementSection.jsx';
import FacilitiesSection from './components/FacilitiesSection.jsx';
import LearningBeyondBooks from './components/LearningBeyondBooks.jsx';
import InitiativesSection from './components/InitiativesSection.jsx';
import SchoolProfileShowcase from './components/SchoolProfileShowcase.jsx';
import AdmissionBand from './components/AdmissionBand.jsx';
import QuickAnswersSection from './components/QuickAnswersSection.jsx';
import Footer from './components/Footer.jsx';
import MotionSystem from './components/MotionSystem.jsx';
import { AboutPage, PrincipalPage } from './components/InnerPages.jsx';

const AdminPortal = lazy(() => import('./components/AdminPortal.jsx'));

function HomePage() {
  return (
    <>
      <Header />
      <AdmissionPopup />
      <main>
        <HeroSlideshow />
        <LatestHighlights />
        <NoticesSection />
        <ToppersSection />
        <PrincipalPreview />
        <ManagementSection />
        <FacilitiesSection />
        <SchoolProfileShowcase />
        <LearningBeyondBooks />
        <InitiativesSection />
        <QuickAnswersSection />
        <AdmissionBand />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';

  let content;
  if (pathname === '/admin' || pathname === '/admin-login') {
    content = <Suspense fallback={<main className="cms-gate"><p>Loading website manager...</p></main>}><AdminPortal /></Suspense>;
  } else if (pathname === '/principal') {
    content = <PrincipalPage />;
  } else if (pathname === '/about-us') {
    content = <AboutPage />;
  } else {
    content = <HomePage />;
  }

  return (
    <>
      <SEO pathname={pathname} />
      <MotionSystem routeKey={pathname} />
      {content}
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}
