/* Progressive enhancement: nothing is hidden in CSS or while awaiting JS. */
(() => {
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 1001px)');
  const targets = [...document.querySelectorAll('.intro, .service-list > a, .detail-topics > article, .fleet-card, .gear-feature, .helmet-stock, .rental-steps > li')];
  const seen = new WeakSet();
  const active = new Map();
  let keyboard = false;
  const easing = getComputedStyle(document.documentElement).getPropertyValue('--ease-out').trim() || 'cubic-bezier(0.16, 1, 0.3, 1)';
  function finish(element) {
    active.get(element)?.cancel();
    active.delete(element);
  }
  function finishAll() { [...active.keys()].forEach(finish); }
  function delayFor(element) {
    if (!desktop.matches) return 0;
    if (element.matches('.rental-steps > li')) return [...element.parentElement.children].indexOf(element) * 55;
    if (!element.matches('.fleet-card')) return 0;
    const cards = [...element.parentElement.children];
    const columns = getComputedStyle(element.parentElement).gridTemplateColumns.split(' ').length;
    return (cards.indexOf(element) % columns) * 65;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({target, isIntersecting}) => {
      if (!isIntersecting || seen.has(target)) return;
      seen.add(target);
      observer.unobserve(target);
      if (reduced.matches || keyboard || target.contains(document.activeElement)) return;
      const animation = target.animate([
        {opacity:0, transform:'translateY(16px)'},
        {opacity:1, transform:'translateY(0)'}
      ], {duration:480, delay:delayFor(target), easing, fill:'backwards'});
      active.set(target, animation);
      animation.onfinish = () => { if (active.get(target) === animation) active.delete(target); };
    });
  }, {threshold:0, rootMargin:'0px 0px -24px 0px'});
  targets.forEach(target => observer.observe(target));
  document.addEventListener('keydown', event => {
    if (['Tab','ArrowDown','ArrowUp','PageDown','PageUp','Home','End','Enter'].includes(event.key)) {
      keyboard = true;
      finishAll();
    }
  });
  document.addEventListener('pointerdown', () => { keyboard = false; }, {passive:true});
  document.addEventListener('wheel', () => { keyboard = false; }, {passive:true});
  document.addEventListener('focusin', event => {
    targets.forEach(target => {
      if (target.contains(event.target)) { seen.add(target); observer.unobserve(target); finish(target); }
    });
  });
  reduced.addEventListener('change', () => { if (reduced.matches) finishAll(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) finishAll(); });
})();
