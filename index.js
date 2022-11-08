const sidebarMenu = document.querySelector('.sidebar-menu');
const selectedID = location.hash.slice(2);
let selectedItem = null;

async function initDemos(container, collection) {
  if(!collection) {
    const url = new URL(location.href);
    let search = url.search;
    const matched = url.search.match(/\?([_\w][_-\w]*)/);
    if(matched) {
      search = matched[1];
    }
    const dataPath = search ? `./collections/${search}.jcoderc.js` : './jcoderc.js';
    try {
      const demos = (await import(dataPath)).default;
      collection = demos.collection;
      const titleEl = document.getElementById('title');
      const title = demos.name || '码上掘金-精选';
      document.title = title;
      titleEl.textContent = title;
      if(demos.url) {
        titleEl.href = demos.url;
      }
    } catch (ex) {
      location.replace(`//${url.host}`);
      return;
    }
  }
  collection.forEach((demo) => {
    if(demo.type === 'folder') {
      const el = document.createElement('div');
      el.className = demo.folded ? 'sidebar-menuFolder folded' : 'sidebar-menuFolder';
      const p = document.createElement('p');
      p.className = 'title';
      p.textContent = demo.name;
      el.appendChild(p);
      const c = document.createElement('div');
      c.className = 'content';
      el.appendChild(c);
      container.appendChild(el);
      initDemos(c, demo.collection);
    } else {
      const el = document.createElement('div');
      const a = document.createElement('a');
      a.id = `code_${demo.id}`;
      a.href = `#/${demo.id}`;
      a.className = 'sidebar-menuItem';
      a.textContent = demo.name;
      el.appendChild(a);
      container.appendChild(el);
      if(demo.id === selectedID) selectedItem = a;
      if(demo.default && !selectedItem) selectedItem = a;
    }
  });
}

initDemos(sidebarMenu).then(() => {
  if(selectedItem) {
    const url = selectedItem.getAttribute('href');
    selectedItem.className = 'sidebar-menuItem active';
    loadCodeFrame(url, false);
  }

  function loadCodeFrame(url, pushState = true) {
    const src = url.replace(/^#/, '//code.juejin.cn/pen');
    window.frames[0].location.replace(src);
    if(pushState) history.pushState({url}, '', url);
    else history.replaceState({url}, '', url);
  }

  const container = document.querySelector('main');
  document.querySelector('.handler').addEventListener('click', () => {
    container.className = container.className === 'max' ? '' : 'max';
  });

  const menu = document.querySelector('.sidebar-menu');
  menu.addEventListener('click', (evt) => {
    const {target} = evt;
    const activeEl = menu.querySelector('a.sidebar-menuItem.active');

    if(target !== activeEl && /^sidebar-menuItem/.test(target.className)) {
      if(activeEl) activeEl.className = 'sidebar-menuItem';
      target.className = 'sidebar-menuItem active';
      loadCodeFrame(target.getAttribute('href'));
    }

    const parent = target.parentElement;
    if(parent && /^sidebar-menuFolder/.test(parent.className)) {
      parent.className = parent.className === 'sidebar-menuFolder' ? 'sidebar-menuFolder folded' : 'sidebar-menuFolder';
    }

    evt.preventDefault();
  });

  const sidebar = document.getElementById('sidebar');
  const sidebarMore = document.querySelector('.sidebar-more');
  sidebarMore.addEventListener('click', () => {
    sidebar.className = sidebar.className === 'show' ? '' : 'show';
  });

  window.onpopstate = function (e) {
    const items = document.querySelectorAll('.sidebar-menuItem');
    items.forEach((item) => {
      item.className = 'sidebar-menuItem';
      if(item.getAttribute('href') === e.state.url) {
        item.className = 'sidebar-menuItem active';
      }
    });
  };
});