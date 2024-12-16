from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.resnet_v2 import preprocess_input
import numpy as np
import cv2
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model('best_model.keras')

SKIN_CONDITION_DESCRIPTIONS = {
    "MEL": {
        "name": "Melanoma",
        "description": "A serious type of skin cancer that develops in the melanocytes (pigment-producing cells). It can spread quickly to other parts of the body if not detected early. Characterized by asymmetrical, irregularly bordered, multi-colored moles that may change in size or shape.",
        "risk_factors": ["Sun exposure", "History of sunburns", "Fair skin", "Family history", "Many moles"],
        "recommended_action": "Immediate medical consultation and potential biopsy"
    },
    "NV": {
        "name": "Nevus (Mole)",
        "description": "A common, usually benign skin growth that appears as a small, pigmented spot. Most moles are harmless, but some can develop into melanoma.",
        "risk_factors": ["Genetic factors", "Sun exposure"],
        "recommended_action": "Regular skin checks, monitor for changes"
    },
    "BCC": {
        "name": "Basal Cell Carcinoma",
        "description": "The most common type of skin cancer, typically developing in areas exposed to sun. Appears as a flesh-colored, pearl-like bump or pinkish patch of skin.",
        "risk_factors": ["Sun exposure", "Fair skin", "Age", "Radiation exposure"],
        "recommended_action": "Dermatologist evaluation and potential removal"
    },
    "AKIEC": {
        "name": "Actinic Keratosis",
        "description": "A rough, scaly patch on the skin caused by damage from sun exposure. It's considered a precancerous condition that can develop into skin cancer.",
        "risk_factors": ["Chronic sun exposure", "Fair skin", "Age over 40"],
        "recommended_action": "Medical assessment and potential treatment"
    },
    "BKL": {
        "name": "Benign Keratosis",
        "description": "A common, usually harmless skin growth that appears as a waxy or rough bump. Can vary in appearance and size.",
        "risk_factors": ["Age", "Sun exposure"],
        "recommended_action": "Monitor and consult if changes occur"
    },
    "DF": {
        "name": "Dermatofibroma",
        "description": "A common, benign skin tumor that appears as a small, firm bump, often brown or reddish-brown.",
        "risk_factors": ["Minor skin injuries", "Insect bites"],
        "recommended_action": "Usually no treatment needed, but consult if concerned"
    },
    "VASC": {
        "name": "Vascular Lesion",
        "description": "An abnormal buildup of blood vessels in the skin, which can appear as red or purple marks.",
        "risk_factors": ["Genetic factors", "Hormonal changes"],
        "recommended_action": "Medical evaluation for proper diagnosis"
    }
}

def convert_np_types(obj):
    if isinstance(obj, np.float32):
        return float(obj)
    return obj

@app.post("/predict")
async def predict_skin_condition(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    img_resized = cv2.resize(img, (224, 224))
    img_preprocessed = preprocess_input(img_resized.astype(np.float32))
    
    img_array = np.expand_dims(img_preprocessed, axis=0)
    
    predictions = model.predict(img_array)
    predicted_class_index = np.argmax(predictions)
    
    label_mapping = {
        0: "AKIEC", 1: "BCC", 2: "BKL", 
        3: "DF", 4: "MEL", 5: "NV", 6: "VASC"
    }
    
    predicted_label = label_mapping[predicted_class_index]
    confidence = predictions[0][predicted_class_index] * 100
    
    return {
        "prediction": predicted_label,
        # "confidence": confidence,
        "details": SKIN_CONDITION_DESCRIPTIONS[predicted_label]
    }

@app.get("/")
async def home():
    return {"message": "Welcome to the Skin Cancer Detection API! Use the /predict endpoint to predict skin conditions."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)