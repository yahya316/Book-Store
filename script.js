document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cart-items');
  const emptyCartMessage = document.getElementById('cart-empty');
  const applyFiltersButton = document.getElementById('apply-filters');
  const bookListingsContainer = document.getElementById('book-listings');
  const proceedToCheckoutButton = document.getElementById('proceed-to-checkout');
  const placeOrderButton = document.getElementById('place-order');
  const orderConfirmationSection = document.getElementById('order-confirmation');
  const downloadReceiptLink = document.getElementById('download-receipt');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Book data for filtering
  const books = [
    { title: "The Starless Sea", genre: "Fiction", author: "Erin Morgenstern", price: 14.99, popularity: 5 },
    { title: "Project Hail Mary", genre: "Sci-Fi", author: "Andy Weir", price: 16.99, popularity: 4 },
    { title: "The Midnight Library", genre: "Fiction", author: "Matt Haig", price: 12.99, popularity: 3 },
    { title: "Dune", genre: "Sci-Fi", author: "Frank Herbert", price: 19.99, popularity: 2 },
    { title: "Circe", genre: "Fiction", author: "Madeline Miller", price: 15.99, popularity: 4 },
    { title: "Anxious People", genre: "Fiction", author: "Fredrik Backman", price: 13.99, popularity: 3 }
  ];

  // Add to Cart
  function attachAddToCartListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
      button.removeEventListener('click', handleAddToCart); // Prevent duplicates
      button.addEventListener('click', handleAddToCart);
    });
  }

  function handleAddToCart(event) {
    const title = event.currentTarget.getAttribute('data-title');
    const price = parseFloat(event.currentTarget.getAttribute('data-price'));
    if (!title || isNaN(price)) return;
    const existingItem = cart.find(item => item.title === title);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ title, price, quantity: 1, author: books.find(book => book.title === title)?.author || 'Unknown Author' });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    alert(`${title} has been added to your cart!`);
  }

  // Update Cart Display
  function updateCart() {
    if (!cartItemsContainer || !emptyCartMessage) return;
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;

    if (cart.length === 0) {
      cartItemsContainer.classList.add('hidden');
      emptyCartMessage.classList.remove('hidden');
    } else {
      cartItemsContainer.classList.remove('hidden');
      emptyCartMessage.classList.add('hidden');
      cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <div class="grid grid-cols-12 items-center p-4 border-b border-gray-200 hover:bg-gray-50 transition duration-300">
            <div class="col-span-5 flex items-center">
              <img src="img.jpg" alt="Book Cover" class="w-16 h-24 object-cover rounded-lg mr-4">
              <div>
                <h3 class="text-lg font-semibold text-indigo-800">${item.title}</h3>
                <p class="text-gray-600 text-sm">${item.author}</p>
              </div>
            </div>
            <div class="col-span-2 text-center text-gray-700 font-bold">$${item.price.toFixed(2)}</div>
            <div class="col-span-3 text-center">
              <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-index="${index}">
            </div>
            <div class="col-span-2 text-center">
              <button class="bg-red-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-red-700 transition duration-300 transform hover:scale-105 remove-item" data-index="${index}">Remove</button>
            </div>
          </div>
        `;
        cartItemsContainer.appendChild(cartItem);
      });
    }

    // Update Subtotal and Total
    const subtotalElement = document.getElementById('subtotal');
    const shippingCostElement = document.getElementById('shipping-cost');
    const totalElement = document.getElementById('total');
    const shipping = cart.length > 0 ? parseFloat(document.querySelector('input[name="delivery"]:checked')?.dataset.cost || 5.00) : 0.00;
    if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingCostElement) shippingCostElement.textContent = `$${shipping.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `$${(subtotal + shipping).toFixed(2)}`;

    // Update Checkout Order Summary
    updateOrderSummary();

    // Attach Event Listeners
    attachCartEventListeners();
  }

  // Update Order Summary
  function updateOrderSummary() {
    const orderItemsContainer = document.getElementById('order-items');
    const orderSubtotal = document.getElementById('order-subtotal');
    const orderShipping = document.getElementById('order-shipping');
    const orderTotal = document.getElementById('order-total');
    if (!orderItemsContainer) return;

    let subtotal = 0;
    orderItemsContainer.innerHTML = '';
    cart.forEach(item => {
      subtotal += item.price * item.quantity;
      const itemElement = document.createElement('p');
      itemElement.className = 'text-gray-700 text-lg';
      itemElement.innerHTML = `${item.title} (x${item.quantity}) <span class="float-right">$${(item.price * item.quantity).toFixed(2)}</span>`;
      orderItemsContainer.appendChild(itemElement);
    });

    const shipping = cart.length > 0 ? parseFloat(document.querySelector('input[name="delivery"]:checked')?.dataset.cost || 5.00) : 0.00;
    if (orderSubtotal) orderSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    if (orderShipping) orderShipping.textContent = `$${shipping.toFixed(2)}`;
    if (orderTotal) orderTotal.textContent = `$${(subtotal + shipping).toFixed(2)}`;
  }

  // Attach Cart Event Listeners
  function attachCartEventListeners() {
    document.querySelectorAll('.remove-item').forEach(button => {
      button.removeEventListener('click', handleRemove); // Prevent duplicates
      button.addEventListener('click', handleRemove);
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
      input.removeEventListener('change', handleQuantityChange); // Prevent duplicates
      input.addEventListener('change', handleQuantityChange);
    });

    // Delivery Options
    document.querySelectorAll('input[name="delivery"]').forEach(input => {
      input.removeEventListener('change', handleDeliveryChange); // Prevent duplicates
      input.addEventListener('change', handleDeliveryChange);
    });

    // Payment Methods
    document.querySelectorAll('input[name="payment"]').forEach(input => {
      input.removeEventListener('change', handlePaymentChange); // Prevent duplicates
      input.addEventListener('change', handlePaymentChange);
    });
  }

  // Handle Remove Item
  function handleRemove(event) {
    const index = parseInt(event.currentTarget.getAttribute('data-index'));
    if (!isNaN(index) && index >= 0 && index < cart.length) {
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
    }
  }

  // Handle Quantity Change
  function handleQuantityChange(event) {
    const index = parseInt(event.target.getAttribute('data-index'));
    const newQuantity = parseInt(event.target.value);
    if (!isNaN(index) && newQuantity >= 1) {
      cart[index].quantity = newQuantity;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
    } else {
      event.target.value = cart[index].quantity; // Reset to previous value
    }
  }

  // Handle Delivery Change
  function handleDeliveryChange() {
    updateCart();
  }

  // Handle Payment Method Change
  function handlePaymentChange(event) {
    document.getElementById('credit-card-fields').classList.add('hidden');
    document.getElementById('paypal-fields').classList.add('hidden');
    document.getElementById('bank-fields').classList.add('hidden');
    if (event.target.value === 'credit') {
      document.getElementById('credit-card-fields').classList.remove('hidden');
    } else if (event.target.value === 'paypal') {
      document.getElementById('paypal-fields').classList.remove('hidden');
    } else if (event.target.value === 'bank') {
      document.getElementById('bank-fields').classList.remove('hidden');
    }
  }

  // Proceed to Checkout
  if (proceedToCheckoutButton) {
    proceedToCheckoutButton.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your cart is empty. Please add items before proceeding to checkout.');
        return;
      }
      updateOrderSummary();
      document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Place Order
  if (placeOrderButton) {
    placeOrderButton.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your cart is empty. Please add items before placing an order.');
        return;
      }

      // Validate Shipping Information
      const fullName = document.getElementById('full-name').value.trim();
      const email = document.getElementById('email').value.trim();
      const address1 = document.getElementById('address1').value.trim();
      const city = document.getElementById('city').value.trim();
      const postalCode = document.getElementById('postal-code').value.trim();

      if (!fullName || !email || !address1 || !city || !postalCode) {
        alert('Please fill in all required shipping information.');
        return;
      }

      // Validate Payment Information
      const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
      if (paymentMethod === 'credit') {
        const cardNumber = document.getElementById('card-number').value.trim();
        const expiryDate = document.getElementById('expiry-date').value.trim();
        const cvv = document.getElementById('cvv').value.trim();
        if (!cardNumber || !expiryDate || !cvv) {
          alert('Please fill in all credit card details.');
          return;
        }
      } else if (paymentMethod === 'paypal') {
        const paypalEmail = document.getElementById('paypal-email').value.trim();
        if (!paypalEmail) {
          alert('Please provide a PayPal email.');
          return;
        }
      }

      // Generate Receipt
      const shipping = parseFloat(document.querySelector('input[name="delivery"]:checked').dataset.cost);
      const deliveryMethod = document.querySelector('input[name="delivery"]:checked').value;
      const orderDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Karachi' });
      let subtotal = 0;
      cart.forEach(item => subtotal += item.price * item.quantity);
      const total = subtotal + shipping;

      const receiptContent = `
BookHaven Order Receipt
Order Date: ${orderDate}
Order Number: BH${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}

Shipping Information:
Name: ${fullName}
Email: ${email}
Address: ${address1}${document.getElementById('address2').value.trim() ? ', ' + document.getElementById('address2').value.trim() : ''}
City: ${city}
Postal Code: ${postalCode}

Delivery Method: ${deliveryMethod.charAt(0).toUpperCase() + deliveryMethod.slice(1)} ($${shipping.toFixed(2)})

Order Details:
${cart.map(item => `${item.title} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`).join('\n')}
Subtotal: $${subtotal.toFixed(2)}
Shipping: $${shipping.toFixed(2)}
Total: $${total.toFixed(2)}

Payment Method: ${paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1)}

Thank you for shopping with BookHaven!
Contact us at support@bookhaven.com for any queries.
      `;

      // Create downloadable receipt
      const blob = new Blob([receiptContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      downloadReceiptLink.setAttribute('href', url);
      downloadReceiptLink.setAttribute('download', `BookHaven_Receipt_${orderDate.replace(/[,:/\s]/g, '-')}.txt`);

      // Show Confirmation
      document.getElementById('cart-items').parentElement.parentElement.classList.add('hidden');
      document.getElementById('checkout').classList.add('hidden');
      orderConfirmationSection.classList.remove('hidden');

      // Clear Cart
      cart = [];
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
    });
  }

  // Apply Filters
  if (applyFiltersButton && bookListingsContainer) {
    applyFiltersButton.addEventListener('click', () => {
      const genres = Array.from(document.querySelectorAll('input[name="genre"]:checked')).map(input => input.value);
      const author = document.getElementById('author-filter').value.trim().toLowerCase();
      const priceMin = parseFloat(document.getElementById('price-min').value) || 0;
      const priceMax = parseFloat(document.getElementById('price-max').value) || Infinity;
      const sortBy = document.getElementById('sort-by').value;

      // Filter books
      let filteredBooks = books.filter(book => {
        const matchesGenre = genres.length === 0 || genres.includes(book.genre);
        const matchesAuthor = !author || book.author.toLowerCase().includes(author);
        const matchesPrice = book.price >= priceMin && book.price <= priceMax;
        return matchesGenre && matchesAuthor && matchesPrice;
      });

      // Sort books
      if (sortBy === 'price-low') {
        filteredBooks.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price-high') {
        filteredBooks.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'popularity') {
        filteredBooks.sort((a, b) => b.popularity - a.popularity);
      } else {
        filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
      }

      // Update book listings
      bookListingsContainer.innerHTML = '';
      filteredBooks.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.className = 'bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition duration-300 animate-fade-in-up book-item';
        bookItem.setAttribute('data-genre', book.genre);
        bookItem.setAttribute('data-author', book.author);
        bookItem.setAttribute('data-price', book.price);
        const productPage = `product-${book.title.toLowerCase().replace(/\s+/g, '-')}.html`;
        bookItem.innerHTML = `
          <a href="${productPage}"><img src="img.jpg" alt="${book.title} Cover" class="w-full h-64 object-cover mb-4 rounded"></a>
          <h3 class="text-2xl font-semibold text-indigo-800">${book.title}</h3>
          <p class="text-gray-600">${book.author}</p>
          <p class="text-gray-700 font-bold">$${book.price.toFixed(2)}</p>
          <a href="${productPage}" class="text-indigo-600 hover:underline mt-2 inline-block">View Details</a>
        `;
        bookListingsContainer.appendChild(bookItem);
      });
    });
  }

  // Initialize
  attachAddToCartListeners();
  updateCart();
});