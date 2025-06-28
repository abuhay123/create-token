document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");
  const menuButton = document.getElementById("menuButton");
  const closeMenu = document.getElementById("closeMenu");

  const existingWalletBtn = document.getElementById("existingWalletBtn");
  const walletInputContainer = document.getElementById("walletInputContainer");

  // פותח תפריט
  if (menuButton) {
    menuButton.addEventListener("click", () => {
      menu.classList.add("open");
    });
  }

  // סוגר תפריט
  if (closeMenu) {
    closeMenu.addEventListener("click", () => {
      menu.classList.remove("open");
    });
  }

  // הצגת שדה ייבוא ארנק
  if (existingWalletBtn && walletInputContainer) {
    existingWalletBtn.addEventListener("click", () => {
      walletInputContainer.classList.toggle("hidden");
      walletInputContainer.scrollIntoView({ behavior: "smooth" });
    });
  }
});
