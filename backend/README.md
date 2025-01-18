<img src="https://laravel.com/img/logomark.min.svg" alt="Laravel Logo" width="200" height="200">


**Généré avec [Laravel](https://laravel.com/) 10.x** 🌟

---

## 📂 **Architecture du projet**

Voici un aperçu de la structure du projet Laravel et des dossiers clés :

```
📂 app
 ┣ 📂 Console            # Commandes artisan personnalisées
 ┣ 📂 DTOs               # Objets de transfert de données
 ┣ 📂 Http
 ┃ ┣ 📂 Controllers       # Contrôleurs (API et Web)
 ┃ ┣ 📂 Requests          # Requêtes validées
 ┃ ┗ 📂 Resources         # Transformateurs de données
 ┣ 📂 Mail               # Classes pour la gestion des emails
 ┣ 📂 Models             # Modèles Eloquent
 ┣ 📂 Notifications      # Notifications système
 ┗ 📂 Providers          # Fournisseurs de services
📂 database
 ┣ 📂 migrations          # Scripts de création de tables
 ┣ 📂 seeders             # Scripts de remplissage de base
 ┗ database.sqlite        # Base de données SQLite (optionnelle)
📂 routes
 ┣ api.php               # Routes pour l'API RESTful
 ┣ web.php               # Routes pour l'interface web
📂 public                # Fichiers accessibles publiquement
📂 resources             # Vues, fichiers Blade et assets
📂 tests                 # Tests unitaires et fonctionnels
.env                    # Fichier de configuration des environnements
composer.json           # Dépendances du projet
```

---

## 🚀 **Guide de démarrage rapide**

### 1️⃣ **Prérequis**
Assurez-vous d'avoir installé les outils suivants :
- [PHP](https://www.php.net/) (version 8.1 ou supérieure) 🐘  
- [Composer](https://getcomposer.org/) pour la gestion des dépendances 📦  
- Une base de données MySQL/PostgreSQL/SQLite configurée 🗄️

### 2️⃣ **Installation**
Clonez ce dépôt et installez les dépendances :
```bash
git clone https://github.com/mon-utilisateur/mon-projet-laravel.git
cd mon-projet-laravel
composer install
```

Copiez le fichier `.env.example` et configurez vos paramètres d'environnement :
```bash
cp .env.example .env
```

Générez la clé d'application Laravel :
```bash
php artisan key:generate
```

### 3️⃣ **Configuration de la base de données**
- Assurez-vous que votre base de données est prête.  
- Exécutez les migrations pour créer les tables :
  ```bash
  php artisan migrate
  ```
- Remplissez la base de données avec les données initiales :
  ```bash
  php artisan db:seed
  ```

### 4️⃣ **Lancement du serveur**
Démarrez le serveur Laravel local :
```bash
php artisan serve
```

Visitez : `http://localhost:8000` 🌐

---

## 📧 **Gestion des emails**
Ce projet utilise **Gmail** pour l'envoi des emails. Configurez vos identifiants Gmail dans le fichier `.env` :
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=votre_email@gmail.com
MAIL_PASSWORD=votre_mot_de_passe
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=votre_email@gmail.com
MAIL_FROM_NAME="${APP_NAME}"
```

---

## 💳 **Paiements avec CAMPAY**
Nous avons intégré l'API de paiement [Campay](https://campay.net/) pour les transactions en ligne. Configurez vos clés d'API dans le fichier `.env` :
```env
CAMPAY_API_KEY=your_api_key
CAMPAY_SECRET_KEY=your_secret_key
```

---

## 🔐 **Authentification JWT**
Ce projet utilise **JSON Web Tokens (JWT)** pour sécuriser les API. Installez le package JWT et publiez sa configuration :
```bash
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret
```

Les endpoints nécessitant une authentification JWT sont protégés par des middlewares.

---

## 🛠️ **Commandes utiles**

### 🧪 **Tests unitaires**
Pour exécuter les tests unitaires, lancez :
```bash
php artisan test
```

### ⚙️ **Cache**
Si vous modifiez la configuration ou les routes, effacez et recréez le cache :
```bash
php artisan config:cache
php artisan route:cache
```

---

## 🔍 **Bonnes pratiques Laravel**
1. Organisez vos **contrôleurs** pour respecter le principe "Single Responsibility".
2. Utilisez les **DTOs** pour transférer des données entre les couches.  
3. Employez les **Requests** pour valider les données des utilisateurs.  
4. Utilisez les **Resource Classes** pour transformer vos réponses API.  
5. Testez votre code régulièrement avec des tests unitaires et fonctionnels. ✅

---

## 📖 **Ressources supplémentaires**

- [Documentation officielle Laravel](https://laravel.com/docs) 📘  
- [Tutoriel Laravel pour débutants](https://laracasts.com/) 🎥  
- [JWT Auth Documentation](https://jwt-auth.readthedocs.io/) 🔐  
- [Campay API](https://campay.net/) 💳

