/**
 * KIA'S WIGS AND BEAUTY – Database (localStorage)
 * Produits: 11 vraies perruques avec photos
 */

// Objet principal de gestion de la base de données
const DB = {
  // Clés utilisées pour le localStorage
  KEYS: { ORDERS: 'gh_orders', MESSAGES: 'gh_messages', CART: 'gh_cart' },
  
  // Méthode utilitaire pour récupérer des données du localStorage
  _get(key) { 
    try { 
      return JSON.parse(localStorage.getItem(key)) || []; 
    } catch { 
      return []; 
    } 
  },
  
  // Méthode utilitaire pour sauvegarder des données dans le localStorage
  _set(key, data) { 
    localStorage.setItem(key, JSON.stringify(data)); 
  },
  
  // Générateur d'ID unique pour les commandes et messages
  _id() { 
    return 'GH-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2,5).toUpperCase(); 
  },

  // Liste des produits disponibles
  products: [
    {
      id: 1, name: 'Body Wave Longue – Lace Front',
      type: 'Lace Front · Body Wave',
      length: '22 pouces', price: 8500,
      img: "Images/cheveux_1.jpeg",
      desc: 'Perruque body wave longue et volumineuse. Cheveux humains 100% naturels. Lace front transparent invisible.',
      badge: 'Best-seller', inStock: true
    },
    {
      id: 2, name: 'Deep Wave Bob – Lace Front',
      type: 'Lace Front · Deep Wave',
      length: '14 pouces', price: 7200,
      img: 'Images/cheveux_2.jpeg',
      desc: 'Bob mi-long avec boucles deep wave définies. Lace front HD pour une coiffure naturelle.',
      badge: null, inStock: true
    },
    {
      id: 3, name: 'Kinky Curly Long – Lace Front',
      type: 'Lace Front · Kinky Curly',
      length: '18 pouces', price: 9000,
      img: 'Images/cheveux_3.jpeg',
      desc: 'Boucles kinky naturelles et volumineuses. Cheveux humains premium. Look naturel parfait.',
      badge: 'Populaire', inStock: true
    },
    {
      id: 4, name: 'Body Wave Bob – Lace Front',
      type: 'Lace Front · Body Wave',
      length: '12 pouces', price: 6500,
      img: 'Images/cheveux_4.jpeg',
      desc: 'Bob élégant avec vagues douces. Coupe chic et moderne. Parfait pour toutes les occasions.',
      badge: null, inStock: true
    },
    {
      id: 5, name: 'Curly Bob avec Frange',
      type: 'Full Machine · Curly',
      length: '12 pouces', price: 5800,
      img: 'Images/cheveux_5.jpeg',
      desc: 'Bob bouclé avec frange intégrée. Sans colle, facile à porter. Style décontracté et chic.',
      badge: 'Nouveau', inStock: true
    },
    {
      id: 6, name: 'Straight Bob Court – Lace Front',
      type: 'Lace Front · Straight',
      length: '10 pouces', price: 6200,
      img: 'Images/cheveux_6.jpeg',
      desc: 'Bob lisse court ultra chic. Cheveux lisses soyeux. Lace front HD invisible et naturel.',
      badge: null, inStock: true
    },
    {
      id: 7, name: 'Deep Curly Bob – Lace Front HD',
      type: 'Lace Front HD · Deep Curly',
      length: '14 pouces', price: 7800,
      img: 'Images/cheveux_7.jpeg',
      desc: 'Boucles deep curly denses et luxueuses. Lace HD nouvelle génération. Volume exceptionnel.',
      badge: 'Premium', inStock: true
    },
    {
      id: 8, name: 'Straight Bob Lisse – Lace Front',
      type: 'Lace Front · Straight',
      length: '12 pouces', price: 6800,
      img: 'Images/cheveux_8.jpeg',
      desc: 'Bob lisse parfaitement coupé. Cheveux naturels soyeux. Style moderne et professionnel.',
      badge: null, inStock: true
    },
    {
      id: 9, name: 'Water Wave Bob – Lace Front HD',
      type: 'Lace Front HD · Water Wave',
      length: '14 pouces', price: 7500,
      img: 'Images/cheveux_9.jpeg',
      desc: 'Ondulations water wave naturelles. Lace HD ultra-réaliste. Coiffure glamour et tendance.',
      badge: null, inStock: true
    },
    {
      id: 10, name: 'Kinky Curly Bob – Lace Front',
      type: 'Lace Front · Kinky Curly',
      length: '12 pouces', price: 7000,
      img: 'Images/cheveux_10.jpeg',
      desc: 'Boucles kinky courtes et dynamiques. Cheveux humains naturels. Style afro chic.',
      badge: null, inStock: true
    },
    {
      id: 11, name: 'Bob Coloré Ginger – Lace Front',
      type: 'Lace Front · Straight · Coloré',
      length: '10 pouces', price: 8200,
      img: 'Images/cheveux_11.jpeg',
      desc: 'Bob lisse couleur ginger/roux tendance. Cheveux humains teints professionnellement. Unique et audacieux.',
      badge: 'Exclusif', inStock: true
    },
  ],

  // ── MÉTHODES PRODUITS ──────────────────────────────
  // Retourne la liste complète des produits
  getProducts() { return this.products; },
  
  // Retourne un produit spécifique par son ID
  getProduct(id) { return this.products.find(p => p.id === id); },

  // ── MÉTHODES PANIER ────────────────────────────────
  // Retourne le contenu actuel du panier
  getCart() { return this._get(this.KEYS.CART); },
  
  // Ajoute un produit au panier (quantité par défaut = 1)
  addToCart(productId, qty = 1) {
    // Étape 1: Récupérer le panier actuel
    const cart = this.getCart();
    
    // Étape 2: Trouver le produit
    const product = this.getProduct(productId);
    if (!product) return null;
    
    // Étape 3: Vérifier si le produit est déjà dans le panier
    const existing = cart.find(i => i.productId === productId);
    
    // Étape 4: Mettre à jour la quantité ou ajouter le produit
    if (existing) { 
      existing.qty += qty; 
    } else { 
      cart.push({ productId, name: product.name, price: product.price, img: product.img, qty }); 
    }
    
    // Étape 5: Sauvegarder le panier
    this._set(this.KEYS.CART, cart);
    return cart;
  },
  
  // Supprime complètement un produit du panier
  removeFromCart(productId) {
    const cart = this.getCart().filter(i => i.productId !== productId);
    this._set(this.KEYS.CART, cart);
    return cart;
  },
  
  // Vide complètement le panier
  clearCart() { this._set(this.KEYS.CART, []); },
  
  // Calcule le total du panier
  getCartTotal() { return this.getCart().reduce((sum, i) => sum + i.price * i.qty, 0); },

  // ── MÉTHODES COMMANDES ─────────────────────────────
  // Crée une nouvelle commande
  createOrder({ customer, items, total, paymentMethod }) {
    // Étape 1: Récupérer les commandes existantes
    const orders = this._get(this.KEYS.ORDERS);
    
    // Étape 2: Créer l'objet commande
    const order = { 
      id: this._id(), 
      customer, 
      items, 
      total, 
      paymentMethod, 
      status: 'pending_payment', 
      createdAt: new Date().toISOString() 
    };
    
    // Étape 3: Ajouter et sauvegarder
    orders.push(order);
    this._set(this.KEYS.ORDERS, orders);
    return order;
  },

  // ── MÉTHODES MESSAGES ──────────────────────────────
  // Sauvegarde un message de contact
  saveMessage({ name, phone, email, message }) {
    // Étape 1: Récupérer les messages existants
    const messages = this._get(this.KEYS.MESSAGES);
    
    // Étape 2: Créer l'objet message
    const msg = { 
      id: this._id(), 
      name, 
      phone, 
      email, 
      message, 
      createdAt: new Date().toISOString(), 
      read: false 
    };
    
    // Étape 3: Ajouter et sauvegarder
    messages.push(msg);
    this._set(this.KEYS.MESSAGES, messages);
    return msg;
  },
};

// Exposer l'objet DB globalement pour l'utiliser dans app.js
window.DB = DB;
