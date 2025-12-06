# Banque Académique

Système de gestion bancaire pour les établissements académiques avec deux interfaces : Panel Académique et Panel Établissement.

## 📁 Structure du site

- `index.html` - Page de connexion
- `dashboard-academique.html` - Panel académique
- `dashboard-etablissement.html` - Panel établissement
- `data.js` - Gestion des données (localStorage)
- `auth.js` - Système d'authentification
- `app.js` - Gestion de la page de connexion
- `dashboard-academique.js` - Logique du panel académique
- `dashboard-etablissement.js` - Logique du panel établissement
- `style.css` - Styles CSS

## 🔐 Comptes de démonstration

### Panel Académique
- **Nom d'utilisateur :** `admin`
- **Mot de passe :** `admin123`

### Panel Établissement
- **Nom d'utilisateur :** `college`
- **Mot de passe :** `college123`

## ✨ Fonctionnalités

### Panel Académique

1. **💸 Gestion Virements**
   - Voir tous les virements
   - Supprimer des virements

2. **➕ Créer Virement**
   - Créer des virements entre comptes
   - Vérification des soldes

3. **👥 Gestion Utilisateurs**
   - Créer de nouveaux utilisateurs
   - Voir tous les utilisateurs
   - Supprimer des utilisateurs

4. **💳 Générer Cartes**
   - Générer des cartes bleues (débit/crédit)
   - Numéro de carte, CVV, date d'expiration

5. **💰 Générer Argent**
   - Ajouter de l'argent à n'importe quel compte
   - Historique des ajouts

6. **📊 Soldes Comptes**
   - Voir le solde de tous les comptes

7. **📜 Historique Paiements**
   - Voir toutes les transactions
   - Filtrer par compte et date

### Panel Établissement

1. **💸 Créer Virement Employés**
   - Créer des virements depuis le compte du collège vers les employés

2. **💰 Gérer l'Argent du Collège**
   - Voir le solde du compte
   - Effectuer des dépôts et retraits

3. **👥 Employés**
   - Ajouter des employés
   - Voir la liste des employés avec leurs comptes
   - Supprimer des employés

4. **📜 Historique**
   - Voir l'historique des opérations du collège
   - Filtrer par type d'opération

## 🚀 Utilisation

1. Ouvrez `index.html` dans un navigateur web
2. Connectez-vous avec l'un des comptes de démonstration
3. Vous serez redirigé vers le dashboard correspondant à votre type d'utilisateur

## 💾 Stockage des données

Les données sont stockées dans le **localStorage** du navigateur. Cela signifie :
- Les données persistent entre les sessions
- Chaque navigateur a ses propres données
- Pour réinitialiser, videz le localStorage du navigateur

## 🎨 Design

- Interface moderne et professionnelle
- Design responsive (mobile, tablette, desktop)
- Navigation intuitive avec menu latéral
- Couleurs distinctes pour chaque type d'opération

## ⚠️ Note

Ce système utilise de la **fausse monnaie** pour la démonstration. Toutes les transactions sont simulées et stockées localement dans le navigateur.

## 🔧 Personnalisation

Vous pouvez modifier les comptes par défaut dans `data.js` dans la fonction `initData()`.

