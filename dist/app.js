const $ = s => document.querySelector(s);
const menu = $('.menu');
menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', open); $('#nav').classList.toggle('open', open); });
document.querySelectorAll('nav a').forEach(a => a.addEventListener('click', () => {menu?.setAttribute('aria-expanded','false'); $('#nav').classList.remove('open');}));
const form = $('#quote-form');
function selectNeed(value) { if (!form) return; form.elements.service.value = value; document.querySelectorAll('[data-need]').forEach(b => b.setAttribute('aria-pressed', b.dataset.need === value)); const fleet = /Rent|fleet/.test(value); $('#fleet-field').hidden = !fleet; form.elements.fleet.disabled = !fleet; }
document.querySelectorAll('[data-need]').forEach(b => b.addEventListener('click', () => selectNeed(b.dataset.need)));
form?.elements.service.addEventListener('change', e => selectNeed(e.target.value));
if (form) { const need = new URLSearchParams(location.search).get('need'); if ([...form.elements.service.options].some(o => o.value === need)) selectNeed(need); }
form?.addEventListener('submit', e => {e.preventDefault(); const f=form.elements, status=$('#form-status'); const errors=[]; form.querySelectorAll('[aria-invalid]').forEach(el=>el.removeAttribute('aria-invalid')); function invalid(el,msg){errors.push(msg);el.setAttribute('aria-invalid','true');} if(!f.name.value.trim())invalid(f.name,'Enter your name.'); if(!f.email.value.trim()&&!f.phone.value.trim())invalid(f.email,'Provide an email address or phone number.'); if(f.email.value && !f.email.validity.valid)invalid(f.email,'Enter a valid email address.'); if(!f.message.value.trim())invalid(f.message,'Tell us how we can help.'); if(!f.fleet.disabled&&!f.fleet.validity.valid)invalid(f.fleet,'Fleet size must be a positive whole number.'); if(errors.length){status.textContent=errors.join(' ');form.querySelector('[aria-invalid=true]').focus();return;} const body=`Name: ${f.name.value}\nCompany: ${f.company.value || 'Not supplied'}\nEmail: ${f.email.value}\nPhone: ${f.phone.value}\nService: ${f.service.value}\n${f.fleet.disabled?'':`Fleet size: ${f.fleet.value || 'Not supplied'}\n`}\n${f.message.value}`; status.textContent='Your enquiry is ready. Complete sending in your email app. If it does not open, email info@serv-tec.co.za directly. Nothing has been sent by this website.'; location.href=`mailto:info@serv-tec.co.za?subject=${encodeURIComponent('ServTec enquiry: '+f.service.value)}&body=${encodeURIComponent(body)}`; });
const motor=$('#motorcycle'), scene=$('.hero-scroll'), motion=matchMedia('(prefers-reduced-motion: reduce)');
let progress=0, target=0, animationFrame=0, lastTime=0;
function paintMotorcycle(p){
  if(!motor)return;
  const mobile=innerWidth<=700;
  motor.style.transform=motion.matches?'none':`perspective(1400px) translate3d(${(1-p)*(mobile?2:4)}%,${(1-p)*2}%,0) rotateY(${(1-p)*-5}deg) scale(${.96+p*.04})`;
  motor.dataset.progress=p.toFixed(3);
  const label=['Fleet rental','Servicing & repairs','Parts & fabrication'][Math.min(2,Math.floor(p*3))];
  if($('#sequence-text').textContent!==label)$('#sequence-text').textContent=label;
}
function tickMotorcycle(time){
  const elapsed=lastTime?Math.min(50,time-lastTime):16.7;lastTime=time;
  progress+=(target-progress)*(1-Math.exp(-elapsed/65));
  if(Math.abs(target-progress)<.0001)progress=target;
  paintMotorcycle(progress);
  if(progress!==target)animationFrame=requestAnimationFrame(tickMotorcycle);
  else{animationFrame=0;lastTime=0;}
}
function render(){
  if(!motor)return;
  const bounds=scene.getBoundingClientRect();
  const range=scene.offsetHeight-$('.hero').offsetHeight;
  target=motion.matches?1:Math.max(0,Math.min(1,-bounds.top/Math.max(1,range)));
  if(motion.matches||bounds.bottom<0||bounds.top>innerHeight){cancelAnimationFrame(animationFrame);animationFrame=0;lastTime=0;progress=target;paintMotorcycle(progress);return;}
  if(!animationFrame)animationFrame=requestAnimationFrame(tickMotorcycle);
}
addEventListener('scroll',render,{passive:true});addEventListener('resize',render);motion.addEventListener('change',render);render();
const services={rentals:{title:'Fleet rentals & sales',intro:'Motorcycles for the way your business delivers.',audience:'Delivery businesses, restaurants and private fleet owners planning their next motorcycles.',items:['Motorcycle fleet rental enquiries','Fleet sales enquiries','Branding requirements to discuss, subject to confirmation'],need:'Rent motorcycles',ask:'Tell us your fleet size, operating area, intended start date and whether you need rental or purchase options.',note:'Models, stock, rental terms, deposits, branding and what is included must be confirmed in a quotation.'},repairs:{title:'Servicing & repairs',intro:'Give your working motorcycles the attention they need.',audience:'Businesses maintaining a working fleet and individual owners with a motorcycle that needs attention.',items:['Fleet maintenance and motorcycle servicing','On-site servicing enquiries, subject to location and availability','Motorcycle repairs, rebuilds and accident repair enquiries'],need:'Service my fleet',ask:'Share the motorcycle model, the work or fault you need help with, your location and the number of motorcycles.',note:'Roadside assistance hours, coverage and availability have not been confirmed. Use general enquiries for planning; this is not an emergency dispatch channel.'},parts:{title:'Parts & fabrication',intro:'Find the right part. Discuss the right fit.',audience:'Fleet operators and motorcycle owners looking for spares, accessories or motorcycle-related fabrication.',items:['Spares and accessories enquiries','Delivery-box bracket requirements','Crash bars and steel fabrication requirements to discuss'],need:'Find parts or fabrication',ask:'Include the motorcycle make and model, the part or fabrication required, quantities and any measurements you have.',note:'Stock, compatibility, fabrication scope and lead times need to be confirmed. No specific part is advertised as available.'},support:{title:'Rider training & fleet support',intro:'Plan the support around your motorcycles.',audience:'Businesses reviewing rider needs, motorcycle procurement or the practical running of their fleets.',items:['Rider training and workshop enquiries','Motorcycle procurement consultancy enquiries','Discuss your fleet reporting requirements'],need:'Discuss another requirement',ask:'Tell us about your riders, fleet and operating area, and the outcome you are looking for.',note:'Training format, scope, reporting capabilities and availability require confirmation. No certification or particular reporting system is promised.'}};
if($('#service-detail')){const key=new URLSearchParams(location.search).get('service');const item=services[key]||services.rentals;document.title=item.title+' | ServTec';$('#detail-title').textContent=item.title;$('#detail-intro').textContent=item.intro;$('#detail-audience').textContent=item.audience;$('#detail-list').replaceChildren(...item.items.map(s=>{const li=document.createElement('li');li.textContent=s;return li;}));$('#detail-ask').textContent=item.ask;$('#detail-note').textContent=item.note;$('#detail-quote').href='./?need='+encodeURIComponent(item.need)+'#enquire';document.querySelector('meta[name=description]').content=item.intro+' '+item.audience;}
