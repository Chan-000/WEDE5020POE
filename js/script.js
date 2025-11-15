// script.js working search filter
console.log("script.js loaded");

// wait for the page to fully load
document.addEventListener("DOMContentLoaded", function() {
  console.log("page loaded. Ready to search.");

  //check if input exists
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) {
    console.error("ERROR: #searchInput not found");
    return; 
  }

  //check if products exists
  const products = document.querySelectorAll(".product-item");
  if (products.length == 0) {
    console.error("Error: no .product-item found!");
    return;
  }

  //search function
  window.filterProducts = function () {
    const searchInput = searchInput.value.toLowerCase();
    console.log("searching for: ", input);

    products.forEach(product => {
      const text = product.textContent.toLowerCase();
      if (text.includes(input)) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });
  };
  filterProducts();s

});

//accordion - works immediately
document.querySelectorAll('.accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const panel = btn.nextElementSibling;
    const icon = btn.querySelector('i');
    panel.classList.toggle('show');
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
  });
});

// addtocart
let cart = JSON.parse(localStorage.getItem("petCart")) || [];

function saveCart() {
  localStorage.setItem("petCart", JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById("cartBadge");
  if(badge) badge.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
}

window.addToCart = function (btn) {
  const card = btn.closest(".product-card");
  const name = card.querySelector(".product-name").textContent;
  const price = parseInt(card.querySelector(".product-price").textContent.match(/R(\d+)/)[1]);

  const existing = cart.find(item => item.name === name);
  if(existing) existing.qty++;
  else cart.push({name, price, qty: 1});

  saveCart();
  alert(`${name} added!`);
};

//dynamic checkout summary
function updateCheckoutSummary() {
  const list = document.getElementById("cartItems");
  if(!list) return;

  list.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, i) => {
    subtotal += item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `${item.name} x${item.qty} - R${item.price * item.qty} 
      <button onclick="removeFromCart(${i})" style="color:red; border:none; background:none;">×</button>`;
    list.appendChild(li);
  });

  const shipping = subtotal > 500 ? 0 : 20;
  document.querySelector(".oder-summary-card p:nth-of-type(1)")?.insertAdjacentHTML("afterend",
    `<p><b>Shipping:</b> R${shipping} ${subtotal > 500 ? "(Free)" : ""}</p>`
  );
   document.querySelector(".total-price").textContent = `R${subtotal + shipping}`;
}

window.removeFromCart = function(i) {
  cart.splice(i, 1);
  saveCart();
  updateCheckoutSummary();
};
//run on load
document.addEventListener("DOMContentLoaded", updateCheckoutSummary);