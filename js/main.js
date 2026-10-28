(function () {
  'use strict';

  var TEXTURA_NOME = { lisa: 'Lisa', ondulada: 'Ondulada', cacheada: 'Cacheada' };
  var TEXTURA_PLURAL = { lisa: 'Lisas', ondulada: 'Onduladas', cacheada: 'Cacheadas' };

  // ---------- utilidades ----------
  function reais(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency', currency: 'BRL',
      minimumFractionDigits: valor % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    });
  }
  function precoPix(p) { return Math.round(p.preco * (1 - LOJA.descontoPix) * 100) / 100; }
  function parcela(p) { return Math.round((p.preco / LOJA.parcelas) * 100) / 100; }
  function linkWhats(texto) {
    return 'https://wa.me/' + LOJA.whatsapp + '?text=' + encodeURIComponent(texto);
  }
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var toastTimer;
  function toast(msg) {
    var t = $('[data-toast]');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2800);
  }

  // ---------- partes comuns ----------
  $all('[data-loja-nome]').forEach(function (el) { el.textContent = LOJA.nome; });
  $all('[data-ano]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  $all('[data-whatsapp]').forEach(function (a) {
    a.href = linkWhats(a.getAttribute('data-whatsapp'));
    a.target = '_blank';
    a.rel = 'noopener';
  });
  $all('[data-instagram]').forEach(function (a) {
    a.href = 'https://instagram.com/' + LOJA.instagram;
    a.target = '_blank';
    a.rel = 'noopener';
  });
  $all('[data-demo]').forEach(function (b) {
    b.addEventListener('click', function () { toast(b.getAttribute('data-demo')); });
  });

  var menuBtn = $('[data-menu]');
  var mobileNav = $('#mobile-nav');
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', function () {
      var aberto = mobileNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });
    $all('a', mobileNav).forEach(function (a) {
      a.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- card de produto ----------
  function card(p) {
    return '' +
      '<a class="card" href="produto.html?p=' + encodeURIComponent(p.id) + '">' +
        '<div class="card-media">' +
          '<span class="badge">Peça única</span>' +
          '<img src="' + foto(p.fotos[0], 700) + '" alt="' + esc(p.nome) + '" loading="lazy">' +
          '<img class="alt" src="' + foto(p.fotos[1], 700) + '" alt="" loading="lazy">' +
          '<span class="card-quick">Ver detalhes</span>' +
        '</div>' +
        '<div class="card-info">' +
          '<span class="card-name">' + esc(p.nome) + '</span>' +
          '<span class="card-specs">' + esc(p.cor) + ' · ' + esc(p.comprimento) + ' · ' + esc(p.touca) + '</span>' +
          '<span class="card-price">' + reais(p.preco) + '</span>' +
          '<span class="card-install">ou ' + LOJA.parcelas + 'x de ' + reais(parcela(p)) + ' sem juros</span>' +
          '<span class="card-pix">' + reais(precoPix(p)) + ' no Pix</span>' +
        '</div>' +
      '</a>';
  }

  // ---------- página inicial ----------
  var grid = $('[data-grid]');
  if (grid) {
    var render = function (filtro) {
      var lista = PERUCAS.filter(function (p) { return filtro === 'todas' || p.textura === filtro; });
      grid.innerHTML = lista.map(card).join('');
      $all('[data-filter]').forEach(function (b) {
        b.setAttribute('aria-pressed', b.getAttribute('data-filter') === filtro ? 'true' : 'false');
      });
    };
    $all('[data-filter]').forEach(function (b) {
      b.addEventListener('click', function () { render(b.getAttribute('data-filter')); });
    });
    $all('[data-filter-link]').forEach(function (a) {
      a.addEventListener('click', function () { render(a.getAttribute('data-filter-link')); });
    });
    render('todas');
  }

  // ---------- página da peruca ----------
  var mainPhoto = $('[data-main-photo]');
  if (mainPhoto) {
    var params = new URLSearchParams(location.search);
    var id = params.get('p');
    var p = PERUCAS.filter(function (x) { return x.id === id; })[0] || PERUCAS[0];

    document.title = p.nome + ' · ' + LOJA.nome;
    var campos = {
      nome: p.nome,
      resumo: p.cor + ' · ' + p.comprimento + ' · ' + TEXTURA_NOME[p.textura],
      preco: reais(p.preco),
      parcela: 'ou ' + LOJA.parcelas + 'x de ' + reais(parcela(p)) + ' sem juros',
      pix: reais(precoPix(p)) + ' no Pix (' + Math.round(LOJA.descontoPix * 100) + '% de desconto)',
      descricao: p.descricao,
      cor: p.cor,
      comprimento: p.comprimento,
      textura: TEXTURA_NOME[p.textura],
      touca: p.touca,
      densidade: p.densidade
    };
    $all('[data-p]').forEach(function (el) { el.textContent = campos[el.getAttribute('data-p')] || ''; });

    var crumb = $('[data-crumb-textura]');
    if (crumb) crumb.textContent = TEXTURA_PLURAL[p.textura];

    var legendas = ['Foto principal', 'Outro ângulo', 'Detalhe dos fios'];
    var thumbs = $('[data-thumbs]');
    var mostrar = function (i) {
      mainPhoto.src = foto(p.fotos[i], 1200);
      mainPhoto.alt = p.nome + ': ' + legendas[i].toLowerCase();
      $all('.thumb', thumbs).forEach(function (t, j) { t.setAttribute('aria-current', i === j ? 'true' : 'false'); });
    };
    thumbs.innerHTML = p.fotos.map(function (f, i) {
      return '<button class="thumb" type="button" aria-label="' + legendas[i] + '"><img src="' + foto(f, 200) + '" alt=""></button>';
    }).join('');
    $all('.thumb', thumbs).forEach(function (t, i) { t.addEventListener('click', function () { mostrar(i); }); });
    mostrar(0);

    $all('[data-whatsapp-produto]').forEach(function (a) {
      a.href = linkWhats('Olá! Tenho interesse na peruca "' + p.nome + '" (' + reais(p.preco) + '). Ela ainda está disponível?');
      a.target = '_blank';
      a.rel = 'noopener';
    });

    var comprar = $('[data-comprar]');
    comprar.addEventListener('click', function () {
      var badge = $('[data-bag-count]');
      if (badge) { badge.textContent = '1'; badge.hidden = false; }
      comprar.textContent = 'Adicionada à sacola';
      toast('Exemplo: na loja publicada, aqui segue para o pagamento.');
    });

    var cepForm = $('[data-cep]');
    var cepInput = $('#cep');
    cepInput.addEventListener('input', function () {
      var d = cepInput.value.replace(/\D/g, '').slice(0, 8);
      cepInput.value = d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d;
    });
    cepForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var r = $('[data-cep-result]');
      if (cepInput.value.replace(/\D/g, '').length !== 8) {
        r.textContent = 'Digite os 8 números do CEP.';
        return;
      }
      r.textContent = 'Exemplo: na loja publicada, aqui aparecem o valor e o prazo do frete.';
    });

    var related = $('[data-related]');
    var outras = PERUCAS.filter(function (x) { return x.id !== p.id; })
      .sort(function (a, b) { return (b.textura === p.textura) - (a.textura === p.textura); })
      .slice(0, 4);
    related.innerHTML = outras.map(card).join('');
  }
})();
