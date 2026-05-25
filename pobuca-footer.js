(function () {
  var TEXT = '© 2026 Pobuca ver 2.7.165';
  var MATCH = /Tiledesk ver|tiledesk\.com|Privacy Policy|Terms & Conditions|Leave us feedback|Star us on Github|Social/i;
  var FOOTER_SELECTORS = 'footer, app-footer, .footer, [class*="footer"], [class*="Footer"]';
  var MENU_SELECTORS = [
    'header',
    'nav',
    '.navbar',
    '.navbar-wrapper',
    '.dropdown',
    '.dropdown-menu',
    '.mat-menu-panel',
    '.cdk-overlay-container',
    '[role="menu"]'
  ].join(',');

  function isFooterCandidate(el) {
    var txt = (el.innerText || '').trim();
    var rect = el.getBoundingClientRect();
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    var isNearBottom = !viewportHeight || rect.top > viewportHeight * 0.55 || viewportHeight - rect.bottom < 120;

    return MATCH.test(txt) &&
      rect.height > 0 &&
      rect.height < 180 &&
      rect.width > 0 &&
      isNearBottom &&
      !el.closest(MENU_SELECTORS);
  }

  function patchFooter() {
    var nodes = Array.prototype.slice.call(
      document.querySelectorAll(FOOTER_SELECTORS)
    );

    var footer = nodes
      .filter(isFooterCandidate)
      .sort(function (a, b) {
        return a.getBoundingClientRect().height - b.getBoundingClientRect().height;
      })[0];

    if (!footer) return;

    footer.setAttribute('data-pobuca-footer', '1');
    footer.innerHTML = '<span>' + TEXT + '</span>';
    footer.style.display = 'flex';
    footer.style.alignItems = 'center';
    footer.style.justifyContent = 'flex-start';
    footer.style.gap = '0';
  }

  patchFooter();
  setInterval(patchFooter, 1000);

  if (document.body) {
    new MutationObserver(patchFooter).observe(document.body, {
      childList: true,
      subtree: true
    });
  }
})();
