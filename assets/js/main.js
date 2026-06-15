// 10BIT — home page

const heroEl = document.querySelector(".hero");
const navEl = document.querySelector(".nav");
const fabEl = document.querySelector(".fab");
const coverGridEl = document.getElementById("coverGrid");

const updateReveal = () => {
  if (!heroEl) return;
  const rect = heroEl.getBoundingClientRect();
  const vh = Math.max(1, window.innerHeight || 1);
  const start = vh * 0.70;
  const end = vh * 0.20;
  const t = (start - rect.bottom) / (start - end);
  const reveal = Math.min(1, Math.max(0, t));
  document.documentElement.style.setProperty("--covers-reveal", reveal.toFixed(4));
  if (coverGridEl) coverGridEl.classList.toggle("is-active", reveal > 0.12);
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
  "NOTHING.png",
  "BUBLE.jpg",
  "CASIO.png",
  "COCTAIL.png",
  "LA MORTADELA.png",
  "LAPOCHKA.png",
  "MEDOLUBOV.png",
  "NATURAL_CREAM.png",
  "SHYUM.png",
  "STOP_MOTION.png",
];

const videoFiles = [
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

  coverFiles.forEach((file) => {
    const title = titleFromFilename(file);
    const slug = slugify(title);
    const hasVideo = videoKeySet.has(keyNormalize(title));

    const tile = document.createElement(hasVideo ? "a" : "div");
    tile.className = hasVideo ? "tile" : "tile tile--disabled";
    if (hasVideo) tile.href = encodeURI(`p/${slug}/`);

    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = `${title} cover`;
    img.src = encodeURI(`covers/${file}`);

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
