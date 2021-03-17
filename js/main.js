'use strict';

globalThis.$ = document.querySelector.bind(document);
globalThis.$$ = document.querySelectorAll.bind(document);

$$('.panel').forEach((panel) => {
  panel.onclick = function () {
    $$('.panel').forEach((panel) => panel.classList.remove('selected'));
    this.classList.add('selected');
  }
});
