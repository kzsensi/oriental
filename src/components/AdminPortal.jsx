import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  CircleAlert,
  Cloud,
  ExternalLink,
  GalleryHorizontal,
  GraduationCap,
  Home,
  ImagePlus,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Megaphone,
  Menu,
  Plus,
  RefreshCw,
  Save,
  School,
  Settings,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { defaultSiteContent, useSiteContentState } from '../context/siteContent.js';
import { formatFileSize } from '../lib/imageUpload.js';
import './AdminPortal.css';

const modules = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'announcements', label: 'Announcements', icon: Megaphone },
  { id: 'popup', label: 'Popup', icon: Bell },
  { id: 'homepage', label: 'Homepage', icon: Home },
  { id: 'notices', label: 'Notice board', icon: BookOpen },
  { id: 'results', label: 'School toppers', icon: GraduationCap },
  { id: 'people', label: 'People', icon: Users },
  { id: 'campus', label: 'Campus & gallery', icon: GalleryHorizontal },
  { id: 'pages', label: 'School pages', icon: School },
];

const clone = (value) => typeof structuredClone === 'function'
  ? structuredClone(value)
  : JSON.parse(JSON.stringify(value));

function valueAt(source, path) {
  return path.reduce((current, key) => current?.[key], source);
}

function replaceAt(source, path, value) {
  const next = clone(source);
  let pointer = next;
  path.slice(0, -1).forEach((key) => {
    if (pointer[key] == null) pointer[key] = typeof path[path.indexOf(key) + 1] === 'number' ? [] : {};
    pointer = pointer[key];
  });
  pointer[path.at(-1)] = value;
  return next;
}

function Field({ label, value, onChange, type = 'text', rows = 3, hint, required = false }) {
  return (
    <label className={`cms-field ${type === 'textarea' ? 'cms-field-wide' : ''}`}>
      <span>{label}</span>
      {type === 'textarea' ? (
        <textarea rows={rows} value={value ?? ''} onChange={(event) => onChange(event.target.value)} required={required} />
      ) : (
        <input type={type} value={value ?? ''} onChange={(event) => onChange(event.target.value)} required={required} />
      )}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function Toggle({ label, checked, onChange, hint }) {
  return (
    <label className="cms-toggle-row">
      <button type="button" className={`cms-switch ${checked ? 'on' : ''}`} onClick={() => onChange(!checked)} role="switch" aria-checked={checked}>
        <span />
      </button>
      <span><strong>{label}</strong>{hint && <small>{hint}</small>}</span>
    </label>
  );
}

function ImageField({ label = 'Image', value, onChange, folder, compact = false }) {
  const { uploadImage } = useSiteContentState();
  const [state, setState] = useState({ uploading: false, message: '', error: '' });

  const selectFile = async (file) => {
    if (!file) return;
    setState({ uploading: true, message: 'Optimizing and uploading...', error: '' });
    const result = await uploadImage(file, folder, compact
      ? { maxWidth: 900, maxHeight: 900, quality: 0.84 }
      : { maxWidth: 1920, maxHeight: 1920, quality: 0.82 });
    if (!result.ok) {
      setState({ uploading: false, message: '', error: result.error });
      return;
    }
    onChange(result.url);
    const saving = result.originalBytes > result.outputBytes
      ? `${formatFileSize(result.originalBytes)} to ${formatFileSize(result.outputBytes)}`
      : formatFileSize(result.outputBytes);
    setState({ uploading: false, message: `Uploaded as WebP (${saving})`, error: '' });
  };

  return (
    <div className="cms-image-field">
      <span className="cms-input-label">{label}</span>
      <div className="cms-image-control">
        <figure>{value ? <img src={value} alt="Current upload" /> : <ImagePlus aria-hidden="true" />}</figure>
        <label className="cms-upload-button">
          {state.uploading ? <LoaderCircle className="spin" aria-hidden="true" /> : <Upload aria-hidden="true" />}
          <span>{value ? 'Replace' : 'Choose image'}</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" disabled={state.uploading} onChange={(event) => selectFile(event.target.files?.[0])} />
        </label>
        {value && <button type="button" className="cms-icon-button" onClick={() => onChange('')} title="Remove image" aria-label="Remove image"><Trash2 /></button>}
      </div>
      {state.message && <small className="cms-upload-success"><Check />{state.message}</small>}
      {state.error && <small className="cms-upload-error"><CircleAlert />{state.error}</small>}
    </div>
  );
}

function EditorHeader({ eyebrow, title, description, count }) {
  return (
    <header className="cms-editor-heading">
      <div><p>{eyebrow}</p><h1>{title}</h1>{description && <span>{description}</span>}</div>
      {Number.isFinite(count) && <strong>{count}</strong>}
    </header>
  );
}

function ReorderActions({ index, length, onMove, onRemove }) {
  return (
    <div className="cms-row-actions">
      <button type="button" onClick={() => onMove(index, -1)} disabled={index === 0} title="Move up" aria-label="Move up"><ArrowUp /></button>
      <button type="button" onClick={() => onMove(index, 1)} disabled={index === length - 1} title="Move down" aria-label="Move down"><ArrowDown /></button>
      <button type="button" className="danger" onClick={() => onRemove(index)} title="Delete" aria-label="Delete"><Trash2 /></button>
    </div>
  );
}

function CollectionEditor({ title, items, fields, onChange, createItem, folder, addLabel = 'Add item' }) {
  const updateItem = (index, key, value) => {
    const next = clone(items);
    next[index] = { ...next[index], [key]: value };
    onChange(next);
  };
  const move = (index, offset) => {
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(index + offset, 0, item);
    onChange(next);
  };

  return (
    <section className="cms-collection">
      <div className="cms-subheading"><h2>{title}</h2><span>{items.length}</span></div>
      <div className="cms-collection-list">
        {items.length === 0 && <div className="cms-empty"><p>No items published here yet.</p></div>}
        {items.map((item, index) => (
          <article className="cms-collection-row" key={item.id || `${item.name || item.title || item.label || title}-${index}`}>
            <div className="cms-row-number">{String(index + 1).padStart(2, '0')}</div>
            <div className="cms-row-fields">
              {fields.map((field) => field.type === 'image' ? (
                <ImageField
                  key={field.key}
                  label={field.label}
                  value={item[field.key]}
                  folder={`${folder}/${field.key}`}
                  compact={field.compact}
                  onChange={(value) => updateItem(index, field.key, value)}
                />
              ) : field.type === 'toggle' ? (
                <Toggle key={field.key} label={field.label} checked={Boolean(item[field.key])} onChange={(value) => updateItem(index, field.key, value)} />
              ) : (() => {
                const { key, ...fieldProps } = field;
                return <Field key={key} {...fieldProps} value={item[key]} onChange={(value) => updateItem(index, key, value)} />;
              })())}
            </div>
            <ReorderActions index={index} length={items.length} onMove={move} onRemove={(itemIndex) => onChange(items.filter((_, current) => current !== itemIndex))} />
          </article>
        ))}
      </div>
      <button type="button" className="cms-add-button" onClick={() => onChange([...items, { ...clone(createItem), id: createItem.id || `${folder}-${Date.now()}` }])}><Plus />{addLabel}</button>
    </section>
  );
}

function StringListEditor({ title, items, onChange, addLabel = 'Add paragraph' }) {
  const move = (index, offset) => {
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(index + offset, 0, item);
    onChange(next);
  };
  return (
    <section className="cms-collection">
      <div className="cms-subheading"><h2>{title}</h2><span>{items.length}</span></div>
      {items.map((item, index) => (
        <article className="cms-simple-row" key={`${title}-${index}`}>
          <span>{index + 1}</span>
          <textarea rows={3} value={item} onChange={(event) => onChange(items.map((value, current) => current === index ? event.target.value : value))} />
          <ReorderActions index={index} length={items.length} onMove={move} onRemove={(itemIndex) => onChange(items.filter((_, current) => current !== itemIndex))} />
        </article>
      ))}
      <button type="button" className="cms-add-button" onClick={() => onChange([...items, ''])}><Plus />{addLabel}</button>
    </section>
  );
}

function LoginScreen() {
  const { cloud, login } = useSiteContentState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState({ loading: false, error: '' });

  if (!cloud.configured) {
    return (
      <main className="cms-gate">
        <section>
          <div className="cms-gate-mark"><Settings /></div>
          <p>One-time setup</p>
          <h1>Connect Oriental to Supabase</h1>
          <span>The portal is ready. Add the two public project values to <code>.env.local</code>, run the supplied SQL, and restart the site.</span>
          <a href="/SUPABASE_SETUP.md" target="_blank">Open setup instructions <ExternalLink /></a>
        </section>
      </main>
    );
  }

  const submit = async (event) => {
    event.preventDefault();
    setState({ loading: true, error: '' });
    const result = await login(email, password);
    setState({ loading: false, error: result.ok ? '' : result.error });
  };

  return (
    <main className="cms-gate">
      <form onSubmit={submit}>
        <img src="/image/logo.png" alt="Oriental Public School" />
        <p>Website administration</p>
        <h1>Welcome back</h1>
        <span>Sign in with the administrator account created in Supabase.</span>
        <Field label="Email address" type="email" value={email} onChange={setEmail} required />
        <Field label="Password" type="password" value={password} onChange={setPassword} required />
        {state.error && <div className="cms-form-error"><CircleAlert />{state.error}</div>}
        <button className="cms-login-button" disabled={state.loading}>{state.loading ? <LoaderCircle className="spin" /> : <ChevronRight />}Sign in</button>
        <a href="/">Return to school website</a>
      </form>
    </main>
  );
}

export default function AdminPortal() {
  const { content, session, isAuthenticated, cloud, logout, publish, reload } = useSiteContentState();
  const [draft, setDraft] = useState(() => clone(content));
  const [active, setActive] = useState('dashboard');
  const [dirty, setDirty] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!dirty) setDraft(clone(content));
  }, [content, dirty]);

  useEffect(() => {
    const beforeUnload = (event) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [dirty]);

  const setPath = (path, value) => {
    setDraft((current) => replaceAt(current, path, value));
    setDirty(true);
    setNotice(null);
  };

  const publishChanges = async () => {
    setNotice({ type: 'working', text: 'Publishing changes...' });
    const result = await publish(draft);
    if (!result.ok) {
      setNotice({ type: 'error', text: result.error });
      return;
    }
    setDirty(false);
    setNotice({ type: 'success', text: 'Published. The public website is now up to date.' });
  };

  const discardChanges = () => {
    setDraft(clone(content));
    setDirty(false);
    setNotice({ type: 'success', text: 'Unpublished changes discarded.' });
  };

  const counts = useMemo(() => ({
    announcements: draft.announcements.length,
    notices: draft.notices.length,
    toppers: draft.toppers.classX.length + draft.toppers.classXII.length,
    photos: draft.hero.slides.length + draft.highlights.length + draft.initiatives.length + draft.learningMoments.length,
  }), [draft]);

  if (!isAuthenticated) return <LoginScreen />;

  const selectModule = (id) => {
    setActive(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderEditor = () => {
    if (active === 'dashboard') return (
      <>
        <EditorHeader eyebrow="Website overview" title="Good to see you." description="Choose one area to update. Nothing becomes public until you press Publish." />
        <div className="cms-overview-grid">
          {[
            ['Announcements', counts.announcements, 'announcements', Megaphone],
            ['Published notices', counts.notices, 'notices', BookOpen],
            ['School toppers', counts.toppers, 'results', GraduationCap],
            ['Managed photos', counts.photos, 'campus', GalleryHorizontal],
          ].map(([label, count, id, Icon]) => (
            <button type="button" key={id} onClick={() => selectModule(id)}><Icon /><span>{label}</span><strong>{count}</strong><ChevronRight /></button>
          ))}
        </div>
        <section className="cms-start-panel">
          <div><Cloud /><span><strong>Supabase connected</strong><small>Public changes are shared from one cloud source.</small></span></div>
          <div><Check /><span><strong>Images optimized automatically</strong><small>Uploads are resized and converted to WebP.</small></span></div>
          <div><Settings /><span><strong>Protected publishing</strong><small>Only approved administrator accounts can write.</small></span></div>
        </section>
      </>
    );

    if (active === 'announcements') return (
      <>
        <EditorHeader eyebrow="Header ticker" title="Announcements" description="Short updates that move across the top of every page." count={draft.announcements.length} />
        <CollectionEditor title="Ticker messages" items={draft.announcements} onChange={(value) => setPath(['announcements'], value)} folder="announcements" addLabel="Add announcement" createItem={{ text: '', href: '#notices' }} fields={[
          { key: 'text', label: 'Message', type: 'textarea', rows: 2 },
          { key: 'href', label: 'Link', hint: 'Examples: #notices, /about-us, or https://...' },
        ]} />
      </>
    );

    if (active === 'popup') return (
      <>
        <EditorHeader eyebrow="Visitor announcement" title="Admission popup" description="Shown once per browser session when enabled." />
        <section className="cms-form-section">
          <Toggle label="Show popup on the website" checked={draft.popup.enabled} onChange={(value) => setPath(['popup', 'enabled'], value)} hint="Turn this off without deleting its content." />
          <div className="cms-form-grid">
            <Field label="Small heading" value={draft.popup.eyebrow} onChange={(value) => setPath(['popup', 'eyebrow'], value)} />
            <Field label="Main heading" value={draft.popup.title} onChange={(value) => setPath(['popup', 'title'], value)} />
            <Field label="Message" type="textarea" rows={4} value={draft.popup.body} onChange={(value) => setPath(['popup', 'body'], value)} />
            <Field label="Button text" value={draft.popup.actionLabel} onChange={(value) => setPath(['popup', 'actionLabel'], value)} />
            <Field label="Button link" value={draft.popup.actionHref} onChange={(value) => setPath(['popup', 'actionHref'], value)} />
            <ImageField label="Popup photograph" value={draft.popup.image} folder="popup" onChange={(value) => setPath(['popup', 'image'], value)} />
          </div>
        </section>
      </>
    );

    if (active === 'homepage') return (
      <>
        <EditorHeader eyebrow="First impression" title="Homepage" description="Manage the hero slideshow and What's Happening stories." />
        <section className="cms-form-section">
          <div className="cms-subheading"><h2>Hero message</h2></div>
          <div className="cms-form-grid">
            <Field label="Location line" value={draft.hero.eyebrow} onChange={(value) => setPath(['hero', 'eyebrow'], value)} />
            <Field label="Title line one" value={draft.hero.title} onChange={(value) => setPath(['hero', 'title'], value)} />
            <Field label="Title line two" value={draft.hero.subtitle} onChange={(value) => setPath(['hero', 'subtitle'], value)} />
            <Field label="Introduction" type="textarea" value={draft.hero.body} onChange={(value) => setPath(['hero', 'body'], value)} />
            <Field label="Primary button" value={draft.hero.primaryLabel} onChange={(value) => setPath(['hero', 'primaryLabel'], value)} />
            <Field label="Primary link" value={draft.hero.primaryHref} onChange={(value) => setPath(['hero', 'primaryHref'], value)} />
            <Field label="Secondary button" value={draft.hero.secondaryLabel} onChange={(value) => setPath(['hero', 'secondaryLabel'], value)} />
            <Field label="Secondary link" value={draft.hero.secondaryHref} onChange={(value) => setPath(['hero', 'secondaryHref'], value)} />
          </div>
        </section>
        <CollectionEditor title="Hero slides" items={draft.hero.slides} onChange={(value) => setPath(['hero', 'slides'], value)} folder="hero" addLabel="Add slide" createItem={{ desktop: '', mobile: '', position: 'center' }} fields={[
          { key: 'desktop', label: 'Desktop image', type: 'image' },
          { key: 'mobile', label: 'Mobile image', type: 'image' },
          { key: 'position', label: 'Image focus', hint: 'Examples: center, center 35%, left center' },
        ]} />
        <CollectionEditor title="What's happening" items={draft.highlights} onChange={(value) => setPath(['highlights'], value)} folder="highlights" addLabel="Add story" createItem={{ title: '', label: '', image: '', href: '#initiatives' }} fields={[
          { key: 'label', label: 'Category' }, { key: 'title', label: 'Story title', type: 'textarea', rows: 2 }, { key: 'href', label: 'Link' }, { key: 'image', label: 'Story image', type: 'image' },
        ]} />
      </>
    );

    if (active === 'notices') return (
      <>
        <EditorHeader eyebrow="School office" title="Notice board" description="Notices automatically paginate on the public website." count={draft.notices.length} />
        <CollectionEditor title="Published notices" items={draft.notices} onChange={(value) => setPath(['notices'], value)} folder="notices" addLabel="Create notice" createItem={{ title: '', date: new Date().toISOString().slice(0, 10), body: '', archived: false, image: '' }} fields={[
          { key: 'title', label: 'Notice title' }, { key: 'date', label: 'Date', type: 'date' }, { key: 'body', label: 'Notice details', type: 'textarea', rows: 3 }, { key: 'archived', label: 'Mark as archive', type: 'toggle' }, { key: 'image', label: 'Notice photograph', type: 'image' },
        ]} />
      </>
    );

    if (active === 'results') return (
      <>
        <EditorHeader eyebrow="Academic achievement" title="School toppers" description="Add names, percentages and student photographs." count={counts.toppers} />
        {['classX', 'classXII'].map((classKey) => (
          <CollectionEditor key={classKey} title={classKey === 'classX' ? 'Class X' : 'Class XII'} items={draft.toppers[classKey]} onChange={(value) => setPath(['toppers', classKey], value)} folder={`toppers/${classKey}`} addLabel="Add student" createItem={{ name: '', marks: '', image: '' }} fields={[
            { key: 'name', label: 'Student name' }, { key: 'marks', label: 'Percentage / marks', hint: 'Example: 96.6%' }, { key: 'image', label: 'Student photo', type: 'image', compact: true },
          ]} />
        ))}
      </>
    );

    if (active === 'people') return (
      <>
        <EditorHeader eyebrow="School community" title="People" description="Manage the principal, leadership team, and faculty directory." />
        <section className="cms-form-section">
          <div className="cms-subheading"><h2>Principal's message</h2></div>
          <div className="cms-form-grid">
            <Field label="Name" value={draft.principal.name} onChange={(value) => setPath(['principal', 'name'], value)} />
            <Field label="Role" value={draft.principal.role} onChange={(value) => setPath(['principal', 'role'], value)} />
            <Field label="Featured quote" type="textarea" value={draft.principal.quote} onChange={(value) => setPath(['principal', 'quote'], value)} />
            <ImageField label="Principal photograph" compact value={draft.principal.image} folder="people/principal" onChange={(value) => setPath(['principal', 'image'], value)} />
          </div>
        </section>
        <StringListEditor title="Principal's full message" items={draft.principal.paragraphs} onChange={(value) => setPath(['principal', 'paragraphs'], value)} />
        <CollectionEditor title="School management" items={draft.management} onChange={(value) => setPath(['management'], value)} folder="people/management" addLabel="Add management member" createItem={{ role: '', name: '', image: '' }} fields={[
          { key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }, { key: 'image', label: 'Photo', type: 'image', compact: true },
        ]} />
        <CollectionEditor title="Faculty" items={draft.faculty} onChange={(value) => setPath(['faculty'], value)} folder="people/faculty" addLabel="Add faculty member" createItem={{ subject: '', name: '', qualification: '', experience: '', image: '' }} fields={[
          { key: 'name', label: 'Name' }, { key: 'subject', label: 'Subject' }, { key: 'qualification', label: 'Qualification' }, { key: 'experience', label: 'Experience' }, { key: 'image', label: 'Photo', type: 'image', compact: true },
        ]} />
      </>
    );

    if (active === 'campus') return (
      <>
        <EditorHeader eyebrow="Student experience" title="Campus & gallery" description="Facilities, learning photographs, and the moving gallery strip." />
        <CollectionEditor title="Facilities" items={draft.facilities} onChange={(value) => setPath(['facilities'], value)} folder="campus/facilities" addLabel="Add facility" createItem={{ number: String(draft.facilities.length + 1).padStart(2, '0'), title: '', body: '', image: '' }} fields={[
          { key: 'number', label: 'Number' }, { key: 'title', label: 'Title' }, { key: 'body', label: 'Description', type: 'textarea' }, { key: 'image', label: 'Photograph', type: 'image' },
        ]} />
        <CollectionEditor title="Learning beyond books" items={draft.learningMoments} onChange={(value) => setPath(['learningMoments'], value)} folder="campus/learning" addLabel="Add learning moment" createItem={{ label: '', image: '' }} fields={[
          { key: 'label', label: 'Caption' }, { key: 'image', label: 'Photograph', type: 'image' },
        ]} />
        <section className="cms-form-section">
          <Field label="School profile source note" value={draft.legacyProfile.sourceNote} onChange={(value) => setPath(['legacyProfile', 'sourceNote'], value)} />
        </section>
        <CollectionEditor title="School profile story" items={draft.legacyProfile.items} onChange={(value) => setPath(['legacyProfile', 'items'], value)} folder="campus/profile" addLabel="Add profile panel" createItem={{ eyebrow: '', title: '', stat: '', body: '', image: '' }} fields={[
          { key: 'eyebrow', label: 'Small heading' }, { key: 'title', label: 'Title' }, { key: 'stat', label: 'Large statistic (optional)' }, { key: 'body', label: 'Description', type: 'textarea' }, { key: 'image', label: 'Photograph', type: 'image' },
        ]} />
        <section className="cms-collection">
          <div className="cms-subheading"><h2>Moving photo gallery</h2><span>{draft.initiatives.length}</span></div>
          <div className="cms-gallery-editor">
            {draft.initiatives.map((image, index) => (
              <article key={`${image}-${index}`}>
                <ImageField label={`Photo ${index + 1}`} value={image} folder="campus/gallery" onChange={(value) => setPath(['initiatives'], draft.initiatives.map((item, current) => current === index ? value : item))} />
                <ReorderActions index={index} length={draft.initiatives.length} onMove={(itemIndex, offset) => {
                  const next = [...draft.initiatives]; const [item] = next.splice(itemIndex, 1); next.splice(itemIndex + offset, 0, item); setPath(['initiatives'], next);
                }} onRemove={(itemIndex) => setPath(['initiatives'], draft.initiatives.filter((_, current) => current !== itemIndex))} />
              </article>
            ))}
          </div>
          <button type="button" className="cms-add-button" onClick={() => setPath(['initiatives'], [...draft.initiatives, ''])}><Plus />Add gallery photo</button>
        </section>
      </>
    );

    return (
      <>
        <EditorHeader eyebrow="Global information" title="School pages" description="Header details, contact information, and About Us content." />
        <section className="cms-form-section">
          <div className="cms-subheading"><h2>School details</h2></div>
          <div className="cms-form-grid">
            {[
              ['name', 'Official school name'], ['shortName', 'Short name'], ['rte', 'RTE line'], ['affiliation', 'Affiliation line'], ['addressLine', 'Address'], ['phone', 'Principal office phone'], ['officePhone', 'Secondary phone'], ['callLabel', 'Header call label'], ['email', 'School email'],
            ].map(([key, label]) => <Field key={key} label={label} type={key === 'email' ? 'email' : 'text'} value={draft.school[key]} onChange={(value) => setPath(['school', key], value)} />)}
            <ImageField label="School logo" compact value={draft.school.logo} folder="school/logo" onChange={(value) => setPath(['school', 'logo'], value)} />
          </div>
        </section>
        <section className="cms-collection">
          <div className="cms-subheading"><h2>Main navigation</h2><span>{draft.nav.length}</span></div>
          {draft.nav.map(([label, href], index) => (
            <article className="cms-simple-row cms-value-row" key={`${label}-${index}`}>
              <span>{index + 1}</span>
              <div><Field label="Menu label" value={label} onChange={(text) => setPath(['nav'], draft.nav.map((item, current) => current === index ? [text, item[1]] : item))} /><Field label="Link" value={href} onChange={(text) => setPath(['nav'], draft.nav.map((item, current) => current === index ? [item[0], text] : item))} /></div>
              <button type="button" className="cms-icon-button danger" onClick={() => setPath(['nav'], draft.nav.filter((_, current) => current !== index))}><Trash2 /></button>
            </article>
          ))}
          <button type="button" className="cms-add-button" onClick={() => setPath(['nav'], [...draft.nav, ['New page', '/']])}><Plus />Add navigation link</button>
        </section>
        <section className="cms-form-section">
          <div className="cms-subheading"><h2>About Us introduction</h2></div>
          <div className="cms-form-grid">
            <Field label="Small heading" value={draft.about.eyebrow} onChange={(value) => setPath(['about', 'eyebrow'], value)} />
            <Field label="Page title" value={draft.about.title} onChange={(value) => setPath(['about', 'title'], value)} />
            <Field label="Introduction" type="textarea" value={draft.about.intro} onChange={(value) => setPath(['about', 'intro'], value)} />
          </div>
        </section>
        <StringListEditor title="About Us paragraphs" items={draft.about.paragraphs} onChange={(value) => setPath(['about', 'paragraphs'], value)} />
        <section className="cms-collection">
          <div className="cms-subheading"><h2>School values</h2><span>{draft.about.values.length}</span></div>
          {draft.about.values.map((value, index) => (
            <article className="cms-simple-row cms-value-row" key={`value-${index}`}>
              <span>{index + 1}</span>
              <div><Field label="Value" value={value[0]} onChange={(text) => setPath(['about', 'values'], draft.about.values.map((item, current) => current === index ? [text, item[1]] : item))} /><Field label="Explanation" type="textarea" value={value[1]} onChange={(text) => setPath(['about', 'values'], draft.about.values.map((item, current) => current === index ? [item[0], text] : item))} /></div>
              <button type="button" className="cms-icon-button danger" onClick={() => setPath(['about', 'values'], draft.about.values.filter((_, current) => current !== index))}><Trash2 /></button>
            </article>
          ))}
          <button type="button" className="cms-add-button" onClick={() => setPath(['about', 'values'], [...draft.about.values, ['', '']])}><Plus />Add school value</button>
        </section>
      </>
    );
  };

  return (
    <div className="cms-app">
      <aside className={menuOpen ? 'open' : ''}>
        <div className="cms-brand"><img src="/image/logo.png" alt="" /><span><strong>Oriental</strong><small>Website manager</small></span><button onClick={() => setMenuOpen(false)} aria-label="Close menu"><X /></button></div>
        <nav aria-label="Content modules">
          {modules.map(({ id, label, icon: Icon }) => <button type="button" key={id} className={active === id ? 'active' : ''} onClick={() => selectModule(id)}><Icon /><span>{label}</span>{active === id && <ChevronRight />}</button>)}
        </nav>
        <div className="cms-account"><span>{session?.user?.email || 'Administrator'}</span><button type="button" onClick={logout}><LogOut />Sign out</button></div>
      </aside>
      {menuOpen && <button className="cms-menu-backdrop" onClick={() => setMenuOpen(false)} aria-label="Close menu" />}

      <div className="cms-workspace">
        <header className="cms-topbar">
          <button className="cms-menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu /></button>
          <div className="cms-cloud-state"><i className={cloud.error ? 'error' : ''} /><span>{cloud.error ? 'Cloud needs attention' : cloud.saving ? 'Publishing...' : 'Connected to Supabase'}</span></div>
          <a href="/" target="_blank">View website <ExternalLink /></a>
          <button type="button" className="cms-refresh" onClick={reload} title="Refresh live content" aria-label="Refresh live content"><RefreshCw /></button>
          <button type="button" className="cms-publish" onClick={publishChanges} disabled={!dirty || cloud.saving}>{cloud.saving ? <LoaderCircle className="spin" /> : <Save />}<span>{dirty ? 'Publish changes' : 'Published'}</span></button>
        </header>

        {dirty && <div className="cms-unsaved"><span>Unpublished changes</span><button type="button" onClick={discardChanges}>Discard</button></div>}
        {notice && <div className={`cms-toast ${notice.type}`}><span>{notice.text}</span><button onClick={() => setNotice(null)} aria-label="Dismiss"><X /></button></div>}
        {cloud.error && <div className="cms-cloud-error"><CircleAlert /><span><strong>Supabase error</strong>{cloud.error}</span></div>}

        <main className="cms-editor">{renderEditor()}</main>
      </div>
    </div>
  );
}
