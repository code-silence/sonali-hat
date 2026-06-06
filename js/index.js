
import { auth, db } from "./firebase.js";

import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

const grid = document.getElementById("productGrid");
const loader = document.getElementById("productLoader");
const noResults = document.querySelector(".no-results");
const categoryFilter = document.getElementById("category-filter");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("price-sort");
let latestSnapshot = null;

const loginLink = document.getElementById("loginLink");
const logoutBtn = document.getElementById("logoutBtn");

async function handleLogout(event) {
  event?.preventDefault();
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout failed:", error);
  }
  window.location.href = "auth.html";
}

window.logout = handleLogout;

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (loginLink) loginLink.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-flex";
  } else {
    if (loginLink) loginLink.style.display = "inline-flex";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
});

function setLoading(show) {
  if (!loader) return;
  loader.style.display = show ? "flex" : "none";
}

function matchesSearch(product, term) {
  if (!term) return true;
  const name = (product.name || product.title || "").toString().toLowerCase();
  return name.includes(term);
}

function comparePrice(a, b, direction) {
  const priceA = Number(a.data().price) || 0;
  const priceB = Number(b.data().price) || 0;
  return direction === 'asc' ? priceA - priceB : priceB - priceA;
}

function getFilteredProducts(snapshot) {
  if (!snapshot) return [];
  const term = searchInput?.value.trim().toLowerCase() || "";
  const filterValue = categoryFilter?.value || "all";
  const sortValue = sortSelect?.value || "none";

  const products = [];
  snapshot.forEach((docSnap) => {
    const p = docSnap.data() || {};
    if (filterValue !== "all" && p.category !== filterValue) {
      return;
    }
    if (!matchesSearch(p, term)) {
      return;
    }
    products.push(docSnap);
  });

  if (sortValue === 'asc' || sortValue === 'desc') {
    products.sort((a, b) => comparePrice(a, b, sortValue));
  }

  return products;
}

function renderProducts(products) {
  if (!grid) return;
  grid.innerHTML = "";
  const count = products.length;

  products.forEach((docSnap) => {
    const p = docSnap.data();
    grid.innerHTML += `
      <div class="product-card" data-category="${p.category}">
        <img src="${p.imageUrl || ''}" alt="${p.name || p.title || ''}" style="width:100%; height:200px; object-fit:cover;" />
        <div class="product-details">
          <span class="category-tag">${p.category || 'ক্যাটেগরি নেই'}</span>
          <h3>${p.name || p.title || 'অজানা পণ্য'}</h3>
          ${p.description ? `<p class="product-description">${p.description}</p>` : ''}
          <p class="seller-info">
            <i class="fa-solid fa-location-dot"></i>
            ${p.location || 'অজানা লোকেশন'}
            |
            <i class="fa-solid fa-user"></i>
            ${p.sellerName || 'অজানা বিক্রেতা'}
          </p>
          <div class="price-action">
            <span class="price">৳ ${p.price ?? '0'}</span>
            <button class="btn-add-cart">
              <i class="fa-solid fa-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  if (noResults) {
    noResults.textContent = count === 0 ? "কোনো পণ্য পাওয়া যায়নি" : "";
    noResults.style.display = count === 0 ? "block" : "none";
  }
}

function refreshProducts() {
  if (!latestSnapshot) return;
  const products = getFilteredProducts(latestSnapshot);
  renderProducts(products);
}

function startProductListener() {
  setLoading(true);
  const productsRef = collection(db, "products");
  onSnapshot(productsRef, (snapshot) => {
    latestSnapshot = snapshot;
    setLoading(false);
    refreshProducts();
  }, (error) => {
    setLoading(false);
    console.error("Could not load products:", error);
    if (noResults) {
      noResults.textContent = "পণ্য লোড করতে সমস্যা হয়েছে। দয়া করে পেজ রিফ্রেশ করুন।";
      noResults.style.display = "block";
    }
  });
}

categoryFilter?.addEventListener("change", refreshProducts);
searchInput?.addEventListener("input", refreshProducts);
sortSelect?.addEventListener("change", refreshProducts);

startProductListener();