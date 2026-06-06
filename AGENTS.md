# AGENTS

## Repository purpose
This is a static frontend ecommerce site for Bangladeshi farmers and buyers. The app is built with plain HTML, CSS, and JavaScript, and it uses Firebase Auth/Firestore plus Supabase Storage for media uploads.

## Key files
- `index.html` — product browsing page
- `auth.html` — sign-in / sign-up / password reset UI
- `dashboard.html` — seller dashboard
- `css/style.css` and `css/auth.css` — styling
- `js/firebase.js` — Firebase initialization and exported `auth`, `db`
- `js/auth.js` — authentication flows, Firestore user role persistence
- `js/index.js` — live Firestore `products` listener and product rendering
- `js/dashboard.js` — seller-only dashboard, product creation/deletion, role gating
- `js/supabase.js` — Supabase storage upload helper for product images

## Important conventions
- The app is client-side only; there is no backend source code in the repo.
- JavaScript is loaded using `type="module"` in HTML pages, so pages should be served over HTTP rather than opened via `file://`.
- Firebase and Supabase are accessed directly in the browser.
- The UI text is largely Bengali; preserve localization and page semantics when editing.
- The seller dashboard is gated by Firestore `users/{uid}.role === "seller"`.

## What agents should do
- Treat this as a static web project rather than a Node.js/React/Vue app.
- Avoid adding build tooling or packaging unless the user explicitly asks for it.
- Preserve existing DOM-based patterns and simple script organization.
- Prefer small iterative fixes over large rewrites, especially around auth, product rendering, and file upload flow.

## Notes for local testing
- There is no `npm` or build config present.
- To test locally, serve the directory from a static HTTP server (for example, VS Code Live Server or a lightweight server).

## External services
- Firebase Auth and Firestore via CDN modules from `https://www.gstatic.com/firebasejs/`
- Supabase Storage via `https://esm.sh/@supabase/supabase-js`

## Links
- `README.md` — project description


## Development Rules

### DO
- Use plain HTML, CSS, and JavaScript.
- Keep code beginner-friendly.
- Preserve Bengali UI text.
- Write reusable functions.
- Use async/await for Firebase operations.
- Add meaningful comments.
- Keep responsive design mobile-first.
- Follow existing file structure.

### DON'T
- Do not use React.
- Do not use Next.js.
- Do not use Vue.
- Do not use Angular.
- Do not add npm packages.
- Do not add webpack or vite.
- Do not create unnecessary abstractions.

---

## UI Guidelines

Theme:
- Modern
- Clean
- Agricultural marketplace style

Colors:
- Primary: Green
- Secondary: Orange

Requirements:
- Fully responsive
- Smooth hover effects
- Modern cards
- Accessible forms
- Mobile-first layout

---

## Product Collection Structure

Example:

{
  "name": "Fresh Tomatoes",
  "price": 50,
  "description": "Organic tomatoes",
  "imageUrl": "...",
  "sellerId": "...",
  "createdAt": "timestamp"
}

---

## Code Style

- Use const by default.
- Use let only when necessary.
- Prefer template literals.
- Avoid duplicate code.
- Keep functions small and readable.

Add comments like:

// Firebase Auth
// Load Products
// Upload Image
// Seller Verification

---

## Copilot Instructions

Before generating code:

1. Read AGENTS.md.
2. Follow existing project structure.
3. Do not rewrite working code unnecessarily.
4. Prefer small fixes over large rewrites.
5. Keep Firebase and Supabase integrations compatible.
6. Preserve Bengali content and UI semantics.