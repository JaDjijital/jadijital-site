(function () {
  'use strict';

  var GREEN = '#3D8BFF';
  var CYAN = '#7A5CFF';
  var MAGENTA = '#00E5FF';
  var YELLOW = '#C77DFF';

  /* ---------------------------------------------------------------- */
  /* custom cursor                                                     */
  /* ---------------------------------------------------------------- */

  /* ---------------------------------------------------------------- */
  /* hero: neon typewriter tagline                                      */
  /* ---------------------------------------------------------------- */

  var heroTagline = document.getElementById('heroTagline');
  var heroTaglineText = 'GEÇMİŞİ UNUTTURACAK BİR GELECEK TASARLIYORUZ';
  var heroCharEls = heroTaglineText.split('').map(function (ch) {
    var el = document.createElement('span');
    el.className = 'char';
    el.style.whiteSpace = ch === ' ' ? 'pre' : 'normal';
    el.textContent = ch;
    heroTagline.appendChild(el);
    return el;
  });
  var heroCaret = document.createElement('span');
  heroCaret.className = 'caret';
  heroTagline.appendChild(heroCaret);

  setTimeout(function typeNext(i) {
    i = i || 0;
    if (i >= heroCharEls.length) return;
    heroCharEls[i].classList.add('revealed');
    setTimeout(function () { typeNext(i + 1); }, 45);
  }, 600);

  /* ---------------------------------------------------------------- */
  /* custom cursor                                                     */
  /* ---------------------------------------------------------------- */

  var cursorEl = document.getElementById('cursor');
  window.addEventListener('mousemove', function (e) {
    cursorEl.style.transform = 'translate(' + e.clientX + 'px, ' + e.clientY + 'px)';
  });

  /* ---------------------------------------------------------------- */
  /* about / boot log terminal                                         */
  /* ---------------------------------------------------------------- */

  var aboutLinesData = [
    { tag: 'BİZ KİMİZ', text: 'Markaların dijital dünyada güçlü, özgün ve kalıcı bir yer edinmesini sağlayan yaratıcı çözüm ortağıyız.' },
    { tag: 'NE YAPIYORUZ', text: 'Tasarım, yazılım ve stratejiyi bir araya getirerek markalara özel dijital çözümler geliştiriyoruz.' },
    { tag: 'NASIL ÇALIŞIYORUZ', text: 'Her projeyi dinleyerek, anlayarak ve birlikte şekillendirerek hayata geçiriyoruz.' },
    { tag: 'BAKIŞ AÇIMIZ', text: 'Sadece güzel görünen değil, çalışan, sonuç üreten ve değer katan işler tasarlıyoruz.' },
    { tag: 'NEDEN BİZ', text: 'Hazır kalıplar yerine markanın ihtiyaçlarına ve hedeflerine uygun çözümler üretiyoruz.' },
    { tag: 'İŞ ORTAKLIĞIMIZ', text: 'Müşteri ilişkisi değil, güvene ve uzun vadeli başarıya dayanan bir yol arkadaşlığı kuruyoruz.' },
    { tag: 'HEDEFİMİZ', text: 'Markaların dijital potansiyelini ortaya çıkararak sürdürülebilir büyümelerine katkı sağlamak.' },
    { tag: 'SÖZÜMÜZ', text: 'Her projede şeffaf iletişim, yaratıcı yaklaşım ve kaliteli iş sunmak.' },
  ];

  var terminalBody = document.getElementById('terminalBody');
  var lineEls = [];

  aboutLinesData.forEach(function (line, i) {
    var lineEl = document.createElement('div');
    lineEl.className = 'terminal-line';

    var tagEl = document.createElement('span');
    tagEl.className = 'terminal-tag';
    tagEl.style.color = GREEN;
    tagEl.style.textShadow = '0 0 5.4px ' + GREEN;
    tagEl.textContent = line.tag;

    var textEl = document.createElement('span');
    textEl.className = 'terminal-text';

    var charEls = [];
    line.text.split('').forEach(function (ch) {
      var charEl = document.createElement('span');
      charEl.className = 'terminal-char' + (ch === ' ' ? ' space' : '');
      charEl.textContent = ch;
      textEl.appendChild(charEl);
      charEls.push(charEl);
    });

    var caretEl = null;
    if (i === aboutLinesData.length - 1) {
      caretEl = document.createElement('span');
      caretEl.className = 'terminal-caret';
      caretEl.style.background = GREEN;
      textEl.appendChild(caretEl);
    }

    lineEl.appendChild(tagEl);
    lineEl.appendChild(textEl);
    terminalBody.appendChild(lineEl);

    lineEls.push({ tagEl: tagEl, charEls: charEls, caretEl: caretEl, text: line.text });
  });

  var statsRevealed = false;
  function revealStats() {
    if (statsRevealed) return;
    statsRevealed = true;

    var charStep = 0.035;
    lineEls.forEach(function (line, i) {
      var startDelay = i * 1.1 + 0.3;
      line.tagEl.style.animationDelay = startDelay + 's';
      line.tagEl.classList.add('revealed');

      line.charEls.forEach(function (charEl, ci) {
        charEl.style.animationDelay = (startDelay + ci * charStep) + 's';
        charEl.classList.add('revealed');
      });

      if (line.caretEl) {
        var lastCharDelay = startDelay + Math.max(0, line.text.length - 1) * charStep;
        line.caretEl.style.animationDelay = (lastCharDelay + charStep) + 's';
        line.caretEl.classList.add('revealed');
      }
    });

    animateScore(8);
  }

  var scoreEl = document.getElementById('scoreDisplay');
  var scoreTimer = null;
  function animateScore(target) {
    var start = Date.now();
    var duration = 1400;
    clearInterval(scoreTimer);
    function tick() {
      var t = Math.min(1, (Date.now() - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      scoreEl.textContent = Math.round(eased * target) + '/8';
      if (t >= 1) clearInterval(scoreTimer);
    }
    scoreTimer = setInterval(tick, 40);
    tick();
  }

  var statsRef = document.getElementById('hakkinda');
  function checkStatsVisible() {
    if (statsRevealed) return;
    var rect = statsRef.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh * 0.8 && rect.bottom > 0) revealStats();
  }
  window.addEventListener('scroll', checkStatsVisible, { passive: true });
  window.addEventListener('resize', checkStatsVisible);
  checkStatsVisible();

  /* ---------------------------------------------------------------- */
  /* levels: auto-scroll marquee + drag-to-scroll + click to open modal */
  /* ---------------------------------------------------------------- */

  var levelData = [
    { title: 'WEB TASARIM', category: 'DİJİTAL VİTRİN', accent: CYAN, image: 'assets/images/service-webdesign-bg.jpeg', desc: 'Markanızı dijital dünyada güçlü ve etkileyici bir şekilde temsil edecek, modern ve responsive web siteleri tasarlıyoruz. Her projede estetik tasarımı kullanıcı deneyimiyle dengeliyor, tüm cihazlarda kusursuz çalışan arayüzler oluşturuyoruz. Amacımız sadece şık bir web sitesi sunmak değil, ziyaretçilerinizi etkileyen ve dönüşüme yönlendiren bir dijital deneyim inşa etmek. Güven veren, hızlı ve ölçeklenebilir altyapılarla markanıza uzun vadeli değer katıyoruz.' },
    { title: 'WEB YAZILIM', category: 'ÖZEL ÇÖZÜM', accent: MAGENTA, image: 'assets/images/service-code-bg.jpeg', desc: 'İş ihtiyaçlarınıza özel, güvenilir ve ölçeklenebilir web yazılım çözümleri geliştiriyoruz. CMS, CRM, ERP gibi sistem entegrasyonlarıyla süreçlerinizi hızlandırıyor, verimliliğinizi artırıyoruz. Modern yazılım mimarileriyle geliştirilen altyapılar sayesinde işinizi dijitalde sürdürülebilir şekilde büyütmenizi sağlıyoruz. Her satırda performansı, güvenliği ve kullanıcı deneyimini merkeze alıyoruz.' },
    { title: 'IT ÇÖZÜMLERİ', category: 'ALTYAPI', accent: YELLOW, image: 'assets/images/service-it-bg.jpeg', desc: 'İşletmenizin teknolojik altyapısını güçlendirmek için kapsamlı IT çözümleri sunuyoruz. Sunucu kurulumu ve yönetimi, ofis içi donanım altyapısının kurulumu, program desteği ve network hizmetleri ile dijital süreçlerinizi daha verimli ve kesintisiz hale getiriyoruz. İş süreçlerinizi teknolojiyle entegre ederek operasyonel verimliliğinizi artırıyoruz.' },
    { title: 'GRAFİK TASARIM', category: 'GÖRSEL KİMLİK', accent: CYAN, image: 'assets/images/service-graphic-bg.png', desc: 'Markanızın ruhunu ve vizyonunu yansıtan özgün logo tasarımından kartvizite, sosyal medya banner\'larından kurumsal kimlik çalışmalarına kadar markanıza özel tüm görsel çözümler için yanınızdayız. Tutarlı ve etkileyici bir görsel dil oluşturarak, hedef kitleniz üzerinde güçlü bir ilk izlenim bırakmanızı sağlıyoruz.' },
    { title: 'MOBİL UYGULAMA', category: 'IOS & ANDROID', accent: MAGENTA, image: 'assets/images/service-mobile-bg.png', desc: 'Hem iOS hem Android platformlarında çalışan, kullanıcı deneyimi odaklı, hızlı ve güvenilir mobil uygulamalar geliştiriyoruz. İş süreçlerinizi dijitalleştirerek, müşterilerinizle kesintisiz iletişim kurmanızı sağlıyoruz.' },
    { title: 'SEO', category: 'ORGANİK BÜYÜME', accent: YELLOW, image: 'assets/images/service-seo-bg.png', desc: 'Web sitenizin arama motorlarında üst sıralarda yer alması için kapsamlı anahtar kelime analizi, teknik SEO optimizasyonu, içerik stratejisi ve backlink çalışmaları yapıyoruz. Böylece organik trafiğinizi artırırken, potansiyel müşterilerinize daha kolay ulaşmanızı sağlıyoruz.' },
    { title: 'E-SPOR', category: 'DİJİTAL STRATEJİ', accent: CYAN, image: 'assets/images/service-espor-bg.png', desc: 'Deneyimli ekibimizle espor organizasyonları, takımlar ve etkinliklere özel dijital altyapı ve stratejik çözümler sunuyoruz. Turnuva yönetimi, yayın entegrasyonu, sponsorluk ve marka kimliği gibi her aşamada yanınızdayız. Espor dünyasında markanızı bir adım öne taşıyan akıllı ve etkili projeler geliştiriyoruz.' },
    { title: 'E-TİCARET', category: 'ONLINE SATIŞ', accent: MAGENTA, image: 'assets/images/service-eticaret-bg.png', desc: 'Modern ve ölçeklenebilir e-ticaret platformları tasarlıyor ve geliştiriyoruz. Kullanıcı dostu arayüzlerimizle ürün kataloglarınızı kolayca yönetebilir, müşterilerinize sorunsuz alışveriş deneyimi sunabilirsiniz. Güvenli ödeme sistemleri ve hızlı kargo entegrasyonlarıyla hem sizin hem müşterilerinizin güvenliğini sağlıyoruz.' },
  ];

  var levelsTrack = document.getElementById('levelsTrack');
  var isDraggingServices = false;
  var justDragged = false;

  setTimeout(function () {
    setInterval(function () {
      if (isDraggingServices) return;
      var max = levelsTrack.scrollWidth - levelsTrack.clientWidth;
      if (max <= 0) return;
      if (levelsTrack.scrollLeft >= max - 1) {
        levelsTrack.scrollLeft = 0;
      } else {
        levelsTrack.scrollLeft += 1;
      }
    }, 20);
  }, 2500);

  (function () {
    var startX = 0, startScroll = 0, dragged = false;
    levelsTrack.addEventListener('pointerdown', function (e) {
      isDraggingServices = true;
      dragged = false;
      startX = e.clientX;
      startScroll = levelsTrack.scrollLeft;
      levelsTrack.classList.add('dragging');
    });
    window.addEventListener('pointermove', function (e) {
      if (!isDraggingServices) return;
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 3) dragged = true;
      levelsTrack.scrollLeft = startScroll - dx;
    });
    window.addEventListener('pointerup', function () {
      isDraggingServices = false;
      levelsTrack.classList.remove('dragging');
      setTimeout(function () { justDragged = dragged; dragged = false; }, 0);
    });
  })();

  document.querySelectorAll('.level-card').forEach(function (card) {
    card.addEventListener('click', function () {
      if (justDragged) return;
      openLevel(parseInt(card.dataset.level, 10));
    });
  });

  /* ---------------------------------------------------------------- */
  /* modal                                                              */
  /* ---------------------------------------------------------------- */

  var modalOverlay = document.getElementById('levelModal');
  var modalCard = document.getElementById('modalCard');

  function openLevel(i) {
    var lvl = levelData[i];
    document.getElementById('modalLevel').textContent = 'LEVEL ' + String(i + 1).padStart(2, '0');
    document.getElementById('modalTitle').textContent = lvl.title;
    var tagEl = document.getElementById('modalTag');
    tagEl.textContent = lvl.category;
    tagEl.style.background = lvl.accent;
    document.getElementById('modalImage').style.backgroundImage = "url('" + lvl.image + "')";
    document.getElementById('modalDesc').textContent = lvl.desc;

    modalCard.style.setProperty('--modal-glow', lvl.accent);
    modalCard.style.border = '2.7px solid ' + lvl.accent;

    document.getElementById('modalSweep').style.background =
      'linear-gradient(180deg, transparent, color-mix(in srgb, ' + lvl.accent + ' 65%, transparent) 45%, ' +
      lvl.accent + ' 50%, color-mix(in srgb, ' + lvl.accent + ' 65%, transparent) 55%, transparent)';

    modalOverlay.classList.remove('hidden');
  }

  function closeLevel() {
    if (modalOverlay.classList.contains('hidden') || modalOverlay.classList.contains('closing')) return;
    modalOverlay.classList.add('closing');
    modalCard.classList.add('closing');
    setTimeout(function () {
      modalOverlay.classList.add('hidden');
      modalOverlay.classList.remove('closing');
      modalCard.classList.remove('closing');
    }, 300);
  }

  modalOverlay.addEventListener('click', closeLevel);
  document.getElementById('modalClose').addEventListener('click', closeLevel);
  modalCard.addEventListener('click', function (e) { e.stopPropagation(); });

  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeLevel(); closeMail(); }
    if (e.key === 'ArrowRight') nextTestimonial();
    if (e.key === 'ArrowLeft') prevTestimonial();
  });

  /* ---------------------------------------------------------------- */
  /* mail modal                                                          */
  /* ---------------------------------------------------------------- */

  var mailModal = document.getElementById('mailModal');
  var mailModalCard = document.getElementById('mailModalCard');
  var mailTrigger = document.getElementById('mailTrigger');
  var mailCopyBtn = document.getElementById('mailCopyBtn');
  var mailAddress = document.getElementById('mailAddress');

  function openMail() {
    mailModal.classList.remove('hidden');
  }

  function closeMail() {
    if (mailModal.classList.contains('hidden') || mailModal.classList.contains('closing')) return;
    mailModal.classList.add('closing');
    mailModalCard.classList.add('closing');
    setTimeout(function () {
      mailModal.classList.add('hidden');
      mailModal.classList.remove('closing');
      mailModalCard.classList.remove('closing');
    }, 300);
  }

  if (mailTrigger) mailTrigger.addEventListener('click', openMail);
  if (mailModal) {
    mailModal.addEventListener('click', closeMail);
    document.getElementById('mailModalClose').addEventListener('click', closeMail);
    mailModalCard.addEventListener('click', function (e) { e.stopPropagation(); });
  }

  if (mailCopyBtn) {
    mailCopyBtn.addEventListener('click', function () {
      var email = mailAddress.textContent.trim();
      var done = function () {
        mailCopyBtn.textContent = 'KOPYALANDI';
        mailCopyBtn.classList.add('copied');
        setTimeout(function () {
          mailCopyBtn.textContent = 'KOPYALA';
          mailCopyBtn.classList.remove('copied');
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done).catch(function () {
          fallbackCopy(email);
          done();
        });
      } else {
        fallbackCopy(email);
        done();
      }
    });
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (err) {}
    document.body.removeChild(ta);
  }

  /* ---------------------------------------------------------------- */
  /* quest road: segments + car                                        */
  /* ---------------------------------------------------------------- */

  var roadContainer = document.getElementById('roadContainer');
  var roadPlane = document.getElementById('roadPlane');
  var questStepEls = Array.prototype.slice.call(document.querySelectorAll('.quest-step'));
  var NODE_YS = [282.45, 343.65, 282.45, 343.65, 282.45];
  var LEFT_PCTS = [8, 27, 50, 73, 92];
  var CONTAINER_H = 630;

  var roadWidth = roadContainer.clientWidth || 1200;

  function buildRoad() {
    roadWidth = roadContainer.clientWidth || 1200;
    roadPlane.innerHTML = '';

    var points = LEFT_PCTS.map(function (lp, i) { return { x: (lp / 100) * roadWidth, y: NODE_YS[i] }; });

    for (var i = 0; i < points.length - 1; i++) {
      var p1 = points[i], p2 = points[i + 1];
      var dx = p2.x - p1.x, dy = p2.y - p1.y;
      var length = Math.sqrt(dx * dx + dy * dy);
      var angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      var seg = document.createElement('div');
      seg.className = 'road-segment';
      seg.style.left = p1.x + 'px';
      seg.style.top = p1.y + 'px';
      seg.style.width = length + 'px';
      seg.style.transform = 'translateY(-50%) rotate(' + angle + 'deg)';
      roadPlane.appendChild(seg);
    }

    var pathStr = 'M ' + points.map(function (p) { return p.x + ' ' + p.y; }).join(' L ');
    var car = document.createElement('div');
    car.className = 'road-car';
    car.style.offsetPath = "path('" + pathStr + "')";
    car.innerHTML =
      '<div class="road-car-shadow"></div>' +
      '<div class="road-car-body"></div>' +
      '<div class="road-car-cabin"></div>' +
      '<div class="road-car-wheel back"></div>' +
      '<div class="road-car-wheel front"></div>';
    roadPlane.appendChild(car);

    return computeNodeRatios(points);
  }

  function computeNodeRatios(points) {
    var segLens = [];
    var total = 0;
    for (var i = 0; i < points.length - 1; i++) {
      var dx = points[i + 1].x - points[i].x;
      var dy = points[i + 1].y - points[i].y;
      var len = Math.sqrt(dx * dx + dy * dy);
      segLens.push(len);
      total += len;
    }
    var ratios = [];
    var cum = 0;
    for (var n = 0; n < NODE_YS.length; n++) {
      ratios.push(Math.min(cum / total, 0.99));
      cum += segLens[n] || 0;
    }
    return ratios;
  }

  var ROAD_DURATION = 11000;
  var nodeRatios = buildRoad();
  var roadStart = Date.now();
  window.addEventListener('resize', function () {
    var w = roadContainer.clientWidth;
    if (Math.abs(w - roadWidth) > 2) {
      nodeRatios = buildRoad();
      roadStart = Date.now();
    }
  });

  setInterval(function () {
    var frac = ((Date.now() - roadStart) % ROAD_DURATION) / ROAD_DURATION;
    questStepEls.forEach(function (stepEl, i) {
      var node = stepEl.querySelector('.quest-node');
      node.classList.toggle('passed', frac >= nodeRatios[i]);
    });
  }, 120);

  /* ---------------------------------------------------------------- */
  /* testimonials                                                       */
  /* ---------------------------------------------------------------- */

  var testimonialData = [
    { name: 'Semih Cumak', role: 'Firma Sahibi, Assem Yapı Mimarlık', quote: 'Daha önce birkaç farklı ekiple çalışmıştık fakat iletişim konusunda hep sorun yaşamıştık. Bu projede ise ne zaman ulaşsak hızlıca dönüş aldık ve taleplerimiz gerçekten dikkate alındı. Sadece söylediğimizi yapmakla kalmayıp daha iyi olabilecek noktaları da açıkça paylaşmaları bizim için çok değerliydi.' },
    { name: 'Engin Koma', role: 'Firma Sahibi, 216 Bilgisayar', quote: 'Bilgisayar firmamızın teknik altyapısı ve günlük operasyonları için IT desteği aldık. Karşılaştığımız sorunlara hızlı müdahale etmeleri ve geçici çözümler yerine kalıcı iyileştirmeler sunmaları bizim için çok değerliydi. Süreç boyunca iletişimleri güçlüydü ve ihtiyaç duyduğumuz her anda kolayca ulaşabildik. Aldığımız hizmetten son derece memnun kaldık.' },
    { name: 'Furkan Kar', role: 'Genel Müdür, OZKAR A.Ş', quote: '3D baskı alanında kaliteli işler üretiyorduk ancak bunu sosyal medyada doğru şekilde yansıtmakta zorlanıyorduk. İçerik planlaması, görsel düzeni ve paylaşımların dili konusunda bize gerçekten yol gösterdiler. Ürünlerimizi daha profesyonel ve dikkat çekici bir şekilde sunmaya başladık. Düzenli çalışmaların ardından sosyal medya hesaplarımız daha kurumsal bir görünüme kavuştu ve müşterilerden aldığımız etkileşim belirgin şekilde arttı.' },
    { name: 'Merve Demir', role: 'Firma Sahibi, Liliahomes', quote: 'Otelimizin dijital görünümünü yenilemek için birlikte çalıştık. Web sitemiz daha modern, anlaşılır ve güven veren bir yapıya kavuştu. Airbnb tarafında ise ilanlarımızın düzenlenmesi, içeriklerin iyileştirilmesi ve rezervasyon sürecinin daha verimli yönetilmesi konusunda destek aldık. Sorularımıza hızlı dönüş yapmaları ve süreci yakından takip etmeleri bizi oldukça rahatlattı. Yapılan çalışmaların ardından misafirlerimizden daha olumlu geri dönüşler almaya başladık.' },
    { name: 'Buse Özgün', role: 'Kurucu', quote: 'Kendi markamı oluştururken beni ve yapmak istediğim işi gerçekten anlayan bir ekiple çalışmak çok değerliydi. Aşçılık tarzımı, sunduğum hizmetleri ve marka kimliğimi doğru yansıtan modern bir web sitesi hazırladılar. Süreç boyunca fikirlerimi önemsediler ve ortaya hem şık hem de kullanımı kolay bir çalışma çıktı. Yeni sitem sayesinde kendimi ve markamı çok daha profesyonel bir şekilde tanıtabiliyorum.' },
    { name: 'Cem Çabalar', role: 'Espor Takım Yöneticisi', quote: 'Espor takımımızın dijital tasarımlarını ve sosyal medya içeriklerini kendilerine emanet ettik. Hazırladıkları maç günü paylaşımları, oyuncu duyuruları ve özel içerikler gerçekten çok kaliteli ve dikkat çekiciydi. Kısa sürede hesaplarımız daha profesyonel bir görünüme kavuşurken paylaşımlarımızın etkileşiminde de ciddi bir artış yaşadık. Espor dünyasının dinamiklerini iyi anlamaları ve her içerikte takımımızın ruhunu yansıtmaları bizi oldukça memnun etti.' },
  ];

  var TESTIMONIAL_COLORS = [CYAN, MAGENTA, YELLOW, GREEN];
  var activeTestimonial = 1;
  var stage = document.getElementById('testimonialStage');
  var dotsWrap = document.getElementById('testimonialDots');

  var cardEls = testimonialData.map(function (t, i) {
    var wrap = document.createElement('div');
    wrap.className = 'testimonial-card-wrap';

    var led = document.createElement('div');
    led.className = 'testimonial-led';
    var ledInner = document.createElement('div');
    ledInner.className = 'testimonial-led-inner';
    led.appendChild(ledInner);

    var card = document.createElement('div');
    card.className = 'testimonial-card';

    var quote = document.createElement('div');
    quote.className = 'testimonial-quote';
    quote.textContent = t.quote;

    var meta = document.createElement('div');
    meta.style.marginTop = 'auto';
    var name = document.createElement('div');
    name.className = 'testimonial-name';
    name.textContent = t.name;
    var role = document.createElement('div');
    role.className = 'testimonial-role';
    role.textContent = t.role;
    meta.appendChild(name);
    meta.appendChild(role);

    card.appendChild(quote);
    card.appendChild(meta);
    wrap.appendChild(led);
    wrap.appendChild(card);
    wrap.addEventListener('click', function () {
      if (testimonialJustDragged) return;
      setActiveTestimonial(i);
      resetTestimonialTimer();
    });
    stage.appendChild(wrap);

    var dot = document.createElement('div');
    dot.className = 'testimonial-dot';
    dot.addEventListener('click', function () {
      setActiveTestimonial(i);
      resetTestimonialTimer();
    });
    dotsWrap.appendChild(dot);

    return { wrap: wrap, led: led, ledInner: ledInner, card: card, quote: quote, dot: dot };
  });

  function renderTestimonials() {
    var n = testimonialData.length;
    var scale = Math.min(1.7, Math.max(1, window.innerWidth / 1400));

    cardEls.forEach(function (els, i) {
      var offset = (i - activeTestimonial + n) % n;
      if (offset > n / 2) offset -= n;
      var isActive = offset === 0;
      var color = TESTIMONIAL_COLORS[i % TESTIMONIAL_COLORS.length];
      var dist = Math.abs(offset);
      var visible = dist <= 2;

      var widthByDist = { 0: 380 * scale, 1: 300 * scale, 2: 230 * scale };
      var heightByDist = { 0: 340 * scale, 1: 300 * scale, 2: 260 * scale };
      var opacityByDist = { 0: 1, 1: 0.7, 2: 0.35 };
      var width = widthByDist[dist] !== undefined ? widthByDist[dist] : 200 * scale;
      var height = heightByDist[dist] !== undefined ? heightByDist[dist] : 240 * scale;
      var opacity = visible ? (opacityByDist[dist] !== undefined ? opacityByDist[dist] : 0) : 0;

      var GAP = 28 * scale;
      var spacing = [0];
      spacing[1] = widthByDist[0] / 2 + GAP + widthByDist[1] / 2;
      spacing[2] = spacing[1] + widthByDist[1] / 2 + GAP + widthByDist[2] / 2;
      var xPos = offset === 0 ? 0 : Math.sign(offset) * spacing[Math.min(dist, 2)];

      els.wrap.style.width = width + 'px';
      els.wrap.style.transform = 'translate(calc(-50% + ' + xPos + 'px), -50%)';
      els.wrap.style.opacity = opacity;
      els.wrap.style.pointerEvents = visible ? 'auto' : 'none';
      els.wrap.style.zIndex = isActive ? 3 : (10 - dist);

      els.led.style.display = isActive ? 'block' : 'none';
      els.led.style.boxShadow = '0 0 18px ' + color;
      els.ledInner.style.background = 'conic-gradient(' + color + ' 0deg, transparent 70deg, transparent 290deg, ' + color + ' 360deg)';

      els.card.style.border = '2px solid ' + (isActive ? color : 'var(--panel-line)');
      els.card.style.padding = (isActive ? 32 * scale : 20 * scale) + 'px';
      els.card.style.height = height + 'px';
      els.card.style.transform = isActive ? 'scale(1)' : 'scale(0.94)';

      els.quote.style.fontSize = (dist === 0 ? 13 * scale : 11.5 * scale) + 'px';
      els.quote.style.webkitLineClamp = dist === 0 ? '11' : '8';

      els.dot.style.width = (isActive ? 22 : 8) * scale + 'px';
      els.dot.style.height = 8 * scale + 'px';
      els.dot.style.background = isActive ? color : 'var(--panel-line)';
    });
  }

  window.addEventListener('resize', renderTestimonials);

  function setActiveTestimonial(i) {
    activeTestimonial = i;
    renderTestimonials();
  }
  function nextTestimonial() {
    activeTestimonial = (activeTestimonial + 1) % testimonialData.length;
    renderTestimonials();
  }
  function prevTestimonial() {
    activeTestimonial = (activeTestimonial - 1 + testimonialData.length) % testimonialData.length;
    renderTestimonials();
  }

  var testimonialTimer = setInterval(nextTestimonial, 4500);
  function resetTestimonialTimer() {
    clearInterval(testimonialTimer);
    testimonialTimer = setInterval(nextTestimonial, 4500);
  }

  var testimonialJustDragged = false;
  (function () {
    var startX = 0, dragging = false, dragged = false;
    stage.style.cursor = 'grab';
    stage.addEventListener('pointerdown', function (e) {
      dragging = true;
      dragged = false;
      startX = e.clientX;
      stage.style.cursor = 'grabbing';
    });
    window.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      if (Math.abs(e.clientX - startX) > 3) dragged = true;
    });
    window.addEventListener('pointerup', function (e) {
      if (!dragging) return;
      dragging = false;
      stage.style.cursor = 'grab';
      var dx = e.clientX - startX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) nextTestimonial(); else prevTestimonial();
        resetTestimonialTimer();
      }
      testimonialJustDragged = dragged;
      setTimeout(function () { testimonialJustDragged = false; }, 0);
    });
  })();

  window.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') resetTestimonialTimer();
  });

  renderTestimonials();

  /* ---------------------------------------------------------------- */
  /* nav: smooth scroll with fixed-nav offset                          */
  /* ---------------------------------------------------------------- */

  var navEl = document.querySelector('.nav');
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      var navHeight = navEl ? navEl.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 12;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
