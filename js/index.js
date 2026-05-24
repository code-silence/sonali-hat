
import { db } from "./firebase.js";

import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const grid = document.getElementById("productGrid");
const noResults = document.querySelector(".no-results");
const categoryFilter = document.getElementById("category-filter");
let latestSnapshot = null;

function renderProducts(snapshot) {
  grid.innerHTML = "";
  let count = 0;
  const filterValue = categoryFilter?.value || "all";

  snapshot.forEach((docSnap) => {
    const p = docSnap.data();
    if (filterValue !== "all" && p.category !== filterValue) {
      return;
    }

    count += 1;
    grid.innerHTML += `
      <div class="product-card" data-category="${p.category}">
        <img src="${p.imageUrl || ''}" alt="${p.title}" style="width:100%; height:200px; object-fit:cover;" />
        <div class="product-details">
          <span class="category-tag">${p.category}</span>
          <h3>${p.title}</h3>
          <p class="seller-info">
            <i class="fa-solid fa-location-dot"></i>
            ${p.location}
            |
            <i class="fa-solid fa-user"></i>
            ${p.sellerName}
          </p>
          <div class="price-action">
            <span class="price">৳ ${p.price}</span>
            <button class="btn-add-cart">
              <i class="fa-solid fa-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  if (noResults) {
    noResults.style.display = count === 0 ? "block" : "none";
  }
}

function startProductListener() {
  const productsRef = collection(db, "products");
  onSnapshot(productsRef, (snapshot) => {
    latestSnapshot = snapshot;
    renderProducts(snapshot);
  }, (error) => {
    console.error("Could not load products:", error);
    if (noResults) {
      noResults.textContent = "পণ্য লোড করতে সমস্যা হয়েছে। দয়া করে পেজ রিফ্রেশ করুন।";
      noResults.style.display = "block";
    }
  });
}

categoryFilter?.addEventListener("change", () => {
  if (latestSnapshot) {
    renderProducts(latestSnapshot);
  }
});

startProductListener();