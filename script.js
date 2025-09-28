function bookNow() {
  document.getElementById("confirmation").classList.remove("hidden");
}
document.getElementById("team-toggle").addEventListener("click", function () {
  const info = document.getElementById("team-info");
  info.classList.toggle("hidden");
});
