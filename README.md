# 📚 BookHaven Bookstore

**BookHaven** is a simple and elegant online bookstore for browsing books, managing a cart, and checking out.  
Built with **HTML**, **Tailwind CSS** for a modern look, and **JavaScript** for interactivity.  
Cart data is stored in `localStorage` to keep your selections saved.

---

## ✨ Features

- **📖 Browse Books**: Filter by genre, author, or price.
- **🛒 Shopping Cart**: Add, update, or remove books; see real-time totals.
- **💳 Checkout**: Select delivery and payment options; download receipt.
- **📱 Responsive Design**: Mobile & desktop ready with Tailwind CSS.

---

## 🛠️ Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/bookhaven.git
cd bookhaven
```

### 2. File Structure

```
bookhaven/
├── img.jpg
├── index.html
├── shop.html
├── cart.html
├── product-starless-sea.html
├── product-hail-mary.html
├── product-midnight-library.html
├── product-dune.html
├── product-circe.html
├── product-anxious-people.html
├── styles.css
└── script.js
```

### 3. Run a Local Server

If you have Python installed:

```bash
python -m http.server 8000
```

Then open in your browser:
```
http://localhost:8000
```

### 4. Link JavaScript

Make sure this is included before `</body>` in all HTML files:

```html
<script src="script.js"></script>
```

---

## 🚀 Usage

- **Shop**: Open `shop.html` to filter and browse books.
- **Cart**: Add books and view them in `cart.html`, update or remove items.
- **Checkout**: Enter delivery and payment details and get a printable receipt.

---

## 🧩 Troubleshooting

- **Cart Not Working?**  
  Try clearing localStorage:  
  DevTools > Application > Local Storage > Clear Site Data.

- **Page Not Loading Properly?**  
  Make sure you use:  
  `http://localhost:8000` instead of opening files directly with `file://`.
