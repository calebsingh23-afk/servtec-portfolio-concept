document.querySelectorAll('.fleet-card').forEach(card => {
  const select = card.querySelector('.example-option');
  const link = card.querySelector('.example-enquiry');
  const bike = illustrativeBikes.find(item => item.model === link.dataset.bike);
  if (bike) select.replaceChildren(...bike.options.map(value => new Option(value, value)));
  select.addEventListener('change', () => {
    link.href = './?' + new URLSearchParams({need:'Rent motorcycles',bike:'Illustrative example: '+link.dataset.bike,rental:'Illustrative example: '+select.value}) + '#enquire';
  });
});
