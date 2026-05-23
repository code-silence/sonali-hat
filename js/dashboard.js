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
// Sidebar theke onno view te switch korar jonno
function switchDashboardView(viewId) {
  // Sob view hide kora
  const views = document.querySelectorAll(".dashboard-view");
  views.forEach((view) => {
    view.classList.remove("active-view");
    view.classList.add("hidden-view");
  });

  // Select kora view ta show kora
  const activeView = document.getElementById(viewId);
  if (activeView) {
    activeView.classList.remove("hidden-view");
    activeView.classList.add("active-view");
  }
}

// --- Reusable Dynamic Toast Function ---
function showToast(title, message, type = "success") {
  const toast = document.getElementById("dynamicToast");
  const toastTitle = document.getElementById("toastTitle");
  const toastText = document.getElementById("toastText");
  const toastIcon = document.getElementById("toastIcon");

  // Reset previous classes
  toast.className = "toast-notification show";
  toastIcon.className = "toast-icon fa-solid";

  // Set dynamic text
  toastTitle.innerText = title;
  toastText.innerText = message;

  // Set specific icon and color based on type
  if (type === "success") {
    toastIcon.classList.add("fa-circle-check");
  } else if (type === "info") {
    toast.classList.add("info");
    toastIcon.classList.add("fa-circle-info");
  } else if (type === "error") {
    toast.classList.add("error");
    toastIcon.classList.add("fa-trash-can");
  }

  // Auto hide after 3 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// --- Add Product Form Submit Logic ---
document
  .getElementById("addProductForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("pName").value;
    const weight = document.getElementById("pWeight").value;
    const category = document.getElementById("pCategory").value;
    const price = document.getElementById("pPrice").value;
    const location = document.getElementById("pLocation").value;
    const seller = document.getElementById("pSeller").value;

    const imageInput = document.getElementById("pImage");
    const imageFile = imageInput.files[0];

    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);

      const productCard = `
            <div class="product-card">
                <img src="${imageUrl}" alt="${name}" style="width: 100%; height: 200px; object-fit: cover;">
                <div class="product-details">
                    <span class="category-tag">${category}</span>
                    <h3>${name}</h3>
                    <p class="seller-info"><i class="fa-solid fa-location-dot"></i> ${location} | <i class="fa-solid fa-user"></i> ${seller}</p>
                    <p class="package-info">প্যাকেজ: ${weight}</p>
                    <div class="price-action" style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f1f5f9; padding-top: 15px; margin-top: 10px;">
                        <span class="price">৳ ${price}</span>
                        <div class="action-buttons" style="display: flex; gap: 8px;">
                            <button onclick="editProduct(this, '${name}', '${weight}', '${category}', '${price}', '${location}', '${seller}')" style="background:#e8f5e9; color:#2d6a4f; border:none; width: 35px; height: 35px; border-radius:5px; cursor:pointer; transition:0.3s;" title="Edit">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button onclick="deleteProduct(this)" style="background:#ffebee; color:#d32f2f; border:none; width: 35px; height: 35px; border-radius:5px; cursor:pointer; transition:0.3s;" title="Delete">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

      document.getElementById("myProductList").innerHTML += productCard;
      this.reset();

      // Custom Success Toast
      showToast(
        "সফল হয়েছে!",
        "আপনার পণ্যটি তালিকায় সফলভাবে যোগ করা হয়েছে।",
        "success",
      );

      setTimeout(() => {
        switchDashboardView("myProductsView");
      }, 1000);
    }
  });

// --- Edit Product Function (পুরোপুরি অ্যালার্ট মুক্ত) ---
function editProduct(buttonElement, name, weight, category, price, location, seller) {
  // ফর্মের ফিল্ডগুলোতে আগের ডেটা বসিয়ে দেওয়া
  document.getElementById("pName").value = name;
  document.getElementById("pWeight").value = weight;
  document.getElementById("pCategory").value = category;
  document.getElementById("pPrice").value = price;
  document.getElementById("pLocation").value = location;
  document.getElementById("pSeller").value = seller;

  // ইউজারকে ফর্ম ভিউতে নিয়ে যাওয়া
  switchDashboardView("addProductView");

  // আগের কার্ডটি মুছে ফেলা, যাতে সেভ করলে আপডেট হয়
  buttonElement.closest(".product-card").remove();

  // এখানে কোনো alert() বা showToast() থাকবে না!
}

// --- Delete Product Logic with Custom Modal ---
let productToDelete = null;

function deleteProduct(buttonElement) {
  productToDelete = buttonElement.closest(".product-card");
  document.getElementById("deleteModal").classList.remove("hidden-modal"); // Show Modal
}

function closeDeleteModal() {
  productToDelete = null;
  document.getElementById("deleteModal").classList.add("hidden-modal"); // Hide Modal
}

document
  .getElementById("confirmDeleteBtn")
  .addEventListener("click", function () {
    if (productToDelete) {
      productToDelete.remove();
      closeDeleteModal();

      // Custom Error/Delete Toast
      showToast(
        "মুছে ফেলা হয়েছে",
        "পণ্যটি তালিকা থেকে সফলভাবে ডিলিট করা হয়েছে।",
        "error",
      );
    }
  });
