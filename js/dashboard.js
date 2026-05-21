// Toggle the sidebar open and closed for smaller screens.
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("active");
}

// Switch between seller and buyer dashboard views.
function toggleDashboardMode() {
  const sellerDashboard = document.getElementById("sellerDashboard");
  const buyerDashboard = document.getElementById("buyerDashboard");

  const modeText = document.getElementById("modeText");
  const roleBadge = document.getElementById("roleBadge");

  const sellerItems = document.querySelectorAll(".seller-item");
  const buyerItems = document.querySelectorAll(".buyer-item");

  if (sellerDashboard.classList.contains("active-view")) {
    // Currently in seller view: switch to buyer view.
    sellerDashboard.classList.remove("active-view");
    sellerDashboard.classList.add("hidden-view");
    buyerDashboard.classList.remove("hidden-view");
    buyerDashboard.classList.add("active-view");

    modeText.innerText = "Switch to Selling";
    roleBadge.innerText = "ক্রেতা (Buyer)";
    roleBadge.classList.add("buyer-badge");

    sellerItems.forEach((item) => item.classList.add("hidden-view"));
    buyerItems.forEach((item) => item.classList.remove("hidden-view"));
  } else {
    // Currently in buyer view: switch to seller view.
    buyerDashboard.classList.remove("active-view");
    buyerDashboard.classList.add("hidden-view");
    sellerDashboard.classList.remove("hidden-view");
    sellerDashboard.classList.add("active-view");

    modeText.innerText = "Switch to Buying";
    roleBadge.innerText = "কৃষক (Seller)";
    roleBadge.classList.remove("buyer-badge");

    buyerItems.forEach((item) => item.classList.add("hidden-view"));
    sellerItems.forEach((item) => item.classList.remove("hidden-view"));
  }
}
