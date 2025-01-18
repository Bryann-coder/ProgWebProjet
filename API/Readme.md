<img src="https://cdn.worldvectorlogo.com/logos/python-5.svg" alt="Python Logo" width="200" >


# **Body Measurements API**  
Une API innovante qui calcule automatiquement les mesures corporelles à partir d'images grâce à **MediaPipe** pour la détection des poses. 🧍‍♂️📏  

---

## ✨ **Fonctionnalités**  
L'API analyse des images pour fournir des mesures corporelles précises :  
- **Tour de poitrine**  
- **Tour de taille**  
- **Tour de hanches**  
- **Longueur du torse**  
- **Tour de cuisse**  
- **Largeur des épaules**  
- **Mesures des bras** (biceps, avant-bras)  
- **Mesures des jambes** (entrejambe, mollets)  

---

## 🌐 **Prérequis**  
Pour utiliser cette API, vous aurez besoin de :  
1️⃣ **Python** version 3.8 ou supérieure 🐍  
2️⃣ Le gestionnaire de paquets **pip** ✅  

---

## 🚀 **Installation**  
Suivez ces étapes pour configurer le projet :  

### 1️⃣ **Cloner le dépôt**  
```bash  
git clone <repository-url>  
cd <repository-folder>  
```  

### 2️⃣ **Installer les dépendances**  
```bash  
pip install -r requirements.txt  
```  

---

## 🏃 **Démarrage de l'API**  

1️⃣ **Lancer le serveur FastAPI** :  
```bash  
python run.py  
```  

2️⃣ Accédez à l'API aux adresses suivantes :  
- **Local** : [http://127.0.0.1:8001](http://127.0.0.1:8001)  
- **Documentation Swagger** : [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs)  
- **Documentation Redoc** : [http://127.0.0.1:8001/redoc](http://127.0.0.1:8001/redoc)  

---

## 📂 **Architecture du projet**  

```
📦 BodyMeasurementsAPI  
 ┣ 📂 app  
 ┃ ┗ 📜 main.py       # Contient les routes et la logique principale de l'API  
 ┣ 📜 run.py           # Lance le serveur FastAPI  
 ┣ 📜 requirements.txt # Liste des dépendances Python  
 ┗ 📜 README.md        # Documentation  
```  

---

## 🧑‍💻 **Utilisation de l'API**  

### Endpoints disponibles 📡  
#### **GET /**  
➡️ Retourne un message d'accueil.  

Exemple :  
```bash  
curl http://127.0.0.1:8001/  
```  

#### **POST /measurements/**  
➡️ Permet de télécharger une image pour obtenir les mesures corporelles calculées.  

**Requête :**  
- Type : `multipart/form-data`  
- Fichier : Image au format JPEG ou PNG  

**Réponse :**  
Retourne un objet JSON contenant les mesures.  

Exemple :  
```bash  
curl -X POST -F "file=@example_image.jpg" http://127.0.0.1:8001/measurements/  
```  

---

## 🛠️ **Exemple de code**  

### `app/main.py`  
Voici le code principal :  

```python  
from fastapi import FastAPI, File, UploadFile  
from fastapi.responses import JSONResponse  
import mediapipe as mp  
from PIL import Image  
import io  

app = FastAPI()  

@app.get("/")  
async def welcome():  
    return {"message": "Bienvenue sur l'API Body Measurements !"}  

@app.post("/measurements/")  
async def get_measurements(file: UploadFile = File(...)):  
    try:  
        # Charger l'image  
        image = Image.open(io.BytesIO(await file.read()))  

        # Analyser avec MediaPipe (exemple simplifié)  
        mp_pose = mp.solutions.pose  
        pose = mp_pose.Pose()  
        # Simule le traitement  
        results = pose.process(image)  

        # Retourner des mesures fictives  
        measurements = {  
            "chest": "90 cm",  
            "waist": "75 cm",  
            "hips": "100 cm",  
            "shoulders": "45 cm"  
        }  
        return JSONResponse(content={"measurements": measurements})  

    except Exception as e:  
        return JSONResponse(content={"error": str(e)}, status_code=500)  
```  

---

### `run.py`  
Fichier pour lancer le serveur :  

```python  
import uvicorn  

if __name__ == "__main__":  
    uvicorn.run("app.main:app", host="127.0.0.1", port=8001, reload=True)  
```  

---

## 📝 **Ressources supplémentaires**  
- [FastAPI Documentation](https://fastapi.tiangolo.com) 📘  
- [MediaPipe Guide](https://google.github.io/mediapipe/solutions/pose.html) 🖼️  
- [Python PIL Documentation](https://pillow.readthedocs.io) 🎨  
