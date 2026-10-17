// Adapted from Service Desk's homologated GV shell. Shared preference keys.
(() => {
  const read = key => { try { return localStorage.getItem(key); } catch { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Preferences are optional. */ } };
  const savedLang = read('gv-cc-lang');
  const savedTheme = read('gv-cc-theme');
  document.documentElement.lang = ['es','en','pt'].includes(savedLang) ? savedLang : 'es';
  document.documentElement.dataset.theme = ['light','dark'].includes(savedTheme) ? savedTheme : 'dark';
  document.querySelector('#language').value = document.documentElement.lang;
  document.querySelector('#language').addEventListener('change', event => {
    document.documentElement.lang = event.target.value;
    write('gv-cc-lang', event.target.value);
    window.dispatchEvent(new Event('gv-language'));
  });
  document.querySelector('#theme').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    write('gv-cc-theme', next);
    window.dispatchEvent(new Event('gv-theme'));
  });
})();
