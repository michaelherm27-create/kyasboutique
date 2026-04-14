# BoutiqueHaïti – E-Commerce Website

## Structure des Fichiers
```
ecommerce/
├── index.html    → Page principale (toute la structure HTML)
├── style.css     → Styles (thème or, vert, crème)
├── db.js         → Base de données (localStorage)
└── app.js        → Logique de l'application
```

## Fonctionnalités Incluses

### 🛍 Boutique
- Catalogue de 12 produits haïtiens
- Filtrage par catégorie (Alimentaire, Artisanat, Beauté, Mode)
- Panier d'achat avec ajout/suppression

### 💳 Paiements
- **MonCash** : Instructions détaillées + numéro marchand
- **NatCash** : Instructions *444# + numéro marchand
- Confirmation automatique via WhatsApp

### 📞 Contact
- Bouton WhatsApp flottant (toujours visible)
- Bouton Email flottant
- Bouton Téléphone flottant
- Formulaire de contact (sauvegardé en DB + envoyé sur WhatsApp)

### 🗄 Base de Données (localStorage)
- `bh_orders` → Toutes les commandes
- `bh_messages` → Messages de contact
- `bh_cart` → Panier en cours

## Configuration (app.js, lignes 8-14)
```javascript
const CONFIG = {
  whatsappNumber: '50912345678',   // ← Votre numéro WhatsApp
  phone: '+509 12 34 5678',        // ← Votre numéro affiché
  email: 'contact@boutiquehaiti.com',
  moncashNumber: '+509 37-00-0000', // ← Votre numéro MonCash marchand
  natcashNumber: '+509 36-00-0000', // ← Votre numéro NatCash marchand
};
```

## Ajouter des Produits (db.js)
Ajoutez un objet dans le tableau `products` :
```javascript
{ 
  id: 13, 
  name: 'Nom du Produit', 
  category: 'alimentaire', // alimentaire | artisanat | beaute | mode
  price: 500,              // En HTG
  currency: 'HTG', 
  emoji: '🍫', 
  bg: '#FFF3E0',           // Couleur de fond de la carte
  desc: 'Description courte...', 
  badge: null              // ou 'Nouveau', 'Best-seller', etc.
}
```

## Déploiement
Uploadez les 4 fichiers sur n'importe quel hébergeur web :
- **Netlify Drop** (gratuit) : drag & drop du dossier
- **GitHub Pages** (gratuit)
- **cPanel/FTP** : upload vers `public_html/`

## Intégration Paiement Réelle (Optionnel)
Pour une intégration API officielle MonCash, contactez :
- **MonCash Marchand** : moncashbusiness.com
- **NatCash Marchand** : natcash.ht
