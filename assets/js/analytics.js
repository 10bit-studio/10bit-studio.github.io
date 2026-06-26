// Privacy-friendly analytics (GoatCounter) — no cookies, ~3.5 KB
(() => {
  if (localStorage.getItem("doNotTrack") || sessionStorage.getItem("doNotTrack")) return;

  const script = document.createElement("script");
  script.defer = true;
  script.src = "https://gc.zgo.at/count.js";
  script.setAttribute("data-goatcounter", "https://10bitpage1.goatcounter.com/count");
  document.body.appendChild(script);
})();
