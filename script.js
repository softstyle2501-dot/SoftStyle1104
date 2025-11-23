
/* script.js - SoftStyle basic cart + Razorpay demo integration
   NOTE: For production, create server-side order with Razorpay API and replace keys.
*/

/* Simple product sample - in real site these would come from database or JSON */
const sampleProducts = [
  {id:1,title:"Oversized Tee",price:350,img:"assets/" + (window.location.href.includes('assets') ? "" : "placeholder_tee.jpg")},
  {id:2,title:"Korean Mini Sling",price:499,img:"assets/" + (window.location.href.includes('assets') ? "" : "placeholder_bag.jpg")},
  {id:3,title:"Layered Necklace",price:149,img:"assets/" + (window.location.href.includes('assets') ? "" : "placeholder_neck.jpg")}
];

function $(sel){return document.querySelector(sel)}
function $all(sel){return document.querySelectorAll(sel)}

function getCart(){
  return JSON.parse(localStorage.getItem('softstyle_cart')||'[]');
}
function saveCart(c){ localStorage.setItem('softstyle_cart', JSON.stringify(c)); updateCartCount(); }

function addToCart(product){
  let cart = getCart();
  const found = cart.find(p=>p.id===product.id);
  if(found){ found.qty += 1; } else { cart.push({...product, qty:1}); }
  saveCart(cart);
  alert(product.title + " added to cart");
}

function updateCartCount(){
  const cart = getCart();
  const count = cart.reduce((s,p)=>s+p.qty,0);
  const el = document.getElementById('cart-count');
  if(el) el.textContent = count;
}

function renderProducts(){
  const container = $('#products-grid');
  if(!container) return;
  container.innerHTML = '';
  sampleProducts.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'card product';
    div.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>₹${p.price}</p>
      <div style="display:flex;gap:8px;align-items:center;">
        <span class="badge">COD Available</span>
        <button class="btn btn-primary" onclick='addToCart(${JSON.stringify(p)})'>Add to Cart</button>
      </div>
    `;
    container.appendChild(div);
  });
}

// Cart page rendering
function renderCart(){
  const container = $('#cart-items');
  if(!container) return;
  const cart = getCart();
  if(cart.length===0){ container.innerHTML = '<p>Your cart is empty</p>'; return; }
  container.innerHTML = '';
  let total = 0;
  cart.forEach(item=>{
    total += item.price * item.qty;
    const row = document.createElement('div');
    row.className = 'card';
    row.style.display='flex';
    row.style.justifyContent='space-between';
    row.style.alignItems='center';
    row.style.marginBottom='10px';
    row.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center">
        <img src="${item.img}" style="width:72px;height:72px;object-fit:cover;border-radius:8px">
        <div><strong>${item.title}</strong><div>₹${item.price} x ${item.qty}</div></div>
      </div>
      <div>
        <button onclick='changeQty(${item.id}, -1)' class="btn">-</button>
        <button onclick='changeQty(${item.id}, 1)' class="btn">+</button>
        <button onclick='removeItem(${item.id})' class="btn">Remove</button>
      </div>
    `;
    container.appendChild(row);
  });
  $('#cart-total').textContent = '₹' + total;
}

function changeQty(id, delta){
  let cart = getCart();
  cart = cart.map(it=>{ if(it.id===id){ it.qty += delta; if(it.qty<1) it.qty=1 } return it });
  saveCart(cart); renderCart();
}

function removeItem(id){
  let cart = getCart().filter(it=>it.id!==id);
  saveCart(cart); renderCart();
}

// Checkout - integrate Razorpay (client-side demo)
function checkoutWithRazorpay(e){
  e.preventDefault();
  const cart = getCart();
  if(cart.length===0){ alert("Cart empty"); return; }
  const total = cart.reduce((s,p)=>s+p.price*p.qty,0);
  // Collect customer details
  const name = $('#cust-name').value || 'Customer';
  const email = $('#cust-email').value || 'customer@example.com';
  const phone = $('#cust-phone').value || '9999999999';

  // Razorpay test key - replace with your own key and server-side order creation for production
  const rzpKey = 'rzp_test_ABC123XYZ'; // <--- REPLACE with your Razorpay KEY

  const options = {
    "key": rzpKey,
    "amount": total * 100, // in paise
    "currency": "INR",
    "name": "SoftStyle",
    "description": "Order Payment",
    "handler": function (response){
      // On success: clear cart, redirect to success page with payment details
      localStorage.removeItem('softstyle_cart');
      window.location.href = 'success.html?payment_id=' + response.razorpay_payment_id + '&amount=' + total;
    },
    "prefill": {
      "name": name,
      "email": email,
      "contact": phone
    },
    "theme": {
      "color": "#F4C9D8"
    }
  };
  const rzp = new Razorpay(options);
  rzp.open();
}

document.addEventListener('DOMContentLoaded', function(){
  updateCartCount();
  renderProducts();
  if(document.getElementById('cart-items')) renderCart();
  const checkoutForm = document.getElementById('checkout-form');
  if(checkoutForm) checkoutForm.addEventListener('submit', checkoutWithRazorpay);
});
