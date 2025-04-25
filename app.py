from flask import Flask, request, jsonify
import os
from model_utils import load_models_and_vectorizer, ensemble_predict

app = Flask(__name__)

MODEL_DIR = './results/cat/'
MODEL_PATH = './results/cat/CatBoost.pkl'
TFIDF_VECTORIZER, MODEL = load_models_and_vectorizer(MODEL_DIR, MODEL_PATH)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "")

    if not text.strip():
        return jsonify({"error": "No input text provided"}), 400

    label, score = ensemble_predict(text, TFIDF_VECTORIZER, MODEL)
    return jsonify({
        "label": "AI" if label == 1 else "Human",
        "confidence": round(score, 4)
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
