// MP4 sources + portrait sizing for project pages (GitHub Pages serves LFS pointers locally)
(() => {
  const CDN = "https://media.githubusercontent.com/media/10bit-studio/10bit-studio.github.io/main/projects/";

  const applyFrameAspect = (frame, w, h) => {
    if (!w || !h) return;
    const portrait = h > w;
    frame.classList.toggle("video-frame--portrait", portrait);
    frame.style.aspectRatio = `${w} / ${h}`;
    if (portrait) {
      frame.style.maxHeight = "min(85vh, 920px)";
      frame.style.width = `min(100%, calc(85vh * ${w} / ${h}))`;
    }
  };

  document.querySelectorAll(".video-frame video").forEach((video) => {
    const frame = video.closest(".video-frame");
    if (!frame) return;

    const localSource = video.querySelector('source[src*="projects/"]');
    if (localSource) {
      const file = localSource.getAttribute("src").split("/").pop();
      const cdnSource = document.createElement("source");
      cdnSource.src = `${CDN}${file}`;
      cdnSource.type = "video/mp4";
      video.insertBefore(cdnSource, localSource);
    }

    video.addEventListener(
      "loadedmetadata",
      () => applyFrameAspect(frame, video.videoWidth, video.videoHeight),
      { once: true }
    );
    video.load();
  });
})();
