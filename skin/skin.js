/* Capa Andina · sonido de la evaluación
   ------------------------------------------------------------------
   Tres señales sintetizadas con WebAudio (sin archivos que licenciar):
   acierto (dos notas ascendentes), error (dos notas descendentes) y
   avance de pregunta (un blip corto). El motor solo emite eventos
   (ova:quiz-respuesta · ova:empar-intento · ova:evalquiz-avance); si esta
   capa no está cargada, el curso funciona igual en silencio.
   El AudioContext se crea en el primer evento —siempre nace de un
   click, así que el navegador no lo bloquea. */
(() => {
  'use strict';

  let ctx = null;
  const VOLUMEN = 0.12;

  function contexto() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* Toca una secuencia de notas: [frecuencia, duración en s] */
  function tocar(notas, tipo = 'sine') {
    const ac = contexto();
    if (!ac) return;
    let t = ac.currentTime;
    notas.forEach(([frec, dur]) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = tipo;
      osc.frequency.value = frec;
      /* Ataque y caída suaves para que no haga click al cortar */
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(VOLUMEN, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(ac.destination);
      osc.start(t);
      osc.stop(t + dur + 0.02);
      t += dur * 0.7; /* leve solape entre notas */
    });
  }

  const sonidos = {
    acierto: () => tocar([[523.25, 0.16], [783.99, 0.22]]),          /* C5 → G5 */
    error:   () => tocar([[311.13, 0.18], [233.08, 0.26]], 'triangle'), /* Eb4 → Bb3 */
    avance:  () => tocar([[587.33, 0.09]])                            /* D5, blip */
  };

  document.addEventListener('ova:quiz-respuesta', e => {
    (e.detail.correcta ? sonidos.acierto : sonidos.error)();
  });
  document.addEventListener('ova:empar-intento', e => {
    (e.detail.correcta ? sonidos.acierto : sonidos.error)();
  });
  document.addEventListener('ova:evalquiz-avance', () => sonidos.avance());
})();

/* Capa Andina · pódcast de la unidad
   ------------------------------------------------------------------
   El motor trae la pieza visual `.ova-audio` (play, título, progreso, tiempo)
   pero no la reproduce. Aquí se le da vida a la que declare
   `data-ua-audio="<ruta del mp3>"`: play/pausa, progreso, tiempo restante y
   salto al tocar la barra. Delegado en `document`, así funciona igual en la
   SPA (pantallas montadas desde <template>) y en multipágina. Un solo pódcast
   suena a la vez. */
(() => {
  'use strict';

  const reproductores = new WeakMap();

  const mmss = s => {
    if (!isFinite(s)) return '--:--';
    const m = Math.floor(s / 60), r = Math.floor(s % 60);
    return `${m}:${String(r).padStart(2, '0')}`;
  };

  function pintar(caja, audio) {
    const fill = caja.querySelector('.ova-audio__progress-fill');
    const tiempo = caja.querySelector('.ova-audio__time');
    const icono = caja.querySelector('.ova-audio__play iconify-icon');
    if (fill && audio.duration) fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
    if (tiempo) tiempo.textContent = audio.paused && !audio.currentTime
      ? mmss(audio.duration)
      : `${mmss(audio.currentTime)} / ${mmss(audio.duration)}`;
    if (icono) icono.setAttribute('icon', audio.paused ? 'mdi:play' : 'mdi:pause');
    caja.classList.toggle('is-playing', !audio.paused);
  }

  function reproductor(caja) {
    let audio = reproductores.get(caja);
    if (audio) return audio;
    audio = new Audio(caja.dataset.uaAudio);
    audio.preload = 'metadata';
    ['loadedmetadata', 'timeupdate', 'play', 'pause', 'ended'].forEach(ev =>
      audio.addEventListener(ev, () => pintar(caja, audio)));
    audio.addEventListener('play', () => {
      document.querySelectorAll('[data-ua-audio]').forEach(otra => {
        const a = reproductores.get(otra);
        if (a && a !== audio && !a.paused) a.pause();
      });
    });
    reproductores.set(caja, audio);
    return audio;
  }

  document.addEventListener('click', e => {
    const play = e.target.closest('[data-ua-audio] .ova-audio__play');
    if (play) {
      const audio = reproductor(play.closest('[data-ua-audio]'));
      audio.paused ? audio.play() : audio.pause();
      return;
    }
    const barra = e.target.closest('[data-ua-audio] .ova-audio__progress');
    if (barra) {
      const caja = barra.closest('[data-ua-audio]');
      const audio = reproductor(caja);
      if (!audio.duration) return;
      const r = barra.getBoundingClientRect();
      audio.currentTime = audio.duration * Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      pintar(caja, audio);
    }
  });
})();

/* Capa Andina · globos de los puntos de interés
   ------------------------------------------------------------------
   La misma de Scala (2026-10-09). El motor abre el globo de un `.ova-hotspot`
   siempre hacia abajo, centrado en el punto: cerca de un borde quedaba cortado.
   Al abrirlo se mide: si no cabe abajo y sí arriba, se abre hacia arriba
   (.ua-hotspot--arriba), y si se sale por un costado de la imagen, de la
   ventana o de la caja que la recorta (la figura que se desliza en móvil), se
   corre lo justo (--ua-globo-dx). Lo de la caja que recorta es propio de
   Andina: en Scala y UP el globo quedaba 12 px cortado por ella a 390 px
   (medir-pantalla, 2026-10-10). Se abre al pasar el puntero o al tocar el
   punto; un toque fuera lo cierra. */
(() => {
  'use strict';

  const MARGEN = 8;   // aire mínimo hasta el borde de la imagen, de la caja o de la ventana

  // El primer ancestro que recorta en horizontal: lo que quede fuera de él no se ve.
  function recortador(el) {
    for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
      if (getComputedStyle(a).overflowX !== 'visible') return a.getBoundingClientRect();
    }
    return null;
  }

  function abrir(punto) {
    const globo = punto.querySelector('.ova-hotspot__tooltip');
    if (!globo) return;
    punto.classList.add('is-open');
    punto.classList.remove('ua-hotspot--arriba');
    punto.style.removeProperty('--ua-globo-dx');
    const caja = (punto.closest('.ova-hotspots__img') || punto.parentElement).getBoundingClientRect();
    const p = punto.getBoundingClientRect();
    const g = globo.getBoundingClientRect();
    const alto = g.height + 14;
    if (p.bottom + alto > caja.bottom && p.top - alto >= caja.top) punto.classList.add('ua-hotspot--arriba');
    const corte = recortador(punto);
    const izq = Math.max(caja.left, corte ? corte.left : 0, 0) + MARGEN;
    const der = Math.min(caja.right, corte ? corte.right : Infinity, document.documentElement.clientWidth) - MARGEN;
    let dx = 0;
    if (g.width <= der - izq) {
      if (g.left < izq) dx = izq - g.left;
      else if (g.right > der) dx = der - g.right;
    }
    if (dx) punto.style.setProperty('--ua-globo-dx', `${Math.round(dx)}px`);
  }
  function cerrar(punto) {
    punto.classList.remove('is-open', 'ua-hotspot--arriba');
    punto.style.removeProperty('--ua-globo-dx');
  }

  document.addEventListener('pointerover', e => {
    const punto = e.target.closest && e.target.closest('.ova-hotspot');
    if (punto && !punto.contains(e.relatedTarget)) abrir(punto);
  });
  document.addEventListener('pointerout', e => {
    const punto = e.target.closest && e.target.closest('.ova-hotspot');
    if (punto && e.pointerType === 'mouse' && !punto.contains(e.relatedTarget)) cerrar(punto);
  });
  document.addEventListener('click', e => {
    const punto = e.target.closest && e.target.closest('.ova-hotspot');
    document.querySelectorAll('.ova-hotspot.is-open').forEach(otro => { if (otro !== punto) cerrar(otro); });
    if (punto) abrir(punto);
  });
})();

/* Capa Andina · indicio de interacción
   ------------------------------------------------------------------
   La misma de Scala (2026-10-09). Cada vez que un componente interactivo
   aparece en pantalla (al bajar o al subir), él y su llamado a la acción
   (.ua-cta justo antes) reciben .ua-indicio, y la manito y el halo de skin.css
   se animan una vez. Al salir del todo se les quita, así que al volver la
   animación arranca de nuevo. Vigila también lo que la SPA pinta al navegar.
   Con movimiento reducido, skin.css anula las animaciones. */
(() => {
  'use strict';
  if (!('IntersectionObserver' in window)) return;

  const INTERACTIVOS = '.ova-acordeon, .ova-carrusel, .ova-tabs, .ova-timeline-h, .ova-hotspots, ' +
                       '.ova-video, .ova-audio, .ova-beforeafter, .ua-descarga';
  const vigilados = new WeakSet();

  const marcar = (comp, si) => {
    comp.classList.toggle('ua-indicio', si);
    const previo = comp.previousElementSibling;
    if (previo && previo.classList.contains('ua-cta')) previo.classList.toggle('ua-indicio', si);
  };

  const observador = new IntersectionObserver(entradas => {
    for (const e of entradas) {
      if (e.intersectionRatio >= 0.25) marcar(e.target, true);
      else if (!e.isIntersecting) marcar(e.target, false);
    }
  }, { threshold: [0, 0.25] });

  const vigilar = raiz => {
    if (!raiz.querySelectorAll) return;
    const lista = raiz.matches && raiz.matches(INTERACTIVOS) ? [raiz] : [];
    lista.push(...raiz.querySelectorAll(INTERACTIVOS));
    for (const comp of lista) {
      if (vigilados.has(comp)) continue;
      vigilados.add(comp);
      observador.observe(comp);
    }
  };

  const iniciar = () => {
    vigilar(document);
    new MutationObserver(cambios => {
      for (const c of cambios) c.addedNodes.forEach(n => n.nodeType === 1 && vigilar(n));
    }).observe(document.body, { childList: true, subtree: true });
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', iniciar) : iniciar();
})();


/* =========================================================
   GALERÍA DE IMÁGENES (.ua-galeria) · plantilla base, 2026-10-18
   Una imagen protagonista y las vecinas asomando. Botones, puntos, flechas
   del teclado y scroll-snap; la activa se marca con IntersectionObserver.
   ========================================================= */
(function () {
  'use strict';
  function armar(g) {
    if (g.dataset.uaGaleria) return;
    g.dataset.uaGaleria = '1';
    const pista = g.querySelector('.ua-galeria__pista');
    const items = [...g.querySelectorAll('.ua-galeria__item')];
    if (!pista || !items.length) return;
    const puntos = g.querySelector('.ua-galeria__puntos');
    if (puntos) items.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'ua-galeria__punto' + (i === 0 ? ' is-active' : '');
      b.setAttribute('aria-label', 'Imagen ' + (i + 1) + ' de ' + items.length);
      b.addEventListener('click', () => ir(i));
      puntos.appendChild(b);
    });
    let actual = 0;
    const marcar = (i) => {
      actual = i;
      items.forEach((it, k) => it.classList.toggle('is-active', k === i));
      puntos && [...puntos.children].forEach((p, k) => p.classList.toggle('is-active', k === i));
    };
    const ir = (i) => { i = Math.max(0, Math.min(items.length - 1, i)); items[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); marcar(i); };
    g.querySelector('[data-ua-galeria-prev]')?.addEventListener('click', () => ir(actual - 1));
    g.querySelector('[data-ua-galeria-next]')?.addEventListener('click', () => ir(actual + 1));
    g.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); ir(actual + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); ir(actual - 1); } });
    items.forEach((it, i) => it.addEventListener('click', () => ir(i)));
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting && e.intersectionRatio > .6) marcar(items.indexOf(e.target)); }); }, { root: pista, threshold: [.6] });
      items.forEach(it => io.observe(it));
    }
    marcar(0);
  }
  const iniciar = () => {
    document.querySelectorAll('.ua-galeria').forEach(armar);
    new MutationObserver(() => document.querySelectorAll('.ua-galeria').forEach(armar)).observe(document.body, { childList: true, subtree: true });
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', iniciar) : iniciar();
})();

/* =========================================================
   PÓDCAST CON PLYR (.ua-podcast audio[data-ua-plyr]) · 2026-10-18
   Plyr (MIT) viaja en assets/vendor/ del curso; se carga solo si la
   pantalla lo pide. Controles: −15 s · play · +15 s · progreso · velocidad;
   con data-ua-plyr="volumen" añade silencio y volumen. Iconos propios.
   ========================================================= */
(function () {
  'use strict';
  const ICO = {
    rew: '<svg class="ua-ico" viewBox="0 0 24 24" aria-hidden="true"><g transform="matrix(-1 0 0 1 24 0)"><path d="M19.5 12A7.5 7.5 0 1 1 15.75 5.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M14.66 2.5 15.75 5.5 12.6 6.06" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></g><text x="12" y="15" text-anchor="middle" font-family="system-ui,sans-serif" font-size="7.6" font-weight="700" fill="currentColor">15</text></svg>',
    fwd: '<svg class="ua-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 12A7.5 7.5 0 1 1 15.75 5.5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M14.66 2.5 15.75 5.5 12.6 6.06" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><text x="12" y="15" text-anchor="middle" font-family="system-ui,sans-serif" font-size="7.6" font-weight="700" fill="currentColor">15</text></svg>',
    play: '<svg class="ua-ico ua-ico-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>',
    pause: '<svg class="ua-ico ua-ico-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h4v14H6zm8 0h4v14h-4z" fill="currentColor"/></svg>',
    vol: '<svg class="ua-ico ua-ico-vol" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" fill="currentColor"/><path d="M15 9.2a4 4 0 0 1 0 5.6M17.5 6.7a7.5 7.5 0 0 1 0 10.6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    mute: '<svg class="ua-ico ua-ico-mute" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4z" fill="currentColor"/><path d="M15.5 9.5l5 5m0-5l-5 5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'
  };
  const controles = (conVolumen) => `
    <div class="plyr__controls">
      <button type="button" class="plyr__control" data-plyr="rewind" aria-label="Retroceder 15 segundos">${ICO.rew}</button>
      <button type="button" class="plyr__control" data-plyr="play" aria-label="Reproducir">${ICO.play}${ICO.pause}</button>
      <button type="button" class="plyr__control" data-plyr="fast-forward" aria-label="Adelantar 15 segundos">${ICO.fwd}</button>
      <div class="plyr__time plyr__time--current" aria-label="Tiempo actual">00:00</div>
      <div class="plyr__progress"><input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Posición"><progress class="plyr__progress__buffer" min="0" max="100" value="0"></progress></div>
      <div class="plyr__time plyr__time--duration" aria-label="Duración">00:00</div>
      ${conVolumen ? `<button type="button" class="plyr__control" data-plyr="mute" aria-label="Silenciar">${ICO.vol}${ICO.mute}</button><div class="plyr__volume"><input data-plyr="volume" type="range" min="0" max="1" step="0.05" value="1" aria-label="Volumen"></div>` : ''}
      <button type="button" class="ua-podcast__velocidad" aria-label="Velocidad de reproducción">1×</button>
    </div>`;
  const VEL = [1, 1.25, 1.5, 2];
  let cargando = null;
  function cargarPlyr() {
    if (window.Plyr) return Promise.resolve();
    if (cargando) return cargando;
    cargando = new Promise((ok, mal) => {
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'assets/vendor/plyr.css'; document.head.appendChild(l);
      const s = document.createElement('script'); s.src = 'assets/vendor/plyr.js'; s.onload = ok; s.onerror = mal; document.head.appendChild(s);
    });
    return cargando;
  }
  function armar(audio) {
    if (audio.dataset.uaPlyrListo) return;
    audio.dataset.uaPlyrListo = '1';
    cargarPlyr().then(() => {
      const p = new Plyr(audio, {
        controls: controles(audio.dataset.uaPlyr === 'volumen'), seekTime: 15, speed: { selected: 1, options: VEL },
        i18n: { play: 'Reproducir', pause: 'Pausar', rewind: 'Retroceder {seektime} s', fastForward: 'Adelantar {seektime} s', seek: 'Posición', currentTime: 'Tiempo actual', duration: 'Duración', mute: 'Silenciar', unmute: 'Activar sonido', volume: 'Volumen' }
      });
      let i = 0;
      p.on('ready', () => {
        const btn = p.elements.container.querySelector('.ua-podcast__velocidad');
        btn && btn.addEventListener('click', () => { i = (i + 1) % VEL.length; p.speed = VEL[i]; btn.textContent = String(VEL[i]).replace('.', ',') + '×'; });
      });
      p.on('play', () => document.querySelectorAll('.ua-podcast audio').forEach(a => { if (a !== audio && !a.paused) a.pause(); }));
    }).catch(() => { audio.controls = true; });
  }
  const iniciar = () => {
    const todos = () => document.querySelectorAll('.ua-podcast audio[data-ua-plyr]').forEach(armar);
    todos();
    new MutationObserver(todos).observe(document.body, { childList: true, subtree: true });
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', iniciar) : iniciar();
})();
