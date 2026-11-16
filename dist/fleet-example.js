document.querySelectorAll('.fleet-card').forEach(card => {
  const select = card.querySelector('.example-option');
  const link = card.querySelector('.example-enquiry');
  select.addEventListener('change', () => {
    link.href = './?' + new URLSearchParams({need:'Rent motorcycles',bike:'Illustrative example: '+link.dataset.bike,rental:'Illustrative example: '+select.value}) + '#enquire';
  });
});
