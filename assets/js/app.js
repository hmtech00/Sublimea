/* ==========================================================================
   Sublimaê — Artes Personalizadas · catálogo, busca, galeria e lista de interesse
   Observação: este site não exibe nem calcula preços em nenhuma parte.
   ========================================================================== */
(function () {
  'use strict';

  // Número oficial (o mesmo do catálogo original)
  var WHATSAPP_NUMBER = '557199593595';
  var MSG_GERAL = 'Olá, Sublimaê! Conheci o catálogo e gostaria de obter informações sobre os produtos personalizados e solicitar um orçamento.';
  var STORAGE_KEY = 'sublimae_lista_interesse';

  var PRODUTOS = window.SUBLIMAE_PRODUTOS || [];
  var CATEGORIAS = window.SUBLIMAE_CATEGORIAS || [];
  var byCode = {};
  PRODUTOS.forEach(function (p) { byCode[p.codigo] = p; });

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function normalize(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[×x]/g, 'x');
  }

  /* ---------- WhatsApp ---------- */
  function waLink(msg) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
  }
  function msgProduto(p) {
    return 'Olá, Sublimaê! Tenho interesse no produto ' + p.nome + ', referência ' + p.codigo +
      '. Gostaria de saber mais sobre as opções de personalização e solicitar um orçamento.';
  }
  $$('[data-wa="geral"]').forEach(function (a) { a.href = waLink(MSG_GERAL); });

  /* ---------- Imagens ---------- */
  function imgSm(p) { return p.imagem + '-sm.webp'; }
  function imgLg(p) { return p.imagem + '.webp'; }
  function smSize(p) {
    var s = Math.min(1, 640 / Math.max(p.largura, p.altura));
    return { w: Math.round(p.largura * s), h: Math.round(p.altura * s) };
  }
  function shouldContain(p) {
    var r = p.largura / p.altura; // card 4:5 = 0,8
    return r > 1.1 || r < 0.55;
  }

  /* ---------- Categorias ---------- */
  var counts = {};
  PRODUTOS.forEach(function (p) { counts[p.categoria] = (counts[p.categoria] || 0) + 1; });
  function plural(n) { return n + (n === 1 ? ' produto' : ' produtos'); }

  var chipsEl = $('#chips');
  chipsEl.innerHTML = ['Todos'].concat(CATEGORIAS).map(function (c) {
    var label = c === 'Todos' ? 'Todos os produtos' : c;
    var n = c === 'Todos' ? PRODUTOS.length : counts[c];
    return '<button type="button" class="chip" data-cat="' + esc(c) + '" aria-pressed="' + (c === 'Todos') + '">' +
      esc(label) + ' <small>' + n + '</small></button>';
  }).join('');

  var catGrid = $('#catGrid');
  var catCards = '<button type="button" class="cat-card all" data-cat="Todos"><span class="cat-name">Todos os produtos</span><span class="cat-count">' + plural(PRODUTOS.length) + '</span></button>';
  CATEGORIAS.forEach(function (c) {
    var cover = PRODUTOS.filter(function (p) { return p.categoria === c; })[0];
    var sz = smSize(cover);
    catCards += '<button type="button" class="cat-card" data-cat="' + esc(c) + '">' +
      '<img src="' + esc(imgSm(cover)) + '" width="' + sz.w + '" height="' + sz.h + '" alt="" loading="lazy" decoding="async">' +
      '<span class="cat-name">' + esc(c) + '</span><span class="cat-count">' + plural(counts[c]) + '</span></button>';
  });
  catGrid.innerHTML = catCards;

  $('#footerCats').innerHTML = CATEGORIAS.map(function (c) {
    return '<li><button type="button" data-cat="' + esc(c) + '">' + esc(c) + '</button></li>';
  }).join('');
  $('#aboutList').innerHTML = CATEGORIAS.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('');

  /* ---------- Cards de produto ---------- */
  var grid = $('#grid');
  var ICON_ZOOM = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5M11 8v6M8 11h6"/></svg>';
  var ICON_WA = '<svg class="wa-ico" viewBox="0 0 24 24" aria-hidden="true"><use href="#ico-wa"/></svg>';
  var ICON_SPARK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/></svg>';

  function tagsHtml(p, max) {
    var html = '';
    if (p.apresentacao) html += '<span class="tag pack">' + esc(p.apresentacao) + '</span>';
    var t = p.tamanhos || [];
    t.slice(0, max).forEach(function (s) { html += '<span class="tag">' + esc(s) + '</span>'; });
    if (t.length > max) html += '<span class="tag more">+' + (t.length - max) + ' opções</span>';
    return html ? '<div class="tags">' + html + '</div>' : '';
  }

  grid.innerHTML = PRODUTOS.map(function (p, i) {
    var sz = smSize(p);
    var lazy = i < 4 ? 'eager' : 'lazy';
    return '<article class="card" data-code="' + esc(p.codigo) + '">' +
      '<button type="button" class="card-photo' + (shouldContain(p) ? ' contain' : '') + '" data-view="' + esc(p.codigo) + '" aria-label="Ampliar foto: ' + esc(p.nome) + '">' +
        '<img src="' + esc(imgSm(p)) + '" srcset="' + esc(imgSm(p)) + ' ' + sz.w + 'w, ' + esc(imgLg(p)) + ' ' + p.largura + 'w" ' +
        'sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 290px" width="' + sz.w + '" height="' + sz.h + '" ' +
        'alt="' + esc(p.nome + ' — ' + p.codigo) + '" loading="' + lazy + '" decoding="async">' +
        '<span class="zoom-hint">' + ICON_ZOOM + '</span>' +
      '</button>' +
      '<div class="card-body">' +
        '<div class="card-meta"><span class="card-cat">' + esc(p.categoria) + '</span><span class="code-tag">Ref. <strong>' + esc(p.codigo) + '</strong></span></div>' +
        '<h3>' + esc(p.nome) + '</h3>' +
        '<p class="card-desc">' + esc(p.descricao) + '</p>' +
        tagsHtml(p, 2) +
        '<p class="custom-note">' + ICON_SPARK + 'Personalizável — consulte opções</p>' +
        '<div class="card-actions">' +
          '<a class="btn btn-wa" href="' + esc(waLink(msgProduto(p))) + '" target="_blank" rel="noopener noreferrer" aria-label="Consultar ' + esc(p.nome) + ' pelo WhatsApp">' + ICON_WA + 'Consultar pelo WhatsApp</a>' +
          '<button type="button" class="btn btn-outline" data-add="' + esc(p.codigo) + '">Adicionar à lista</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }).join('');

  var cardEls = $$('.card', grid);
  var searchIndex = PRODUTOS.map(function (p) {
    return normalize([p.nome, p.codigo, p.codigo.replace('-', ''), p.categoria, p.descricao, (p.tamanhos || []).join(' '), p.apresentacao || ''].join(' '));
  });

  /* ---------- Busca + filtros ---------- */
  var state = { cat: 'Todos', q: '' };
  var searchInput = $('#search');
  var clearBtn = $('#clearFilters');
  var visible = PRODUTOS.slice();

  function applyFilters() {
    var terms = normalize(state.q).split(/\s+/).filter(Boolean).map(function (t) { return t.length > 3 ? t.replace(/s$/, '') : t; }); // plural simples: "orixás" encontra "orixá"
    visible = [];
    PRODUTOS.forEach(function (p, i) {
      var okCat = state.cat === 'Todos' || p.categoria === state.cat;
      var okText = terms.every(function (t) { return searchIndex[i].indexOf(t) !== -1; });
      var show = okCat && okText;
      cardEls[i].hidden = !show;
      if (show) visible.push(p);
    });

    $$('.chip', chipsEl).forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.cat === state.cat)); });
    clearBtn.hidden = !(state.q || state.cat !== 'Todos');

    var where = state.cat === 'Todos' ? '' : ' em <strong>' + esc(state.cat) + '</strong>';
    var forQ = state.q ? ' para “<strong>' + esc(state.q.trim()) + '</strong>”' : '';
    $('#resultCount').innerHTML = visible.length
      ? 'Mostrando <strong>' + visible.length + '</strong> de ' + plural(PRODUTOS.length) + where + forQ
      : '';

    var empty = $('#empty');
    empty.hidden = visible.length > 0;
    if (!visible.length) {
      var q = state.q.trim();
      $('#emptyTitle').textContent = q ? 'Não encontramos “' + q + '”' : 'Nenhum produto encontrado';
      $('#emptyText').textContent = 'Mas a gente personaliza quase tudo! Conte o que você procura que fazemos sob encomenda.';
      $('#emptyWa').href = waLink(q
        ? 'Olá, Sublimaê! Procurei por "' + q + '" no catálogo e não encontrei. Vocês fazem?'
        : MSG_GERAL);
    }
  }

  var searchTimer;
  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () { state.q = searchInput.value; applyFilters(); }, 120);
  });
  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); searchInput.blur(); }
  });

  function setCategory(cat, scroll) {
    state.cat = cat;
    applyFilters();
    var chip = chipsEl.querySelector('[data-cat="' + cssEscape(cat) + '"]');
    if (chip) chip.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    if (scroll) document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
  }
  function cssEscape(s) { return window.CSS && CSS.escape ? CSS.escape(s) : s.replace(/"/g, '\\"'); }

  function clearAll() {
    searchInput.value = '';
    state.q = '';
    setCategory('Todos');
  }

  chipsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.chip');
    if (b) setCategory(b.dataset.cat);
  });
  catGrid.addEventListener('click', function (e) {
    var b = e.target.closest('[data-cat]');
    if (b) { searchInput.value = ''; state.q = ''; setCategory(b.dataset.cat, true); }
  });
  $('#footerCats').addEventListener('click', function (e) {
    var b = e.target.closest('[data-cat]');
    if (b) { searchInput.value = ''; state.q = ''; setCategory(b.dataset.cat, true); }
  });
  clearBtn.addEventListener('click', clearAll);
  $$('[data-clear]').forEach(function (b) { b.addEventListener('click', clearAll); });

  /* ---------- Lista de interesse (sem valores) ---------- */
  var list = [];
  try {
    var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) list = saved.filter(function (i) { return i && byCode[i.code]; }).map(function (i) {
      return { code: i.code, qty: Math.max(1, Math.min(999, parseInt(i.qty, 10) || 1)) };
    });
  } catch (e) { list = []; }
  function persist() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) { /* armazenamento indisponível */ } }
  function inList(code) { return list.filter(function (i) { return i.code === code; })[0]; }

  function addToList(code) {
    if (inList(code)) { openDrawer(); return; }
    list.push({ code: code, qty: 1 });
    persist();
    renderList();
    toast('“' + byCode[code].nome + '” adicionado à sua lista');
    var fab = $('.fab-list');
    fab.classList.remove('bump'); void fab.offsetWidth; fab.classList.add('bump');
  }
  function setQty(code, qty) {
    if (qty < 1) list = list.filter(function (i) { return i.code !== code; });
    else inList(code).qty = Math.min(999, qty);
    persist();
    renderList();
  }

  var listItems = $('#listItems');
  function renderList() {
    var count = list.length;
    $$('[data-list-count]').forEach(function (el) { el.textContent = count; el.hidden = count === 0; });
    $('.fab-list').hidden = count === 0;
    $('#drawerFoot').hidden = count === 0;

    $$('[data-add]').forEach(function (b) { updateAddBtn(b, b.dataset.add); });
    if (currentView) updateAddBtn($('#viewerAdd'), currentView.codigo);

    if (!count) {
      listItems.innerHTML = '<div class="list-empty"><strong>Sua lista está vazia</strong>Toque em “Adicionar à lista” nos produtos que deseja para solicitar um orçamento de uma só vez.</div>';
      return;
    }
    listItems.innerHTML = list.map(function (i) {
      var p = byCode[i.code];
      return '<div class="list-item">' +
        '<img src="' + esc(imgSm(p)) + '" alt="" width="64" height="64" loading="lazy">' +
        '<div><strong>' + esc(p.nome) + '</strong><span class="code-tag">Ref. <strong>' + esc(p.codigo) + '</strong></span>' +
        '<div class="list-row">' +
          '<div class="qty" role="group" aria-label="Quantidade de ' + esc(p.nome) + '">' +
            '<button type="button" data-qty="-1" data-code="' + esc(p.codigo) + '" aria-label="Diminuir quantidade">−</button>' +
            '<output aria-live="polite">' + i.qty + '</output>' +
            '<button type="button" data-qty="1" data-code="' + esc(p.codigo) + '" aria-label="Aumentar quantidade">+</button>' +
          '</div>' +
          '<button type="button" class="link-btn" data-remove="' + esc(p.codigo) + '">Remover</button>' +
        '</div></div></div>';
    }).join('');
  }
  function updateAddBtn(btn, code) {
    var added = !!inList(code);
    btn.classList.toggle('is-added', added);
    btn.textContent = added ? '✓ Na lista · ver' : 'Adicionar à lista';
  }

  listItems.addEventListener('click', function (e) {
    var q = e.target.closest('[data-qty]');
    if (q) { var it = inList(q.dataset.code); setQty(q.dataset.code, it.qty + parseInt(q.dataset.qty, 10)); return; }
    var r = e.target.closest('[data-remove]');
    if (r) setQty(r.dataset.remove, 0);
  });

  $('#listSend').addEventListener('click', function () {
    if (!list.length) return;
    var name = $('#listName').value.trim();
    var note = $('#listNote').value.trim();
    var msg = 'Olá, Sublimaê!' + (name ? ' Aqui é ' + name + '.' : '') +
      ' Gostaria de solicitar um orçamento dos seguintes produtos do catálogo:\n\n';
    list.forEach(function (i) {
      var p = byCode[i.code];
      msg += '• ' + i.qty + 'x ' + p.nome + ' — ref. ' + p.codigo + '\n';
    });
    if (note) msg += '\nObservações: ' + note + '\n';
    msg += '\nGostaria de saber mais sobre as opções de personalização.';
    window.open(waLink(msg), '_blank', 'noopener');
  });
  $('#listClear').addEventListener('click', function () {
    if (window.confirm('Deseja esvaziar sua lista?')) { list = []; persist(); renderList(); }
  });

  /* ---------- Drawer ---------- */
  var drawer = $('#drawer');
  var backdrop = $('#drawerBackdrop');
  var lastFocus = null;
  function openDrawer() {
    if (viewer.open) viewer.close();
    lastFocus = document.activeElement;
    drawer.inert = false;
    drawer.removeAttribute('inert');
    drawer.setAttribute('aria-hidden', 'false');
    drawer.classList.add('open');
    backdrop.hidden = false;
    document.body.classList.add('no-scroll');
    setTimeout(function () { $('#drawerClose').focus(); }, 50);
  }
  function closeDrawer() {
    if (!drawer.classList.contains('open')) return;
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.setAttribute('inert', '');
    backdrop.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$('[data-open-list]').forEach(function (b) { b.addEventListener('click', openDrawer); });
  $('#drawerClose').addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);

  /* ---------- Visualização ampliada ---------- */
  var viewer = $('#viewer');
  var viewerImg = $('#viewerImg');
  var currentView = null;

  function showProduct(p) {
    currentView = p;
    viewerImg.src = imgLg(p);
    viewerImg.alt = p.nome + ' — ' + p.codigo;
    viewerImg.width = p.largura;
    viewerImg.height = p.altura;
    $('#viewerCat').textContent = p.categoria;
    $('#viewerTitle').textContent = p.nome;
    $('#viewerCode').textContent = p.codigo;
    $('#viewerDesc').textContent = p.descricao;
    var extra = '';
    if ((p.tamanhos && p.tamanhos.length) || p.apresentacao) {
      extra = '<p class="tags-label">' + (p.tamanhos && p.tamanhos.length ? 'Opções' : 'Apresentação') + '</p>' + tagsHtml(p, 99);
    }
    $('#viewerExtra').innerHTML = extra;
    $('#viewerWa').href = waLink(msgProduto(p));
    $('#viewerWa').setAttribute('aria-label', 'Consultar ' + p.nome + ' pelo WhatsApp');
    updateAddBtn($('#viewerAdd'), p.codigo);
    var multi = visible.length > 1;
    $('#viewerPrev').hidden = !multi;
    $('#viewerNext').hidden = !multi;
  }
  function openViewer(code) {
    closeDrawer();
    showProduct(byCode[code]);
    if (typeof viewer.showModal === 'function') viewer.showModal();
    else viewer.setAttribute('open', '');
    document.body.classList.add('no-scroll');
  }
  function step(dir) {
    if (!currentView || visible.length < 2) return;
    var idx = visible.indexOf(currentView);
    if (idx === -1) idx = 0;
    showProduct(visible[(idx + dir + visible.length) % visible.length]);
  }
  function closeViewer() {
    if (viewer.open && typeof viewer.close === 'function') viewer.close();
    else viewer.removeAttribute('open');
  }
  viewer.addEventListener('close', function () {
    document.body.classList.remove('no-scroll');
    currentView = null;
  });
  viewer.addEventListener('click', function (e) {
    if (e.target === viewer) closeViewer(); // clique fora do conteúdo
  });
  $$('[data-close-viewer]').forEach(function (b) { b.addEventListener('click', closeViewer); });
  $('#viewerPrev').addEventListener('click', function () { step(-1); });
  $('#viewerNext').addEventListener('click', function () { step(1); });
  $('#viewerAdd').addEventListener('click', function () {
    if (!currentView) return;
    var code = currentView.codigo;
    if (inList(code)) { closeViewer(); openDrawer(); } else addToList(code);
  });

  // Gestos de deslizar na foto ampliada (celular)
  var touchX = null;
  $('.viewer-media').addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  $('.viewer-media').addEventListener('touchend', function (e) {
    if (touchX == null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    touchX = null;
  }, { passive: true });

  grid.addEventListener('click', function (e) {
    var v = e.target.closest('[data-view]');
    if (v) { openViewer(v.dataset.view); return; }
    var a = e.target.closest('[data-add]');
    if (a) addToList(a.dataset.add);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeDrawer(); closeMenu(); }
    if (viewer.open && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) step(e.key === 'ArrowRight' ? 1 : -1);
  });

  /* ---------- Cabeçalho e menu ---------- */
  var header = $('.site-header');
  var nav = $('#mainNav');
  var menuBtn = $('.menu-toggle');
  function closeMenu() {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Abrir menu');
  }
  menuBtn.addEventListener('click', function () {
    var open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('open') && !e.target.closest('#mainNav, .menu-toggle')) closeMenu();
  });
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Toast ---------- */
  var toastEl = $('#toast');
  var toastTimer;
  function toast(text) {
    toastEl.textContent = text;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }

  $('#year').textContent = new Date().getFullYear();

  renderList();
  applyFilters();
})();
