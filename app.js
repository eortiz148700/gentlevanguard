(() => {
  'use strict';
  const elements = [...document.querySelectorAll('[data-i18n]')];
  const spanish = Object.fromEntries(elements.map(el => [el.dataset.i18n, el.innerHTML]));
  Object.assign(spanish, {languageLabel:'Idioma',themeLabel:'Cambiar tema',menuLabel:'Alternar navegación',navLabel:'Navegación principal',openedWa:'Se abrirá WhatsApp con tu mensaje. Revisalo y envialo allí.',openedEmail:'Se abrirá tu aplicación de correo con el mensaje. Revisalo y envialo allí.',messageIntro:'¡Hola GentleVanguard! Quiero conversar sobre un proyecto.',messageName:'Nombre',messageCompany:'Organización',messageInterest:'Interés',emailSubject:'Consulta para GentleVanguard'});
  Object.assign(spanish, {siteTitle:document.title,metaDescription:document.querySelector('meta[name="description"]').content,ogDescription:document.querySelector('meta[property="og:description"]').content,opEntries:'Puntos de entrada',langHint:'Elegí el idioma del sitio'});
  const copy = () => document.documentElement.lang === 'es' ? spanish : window.GV_COPY[document.documentElement.lang];
  spanish.messageSource = 'Referencia de campaña';
  const nav = document.querySelector('#navigation');
  const menu = document.querySelector('#menu');
  function closeMenu() { nav.classList.remove('is-open'); menu.setAttribute('aria-expanded','false'); }
  function translate() {
    const lang = document.documentElement.lang;
    elements.forEach(el => {
      if (lang === 'es') el.innerHTML = spanish[el.dataset.i18n];
      else el.textContent = copy()[el.dataset.i18n];
    });
    [['#language','languageLabel'],['#theme','themeLabel'],['#menu','menuLabel'],['#navigation','navLabel'],['.service-tabs','navServices'],['.op-inputs','opEntries']].forEach(([selector,key]) => document.querySelector(selector).setAttribute('aria-label',copy()[key]));
    document.querySelector('.language-control').title = copy().langHint;
    document.title = copy().siteTitle;
    document.querySelector('meta[name="description"]').content = copy().metaDescription;
    document.querySelector('meta[property="og:title"]').content = copy().siteTitle;
    document.querySelector('meta[property="og:description"]').content = copy().ogDescription;
    document.querySelector('meta[property="og:locale"]').content = {es:'es_AR',en:'en_US',pt:'pt_BR'}[lang];
    document.querySelector('link[rel="manifest"]').href = lang === 'es' ? 'manifest.webmanifest' : `manifest.${lang}.webmanifest`;
    document.querySelector('#form-status').textContent = '';
    closeMenu();
  }
  window.addEventListener('gv-language', translate);
  translate();
  menu.addEventListener('click', () => { const open = nav.classList.toggle('is-open'); menu.setAttribute('aria-expanded',String(open)); });
  nav.addEventListener('click', closeMenu);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  document.addEventListener('click', event => { if (!event.target.closest('.gv-topbar')) closeMenu(); });
  document.querySelectorAll('[data-interest]').forEach(link => link.addEventListener('click', () => { document.querySelector('#interest').value = link.dataset.interest; }));
  document.querySelector('#contact-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const params = new URLSearchParams(location.search);
    const campaign = ['utm_source','utm_campaign','utm_content'].map(key => params.get(key) || '').filter(value => /^[a-z0-9_-]{1,80}$/i.test(value)).join(' / ');
    const text = [copy().messageIntro, `${copy().messageName}: ${fields.get('name').trim()}`, fields.get('company').trim() ? `${copy().messageCompany}: ${fields.get('company').trim()}` : '', `${copy().messageInterest}: ${form.elements.interest.selectedOptions[0].textContent}`, campaign ? `${copy().messageSource}: ${campaign}` : '', '', fields.get('message').trim()].filter(line => line !== '').join('\n');
    if (event.submitter?.value === 'email') {
      document.querySelector('#form-status').textContent = copy().openedEmail;
      window.location.href = `mailto:gentlevanguard@gmail.com?subject=${encodeURIComponent(copy().emailSubject)}&body=${encodeURIComponent(text)}`;
    } else {
      document.querySelector('#form-status').textContent = copy().openedWa;
      window.open(`https://wa.me/5492645452221?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    }
  });
})();
