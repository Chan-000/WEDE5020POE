console.log("Script.js loaded")

//runs when page loads
document.addEventListener("DOMContentLoaded", () =>{
  console.log("page fully loaded");

  initSearch();
  initAccordion();
  updateCheckoutSummary();
  initFormValidation();
  initHamburgerMenu();
});


//------------------------------
// SEARCH FUNCTION
//------------------------------
function initSearch() {
  const searchInput = document.getElementById("searchInput");
  const products = document.querySelectorAll(".products-item");

  if (!searchInput || products.length === 0 ) return;

  function filterProducts() {
    const query = searchInput.value.toLowerCase().trim();

    products.forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(query) ? "" : "none";
    });
  }

  searchInput.addEventListener("input", filterProducts);
}


//--------------------------------
//ACCORDION
//--------------------------------
function initAccordion() {
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.nextElementSibling;
      const icon = btn.querySelector('i');

      panel.classList.toggle('show');
      icon.classList.toggle('fa-chevron-down');
      icon.classList.toggle('fa-chevron-up');
    });
  });
}


//-------------------------------
// CART SYSTEM
//-------------------------------
let cart = JSON.parse(localStorage.getItem("petCart")) || [];

function saveCart() {
  localStorage.setItem("petCart", JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge(){
  const badge = document.getElementById("cartBadge");
  if (badge) {
    badge.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
    
  }

}

window.addToCart = function (btn) {
  const card = btn.closest(".product-card");
  if (!card) return;
  const name = card.querySelector(".product-name").textContent;
  const price = parseInt(card.querySelector(".product-price").textContent.match(/R(\d+)/)[1]);

  const existing = cart.find(item => item.name === name);
  if(existing) existing.qty++;
  else cart.push({name, price, qty: 1});

  saveCart();
  alert(`${name} added to cart!`);
};


//---------------------------------
//DYNAMIC CHECKOUT SUMMARY
//---------------------------------
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


//-------------------------------
// FORM VALIDATION
//-------------------------------
function initFormValidation(){
  validateForm("contact-form", [
    { id: "name", label: "Name", required:true},
    { id: "email", label: "Email", required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error: "Invalid email" },
    { id: "message", label: "Message", required: true}
  ]);

  validateForm("checkout-form", [
    { id: "name", label: "Name", required: true},
    { id: "phone", label: "Phone", required: true, pattern: /^(\+27|0)[0-9]{9}$/, error: "Invalid phone" },
    { id: "address", label:"Address", required: true},
    { id: "city", label:"City", required: true},
    { id: "terms", label: "Terms & Conditions", required: true}
  ]);
}

function validateForm(formId, fields) {
  const form = document.getElementById(formId);
  if(!form) return;

  const confirmation = form.querySelector(".confirmation-message");

  form.addEventListener("submit", e => {
    e.preventDefault();

    // remove old errors
    form.querySelectorAll(".error-msg").forEach(el => el.remove());
    let valid = true;

    fields.forEach(rule => {
      const field = document.getElementById(rule.id);
      const value = field.value.trim();
      let error ="";

      //required
      if (rule.required && !value) {
        error = `${rule.label} is required.`;
      }
      // email pattern
      else if (rule.id == "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Please enter a valid email.";
      }
      // phone pattern
      else if (rule.id == "phone" && value && !/^(\+27|0)[0-9]{9}$/.test(value.replace(/\s/g, ''))) {
        error = "Invalid phone. Use +27 63 267 5678 or 0632675678";
      }
      // terms checkbox
      else if (rule.id === "terms" && !field.checked) {
        error = "You must agree to the terms";
      }

      if(error) {
        valid = false;
        const errorEl = document.createElement("div");
        errorEl.className = "error-msg";
        errorEl.style.color = "red";
        errorEl.style.fontSize = "0.9rem";
        errorEl.style.marginTop = "0.3rem";
        errorEl.textContent = error;
        field.parentElement.appendChild(errorEl);
      }    
    });

    if (valid) {
       confirmation.textContent = formId === "contact-form"
          ? "Thank you! Your message has been sent."
          : "Order placed successfully"
       confirmation.classList.add("show");
       form.reset();
       setTimeout(() => confirmation.classList.remove("show"), 5000);
    }
  });
}


//-----------------------------
//MOBILE BURGER MENU
//-----------------------------
function initHamburgerMenu(){
  if (window.innerWidth > 768) return;

  const nav = document.querySelector("nav ul");
  const header = document.querySelector(".header-container");
  if (!nav || !header) return;

  const burger = document.createElement("button");
  burger.innerHTML = "Menu";
  burger.style = "position:absolute; right:1rem; top:1rem; font-size:1.1rem; background:none; border:none;";
  header.appendChild(burger);

  burger.addEventListener("click", () => {
    const visible = nav.style.display === "flex";
    nav.style.display = visible ? "none" : "flex";
    nav.style.flexDirection = "column";
  });
}

// Open cart modal when floating is clicked
document.getElementById("floatingCart")?.addEventListener("click", () => {
  document.getElementById("cartSummaryModal").style.display = "flex";
  updateCartBadge(); // refresh content
});


//---------------------------------------
// FLY IN ANIMATION FOR PRODUCT CARDS
//---------------------------------------
document.querySelectorAll('.product-card, .product-item').forEach((card, index) =>{
  setTimeout(() => {
    card.classList.add('animate-flyin');
  }, index * 200);
});

// show button when scrolled
window.addEventListener('scroll', () => {
  document.getElementById('scrollTopBtn').style.display =
    window.scrollY > 300 ? 'block' : 'none';
});


//-------------------------------------
// DYNAMICALLY LOAD FEATURED PRODUCTS
//-------------------------------------
// DYNAMICALLY LOAD FEATURED PRODUCTS (THIS IS WHAT THEY WANT!)
const featuredProducts = [
  { name: "Crunchy Peanut & Pumpkin Bones", price: 55, img: "images/cat_food.jpg" },
  { name: "Salmon & Sweet Potato Bites", price: 85, img: "images/dog_food.jpg" },
  { name: "Chicken & Rice Training Treats", price: 65, img: "images/foood.jpg" },
  { name: "Beef Liver Snacks", price: 95, img: "images/liver.jpg" }
];

function loadFeaturedProducts() {
  const container = document.getElementById("dynamicProducts");
  if (!container) return;

  container.innerHTML = ""; // clear loading text

  featuredProducts.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.img}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
      <h3>${product.name}</h3>
      <p class="product-price">R${product.price}</p>
      <button onclick="addToCartFromFeatured('${product.name}', ${product.price})" class="add-to-cart">
        Add to Cart
      </button>
    `;
    container.appendChild(card);
  });
}

// Add this function too
window.addToCartFromFeatured = function(name, price) {
  const existing = cart.find(item => item.name === name);
  if (existing) existing.qty++;
  else cart.push({ name, price, qty: 1 });
  saveCart();
  document.getElementById("successProductName").textContent = name;
  document.getElementById("successModal").style.display = "flex";
};

// RUN IT WHEN PAGE LOADS
document.addEventListener("DOMContentLoaded", loadFeaturedProducts);
