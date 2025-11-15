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


// form validation
function validateForm(formId, fields) {
  const form = document.getElementById(formId);
  if(!form) return;

  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;

    fields.forEach(f => {
      const input = document.getElementById(f.id);
      const val = input.value.trim()
      let error ="";

      if (f.required && !val) error = `${f.label} required`;
      else if (f.pattern && !f.pattern.test(val)) error = f.error;

      const msg = input.parentElement.querySelector(".error") || document.createElement("div");
      msg.className = "error"; msg.style.color = "red"; msg.textContent = error;
      if(!input.parentElement.querySelector(".error")) input.parentElement.appendChild(msg);
      if (error) valid = false;
    });

    if (valid) {
      document.querySelector(`#${formId} + .confirmation-message`).classList.add("show");
      form.reset();
    }
  });
}

validateForm("contact-form", [
  { id: "name", label: "Name", required:true},
  { id: "email", label: "Email", required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error: "Invalid email" },
  { id: "message", label: "Message", required: true}
]);

validateForm("checkout-form", [
  { id: "name", label: "Name", required: true},
  { id: "phone", label: "Phone", required: true, pattern: /^\+?\d{10,15}$/, error: "Invalid phone" },
  { id: "address", label:"Address", required: true},
  { id: "city", label:"city", required: true}
]);


//mobile Hamburger menu
const nav = document.querySelector("nav ul");
if (window.innerWidth <= 768) {
  const burger = document.createElement("button");
  burger.innerHTML = "Menu";
  burger.style = "position:absolute; right: 1rem; top: 1rem; font-size: 1.5rem; background: none; border: none;";
  document.querySelector(".header-container").appendChild(burger);

  burger.onclick = () => {
    nav.style.display = nav.style.display === "flex" ? "none" : "flex";
    nav.style.flexDirection = "column";
  };
}