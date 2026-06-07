
import { auth, db } from "./firebase.js";
import { uploadProductImage, deleteProductImage } from "./supabase.js";

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
  title.textContent = p.title || '';

  const weight = document.createElement('p');
  weight.textContent = p.weight || '';

  const location = document.createElement('p');
  location.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${p.location || ''}`;

  const priceAction = document.createElement('div');
  priceAction.className = 'price-action';

  const price = document.createElement('span');
  price.className = 'price';
  price.textContent = `৳ ${p.price ?? '0'}`;

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-product-btn';
  deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
  deleteButton.addEventListener('click', () => deleteProduct(docSnap.id));

  priceAction.append(price, deleteButton);
  details.append(categoryTag, title, weight, location, priceAction);
  card.append(details);

  return card;
}

function resetProductList(list) {
  list.replaceChildren();
}

async function handleAddProductSubmit(e) {
  e.preventDefault();

  const form = e.target?.closest ? e.target.closest('#addProductForm') : document.getElementById('addProductForm');
  if (!form) return;

  const user = auth.currentUser;
  if (!user) {
    alert("অনুগ্রহ করে প্রথমে লগইন করুন।");
    return;
  }

  const submitButton = form.querySelector("button[type='submit']");

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "সেভ হচ্ছে...";
  }

  try {
    const fileInput = document.getElementById("pImage");
    const file = fileInput?.files?.[0];

    if (!file) {
      alert("অনুগ্রহ করে একটি ছবি নির্বাচন করুন।");
      return;
    }

    console.log('Uploading image to Supabase...', file.name, file.type);
    const imageUrl = await uploadProductImage(file);
    console.log('Image uploaded, URL:', imageUrl);

    const productData = {
      title: document.getElementById("pName")?.value.trim() || "",
      weight: document.getElementById("pWeight")?.value.trim() || "",
      price: Number(document.getElementById("pPrice")?.value || 0),
      location: document.getElementById("pLocation")?.value.trim() || "",
      sellerName: document.getElementById("pSeller")?.value.trim() || "",
      category: document.getElementById("pCategory")?.value || "",
      imageUrl,
      sellerId: user.uid,
      createdAt: serverTimestamp()
    };

    console.log('Saving product to Firestore...', productData);
    await addDoc(collection(db, "products"), productData);

    alert("পণ্য সফলভাবে যোগ করা হয়েছে!");
    form.reset();
    await loadMyProducts(user.uid);
    switchDashboardView("myProductsView");
  } catch (error) {
    console.error("Add product failed:", error);
    alert(`ইমেজ আপলোড বা ডাটাবেস সংরক্ষণ ব্যর্থ হয়েছে।\n${error?.message || error}`);
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.innerHTML = "পণ্য সেভ করুন <i class=\"fa-solid fa-check\"></i>";
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

window.deleteProduct = async function (id) {
  if (!confirm("এই পণ্যটি মুছে ফেলতে চাইছেন?")) return;

  const user = auth.currentUser;
  if (!user) {
    alert("অনুগ্রহ করে প্রথমে লগইন করুন।");
    return;
  }

  try {
    const productRef = doc(db, "products", id);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      alert("পণ্যটি খুঁজে পাওয়া যায়নি।");
      return;
    }

    if (productSnap.data().sellerId !== user.uid) {
      alert("আপনি এই পণ্যটি মুছতে অনুমোদিত নন।");
      return;
    }

    const imageUrl = productSnap.data().imageUrl;
    if (imageUrl) {
      try {
        await deleteProductImage(imageUrl);
      } catch (storageError) {
        console.error("Failed to remove product image from Supabase:", storageError);
        alert("মিডিয়া ফাইল মোছতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
        return;
      }
    }

    await deleteDoc(productRef);
    console.log('Product deleted:', id);
    alert("পণ্য সফলভাবে মুছে ফেলা হয়েছে।");
    await loadMyProducts(user.uid);
  } catch (error) {
    console.error("Delete product failed:", error);
    alert("পণ্য মুছতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
  }
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