'use strict';
const $ = selector => document.querySelector(selector);
document.documentElement.classList.add('js');

// All story distances and phase timings live here. No animation library needed.
const STORY = Object.freeze({
  minWidth: 900, minHeight: 700,
  maxHeroHeight: 680, minHeroHeight: 540, headerAllowance: 124,
  travel: 280, introEnd: 0.12, settleStart: 0.86,
  translateX: 2.5, translateY: 1.5, rotateY: -3, initialScale: 0.965,
  labels: ['Fleet rental', 'Servicing & repairs', 'Parts & fabrication'],
  labelBreaks: [0.34, 0.68]
});

const menu = $('.menu');
const nav = $('#nav');
function closeMenu(returnFocus = false) {
  menu?.setAttribute('aria-expanded', 'false');
  nav?.classList.remove('open');
  if (returnFocus) menu?.focus();
}
if (menu) {
  menu.hidden = false;
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('header')) closeMenu();
  });
  nav.addEventListener('focusout', () => {
    queueMicrotask(() => { if (!nav.contains(document.activeElement) && document.activeElement !== menu) closeMenu(); });
  });
}
document.querySelectorAll('nav a').forEach(link => link.addEventListener('click', () => closeMenu()));
document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
  const destination = document.getElementById(link.hash.slice(1));
  if (!destination) return;
  if (!destination.hasAttribute('tabindex')) destination.setAttribute('tabindex', '-1');
  destination.focus({preventScroll:true});
}));

const form = $('#quote-form');
function selectNeed(value) {
  if (!form) return;
  form.elements.service.value = value;
  document.querySelectorAll('[data-need]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.need === value)));
  const hasFleet = value === 'Rent motorcycles' || value === 'Service my fleet';
  $('#fleet-field').hidden = !hasFleet;
  form.elements.fleet.disabled = !hasFleet;
  form.elements.fleet.removeAttribute('aria-invalid');
  $('#fleet-error').textContent = '';
  $('#form-status').textContent = '';
}
if (form) {
  // The HTML fieldset remains disabled if JavaScript cannot initialise.
  form.querySelector('fieldset').disabled = false;
  document.querySelectorAll('[data-need]').forEach(button => button.addEventListener('click', () => selectNeed(button.dataset.need)));
  form.elements.service.addEventListener('change', event => selectNeed(event.target.value));
  const need = new URLSearchParams(location.search).get('need');
  selectNeed([...form.elements.service.options].some(option => option.value === need) ? need : form.elements.service.value);
  form.addEventListener('input', event => {
    const field = event.target;
    field.removeAttribute('aria-invalid');
    const error = document.getElementById(field.name + '-error');
    if (error) error.textContent = '';
    $('#form-status').textContent = '';
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    const fields = form.elements;
    const status = $('#form-status');
    const invalidFields = [];
    form.querySelectorAll('[aria-invalid]').forEach(field => field.removeAttribute('aria-invalid'));
    form.querySelectorAll('.field-error').forEach(error => { error.textContent = ''; });
    function invalid(field, message) {
      field.setAttribute('aria-invalid', 'true');
      document.getElementById(field.name + '-error').textContent = message;
      invalidFields.push(field);
    }
    if (!fields.name.value.trim()) invalid(fields.name, 'Enter a name.');
    if (!fields.email.value.trim() && !fields.phone.value.trim()) invalid(fields.email, 'Enter an email address or phone number.');
    if (fields.email.value && !fields.email.validity.valid) invalid(fields.email, 'Enter a valid email address.');
    if (fields.phone.value.trim() && (!/^\+?[\d\s().-]+$/.test(fields.phone.value.trim()) || !/^\d{7,15}$/.test(fields.phone.value.replace(/\D/g, '')))) invalid(fields.phone, 'Enter a phone number using digits and an optional + prefix.');
    if (!fields.fleet.disabled && !fields.fleet.validity.valid) invalid(fields.fleet, 'Enter a whole number from 1 to 100,000.');
    if (!fields.message.value.trim()) invalid(fields.message, 'Add a short description.');
    status.dataset.valid = String(invalidFields.length === 0);
    if (invalidFields.length) {
      status.textContent = 'Please check the highlighted fields. No enquiry has been sent.';
      invalidFields[0].focus();
      return;
    }
    // Deliberately no fetch, mailto, localStorage, analytics or submission destination.
    status.textContent = 'Demo complete — your details passed validation. No enquiry was sent and no form data was stored by this website.';
    status.focus();
  });
}

const scene = $('.hero-scroll');
if (scene) {
  const motor = $('#motorcycle');
  const shadow = $('.contact-shadow');
  const media = motor.querySelector('img');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let active = true;
  let enabled = false;
  let failed = false;
  let top = 0;
  let lastProgress = -1;
  function paint() {
    frame = 0;
    if (document.hidden || !active) return;
    const progress = enabled ? Math.max(0, Math.min(1, (scrollY - top) / STORY.travel)) : 1;
    if (progress === lastProgress) return;
    lastProgress = progress;
    const phase = Math.max(0, Math.min(1, (progress - STORY.introEnd) / (STORY.settleStart - STORY.introEnd)));
    const move = phase * phase * (3 - 2 * phase);
    motor.style.transform = enabled ? `perspective(1400px) translate3d(${(1-move)*STORY.translateX}%,${(1-move)*STORY.translateY}%,0) rotateY(${(1-move)*STORY.rotateY}deg) scale(${STORY.initialScale+(1-STORY.initialScale)*move})` : 'none';
    shadow.style.transform = enabled ? `translateX(${(1-move)*2}%) scaleX(${.94+.06*move})` : 'none';
    motor.dataset.progress = progress.toFixed(3);
    const index = progress < STORY.labelBreaks[0] ? 0 : progress < STORY.labelBreaks[1] ? 1 : 2;
    $('#sequence-text').textContent = STORY.labels[index];
  }
  function schedule() {
    if (!frame && active && !document.hidden) frame = requestAnimationFrame(paint);
  }
  function configure() {
    enabled = !failed && !reduced.matches && innerWidth >= STORY.minWidth && innerHeight >= STORY.minHeight;
    scene.dataset.motion = enabled ? 'pinned' : 'static';
    scene.style.setProperty('--hero-height', Math.max(STORY.minHeroHeight, Math.min(STORY.maxHeroHeight, innerHeight-STORY.headerAllowance))+'px');
    scene.style.setProperty('--story-travel', STORY.travel+'px');
    top = scene.getBoundingClientRect().top + scrollY;
    lastProgress = -1;
    closeMenu();
    schedule();
  }
  new IntersectionObserver(entries => {
    active = entries[0].isIntersecting;
    if (active) schedule();
    else { cancelAnimationFrame(frame); frame = 0; }
  }, {rootMargin:'50px'}).observe(scene);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
    else { lastProgress = -1; schedule(); }
  });
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', configure, {passive:true});
  addEventListener('pageshow', configure);
  reduced.addEventListener('change', configure);
  document.fonts?.ready.then(configure);
  function mediaFailed() {
    failed = true;
    motor.hidden = true;
    shadow.hidden = true;
    $('.media-fallback').hidden = false;
    configure();
  }
  media.addEventListener('error', mediaFailed);
  if (media.complete && !media.naturalWidth) mediaFailed();
  configure();
}

// Preserve bookmarked query-string links while every destination works without JS.
if (location.pathname.endsWith('/services.html')) {
  const routes = {rentals:'fleet-rentals.html', repairs:'servicing-repairs.html', parts:'parts-fabrication.html', support:'rider-fleet-support.html'};
  const route = routes[new URLSearchParams(location.search).get('service')];
  if (route) location.replace(route);
}
