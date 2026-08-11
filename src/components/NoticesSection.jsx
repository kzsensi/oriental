import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useSiteContent } from '../context/siteContent.js';

const PAGE_SIZE = 4;
const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const fallbackImages = [
  '/oriental/opssportsday.jpg',
  '/oriental/specialday.jpg',
  '/oriental/initiatives8.jpg',
  '/oriental/initiatives4.png',
];

function getDateParts(notice) {
  if (notice.date && /^\d{4}-\d{2}-\d{2}$/.test(notice.date)) {
    const [year, month, day] = notice.date.split('-');
    return {
      day: notice.day || day,
      month: notice.month || monthNames[Number(month) - 1],
      year: notice.year || year,
    };
  }

  return {
    day: notice.day || '--',
    month: notice.month || 'DATE',
    year: notice.year || '',
  };
}

function getNoticeTime(notice) {
  if (notice.date) return Date.parse(`${notice.date}T00:00:00`) || 0;
  const parts = getDateParts(notice);
  return Date.parse(`${parts.month} ${parts.day === '--' ? '1' : parts.day}, ${parts.year}`) || 0;
}

export default function NoticesSection() {
  const { notices = [], school } = useSiteContent();
  const noticeItems = useMemo(
    () => notices
      .map((notice, index) => ({
        ...notice,
        _key: notice.id || `${notice.title}-${notice.date || notice.year || index}`,
        _date: getDateParts(notice),
        _image: notice.image || fallbackImages[index % fallbackImages.length],
      }))
      .sort((first, second) => getNoticeTime(second) - getNoticeTime(first)),
    [notices],
  );
  const [page, setPage] = useState(0);
  const [activeKey, setActiveKey] = useState(null);
  const pageCount = Math.max(1, Math.ceil(noticeItems.length / PAGE_SIZE));
  const pageStart = page * PAGE_SIZE;
  const visibleNotices = noticeItems.slice(pageStart, pageStart + PAGE_SIZE);
  const activeNotice = noticeItems.find((notice) => notice._key === activeKey) || visibleNotices[0] || null;
  const activePosition = activeNotice
    ? noticeItems.findIndex((notice) => notice._key === activeNotice._key) + 1
    : 0;

  useEffect(() => {
    const finalPage = Math.max(0, Math.ceil(noticeItems.length / PAGE_SIZE) - 1);
    if (page > finalPage) setPage(finalPage);
    if (activeKey && !noticeItems.some((notice) => notice._key === activeKey)) setActiveKey(null);
  }, [activeKey, noticeItems, page]);

  const changePage = (nextPage) => {
    const boundedPage = Math.min(Math.max(nextPage, 0), pageCount - 1);
    const nextNotice = noticeItems[boundedPage * PAGE_SIZE];
    setPage(boundedPage);
    setActiveKey(nextNotice?._key || null);
  };

  return (
    <section id="notices" className="notice-wall-section" aria-labelledby="notices-title">
      <header className="section-shell notice-wall-heading" data-reveal>
        <div>
          <p className="section-kicker light">School office updates</p>
          <h2 id="notices-title">Notice Board</h2>
        </div>
        <div className="notice-wall-summary">
          <strong>{String(noticeItems.length).padStart(2, '0')}</strong>
          <span>{noticeItems.length === 1 ? 'published notice' : 'published notices'}</span>
        </div>
      </header>

      {noticeItems.length === 0 ? (
        <div className="section-shell notice-empty-state" data-reveal>
          <span aria-hidden="true">00</span>
          <div>
            <p className="notice-reader-label">School office</p>
            <h3>No notices at the moment.</h3>
            <p>New updates will appear here as soon as the school office publishes them.</p>
            <a href={`mailto:${school.email}`}>Contact the school office <ArrowRight aria-hidden="true" /></a>
          </div>
        </div>
      ) : (
        <div className="section-shell notice-wall-stage">
          <div className="notice-index-panel">
            <div className="notice-card-list" data-stagger aria-live="polite">
              {visibleNotices.map((notice, index) => (
                <button
                  type="button"
                  className={`notice-list-card ${activeNotice?._key === notice._key ? 'active' : ''}`}
                  key={notice._key}
                  onClick={() => setActiveKey(notice._key)}
                  aria-pressed={activeNotice?._key === notice._key}
                >
                  <span className="notice-list-date"><strong>{notice._date.day}</strong><span>{notice._date.month}<small>{notice._date.year}</small></span></span>
                  <span className="notice-list-copy">
                    <small>{notice.archived ? 'Archive' : 'Current notice'} / {String(pageStart + index + 1).padStart(2, '0')}</small>
                    <strong>{notice.title}</strong>
                    <span>{notice.body}</span>
                  </span>
                  <figure><img src={notice._image} alt="" /></figure>
                  <ArrowUpRight className="notice-list-arrow" aria-hidden="true" />
                </button>
              ))}
            </div>

            {pageCount > 1 && (
              <nav className="notice-pagination" aria-label="Notice pages">
                <button type="button" onClick={() => changePage(page - 1)} disabled={page === 0} aria-label="Previous notices"><ArrowLeft aria-hidden="true" /></button>
                <span><strong>{pageStart + 1}-{Math.min(pageStart + PAGE_SIZE, noticeItems.length)}</strong> of {noticeItems.length}</span>
                <button type="button" onClick={() => changePage(page + 1)} disabled={page === pageCount - 1} aria-label="Next notices"><ArrowRight aria-hidden="true" /></button>
              </nav>
            )}
          </div>

          <article className="notice-feature" aria-live="polite" key={activeNotice._key} data-reveal>
            <figure>
              <img src={activeNotice._image} alt="" />
              <span>{activeNotice.archived ? 'From the school archive' : 'Current school notice'}</span>
              <time><strong>{activeNotice._date.day}</strong>{activeNotice._date.month} {activeNotice._date.year}</time>
            </figure>
            <div className="notice-feature-copy">
              <div className="notice-reader-topline"><span>OPS / SCHOOL OFFICE</span><span>{activePosition} of {noticeItems.length}</span></div>
              <h3>{activeNotice.title}</h3>
              <p>{activeNotice.body}</p>
              <div className="notice-reader-signature"><span>Issued by</span><strong>The Oriental Public School</strong></div>
              <a href={`mailto:${school.email}?subject=${encodeURIComponent(activeNotice.title)}`}>Ask the school office <ArrowRight aria-hidden="true" /></a>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
