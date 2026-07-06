/* ============================================================
   MAIN.JS
   ------------------------------------------------------------
   All interactivity for the proposal letter. You shouldn't need
   to edit this file to personalize the site — see config.js.
   ============================================================ */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    applyConfig();
    setupEnvelope();
    setupScrollReveal();
    setupAudioPlayer();
    setupVideoPlayer();
    setupGalleryLightbox();
    setupQuestion();
    registerServiceWorker();
  }

  /* ----------------------------------------------------------
     Optional offline support — only works over http(s), so it's
     skipped automatically when opened as a local file (file://).
     ---------------------------------------------------------- */
  function registerServiceWorker() {
    if (location.protocol === "file:") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  }

  /* ----------------------------------------------------------
     Populate the page with text/content from CONFIG
     ---------------------------------------------------------- */
  function applyConfig() {
    const c = window.CONFIG || {};

    setText("envelope-to", "To: " + (c.envelope?.toLine || c.names?.to || ""));
    setText("envelope-from", "From: " + (c.envelope?.fromLine || c.names?.from || ""));
    setText("envelope-hint", c.envelope?.openHint);

    setText("greeting", c.letter?.greeting);
    const para = document.getElementById("letter-paragraphs");
    if (para && Array.isArray(c.letter?.paragraphs)) {
      para.innerHTML = "";
      c.letter.paragraphs.forEach((p) => {
        const el = document.createElement("p");
        el.textContent = p;
        para.appendChild(el);
      });
    }

    setText("story-title", c.sectionTitles?.story);
    setText("listen-title", c.sectionTitles?.listen);
    setText("watch-title", c.sectionTitles?.watch);
    setText("gallery-title", c.sectionTitles?.gallery);

    const timeline = document.getElementById("timeline");
    if (timeline && Array.isArray(c.memories)) {
      timeline.innerHTML = "";
      c.memories.forEach((m) => {
        const card = document.createElement("div");
        card.className = "memory-card reveal";
        card.innerHTML = `
          <figure class="polaroid">
            <img src="${escapeAttr(m.image)}" alt="${escapeAttr(m.date || "")}" loading="lazy">
          </figure>
          <div class="memory-text">
            <span class="memory-date">${escapeHtml(m.date || "")}</span>
            <p class="memory-caption">${escapeHtml(m.caption || "")}</p>
          </div>`;
        timeline.appendChild(card);
      });
    }

    setText("audio-title", c.audio?.title);
    setText("audio-subtitle", c.audio?.subtitle);
    const bgAudio = document.getElementById("bg-audio");
    if (bgAudio && c.audio?.src) bgAudio.src = c.audio.src;

    setText("video-caption", c.video?.caption);
    const video = document.getElementById("message-video");
    if (video) {
      if (c.video?.src) video.src = c.video.src;
      if (c.video?.poster) video.poster = c.video.poster;
    }

    const collage = document.getElementById("collage");
    if (collage && Array.isArray(c.gallery)) {
      collage.innerHTML = "";
      c.gallery.forEach((g) => {
        const fig = document.createElement("figure");
        fig.className = "polaroid";
        fig.innerHTML = `
          <img src="${escapeAttr(g.image)}" alt="${escapeAttr(g.caption || "")}" loading="lazy">
          <figcaption>${escapeHtml(g.caption || "")}</figcaption>`;
        fig.addEventListener("click", () => openLightbox(g.image, g.caption));
        collage.appendChild(fig);
      });
    }

    setText("signoff", c.letter?.signature);
    setText("signoff-name", c.names?.from);
    setText("question-heading", c.question?.heading);
    setText("question-subtext", c.question?.subtext);
    setText("yes-label", c.question?.yesLabel || "Yes");
    setText("no-label", c.question?.noLabel || "Not yet");

    setText("celebration-heading", c.celebration?.heading);
    setText("celebration-message", c.celebration?.message);
    setText("celebration-signature", c.celebration?.signature);

    document.title = "For " + (c.names?.to || "you");
  }

  function setText(id, value) {
    if (value === undefined || value === null) return;
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (s) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[s]));
  }
  function escapeAttr(str) { return escapeHtml(str); }

  /* ----------------------------------------------------------
     Envelope open interaction
     ---------------------------------------------------------- */
  function setupEnvelope() {
    const btn = document.getElementById("open-envelope-btn");
    const envelope = document.getElementById("envelope");
    const screen = document.getElementById("envelope-screen");
    const letter = document.getElementById("letter");
    if (!btn || !envelope || !screen || !letter) return;

    btn.addEventListener("click", () => {
      if (envelope.classList.contains("is-open")) return;
      envelope.classList.add("is-open");

      // Try to start the background song on this real user gesture,
      // since browsers block autoplay without interaction.
      tryStartMusic();

      setTimeout(() => {
        screen.classList.add("is-leaving");
        setTimeout(() => {
          screen.style.display = "none";
          letter.hidden = false;
          window.scrollTo(0, 0);
          setupScrollReveal(true); // re-check what's already in view
        }, 700);
      }, 750);
    });
  }

  /* ----------------------------------------------------------
     Scroll-reveal for sections and memory cards
     ---------------------------------------------------------- */
  let revealObserver = null;
  function setupScrollReveal(rescan) {
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.18 }
      );
    }
    document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
      revealObserver.observe(el);
    });
    if (rescan) {
      // Elements already in the viewport won't fire until they cross
      // the threshold again, so nudge anything currently visible.
      document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) el.classList.add("is-visible");
      });
    }
  }

  /* ----------------------------------------------------------
     Background music (floating toggle) + the "listen" player
     share the same <audio> element so the song doesn't restart.
     ---------------------------------------------------------- */
  const audioState = { started: false };

  function tryStartMusic() {
    const audio = document.getElementById("bg-audio");
    const toggle = document.getElementById("music-toggle");
    if (!audio || !audio.src) return;
    audio.play().then(() => {
      audioState.started = true;
      toggle?.setAttribute("aria-pressed", "true");
      syncPlayerCardUI(true);
    }).catch(() => { /* browser blocked it; the floating button still works */ });
  }

  function setupAudioPlayer() {
    const audio = document.getElementById("bg-audio");
    const toggle = document.getElementById("music-toggle");
    const playBtn = document.getElementById("audio-play-btn");
    const track = document.getElementById("audio-progress-track");
    const fill = document.getElementById("audio-progress-fill");
    const time = document.getElementById("audio-time");
    const card = document.querySelector(".player-card");
    if (!audio) return;

    toggle?.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    });

    playBtn?.addEventListener("click", () => {
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    });

    audio.addEventListener("play", () => syncPlayerCardUI(true));
    audio.addEventListener("pause", () => syncPlayerCardUI(false));

    audio.addEventListener("timeupdate", () => {
      if (!audio.duration) return;
      const pct = (audio.currentTime / audio.duration) * 100;
      if (fill) fill.style.width = pct + "%";
      if (time) time.textContent = formatTime(audio.currentTime);
    });

    track?.addEventListener("click", (e) => {
      if (!audio.duration) return;
      const rect = track.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pct * audio.duration;
    });

    function syncPlayerCardUI(isPlaying) {
      toggle?.setAttribute("aria-pressed", String(isPlaying));
      toggle?.setAttribute("aria-label", isPlaying ? "Pause our song" : "Play our song");
      playBtn?.classList.toggle("is-playing", isPlaying);
      card?.classList.toggle("is-playing", isPlaying);
    }
    // expose for tryStartMusic()
    window.__syncPlayerCardUI = syncPlayerCardUI;
  }
  // patch tryStartMusic to reuse the same sync fn once defined
  const _origTryStartMusic = tryStartMusic;
  tryStartMusic = function () {
    _origTryStartMusic();
    if (window.__syncPlayerCardUI) window.__syncPlayerCardUI(true);
  };

  function formatTime(sec) {
    sec = Math.floor(sec || 0);
    const m = Math.floor(sec / 60);
    const s = String(sec % 60).padStart(2, "0");
    return m + ":" + s;
  }

  /* ----------------------------------------------------------
     Video player (simple play-button overlay)
     ---------------------------------------------------------- */
  function setupVideoPlayer() {
    const video = document.getElementById("message-video");
    const btn = document.getElementById("video-play-btn");
    if (!video || !btn) return;

    btn.addEventListener("click", () => {
      video.play();
    });
    video.addEventListener("play", () => btn.classList.add("is-hidden"));
    video.addEventListener("pause", () => btn.classList.remove("is-hidden"));
    video.addEventListener("ended", () => btn.classList.remove("is-hidden"));
  }

  /* ----------------------------------------------------------
     Gallery lightbox
     ---------------------------------------------------------- */
  function setupGalleryLightbox() {
    const closeBtn = document.getElementById("lightbox-close");
    const lightbox = document.getElementById("lightbox");
    closeBtn?.addEventListener("click", closeLightbox);
    lightbox?.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
  }
  function openLightbox(src, caption) {
    const lightbox = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    const cap = document.getElementById("lightbox-caption");
    if (!lightbox || !img) return;
    img.src = src;
    img.alt = caption || "";
    if (cap) cap.textContent = caption || "";
    lightbox.hidden = false;
  }
  function closeLightbox() {
    const lightbox = document.getElementById("lightbox");
    if (lightbox) lightbox.hidden = true;
  }

  /* ----------------------------------------------------------
     The question: dodging "Not yet" + "Yes" celebration
     ---------------------------------------------------------- */
  function setupQuestion() {
    const noBtn = document.getElementById("no-btn");
    const yesBtn = document.getElementById("yes-btn");
    const actions = document.querySelector(".question-actions");
    const c = window.CONFIG || {};
    const teasingLines = c.question?.noTeasingLines || [];
    let dodgeCount = 0;

    function dodge() {
      if (!noBtn || !actions) return;
      const btnRect = noBtn.getBoundingClientRect();

      noBtn.classList.add("is-dodging");

      const maxX = Math.max(window.innerWidth - btnRect.width - 16, 16);
      const maxY = Math.max(window.innerHeight - btnRect.height - 16, 16);
      const x = Math.random() * maxX;
      const y = Math.random() * maxY;
      noBtn.style.left = x + "px";
      noBtn.style.top = y + "px";

      if (teasingLines.length) {
        const label = document.getElementById("no-label");
        if (label) label.textContent = teasingLines[dodgeCount % teasingLines.length];
      }
      dodgeCount++;
    }

    noBtn?.addEventListener("mouseenter", dodge);
    noBtn?.addEventListener("click", dodge);
    noBtn?.addEventListener("touchstart", (e) => { e.preventDefault(); dodge(); }, { passive: false });

    yesBtn?.addEventListener("click", () => {
      showCelebration();
    });
  }

  /* ----------------------------------------------------------
     Celebration screen + confetti
     ---------------------------------------------------------- */
  function showCelebration() {
    const overlay = document.getElementById("celebration");
    const bgAudio = document.getElementById("bg-audio");
    if (!overlay) return;
    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    if (bgAudio && bgAudio.paused) bgAudio.play().catch(() => {});
    runConfetti();
  }

  function runConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width, height;
    function resize() {
      width = canvas.width = canvas.offsetWidth * devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#8b2635", "#c97b84", "#b08d57", "#f3e9d4", "#6c1c28"];
    const pieces = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: -20 - Math.random() * height,
      size: (6 + Math.random() * 8) * devicePixelRatio,
      speed: (1 + Math.random() * 2.4) * devicePixelRatio,
      drift: (Math.random() - 0.5) * 1.6 * devicePixelRatio,
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.12,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: Math.random() < 0.5 ? "heart" : "paper"
    }));

    let frame = 0;
    const maxFrames = 60 * 6; // ~6s

    function drawHeart(x, y, size, color, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = color;
      ctx.beginPath();
      const s = size / 2;
      ctx.moveTo(0, s * 0.3);
      ctx.bezierCurveTo(0, -s * 0.4, -s, -s * 0.4, -s, s * 0.1);
      ctx.bezierCurveTo(-s, s * 0.6, 0, s * 0.9, 0, s * 1.2);
      ctx.bezierCurveTo(0, s * 0.9, s, s * 0.6, s, s * 0.1);
      ctx.bezierCurveTo(s, -s * 0.4, 0, -s * 0.4, 0, s * 0.3);
      ctx.fill();
      ctx.restore();
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);
      pieces.forEach((p) => {
        p.y += p.speed;
        p.x += p.drift;
        p.rotation += p.spin;
        if (p.y > height + 20) { p.y = -20; p.x = Math.random() * width; }
        if (p.shape === "heart") {
          drawHeart(p.x, p.y, p.size, p.color, p.rotation);
        } else {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
          ctx.restore();
        }
      });
      frame++;
      if (frame < maxFrames) {
        requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }
    tick();
  }
})();
