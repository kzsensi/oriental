import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { makeStoragePath, prepareWebp } from '../lib/imageUpload.js';
import {
  isSupabaseConfigured,
  missingSupabaseMessage,
  SITE_ASSETS_BUCKET,
  SITE_CONTENT_ID,
  SITE_CONTENT_TABLE,
  supabase,
} from '../lib/supabase.js';

export const routeLinks = {
  home: '/',
  about: '/about-us',
  principal: '/principal',
  admissions: '/#admissions',
  notices: '/#notices',
  toppers: '/#toppers',
  facilities: '/#facilities',
  gallery: '/#initiatives',
  contact: '/#contact',
  admin: '/admin',
};

const orientalAsset = (file) => `/oriental/${file}`;

export const defaultSiteContent = {
  school: {
    name: 'THE ORIENTAL PUBLIC SCHOOL',
    shortName: 'Oriental Public School',
    rte: 'Affiliated under RTE, Code No. BOK/2022-23/13',
    affiliation: 'Affiliation Code: BOK/2022-23/13',
    addressLine: 'Jainamore / Bandhdih, Bokaro, Jharkhand',
    phone: '9570537422',
    officePhone: '7970537422',
    callLabel: 'Principal Office: 9570537422',
    email: 'opsbokarojm@gmail.com',
    logo: '/image/logo.png',
    principal: 'Dr Amir Hussain',
    principalImage: '/image/principal.png',
  },
  nav: [
    ['Home', routeLinks.home],
    ['About Us', routeLinks.about],
    ["Principal's Desk", routeLinks.principal],
    ['Toppers', routeLinks.toppers],
    ['Notice Board', routeLinks.notices],
    ['Facilities', routeLinks.facilities],
    ['Gallery', routeLinks.gallery],
  ],
  hero: {
    eyebrow: 'Jainamore / Bandhdih, Bokaro',
    title: 'An Entrance to',
    subtitle: 'Opportunity.',
    body: 'A school community where academic purpose, character and confidence grow together.',
    primaryLabel: 'Discover Oriental',
    primaryHref: routeLinks.about,
    secondaryLabel: 'Admission Enquiry',
    secondaryHref: '#admissions',
    slides: [
      { desktop: orientalAsset('ops3d.jpg'), mobile: orientalAsset('ops3d.jpg'), position: 'center' },
      { desktop: orientalAsset('specialday.jpg'), mobile: orientalAsset('specialday.jpg'), position: 'center' },
      { desktop: orientalAsset('opssportsday.jpg'), mobile: orientalAsset('opssportsday.jpg'), position: 'center 38%' },
      { desktop: orientalAsset('modesty.jpg'), mobile: orientalAsset('modesty.jpg'), position: 'center' },
      { desktop: orientalAsset('ops.jpg'), mobile: orientalAsset('ops.jpg'), position: 'center' },
    ],
  },
  announcements: [
    { text: 'Admission enquiries are open. Contact the Principal Office at 9570537422.', href: '#admissions' },
    { text: 'School notices and circulars are published through the Notice Board.', href: '#notices' },
    { text: 'Explore the achievements of our Class X and Class XII toppers.', href: '#toppers' },
  ],
  popup: {
    enabled: true,
    eyebrow: 'Admissions',
    title: 'Begin your child\'s journey at Oriental.',
    body: 'Speak with the school office about admission availability, required documents and the next campus visit.',
    image: orientalAsset('specialday.jpg'),
    actionLabel: 'Call 9570537422',
    actionHref: 'tel:9570537422',
  },
  highlights: [
    {
      title: 'Annual Sports Day celebrates discipline, teamwork and house spirit',
      label: 'Student Life',
      image: orientalAsset('opssportsday.jpg'),
      href: '#initiatives',
    },
    {
      title: 'Learning becomes memorable through culture, creativity and participation',
      label: 'Beyond Academics',
      image: orientalAsset('specialday.jpg'),
      href: '#learning',
    },
    {
      title: 'A purpose-built campus planned for focused, future-ready learning',
      label: 'Campus',
      image: orientalAsset('ops3d.jpg'),
      href: '#facilities',
    },
    {
      title: 'Our students set the standard through strong board results',
      label: 'Achievement',
      image: orientalAsset('Priyanshu.jpg'),
      href: '#toppers',
    },
  ],
  notices: [
    { id: 'annual-sports-day-2024', date: '2024-12-19', day: '19', month: 'DEC', year: '2024', title: 'Annual Sports Day', body: 'The annual sports programme brought students together through competition, discipline and house participation.', archived: true },
    { id: 'school-fete-2025', date: '2025-01-25', day: '25', month: 'JAN', year: '2025', title: 'School Fete', body: 'The school fete was scheduled as a community event for students, families and staff.', archived: true },
    { id: 'republic-day-2025', date: '2025-01-26', day: '26', month: 'JAN', year: '2025', title: 'Republic Day Celebration', body: 'Students and staff gathered on campus to mark Republic Day with pride and participation.', archived: true },
    { id: 'saraswati-puja-2025', date: '2025-02-01', day: '--', month: 'FEB', year: '2025', title: 'Saraswati Puja', body: 'The school community observed Saraswati Puja on campus.', archived: true },
  ],
  toppers: {
    classX: [
      { name: 'Priyanshu Raj', marks: '92.6%', image: orientalAsset('Priyanshu.jpg') },
      { name: 'Prachi Kumari', marks: '92.6%', image: orientalAsset('Prachi.jpg') },
      { name: 'Shital Mishra', marks: '92.6%', image: orientalAsset('Shital.jpg') },
      { name: 'Saurav Kr Agarwal', marks: '92.4%', image: orientalAsset('Saurav.jpg') },
      { name: 'Monu Kumar', marks: '91.2%', image: orientalAsset('Monu.jpg') },
      { name: 'Laksh Goswami', marks: '91%', image: orientalAsset('Laksh1.jpg') },
    ],
    classXII: [
      { name: 'Devansh Khandelwal', marks: '96.6%', image: orientalAsset('devansh.jpg') },
      { name: 'Saket Kumar', marks: '94.2%', image: orientalAsset('saket.jpg') },
      { name: 'Pragya Kumari', marks: '93.8%', image: orientalAsset('pragya.jpg') },
      { name: 'Shristy Kumari', marks: '93%', image: orientalAsset('shristy.jpg') },
      { name: 'Suman Kr Agarwal', marks: '90.8%', image: orientalAsset('suman.jpg') },
      { name: 'Anshika Komal', marks: '90%', image: orientalAsset('anshika.jpg') },
    ],
  },
  principal: {
    name: 'Dr Amir Hussain',
    role: 'Director & Principal',
    image: '/image/principal.png',
    quote: 'Education is a lifelong process that builds understanding, moral values and the confidence to face future challenges.',
    paragraphs: [
      'Modern education is about helping every child realise and explore their potential and latent talents. Our children represent our hopes and dreams. Parents, students and the school authorities are a team, and each complements the efforts of the others.',
      'Education is not simply the giving of knowledge for a future job. It is a lifelong process that creates an understanding of moral and ethical values, guides one\'s life and prepares students to become the future hope of the country.',
      'At Oriental Public School, Bandhdih, we seek to create an atmosphere of reverence for education and a healthy environment where work, sports and co-curricular activities mould our students and inspire them to become the brightest and the best.',
    ],
  },
  management: [
    { role: 'Director & Principal', name: 'Dr Amir Hussain', image: orientalAsset('amir hussain.jpg') },
    { role: 'Chairman', name: 'Mr Mustaq Ahmed', image: orientalAsset('mushtaq.jpg') },
    { role: 'Vice Principal', name: 'Mr Amit Kr Barnwal', image: orientalAsset('amitsir.jpg') },
    { role: 'Headmistress', name: 'Mrs Rinku Roy', image: orientalAsset('rinku.png') },
    { role: 'Shift In-charge, Senior', name: 'Mr Amarnath Ram', image: orientalAsset('amarnath.jpg') },
    { role: 'Shift In-charge, Junior', name: 'Mrs Sapna Sinha', image: orientalAsset('sapna.png') },
  ],
  faculty: [
    { subject: 'Physics', name: 'Mr Mahesh Singh', qualification: 'B.Ed, M.Sc', experience: '15+ years', image: orientalAsset('mahesh.jpg') },
    { subject: 'Chemistry', name: 'Mr Somnath Das', qualification: 'B.Ed, M.Sc', experience: '12+ years', image: orientalAsset('somnath.jpg') },
    { subject: 'Mathematics', name: 'Mr Sambhu Kumar', qualification: 'M.Tech', experience: '15+ years', image: orientalAsset('sambhu.jpg') },
    { subject: 'Economics', name: 'Mr Mahmood Ansari', qualification: 'M.Com, M.Ed', experience: '10+ years', image: orientalAsset('mahmood (2).jpg') },
    { subject: 'Accountancy', name: 'Mr Jitendra Kumar', qualification: 'M.Com, M.Ed', experience: '10+ years', image: orientalAsset('jitu.jpg') },
  ],
  facilities: [
    { number: '01', title: 'Learning & Academics', body: 'A structured learning environment designed to build knowledge, confidence and strong values.', image: orientalAsset('education.jpg') },
    { number: '02', title: 'Merit & Opportunity', body: 'Recognition and scholarship support encourage students to pursue excellence across academics and activities.', image: orientalAsset('scholorship.jpg') },
    { number: '03', title: 'Campus & Classrooms', body: 'A growing school campus planned around focused classrooms, movement and student participation.', image: orientalAsset('ops3d.jpg') },
    { number: '04', title: 'Sports & Co-curriculars', body: 'Sports, cultural programmes and collaborative activities help students grow beyond the classroom.', image: orientalAsset('opssportsday.jpg') },
  ],
  legacyProfile: {
    sourceNote: 'School profile information reproduced from the existing Oriental Public School website.',
    items: [
      {
        eyebrow: 'Lifelong learning',
        title: 'Education Services',
        body: 'Education is not just a process of giving knowledge for a future job, but a lifelong process that creates an understanding of moral and ethical values to guide one\'s life and make our students the future hope of the country.',
        image: orientalAsset('education.jpg'),
      },
      {
        eyebrow: 'Merit and opportunity',
        title: 'Scholarships',
        stat: '10 Lakhs +',
        body: 'The school grants various scholarships to students for excellence in academics, games and other curriculum.',
        image: orientalAsset('scholorship.jpg'),
      },
      {
        eyebrow: 'Senior school profile',
        title: 'Metric And Intermediate',
        body: 'Oriental Public School, Bokaro Steel City, was established in April 1992 as an English-medium co-educational Higher Secondary (+2) School affiliated to the Central Board of Secondary Education, New Delhi.',
        image: orientalAsset('ops3d.jpg'),
      },
      {
        eyebrow: 'Published board profile',
        title: 'CBSE Board',
        body: 'The Central Board of Secondary Education, New Delhi. The school profile states that the institution is run by the non-profit registered educational society "Sainik Shikha Prachar Samiti".',
        image: orientalAsset('cbse.png'),
      },
    ],
  },
  learningMoments: [
    { label: 'Community', image: orientalAsset('specialday.jpg') },
    { label: 'Curiosity', image: orientalAsset('initiatives1.jpg') },
    { label: 'Teamwork', image: orientalAsset('opssportsday.jpg') },
    { label: 'Creativity', image: orientalAsset('initiatives4.png') },
    { label: 'Confidence', image: orientalAsset('initiatives6.jpg') },
    { label: 'Discovery', image: orientalAsset('initiatives8.jpg') },
  ],
  initiatives: [
    orientalAsset('initiatives1.jpg'),
    orientalAsset('initiatives2.jpg'),
    orientalAsset('initiatives3.jpg'),
    orientalAsset('initiatives4.png'),
    orientalAsset('initiatives5.jpg'),
    orientalAsset('initiatives6.jpg'),
    orientalAsset('initiatives7.jpg'),
    orientalAsset('initiatives8.jpg'),
  ],
  about: {
    eyebrow: 'About Oriental',
    title: 'Rooted in Jainamore. Built around every learner.',
    intro: 'The Oriental Public School serves families in Jainamore and Bandhdih, Bokaro, with an education shaped by academic purpose, participation and values.',
    paragraphs: [
      'The school community brings teachers, students and parents together around a simple belief: children learn best when they are known, encouraged and given room to discover their abilities.',
      'Alongside classroom learning, sports and co-curricular activities form an important part of school life. These experiences help students practise teamwork, responsibility, creativity and confident expression.',
      'The Oriental Public School Jainamore is listed in the official RTE Bokaro school records under UDISE code 20130702412. The school header identifies its RTE code as BOK/2022-23/13.',
    ],
    values: [
      ['Purposeful learning', 'Clear academic foundations with curiosity and application.'],
      ['Character in action', 'Respect, responsibility and ethical values in everyday school life.'],
      ['Whole-child growth', 'Sport, creativity, culture and collaboration alongside academics.'],
      ['Shared responsibility', 'Parents, students and educators working as one school community.'],
    ],
  },
};

export function mergeContent(defaults, saved) {
  if (!saved || typeof saved !== 'object') return defaults;
  if (Array.isArray(defaults)) return Array.isArray(saved) ? saved : defaults;

  const merged = { ...defaults, ...saved };
  Object.keys(defaults).forEach((key) => {
    const defaultValue = defaults[key];
    const savedValue = saved[key];
    if (defaultValue && typeof defaultValue === 'object' && !Array.isArray(defaultValue)) {
      merged[key] = mergeContent(defaultValue, savedValue);
    }
  });
  return merged;
}

const SiteContentContext = createContext(null);

function getTestState() {
  if (!import.meta.env.DEV || typeof window === 'undefined') return null;
  return window.__ORIENTAL_TEST_STATE__ || null;
}

export function getSiteContent() {
  return mergeContent(defaultSiteContent, getTestState()?.content);
}

export function SiteContentProvider({ children }) {
  const testState = getTestState();
  const [content, setContent] = useState(() => mergeContent(defaultSiteContent, testState?.content));
  const [session, setSession] = useState(testState?.admin ? { user: { email: 'test@oriental.local' } } : null);
  const [cloud, setCloud] = useState({
    configured: Boolean(testState || isSupabaseConfigured),
    loading: Boolean(!testState && isSupabaseConfigured),
    saving: false,
    error: !testState && !isSupabaseConfigured ? missingSupabaseMessage : '',
    updatedAt: null,
  });
  const mountedRef = useRef(true);

  const applyRemoteContent = useCallback((remoteContent, updatedAt = null) => {
    if (!mountedRef.current) return;
    setContent(mergeContent(defaultSiteContent, remoteContent));
    setCloud((current) => ({ ...current, loading: false, error: '', updatedAt }));
  }, []);

  const reload = useCallback(async () => {
    if (testState) return { ok: true };
    if (!supabase) return { ok: false, error: missingSupabaseMessage };
    setCloud((current) => ({ ...current, loading: true, error: '' }));
    const { data, error } = await supabase
      .from(SITE_CONTENT_TABLE)
      .select('content, updated_at')
      .eq('id', SITE_CONTENT_ID)
      .maybeSingle();
    if (error) {
      setCloud((current) => ({ ...current, loading: false, error: error.message }));
      return { ok: false, error: error.message };
    }
    applyRemoteContent(data?.content, data?.updated_at || null);
    return { ok: true };
  }, [applyRemoteContent, testState]);

  useEffect(() => {
    mountedRef.current = true;
    if (testState || !supabase) return () => { mountedRef.current = false; };

    reload();
    supabase.auth.getSession().then(({ data }) => {
      if (mountedRef.current) setSession(data.session);
    });
    const { data: authData } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mountedRef.current) setSession(nextSession);
    });
    const channel = supabase
      .channel('oriental-site-content')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: SITE_CONTENT_TABLE, filter: `id=eq.${SITE_CONTENT_ID}` },
        (payload) => applyRemoteContent(payload.new?.content, payload.new?.updated_at || null),
      )
      .subscribe();

    return () => {
      mountedRef.current = false;
      authData.subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [applyRemoteContent, reload, testState]);

  const login = useCallback(async (email, password) => {
    if (testState) {
      const testSession = { user: { email } };
      setSession(testSession);
      return { ok: true };
    }
    if (!supabase) return { ok: false, error: missingSupabaseMessage };
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { ok: false, error: error.message };
    setSession(data.session);
    await reload();
    return { ok: true };
  }, [reload, testState]);

  const logout = useCallback(async () => {
    if (!testState && supabase) await supabase.auth.signOut();
    setSession(null);
  }, [testState]);

  const publish = useCallback(async (nextContent) => {
    const normalized = mergeContent(defaultSiteContent, nextContent);
    if (testState) {
      testState.content = normalized;
      setContent(normalized);
      setCloud((current) => ({ ...current, updatedAt: new Date().toISOString() }));
      return { ok: true };
    }
    if (!supabase) return { ok: false, error: missingSupabaseMessage };
    if (!session?.user?.id) return { ok: false, error: 'Your admin session expired. Sign in again.' };
    setCloud((current) => ({ ...current, saving: true, error: '' }));
    const updatedAt = new Date().toISOString();
    const { error } = await supabase.from(SITE_CONTENT_TABLE).upsert({
      id: SITE_CONTENT_ID,
      content: normalized,
      updated_at: updatedAt,
      updated_by: session.user.id,
    }, { onConflict: 'id' });
    if (error) {
      setCloud((current) => ({ ...current, saving: false, error: error.message }));
      return { ok: false, error: error.message };
    }
    setContent(normalized);
    setCloud((current) => ({ ...current, saving: false, error: '', updatedAt }));
    return { ok: true };
  }, [session, testState]);

  const uploadImage = useCallback(async (file, folder = 'uploads', options = {}) => {
    if (testState) {
      return { ok: true, url: URL.createObjectURL(file), originalBytes: file.size, outputBytes: file.size };
    }
    if (!supabase) return { ok: false, error: missingSupabaseMessage };
    if (!session?.user?.id) return { ok: false, error: 'Your admin session expired. Sign in again.' };
    try {
      const prepared = await prepareWebp(file, options);
      const path = makeStoragePath(folder, prepared.file.name);
      const { error } = await supabase.storage.from(SITE_ASSETS_BUCKET).upload(path, prepared.file, {
        cacheControl: '31536000',
        contentType: 'image/webp',
        upsert: false,
      });
      if (error) return { ok: false, error: error.message };
      const { data } = supabase.storage.from(SITE_ASSETS_BUCKET).getPublicUrl(path);
      return { ok: true, url: data.publicUrl, path, ...prepared };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }, [session, testState]);

  const value = useMemo(() => ({
    content,
    session,
    isAuthenticated: Boolean(session),
    cloud,
    login,
    logout,
    publish,
    reload,
    uploadImage,
  }), [cloud, content, login, logout, publish, reload, session, uploadImage]);

  return createElement(SiteContentContext.Provider, { value }, children);
}

export function useSiteContentState() {
  const context = useContext(SiteContentContext);
  if (!context) throw new Error('useSiteContentState must be used inside SiteContentProvider.');
  return context;
}

export function useSiteContent() {
  return useSiteContentState().content;
}
