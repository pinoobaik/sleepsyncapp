from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import keras
import os

app = Flask(__name__)
CORS(app)

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
    return 1 if str(val).lower() in ["male", "laki-laki"] else 0

def encode_bmi(val):
    mapping = {"normal": 0, "overweight": 1, "obese": 2, "underweight": 3}
    return mapping.get(str(val).lower(), 0)

def encode_sleep_disorder(val):
    mapping = {"none": 0, "insomnia": 1, "sleep apnea": 2}
    return mapping.get(str(val).lower(), 0)

def encode_blood_pressure(val):
    try:
        parts = str(val).split("/")
        return float(parts[0]), float(parts[1])
    except:
        return 120.0, 80.0

def encode_occupation(val):
    occupations = [
        "accountant", "doctor", "engineer", "lawyer", "manager",
        "nurse", "salesperson", "scientist", "software engineer",
        "teacher", "student", "mahasiswa", "karyawan", "other"
    ]
    val_lower = str(val).lower()
    for i, occ in enumerate(occupations):
        if occ in val_lower:
            return i
    return len(occupations)

def build_features(data):
    sistolik, diastolik = encode_blood_pressure(data.get("blood_pressure", "120/80"))
    features = [
        encode_gender(data.get("gender", "Male")),
        float(data.get("age", 30)),
        encode_occupation(data.get("occupation", "")),
        float(data.get("sleep_duration", 7)),
        float(data.get("quality_of_sleep", 7)),
        float(data.get("physical_activity", 30)),
        float(data.get("stress_level", 5)),
        encode_bmi(data.get("bmi_category", "Normal")),
        sistolik,
        diastolik,
        float(data.get("heart_rate", 70)),
        float(data.get("daily_steps", 7000)),
        encode_sleep_disorder(data.get("sleep_disorder", "None")),
        0.0, 0.0, 0.0, 0.0, 0.0, 0.0,
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