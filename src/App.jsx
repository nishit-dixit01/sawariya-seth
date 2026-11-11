import { useEffect, useState } from 'react';

const menuParts = [
  { id: 'roti', label: 'Roti', note: 'A soft, familiar fold', group: 'FROM THE TAWA' },
  { id: 'rice', label: 'Rice', note: 'A little room for something warm', group: 'FROM THE POT' },
  { id: 'dal', label: 'Dal', note: 'Comfort in a spoonful', group: 'FROM THE POT' },
  { id: 'sabzi', label: 'Seasonal sabzi', note: 'The everyday centrepiece', group: 'FROM THE KITCHEN' },
  { id: 'side', label: 'A small side', note: 'A bright finish to the meal', group: 'ON THE SIDE' },
];

const faqs = [
  { q: 'What is on the menu today?', a: 'The current menu has not been provided here. Send an enquiry to ask what is being prepared and what is available.' },
  { q: 'What does a tiffin include?', a: 'Use the menu page to sketch the kind of meal you have in mind. The selection there is illustrative; please confirm actual items with the service.' },
  { q: 'Do you deliver to my area?', a: 'The service area is not listed here. Please ask directly before making plans.' },
  { q: 'How much does a tiffin cost?', a: 'Prices have not been shared on this website. Ask for current pricing when you enquire.' },
  { q: 'Can I mention a dietary requirement?', a: 'Yes. Add it to the note and ask the service to confirm whether it can be accommodated.' },
];

function Icon({ name, size = 18 }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (name === 'arrow') return <svg {...props}><path d="M4 12h15m-6-7 7 7-7 7" /></svg>;
  if (name === 'arrowUp') return <svg {...props}><path d="M12 19V5m-7 7 7-7 7 7" /></svg>;
  if (name === 'plus') return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>;
  if (name === 'minus') return <svg {...props}><path d="M5 12h14" /></svg>;
  if (name === 'copy') return <svg {...props}><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/></svg>;
  if (name === 'menu') return <svg {...props}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
  if (name === 'close') return <svg {...props}><path d="m6 6 12 12M18 6 6 18"/></svg>;
  if (name === 'sun') return <svg {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>;
  return null;
}

function App() {
  const [route, setRoute] = useState(() => window.location.pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [mealDraft, setMealDraft] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const syncRoute = () => { setRoute(window.location.pathname); setMenuOpen(false); };
    window.addEventListener('popstate', syncRoute);
    return () => window.removeEventListener('popstate', syncRoute);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { document.title = `${routeTitle(route)} — Sawariya Seth Tiffin Service`; }, 0);
    return () => window.clearTimeout(timer);
  }, [route]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function navigate(path) {
    if (path !== window.location.pathname) window.history.pushState({}, '', path);
    setRoute(path);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function togglePart(id) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function startEnquiry() {
    const labels = menuParts.filter((part) => selected.includes(part.id)).map((part) => part.label);
    setMealDraft(labels.join(', '));
    navigate('/contact');
  }

  const isMenu = route === '/menu';
  return <div className="site-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    <div className="topline"><span><span className="topline-dot" /> A tiffin, thoughtfully put together</span><span className="topline-note">SAWARIYA SETH · TIFFIN SERVICE</span></div>
    <header className="header">
      <button className="mobile-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen((open) => !open)}><Icon name={menuOpen ? 'close' : 'menu'} size={21} /></button>
      <a className="brand" href="/" onClick={(event) => { event.preventDefault(); navigate('/'); }} aria-label="Sawariya Seth Tiffin Service home"><span className="brand-mark">S<span>.</span></span><span className="brand-name">SAWARIYA SETH<small>TIFFIN SERVICE</small></span></a>
      <nav className={`navigation ${menuOpen ? 'navigation-open' : ''}`} aria-label="Main navigation">
        <NavLink href="/menu" active={isMenu} navigate={navigate}>The menu</NavLink>
        <NavLink href="/how-it-works" active={route === '/how-it-works'} navigate={navigate}>How it works</NavLink>
        <NavLink href="/about" active={route === '/about'} navigate={navigate} className="nav-about">Our approach</NavLink>
        <NavLink href="/faq" active={route === '/faq'} navigate={navigate}>Questions</NavLink>
      </nav>
      <button className="header-cta" onClick={() => navigate('/contact')}>Start an enquiry <Icon name="arrow" size={15} /></button>
    </header>

    <main id="main" key={route}>
      {route === '/' && <HomePage navigate={navigate} />}
      {route === '/menu' && <MenuPage selected={selected} togglePart={togglePart} startEnquiry={startEnquiry} />}
      {route === '/how-it-works' && <StepsPage navigate={navigate} />}
      {route === '/about' && <AboutPage navigate={navigate} />}
      {route === '/contact' && <ContactPage setToast={setToast} initialMeal={mealDraft} />}
      {route === '/faq' && <FaqPage navigate={navigate} />}
      {!['/', '/menu', '/how-it-works', '/about', '/contact', '/faq'].includes(route) && <NotFound navigate={navigate} />}
    </main>

    <Footer navigate={navigate} />
    <div className={`toast ${toast ? 'toast-visible' : ''}`} role="status" aria-live="polite">{toast}</div>
  </div>;
}

function routeTitle(route) {
  return ({ '/': 'A little care, packed for lunch', '/menu': 'The menu', '/how-it-works': 'How it works', '/about': 'Our approach', '/contact': 'Start an enquiry', '/faq': 'Questions' })[route] || 'Page not found';
}

function NavLink({ href, active, navigate, children, className = '' }) {
  return <a className={`nav-link ${active ? 'nav-active' : ''} ${className}`} href={href} aria-current={active ? 'page' : undefined} onClick={(event) => { event.preventDefault(); navigate(href); }}>{children}</a>;
}

function HomePage({ navigate }) {
  return <>
    <section className="hero wrap">
      <div className="hero-copy">
        <p className="eyebrow"><span className="eyebrow-line" /> GOOD FOOD, READY FOR THE DAY</p>
        <h1>A little care,<br /><em>packed for lunch.</em></h1>
        <p className="hero-lede">The comfort of a proper meal, made part of your everyday rhythm.</p>
        <div className="hero-actions"><button className="button button-dark" onClick={() => navigate('/menu')}>Explore the menu <Icon name="arrow" size={16} /></button><button className="quiet-link" onClick={() => navigate('/how-it-works')}>How it works <Icon name="arrow" size={14} /></button></div>
        <div className="hero-foot"><span>SAWARIYA SETH</span><span>MADE FOR THE MIDDLE OF YOUR DAY</span></div>
      </div>
      <div className="hero-art-wrap"><img src="/dabba-still-life.svg" className="hero-art" alt="Illustrated Indian tiffin with a colourful example meal"/><div className="art-stamp"><Icon name="sun" size={16} /><span>A MOMENT<br/>TO SLOW DOWN</span></div><span className="art-caption">A little something to look forward to.</span></div>
      <span className="side-index">01 — SAWARIYA SETH</span>
    </section>

    <section className="intro-band"><div className="intro-mark">S<span>.</span></div><p>Lunch should feel like a <em>pause worth taking.</em><br/><span>A warm plate. A familiar flavour. A moment that belongs to you.</span></p><button aria-label="Read our approach" className="round-link" onClick={() => navigate('/about')}><Icon name="arrow" size={16}/></button></section>

    <section className="home-menu wrap"><div className="section-head"><div><p className="eyebrow">A MEAL, YOUR WAY</p><h2>Make room for<br/><em>the good bit.</em></h2></div><p className="section-aside">Start with a few familiar parts. Then ask the service what is on the menu and available today.</p></div>
      <div className="menu-preview"><img src="/dabba-still-life.svg" alt="A sample tiffin arrangement"/><div className="preview-copy"><span className="number-label">THE TIFFIN / A STARTING POINT</span><h3>Simple things,<br/><em>done with care.</em></h3><p>An illustrative meal idea, made from the kind of pieces that make lunch feel complete. The current menu and availability should be confirmed before ordering.</p><button className="text-arrow" onClick={() => navigate('/menu')}>Build an example meal <Icon name="arrow" size={15}/></button></div></div>
    </section>

    <section className="rhythm-band"><div className="rhythm-inner wrap"><p className="eyebrow"><span className="eyebrow-line"/> A SIMPLE WAY TO BEGIN</p><h2>Ask what’s cooking.<br/><em>Take it from there.</em></h2><p>Tell Sawariya Seth what you’re looking for. Confirm the current menu, price, and service details directly before making a plan.</p><button className="button button-paper" onClick={() => navigate('/how-it-works')}>See how to get started <Icon name="arrow" size={16}/></button><span className="rhythm-note">NO ASSUMPTIONS. JUST A GOOD PLACE TO START.</span></div></section>

    <section className="home-faq wrap"><div><p className="eyebrow">A FEW THINGS TO KNOW</p><h2>Good questions<br/><em>come first.</em></h2><button className="text-arrow" onClick={() => navigate('/faq')}>Read the common questions <Icon name="arrow" size={15}/></button></div><div className="faq-teaser"><p><span>01</span> What is on the menu today?<Icon name="arrow" size={14}/></p><p><span>02</span> Is my area covered?<Icon name="arrow" size={14}/></p><p><span>03</span> What does a meal cost?<Icon name="arrow" size={14}/></p><small>These details have not been provided yet. Ask when you enquire.</small></div></section>
  </>;
}

function MenuPage({ selected, togglePart, startEnquiry }) {
  return <section className="page-wrap wrap">
    <div className="page-heading menu-heading"><div><p className="eyebrow"><span className="eyebrow-line"/> THE TIFFIN, IN PIECES</p><h1>A meal takes<br/><em>shape here.</em></h1></div><p className="page-intro-text">Use this little builder to describe what you have in mind. It is an illustration, not a confirmed menu. Ask the service about today’s dishes and availability.</p></div>
    <div className="menu-builder"><div className="builder-list"><div className="builder-label"><span>01 / PICK YOUR PIECES</span><span>ILLUSTRATIVE ONLY</span></div>{menuParts.map((part) => { const active = selected.includes(part.id); return <button key={part.id} className={`builder-row ${active ? 'builder-row-active' : ''}`} aria-pressed={active} onClick={() => togglePart(part.id)}><span className="builder-row-text"><small>{part.group}</small><strong>{part.label}</strong><span>{part.note}</span></span><span className="builder-toggle"><Icon name={active ? 'minus' : 'plus'} size={16}/></span></button>; })}<p className="builder-disclaimer">Example components only. Actual dishes, ingredients, and availability must be confirmed with the service.</p></div>
      <aside className="builder-aside"><div className="aside-image"><img src="/dabba-still-life.svg" alt="Example tiffin meal illustration"/><span>AN EXAMPLE, NOT TODAY’S MENU</span></div><div className="aside-content"><p className="eyebrow">YOUR STARTING POINT</p><h2>{selected.length ? `${selected.length} ${selected.length === 1 ? 'idea' : 'ideas'} for lunch.` : 'What sounds good?'}</h2><p>{selected.length ? selected.map((id) => menuParts.find((part) => part.id === id)?.label).join(' · ') : 'Choose a few parts to include in your note, or keep it open and ask what is available.'}</p><button className="button button-dark full-button" onClick={startEnquiry}>Ask about availability <Icon name="arrow" size={16}/></button><small>No order is placed here. This will prepare an enquiry for you to share.</small></div></aside>
    </div>
    <div className="menu-note"><span>PLEASE CONFIRM BEFORE ORDERING</span><p>Daily menu, prices, ingredients, timings, and delivery details are not listed here. Confirm them directly with Sawariya Seth.</p></div>
  </section>;
}

function StepsPage({ navigate }) {
  const steps = [
    { n: '01', title: 'Ask what is cooking.', text: 'Start with the current menu. Ask which dishes and meal options are available.' },
    { n: '02', title: 'Share what suits you.', text: 'Mention the sort of tiffin you have in mind, along with any dietary questions or requirements.' },
    { n: '03', title: 'Confirm the details.', text: 'Check price, timing, service area, and how an order is arranged directly with the service.' },
  ];
  return <section className="page-wrap wrap steps-page"><div className="page-heading"><div><p className="eyebrow"><span className="eyebrow-line"/> HOW TO GET STARTED</p><h1>A good lunch<br/><em>starts with a note.</em></h1></div><p className="page-intro-text">A simple enquiry gives you room to check the important details first. No ordering information has been assumed on this site.</p></div><div className="steps-list">{steps.map((step) => <article className="step-row" key={step.n}><span className="step-number">{step.n}</span><h2>{step.title}</h2><p>{step.text}</p><span className="step-line"/></article>)}</div><div className="step-end"><div><span className="number-label">A NOTE IS A GOOD FIRST STEP</span><p>Use the enquiry page to write a question or copy a message you can share with the service.</p></div><button className="button button-dark" onClick={() => navigate('/contact')}>Write an enquiry <Icon name="arrow" size={16}/></button></div></section>;
}

function AboutPage({ navigate }) {
  return <section className="about-page"><div className="about-hero wrap"><div className="about-heading"><p className="eyebrow"><span className="eyebrow-line"/> OUR APPROACH</p><h1>Everyday food.<br/><em>A little more care.</em></h1><p>A tiffin is more than a container. It is a small promise to make time for a proper meal.</p></div><div className="about-visual"><img src="/dabba-still-life.svg" alt="A thoughtfully packed example tiffin"/><span>SAWARIYA SETH / TIFFIN SERVICE</span></div></div><div className="about-statement"><p className="eyebrow">THE IDEA IS A SIMPLE ONE</p><p>Familiar food, packed for a day that does not always slow down.<br/><em>Make lunch the part you look forward to.</em></p></div><div className="about-bottom wrap"><div><span className="number-label">START WITH THE DETAILS</span><h2>Ask first.<br/><em>Then enjoy.</em></h2></div><div><p>Every kitchen and tiffin service has its own menu and rhythm. Ask Sawariya Seth directly about the current dishes, ingredients, price, timings, and service area.</p><button className="text-arrow" onClick={() => navigate('/faq')}>Read common questions <Icon name="arrow" size={15}/></button></div></div></section>;
}

function ContactPage({ setToast, initialMeal }) {
  const [form, setForm] = useState(() => ({ name: '', contact: '', meal: initialMeal, message: '' }));
  const [error, setError] = useState('');
  function update(event) { setForm((current) => ({ ...current, [event.target.name]: event.target.value })); setError(''); }
  async function submit(event) {
    event.preventDefault();
    const note = `Hello Sawariya Seth Tiffin Service,\n\n${form.message}\n\nName: ${form.name}\nMy contact: ${form.contact}${form.meal ? `\nMeal ideas: ${form.meal}` : ''}`;
    if (!navigator.clipboard?.writeText) { setError('Clipboard access is unavailable here. Your note has not been sent.'); return; }
    try {
      await navigator.clipboard.writeText(note);
      setToast('Your note is copied. Share it with the service using your preferred contact method.');
      setForm({ name: '', contact: '', meal: '', message: '' });
    } catch { setError('The browser could not copy your note. Nothing was sent; please try again.'); }
  }
  return <section className="page-wrap wrap contact-page"><div className="page-heading"><div><p className="eyebrow"><span className="eyebrow-line"/> START A CONVERSATION</p><h1>What’s on<br/><em>your mind?</em></h1></div><p className="page-intro-text">Ask about the current menu, pricing, service area, or anything else you would like to know before ordering.</p></div><div className="contact-layout"><div className="contact-aside"><span className="contact-index">S<span>.</span> / 01</span><h2>We’ll make a<br/>good note of it.</h2><p>There is no contact address in the details provided for this site. The form below prepares a message on your device; it does not send it.</p><div className="aside-rule"/><span className="number-label">MENU · TIMING · AREA · PRICE</span></div><form className="contact-form" onSubmit={submit}><div className="form-top"><span>YOUR ENQUIRY</span><span>PRIVATE UNTIL YOU SHARE</span></div><label>Your name<input name="name" value={form.name} onChange={update} autoComplete="name" required placeholder="Name"/></label><label>How should the service reach you?<input name="contact" value={form.contact} onChange={update} required placeholder="Phone, email, or preferred contact"/></label><label>Meal ideas <span className="optional">OPTIONAL</span><input name="meal" value={form.meal} onChange={update} placeholder="A meal component or dish you have in mind"/></label><label>Your message<textarea name="message" value={form.message} onChange={update} rows="5" required placeholder="Ask about the menu, availability, or anything you need to know…"/></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-dark form-submit" type="submit">Copy enquiry note <Icon name="copy" size={16}/></button><p className="form-footnote">The message is copied to your clipboard only. It is not automatically delivered.</p></form></div></section>;
}

function FaqPage({ navigate }) {
  return <section className="page-wrap wrap faq-page"><div className="page-heading"><div><p className="eyebrow"><span className="eyebrow-line"/> BEFORE YOU ORDER</p><h1>The useful<br/><em>little details.</em></h1></div><p className="page-intro-text">A few common questions, answered as clearly as the information available allows. Please confirm service details directly.</p></div><div className="faq-list">{faqs.map((item, index) => <details key={item.q} className="faq-item"><summary><span className="faq-number">{String(index + 1).padStart(2, '0')}</span><span>{item.q}</span><span className="faq-plus"><Icon name="plus" size={16}/></span></summary><p>{item.a}</p></details>)}</div><div className="faq-cta"><p>Have a question we missed?</p><button className="text-arrow" onClick={() => navigate('/contact')}>Write a note <Icon name="arrow" size={15}/></button></div></section>;
}

function NotFound({ navigate }) {
  return <section className="not-found wrap"><p className="eyebrow">SAWARIYA SETH / 404</p><h1>That page<br/><em>is not here.</em></h1><button className="button button-dark" onClick={() => navigate('/')}>Back to the beginning <Icon name="arrow" size={16}/></button></section>;
}

function Footer({ navigate }) {
  return <footer className="footer"><div className="footer-top wrap"><a href="/" className="footer-brand" onClick={(event) => { event.preventDefault(); navigate('/'); }}>S<span>.</span><small>SAWARIYA SETH<br/>TIFFIN SERVICE</small></a><p>A little care,<br/><em>packed for lunch.</em></p><div className="footer-links"><button onClick={() => navigate('/menu')}>The menu</button><button onClick={() => navigate('/how-it-works')}>How it works</button><button onClick={() => navigate('/about')}>Our approach</button><button onClick={() => navigate('/faq')}>Questions</button><button onClick={() => navigate('/contact')}>Start an enquiry</button></div><button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top <Icon name="arrowUp" size={14}/></button></div><div className="footer-bottom wrap"><span>SAWARIYA SETH · TIFFIN SERVICE</span><span>MENU AND SERVICE DETAILS TO BE CONFIRMED DIRECTLY</span></div></footer>;
}

export default App;
