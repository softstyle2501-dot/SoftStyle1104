
SoftStyle - Static site (Ready for GitHub Pages)
===============================================

This folder contains a demo static e-commerce site (SoftStyle) with a simple JS cart and Razorpay Checkout integration (client-side demo).

Files:
- index.html, shop.html, cart.html, checkout.html, about.html, contact.html, success.html
- style.css
- script.js
- assets/ (place hero and product images here)

Razorpay Integration Notes:
- This example uses client-side Razorpay Checkout with a demo key in script.js (rzp_test_ABC123XYZ).
- For production you MUST create orders server-side using Razorpay Orders API and use the generated order_id in the checkout.
- Replace the rzpKey variable in script.js with your actual Razorpay key and implement server order creation.

Deploy to GitHub Pages:
1. Zip this folder (softstyle-site.zip).
2. Create a GitHub repository.
3. Upload all files to the repository's main branch (or gh-pages branch).
4. In repository settings, enable GitHub Pages for the branch and root folder.
5. Visit yourusername.github.io/repo-name to see the site.

If you want, I can:
- generate real product images and banners,
- add server-side (Node.js) Razorpay order creation code,
- or deploy the site to GitHub for you with step-by-step commands.
