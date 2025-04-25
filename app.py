from flask import Flask, request, jsonify, render_template
import os
from model_utils import load_models_and_vectorizer, ensemble_predict

app = Flask(__name__, static_folder='static', template_folder='templates')

MODEL_DIR = './results/cat/'
MODEL_PATH = './results/cat/CatBoost.pkl'
TFIDF_VECTORIZER, MODEL = load_models_and_vectorizer(MODEL_DIR, MODEL_PATH)

@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    text = data.get("text", "")

    if not text.strip():
        return jsonify({"error": "No input text provided"}), 400

    label, score = ensemble_predict(text, TFIDF_VECTORIZER, MODEL)
    return jsonify({
        "ai_generated": score * 100,
        "ai_refined": 0.0,
        "human_refined": 0.0,
        "human_written": (1 - score) * 100
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
