const fs = require('node:fs');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const root = require('node:path').resolve(__dirname, '..');
const base = process.env.TEST_URL || 'http://127.0.0.1:4174';
const screenshots = root + '/docs/screenshots';
const results = [], errors = [], badResponses = [];
function check(name, condition, details) { results.push({name,pass:!!condition,details}); if(!condition) console.error('FAIL',name,details); }
const routes = ['fleet-rentals.html','servicing-repairs.html','parts-fabrication.html','rider-fleet-support.html'];
(async()=>{
 const browser = await chromium.launch({channel:'chrome',headless:true});
 const context = await browser.newContext();
 const page = await context.newPage();
 page.on('pageerror',error=>errors.push(error.message));
 page.on('response',r=>{if(r.status()>=400)badResponses.push({url:r.url(),status:r.status()});});
 for (const [width,height,name] of [[1440,900,'desktop'],[768,1024,'tablet'],[320,720,'narrow-mobile'],[390,844,'mobile'],[844,390,'landscape']]) {
   await page.setViewportSize({width,height});await page.goto(base);await page.evaluate(()=>document.fonts.ready);await page.locator('#motorcycle img').evaluate(img=>img.decode());await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   const layout=await page.evaluate(()=>{
     const rect=s=>{const r=document.querySelector(s).getBoundingClientRect();return{x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height};};
     const copy=rect('.hero-copy'), bike=rect('#motorcycle'), action=rect('.actions .button');
     return {overflow:document.documentElement.scrollWidth>innerWidth,copy,bike,action,mode:document.querySelector('.hero-scroll').dataset.motion,
       overlap:copy.x<bike.right&&copy.right>bike.x&&copy.y<bike.bottom&&copy.bottom>bike.y,
       loaded:document.querySelector('#motorcycle img').naturalWidth>0};
   });
   check(`${name}: no overflow or copy/image collision`,!layout.overflow&&!layout.overlap,layout);
   check(`${name}: artwork loaded`,layout.loaded);
   check(`${name}: usable first-screen quote action`,layout.action.bottom<=height,{bottom:layout.action.bottom,viewport:height});
   check(`${name}: suitable pinning`,layout.mode===(width>=900&&height>=700?'pinned':'static'));
   await page.screenshot({path:`${screenshots}/after-${name}-fold.png`});
   if(name!=='landscape')await page.screenshot({path:`${screenshots}/after-${name}.png`,fullPage:true});
 }
 await page.setViewportSize({width:1440,height:900});await page.goto(base);await page.evaluate(()=>document.fonts.ready);
 const sceneTop = await page.locator('.hero-scroll').evaluate(e=>e.getBoundingClientRect().top+scrollY);
 const frames=[];
 for(const p of [0,.1,.25,.5,.75,.9,1,.75,.5,.25,0,1,0,.6]) {
   await page.evaluate(y=>scrollTo(0,y),sceneTop+280*p);await page.waitForTimeout(80);
   const state=await page.evaluate(()=>({p:Number(document.querySelector('#motorcycle').dataset.progress),label:document.querySelector('#sequence-text').textContent,transform:document.querySelector('#motorcycle').style.transform}));
   check(`scroll ${p}: deterministic progress`,Math.abs(state.p-p)<.01,state);frames.push(state);
   if([0,.25,.5,.75,1].includes(p))await page.screenshot({path:`${screenshots}/motion-${Math.round(p*100)}.png`});
 }
 check('sequential service labels',new Set(frames.map(f=>f.label)).size===3);
 await page.reload();await page.waitForTimeout(120);
 const refreshed=await page.evaluate(()=>({p:Number(document.querySelector('#motorcycle').dataset.progress),expected:Math.max(0,Math.min(1,(scrollY-(document.querySelector('.hero-scroll').getBoundingClientRect().top+scrollY))/280))}));
 check('refresh mid-sequence',Math.abs(refreshed.p-refreshed.expected)<.01,refreshed);
 await page.setViewportSize({width:390,height:844});check('resize removes pinning',await page.locator('.hero-scroll').getAttribute('data-motion')==='static');
 await page.setViewportSize({width:1440,height:900});await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(50);
 check('dynamic reduced motion removes pin and transform',await page.locator('.hero-scroll').getAttribute('data-motion')==='static'&&await page.locator('#motorcycle').evaluate(e=>getComputedStyle(e).transform)==='none');
 await page.screenshot({path:`${screenshots}/reduced-motion.png`});
 await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>document.querySelector('.hero-scroll').dataset.motion==='pinned');check('motion preference restores enhancement',await page.locator('.hero-scroll').getAttribute('data-motion')==='pinned');
 await page.goto(base);await page.locator('.skip-animation').click();
 check('skip animation focuses service content',await page.evaluate(()=>document.activeElement.id)==='services');
 check('skip anchor visible',await page.locator('#services').evaluate(e=>e.getBoundingClientRect().top>=0));
 await page.goto(base);await page.keyboard.press('Tab');check('first keyboard stop is skip link',await page.evaluate(()=>document.activeElement.classList.contains('skip')));
 await page.keyboard.press('Enter');check('keyboard skip focuses main',await page.evaluate(()=>document.activeElement.id)==='main');
 await page.setViewportSize({width:390,height:844});await page.goto(base);await page.locator('.menu').click();
 check('mobile menu opens',await page.locator('.menu').getAttribute('aria-expanded')==='true');await page.keyboard.press('Tab');
 check('menu keyboard enters links',await page.evaluate(()=>document.activeElement.closest('nav')!==null));await page.keyboard.press('Escape');
 check('Escape closes menu and returns focus',await page.locator('.menu').getAttribute('aria-expanded')==='false'&&await page.evaluate(()=>document.activeElement.classList.contains('menu')));
 await page.locator('.menu').click();await page.locator('nav a[href="./#services"]').click();check('mobile anchor closes menu',await page.locator('.menu').getAttribute('aria-expanded')==='false');
 for(const route of routes) {
   await page.goto(`${base}/${route}`);check(`${route}: populated guide`,await page.locator('.detail-body li').count()>=3 && (await page.locator('h1').innerText()).length>10);
   check(`${route}: no overflow`,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.locator('.detail-aside .button').click();
   check(`${route}: enquiry prefilled`,await page.locator('select[name="service"]').inputValue()===new URL(page.url()).searchParams.get('need'));
 }
 await page.goto(base+'/services.html?service=parts');await page.waitForURL('**/parts-fabrication.html');check('legacy query link preserved',page.url().endsWith('/parts-fabrication.html'));
 await page.goto(base+'/#enquire');
 for(const need of ['Rent motorcycles','Service my fleet','Repair a motorcycle','Find parts or fabrication','Discuss another requirement']){
   await page.locator(`[data-need="${need}"]`).click();
   const fleet=need==='Rent motorcycles'||need==='Service my fleet';
   check(`selector: ${need}`,await page.locator('select[name="service"]').inputValue()===need&&await page.locator('#fleet-field').isVisible()===fleet);
 }
 await page.locator('button[type="submit"]').click();check('empty form validation and focus',await page.locator('[aria-invalid="true"]').count()===3&&await page.evaluate(()=>document.activeElement.name)==='name');
 await page.locator('[name="name"]').fill('Demo User');await page.locator('[name="email"]').fill('invalid');await page.locator('[name="message"]').fill('Fictional enquiry for interface testing.');
 await page.locator('button[type="submit"]').click();check('invalid email rejected',await page.locator('[name="email"]').getAttribute('aria-invalid')==='true');
 await page.locator('[name="email"]').fill('demo@example.com');await page.locator('select[name="service"]').selectOption('Service my fleet');await page.locator('[name="fleet"]').fill('-1');
 await page.locator('button[type="submit"]').click();check('invalid fleet size rejected',await page.locator('[name="fleet"]').getAttribute('aria-invalid')==='true');await page.locator('[name="fleet"]').fill('3');
 const transmitted=[];page.on('request',r=>transmitted.push(r.url()));
 await page.locator('button[type="submit"]').click();await page.waitForTimeout(200);
 check('honest demo feedback',await page.locator('#form-status').getAttribute('data-valid')==='true'&&(await page.locator('#form-status').innerText()).includes('No enquiry was sent'));
 check('no submission traffic',transmitted.length===0,transmitted);
 check('no website storage',await page.evaluate(()=>localStorage.length===0&&sessionStorage.length===0&&document.cookie===''));
 check('no live company contacts',await page.locator('a[href^="mailto:"],a[href^="tel:"]').count()===0);
 await page.screenshot({path:`${screenshots}/demo-feedback.png`});
 // Browser visibility is controlled through the DevTools lifecycle for a deterministic suspension check.
 const cdp=await context.newCDPSession(page);await cdp.send('Page.setWebLifecycleState',{state:'frozen'});await cdp.send('Page.setWebLifecycleState',{state:'active'});
 check('tab freeze/resume leaves interactions available',await page.locator('button[type="submit"]').isEnabled());
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const np=await nojs.newPage();
 await np.goto(base);check('no-JS homepage and safe form',(await np.locator('h1').innerText()).includes('Keep your')&&await np.locator('[name="name"]').isDisabled()&&await np.locator('nav').isVisible());
 for(const route of [...routes,'services.html']){await np.goto(base+'/'+route);check(`no-JS ${route}: useful content`,await np.locator('main').innerText().then(x=>x.length>350));}
 await nojs.close();
 const failure=await browser.newContext({viewport:{width:390,height:844}});const fp=await failure.newPage();await fp.route('**/assets/motorcycle*',route=>route.abort());await fp.goto(base);await fp.waitForTimeout(100);
 check('failed artwork fallback',await fp.locator('.media-fallback').isVisible()&&await fp.locator('.actions .button').isVisible());await fp.screenshot({path:`${screenshots}/failed-media.png`});await failure.close();
 const slow=await browser.newContext({viewport:{width:1440,height:900}});const sp=await slow.newPage();
 await sp.addInitScript(()=>{window.layoutShifts=[];new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.layoutShifts.push(e.value);}).observe({type:'layout-shift',buffered:true});});
 await sp.route('**/assets/motorcycle*',async route=>{await new Promise(r=>setTimeout(r,700));await route.continue();});await sp.goto(base);await sp.evaluate(()=>document.fonts.ready);
 const cls=await sp.evaluate(()=>window.layoutShifts.reduce((sum,n)=>sum+n,0));check('delayed-media layout stability',cls<.1,{measuredCLS:cls,delayMs:700});await slow.close();
 check('no JavaScript errors',errors.length===0,errors);check('no HTTP errors',badResponses.length===0,badResponses);
 const report={base,browser:await browser.version(),date:'2026-11-05',results,errors,badResponses};
 fs.writeFileSync(root+'/docs/verification-results.json',JSON.stringify(report,null,2));
 console.log(`${results.filter(r=>r.pass).length}/${results.length} checks passed`);console.log(JSON.stringify(results.filter(r=>!r.pass),null,2));
 await browser.close();process.exitCode=results.some(r=>!r.pass)?1:0;
})().catch(error=>{console.error(error);process.exit(1);});
