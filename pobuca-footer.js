(function () {
  var TEXT = '© 2026 Pobuca ver 2.7.165';
  var MATCH = /Tiledesk ver|tiledesk\.com|Privacy Policy|Terms & Conditions|Leave us feedback|Star us on Github|Social/i;

  function patchFooter() {
    var nodes = Array.prototype.slice.call(
      document.querySelectorAll('footer, app-footer, .footer, [class*="footer"], div')
    );

    var footer = nodes
      .filter(function (el) {
        var txt = (el.innerText || '').trim();
        var rect = el.getBoundingClientRect();
        return MATCH.test(txt) && rect.height > 0 && rect.height < 180;
      })
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
