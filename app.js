/**
 * KIA'S WIGS AND BEAUTY – App Logic
 */

// Configuration globale de l'application
const CONFIG = {
  whatsappNumber: '50912345678',
  phone: '+509 12 34 5678',
  email: 'contact@kiaswigsandbeauty.com',
  moncashNumber: '+509 37-00-0000',
  natcashNumber: '+509 36-00-0000',
};

// Variable pour stocker le paiement sélectionné
let selectedPayment = null;

// Initialisation de l'application au chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();  // Étape 1: Afficher tous les produits
  updateCartUI();    // Étape 2: Mettre à jour l'interface du panier
  setupScrollEffects(); // Étape 3: Configurer les effets de défilement
});

// ── PRODUCTS ──────────────────────────────────────
function renderProducts() {
  // Étape 1: Récupérer le conteneur de la grille de produits
  const grid = document.getElementById('productsGrid');
  
  // Étape 2: Obtenir la liste des produits depuis la base de données
  const products = DB.getProducts();
  
  // Étape 3: Vider le conteneur avant de le remplir
  grid.innerHTML = '';
  
  // Étape 4: Créer et ajouter chaque carte de produit
  products.forEach((p, i) => {
    // Créer l'élément de carte
    const card = document.createElement('div');
    card.className = 'product-card';
    
    // Ajouter un délai d'animation pour chaque carte
    card.style.cssText = `animation-delay:${i * 0.06}s; animation: fadeUp .5s ease both`;
    
    // Générer le HTML de la carte avec les informations du produit
    card.innerHTML = `
      <div class="product-img-wrap">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <img src="${p.img}" alt="${p.name}" class="product-photo" onclick="openLightbox('${p.img}','${p.name}')" loading="lazy" />
        <div class="img-overlay"><i class="fas fa-search-plus"></i></div>
      </div>
      <div class="product-info">
        <div class="product-type">${p.type}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-length"><i class="fas fa-ruler-horizontal"></i> ${p.length}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <div class="product-price">${p.price.toLocaleString()} <small>HTG</small></div>
          <button class="btn-add" onclick="addToCart(${p.id})" title="Ajouter au panier"><i class="fas fa-shopping-bag"></i></button>
        </div>
      </div>
    `;
    
    // Étape 5: Ajouter la carte à la grille
    grid.appendChild(card);
  });
}

// ── LIGHTBOX ──────────────────────────────────────
function openLightbox(src, alt) {
  // Étape 1: Définir la source et l'alt de l'image dans la lightbox
  document.getElementById('lbImg').src = src;
  document.getElementById('lbImg').alt = alt;
  
  // Étape 2: Activer la lightbox (afficher la modale)
  document.getElementById('lightbox').classList.add('active');
  
  // Étape 3: Désactiver le défilement du body pour éviter les conflits
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  // Étape 1: Désactiver la lightbox (cacher la modale)
  document.getElementById('lightbox').classList.remove('active');
  
  // Étape 2: Réactiver le défilement du body
  document.body.style.overflow = '';
}

// ── CART ──────────────────────────────────────────
function addToCart(productId) {
  // Étape 1: Ajouter le produit au panier via la base de données
  DB.addToCart(productId);
  
  // Étape 2: Mettre à jour l'interface du panier (compteur, total)
  updateCartUI();
  
  // Étape 3: Récupérer les informations du produit pour le message
  const p = DB.getProduct(productId);
  
  // Étape 4: Afficher un message de confirmation
  showToast(`✅ "${p.name}" ajouté au panier!`);
}

function removeFromCart(productId) {
  // Étape 1: Supprimer le produit du panier
  DB.removeFromCart(productId);
  
  // Étape 2: Mettre à jour l'interface du panier
  updateCartUI();
  
  // Étape 3: Re-rendre les éléments du panier
  renderCartItems();
}

function toggleCart() {
  // Étape 1: Récupérer les éléments du DOM
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  
  // Étape 2: Vérifier si le panier est ouvert
  const isOpen = sidebar.classList.contains('open');
  
  // Étape 3: Basculer l'état du panier
  if (isOpen) {
    // Fermer le panier
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  } else {
    // Ouvrir le panier et afficher les éléments
    sidebar.classList.add('open');
    overlay.classList.add('active');
    renderCartItems();
  }
}

function renderCartItems() {
  // Étape 1: Récupérer le conteneur des éléments du panier
  const container = document.getElementById('cartItems');
  
  // Étape 2: Obtenir le contenu du panier
  const cart = DB.getCart();
  
  // Étape 3: Vérifier si le panier est vide
  if (cart.length === 0) {
    container.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Votre panier est vide</p></div>`;
    return;
  }
  
  // Étape 4: Générer le HTML pour chaque élément du panier
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}" class="cart-item-img" />
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${(item.price * item.qty).toLocaleString()} HTG ${item.qty > 1 ? `× ${item.qty}` : ''}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.productId})"><i class="fas fa-trash"></i></button>
    </div>
  `).join('');
}

function updateCartUI() {
  // Étape 1: Récupérer le contenu du panier
  const cart = DB.getCart();
  
  // Étape 2: Calculer le nombre total d'articles
  const count = cart.reduce((s, i) => s + i.qty, 0);
  
  // Étape 3: Mettre à jour l'affichage du compteur et du total
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = DB.getCartTotal().toLocaleString() + ' HTG';
}

// ── CHECKOUT ──────────────────────────────────────
function openCheckout() {
  // Étape 1: Vérifier que le panier n'est pas vide
  if (DB.getCart().length === 0) {
    showToast('⚠️ Votre panier est vide!');
    return;
  }
  
  // Étape 2: Réinitialiser la sélection de paiement
  selectedPayment = null;
  document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('selected'));
  
  // Étape 3: Cacher les instructions de paiement
  document.getElementById('moncashInstructions').style.display = 'none';
  document.getElementById('natcashInstructions').style.display = 'none';
  
  // Étape 4: Ouvrir la modale de checkout
  document.getElementById('checkoutModal').classList.add('active');
  
  // Étape 5: Fermer le sidebar du panier
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('active');
}

function closeCheckout() {
  // Fermer la modale de checkout
  document.getElementById('checkoutModal').classList.remove('active');
}

function selectPayment(method) {
  // Étape 1: Enregistrer la méthode de paiement sélectionnée
  selectedPayment = method;
  
  // Étape 2: Mettre à jour l'interface pour montrer la sélection
  document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('selected'));
  document.getElementById(method + 'Card').classList.add('selected');
  
  // Étape 3: Calculer le total et préparer les informations de commande
  const total = DB.getCartTotal().toLocaleString() + ' HTG';
  const cart = DB.getCart();
  const items = cart.map(i => `${i.qty}x ${i.name}`).join(', ');
  
  // Étape 4: Préparer le message de base pour WhatsApp
  const baseMsg = encodeURIComponent(`Bonjour KIA'S WIGS AND BEAUTY! 💆‍♀️\n\nCommande:\n${items}\n\nTotal: ${total}\nPaiement: ${method === 'moncash' ? 'MonCash' : 'NatCash'}\n\nVoici mon reçu:`);
  
  // Étape 5: Afficher les instructions appropriées selon la méthode
  document.getElementById('moncashInstructions').style.display = method === 'moncash' ? 'block' : 'none';
  document.getElementById('natcashInstructions').style.display = method === 'natcash' ? 'block' : 'none';
  
  // Étape 6: Configurer les liens WhatsApp selon la méthode
  if (method === 'moncash') {
    document.getElementById('mcAmount').textContent = total;
    document.getElementById('mcWhatsapp').href = `https://wa.me/${CONFIG.whatsappNumber}?text=${baseMsg}`;
  } else {
    document.getElementById('ncAmount').textContent = total;
    document.getElementById('ncWhatsapp').href = `https://wa.me/${CONFIG.whatsappNumber}?text=${baseMsg}`;
  }
}

function confirmOrder() {
  // Étape 1: Récupérer et valider les informations du client
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  
  // Validation des champs obligatoires
  if (!name) { showToast('⚠️ Veuillez entrer votre nom.'); return; }
  if (!phone) { showToast('⚠️ Veuillez entrer votre téléphone.'); return; }
  if (!address) { showToast('⚠️ Veuillez entrer votre adresse.'); return; }
  if (!selectedPayment) { showToast('⚠️ Choisissez une méthode de paiement.'); return; }
  
  // Étape 2: Récupérer les informations de la commande
  const cart = DB.getCart();
  const total = DB.getCartTotal();
  
  // Étape 3: Créer la commande dans la base de données
  const order = DB.createOrder({
    customer: { name, phone, address },
    items: cart,
    total,
    paymentMethod: selectedPayment
  });
  
  // Étape 4: Préparer le message WhatsApp détaillé
  const items = cart.map(i => `  • ${i.qty}x ${i.name} – ${(i.price * i.qty).toLocaleString()} HTG`).join('\n');
  const waMsg = encodeURIComponent(
    `👑 *NOUVELLE COMMANDE – KIA'S WIGS AND BEAUTY*\n\n` +
    `📋 N° Commande: ${order.id}\n👤 Cliente: ${name}\n📞 Tél: ${phone}\n📍 Adresse: ${address}\n\n` +
    `🛍️ Produits:\n${items}\n\n💰 Total: ${total.toLocaleString()} HTG\n💳 Paiement: ${selectedPayment === 'moncash' ? 'MonCash' : 'NatCash'}\n\nMerci de confirmer! 🙏`
  );
  
  // Étape 5: Ouvrir WhatsApp avec le message
  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${waMsg}`, '_blank');
  
  // Étape 6: Nettoyer l'état de l'application
  DB.clearCart();
  updateCartUI();
  closeCheckout();
  
  // Étape 7: Afficher le message de succès
  document.getElementById('successMessage').textContent = `Complétez votre paiement ${selectedPayment === 'moncash' ? 'MonCash' : 'NatCash'} et envoyez votre reçu sur WhatsApp pour confirmer la livraison.`;
  document.getElementById('orderId').textContent = order.id;
  document.getElementById('successModal').classList.add('active');
  
  // Étape 8: Réinitialiser le formulaire
  ['custName', 'custPhone', 'custAddress'].forEach(id => document.getElementById(id).value = '');
  selectedPayment = null;
}

function closeSuccess() {
  // Fermer la modale de succès
  document.getElementById('successModal').classList.remove('active');
}

// ── CONTACT ──────────────────────────────────────
function submitContact(e) {
  // Empêcher le rechargement de la page
  e.preventDefault();
  
  // Récupérer et nettoyer les valeurs du formulaire
  const name = document.getElementById('cName').value.trim();
  const phone = document.getElementById('cPhone').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const message = document.getElementById('cMessage').value.trim();
  
  // Sauvegarder le message dans la base de données
  DB.saveMessage({ name, phone, email, message });
  
  // Préparer le message WhatsApp
  const waMsg = encodeURIComponent(`📩 *Message – KIA'S WIGS AND BEAUTY*\n\n👤 Nom: ${name}\n📞 Tél: ${phone}\n📧 Email: ${email || 'N/A'}\n\n💬 Message:\n${message}`);
  
  // Ouvrir WhatsApp avec le message
  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${waMsg}`, '_blank');
  
  // Afficher le message de succès
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
  showToast('✅ Message envoyé!');
  
  // Réinitialiser le formulaire après 6 secondes
  setTimeout(() => {
    document.getElementById('contactForm').reset();
    document.getElementById('contactForm').style.display = 'block';
    document.getElementById('formSuccess').style.display = 'none';
  }, 6000);
}

// ── NAVIGATION ────────────────────────────────────
function toggleNav() {
  // Basculer l'état du menu mobile
  document.getElementById('mobileNav').classList.toggle('open');
}

function setupScrollEffects() {
  // Récupérer l'élément navbar
  const navbar = document.getElementById('navbar');
  
  // Ajouter un effet de scroll à la navbar
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ── NOTIFICATIONS ─────────────────────────────────
function showToast(msg) {
  // Récupérer l'élément toast
  const t = document.getElementById('toast');
  
  // Définir le message et afficher le toast
  t.textContent = msg;
  t.classList.add('show');
  
  // Masquer le toast après 3.2 secondes
  setTimeout(() => t.classList.remove('show'), 3200);
}
