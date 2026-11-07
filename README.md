# 🏍️ MotoTaxi — Mototaxi Booking Platform (Tunisie)

Plateforme complète de réservation de mototaxis développée selon le cahier des charges et la maquette UI (`interface.png`).

---

## 🏗️ Architecture & Technologies

| Module | Emplacement | Rôle | Technologies | Port |
|--------|-------------|------|--------------|------|
| **Frontend** | `/frontend` | Application SPA multi-rôles | Angular 17, Standalone, Leaflet, SCSS | `4200` |
| **Backend API** | `/backend-spring` | API REST & Métier | Spring Boot 3, Spring Security 6, JWT, JPA, MySQL 8 | `8080` |
| **Backend Real-time** | `/backend-express` | Suivi GPS & Notifications | Express.js, Socket.io, Node.js | `3000` |

---

## 🎨 Écrans Implémentés (Conformes à `interface.png`)

1. **Client (Écran de gauche)**
   - Barre de recherche : *"Où voulez-vous aller ? / وين تحb تمشي؟"* avec bouton jaune fléché.
   - Carte interactive Leaflet avec repères et suivi en direct.
   - Section **Derniers trajets** avec badges de prix :
     - *Avenue Habib Bourguiba* (5 - 8 TND)
     - *La Marsa* (8 - 12 TND)
   - Sélecteur de véhicule : **Moto**, **Taxi**, **Express**.
   - Bouton de confirmation jaune : **« Confirmer de 5 TND »**.
   - Bouton d'urgence **SOS**.

2. **Chauffeur (Écran du milieu - Thème sombre)**
   - En-tête noir avec toggle de rôle (`Client | Chauffeur | Admin`).
   - Salutation : *"Bonjour, Amine - Chauffeur Pro"*.
   - Toggle de statut : *"En ligne / Hors ligne"*.
   - Carte jaune : **Gains du jour — 87,5 TND**.
   - Cartes statistiques : **15 Courses** (Aujourd'hui) & **Note 4.9 ⭐⭐⭐⭐⭐**.
   - Carte de notification : **Nouvelle demande de course** (El Menzah → Centre Ville, 6,5 TND) avec boutons `[Ignorer]` et `[Accepter]`.
   - Historique des courses récentes avec horodatage.

3. **Admin (Écrans de droite)**
   - Menu latéral sombre avec navigation complète (`Tableau de bord`, `Chauffeurs`, `Courses`, `Tarifs`, `Comptes`).
   - Cartes métriques temps réel :
     - **18 Courses actives** (icône bleue)
     - **142 Chauffeurs en ligne** (icône verte)
     - **2,450 TND Revenu du jour** (icône jaune)
   - Tableau **Nouvelles demandes de chauffeurs** :
     - *Mohamed Ben Ali*, *Leila Trabelsi*, *Ahmed Hamdi*
     - Badges d'action : `[Permis]`, `[Valider]`, `[Refuser]`.
   - Gestion des tarifs au km et prix de base par type de moto.

---

## 🚀 Guide de Démarrage Rapide

### 1. Prérequis
- **Node.js** (v18+)
- **Java JDK** (v17+)
- **MySQL Server** (actif sur le port 3306, base `mototaxi_db`, user `root`, mdp `root`)

---

### 2. Lancer le Backend Temps Réel (Express / Socket.io)
```bash
cd backend-express
npm install
npm run dev
# Le serveur écoute sur http://localhost:3000
```

---

### 3. Lancer le Backend API (Spring Boot)
Assurez-vous que MySQL est démarré, puis :
```bash
cd backend-spring
mvn spring-boot:run
# L'API REST écoute sur http://localhost:8080
```
*Note : Au premier lancement, un administrateur et un client par défaut sont automatiquement injectés en base de données :*
- **Admin** : `admin@mototaxi.tn` / `Admin@123`
- **Client** : `client@mototaxi.tn` / `Client@123`
- **Chauffeur** : `driver@mototaxi.tn` / `Driver@123`

---

### 4. Lancer le Frontend (Angular 17)
```bash
cd frontend
npm install
npm start
# L'application web démarre sur http://localhost:4200
```

---

## 🔐 Comptes de Test Prêts à l'Emploi

Sur la page de connexion, vous pouvez basculer d'un clic entre les 3 profils grâce aux onglets **Client | Chauffeur | Admin** :
- **Client** : `client@mototaxi.tn` | `Client@123`
- **Chauffeur** : `driver@mototaxi.tn` | `Driver@123`
- **Admin** : `admin@mototaxi.tn` | `Admin@123`
