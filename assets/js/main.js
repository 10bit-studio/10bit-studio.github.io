// Nikita Korablev — home page

const heroEl = document.querySelector(".hero");
const navEl = document.querySelector(".nav");
const fabEl = document.querySelector(".fab");
const coverGridEl = document.getElementById("coverGrid");
const workEl = document.getElementById("work");

const updateReveal = () => {
  if (!heroEl) return;
  const rect = heroEl.getBoundingClientRect();
  const vh = Math.max(1, window.innerHeight || 1);
  const start = vh * 0.70;
  const end = vh * 0.20;
  const t = (start - rect.bottom) / (start - end);
  const reveal = Math.min(1, Math.max(0, t));
  document.documentElement.style.setProperty("--covers-reveal", reveal.toFixed(4));

  if (coverGridEl && workEl) {
    const workRect = workEl.getBoundingClientRect();
    const workVisible = workRect.top < vh * 0.92;
    coverGridEl.classList.toggle("is-active", workVisible);
  }
};

const updateNav = () => {
  if (navEl) navEl.classList.toggle("nav--scrolled", window.scrollY > 40);
  if (fabEl) fabEl.classList.toggle("visible", window.scrollY > window.innerHeight * 0.5);
};

window.addEventListener("scroll", () => {
  updateReveal();
  updateNav();
}, { passive: true });

window.addEventListener("resize", () => {
  updateReveal();
  updateNav();
});

updateReveal();
updateNav();

const coverFiles = [
  "SHOWREEL_v2.jpg",
  "BEAUTY_v2.jpg",
  "FOOT.jpg",
  "NOTHING.jpg",
  "BUBLE.jpg",
  "CASIO.jpg",
  "COCTAIL.jpg",
  "LA MORTADELA.jpg",
  "LAPOCHKA.jpg",
  "MEDOLUBOV.jpg",
  "NATURAL_CREAM.jpg",
  "SHYUM.jpg",
  "STOP_MOTION.jpg",
];

const videoFiles = [
  "SHOWREEL.mp4",
  "BEAUTY.mp4",
  "FOOT.mp4",
  "CASIO.mp4",
  "COCTAIL.mp4",
  "LA_MORTADELA.mp4",
  "LAPOCHKA.mp4",
  "MEDOLUBOV.mp4",
  "NOTHING.mp4",
  "STOP_MOTION.mp4",
];

const titleFromFilename = (filename) => {
  const noExt = filename.replace(/\.[^.]+$/, "");
  return noExt
    .replaceAll("_", " ")
    .replace(/\btag\b/gi, "")
    .replace(/\bтег\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
};

const projectKeyFromCover = (filename) => {
  const base = filename.replace(/\.[^.]+$/, "").replace(/_(LAST|COVER|V\d+)$/i, "");
  return keyNormalize(titleFromFilename(`${base}.jpg`));
};

const displayTitleFromCover = (filename) => {
  const base = filename.replace(/\.[^.]+$/, "").replace(/_(LAST|COVER|V\d+)$/i, "");
  return titleFromFilename(`${base}.jpg`);
};

const keyNormalize = (s) => String(s).replace(/[\s_]+/g, "").toUpperCase();

const slugify = (title) => {
  const s = title
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^-\p{L}\p{N}]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || "project";
};

const createImageLoader = (maxConcurrent = 2) => {
  const queue = [];
  let active = 0;

  const pump = () => {
    while (active < maxConcurrent && queue.length) {
      const job = queue.shift();
      active += 1;
      job(() => {
        active -= 1;
        pump();
      });
    }
  };

  return (job) => {
    queue.push(job);
    pump();
  };
};

const enqueueImage = createImageLoader(2);

const loadTileImage = (img, src, { priority = false } = {}) => {
  const run = (done) => {
    img.addEventListener(
      "load",
      () => {
        img.classList.add("is-loaded");
        done();
      },
      { once: true }
    );
    img.addEventListener("error", done, { once: true });
    img.src = src;
  };

  if (priority) run(() => {});
  else enqueueImage(run);
};

const VIDEO_BASE =
  "https://media.githubusercontent.com/media/10bit-studio/10bit-studio.github.io/main/projects/";

const getVideoForCover = (file) => {
  const key = projectKeyFromCover(file);
  if (key === "NOTHING") {
    return {
      type: "vimeo",
      src: "https://player.vimeo.com/video/1163975641?title=0&byline=0&portrait=0",
    };
  }
  const match = videoFiles.find((f) => keyNormalize(titleFromFilename(f)) === key);
  if (!match) return null;
  return { type: "mp4", src: `${VIDEO_BASE}${match}` };
};

const initVideoLightbox = () => {
  const lightbox = document.getElementById("videoLightbox");
  const frame = document.getElementById("videoLightboxFrame");
  const titleEl = document.getElementById("videoLightboxTitle");
  if (!lightbox || !frame || !titleEl) return;

  let lastFocus = null;

  const closeLightbox = () => {
    frame.innerHTML = "";
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    if (lastFocus) lastFocus.focus();
  };

  const openLightbox = (title, video) => {
    if (!video) return;
    lastFocus = document.activeElement;
    titleEl.textContent = title;
    frame.innerHTML = "";

    if (video.type === "vimeo") {
      const iframe = document.createElement("iframe");
      iframe.src = `${video.src}&autoplay=1`;
      iframe.allow = "autoplay; fullscreen; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.title = title;
      frame.appendChild(iframe);
    } else {
      const videoEl = document.createElement("video");
      videoEl.controls = true;
      videoEl.playsInline = true;
      videoEl.preload = "auto";
      videoEl.src = video.src;
      videoEl.addEventListener("error", () => {
        frame.innerHTML = `<p class="video-lightbox__error">Video failed to load. <a href="${video.src}" target="_blank" rel="noopener noreferrer">Open file</a></p>`;
      });
      frame.appendChild(videoEl);
      videoEl.play().catch(() => {});
    }

    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
    requestAnimationFrame(() => lightbox.classList.add("is-open"));
    lightbox.querySelector(".video-lightbox__close")?.focus();
  };

  lightbox.addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) closeLightbox();
  });

  return { openLightbox, closeLightbox };
};

const initCoverGrid = async () => {
  const coverGrid = document.getElementById("coverGrid");
  if (!coverGrid) return;

  let manifest = {};
  try {
    const response = await fetch("assets/covers-manifest.json");
    if (response.ok) manifest = await response.json();
  } catch {
    manifest = {};
  }

  const lazyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        const src = img.dataset.src;
        if (!src || img.dataset.loaded) return;
        img.dataset.loaded = "1";
        loadTileImage(img, src);
        lazyObserver.unobserve(img);
      });
    },
    { rootMargin: "280px 0px", threshold: 0.01 }
  );

  const { openLightbox } = initVideoLightbox();

  coverFiles.forEach((file, index) => {
    const title = displayTitleFromCover(file);
    const video = getVideoForCover(file);
    const hasVideo = Boolean(video);
    const meta = manifest[file] || {};
    const thumbSrc = encodeURI(`covers/${meta.thumb || `thumbs/${file}`}`);

    const tile = document.createElement(hasVideo ? "button" : "div");
    tile.className = hasVideo ? "tile" : "tile tile--disabled";
    tile.type = hasVideo ? "button" : undefined;
    if (hasVideo) {
      tile.addEventListener("click", () => openLightbox(title, video));
    }

    const media = document.createElement("div");
    media.className = "tile-media";
    if (meta.w && meta.h) media.style.aspectRatio = `${meta.w} / ${meta.h}`;
    if (meta.lqip) {
      media.style.backgroundImage = `url("${meta.lqip}")`;
      media.style.backgroundSize = "cover";
      media.style.backgroundPosition = "center";
    }

    const img = document.createElement("img");
    img.decoding = "async";
    img.alt = `${title} cover`;
    img.dataset.src = thumbSrc;

    const label = document.createElement("span");
    label.className = "tile-label";
    const labelInner = document.createElement("span");
    labelInner.className = "tile-label-inner";
    labelInner.textContent = title;
    label.appendChild(labelInner);

    media.appendChild(img);
    tile.appendChild(media);
    tile.appendChild(label);
    coverGrid.appendChild(tile);

    if (index < 3) {
      img.dataset.loaded = "1";
      loadTileImage(img, thumbSrc, { priority: true });
    } else {
      lazyObserver.observe(img);
    }
  });
};

initCoverGrid();

document.querySelectorAll('a[href="#work"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

document.querySelectorAll('a[href="#contacts"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});
