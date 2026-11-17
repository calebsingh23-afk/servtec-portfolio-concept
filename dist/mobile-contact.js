(() => {
  const bar = document.querySelector('.mobile-contact');
  const link = bar?.querySelector('.mobile-enquire');
  if (!link) return;
  const form = document.querySelector('#quote-form');
  let chosen = null;
  const params = new URLSearchParams(location.search);
  const current = () => {
    if (chosen) return chosen;
    if (form) return null; // An in-page jump preserves existing form edits.
    const allowed = new URLSearchParams();
    for (const key of ['need','bike','rental']) if (params.has(key)) allowed.set(key,params.get(key).slice(0,120));
    return allowed.size ? allowed : null;
  };
  function updateLink() {
    const context = current();
    link.href = context ? './?' + context + '#enquire' : (form ? '#enquire' : './#enquire');
  }
  function choose(card) {
    if (!card) return;
    chosen = new URLSearchParams({need:'Rent motorcycles',bike:'Illustrative example: '+card.querySelector('.example-enquiry').dataset.bike,rental:'Illustrative example: '+card.querySelector('.example-option').value});
    updateLink();
  }
  document.addEventListener('change', e => { if(e.target.matches('.example-option')) choose(e.target.closest('.fleet-card')); });
  document.addEventListener('pointerdown', e => { const card=e.target.closest('.fleet-card'); if(card) choose(card); },{passive:true});
  document.addEventListener('focusin', e => { const card=e.target.closest('.fleet-card'); if(card) choose(card); });
  form?.addEventListener('input', () => { chosen=null;updateLink(); });
  form?.addEventListener('change', () => { chosen=null;updateLink(); });
  link.addEventListener('click', e => {
    if (!form) return;
    e.preventDefault();
    if (chosen) {
      selectNeed(chosen.get('need'));
      applyBikeSelection(chosen.get('bike'), chosen.get('rental'));
      chosen=null;updateLink();
    }
    const section=document.getElementById('enquire');
    section.setAttribute('tabindex','-1');section.focus({preventScroll:true});section.scrollIntoView();
    history.replaceState(null,'',location.pathname+location.search+'#enquire');
  });
  if(window.visualViewport){
    const viewport=window.visualViewport;
    const update=()=>{bar.dataset.obscured=String(viewport.scale===1 && innerHeight-viewport.height>140);};
    viewport.addEventListener('resize',update,{passive:true});update();
  }
  updateLink();
})();
