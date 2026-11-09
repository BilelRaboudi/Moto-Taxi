# MotoTaxi TN — Plateforme de Transport Rapide & Économique (Grand Tunis)

Projet Fullstack de réservation de mototaxis pour le Grand Tunis avec architecture **100% Spring Boot pure**, Frontend Angular responsive (Web & Mobile), et application Android native.

---

## 🏛️ Architecture Technique Simplifiée

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTS                              │
│  • Web Desktop / Tablette (Navigateur)                  │
│  • Mobile Web Responsive                                │
│  • Application Android Native (Infinix / Tout Android)   │
└──────────────┬────────────────────────────┬─────────────┘
               │ HTTP REST                  │ WebSocket (ws://)
               ▼                            ▼
┌─────────────────────────────────────────────────────────┐
│          BACKEND UNIQUE : SPRING BOOT 3 (Port 8080)     │
│  • Spring Data JPA & Transactions MySQL                 │
│  • Spring Security 6 & JWT Authentication               │
│  • Spring WebSocket (Realtime GPS, Dispatch, SOS)       │
│  • Haversine Dynamic Pricing & Geolocation Engine       │
└──────────────────────────┬──────────────────────────────┘
                           │ JDBC (Port 3306)
                           ▼
┌─────────────────────────────────────────────────────────┐
│             BASE DE DONNÉES : MYSQL (XAMPP)             │
│  • Tables : users, drivers, rides, tariffs, payments    │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Structure du Projet

```
projet integration/
├── backend-spring/       # Backend UNIQUE 100% Spring Boot (Port 8080)
│   ├── src/main/java/    # REST Controllers, WebSocket, Services, Repositories, JPA Entities
│   ├── pom.xml           # Dépendances Maven (Java 17, Spring Boot 3.2.5)
│   └── run.bat           # Lancement direct du backend
│
├── frontend/             # Frontend Angular 17 Responsive (Port 4200)
│   ├── src/app/          # Features : Client, Chauffeur, Admin, Auth
│   ├── tailwind.config.js# Design system Tailwind local
│   └── package.json      # Scripts & dépendances Angular
│
├── android-app/          # Application Android Studio (Gradle 8.4 / Java 17)
│   └── app/              # WebView responsive avec géolocalisation & pont USB
│
├── scripts/              # Scripts d'automatisation PowerShell
│   ├── start.ps1         # Démarrage ordonné (MySQL -> Spring Boot -> Angular)
│   └── stop.ps1          # Arrêt propre des processus
│
├── start_all.bat         # 🚀 Double-clic pour tout démarrer
└── stop_all.bat          # 🛑 Double-clic pour tout arrêter
```

---

## 🚀 Démarrage Rapide

1. Démarrez **MySQL** dans **XAMPP Control Panel** (port `3306`).
2. Double-cliquez sur `start_all.bat`.
3. Accédez à :
   * **Web & Mobile** : `http://localhost:4200`
   * **API Spring Boot** : `http://localhost:8080/api/tariffs`
   * **WebSocket Temps Réel** : `ws://localhost:8080/ws/realtime`

---

## 🔑 Comptes de Démonstration

| Rôle | Email | Mot de passe | Accès |
| :--- | :--- | :--- | :--- |
| **Client** | `client@mototaxi.tn` | `Client@123` | Commande de course & Suivi direct |
| **Chauffeur** | `driver@mototaxi.tn` | `Driver@123` | Dashboard & Acceptation de courses |
| **Admin** | `admin@mototaxi.tn` | `Admin@123` | Supervision, Chauffeurs & Tarifs |
