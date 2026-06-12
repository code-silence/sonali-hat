// সাইডবার মেনু থেকে ক্লিক করলে সরাসরি ভিউ ওপেন করার লজিক
document.querySelectorAll(".sidebar-menu li a").forEach((link) => {
  link.addEventListener("click", function (e) {
    if (this.classList.contains("logout-btn")) return;

    // ক্লিক করা লিংকের data-view অ্যাট্রিবিউট থেকে ভিউ আইডি পাওয়া
    const targetView = this.getAttribute("data-view");
    if (targetView) {
      switchDashboardView(targetView);
    }

    // মেনু অ্যাকটিভ করা
    document
      .querySelectorAll(".sidebar-menu li")
      .forEach((li) => li.classList.remove("active"));
    this.parentElement.classList.add("active");

    if (window.innerWidth <= 992) toggleSidebar();
  });
});
// ==================================================
// 1. UI Toggles & Navigation
// ==================================================
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
}

function toggleDashboardMode() {
  const sellerDashboard = document.getElementById("sellerDashboard");
  const buyerDashboard = document.getElementById("buyerDashboard");
  const modeText = document.getElementById("modeText");
  const roleBadge = document.getElementById("roleBadge");
  const sellerItems = document.querySelectorAll(".seller-item");
  const buyerItems = document.querySelectorAll(".buyer-item");

  if (sellerDashboard.classList.contains("active-view")) {
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

function switchDashboardView(viewId) {
  const views = document.querySelectorAll(".dashboard-view");
  views.forEach((view) => {
    view.classList.remove("active-view");
    view.classList.add("hidden-view");
  });
  const activeView = document.getElementById(viewId);
  if (activeView) {
    activeView.classList.remove("hidden-view");
    activeView.classList.add("active-view");
  }

  if (viewId !== "addProductView") {
    resetAddProductForm();
  }
}

document.querySelectorAll(".sidebar-menu li a").forEach((link) => {
  link.addEventListener("click", function (e) {
    if (this.classList.contains("logout-btn")) return;
    document.querySelectorAll(".sidebar-menu li").forEach((li) => {
      li.classList.remove("active");
    });
    this.parentElement.classList.add("active");
    if (window.innerWidth <= 992) {
      toggleSidebar();
    }
  });
});

// ==================================================
// 2. Dynamic Toast Notification
// ==================================================
function showToast(title, message, type = "success") {
  const toast = document.getElementById("dynamicToast");
  const toastTitle = document.getElementById("toastTitle");
  const toastText = document.getElementById("toastText");
  const toastIcon = document.getElementById("toastIcon");

  toast.className = "toast-notification show";
  toastIcon.className = "toast-icon fa-solid";
  toastTitle.innerText = title;
  toastText.innerText = message;

  if (type === "success") {
    toastIcon.classList.add("fa-circle-check");
    toast.style.borderLeftColor = "#2d6a4f";
  } else if (type === "info") {
    toast.classList.add("info");
    toastIcon.classList.add("fa-circle-info");
    toast.style.borderLeftColor = "#1976d2";
  } else if (type === "error") {
    toast.classList.add("error");
    toastIcon.classList.add("fa-trash-can");
    toast.style.borderLeftColor = "#d32f2f";
  }

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

// ==================================================
// 3. ImgBB Helper Function
// ==================================================
async function uploadProductImageToImgBB(imageFile) {
  const IMGBB_API_KEY = "50e321961cde194d90cbf941cd472015";
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      {
        method: "POST",
        body: formData,
      },
    );
    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error("Upload failed");
    }
  } catch (error) {
    console.error("ImgBB Error:", error);
    return null;
  }
}

// ==================================================
// 4. Add or Update Product in Firestore
// ==================================================
let editingProductId = null;
let existingImageUrl = null;

document
  .getElementById("addProductForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    if (!window.firebaseDb || !window.firebaseAuth || !window.firebaseSetDoc) {
      showToast("এরর!", "ফায়ারবেস কানেক্ট হয়নি! পেজ রিলোড দিন।", "error");
      return;
    }

    const user = window.firebaseAuth.currentUser;
    if (!user) {
      showToast("সতর্কতা!", "আপনাকে আগে লগইন করতে হবে।", "error");
      return;
    }

    const name = document.getElementById("pName").value;
    const weight = document.getElementById("pWeight").value;
    const price = document.getElementById("pPrice").value;
    const location = document.getElementById("pLocation").value;
    const seller = document.getElementById("pSeller").value;
    // নতুন বিবরণ ফিল্ড
    const description = document.getElementById("pDescription")
      ? document.getElementById("pDescription").value.trim()
      : "";
    const imageInput = document.getElementById("pImage");
    const imageFile = imageInput.files[0];

    if (!editingProductId && !imageFile) {
      showToast("সতর্কতা!", "দয়া করে পণ্যের ছবি দিন।", "error");
      return;
    }

    const submitBtn = this.querySelector(".btn-submit");
    submitBtn.innerText = "সার্ভারে সেভ হচ্ছে...";
    submitBtn.disabled = true;

    try {
      showToast("অপেক্ষা করুন", "তথ্য প্রসেস হচ্ছে...", "info");

      let imageUrl = existingImageUrl;

      if (imageFile) {
        imageUrl = await uploadProductImageToImgBB(imageFile);
        if (!imageUrl) throw new Error("Image upload failed");
      }

      const productData = {
        userId: user.uid,
        name: name,
        weight: weight,
        price: Number(price),
        location: location,
        sellerName: seller,
        description: description, // ডেটাবেসে বিবরণ সেভ হচ্ছে
        imageUrl: imageUrl,
      };

      if (editingProductId) {
        const productRef = window.firebaseDoc(
          window.firebaseDb,
          "products",
          editingProductId,
        );
        await window.firebaseSetDoc(productRef, productData, { merge: true });
        showToast(
          "আপডেট সম্পন্ন!",
          "পণ্যের তথ্য সফলভাবে আপডেট হয়েছে।",
          "success",
        );
      } else {
        productData.createdAt = new Date().toISOString();
        const productsRef = window.firebaseCollection(
          window.firebaseDb,
          "products",
        );
        await window.firebaseAddDoc(productsRef, productData);
        showToast("সফল হয়েছে!", "নতুন পণ্য সফলভাবে যোগ করা হয়েছে।", "success");
      }

      resetAddProductForm();
      loadMyProducts();
      setTimeout(() => switchDashboardView("myProductsView"), 1000);
    } catch (error) {
      console.error(error);
      showToast("ব্যর্থ!", "প্রসেস সম্পন্ন করতে সমস্যা হয়েছে।", "error");
      submitBtn.innerHTML = editingProductId
        ? 'তথ্য আপডেট করুন <i class="fa-solid fa-pen-to-square"></i>'
        : 'পণ্য সেভ করুন <i class="fa-solid fa-check"></i>';
      submitBtn.disabled = false;
    }
  });

function resetAddProductForm() {
  editingProductId = null;
  existingImageUrl = null;
  document.getElementById("addProductForm").reset();

  const imageInput = document.getElementById("pImage");
  if (imageInput) imageInput.required = true;

  const submitBtn = document.querySelector("#addProductForm .btn-submit");
  if (submitBtn) {
    submitBtn.innerHTML = 'পণ্য সেভ করুন <i class="fa-solid fa-check"></i>';
    submitBtn.disabled = false;
  }
}

// ==================================================
// 5. Fetch and Display Products
// ==================================================
async function loadMyProducts() {
  if (!window.firebaseDb || !window.firebaseAuth) return;
  const user = window.firebaseAuth.currentUser;
  if (!user) return;

  const productListContainer = document.getElementById("myProductList");
  productListContainer.innerHTML =
    '<p style="grid-column: 1 / -1; text-align: center;">আপনার পণ্যগুলো লোড হচ্ছে...</p>';

  try {
    const productsRef = window.firebaseCollection(
      window.firebaseDb,
      "products",
    );
    const q = window.firebaseQuery(
      productsRef,
      window.firebaseWhere("userId", "==", user.uid),
    );
    const querySnapshot = await window.firebaseGetDocs(q);

    productListContainer.innerHTML = "";

    if (querySnapshot.empty) {
      productListContainer.innerHTML =
        '<p style="grid-column: 1 / -1; text-align: center; color: #6c757d;">আপনি এখনো কোনো পণ্য যোগ করেননি।</p>';
      return;
    }

    querySnapshot.forEach((doc) => {
      const product = doc.data();
      const productId = doc.id;

      // বিবরণকে সুরক্ষিত করে কার্ডে পাঠানো হচ্ছে
      const safeDescForJS = product.description
        ? product.description
            .replace(/'/g, "\\'")
            .replace(/"/g, "&quot;")
            .replace(/\n/g, " ")
        : "";
      const displayDesc = product.description
        ? product.description.substring(0, 60) +
          (product.description.length > 60 ? "..." : "")
        : "কোনো বিবরণ দেওয়া হয়নি";

      const productCard = `
    <div class="product-card" id="card-${productId}" style="position: relative;">
        <i class="fa-regular fa-heart" onclick="toggleFavorite(this, '${productId}')" 
           style="position: absolute; top: 15px; right: 15px; cursor: pointer; font-size: 20px; color: #d32f2f; background: rgba(255,255,255,0.8); padding: 8px; border-radius: 50%; z-index: 10;"></i>
        
        <img src="${product.imageUrl}" alt="${product.name}" style="width: 100%; height: 200px; object-fit: cover;">
        <div class="product-details">
            <span class="category-tag">প্যাকেজ: ${product.weight}</span>
            <h3>${product.name}</h3>
            <p style="font-size: 0.85rem; color: #64748b; margin-top: 5px; margin-bottom: 10px; line-height: 1.4;">${displayDesc}</p>
            <p class="seller-info"><i class="fa-solid fa-location-dot"></i> ${product.location} | <i class="fa-solid fa-user"></i> ${product.sellerName}</p>
            
            <div class="price-action" style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #f1f5f9; padding-top: 15px; margin-top: 10px;">
                <span class="price">৳ ${product.price}</span>
                <div class="action-buttons" style="display: flex; gap: 8px;">
                    <button onclick="editProduct('${productId}', '${product.name}', '${product.weight}', '${product.price}', '${product.location}', '${product.sellerName}', '${product.imageUrl}', '${safeDescForJS}')" style="background:#e8f5e9; color:#2d6a4f; border:none; width: 35px; height: 35px; border-radius:5px; cursor:pointer;" title="Edit">
                        <i class="fa-solid fa-pen"></i>
                    </button>
                    <button onclick="deleteProduct('${productId}')" style="background:#ffebee; color:#d32f2f; border:none; width: 35px; height: 35px; border-radius:5px; cursor:pointer;" title="Delete">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
`;
      productListContainer.innerHTML += productCard;
    });
    updateHeartIcons();
  } catch (error) {
    console.error("Error loading products: ", error);
    productListContainer.innerHTML =
      '<p style="grid-column: 1 / -1; text-align: center; color: red;">পণ্য লোড করতে সমস্যা হয়েছে।</p>';
  }
}
// ==================================================
// 6. Delete & Edit Product Logic
// ==================================================
let targetDeleteId = null;

function deleteProduct(productId) {
  targetDeleteId = productId;
  document.getElementById("deleteModal").classList.remove("hidden-modal");
}

function closeDeleteModal() {
  targetDeleteId = null;
  document.getElementById("deleteModal").classList.add("hidden-modal");
}

document
  .getElementById("confirmDeleteBtn")
  .addEventListener("click", async function () {
    if (!targetDeleteId || !window.firebaseDb) return;

    try {
      await window.firebaseDeleteDoc(
        window.firebaseDoc(window.firebaseDb, "products", targetDeleteId),
      );

      const card = document.getElementById(`card-${targetDeleteId}`);
      if (card) card.remove();

      closeDeleteModal();
      showToast(
        "মুছে ফেলা হয়েছে",
        "পণ্যটি ডেটাবেস থেকে সফলভাবে ডিলিট করা হয়েছে।",
        "error",
      );
    } catch (error) {
      console.error(error);
      showToast("ব্যর্থ", "পণ্যটি মুছতে সমস্যা হয়েছে।", "error");
    }
  });

// এডিট করার সময় বিবরণ ফিল্ডেও ডেটা বসানো হবে
function editProduct(
  id,
  name,
  weight,
  price,
  location,
  seller,
  imageUrl,
  description,
) {
  editingProductId = id;
  existingImageUrl = imageUrl;

  document.getElementById("pName").value = name;
  document.getElementById("pWeight").value = weight;
  document.getElementById("pPrice").value = price;
  document.getElementById("pLocation").value = location;
  document.getElementById("pSeller").value = seller;

  if (document.getElementById("pDescription")) {
    document.getElementById("pDescription").value = description || "";
  }

  const imageInput = document.getElementById("pImage");
  if (imageInput) imageInput.required = false;

  const submitBtn = document.querySelector("#addProductForm .btn-submit");
  if (submitBtn) {
    submitBtn.innerHTML =
      'তথ্য আপডেট করুন <i class="fa-solid fa-pen-to-square"></i>';
  }

  switchDashboardView("addProductView");
  showToast(
    "এডিট মোড",
    "তথ্যগুলো পরিবর্তন করে আপডেট বাটনে ক্লিক করুন।",
    "info",
  );
}
// Heart icon toggle logic
function toggleFavorite(iconElement, productId) {
  iconElement.classList.toggle("fa-regular");
  iconElement.classList.toggle("fa-solid");

  let favorites = JSON.parse(localStorage.getItem("myFavorites")) || [];

  if (iconElement.classList.contains("fa-solid")) {
    if (!favorites.includes(productId)) {
      favorites.push(productId);
      showToast(
        "ফেভারিট!",
        "পণ্যটি আপনার পছন্দের তালিকায় যোগ হয়েছে।",
        "success",
      );
    }
  } else {
    favorites = favorites.filter((id) => id !== productId);
    showToast("রিমুভ!", "পণ্যটি পছন্দের তালিকা থেকে সরানো হয়েছে।", "info");
  }

  localStorage.setItem("myFavorites", JSON.stringify(favorites));
}

// Page load hole favorites status update korar jonno (loadMyProducts function-er sheshe call korben)
function updateHeartIcons() {
  const favorites = JSON.parse(localStorage.getItem("myFavorites")) || [];
  favorites.forEach((favId) => {
    const card = document.getElementById(`card-${favId}`);
    if (card) {
      const heart = card.querySelector(".fa-heart");
      if (heart) {
        heart.classList.remove("fa-regular");
        heart.classList.add("fa-solid");
      }
    }
  });
}
