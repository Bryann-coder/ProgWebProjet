![alt text](/image/logo.png)

---

## 📋 **Table des Matières**
- [🎯 Aperçu du Projet](#apercu)
- [👥 Équipe](#equipe)
- [🌲 Branches Principales](#branches)
- [🏗 Structure du Projet](#structure)
- [🚀 Installation](#install)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Mensuration](#mensuration)
- [🛠 Technologies Utilisées](#tech)
- [📸 Screenshots](#screenshots)
- [📖 Guide d'Utilisation](#guide)
- [📝 Licence](#licence)

---

<h2 id="apercu">🎯 Aperçu du Projet</h2>

**MyFashion** est une solution innovante qui propose un service de **prise de mesures corporelles automatiques à partir d'images** en utilisant la technologie **MediaPipe Pose Detection**.  
Idéal pour les secteurs de la mode, du fitness et de la santé, ce projet est structuré en trois branches :  
- ⚙️ **Backend** : API FastAPI pour le traitement des images.  
- 🎨 **Frontend** : Une interface utilisateur élégante pour interagir avec les mesures.  
- 📐 **Mensuration** : Modèles d'estimation et logique métier.

---

<h2 id="equipe">👥 Équipe</h2>

| Nom                  | Matricule | Contribution           | Participation (%) |
|----------------------|-----------|------------------------|-------------------|
| **KOUASSI DE YOBO GILBERT BRYAN (CHEF)**     | 21P082    | Management/FrontEnd/BackEnd           | 100%               |
| **MAFFO FONKOU NATACHA**       | 21P272   | Frontend/Mensuration     | 100%               |
| **MBOCK JEAN DANIEL**  | 21P269    | FrontEnd/BackEnd | 100%               |
| **ATABONG STEPHANE**     | 23P781    | FrontEnd  | 80%               |
| **BENGONO AMVELA NATHAN** | 21P091 | FrontEnd/BackEnd | 85% |
| **WOTCHOKO YOHAN** | 21P228 | FrontEnd | 85% |
| **NGOM CHRISTINE** | 21P336 | FrontEnd | 70% |
| **NGHOGUE TAPTUE FRANCK** | 21P279 | FrontEnd | 75% |
| **YIMBOU JUDE** | 21P417 |  FrontEnd | 60% |
| **NOUNDJEU NOUBISSIE FRANCK** | 21P318 | FrontEnd | 70% |


---

<h2 id="branches">🌲 Branches Principales</h2>

| Branche          | Description                            |
|-------------------|----------------------------------------|
| `main`     🟢      | Version finale du projet              |  
| `frontend`     🎨  | Développement de l'interface utilisateur |
| `backend`     ⚙️   | API et traitement des images          |
| `mensuration`  📐  | Logique d'estimation des mesures       |  

---

<h2 id="structure">🏗 Structure du Projet</h2>

```
MyFashion/
├── backend/
│   ├── app/            # Code FastAPI
│   └── requirements.txt
├── frontend/
│   ├── src/            # Composants React
│   └── public/
├── mensuration/
│   ├── models/         # Modèles de calcul des mesures
│   └── scripts/        # Logique de traitement
└── README.md
```

---

<h2 id="install">🚀 Installation</h2>

### 🧠 **Prérequis**
- **Python** 3.8+
- **Node.js** 14+
- **PHP** 7.4+
- **Git** pour cloner le projet  

### ⚙️ **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Sur Windows, utilisez 'venv\Scripts\activate'
pip install -r requirements.txt
python run.py
```

### 🎨 **Frontend Setup**
```bash
cd frontend
npm install
ng serve --port 4200
```

### 📐 **Mensuration**
Aucune installation requise, intégré dans le backend.  

---

<h2 id="tech">🛠 Technologies Utilisées</h2>

| Composant   | Technologie         |
|-------------|---------------------|
| **Backend** | FastAPI, MediaPipe  |
| **Frontend**| React, Material-UI  |
| **Mensuration** | Python, NumPy, Pandas |

---

<h2 id="screenshots">📸 Guide d'utilisation</h2>

## **INSCRIPTION**

![alt text](image/inscription.png)

## **CONNEXION**

![alt text](image/connexion.png)

## **MOT DE PASSE OUBLIE**

![alt text](image/forget.png)

## **REINITIALISATION MOT DE PASSE**

![alt text](image/forget-email.png)

## **ACCUEIL**
![Accueil](/image/Home.jpeg)

##  **PRODUITS**

![alt text](image/produit.jpeg)

### **COLLECTION**

![alt text](image/collection.jpeg)

## **STYLISTES**

![alt text](image/styliste.jpeg)

## **DETAIL STYLISTE**

![alt text](image/detailstyliste.jpeg)


## **PANIER**

![alt text](image/paniervide.png)

## **FORMULAIRE MESURES**

![alt text](image/formulairemesures.png)

## **MODELE DE CALCUL DE MESURES**

![alt text](image/upload.png)

## **TEST**

![alt text](image/mesures.jpeg)

## **DEVENIR STYLISTE**

<video controls src="video/devenirstyliste.mp4" title="Title"></video>

## **MON DASHBOARD**

<video controls src="video/devenirstyliste.mp4" title="Title"></video>

## **MES COMMANDES**

![alt text](image/commandes.png)

## **UPDATE DASHBOARD**

<video controls src="video/updateDashboard.mp4" title="Title"></video>

## **NEW STYLIST !!**

![alt text](image/newstylist.png)

## **DETAIL NEW STYLIST**

![alt text](image/detailnewstyliste.png)

## **REVIEW**

<video controls src="video/review.mp4" title="Title"></video>

## **FROM PANIER AU PAIEMENT**

<video controls src="video/panier-paiement.mp4" title="Title"></video>

## **PAIEMENT AVEC VOS IDENTIFIANTS**

![alt text](image/paiement.png)

## **PAIEMENT REUSSI**

![alt text](image/paiement-reussi.png)

## **DEMANDE DE CONFIRMATION SUR VOTRE APPAREIL**

![alt text](image/paiement-tel.png.jpg)


## **CALENDRIER DE RESERVATION**

![alt text](image/calendrier.png)

## **DEMANDE DE RESERVATION**

![alt text](image/reservation.png)

## **CONFIRMATION DE RESERVATION**

![alt text](image/confirmation-reservation.png)

## **DESINCRIPTION DU ROLE DE STYLISTE**

<video controls src="video/desinscription.mp4" title="Title"></video>



---

<h2 id="guide">📖 Guide de lancement</h2>

1. Démarrez le backend :  
   ```bash
   cd backend
   python run.py  # Port 8001
   ```  

2. Lancez le frontend :  
   ```bash
   cd frontend
   ng serve --port 4200
   ```  

3. Ouvrez votre navigateur à [http://localhost:4200](http://localhost:4200).

4. Profitez de **MyFashion** pour estimer vos mensurations !

---

<h2 id="licence">📝 Licence</h2>
Ce projet est sous licence **ENSPY**. Consultez le fichier [LICENSE](LICENSE) pour plus d'informations.

---

**✨ Développé avec ❤️ par l'équipe MyFashion © 2025 ✨** 