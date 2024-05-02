/* Shopping Cart Section */
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
}

else {
    ready();
}

function ready() {
    var addToCartButtons = document.getElementsByClassName('shop-item-button');
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i];
        button.addEventListener('click', addToCartClicked)
    }

    // Check if we are on the cart page
    if (document.getElementById('shopping-cart') !== null) {
        loadCartItems();
        document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
    }
}

function addToCartClicked(event) {
    var button = event.target;
    var shopItem = button.parentElement.parentElement;
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText;
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src;

    // Save item to local storage
    var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    for (var i = 0; i < cartItems.length; i++) {
        if (cartItems[i].title === title) {
            alert('This item is already in your cart.');
            return;
        }
    }
    cartItems.push({ title: title, price: price, imageSrc: imageSrc });
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Hide the "Add to Cart" button
    button.style.display = 'none';
}

function loadCartItems() {
    var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    for (var i = 0; i < cartItems.length; i++) {
        addItemToCart(cartItems[i].title, cartItems[i].price, cartItems[i].imageSrc);
    }
    updateCartTotal();
}

function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('tr');
    cartRow.classList.add('cart-row');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartRowContents = `
        <td class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="50" height="50">
            <span class="cart-item-title">${title}</span>                  
        </td>
        <td class="cart-item cart-column">
            <span class="cart-price cart-column">${price}</span>
        </td>
        <td class="cart-item cart-column">
            <input class="cart-quantity-input" type="number" value="1" style="width: 50px">
            <button class="btn btn-danger" type="button">Remove</button>
        </td>        
    `;
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function removeCartItem(event) {
    var buttonClicked = event.target;
    var itemTitle = buttonClicked.parentElement.parentElement.getElementsByClassName('cart-item-title')[0].innerText;

    // Remove item from local storage
    var cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    for (var i = 0; i < cartItems.length; i++) {
        if (cartItems[i].title === itemTitle) {
            cartItems.splice(i, 1);
            break;
        }
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // Remove item from cart
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();

    // Show the "Add to Cart" button
    var addToCartButtons = document.getElementsByClassName('shop-item-button');
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i];
        var shopItem = button.parentElement.parentElement;
        var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText;
        if (title === itemTitle) {
            button.style.display = 'block';
        }
    }
}

function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal();
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItemContainer.getElementsByClassName('cart-row');
    var total = 0;
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var priceElement = cartRow.getElementsByClassName('cart-price')[0];
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
        var price = parseFloat(priceElement.innerText.replace('S.P ', ''))
        var quantity = quantityElement.value;
        total = total + (price * quantity);
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart-total-price')[0].innerText = 'S.P ' + total + '.00';
}


function purchaseClicked() {
    // Redirect to the checkout page
    window.location.href = 'checkout.html';
}

// Check if we are on the checkout page
if (window.location.pathname.endsWith('checkout.html')) {
    document.getElementById('checkout-form').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form from submitting normally
        alert('Thank you for your purchase!!!');
        // Redirect to the index page
        window.location.href = 'cart.html';
        localStorage.removeItem('cartItems'); // Clear the cart
        var cartItems = document.getElementsByClassName('cart-items')[0];
        while (cartItems.hasChildNodes()) {
            cartItems.removeChild(cartItems.firstChild)
        }
        updateCartTotal();



    });
}


