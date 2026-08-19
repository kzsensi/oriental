import { useEffect } from 'react';
import { useSiteContent } from '../context/siteContent.js';

const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.orientalbokaro.com').replace(/\/+$/, '');
const DEFAULT_IMAGE = `${SITE_URL}/oriental/ops3d.webp`;

const pageConfig = {
  '/': {
    title: 'Oriental Public School Bokaro | School in Jainamore, Bandhdih',
    description: 'Oriental Public School in Jainamore and Bandhdih, Bokaro, Jharkhand offers purposeful academics, values, student activities, notices and admission enquiry support.',
  },
  '/about-us': {
    title: 'About Oriental Public School Bokaro | Jainamore, Bandhdih',
    description: 'Learn about The Oriental Public School, Jainamore/Bandhdih, Bokaro, including school identity, values, faculty, RTE code and student-centred learning.',
  },
  '/principal': {
    title: "Principal's Desk | Oriental Public School Bokaro",
    description: 'Read the message from Dr Amir Hussain, Director and Principal of The Oriental Public School, Bandhdih, Bokaro.',
  },
  '/admin': {
    title: 'Oriental Website Manager',
    description: 'Website content manager for Oriental Public School.',
    robots: 'noindex, nofollow',
  },
  '/admin-login': {
    title: 'Oriental Website Manager',
    description: 'Website content manager for Oriental Public School.',
    robots: 'noindex, nofollow',
  },
};

function routePath(pathname) {
  const cleanPath = pathname.replace(/\/+$/, '') || '/';
  return pageConfig[cleanPath] ? cleanPath : '/';
}

function absoluteUrl(path) {
  return path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`;
}

function upsertMeta(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertLink(selector, attributes) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement('link');
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
}

function upsertJsonLd(id, data) {
  let element = document.getElementById(id);
  if (!element) {
    element = document.createElement('script');
    element.id = id;
    element.type = 'application/ld+json';
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data);
}

function removeElement(id) {
  document.getElementById(id)?.remove();
}

export default function SEO({ pathname }) {
  const { school } = useSiteContent();

  useEffect(() => {
    const path = routePath(pathname);
    const config = pageConfig[path];
    const canonical = absoluteUrl(path);
    const robots = config.robots || 'index, follow';
    const siteName = 'The Oriental Public School';

    document.documentElement.lang = 'en-IN';
    document.title = config.title;

    upsertMeta('meta[name="description"]', { name: 'description', content: config.description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots });
    upsertMeta('meta[name="author"]', { name: 'author', content: siteName });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: siteName });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: config.title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: config.description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: DEFAULT_IMAGE });
    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: config.title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: config.description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: DEFAULT_IMAGE });
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonical });

    const webPage = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: config.title,
      description: config.description,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#school` },
      primaryImageOfPage: DEFAULT_IMAGE,
    };

    const breadcrumbItems = [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    ];
    if (path === '/about-us') {
      breadcrumbItems.push({ '@type': 'ListItem', position: 2, name: 'About Us', item: canonical });
    } else if (path === '/principal') {
      breadcrumbItems.push({ '@type': 'ListItem', position: 2, name: "Principal's Desk", item: canonical });
    }

    const routeData = [webPage];
    if (breadcrumbItems.length > 1) {
      routeData.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems,
      });
    }

    if (path === '/') {
      routeData.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Where is Oriental Public School located?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${school.shortName} is located at ${school.addressLine}.`,
            },
          },
          {
            '@type': 'Question',
            name: 'How can parents contact Oriental Public School Bokaro?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Parents can call ${school.phone} or email ${school.email} for school office and admission enquiries.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Who is the Principal of The Oriental Public School?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${school.principal} is the Director and Principal of The Oriental Public School, Bandhdih, Bokaro.`,
            },
          },
        ],
      });
    }

    upsertJsonLd('oriental-route-jsonld', routeData);
    if (robots.includes('noindex')) removeElement('oriental-route-jsonld');
  }, [pathname, school]);

  return null;
}
