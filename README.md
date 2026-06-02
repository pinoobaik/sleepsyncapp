# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# 💤 SleepSync
SleepSync adalah aplikasi berbasis Machine Learning yang membantu pengguna menganalisis kualitas tidur berdasarkan data yang dimasukkan pengguna. Sistem terdiri dari frontend React, backend Express.js, database MySQL, dan server Machine Learning berbasis Flask.


## Fitur Utama
- Authentication
- Manajemen Profil Pengguna
- Dashboard Statistik Tidur
- Analisis Kualitas Tidur Menggunakan Machine Learning
- Riwayat Analisis Tidur
- Rekomendasi Perbaikan Pola Tidur

## Teknologi yang Digunakan
### Frontend
- React.js
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- MySQL
- Nodemailer

### Machine Learning
- Python
- Flask
- Scikit-Learn
- Pandas
- NumPy

## Instalasi
### 1. Clone Repository
```bash
git clone https://github.com/username/SleepSync.git
cd SleepSync
```

### 2. Install Frontend
```bash
npm install
```

### 3. Install Backend
```bash
cd server
npm install
```

### 4. Install ML Server
```bash
cd ml_server
pip install -r requirements.txt
```

## Konfigurasi Environment
Buat file `.env` pada folder backend.

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sleepsync

JWT_SECRET=your_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Menjalankan Project
### Frontend
```bash
npm run dev
```

### Backend
```bash
cd server
npm start
```

### Machine Learning Server
```bash
cd ml_server
python app.py
```

## 🌐 Endpoint API
### Authentication
| Method | Endpoint | Deskripsi |
|----------|----------|----------|
| POST | /api/register | Registrasi pengguna |
| POST | /api/login | Login pengguna |
| POST | /api/forgot-password | Reset password |

### Profile
| Method | Endpoint |
|----------|----------|
| GET | /api/profile |
| PUT | /api/profile |

### Sleep Analysis
| Method | Endpoint |
|----------|----------|
| POST | /api/sleep-analysis |
| GET | /api/sleep-history |

## 🤖 Machine Learning
Model Machine Learning digunakan untuk memprediksi kualitas tidur berdasarkan parameter pengguna seperti:

- Durasi Tidur
- Aktivitas Fisik
- Tingkat Stress
- Detak Jantung
- Langkah Harian

### Algoritma
- Random Forest Classifier

### Dataset
- Sleep Health and Lifestyle Dataset

Project ini dibuat untuk kebutuhan Capstone Project dan pembelajaran.