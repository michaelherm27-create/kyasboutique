/**
 * BoutiqueHaïti – Main App Logic
 * Handles: products, cart, checkout, payments (MonCash/NatCash), contact form
 */

// ── CONFIG ──────────────────────────────────────────
const CONFIG = { // Configuration globale pour les contacts
  whatsappNumber: '3902-8437',   // Numéro WhatsApp (sans +509)
  phone: '+509 39 02 8437',     // Téléphone de contact
  email: 'michaelherm27@gmail.com', // Email du support
  moncashNumber: '+509 46-27-0776', // Compte MonCash pour paiements
  natcashNumber: '+509 35-00-0947', // Compte NatCash pour paiements
};

// ── STATE ───────────────────────────────────────────
let currentCategory = 'all'; // Catégorie de produit sélectionnée
let selectedPayment = null;  // Méthode de paiement choisie par l'utilisateur

// ── INIT ────────────────────────────────────────────
// Exécuté une fois que le DOM est complètement chargé
document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');     // Affiche tous les produits au démarrage
  updateCartUI();            // Met à jour le compteur et total du panier
  setupScrollEffects();      // Active les animations au scroll
});

// ── PRODUCTS ────────────────────────────────────────
// Affiche les produits dans la grille en fonction de la catégorie
function renderProducts(category) {
  const grid = document.getElementById('productsGrid'); // Conteneur des produits
  const products = DB.getProducts(category);          // Récupère les produits de la catégorie
  grid.innerHTML = ''; // Vide le contenu existant

  if (products.length === 0) { // Si aucun produit trouvé
    grid.innerHTML = '<p style="text-align:center;color:var(--text-light);grid-column:1/-1;padding:3rem">Aucun produit trouvé.</p>';
    return;
  }

  // Crée une carte pour chaque produit
  products.forEach((p, i) => {
    const card = document.createElement('div');        // Crée l'élément div
    card.className = 'product-card';                   // Ajoute la classe CSS
    card.style.animationDelay = `${i * 0.07}s`;        // Décale l'animation de chaque carte
    card.style.animation = 'fadeUp .5s ease both';     // Animation d'apparition fluide
    card.innerHTML = `
      <div class="product-img" style="background:${p.bg}">
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        ${p.emoji}
      </div>
      <div class="product-info">
        <div class="product-category">${categoryLabel(p.category)}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <div class="product-price">${p.price.toLocaleString()} <small>HTG</small></div>
          <button class="btn-add" onclick="addToCart(${p.id})" title="Ajouter au panier">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Convertit le code catégorie en label avec emoji
function categoryLabel(cat) {
  const labels = { // Dictionnaire des catégories avec emojis
    alimentaire: '🍽 Alimentaire',
    artisanat: '🎨 Artisanat',
    beaute: '💆 Beauté',
    mode: '👗 Mode'
  };
  return labels[cat] || cat; // Retourne le label ou le code si non trouvé
}

// Filtre les produits par catégorie et met en surbrillance le bouton
function filterProducts(category, btn) {
  currentCategory = category;                                         // Mise à jour de la catégorie active
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); // Retire la surbrillance des autres
  btn.classList.add('active');                                        // Surbrille le bouton cliqué
  renderProducts(category);                                           // Affiche les produits de la catégorie
}

// ── CART ────────────────────────────────────────────
// Ajoute un produit au panier et affiche une notification
function addToCart(productId) {
  DB.addToCart(productId);              // Ajoute à la base de données (localStorage)
  updateCartUI();                       // Met à jour l'affichage du panier
  const p = DB.getProduct(productId);   // Récupère les détails du produit
  showToast(`${p.emoji} "${p.name}" ajouté au panier!`); // Notification de confirmation
}

// Supprime un produit du panier
function removeFromCart(productId) {
  DB.removeFromCart(productId); // Supprime de la base de données
  updateCartUI();               // Mise à jour du compteur et total
  renderCartItems();            // Réaffiche les articles du panier
}

// Ouvre ou ferme le panier (sidebar)
function toggleCart() {
  const sidebar = document.getElementById('cartSidebar'); // Récupère le panneau du panier
  const overlay = document.getElementById('cartOverlay');  // Récupère l'overlay (fond sombre)
  const isOpen = sidebar.classList.contains('open');       // Vérifie si ouvert
  if (isOpen) {
    sidebar.classList.remove('open');   // Ferme si ouvert
    overlay.classList.remove('active');
  } else {
    sidebar.classList.add('open');      // Ouvre si fermé
    overlay.classList.add('active');
    renderCartItems();                  // Affiche les articles à jour
  }
}

// Affiche tous les articles du panier
function renderCartItems() {
  const container = document.getElementById('cartItems'); // Conteneur des articles
  const cart = DB.getCart();                             // Récupère tous les articles
  if (cart.length === 0) { // Si panier vide
    container.innerHTML = `<div class="cart-empty"><i class="fas fa-shopping-bag"></i><p>Votre panier est vide</p></div>`;
    return; // Sort de la fonction
  }
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-img">${item.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${(item.price * item.qty).toLocaleString()} HTG ${item.qty > 1 ? `× ${item.qty}` : ''}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.productId})">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `).join('');
}

// Met à jour l'affichage du panier (compteur et total)
function updateCartUI() {
  const cart = DB.getCart();                                            // Récupère les articles
  const count = cart.reduce((s, i) => s + i.qty, 0);                    // Compte le nombre total (quantités)
  const total = DB.getCartTotal();                                      // Calcule le total
  document.getElementById('cartCount').textContent = count;             // Affiche le nombre d'articles
  document.getElementById('cartTotal').textContent = total.toLocaleString() + ' HTG'; // Affiche le total formaté
}

// ── CHECKOUT ────────────────────────────────────────
// Ouvre le formulaire de commande
function openCheckout() {
  const cart = DB.getCart();                                                 // Récupère le panier
  if (cart.length === 0) { showToast('Votre panier est vide!'); return; }    // Empêche le checkout si vide
  selectedPayment = null; // Réinitialise le paiement sélectionné
  document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('selected')); // Retire sélection
  document.getElementById('moncashInstructions').style.display = 'none'; // Cache les infos MonCash
  document.getElementById('natcashInstructions').style.display = 'none'; // Cache les infos NatCash
  document.getElementById('checkoutModal').classList.add('active');      // Affiche la modale
  // Ferme le panier
  document.getElementById('cartSidebar').classList.remove('open');       // Ferme le panneau du panier
  document.getElementById('cartOverlay').classList.remove('active');     // Cache l'overlay
}

// Ferme le formulaire de commande
function closeCheckout() {
  document.getElementById('checkoutModal').classList.remove('active'); // Masque la modale
}

// Gère la sélection d'une méthode de paiement (MonCash ou NatCash)
function selectPayment(method) {
  selectedPayment = method;                                                           // Stocke la méthode
  document.querySelectorAll('.payment-card').forEach(c => c.classList.remove('selected')); // Retire sélection
  document.getElementById(method + 'Card').classList.add('selected');                 // Surbrille la sélection
  const total = DB.getCartTotal().toLocaleString() + ' HTG';                          // Calcule le total
  const cart = DB.getCart();                                                          // Récupère les articles
  const items = cart.map(i => `${i.qty}x ${i.name}`).join(', ');                     // Formate la liste

  // Prépare le message WhatsApp avec les articles
  const baseMsg = encodeURIComponent(`Bonjour BoutiqueHaïti! 🛍️\n\nJe viens de passer une commande:\n${items}\n\nTotal: ${total}\nMéthode: ${method === 'moncash' ? 'MonCash' : 'NatCash'}\n\nVoici mon reçu de paiement:`);

  // Affiche ou cache les instructions selon la méthode choisie
  document.getElementById('moncashInstructions').style.display = method === 'moncash' ? 'block' : 'none';
  document.getElementById('natcashInstructions').style.display = method === 'natcash' ? 'block' : 'none';

  if (method === 'moncash') { // Si MonCash
    document.getElementById('mcAmount').textContent = total;                          // Affiche le montant
    document.getElementById('mcWhatsapp').href = `https://wa.me/${CONFIG.whatsappNumber}?text=${baseMsg}`; // Crée le lien WhatsApp
    document.getElementById('mcWhatsapp').target = '_blank';                          // Ouvre dans nouvel onglet
  } else { // Si NatCash
    document.getElementById('ncAmount').textContent = total;
    document.getElementById('ncWhatsapp').href = `https://wa.me/${CONFIG.whatsappNumber}?text=${baseMsg}`;
    document.getElementById('ncWhatsapp').target = '_blank';
  }
}

// Confirme la commande et envoie les détails par WhatsApp
function confirmOrder() {
  // Récupère et nettoie les informations du client
  const name = document.getElementById('custName').value.trim();      // Nom
  const phone = document.getElementById('custPhone').value.trim();    // Téléphone
  const address = document.getElementById('custAddress').value.trim(); // Adresse

  // Validation des champs obligatoires
  if (!name) { showToast('⚠️ Veuillez entrer votre nom.'); return; }
  if (!phone) { showToast('⚠️ Veuillez entrer votre téléphone.'); return; }
  if (!address) { showToast('⚠️ Veuillez entrer votre adresse.'); return; }
  if (!selectedPayment) { showToast('⚠️ Choisissez une méthode de paiement.'); return; }

  const cart = DB.getCart();     // Récupère les articles
  const total = DB.getCartTotal(); // Calcule le total

  // Crée une commande dans la base de données
  const order = DB.createOrder({
    customer: { name, phone, address }, // Infos du client
    items: cart,                        // Articles commandés
    total,                              // Montant total
    paymentMethod: selectedPayment,     // Méthode de paiement
  });

  // Prépare le message WhatsApp détaillé avec emojis
  const items = cart.map(i => `  • ${i.qty}x ${i.name} – ${(i.price * i.qty).toLocaleString()} HTG`).join('\n'); // Liste formatée
  const waMsg = encodeURIComponent(
    `🛍️ *NOUVELLE COMMANDE – BoutiqueHaïti*\n\n` +
    `📋 N° Commande: ${order.id}\n` +
    `👤 Client: ${name}\n` +
    `📞 Tél: ${phone}\n` +
    `📍 Adresse: ${address}\n\n` +
    `🛒 Articles:\n${items}\n\n` +
    `💰 Total: ${total.toLocaleString()} HTG\n` +
    `💳 Paiement: ${selectedPayment === 'moncash' ? 'MonCash' : 'NatCash'}\n\n` +
    `Merci de confirmer la réception du paiement et la date de livraison. 🙏`
  );

  // Ouvre WhatsApp automatiquement avec les détails de la commande
  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${waMsg}`, '_blank');

  DB.clearCart();      // Vide le panier
  updateCartUI();      // Rafraîchit l'affichage
  closeCheckout();     // Ferme la modale

  // Affiche le message de succès avec infos de la commande
  document.getElementById('successMessage').textContent =
    `Votre commande a été enregistrée. Complétez votre paiement via ${selectedPayment === 'moncash' ? 'MonCash' : 'NatCash'} et envoyez votre reçu sur WhatsApp pour confirmer la livraison.`;
  document.getElementById('orderId').textContent = order.id;               // Affiche le n° de commande
  document.getElementById('successModal').classList.add('active');         // Affiche la modale de succès

  // Réinitialise le formulaire
  ['custName', 'custPhone', 'custAddress'].forEach(id => document.getElementById(id).value = ''); // Vide les champs
  selectedPayment = null; // Réinitialise le paiement
}

// Ferme la modale de succès
function closeSuccess() {
  document.getElementById('successModal').classList.remove('active'); // Masque la modale
}

// ── CONTACT FORM ────────────────────────────────────
// Traite la soumission du formulaire de contact
function submitContact(e) {
  e.preventDefault(); // Arrête le rechargement automatique
  // Récupère les données du formulaire
  const name = document.getElementById('cName').value.trim();      // Nom
  const phone = document.getElementById('cPhone').value.trim();    // Téléphone
  const email = document.getElementById('cEmail').value.trim();    // Email
  const message = document.getElementById('cMessage').value.trim(); // Message

  // Sauvegarde le message dans la base de données (localStorage)
  DB.saveMessage({ name, phone, email, message });

  // Envoie aussi un message par WhatsApp
  const waMsg = encodeURIComponent(`📩 *Message de Contact – BoutiqueHaïti*\n\n👤 Nom: ${name}\n📞 Tél: ${phone}\n📧 Email: ${email || 'Non fourni'}\n\n💬 Message:\n${message}`);
  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${waMsg}`, '_blank'); // Ouvre WhatsApp

  // Affiche le message de succès
  document.getElementById('contactForm').style.display = 'none';   // Cache le formulaire
  document.getElementById('formSuccess').style.display = 'block';  // Affiche le message de confirmation
  showToast('✅ Message envoyé avec succès!');                      // Notification toast

  // Réinitialise après 6 secondes
  setTimeout(() => {
    document.getElementById('contactForm').reset();                // Vide les champs
    document.getElementById('contactForm').style.display = 'block'; // Réaffiche le formulaire
    document.getElementById('formSuccess').style.display = 'none';  // Cache le message de succès
  }, 6000);
}

// ── NAV ─────────────────────────────────────────────
// Ouvre/ferme le menu mobile (hamburger menu)
function toggleNav() {
  document.getElementById('mobileNav').classList.toggle('open'); // Ajoute/retire la classe 'open'
}

// ── SCROLL EFFECTS ──────────────────────────────────
// Active les effets visuels lors du scroll (ombre navbar + animations)
function setupScrollEffects() {
  const navbar = document.querySelector('.navbar'); // Récupère la navbar
  // Ajoute une ombre quand on scroll
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 40 ? '0 4px 30px rgba(0,0,0,0.3)' : 'none'; // Ombre après 40px
  });

  // Intersection Observer = déclenche animation quand élément visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.style.animation = 'fadeUp .6s ease both'; // Animation fade-in
    });
  }, { threshold: 0.1 }); // threshold: 10% de l'élément visible

  // Observe les éléments qui doivent s'animer au scroll
  document.querySelectorAll('.contact-card, .feature-item, .about-feature').forEach(el => observer.observe(el));
}

// ── TOAST ───────────────────────────────────────────
// Affiche une notification temporaire en bas de l'écran
function showToast(msg) {
  const t = document.getElementById('toast'); // Récupère l'élément toast
  t.textContent = msg;                       // Ajoute le message
  t.classList.add('show');                   // Affiche la notification (animation)
  setTimeout(() => t.classList.remove('show'), 3200); // La cache après 3.2 secondes
}
