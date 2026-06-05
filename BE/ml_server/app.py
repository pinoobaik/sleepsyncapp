from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import keras
import os

app = Flask(__name__)
CORS(app)

# Statistik dataset untuk StandardScaler 
STATS = {
    "age":      {"mean": 42.18, "std": 8.66},
    "sleep":    {"mean": 7.13,  "std": 0.80},
    "quality":  {"mean": 7.31,  "std": 1.20},
    "physical": {"mean": 59.17, "std": 20.80},
    "stress":   {"mean": 5.39,  "std": 1.77},
    "systolic": {"mean": 128.55,"std": 7.74},
    "diastolic":{"mean": 84.65, "std": 6.15},
    "hr":       {"mean": 70.17, "std": 4.13},
    "steps":    {"mean": 6816.84,"std": 1615.75},
}

def scale(val, key):
    return (val - STATS[key]["mean"]) / (STATS[key]["std"] + 1e-8)

# Custom layer ResidualBlock 
@keras.saving.register_keras_serializable()
class ResidualBlock(keras.layers.Layer):
    def __init__(self, units, dropout_rate=0.25, **kwargs):
        super().__init__(**kwargs)
        self.units        = units
        self.dropout_rate = dropout_rate
        self.dense1       = keras.layers.Dense(units, use_bias=False)
        self.bn1          = keras.layers.BatchNormalization()
        self.act1         = keras.layers.Activation("relu")
        self.drop1        = keras.layers.Dropout(dropout_rate)
        self.dense2       = keras.layers.Dense(units, use_bias=False)
        self.bn2          = keras.layers.BatchNormalization()
        self.act_out      = keras.layers.Activation("relu")

    def call(self, x, training=False):
        input_dim = x.shape[-1]
        if input_dim != self.units:
            residual = x[..., :self.units] if input_dim > self.units else keras.ops.pad(
                x, [[0, 0], [0, self.units - input_dim]]
            )
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

# Custom loss 
@keras.saving.register_keras_serializable()
class LabelSmoothingCrossEntropy(keras.losses.Loss):
    def __init__(self, smoothing=0.05, **kwargs):
        super().__init__(**kwargs)
        self.smoothing = smoothing

    def call(self, y_true, y_pred):
        num_classes = keras.ops.cast(keras.ops.shape(y_pred)[-1], y_pred.dtype)
        y_true      = keras.ops.cast(y_true, y_pred.dtype)
        smooth_val  = self.smoothing / num_classes
        y_smooth    = y_true * (1.0 - self.smoothing) + smooth_val
        return keras.ops.mean(
            -keras.ops.sum(y_smooth * keras.ops.log(y_pred + 1e-7), axis=-1)
        )

    def get_config(self):
        config = super().get_config()
        config.update({"smoothing": self.smoothing})
        return config

# Load model 
BASE_DIR  = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "model")

print("Memuat model...")
model = keras.saving.load_model(
    MODEL_DIR,
    custom_objects={
        "ResidualBlock":              ResidualBlock,
        "LabelSmoothingCrossEntropy": LabelSmoothingCrossEntropy,
    },
    compile=False
)
print("Model berhasil dimuat!")

LABELS = ["None", "Insomnia", "Sleep Apnea"]

# Encoding helper 
def encode_gender(val):
    # Female=0, Male=1 (LabelEncoder alfabetis)
    return 1 if str(val).lower() in ["male", "laki-laki"] else 0

def encode_bmi(val):
    # LabelEncoder alfabetis: Normal=0, Normal Weight=1, Obese=2, Overweight=3
    mapping = {
        "normal": 0, "normal weight": 0,
        "overweight": 3, "obese": 2,
        "underweight": 1, "kurus": 1,
        "gemuk": 2, "obesitas": 2,
    }
    return mapping.get(str(val).lower(), 0)

def encode_occupation(val):
    # LabelEncoder alfabetis dari dataset
    mapping = {
        "accountant": 0, "doctor": 1, "engineer": 2, "lawyer": 3,
        "manager": 4, "nurse": 5, "sales representative": 6,
        "salesperson": 7, "scientist": 8, "software engineer": 9,
        "teacher": 10,
        # mapping tambahan untuk pilihan Indonesia
        "mahasiswa": 9, "student": 9, "karyawan": 4,
        "perawat": 5, "guru": 10, "dokter": 1,
    }
    val_lower = str(val).lower()
    for key, code in mapping.items():
        if key in val_lower:
            return code
    return 4  # default: Manager (tengah)

def encode_blood_pressure(val):
    try:
        parts = str(val).split("/")
        return float(parts[0]), float(parts[1])
    except:
        return 128.0, 84.0  # gunakan mean dataset sebagai default

def build_features(data):
    sistolik, diastolik = encode_blood_pressure(data.get("blood_pressure", "128/84"))

    features = [
        encode_gender(data.get("gender", "Male")),           # 1 — binary, tidak di-scale
        scale(float(data.get("age", 42)), "age"),             # 2
        encode_occupation(data.get("occupation", "")),        # 3 — label encoded, tidak di-scale
        scale(float(data.get("sleep_duration", 7)), "sleep"), # 4
        scale(float(data.get("quality_of_sleep", 7)), "quality"), # 5
        scale(float(data.get("physical_activity", 59)), "physical"), # 6
        scale(float(data.get("stress_level", 5)), "stress"),  # 7
        encode_bmi(data.get("bmi_category", "Normal")),       # 8 — label encoded, tidak di-scale
        scale(sistolik, "systolic"),                          # 9
        scale(diastolik, "diastolic"),                        # 10
        scale(float(data.get("heart_rate", 70)), "hr"),       # 11
        scale(float(data.get("daily_steps", 6800)), "steps"), # 12
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0                   # 13-19 padding
    ]

    return np.array(features, dtype=np.float32).reshape(1, -1)

# Endpoint prediksi 
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Data tidak ditemukan"}), 400

        features      = build_features(data)
        probabilities = model.predict(features, verbose=0)[0]
        predicted_idx = int(np.argmax(probabilities))
        confidence    = float(probabilities[predicted_idx]) * 100

        return jsonify({
            "prediction":    LABELS[predicted_idx],
            "confidence":    round(confidence, 2),
            "probabilities": {
                LABELS[i]: round(float(probabilities[i]) * 100, 2)
                for i in range(len(LABELS))
            },
        })
    except Exception as e:
        print("Error prediksi:", str(e))
        return jsonify({"error": str(e)}), 500

# Health check 
@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "ML Server SleepSync berjalan ✅"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=False)