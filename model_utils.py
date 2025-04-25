import os
import joblib
import nltk
nltk.download('punkt_tab', quiet=True)

THRESHOLD = 0.5

def load_models_and_vectorizer(model_dir, model_path):
    tfidf_path = os.path.join(model_dir, 'tfidf_vectorizer.pkl')
    tfidf_vectorizer = joblib.load(tfidf_path)
    model = joblib.load(model_path)
    return tfidf_vectorizer, model

def ensemble_predict(user_text, tfidf_vectorizer, model, threshold=THRESHOLD):
    sentences = nltk.tokenize.sent_tokenize(user_text)
    if not sentences:
        return "No valid sentence.", 0.0
    X_tfidf = tfidf_vectorizer.transform(sentences)
    probs = model.predict_proba(X_tfidf)
    avg_prob_ai = probs[:, 1].mean()
    if avg_prob_ai >= threshold:
        return 1, avg_prob_ai
    else:
        return 0, 1 - avg_prob_ai
