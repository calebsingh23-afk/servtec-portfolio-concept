// Test-only interception: customer website files remain unchanged.
const playwright = require(process.env.PLAYWRIGHT_PATH || 'playwright');
async function protect(context) {
  await context.addInitScript(() => {
    window.__mailtoDrafts = [];
    window.__captureMailto = href => {
      const url = new URL(href);
      if (url.protocol !== 'mailto:') throw new Error('Unexpected draft protocol');
      window.__mailtoDrafts.push({recipient:decodeURIComponent(url.pathname),subject:url.searchParams.get('subject'),body:url.searchParams.get('body')});
    };
    document.addEventListener('click', event => {
      const link = event.target.closest?.('a[href^="mailto:"],a[href^="tel:"]');
      if (link) { event.preventDefault(); event.stopImmediatePropagation(); if (link.protocol === 'mailto:') window.__captureMailto(link.href); }
    }, true);
  });
  await context.route('**/app.js', async route => {
    const response = await route.fetch();
    const source = await response.text();
    const handoff = 'location.href = draft.href;';
    // Fail closed if the production handoff changes: never serve an uninstrumented script.
    if (source.split(handoff).length !== 2) { await route.abort(); throw new Error('Mailto handoff changed; update test interception before running tests.'); }
    await route.fulfill({response, body:source.replace(handoff,'window.__captureMailto(draft.href);')});
  });
}
module.exports = {...playwright, chromium: new Proxy(playwright.chromium, {get(target,key) {
  if (key !== 'launch') return typeof target[key] === 'function' ? target[key].bind(target) : target[key];
  return async options => {
    const browser = await target.launch(options);
    const newPage = browser.newPage.bind(browser), newContext = browser.newContext.bind(browser);
    browser.newPage = async options => {const page=await newPage({...options,serviceWorkers:'block'});await protect(page.context());return page;};
    browser.newContext = async options => {const context=await newContext({...options,serviceWorkers:'block'});await protect(context);return context;};
    return browser;
  };
}})};
