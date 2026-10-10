const launchButton = document.getElementById("launch");
const launchOverlay = document.getElementById("launch-overlay");

if (launchButton && launchOverlay) {
  launchButton.addEventListener("click", () => {
    try { sessionStorage.setItem("solar-arrival", "1"); } catch (_) {}
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.location.assign("sistema-solar.html");
      return;
    }
    launchButton.disabled = true;
    launchOverlay.setAttribute("aria-hidden", "false");
    launchOverlay.classList.add("active");
    document.querySelectorAll("#nav, main, #footer").forEach(element => { element.inert = true; });
    launchOverlay.focus();
    window.setTimeout(() => window.location.assign("sistema-solar.html"), 1700);
  });
}
