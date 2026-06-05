FROM python:3.12-slim

WORKDIR /app

# Install system dependencies (jika diperlukan untuk TensorFlow)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements dan install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy semua kode
COPY . .

# Expose port (opsional)
EXPOSE 7860

# Jalankan app
CMD ["python", "app.py"]
