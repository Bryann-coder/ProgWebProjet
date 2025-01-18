from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mediapipe as mp
from PIL import Image
import numpy as np
import cv2
import io

class Measurements(BaseModel):
    tour_de_la_poitrine: int
    tour_de_taille: int
    tour_de_bassin: int
    longueur_du_buste: int
    tour_de_la_cuisse: int
    tour_du_mollet: int
    longueur_entre_jambes: int
    largeur_epaule: int
    tour_de_cou: int
    tour_de_bras: int
    tour_avant_bras: int
    longueur_du_bras: int
    tour_de_poignet: int

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permet toutes les origines
    allow_credentials=True,
    allow_methods=["*"],  # Permet toutes les méthodes
    allow_headers=["*"],  # Permet tous les headers
)

# Initialisation de MediaPipe
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=True, min_detection_confidence=0.5)

def calculate_distance(point1, point2):
    """Calcule la distance euclidienne entre deux points"""
    return np.sqrt(((point1.x - point2.x) ** 2) + ((point1.y - point2.y) ** 2))

def estimate_circumference(width_cm, depth_ratio=0.75):
    """
    Estime la circonférence en utilisant une approximation elliptique
    width_cm: largeur mesurée en cm
    depth_ratio: ratio profondeur/largeur (par défaut 0.75)
    """
    depth = width_cm * depth_ratio
    return int(2 * np.pi * np.sqrt((width_cm**2 + depth**2) / 8))

def process_image(image_data: bytes) -> Measurements:
    """
    Traite l'image avec MediaPipe et calcule les mensurations
    """
    try:
        # Convertir les bytes en image OpenCV
        nparr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        height, width = image.shape[:2]
        
        # Conversion en RGB pour MediaPipe
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        results = pose.process(image_rgb)
        
        if not results.pose_landmarks:
            raise HTTPException(status_code=400, detail="Impossible de détecter la pose dans l'image")

        landmarks = results.pose_landmarks.landmark

        # Calcul du facteur d'échelle en utilisant la hauteur réelle estimée
        # et la distance entre les épaules comme référence
        REFERENCE_SHOULDER_WIDTH = 45  # Largeur d'épaule moyenne en cm
        shoulder_width_pixels = calculate_distance(
            landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER],
            landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
        ) * width

        pixel_to_cm = REFERENCE_SHOULDER_WIDTH / shoulder_width_pixels

        # Largeur des épaules
        shoulder_width_cm = REFERENCE_SHOULDER_WIDTH  # On utilise notre référence

        # Longueur du bras
        arm_length = (calculate_distance(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER],
                                      landmarks[mp_pose.PoseLandmark.LEFT_ELBOW]) + \
                    calculate_distance(landmarks[mp_pose.PoseLandmark.LEFT_ELBOW],
                                    landmarks[mp_pose.PoseLandmark.LEFT_WRIST])) * width * pixel_to_cm
        arm_length_cm = int(arm_length)

        # Tour de poitrine (basé sur la distance entre les épaules)
        chest_width_cm = shoulder_width_cm * 0.95
        chest_circumference = estimate_circumference(chest_width_cm, 0.8)

        # Tour de taille
        waist_width = calculate_distance(landmarks[mp_pose.PoseLandmark.LEFT_HIP],
                                       landmarks[mp_pose.PoseLandmark.RIGHT_HIP]) * width * pixel_to_cm
        waist_circumference = estimate_circumference(waist_width, 0.85)

        # Tour de bassin (légèrement plus large que la taille)
        hip_width = waist_width * 1.2
        hip_circumference = estimate_circumference(hip_width, 0.9)

        # Longueur du buste
        torso_length = calculate_distance(landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER],
                                        landmarks[mp_pose.PoseLandmark.LEFT_HIP]) * height * pixel_to_cm
        torso_length_cm = int(torso_length)

        # Longueur entre-jambes
        inseam_length = calculate_distance(landmarks[mp_pose.PoseLandmark.LEFT_HIP],
                                         landmarks[mp_pose.PoseLandmark.LEFT_ANKLE]) * height * pixel_to_cm
        inseam_length_cm = int(inseam_length)

        # Tour de cuisse
        thigh_width = calculate_distance(landmarks[mp_pose.PoseLandmark.LEFT_HIP],
                                       landmarks[mp_pose.PoseLandmark.LEFT_KNEE]) * width * pixel_to_cm * 0.4
        thigh_circumference = estimate_circumference(thigh_width, 0.95)

        # Calcul des autres mesures
        return Measurements(
            tour_de_la_poitrine=chest_circumference,
            tour_de_taille=waist_circumference,
            tour_de_bassin=hip_circumference,
            longueur_du_buste=torso_length_cm,
            tour_de_la_cuisse=thigh_circumference,
            tour_du_mollet=int(thigh_circumference * 0.7),
            longueur_entre_jambes=inseam_length_cm,
            largeur_epaule=int(shoulder_width_cm),
            tour_de_cou=int(chest_circumference * 0.4),
            tour_de_bras=int(chest_circumference * 0.3),
            tour_avant_bras=int(chest_circumference * 0.25),
            longueur_du_bras=arm_length_cm,
            tour_de_poignet=17  # Valeur moyenne fixe car difficile à estimer précisément
        )

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erreur lors du traitement de l'image: {str(e)}")

@app.post("/measurements/", response_model=Measurements)
async def get_measurements(image: UploadFile = File(...)):
    """
    Endpoint qui reçoit une image et renvoie les mensurations
    """
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Le fichier doit être une image")
    
    contents = await image.read()
    measurements = process_image(contents)
    return measurements

@app.get("/")
async def root():
    return {"message": "API de mesures corporelles v1.0"}