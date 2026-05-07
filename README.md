# 🐟 CleanCutFish

> **Direct from river to kitchen** — a premium online fish delivery platform for Bangladesh.
> Fresh fish from the Padma, Meghna, Dhonu and Tanguar Haor — cleaned, cut, vacuum-sealed, and delivered cold to your door.

Built with **Next.js 14 (App Router)** + **Tailwind CSS**.
Inspired by [riverfish.com.bd](https://riverfish.com.bd), [onlinefishbazar.com](https://onlinefishbazar.com), and [machbari.com](https://machbari.com).

---

## ✨ What's inside

### Pages
| Route | What it does |
|---|---|
| `/` | Hero, trust badges, featured categories, Ready-to-Cook grid, "our process", combo promo, testimonials |
| `/shop` | Filterable product listing — by category, region, price, ready-to-cook, search |
| `/shop/[slug]` | Product detail — image zoom, weight picker, qty stepper, full prep description, related |
| `/combos` | Family Combo Packs (Rui+Katol+Chingri etc.) with savings % |
| `/cart` | Full basket page with line editing |
| `/checkout` | One-page checkout — Cash on Delivery, bKash, Nagad |
| `/about` | Our story |

### Features
- 🛒 **Sliding mini-cart** — opens whenever you add an item, persists to `localStorage`
- 🔍 **Filtering & sorting** — category, sourcing region, max price, ready-to-cook only, sort
- ⚖️ **Weight selector** — 500g / 1kg / 2kg+ with auto-priced unit price
- 🧾 **Combo packs** — adds all items in one click
- 💳 **bKash/Nagad/COD** — UI placeholders ready for Bangladeshi MFS integration
- 🎨 **Design system** — Deep Blue, Teal, White palette + custom Tailwind tokens
- 📱 **Fully responsive** — mobile menu, sticky filter sidebar, mobile cart drawer

### Data
All product, category, combo, and testimonial data lives in `/data/*.json` so it can later be swapped for a Sanity/Strapi headless CMS without touching the UI.

Sample products include:
- **Dhonu Nodir Ayre** (Kishoreganj)
- **Padmar Ilish** (Chandpur)
- **Sundarban Coastal Tilapia** (Khulna)
- **Boal, Chitol, Shol** — Ready-to-cook
- **Golda & Bagda Chingri**
- **Puti & Loitya Shutki**

---

## 🚀 Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

```bash
npm run build && npm start    # production
```

> First run will download fonts and product images on demand — make sure you have internet.

---

## 📁 Folder structure

```
CleanCutFish/
├── app/
│   ├── layout.js              # Root layout, providers, header/footer
│   ├── page.js                # Home
│   ├── globals.css            # Tailwind + design tokens
│   ├── shop/
│   │   ├── page.js
│   │   ├── ShopClient.jsx     # Client-side filters
│   │   └── [slug]/
│   │       ├── page.js
│   │       └── ProductDetail.jsx
│   ├── combos/
│   ├── cart/
│   ├── checkout/
│   ├── about/
│   └── not-found.js
├── components/
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── MiniCart.jsx
│   ├── ProductCard.jsx
│   ├── TrustBadges.jsx
│   └── Icon.jsx               # Inline SVG set, zero deps
├── context/
│   └── CartContext.jsx        # useReducer + localStorage
├── data/
│   ├── products.json
│   ├── categories.json
│   ├── combos.json
│   └── testimonials.json
├── lib/
│   └── products.js            # Helpers to query data
├── tailwind.config.js
├── next.config.js
└── package.json
```

---

## 🎨 Design tokens

Defined in `tailwind.config.js` — use them anywhere:

```js
brand.deep    // #0B3D5C  (Deep Blue)
brand.ocean   // #0F5E8A
brand.teal    // #0F8B8D  (Teal)
brand.mint    // #3AB0A2
brand.sand    // #F6F3EC  (off-white background)
brand.cream   // #FFFCF7  (page background)
accent.coral  // #E76F51  (sale/badge)
accent.gold   // #E9B44C  (rating stars)
```

Reusable component classes in `globals.css`:
`btn-primary`, `btn-ghost`, `btn-accent`, `pill`, `card`, `input`, `section-title`, `section-eyebrow`, `container-page`.

---

## 🔌 Connecting a real backend

The cleanest path is a **headless CMS**:

1. **Sanity** — model: Product, Category, Combo. Replace `lib/products.js` with `groq` queries.
2. **Strapi** — same idea, REST/GraphQL endpoints.
3. **Custom Node/Express** — stand up `/api/products`, `/api/orders`. Move cart line check to server before payment.

Hook bKash & Nagad **Tokenized Checkout** APIs into `app/checkout/page.js` — replace the `placeOrder` handler with the merchant API call.

---

## 🧂 Notes

- Product images are fetched from `riverfish.com.bd`'s public CDN for prototype purposes — replace with your own assets before going live.
- All pricing is in BDT (৳).
- Free Dhaka delivery threshold: ৳1,500.

— Built with care for the people who actually cook. 🐟
