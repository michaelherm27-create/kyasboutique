/**
 * BoutiqueHaïti – Database (localStorage backend)
 * Simulates a real backend database for:
 *  - Products catalog
 *  - Customer orders
 *  - Contact messages
 *  - Payment records
 */

const DB = { // Objet principal qui simule la base de données
  // ── CONFIG ──────────────────────────────────────
  // Clés pour stocker les données dans localStorage
  KEYS: {
    ORDERS: 'bh_orders',     // Clé pour les commandes
    MESSAGES: 'bh_messages', // Clé pour les messages de contact
    CART: 'bh_cart',         // Clé pour le panier
  },

  // ── HELPERS ─────────────────────────────────────
  // Récupère les données depuis localStorage
  _get(key) {
    try { return JSON.parse(localStorage.getItem(key)) || []; } // Parse JSON ou retourne arr vide
    catch { return []; } // Si erreur, retourne arr vide
  },
  
  // Sauvegarde les données dans localStorage
  _set(key, data) {
    localStorage.setItem(key, JSON.stringify(data)); // Convertit en JSON et stocke
  },
  
  // Génère un ID unique pour chaque commande ou message
  _id() {
    return 'BH-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2,5).toUpperCase();
    // Format: BH-TIMESTAMP-RANDOM (ex: BH-ABCD1234-XYZ)
  },

  // ── PRODUCTS ────────────────────────────────────
  // Catalogue statique de tous les produits
  products: [
    { id: 1, name: 'Cheveux 100% Humain', category: 'beaute', price: 1200, currency: 'HTG', emoji: '🥃', bg: '#FFF3E0', desc: 'les cheveux sont de bonne qualité, vous trouverez ce qui vous plait.', badge: 'Best-seller' },
    { id: 2, name: 'Café Haïtien Premium', category: 'alimentaire', price: 850, currency: 'HTG', emoji: '☕', bg: '#EFEBE9', desc: 'Café de montagne 100% arabica des Bleus de la Selle. Torréfié artisanalement.', badge: null },
    { id: 3, name: 'Tableau Acrylique Haïtien', category: 'artisanat', price: 4500, currency: 'HTG', emoji: '🎨', bg: '#F3E5F5', desc: "Peinture originale représentant la vie quotidienne haïtienne. Pièce unique.", badge: 'Unique' },
    { id: 4, name: 'Huile de Castor (Palma Christi)', category: 'beaute', price: 650, currency: 'HTG', emoji: '🌿', bg: '#E8F5E9', desc: 'Huile de ricin haïtienne pure, pressée à froid. Idéale pour cheveux et peau.', badge: null },
    { id: 5, name: 'Chapeau de Paille Artisanal', category: 'mode', price: 1800, currency: 'HTG', emoji: '👒', bg: '#FFFDE7', desc: 'Chapeau tissé à la main par des artisanes de Jacmel. 100% naturel.', badge: null },
    { id: 6, name: 'Confiture Mangue-Citron', category: 'alimentaire', price: 450, currency: 'HTG', emoji: '🥭', bg: '#FFF8E1', desc: "Confiture artisanale de mangues françaises d'Haïti, zeste de citron local.", badge: null },
    { id: 7, name: 'Sac en Raphia Naturel', category: 'mode', price: 2200, currency: 'HTG', emoji: '👜', bg: '#F1F8E9', desc: 'Sac tressé à la main en raphia naturel haïtien. Design contemporain.', badge: 'Nouveau' },
    { id: 8, name: 'Savon au Beurre de Karité', category: 'beaute', price: 350, currency: 'HTG', emoji: '🧴', bg: '#E3F2FD', desc: 'Savon naturel haïtien enrichi en beurre de karité et huile de coco.', badge: null },
    { id: 9, name: 'Sculpture en Métal Recyclé', category: 'artisanat', price: 6500, currency: 'HTG', emoji: '🗿', bg: '#ECEFF1', desc: 'Sculpture haïtienne traditionnelle en fer recyclé. Artiste de Croix-des-Bouquets.', badge: 'Art' },
    { id: 10, name: 'Piment Bouc Séché', category: 'alimentaire', price: 300, currency: 'HTG', emoji: '🌶️', bg: '#FFEBEE', desc: 'Piment bouc haïtien séché et broyé. 100% naturel, sans additifs.', badge: null },
    { id: 11, name: 'Robe Traditionnelle Madras', category: 'mode', price: 3500, currency: 'HTG', emoji: '👗', bg: '#FCE4EC', desc: 'Robe festive en tissu madras coloré. Couture haïtienne authentique.', badge: null },
    { id: 12, name: 'Huile Essentielle Vétiver', category: 'beaute', price: 950, currency: 'HTG', emoji: '🌾', bg: '#E8F5E9', desc: "L'huile de vétiver d'Haïti est reconnue comme la meilleure au monde.", badge: 'Premium' },
  ],

  // Récupère tous les produits ou filterés par catégorie
  getProducts(category = 'all') { // Par défaut retourne tous
    if (category === 'all') return this.products; // Si 'all', retourne tout
    return this.products.filter(p => p.category === category); // Filtre par catégorie
  },

  // Récupère un produit spécifique par son ID
  getProduct(id) {
    return this.products.find(p => p.id === id); // Cherche le produit avec cet ID
  },

  // ── CART ────────────────────────────────────────
  // Récupère le panier actuel du localStorage
  getCart() { return this._get(this.KEYS.CART); },

  // Ajoute un produit au panier (ou augmente la quantité si déjà présent)
  addToCart(productId, qty = 1) {
    const cart = this.getCart();                             // Récupère le panier
    const product = this.getProduct(productId);              // Cherche le produit
    if (!product) return null;                               // Si produit inexistant, arrête
    const existing = cart.find(i => i.productId === productId); // Vérifie si déjà dans panier
    if (existing) {
      existing.qty += qty;  // Si déjà présent, augmente quantité
    } else {
      // Sinon, ajoute un nouvel article
      cart.push({ productId, name: product.name, price: product.price, emoji: product.emoji, qty });
    }
    this._set(this.KEYS.CART, cart); // Sauvegarde le panier modifié
    return cart;
  },

  // Supprime un produit du panier
  removeFromCart(productId) {
    const cart = this.getCart().filter(i => i.productId !== productId); // Filtre pour exclure le produit
    this._set(this.KEYS.CART, cart); // Sauvegarde le panier modifié
    return cart;
  },

  // Vide complètement le panier
  clearCart() { this._set(this.KEYS.CART, []); },

  // Calcule le montant total du panier
  getCartTotal() {
    return this.getCart().reduce((sum, i) => sum + i.price * i.qty, 0); // Somme (prix x quantité) pour chaque article
  },

  // ── ORDERS ──────────────────────────────────────
  // Crée une nouvelle commande et l'enregistre
  createOrder({ customer, items, total, paymentMethod }) {
    const orders = this._get(this.KEYS.ORDERS);          // Récupère toutes les commandes
    const order = {                                       // Crée l'objet commande
      id: this._id(),                                     // Génère un ID unique
      customer,                                           // Infos du client
      items,                                              // Articles commandés
      total,                                              // Montant total
      paymentMethod,                                      // Méthode de paiement (MonCash/NatCash)
      status: 'pending_payment',                          // Statut initial
      createdAt: new Date().toISOString(),               // Date et heure de création
    };
    orders.push(order);                                   // Ajoute à la liste
    this._set(this.KEYS.ORDERS, orders);                // Sauvegarde
    return order;                                         // Retourne la commande créée
  },

  // Récupère toutes les commandes
  getOrders() { return this._get(this.KEYS.ORDERS); },

  // ── MESSAGES ────────────────────────────────────
  // Sauvegarde un nouveau message de contact
  saveMessage({ name, phone, email, message }) {
    const messages = this._get(this.KEYS.MESSAGES);     // Récupère tous les messages
    const msg = {                                        // Crée l'objet message
      id: this._id(),                                    // Génère un ID unique
      name, phone, email, message,                       // Données du message
      createdAt: new Date().toISOString(),              // Date et heure
      read: false,                                       // Non lu au départ
    };
    messages.push(msg);                                  // Ajoute à la liste
    this._set(this.KEYS.MESSAGES, messages);           // Sauvegarde
    return msg;                                          // Retourne le message créé
  },

  // Récupère tous les messages de contact
  getMessages() { return this._get(this.KEYS.MESSAGES); },
};

// Expose DB globalement (accessible depuis app.js)
window.DB = DB;
