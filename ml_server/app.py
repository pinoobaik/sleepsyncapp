from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
from tensorflow import keras
import os

app = Flask(__name__)
CORS(app)

# ================== STATISTIK SCALER ==================
STATS = {
    "age":      {"mean": 42.18, "std": 8.66},
    "sleep":    {"mean": 7.13,  "std": 0.80},
    "quality":  {"mean": 7.31,  "std": 1.20},
    "physical": {"mean": 59.17, "std": 20.80},
    "stress":   {"mean": 5.39,  "std": 1.77},
    "systolic": {"mean": 128.55, "std": 7.74},
    "diastolic":{"mean": 84.65, "std": 6.15},
    "hr":       {"mean": 70.17, "std": 4.13},
    "steps":    {"mean": 6816.84, "std": 1615.75},
}

def scale(val, key):
    return (val - STATS[key]["mean"]) / (STATS[key]["std"] + 1e-8)

# ================== CUSTOM LAYER & LOSS ==================
# (dekorator dihapus karena tidak diperlukan)
class ResidualBlock(keras.layers.Layer):
    def __init__(self, units, dropout_rate=0.25, **kwargs):
        super().__init__(**kwargs)
        self.units = units
        self.dropout_rate = dropout_rate
        self.dense1 = keras.layers.Dense(units, use_bias=False)
        self.bn1 = keras.layers.BatchNormalization()
        self.act1 = keras.layers.Activation("relu")
        self.drop1 = keras.layers.Dropout(dropout_rate)
        self.dense2 = keras.layers.Dense(units, use_bias=False)
        self.bn2 = keras.layers.BatchNormalization()
        self.act_out = keras.layers.Activation("relu")

    def call(self, x, training=False):
        input_dim = x.shape[-1]
        if input_dim != self.units:
            if input_dim > self.units:
                residual = x[..., :self.units]
            else:
                pad_width = self.units - input_dim
                residual = tf.pad(x, [[0, 0], [0, pad_width]])
        else:
            residual = x
        out = self.dense1(x)
        out = self.bn1(out, training=training)
        out = self.act1(out)
        out = self.drop1(out, training=training)
        out = self.dense2(out)
        out = self.bn2(out, training=training)
        return self.act_out(out + residual)

    def get_config(self):
        config = super().get_config()
        config.update({"units": self.units, "dropout_rate": self.dropout_rate})
        return config

class LabelSmoothingCrossEntropy(keras.losses.Loss):
    def __init__(self, smoothing=0.05, **kwargs):
        super().__init__(**kwargs)
        self.smoothing = smoothing

    def call(self, y_true, y_pred):
        num_classes = tf.cast(tf.shape(y_pred)[-1], y_pred.dtype)
        y_true = tf.cast(y_true, y_pred.dtype)
        smooth_val = self.smoothing / num_classes
        y_smooth = y_true * (1.0 - self.smoothing) + smooth_val
        return tf.reduce_mean(
            -tf.reduce_sum(y_smooth * tf.math.log(y_pred + 1e-7), axis=-1)
        )

    def get_config(self):
        config = super().get_config()
        config.update({"smoothing": self.smoothing})
        return config

# ================== LOAD MODEL ==================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.keras")

if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file tidak ditemukan di {MODEL_PATH}")

print("Memuat model dengan TensorFlow", tf.__version__)
model = keras.models.load_model(
    MODEL_PATH,
    custom_objects={
        "ResidualBlock": ResidualBlock,
        "LabelSmoothingCrossEntropy": LabelSmoothingCrossEntropy,
    },
    compile=True
)
print("Model berhasil dimuat")

LABELS = ["None", "Insomnia", "Sleep Apnea"]

# ================== ENCODING HELPER ==================
def encode_gender(val):
    return 1 if str(val).lower() in ["male", "laki-laki"] else 0

def encode_bmi(val):
    mapping = {
        "normal": 0, "normal weight": 0,
        "overweight": 3, "obese": 2,
        "underweight": 1, "kurus": 1,
        "gemuk": 2, "obesitas": 2,
    }
    return mapping.get(str(val).lower(), 0)

def encode_occupation(val):
    mapping = {
        "accountant": 0, "doctor": 1, "engineer": 2, "lawyer": 3,
        "manager": 4, "nurse": 5, "sales representative": 6,
        "salesperson": 7, "scientist": 8, "software engineer": 9,
        "teacher": 10,
        "mahasiswa": 9, "student": 9, "karyawan": 4,
        "perawat": 5, "guru": 10, "dokter": 1,
    }
    val_lower = str(val).lower()
    for key, code in mapping.items():
        if key in val_lower:
            return code
    return 4

def encode_blood_pressure(val):
    try:
        parts = str(val).split("/")
        return float(parts[0]), float(parts[1])
    except:
        return 128.0, 84.0

def build_features(data):
    sistolik, diastolik = encode_blood_pressure(data.get("blood_pressure", "128/84"))
    features = [
        encode_gender(data.get("gender", "Male")),
        scale(float(data.get("age", 42)), "age"),
        encode_occupation(data.get("occupation", "")),
        scale(float(data.get("sleep_duration", 7)), "sleep"),
        scale(float(data.get("quality_of_sleep", 7)), "quality"),
        scale(float(data.get("physical_activity", 59)), "physical"),
        scale(float(data.get("stress_level", 5)), "stress"),
        encode_bmi(data.get("bmi_category", "Normal")),
        scale(sistolik, "systolic"),
        scale(diastolik, "diastolic"),
        scale(float(data.get("heart_rate", 70)), "hr"),
        scale(float(data.get("daily_steps", 6800)), "steps"),
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0
    ]
    return np.array(features, dtype=np.float32).reshape(1, -1)

# ================== ENDPOINTS ==================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Data tidak ditemukan"}), 400

        features = build_features(data)
        probabilities = model.predict(features, verbose=0)[0]
        predicted_idx = int(np.argmax(probabilities))
        confidence = float(probabilities[predicted_idx]) * 100

        return jsonify({
            "prediction": LABELS[predicted_idx],
            "confidence": round(confidence, 2),
            "probabilities": {
                LABELS[i]: round(float(probabilities[i]) * 100, 2)
                for i in range(len(LABELS))
            },
        })
    except Exception as e:
        print("Error prediksi:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "ML Server SleepSync berjalan ✅"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 7860))
    app.run(host="0.0.0.0", port=port, debug=False)
