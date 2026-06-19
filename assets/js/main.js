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

const coverGrid = document.getElementById("coverGrid");
if (coverGrid) {
  const videoKeySet = new Set(videoFiles.map((f) => keyNormalize(titleFromFilename(f))));

  coverFiles.forEach((file, index) => {
    const title = displayTitleFromCover(file);
    const slug = slugify(title);
    const hasVideo = videoKeySet.has(projectKeyFromCover(file));

    const tile = document.createElement(hasVideo ? "a" : "div");
    tile.className = hasVideo ? "tile reveal" : "tile tile--disabled reveal";
    tile.style.transitionDelay = `${index * 0.045}s`;
    if (hasVideo) tile.href = encodeURI(`p/${slug}/`);

    const img = document.createElement("img");
    img.decoding = "async";
    img.loading = index < 4 ? "eager" : "lazy";
    if (index < 4) img.fetchPriority = "high";
    img.alt = `${title} cover`;
    img.src = encodeURI(`covers/thumbs/${file.replace(/\.[^.]+$/, ".jpg")}`);

    const label = document.createElement("span");
    label.className = "tile-label";
    const labelInner = document.createElement("span");
    labelInner.className = "tile-label-inner";
    labelInner.textContent = title;
    label.appendChild(labelInner);

    tile.appendChild(img);
    tile.appendChild(label);
    coverGrid.appendChild(tile);
  });
}

document.querySelectorAll(".tile.reveal").forEach((el) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.classList.add("is-visible");
    return;
  }
  const tileObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        tileObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -4% 0px" }
  );
  tileObserver.observe(el);
});

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
