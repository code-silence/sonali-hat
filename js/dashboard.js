
import { auth, db } from "./firebase.js";
import { uploadProductImage } from "./supabase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

console.log('dashboard.js module loaded');

window.addEventListener('error', (ev) => {
  console.error('Window error captured:', ev.error || ev.message, ev);
});

window.addEventListener('unhandledrejection', (ev) => {
  console.error('Unhandled promise rejection:', ev.reason);
});

/* ---------------- UI CONTROLS ---------------- */

window.toggleSidebar = function () {
  const sidebar = document.getElementById("sidebar");
  if (sidebar) sidebar.classList.toggle("active");
};

window.switchDashboardView = function (viewId) {
  document.querySelectorAll(".dashboard-view").forEach((v) => {
    v.classList.add("hidden-view");
    v.classList.remove("active-view");
  });

  const target = document.getElementById(viewId);
  if (!target) return;
  target.classList.remove("hidden-view");
  target.classList.add("active-view");
};

window.toggleDashboardMode = function () {
  const buyerDashboard = document.getElementById("buyerDashboard");
  const sellerDashboard = document.getElementById("sellerDashboard");
  const modeText = document.getElementById("modeText");
  const buyerItems = document.querySelectorAll(".buyer-item");

  if (buyerDashboard) {
    buyerDashboard.classList.toggle("hidden-view");
    buyerDashboard.classList.toggle("active-view");
  }

  if (sellerDashboard) {
    sellerDashboard.classList.toggle("hidden-view");
    sellerDashboard.classList.toggle("active-view");
  }

  buyerItems.forEach((item) => item.classList.toggle("hidden-view"));

  if (modeText && buyerDashboard) {
    modeText.textContent = buyerDashboard.classList.contains("active-view")
      ? "Switch to Selling"
      : "Switch to Buying";
  }
};

window.closeDeleteModal = function () {
  pendingDeleteProductId = null;
  const modal = document.getElementById("deleteModal");
  if (modal) modal.classList.add("hidden-modal");
};

window.logout = async function (event) {
  event?.preventDefault();

  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed:", error);
  }

  window.location.href = "auth.html";
};


/* ---------------- AUTH CHECK ---------------- */

onAuthStateChanged(auth, async (user) => {
  console.log('Auth state changed:', user);

  if (!user) {
    console.log('User not logged in, redirecting to auth.html');
    window.location.href = "auth.html";
    return;
  }

  try {
    const userSnap = await getDoc(doc(db, "users", user.uid));
    const role = userSnap.exists() ? userSnap.data().role : "buyer";
    console.log('Authenticated user role:', role, 'uid:', user.uid);

    if (role !== "seller") {
      console.log('User is not seller, redirecting to index.html');
      window.location.href = "index.html";
      return;
    }

    const roleBadge = document.getElementById("roleBadge");
    if (roleBadge) roleBadge.textContent = "কৃষক (Seller)";

    const avatar = document.getElementById("userAvatar");
    if (avatar) avatar.alt = user.displayName || "Seller";

    await loadMyProducts(user.uid);
    switchDashboardView("sellerDashboard");
  } catch (error) {
    console.error("Auth setup error:", error);
    window.location.href = "auth.html";
  }
});

/* ---------------- ADD PRODUCT ---------------- */

function createProductCard(docSnap) {
  const p = docSnap.data() || {};

  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.prodId = docSnap.id;

  if (p.imageUrl) {
    const img = document.createElement('img');
    img.src = p.imageUrl;
    img.alt = p.title || 'Product image';
    img.style.cssText = 'width:100%; height:200px; object-fit:cover;';
    card.appendChild(img);
  }

  const details = document.createElement('div');
  details.className = 'product-details';

  const categoryTag = document.createElement('span');
  categoryTag.className = 'category-tag';
  categoryTag.textContent = p.category || '';

  const title = document.createElement('h3');
  title.textContent = p.name || p.title || '';

  const weight = document.createElement('p');
  weight.textContent = p.weight || '';

  const location = document.createElement('p');
  location.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${p.location || ''}`;

  if (p.description) {
    const descriptionText = document.createElement('p');
    descriptionText.className = 'product-description';
    descriptionText.textContent = p.description;
    details.append(descriptionText);
  }

  const priceAction = document.createElement('div');
  priceAction.className = 'price-action';

  const price = document.createElement('span');
  price.className = 'price';
  price.textContent = `৳ ${p.price ?? '0'}`;

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'edit-product-btn';
  editButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
  editButton.addEventListener('click', () => editProduct(docSnap));

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-product-btn';
  deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteButton.addEventListener('click', () => window.deleteProduct(docSnap.id));

  priceAction.append(price, editButton, deleteButton);
  details.append(categoryTag, title, weight, location, priceAction);
  card.append(details);

  return card;
}

function resetProductList(list) {
  list.replaceChildren();
}

let pendingDeleteProductId = null;
let editingProductId = null;
let currentPreviewUrl = null;

const imageInput = document.getElementById("pImage");
const previewImage = document.getElementById("previewImage");
const previewPlaceholder = document.getElementById("previewPlaceholder");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

function updateImagePreview(fileOrUrl) {
  if (!previewImage || !previewPlaceholder) return;

  if (currentPreviewUrl) {
    URL.revokeObjectURL(currentPreviewUrl);
    currentPreviewUrl = null;
  }

  if (!fileOrUrl) {
    previewImage.src = "";
    previewImage.style.display = "none";
    previewPlaceholder.style.display = "flex";
    return;
  }

  if (fileOrUrl instanceof File) {
    currentPreviewUrl = URL.createObjectURL(fileOrUrl);
    previewImage.src = currentPreviewUrl;
  } else {
    previewImage.src = fileOrUrl;
  }

  previewImage.style.display = "block";
  previewPlaceholder.style.display = "none";
}

function setProductFormMode(editing) {
  const header = document.querySelector('#addProductView .welcome-text');
  const submitButton = document.querySelector('#addProductForm button[type="submit"]');

  if (editing) {
    if (header) header.textContent = 'পণ্য আপডেট করুন';
    if (submitButton) {
      submitButton.innerHTML = `
        <span class="button-text">আপডেট করুন</span>
        <i class="fa-solid fa-check"></i>
      `;
    }
  } else {
    if (header) header.textContent = 'নতুন পণ্য যোগ করুন';
    if (submitButton) {
      submitButton.innerHTML = `
        <span class="button-text">পণ্য সেভ করুন</span>
        <i class="fa-solid fa-check"></i>
      `;
    }
  }
}

function editProduct(docSnap) {
  const p = docSnap.data() || {};
  editingProductId = docSnap.id;

  const form = document.getElementById('addProductForm');
  if (!form) return;

  form.querySelector('#pName').value = p.name || p.title || '';
  form.querySelector('#pDescription').value = p.description || '';
  form.querySelector('#pPrice').value = p.price || '';
  form.querySelector('#pCategory').value = p.category || '';
  form.querySelector('#pLocation').value = p.location || '';
  form.querySelector('#pSeller').value = p.sellerName || '';

  if (imageInput) imageInput.value = '';
  updateImagePreview(p.imageUrl || null);

  switchDashboardView('addProductView');
  setProductFormMode(true);
}

function clearProductForm() {
  const form = document.getElementById('addProductForm');
  if (form) form.reset();
  updateImagePreview(null);
  editingProductId = null;
  setProductFormMode(false);
}

function showDeleteModal(productId) {
  pendingDeleteProductId = productId;
  const modal = document.getElementById("deleteModal");
  if (modal) modal.classList.remove("hidden-modal");
}

async function performDeleteProduct() {
  if (!pendingDeleteProductId) return;
  const productId = pendingDeleteProductId;
  pendingDeleteProductId = null;
  window.closeDeleteModal();

  const confirmButton = document.getElementById("confirmDeleteBtn");
  if (confirmButton) confirmButton.disabled = true;

  const user = auth.currentUser;
  if (!user) {
    if (confirmButton) confirmButton.disabled = false;
    showToast("লগইন প্রয়োজন", "অনুগ্রহ করে প্রথমে লগইন করুন।", "error");
    return;
  }

  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      showToast("পণ্য মিললো না", "এই পণ্যটি আর পাওয়া যাচ্ছে না।", "error");
      return;
    }

    if (productSnap.data().sellerId !== user.uid) {
      showToast("অনুমোদিত নেই", "আপনি এই পণ্যটি মুছতে পারবেন না।", "error");
      return;
    }

    await deleteDoc(productRef);

    const card = document.querySelector(`[data-prod-id="${productId}"]`);
    if (card) card.remove();

    showToast("পণ্য মুছে ফেলা হয়েছে", "আপনার পণ্য তালিকা থেকে সরানো হয়েছে।");
    await loadMyProducts(user.uid);
  } catch (error) {
    console.error("Delete product failed:", error);
    showToast("মুছতে ব্যর্থ", "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।", "error");
  } finally {
    if (confirmButton) confirmButton.disabled = false;
  }
}

if (imageInput) {
  imageInput.addEventListener("change", (event) => {
    const file = event.target?.files?.[0];

    if (!file) {
      updateImagePreview(null);
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast(
        "অবৈধ ফাইল ফরম্যাট",
        "শুধুমাত্র JPG, PNG বা WebP ছবি গ্রহণযোগ্য।",
        "error"
      );
      imageInput.value = '';
      updateImagePreview(null);
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast(
        "ফাইল খুব বড়",
        "ছবির আকার ৫ এমবি-এর কম হওয়া উচিত।",
        "error"
      );
      imageInput.value = '';
      updateImagePreview(null);
      return;
    }

    updateImagePreview(file);
  });
}

if (confirmDeleteBtn) {
  confirmDeleteBtn.addEventListener("click", performDeleteProduct);
}

function showToast(title, message, type = 'success') {
  const toast = document.getElementById('dynamicToast');
  const toastTitle = document.getElementById('toastTitle');
  const toastText = document.getElementById('toastText');
  if (!toast || !toastTitle || !toastText) return;

  toastTitle.textContent = title;
  toastText.textContent = message;
  toast.classList.remove('info', 'error');
  toast.classList.add(type === 'error' ? 'error' : 'show');
  if (type === 'error') {
    toast.classList.add('error');
  }

  toast.classList.add('show');
  window.clearTimeout(showToast._timeout);
  showToast._timeout = window.setTimeout(() => {
    toast.classList.remove('show', 'error');
  }, 3500);
}

async function handleAddProductSubmit(e) {
  e.preventDefault();

  const form = e.target?.closest ? e.target.closest('#addProductForm') : document.getElementById('addProductForm');
  if (!form) return;

  const user = auth.currentUser;
  if (!user) {
    showToast("লগইন প্রয়োজন", "অনুগ্রহ করে প্রথমে লগইন করুন।", "error");
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");
  const fileInput = document.getElementById("pImage");
  const file = fileInput?.files?.[0];
  const isEditing = Boolean(editingProductId);

  if (!file && !isEditing) {
    showToast("ছবি নেই", "অনুগ্রহ করে একটি ছবি নির্বাচন করুন।", "error");
    return;
  }

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.innerHTML = `
      <span class="button-text">সেভ হচ্ছে...</span>
      <span class="button-spinner"></span>
    `;
  }

  try {
    const productName = form.querySelector("#pName")?.value.trim() || "";
    const productDescription = form.querySelector("#pDescription")?.value.trim() || "";
    const productPrice = Number(form.querySelector("#pPrice")?.value || 0);

    if (isEditing) {
      const updateData = {
        name: productName,
        price: productPrice,
        description: productDescription
      };

      if (file) {
        console.log('Uploading image to Supabase...', file.name, file.type);
        const imageUrl = await uploadProductImage(file);
        updateData.imageUrl = imageUrl;
      }

      const productRef = doc(db, "products", editingProductId);
      await updateDoc(productRef, updateData);
      showToast("পণ্য আপডেট করা হয়েছে", "আপনার পণ্য সফলভাবে হালনাগাদ হয়েছে।");
    } else {
      console.log('Uploading image to Supabase...', file.name, file.type);
      const imageUrl = await uploadProductImage(file);

      const productData = {
        name: productName,
        price: productPrice,
        description: productDescription,
        imageUrl,
        sellerId: user.uid,
        createdAt: serverTimestamp()
      };

      const categoryValue = form.querySelector("#pCategory")?.value;
      if (categoryValue) {
        productData.category = categoryValue;
      }

      console.log('Saving product to Firestore...', productData);
      await addDoc(collection(db, "products"), productData);
      showToast("পণ্য সফলভাবে যোগ করা হয়েছে", "আপনার পণ্য এখন তালিকাভুক্ত হয়েছে।");
    }

    clearProductForm();
    await loadMyProducts(user.uid);
    switchDashboardView("myProductsView");
  } catch (error) {
    console.error("Add product failed:", error);
    showToast("সংরক্ষণ ব্যর্থ", `ইমেজ আপলোড বা ডাটাবেস সমস্যার কারণে ব্যর্থ হয়েছে।`, "error");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      setProductFormMode(Boolean(editingProductId));
    }
  }
}

// Attach form submission handler
const addProductForm = document.getElementById("addProductForm");
if (addProductForm) addProductForm.addEventListener('submit', handleAddProductSubmit);

/* ---------------- LOAD MY PRODUCTS ---------------- */

async function loadMyProducts(uid) {
  const list = document.getElementById("myProductList");
  if (!list) return;

  const q = query(
    collection(db, "products"),
    where("sellerId", "==", uid)
  );

  try {
    const snapshot = await getDocs(q);
    console.log('Products loaded for user:', uid, 'count:', snapshot.size);
    resetProductList(list);

    snapshot.forEach((docSnap) => {
      const card = createProductCard(docSnap);
      list.appendChild(card);
    });
  } catch (error) {
    console.error("Load my products failed:", error);
  }
}

/* ---------------- DELETE PRODUCT ---------------- */

window.deleteProduct = function (id) {
  showDeleteModal(id);
};

// Replay any queued calls that occurred before module initialized
try {
  if (window._dashboardQueue && window._dashboardQueue.length) {
    const queued = window._dashboardQueue.slice();
    window._dashboardQueue.length = 0;
    queued.forEach((item) => {
      try {
        const fn = window[item.name];
        if (typeof fn === "function") fn.apply(null, item.args);
      } catch (err) {
        console.warn("Failed to replay queued dashboard call:", item, err);
      }
    });
  }
} catch (e) {
  console.error('replay queue error', e);
}

// Initialization: attach safe listeners to sidebar links and toggles
(function initDashboardBindings() {
  try {
    const sidebar = document.getElementById("sidebar");

    // Promote menu anchors with inline switchDashboardView(...) to safe listeners
    if (sidebar) {
      const links = sidebar.querySelectorAll("a[onclick]");
      links.forEach((a) => {
        const onclick = a.getAttribute("onclick") || "";
        const match = onclick.match(/switchDashboardView\(('|\")([^'\"]+)\1\)/);
        if (match) {
          a.addEventListener("click", (ev) => {
            ev.preventDefault();
            try {
              window.switchDashboardView(match[2]);
            } catch (err) {
              console.error("switchDashboardView error:", err);
            }
          });
        }
      });
    }

    // Menu toggle button (if exists)
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        try { window.toggleSidebar(); } catch (err) { console.error(err); }
      });
    }

    // Close button
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        try { window.toggleSidebar(); } catch (err) { console.error(err); }
      });
    }
  } catch (e) {
    console.error('initDashboardBindings failed', e);
  }
})();